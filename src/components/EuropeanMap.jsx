import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import './EuropeanMap.css';
import CountryModal from './CountryModal';

// Move the TopoJSON file to the public directory for simpler access
// The file should be at: public/data/europe.topojson
// Use import.meta.env.BASE_URL to get the correct base path in production and development
const geoUrl = `${import.meta.env.BASE_URL}data/europe.topojson`;

const EuropeanMap = ({ selectedCountry, comparisonData, onCountrySelect }) => {
  const [tooltipData, setTooltipData] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);
  const [geoData, setGeoData] = useState(null);
  const [modalCountryData, setModalCountryData] = useState(null);
  
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
    .range(["#ef4444", "#eab308", "#22c55e"]); // red -> yellow -> green

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

  // Format currency for display on map
  const formatNetSalary = (amount) => {
    if (!amount) return "";
    
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
      // Removed compact notation to show full values
    }).format(amount);
  };

  // Map tooltip content
  const tooltipContent = (geo) => {
    const countryData = getCountryData(geo.properties.name);
    if (!countryData) {
      return (
        <div className="tooltip">
          <div className="tooltip-country">{geo.properties.name}</div>
          <div className="tooltip-info">No data available</div>
        </div>
      );
    }

    const takeHomePercentage = countryData.takeHomePercentage || 
      ((countryData.netSalary / countryData.grossSalary) * 100);

    // Calculate how much above/below average this country is
    const avgTakeHome = comparisonData.reduce((sum, c) => {
      const pct = c.takeHomePercentage || ((c.netSalary / c.grossSalary) * 100);
      return sum + pct;
    }, 0) / comparisonData.length;

    const diffFromAvg = takeHomePercentage - avgTakeHome;
    const isAboveAverage = diffFromAvg >= 0;

    return (
      <div className="tooltip">
        <div className="tooltip-country">{countryData.name}</div>
        <div className="tooltip-percentage">
          <span className="percentage-value">{takeHomePercentage.toFixed(1)}%</span>
          <span className="percentage-label">Take-home</span>
        </div>
        <div className="tooltip-comparison">
          <span className={`comparison-value ${isAboveAverage ? 'positive' : 'negative'}`}>
            {isAboveAverage ? '+' : ''}{diffFromAvg.toFixed(1)}%
          </span>
          <span className="comparison-label">vs. EU average</span>
        </div>
        <div className="tooltip-salary">
          <strong>{formatNetSalary(countryData.netSalary)}</strong> after taxes
        </div>
        <div className="tooltip-cta">Click to view details</div>
      </div>
    );
  };

  // Handle mouse events for tooltip
  const handleMouseEnter = (geo, evt) => {
    // Store the geo data to render in the tooltip
    setTooltipData(geo);
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
  
  // Map coordinate positions for each country label
  // These are in [x, y] format for the map projection
  const countryLabelPositions = {
    "Germany": [10.4, 51.1],
    "France": [2.2, 46.2],
    "Spain": [-3.7, 40.4],
    "Italy": [12.5, 41.8],
    "United Kingdom": [-2.5, 54.0],
    "Netherlands": [4.8, 52.3],
    "Belgium": [4.3, 50.8],
    "Sweden": [15.0, 62.0],
    "Austria": [14.5, 47.5],
    "Switzerland": [8.2, 46.8],
    "Denmark": [10.0, 56.0],
    "Finland": [25.7, 61.9],
    "Norway": [8.4, 62.0],
    "Ireland": [-8.2, 53.4],
    "Portugal": [-8.2, 39.3],
    "Greece": [21.8, 39.0],
    "Poland": [19.1, 51.9],
    "Czech Republic": [15.4, 49.8],
    "Romania": [24.9, 45.9],
    "Hungary": [19.5, 47.1],
    "Bulgaria": [25.4, 42.7],
    "Slovakia": [19.6, 48.6],
    "Slovenia": [14.9, 46.1],
    "Croatia": [15.2, 45.1],
    "Estonia": [25.0, 58.5],
    "Latvia": [24.6, 56.8],
    "Lithuania": [23.8, 55.1],
    "Cyprus": [33.4, 35.1],
    "Luxembourg": [6.1, 49.8],
    "Malta": [14.3, 35.9]
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
                    <g key={geo.rsmKey}>
                      <Geography
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
                            setModalCountryData(countryData);
                          }
                        }}
                      />
                      {/* We don't render labels directly here */}
                    </g>
                  );
                })
              }
            </Geographies>
          )}
          
          {/* Add net salary labels to countries with data */}
          {comparisonData && comparisonData.map(country => {
            // Skip if we don't have both a position and net salary data
            if (!country || !countryLabelPositions[country.name] || !country.netSalary) return null;
            
            const isSelected = country.name === selectedCountry;
            
            return (
              <Marker
                key={`label-${country.name}`}
                coordinates={countryLabelPositions[country.name]}
              >
                <g>
                  <rect 
                    x={-35} 
                    y={-10} 
                    width={70} 
                    height={20} 
                    rx={4} 
                    fill="rgba(0,0,0,0.7)" 
                    stroke={isSelected ? "#646cff" : "rgba(255,255,255,0.3)"}
                    strokeWidth={isSelected ? 1.5 : 0.5}
                  />
                  <text 
                    className="country-net-label"
                    textAnchor="middle"
                    y={2}
                    style={{
                      fontWeight: isSelected ? "bold" : "normal",
                      fontSize: "10px",
                      fill: "white"
                    }}
                  >
                    {formatNetSalary(country.netSalary)}
                  </text>
                </g>
              </Marker>
            );
          })}
        </ComposableMap>
        
        {showTooltip && tooltipData && (
          <div 
            className="tooltip-container" 
            style={{ 
              left: `${tooltipPosition.x + 10}px`, 
              top: `${tooltipPosition.y + 10}px` 
            }}
          >
            {tooltipContent(tooltipData)}
          </div>
        )}
      </div>
      
      <div className="color-scale">
        <div className="scale-label">Lower net %</div>
        <div className="scale-gradient"></div>
        <div className="scale-label">Higher net %</div>
      </div>
      
      {modalCountryData && (
        <CountryModal 
          countryData={modalCountryData} 
          onClose={() => setModalCountryData(null)} 
        />
      )}
    </div>
  );
};

export default EuropeanMap;
