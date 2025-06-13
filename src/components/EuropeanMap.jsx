import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import './EuropeanMap.css';

// Move the TopoJSON file to the public directory for simpler access
// The file should be at: public/data/europe.topojson
const geoUrl = "/data/europe.topojson";

const EuropeanMap = ({ selectedCountry, comparisonData, onCountrySelect }) => {
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [geoData, setGeoData] = useState(null);
  
  // Load the TopoJSON file when component mounts
  useEffect(() => {
    // Using absolute URL to make sure it works in development and production
    fetch(geoUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load map data: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Map data loaded successfully", data);
        setGeoData(data);
      })
      .catch(error => {
        console.error("Error loading map data:", error);
      });
  }, []);

  // Create a color scale for take-home percentage
  const colorScale = scaleLinear()
    .domain([50, 65, 80]) // Adjust this range based on your data
    .range(["#ef4444", "#eab308", "#22c55e"]) // red -> yellow -> green);

  // Country name mapping between GeoJSON and our data
  const countryNameMapping = {
    // Map GeoJSON names to our data names
    "United Kingdom": "UK",
    "UK": "United Kingdom",
    "Czechia": "Czech Republic",
    "Bosnia and Herz.": "Bosnia and Herzegovina",
    "Macedonia": "North Macedonia",
    "Czech Rep.": "Czech Republic",
    "Bosnia and Herzegovina": "Bosnia and Herzegovina",
    "N. Cyprus": "Cyprus"
  };

  // Find country data in comparison data
  const getCountryData = (geoCountryName) => {
    if (!comparisonData || comparisonData.length === 0) return null;
    if (!geoCountryName) return null;
    
    // Get the mapped name or use the original name
    const mappedName = countryNameMapping[geoCountryName] || geoCountryName;
    
    // Find country data, ensure country has a name property
    return comparisonData.find(country => 
      country && country.name && country.name.toLowerCase() === mappedName.toLowerCase()
    );
  };

  // Handle mouse events for tooltip
  const handleMouseEnter = (geo, evt) => {
    // In europe-geojson, the country name is in properties.NAME
    const countryName = geo.properties.NAME || geo.properties.name;
    const countryData = getCountryData(countryName);
    
    if (countryData) {
      const takeHomePercentage = countryData.takeHomePercentage || ((countryData.netSalary / countryData.grossSalary) * 100);
      setTooltipContent(`
        <strong>${countryData.name}</strong><br />
        Take-home: €${countryData.netSalary.toLocaleString()}<br />
        ${takeHomePercentage.toFixed(1)}% of gross salary
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

  // Calculate fill color based on take-home percentage
  const calculateFillColor = (countryData) => {
    if (!countryData) return "#3d3d3d"; // Default gray for countries with no data

    // Use the takeHomePercentage if available, otherwise calculate it
    const takeHomePercentage = countryData.takeHomePercentage || 
      ((countryData.netSalary / countryData.grossSalary) * 100);

    // Use a color scale based on the percentage
    // Higher percentage = better (more money kept) = greener
    return colorScale(takeHomePercentage);
  };

  return (
    <div className="european-map">
      <h3>Take-home Salary Comparison Across Europe</h3>
      <div className="map-container">
        <ComposableMap
          projection="geoAzimuthalEqualArea"
          projectionConfig={{
            rotate: [-10.0, -53.0, 0],
            scale: 1200
          }}
        >
          {geoData && (
            <Geographies geography={geoData}>
            {({ geographies }) =>
              geographies.map((geo) => {
                // Get country name from properties (europe-geojson uses NAME)
                const countryName = geo.properties.NAME || geo.properties.name;
                
                // Apply country name mapping if needed
                const mappedName = countryNameMapping[countryName] || countryName;
                const countryData = getCountryData(mappedName);
                
                // Check if this country is selected
                const isSelected = countryData && countryData.name === selectedCountry;
                  
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={calculateFillColor(countryData)}
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
          )}
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
