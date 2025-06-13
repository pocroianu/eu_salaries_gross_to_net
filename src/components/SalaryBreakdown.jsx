import React from 'react';
import './SalaryBreakdown.css';

const SalaryBreakdown = ({ salaryData }) => {
  if (!salaryData) {
    return <div className="salary-breakdown">Loading data...</div>;
  }

  const { 
    grossSalary, 
    netSalary, 
    incomeTax, 
    socialSecurity, 
    healthInsurance,
    country 
  } = salaryData;

  // Calculate percentages
  const netPercentage = (netSalary / grossSalary) * 100;
  const incomeTaxPercentage = (incomeTax / grossSalary) * 100;
  const socialSecurityPercentage = (socialSecurity / grossSalary) * 100;
  const healthInsurancePercentage = (healthInsurance / grossSalary) * 100;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="salary-breakdown">
      <h3>Salary Breakdown for {country}</h3>
      
      <div className="breakdown-item gross">
        <div className="label">Gross Monthly Salary</div>
        <div className="value">{formatCurrency(grossSalary)}</div>
        <div className="percentage">100%</div>
      </div>
      
      <div className="deductions">
        <h4>Deductions</h4>
        
        <div className="breakdown-item">
          <div className="label">Income Tax</div>
          <div className="value">{formatCurrency(incomeTax)}</div>
          <div className="percentage">{incomeTaxPercentage.toFixed(1)}%</div>
          <div className="bar-container">
            <div className="bar income-tax" style={{ width: `${incomeTaxPercentage}%` }}></div>
          </div>
        </div>
        
        <div className="breakdown-item">
          <div className="label">Social Security</div>
          <div className="value">{formatCurrency(socialSecurity)}</div>
          <div className="percentage">{socialSecurityPercentage.toFixed(1)}%</div>
          <div className="bar-container">
            <div className="bar social-security" style={{ width: `${socialSecurityPercentage}%` }}></div>
          </div>
        </div>
        
        <div className="breakdown-item">
          <div className="label">Health Insurance</div>
          <div className="value">{formatCurrency(healthInsurance)}</div>
          <div className="percentage">{healthInsurancePercentage.toFixed(1)}%</div>
          <div className="bar-container">
            <div className="bar health-insurance" style={{ width: `${healthInsurancePercentage}%` }}></div>
          </div>
        </div>
      </div>
      
      <div className="breakdown-item net">
        <div className="label">Net Monthly Salary</div>
        <div className="value">{formatCurrency(netSalary)}</div>
        <div className="percentage">{netPercentage.toFixed(1)}%</div>
        <div className="bar-container">
          <div className="bar net-salary" style={{ width: `${netPercentage}%` }}></div>
        </div>
      </div>
      
      <div className="monthly-breakdown">
        <h4>Annual Breakdown</h4>
        <div className="monthly-item">
          <div className="label">Gross Annual</div>
          <div className="value">{formatCurrency(grossSalary * 12)}</div>
        </div>
        <div className="monthly-item">
          <div className="label">Net Annual</div>
          <div className="value">{formatCurrency(netSalary * 12)}</div>
        </div>
      </div>
    </div>
  );
};

export default SalaryBreakdown;
