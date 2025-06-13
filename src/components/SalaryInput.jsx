import React from 'react';
import './SalaryInput.css';

const SalaryInput = ({ grossSalary, setGrossSalary }) => {
  // We're using fixed salary points for accuracy
  const salaryOptions = [2000, 3500, 5000];

  const handleSalarySelect = (salary) => {
    setGrossSalary(salary);
  };

  return (
    <div className="salary-input-container">
      <h3>Select Monthly Gross Salary</h3>
      <div className="salary-options">
        {salaryOptions.map(salary => (
          <button 
            key={salary}
            className={`salary-option ${grossSalary === salary ? 'selected' : ''}`}
            onClick={() => handleSalarySelect(salary)}
          >
            <span className="salary-amount">€{salary.toLocaleString()}</span>
            <span className="salary-label">{salary === 2000 ? 'Lower Income' : salary === 3500 ? 'Middle Income' : 'Higher Income'}</span>
          </button>
        ))}
      </div>
      <div className="salary-description">
        <p>Select one of the predefined monthly gross salary values to see accurate take-home percentages across Europe.</p>
      </div>
    </div>
  );
};

export default SalaryInput;
