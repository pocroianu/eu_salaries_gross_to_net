import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ComparisonChart.css';

const ComparisonChart = ({ selectedCountry, comparisonData }) => {
  // Responsive settings depending on screen size
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile on mount and when window resizes
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  // Sort data by take-home percentage (descending)
  const sortedData = [...comparisonData].sort((a, b) => {
    const aPercentage = a.takeHomePercentage || (a.netSalary / a.grossSalary * 100);
    const bPercentage = b.takeHomePercentage || (b.netSalary / b.grossSalary * 100);
    return bPercentage - aPercentage;
  });

  // Take top countries for comparison - fewer on mobile
  const topCountries = sortedData.slice(0, isMobile ? 6 : 10);

  // Format data for the chart
  const chartData = topCountries.map(country => {
    const isSelected = country.name === selectedCountry;
    const takeHomePercentage = country.takeHomePercentage || (country.netSalary / country.grossSalary * 100);
    
    return {
      name: country.name,
      'Take-home %': takeHomePercentage,
      'Net Salary': country.netSalary,
      'Total Deductions': country.grossSalary - country.netSalary,
      isSelected,
      grossSalary: country.grossSalary
    };
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const grossSalary = payload[0]?.payload?.grossSalary || 0;
      const netSalary = payload.find(p => p.dataKey === 'Net Salary')?.value || 0;
      const takeHomePercentage = payload.find(p => p.dataKey === 'Take-home %')?.value || 0;
      
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          <p className="tooltip-percent">{`Take-home: ${takeHomePercentage.toFixed(1)}%`}</p>
          <p className="tooltip-gross">{`Gross: €${grossSalary.toLocaleString()}`}</p>
          <p className="tooltip-net">{`Net: €${netSalary.toLocaleString()}`}</p>
          <p className="tooltip-deduction">{`Deductions: €${(grossSalary - netSalary).toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="comparison-chart">
      <h3>Top 10 Countries by Take-home Percentage</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60
            }}
            barSize={30}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              angle={isMobile ? -60 : -45} 
              textAnchor="end"
              height={isMobile ? 80 : 60}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              tickMargin={isMobile ? 8 : 10}
            />
            <YAxis 
              tickFormatter={(value) => `€${value / 1000}k`}
              domain={[0, 'dataMax']}
              tick={{ fontSize: isMobile ? 10 : 12 }}
              width={isMobile ? 35 : 45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="Take-home %" 
              fill="#22c55e" 
              className="chart-bar"
              shape={(props) => {
                const { x, y, width, height, fill } = props;
                return <rect 
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={fill}
                  className={props.payload.isSelected ? 'selected-country-bar' : ''}
                />;
              }}
            />
            <Bar 
              dataKey="Total Deductions" 
              fill="#ef4444" 
              className="chart-bar deductions-bar"
              shape={(props) => {
                const { x, y, width, height, fill } = props;
                return <rect 
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={fill}
                  className={props.payload.isSelected ? 'selected-country-bar' : ''}
                  opacity={0.5}
                />;
              }}
              hide={true}
            />
            <Bar 
              dataKey="Net Salary" 
              stackId="a" 
              fill="#22c55e" 
              className="chart-bar"
              shape={(props) => {
                const { x, y, width, height, fill } = props;
                return <rect 
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={fill}
                  className={props.payload.isSelected ? 'selected-country-bar' : ''}
                />;
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComparisonChart;
