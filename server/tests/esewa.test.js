import test from "node:test";
import assert from "node:assert/strict";
import { generateEsewaSignature, verifyEsewaResponse } from "../config/esewa.js";

test("verifyEsewaResponse decodes URL-safe base64 callback payloads", () => {
  const payload = {
    status: "COMPLETE",
    total_amount: "100.00",
    transaction_uuid: "tx-123",
    product_code: "EPAYTEST",
    signature: generateEsewaSignature({
      totalAmount: "100.00",
      transactionUuid: "tx-123",
      productCode: "EPAYTEST",
    }),
  };

  const encodedPayload = encodeURIComponent(
    Buffer.from(JSON.stringify(payload)).toString("base64url")
  );
  const result = verifyEsewaResponse(encodedPayload);

  assert.equal(result.isValid, true);
  assert.deepEqual(result.decoded, payload);
});
