import { useState, useEffect } from 'react'
import './App.css'
import SalaryInput from './components/SalaryInput'
import CountrySelector from './components/CountrySelector'
import SalaryBreakdown from './components/SalaryBreakdown'
import EuropeanMap from './components/EuropeanMap'
import ComparisonChart from './components/ComparisonChart'
import { calculateNetSalary } from './utils/salaryCalculations'
import sampleData from './data/sampleData.json'

function App() {
  const [grossSalary, setGrossSalary] = useState(50000)
  const [selectedCountry, setSelectedCountry] = useState('Germany')
  const [comparisonData, setComparisonData] = useState([])
  
  // Calculate net salary for selected country
  const salaryData = calculateNetSalary(grossSalary, selectedCountry)
  
  // Update comparison data when country or salary changes
  const updateComparisonData = () => {
    // This would fetch data for all countries at the given salary
    // For now we'll use the sample data
    setComparisonData(sampleData.filter(item => item.grossSalary === grossSalary))
  }
  
  // Call updateComparisonData when component mounts or when grossSalary changes
  useEffect(() => {
    updateComparisonData()
  }, [grossSalary])

  return (
    <div className="container">
      <header>
        <h1>EU Salaries: Gross to Net Visualization</h1>
        <p>Compare net salaries after taxes and social security deductions across European countries</p>
      </header>
      
      <div className="controls">
        <SalaryInput 
          grossSalary={grossSalary} 
          setGrossSalary={setGrossSalary} 
        />
        <CountrySelector 
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
        />
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
