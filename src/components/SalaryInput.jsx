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
          </button>
        ))}
      </div>
    </div>
  );
};

export default SalaryInput;
