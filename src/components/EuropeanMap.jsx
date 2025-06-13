import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import './EuropeanMap.css';

// European map GeoJSON - using a reliable Europe-specific source
const geoUrl = "https://cdn.jsdelivr.net/npm/europe-geojson@1.0.0/europe.json";

const EuropeanMap = ({ selectedCountry, comparisonData, onCountrySelect }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  // Create a color scale based on net salary percentage
  const colorScale = scaleLinear()
    .domain([50, 85]) // Assuming net salary ranges from 50% to 85% of gross
    .range(['#ef4444', '#22c55e'])
    .clamp(true);

  // Country name mapping between GeoJSON and our data
  const countryNameMapping = {
    // Map GeoJSON names to our data names
    "Czechia": "Czech Republic",
    "United Kingdom": "UK",
    "UK": "United Kingdom"
  };

  // Find country data in comparison data
  const getCountryData = (geoCountryName) => {
    if (!comparisonData || comparisonData.length === 0) return null;
    
    // Get the mapped name or use the original name
    const mappedName = countryNameMapping[geoCountryName] || geoCountryName;
    
    return comparisonData.find(country => 
      country.name.toLowerCase() === mappedName.toLowerCase()
    );
  };

  // Handle mouse events for tooltip
  const handleMouseEnter = (geo, evt) => {
    // In europe-geojson, the country name is in properties.NAME
    const countryName = geo.properties.NAME || geo.properties.name;
    const countryData = getCountryData(countryName);
    
    if (countryData) {
      const netPercentage = ((countryData.netSalary / countryData.grossSalary) * 100).toFixed(1);
      setTooltipContent(`
        <strong>${countryData.name}</strong><br />
        Net: €${countryData.netSalary.toLocaleString()}<br />
        ${netPercentage}% of gross salary
      `);
    } else {
      setTooltipContent(`<strong>${countryName}</strong><br />No data available`);
    }
    
    setTooltipPosition({ x: evt.clientX, y: evt.clientY });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="european-map">
      <h3>Net Salary Comparison Across Europe</h3>
      <div className="map-container">
        <ComposableMap
          projection="geoAzimuthalEqualArea"
          projectionConfig={{
            rotate: [-10.0, -53.0, 0],
            scale: 1200
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // Get country name from properties (europe-geojson uses NAME)
                const countryName = geo.properties.NAME || geo.properties.name;
                
                // Apply country name mapping if needed
                const mappedName = countryNameMapping[countryName] || countryName;
                const countryData = getCountryData(mappedName);
                
                // Check if this country is selected
                const isSelected = countryData && countryData.name === selectedCountry;
                  
                  // Calculate fill color based on net salary percentage
                  let fillColor = "#F5F4F6"; // Default color for countries without data
                  
                  if (countryData) {
                    const netPercentage = (countryData.netSalary / countryData.grossSalary) * 100;
                    fillColor = colorScale(netPercentage);
                  }
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#FFFFFF"
                    strokeWidth={0.5}
                    style={{
                      default: {
                        outline: "none",
                        stroke: "#FFFFFF",
                        strokeWidth: 0.5,
                        opacity: 0.9
                      },
                      hover: {
                        outline: "none",
                        stroke: "#FFFFFF",
                        strokeWidth: 1.5,
                        opacity: 1
                      },
                      pressed: {
                        outline: "none",
                        stroke: "#FFFFFF",
                        strokeWidth: 1,
                        opacity: 0.8
                      }
                    }}
                    className={isSelected ? "selected-country" : ""}
                    onMouseEnter={(evt) => handleMouseEnter(geo, evt)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => {
                      if (countryData) {
                        onCountrySelect(countryName);
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        
        {showTooltip && (
          <div 
            className="tooltip" 
            style={{ 
              left: `${tooltipPosition.x + 10}px`, 
              top: `${tooltipPosition.y + 10}px` 
            }}
            dangerouslySetInnerHTML={{ __html: tooltipContent }}
          />
        )}
      </div>
      
      <div className="color-scale">
        <div className="scale-label">Lower net %</div>
        <div className="scale-gradient"></div>
        <div className="scale-label">Higher net %</div>
      </div>
    </div>
  );
};

export default EuropeanMap;
