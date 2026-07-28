import crypto from "crypto";

const isProd = process.env.ESEWA_ENV === "production";

export const ESEWA_CONFIG = {
  productCode: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
  secretKey: process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q",

  formUrl:
    process.env.ESEWA_PAYMENT_URL ||
    (isProd
      ? "https://epay.esewa.com.np/api/epay/main/v2/form"
      : "https://rc-epay.esewa.com.np/api/epay/main/v2/form"),

  statusUrl:
    process.env.ESEWA_STATUS_CHECK_URL ||
    (isProd
      ? "https://epay.esewa.com.np/api/epay/transaction/status"
      : "https://rc-epay.esewa.com.np/api/epay/transaction/status"),
};

// Generate HMAC SHA256 signature (Base64)
export const generateEsewaSignature = ({
  totalAmount,
  transactionUuid,
  productCode = ESEWA_CONFIG.productCode,
}) => {
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

  return crypto
    .createHmac("sha256", ESEWA_CONFIG.secretKey)
    .update(message)
    .digest("base64");
};

const decodeEsewaPayload = (encodedData) => {
  if (!encodedData) {
    throw new Error("Missing eSewa payload");
  }

  let normalized = String(encodedData).trim();
  normalized = decodeURIComponent(normalized);

  normalized = normalized.replace(/-/g, "+").replace(/_/g, "/");

  while (normalized.length % 4 !== 0) {
    normalized += "=";
  }

  return JSON.parse(Buffer.from(normalized, "base64").toString("utf8"));
};

// Verify response received from eSewa
export const verifyEsewaResponse = (encodedData) => {
  try {
    const decoded = decodeEsewaPayload(encodedData);

    // IMPORTANT: eSewa's response signs a different field set (and order)
    // than the request — it tells you exactly which via `signed_field_names`.
    // Never assume it's the same as the request's fields.
    const fieldNames = String(decoded.signed_field_names || "")
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    if (fieldNames.length === 0) {
      return { isValid: false, decoded, error: "Missing signed_field_names in response" };
    }

    const message = fieldNames
      .map((field) => `${field}=${decoded[field]}`)
      .join(",");

    const expectedSignature = crypto
      .createHmac("sha256", ESEWA_CONFIG.secretKey)
      .update(message)
      .digest("base64");

    const isValid = expectedSignature === decoded.signature;

    return {
      isValid,
      decoded,
    };
  } catch (err) {
    return {
      isValid: false,
      decoded: null,
      error: err.message,
    };
  }
};