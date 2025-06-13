import { useState, useEffect } from 'react'
import './App.css'
import SalaryInput from './components/SalaryInput'
import SalaryBreakdown from './components/SalaryBreakdown'
import EuropeanMap from './components/EuropeanMap'
import ComparisonChart from './components/ComparisonChart'
import grossToNetData from './data/gross.json'

function App() {
  const [grossSalary, setGrossSalary] = useState(2000)
  const [selectedCountry, setSelectedCountry] = useState('Germany')
  const [comparisonData, setComparisonData] = useState([])
  
  // Get the selected country's data
  const getCountryData = (country, salary) => {
    if (!grossToNetData[country] || !grossToNetData[country][salary]) {
      return null;
    }
    
    const netSalary = grossToNetData[country][salary];
    const takeHomePercentage = (netSalary / salary) * 100;
    
    return {
      name: country,
      grossSalary: salary,
      netSalary: netSalary,
      takeHomePercentage: takeHomePercentage,
      // For compatibility with existing component structures
      incomeTax: salary - netSalary,
      socialSecurity: 0,
      healthInsurance: 0
    };
  };
  
  // Get data for selected country
  const salaryData = getCountryData(selectedCountry, grossSalary) || {
    name: selectedCountry,
    grossSalary: grossSalary,
    netSalary: 0,
    takeHomePercentage: 0,
    incomeTax: 0,
    socialSecurity: 0,
    healthInsurance: 0
  };
  
  // Update comparison data when country or salary changes
  const updateComparisonData = () => {
    // Get data for all available countries at current salary
    const updatedData = Object.keys(grossToNetData).map(country => {
      return getCountryData(country, grossSalary);
    }).filter(data => data !== null); // Filter out any null values
    
    setComparisonData(updatedData);
  }
  
  // Call updateComparisonData when component mounts or when grossSalary changes
  useEffect(() => {
    updateComparisonData()
  }, [grossSalary])

  return (
    <div className="container">
      <header>
        <h1>EU Salaries: Take-Home Visualization</h1>
        <p className="subtitle">See how much of your salary you actually keep after taxes across Europe</p>
        <div className="instructions">
          <p><span className="instruction-step">1.</span> Select a monthly salary below</p>
          <p><span className="instruction-step">2.</span> Click any country on the map to explore details</p>
        </div>
      </header>
      
      <div className="controls">
        <SalaryInput grossSalary={grossSalary} setGrossSalary={setGrossSalary} />
      </div>
      
      <div className="visualization-container">
        <div className="left-panel">
          <SalaryBreakdown salaryData={salaryData} />
        </div>
        
        <div className="right-panel">
          <EuropeanMap 
            selectedCountry={selectedCountry} 
            comparisonData={comparisonData}
            onCountrySelect={setSelectedCountry}
          />
          <ComparisonChart 
            selectedCountry={selectedCountry}
            comparisonData={comparisonData}
          />
        </div>
      </div>
      
      <footer>
        <p>Data based on 2025 tax rates for a single person, age 30, no children, living in the capital city.</p>
        <p>Disclaimer: This visualization is for informational purposes only and may not reflect all tax situations.</p>
      </footer>
    </div>
  )
}

export default App
