import Payslip from "../models/Payslip.js";
import { ESEWA_CONFIG, generateEsewaSignature, verifyEsewaResponse } from "../config/esewa.js";

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
const SERVER_URL = process.env.SERVER_URL || "http://localhost:4000";

// Start an eSewa payment for a payslip
// POST /api/payments/esewa/initiate/:payslipId
export const initiateEsewaPayment = async (req, res) => {
  try {
    const payslip = await Payslip.findById(req.params.payslipId);
    if (!payslip) return res.status(404).json({ error: "Payslip not found" });
    if (payslip.paymentStatus === "PAID") {
      return res.status(400).json({ error: "This payslip is already paid" });
    }

    // transaction_uuid must be unique per attempt
    const transactionUuid = `payslip-${payslip._id}-${Date.now()}`;
    const totalAmount = Number(payslip.netSalary).toFixed(2);

    const signature = generateEsewaSignature({
      totalAmount,
      transactionUuid,
      productCode: ESEWA_CONFIG.productCode,
    });

    payslip.transactionUuid = transactionUuid;
    await payslip.save();

    // The frontend auto-submits a form built from these fields to eSewa's checkout page.
    return res.json({
      formUrl: ESEWA_CONFIG.formUrl,
      fields: {
        amount: totalAmount,
        tax_amount: 0,
        total_amount: totalAmount,
        transaction_uuid: transactionUuid,
        product_code: ESEWA_CONFIG.productCode,
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: `${SERVER_URL}/api/payments/esewa/success`,
        failure_url: `${SERVER_URL}/api/payments/esewa/failure`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      },
    });
  } catch (error) {
    console.error("Initiate eSewa payment error:", error);
    return res.status(500).json({ error: "Failed to initiate payment" });
  }
};

// eSewa redirects the browser here (GET) after a successful payment,
// with a base64-encoded JSON payload in the `data` query param.
// GET /api/payments/esewa/success
export const handleEsewaSuccess = async (req, res) => {
  try {
    const { data } = req.query;
    if (!data) return res.redirect(`${CLIENT_URL}/payslips?payment=failed`);

    const { isValid, decoded } = verifyEsewaResponse(data);
    const normalizedStatus = String(decoded?.status || "").toUpperCase();

    if (!isValid || normalizedStatus !== "COMPLETE") {
      return res.redirect(`${CLIENT_URL}/payslips?payment=failed`);
    }

    const payslip = await Payslip.findOne({ transactionUuid: decoded.transaction_uuid });
    if (!payslip) return res.redirect(`${CLIENT_URL}/payslips?payment=failed`);

    let isStatusConfirmed = false;
    try {
      const statusUrl = new URL(ESEWA_CONFIG.statusUrl);
      statusUrl.searchParams.set("product_code", ESEWA_CONFIG.productCode);
      statusUrl.searchParams.set("total_amount", decoded.total_amount);
      statusUrl.searchParams.set("transaction_uuid", decoded.transaction_uuid);

      const statusRes = await fetch(statusUrl.toString(), {
        headers: { Accept: "application/json" },
      });

      const rawResponse = await statusRes.text();
      let statusData = null;
      if (rawResponse) {
        try {
          statusData = JSON.parse(rawResponse);
        } catch {
          statusData = { status: rawResponse };
        }
      }

      const resolvedStatus = String(statusData?.status || "").toUpperCase();
      isStatusConfirmed = statusRes.ok && ["COMPLETE", "SUCCESS", "PAID"].includes(resolvedStatus);
    } catch (error) {
      console.warn("Unable to verify eSewa status from status API", error.message);
    }

    if (!isStatusConfirmed) {
      console.warn("eSewa status check did not confirm completion, relying on redirect payload", {
        transactionUuid: decoded.transaction_uuid,
      });
    }

    payslip.paymentStatus = "PAID";
    payslip.paymentMethod = "ESEWA";
    payslip.paidAt = new Date();
    await payslip.save();

    return res.redirect(`${CLIENT_URL}/payslips?payment=success`);
  } catch (error) {
    console.error("eSewa success handler error:", error);
    return res.redirect(`${CLIENT_URL}/payslips?payment=failed`);
  }
};

// eSewa redirects here on a cancelled/failed payment.
// GET /api/payments/esewa/failure
export const handleEsewaFailure = (req, res) => {
  return res.redirect(`${CLIENT_URL}/payslips?payment=failed`);
};
