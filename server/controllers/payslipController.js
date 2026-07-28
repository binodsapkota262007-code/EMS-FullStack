import Payslip from "../models/Payslip.js";
import Employee from "../models/Employee.js";


// Create payslip
// POST /api/payslips
export const createPayslip = async (req, res) => {

    try {
    const { employeeId, month, year, basicSalary, allowances, deductions } = req.body;

    if(!employeeId || !month || !year || !basicSalary){
        return res.status(400).json({ error: "Missing fields" });
    }

    const netSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);

        const payslip = await Payslip.create({
        employeeId,
        month: Number(month),
        year: Number(year),
        basicSalary: Number(basicSalary),
        allowances: Number(allowances || 0),
        deductions: Number(deductions || 0),
        netSalary,
    })

    return res.json({success: true, data: payslip})

} catch (error) {
     return res.status(500).json({ error: "Failed" });
}


}

// Get payslips
// GET /api/payslips
export const getPayslips = async (req, res) => {
try {
    const session = req.session;
    const isAdmin = session.role === "ADMIN";
    if(isAdmin){
        const payslips = await Payslip.find().populate("employeeId").
        sort({ createdAt: -1 });
        const data = payslips.map((p)=>{
            const obj = p.toObject();
            return {
                ...obj,
                id: obj._id.toString(),
                employee: obj.employeeId,
                employeeId: obj.employeeId?._id?.toString(),
            }
        })
            return res.json({ data });
} else {
    const employee = await Employee.findOne({userId: session.userId})
    if (!employee) return res.status(404).json({ error: "Not found" });
    const payslips = await Payslip.find({employeeId: employee._id}).sort({ createdAt: -1 });
    return res.json({data: payslips})
}

} catch (error) { 

     return res.status(500).json({ error: "Failed" });
}
}

// Get payslip by ID
// GET /api/payslips/:id
export const getPayslipById = async (req, res) => {
try {
    // Fetch without populate first, so employeeId stays a raw ObjectId
    // that we can safely compare for ownership.
    const payslip = await Payslip.findById(req.params.id).lean();

    if(!payslip) return res.status(404).json({ error: "Not found" });

    const session = req.session;
    const isAdmin = session.role === "ADMIN";

    if (!isAdmin) {
        // Employees may only ever view their own payslip.
        const employee = await Employee.findOne({ userId: session.userId });
        if (!employee || payslip.employeeId?.toString() !== employee._id.toString()) {
            return res.status(403).json({ error: "Not authorized to view this payslip" });
        }

        // And only once admin has marked it as paid.
        if (payslip.paymentStatus !== "PAID") {
            return res.status(403).json({ error: "This payslip is not available until payment is completed" });
        }
    }

    // Safe to attach full employee details now that access is confirmed.
    const employeeDoc = await Employee.findById(payslip.employeeId).lean();

    const result = {
        ...payslip,
        id: payslip._id.toString(),
        employee: employeeDoc,
    }
    return res.json(result)
} catch (error) {
    return res.status(500).json({ error: "Failed" });
}
}