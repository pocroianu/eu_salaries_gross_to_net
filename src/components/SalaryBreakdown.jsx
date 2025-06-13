import React from 'react';
import './SalaryBreakdown.css';

const SalaryBreakdown = ({ salaryData }) => {
  if (!salaryData) {
    return <div className="salary-breakdown">Loading data...</div>;
  }

  const { 
    grossSalary, 
    netSalary, 
    name,
    takeHomePercentage
  } = salaryData;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate deductions total
  const totalDeductions = grossSalary - netSalary;
  const deductionsPercentage = 100 - (takeHomePercentage || ((netSalary / grossSalary) * 100));

  return (
    <div className="salary-breakdown">
      <h3>Salary Breakdown for {name}</h3>
      
      <div className="breakdown-item gross">
        <div className="label">Gross Monthly Salary</div>
        <div className="value">{formatCurrency(grossSalary)}</div>
        <div className="percentage">100%</div>
      </div>
      
      <div className="take-home-percentage">
        <div className="circle-progress" style={{
          background: `conic-gradient(
            #22c55e ${takeHomePercentage || ((netSalary / grossSalary) * 100)}%,
            #ef4444 0
          )`
        }}>
          <div className="inner-circle">
            <span className="percentage-value">{(takeHomePercentage || ((netSalary / grossSalary) * 100)).toFixed(1)}%</span>
            <span className="percentage-label">Take Home</span>
          </div>
        </div>
      </div>
    
    </div>
  );
};

export default SalaryBreakdown;
