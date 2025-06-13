import React from 'react';
import './SalaryInput.css';

const SalaryInput = ({ grossSalary, setGrossSalary }) => {
  const handleSalaryChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0) {
      setGrossSalary(value);
    }
  };

  return (
    <div className="salary-input">
      <h3>Monthly Gross Salary</h3>
      <div className="salary-value-display">
        €{grossSalary.toLocaleString()}
      </div>
      <div className="input-container">
        <span className="currency">€</span>
        <input
          type="number"
          value={grossSalary}
          onChange={handleSalaryChange}
          min="0"
          step="1000"
          aria-label="Gross salary input"
        />
      </div>
      <div className="salary-slider">
        <input
          type="range"
          min="1000"
          max="15000"
          step="100"
          value={grossSalary}
          onChange={handleSalaryChange}
          aria-label="Salary range slider"
        />
        <div className="range-labels">
          <span>€1,000</span>
          <span>€15,000</span>
        </div>
      </div>
    </div>
  );
};

export default SalaryInput;
