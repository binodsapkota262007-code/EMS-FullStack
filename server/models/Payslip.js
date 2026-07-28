import mongoose from "mongoose";

const payslipSchema = new mongoose.Schema({
    employeeId: {type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true},
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    basicSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },

    paymentStatus: { type: String, enum: ["PENDING", "PAID"], default: "PENDING" },
    paymentMethod: { type: String, enum: ["ESEWA", "KHALTI", "MANUAL", null], default: null },
    transactionUuid: { type: String, default: null },
    paidAt: { type: Date, default: null },

}, {timestamps: true})

const Payslip = mongoose.models.Payslip || mongoose.model("Payslip", payslipSchema)

export default Payslip;
