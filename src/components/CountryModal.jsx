import React from 'react';
import './CountryModal.css';

const CountryModal = ({ countryData, onClose }) => {
  if (!countryData) return null;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const { 
    name, 
    grossSalary, 
    netSalary,
    takeHomePercentage: rawTakeHomePercentage
  } = countryData;
  
  // Calculate take-home percentage if not provided
  const takeHomePercentage = rawTakeHomePercentage || ((netSalary / grossSalary) * 100);
  
  // Calculate deductions total
  const totalDeductions = grossSalary - netSalary;
  
  return (
    <div className="country-modal-backdrop" onClick={onClose}>
      <div className="country-modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        
        <h2>{name}</h2>
        <div className="modal-salary-info">
          <div className="salary-amount-container">
            <div className="gross-salary">
              <span className="salary-label">Gross</span>
              <span className="salary-value">{formatCurrency(grossSalary)}</span>
            </div>
            <div className="net-salary">
              <span className="salary-label">Net</span>
              <span className="salary-value">{formatCurrency(netSalary)}</span>
            </div>
          </div>
          
          <div className="take-home-circle">
            <div className="circle-progress" style={{
              background: `conic-gradient(
                #22c55e ${takeHomePercentage}%,
                #ef4444 0
              )`
            }}>
              <div className="inner-circle">
                <span className="percentage-value">{takeHomePercentage.toFixed(1)}%</span>
                <span className="percentage-label">Take Home</span>
              </div>
            </div>
          </div>
          
          <div className="deduction-info">
            <div className="deduction-item">
              <span className="deduction-label">Tax & Deductions</span>
              <span className="deduction-value">{formatCurrency(totalDeductions)}</span>
              <span className="deduction-percentage">({(100 - takeHomePercentage).toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryModal;
