import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Annotation } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import './EuropeanMap.css';
import CountryModal from './CountryModal';

// Move the TopoJSON file to the public directory for simpler access
// The file should be at: public/data/europe.topojson
const geoUrl = "/data/europe.topojson";

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
      maximumFractionDigits: 0,
      notation: 'compact'
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
  
  // Country centroid positions for placing net salary labels
  // These are approximate positions that might need adjustment
  const countryCentroids = {
    "Germany": { x: 10, y: -5 },
    "France": { x: -1, y: -3 },
    "Spain": { x: -9, y: 7 },
    "Italy": { x: 10, y: 5 },
    "United Kingdom": { x: -7, y: -12 },
    "Netherlands": { x: 2, y: -10 },
    "Belgium": { x: 0, y: -8 },
    "Sweden": { x: 10, y: -20 },
    "Austria": { x: 12, y: -1 },
    "Switzerland": { x: 5, y: 0 },
    "Denmark": { x: 5, y: -16 },
    "Finland": { x: 20, y: -20 },
    "Norway": { x: 5, y: -24 },
    "Ireland": { x: -13, y: -15 },
    "Portugal": { x: -15, y: 8 },
    "Greece": { x: 20, y: 13 },
    "Poland": { x: 19, y: -8 },
    "Czech Republic": { x: 13, y: -5 },
    "Romania": { x: 23, y: 2 },
    "Hungary": { x: 18, y: 0 },
    "Bulgaria": { x: 23, y: 7 },
    "Slovakia": { x: 17, y: -3 },
    "Slovenia": { x: 12, y: 0 },
    "Croatia": { x: 13, y: 3 },
    "Estonia": { x: 21, y: -18 },
    "Latvia": { x: 21, y: -15 },
    "Lithuania": { x: 21, y: -13 },
    "Cyprus": { x: 33, y: 17 },
    "Luxembourg": { x: 2, y: -6 },
    "Malta": { x: 10, y: 15 }
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
                          setModalCountryData(countryData);
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          )}
          
          {/* Add net salary labels to countries with data */}
          {geoData && comparisonData && comparisonData.map(country => {
            if (!country || !countryCentroids[country.name]) return null;
            const position = countryCentroids[country.name];
            
            return (
              <Annotation
                key={`label-${country.name}`}
                subject={[position.x, position.y]}
                dx={0}
                dy={0}
              >
                <text 
                  className="country-net-label"
                  textAnchor="middle" 
                  alignmentBaseline="middle"
                  style={{ 
                    fill: country.name === selectedCountry ? "#ffffff" : "#d1d5db",
                    fontWeight: country.name === selectedCountry ? "bold" : "normal",
                    fontSize: "0.65rem",
                    textShadow: "0 1px 3px rgba(0,0,0,0.7)"
                  }}
                >
                  {formatNetSalary(country.netSalary)}
                </text>
              </Annotation>
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
