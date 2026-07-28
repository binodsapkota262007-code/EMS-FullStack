import test from 'node:test';
import assert from 'node:assert/strict';

import { canAccessPayslipForSession, getPayslipEmployeeId } from '../controllers/payslipController.js';

test('allows an employee to access their own payslip when the employeeId is populated as an object', () => {
  const employee = {
    _id: {
      toString: () => 'employee-1',
    },
  };

  const payslip = {
    employeeId: {
      _id: {
        toString: () => 'employee-1',
      },
    },
  };

  const result = canAccessPayslipForSession({
    session: { role: 'EMPLOYEE' },
    payslip,
    employee,
  });

  assert.equal(result.allowed, true);
  assert.equal(getPayslipEmployeeId(payslip), 'employee-1');
});

test('denies an employee access to another employee payslip', () => {
  const employee = {
    _id: {
      toString: () => 'employee-1',
    },
  };

  const payslip = {
    employeeId: {
      _id: {
        toString: () => 'employee-2',
      },
    },
  };

  const result = canAccessPayslipForSession({
    session: { role: 'EMPLOYEE' },
    payslip,
    employee,
  });

  assert.equal(result.allowed, false);
  assert.equal(result.reason, 'Not authorized to view this payslip');
});

test('allows admins to access any payslip', () => {
  const result = canAccessPayslipForSession({
    session: { role: 'ADMIN' },
    payslip: { employeeId: { _id: { toString: () => 'employee-2' } } },
    employee: { _id: { toString: () => 'employee-1' } },
  });

  assert.equal(result.allowed, true);
});
