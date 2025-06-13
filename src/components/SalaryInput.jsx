import React from 'react';
import './SalaryInput.css';

const SalaryInput = ({ grossSalary, setGrossSalary }) => {
  const salaryOptions = [2000, 3500, 5000];
  
  const handleSalaryChange = (value) => {
    setGrossSalary(value);
  };

  return (
    <div className="salary-input">
      <h3>Monthly Gross Salary</h3>
      <div className="salary-value-display">
        €{grossSalary.toLocaleString()}
      </div>
      <div className="salary-options">
        {salaryOptions.map(salary => (
          <button 
            key={salary}
            className={`salary-option ${grossSalary === salary ? 'selected' : ''}`}
            onClick={() => handleSalaryChange(salary)}
          >
            €{salary.toLocaleString()}
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
