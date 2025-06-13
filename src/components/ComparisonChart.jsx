import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ComparisonChart.css';

const ComparisonChart = ({ selectedCountry, comparisonData }) => {
  // Sort data by net salary percentage (descending)
  const sortedData = [...comparisonData].sort((a, b) => {
    const aPercentage = a.netSalary / a.grossSalary;
    const bPercentage = b.netSalary / b.grossSalary;
    return bPercentage - aPercentage;
  });

  // Take top 10 countries for comparison
  const topCountries = sortedData.slice(0, 10);

  // Format data for the chart
  const chartData = topCountries.map(country => {
    const isSelected = country.name === selectedCountry;
    return {
      name: country.name,
      'Net Salary': country.netSalary,
      'Income Tax': country.incomeTax,
      'Social Security': country.socialSecurity,
      'Health Insurance': country.healthInsurance,
      isSelected
    };
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const grossSalary = payload.reduce(
        (sum, entry) => sum + entry.value,
        0
      );
      
      const netSalary = payload.find(p => p.dataKey === 'Net Salary')?.value || 0;
      const netPercentage = ((netSalary / grossSalary) * 100).toFixed(1);
      
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          <p className="tooltip-gross">{`Gross: €${grossSalary.toLocaleString()}`}</p>
          <p className="tooltip-net">{`Net: €${netSalary.toLocaleString()} (${netPercentage}%)`}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: €${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="comparison-chart">
      <h3>Top 10 Countries by Net Salary Percentage</h3>
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
            barGap={0}
            barSize={20}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              tickFormatter={(value) => `€${value / 1000}k`}
              domain={[0, 'dataMax']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="Income Tax" 
              stackId="a" 
              fill="#ef4444" 
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
              dataKey="Social Security" 
              stackId="a" 
              fill="#f97316" 
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
              dataKey="Health Insurance" 
              stackId="a" 
              fill="#eab308" 
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
