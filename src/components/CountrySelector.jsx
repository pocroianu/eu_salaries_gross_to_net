import React from 'react';
import './CountrySelector.css';

const CountrySelector = ({ selectedCountry, setSelectedCountry }) => {
  // List of EU countries
  const countries = [
    'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
    'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
    'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg',
    'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
    'Slovenia', 'Spain', 'Sweden'
  ];

  return (
    <div className="country-selector">
      <h3>Select Country</h3>
      <select 
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        aria-label="Select a country"
      >
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      {selectedCountry && (
        <div className="selected-country-display">
          Currently viewing: <strong>{selectedCountry}</strong>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
