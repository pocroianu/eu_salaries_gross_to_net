/**
 * Calculate net salary based on gross salary and country
 * This is a simplified calculation for demonstration purposes
 * In a real application, this would use actual tax brackets and rates for each country
 */
export const calculateNetSalary = (grossSalary, countryName) => {
  // Get country tax rates from our data
  const countryData = getCountryTaxRates(countryName);
  
  if (!countryData) {
    return null;
  }
  
  // Calculate deductions
  const incomeTax = grossSalary * countryData.incomeTaxRate;
  const socialSecurity = grossSalary * countryData.socialSecurityRate;
  const healthInsurance = grossSalary * countryData.healthInsuranceRate;
  
  // Calculate net salary
  const netSalary = grossSalary - incomeTax - socialSecurity - healthInsurance;
  
  return {
    country: countryName,
    grossSalary,
    netSalary,
    incomeTax,
    socialSecurity,
    healthInsurance
  };
};

/**
 * Get country-specific tax rates
 * This is sample data for demonstration purposes
 */
const getCountryTaxRates = (countryName) => {
  const taxRates = {
    'Austria': {
      incomeTaxRate: 0.25,
      socialSecurityRate: 0.18,
      healthInsuranceRate: 0.03
    },
    'Belgium': {
      incomeTaxRate: 0.30,
      socialSecurityRate: 0.13,
      healthInsuranceRate: 0.07
    },
    'Bulgaria': {
      incomeTaxRate: 0.10,
      socialSecurityRate: 0.13,
      healthInsuranceRate: 0.08
    },
    'Croatia': {
      incomeTaxRate: 0.20,
      socialSecurityRate: 0.15,
      healthInsuranceRate: 0.05
    },
    'Cyprus': {
      incomeTaxRate: 0.15,
      socialSecurityRate: 0.08,
      healthInsuranceRate: 0.02
    },
    'Czech Republic': {
      incomeTaxRate: 0.15,
      socialSecurityRate: 0.11,
      healthInsuranceRate: 0.04
    },
    'Denmark': {
      incomeTaxRate: 0.35,
      socialSecurityRate: 0.08,
      healthInsuranceRate: 0.00
    },
    'Estonia': {
      incomeTaxRate: 0.20,
      socialSecurityRate: 0.02,
      healthInsuranceRate: 0.13
    },
    'Finland': {
      incomeTaxRate: 0.30,
      socialSecurityRate: 0.08,
      healthInsuranceRate: 0.01
    },
    'France': {
      incomeTaxRate: 0.25,
      socialSecurityRate: 0.13,
      healthInsuranceRate: 0.08
    },
    'Germany': {
      incomeTaxRate: 0.25,
      socialSecurityRate: 0.19,
      healthInsuranceRate: 0.08
    },
    'Greece': {
      incomeTaxRate: 0.22,
      socialSecurityRate: 0.16,
      healthInsuranceRate: 0.07
    },
    'Hungary': {
      incomeTaxRate: 0.15,
      socialSecurityRate: 0.18,
      healthInsuranceRate: 0.07
    },
    'Ireland': {
      incomeTaxRate: 0.25,
      socialSecurityRate: 0.04,
      healthInsuranceRate: 0.00
    },
    'Italy': {
      incomeTaxRate: 0.27,
      socialSecurityRate: 0.10,
      healthInsuranceRate: 0.00
    },
    'Latvia': {
      incomeTaxRate: 0.20,
      socialSecurityRate: 0.11,
      healthInsuranceRate: 0.00
    },
    'Lithuania': {
      incomeTaxRate: 0.15,
      socialSecurityRate: 0.09,
      healthInsuranceRate: 0.06
    },
    'Luxembourg': {
      incomeTaxRate: 0.25,
      socialSecurityRate: 0.11,
      healthInsuranceRate: 0.03
    },
    'Malta': {
      incomeTaxRate: 0.25,
      socialSecurityRate: 0.10,
      healthInsuranceRate: 0.00
    },
    'Netherlands': {
      incomeTaxRate: 0.28,
      socialSecurityRate: 0.12,
      healthInsuranceRate: 0.10
    },
    'Poland': {
      incomeTaxRate: 0.17,
      socialSecurityRate: 0.14,
      healthInsuranceRate: 0.09
    },
    'Portugal': {
      incomeTaxRate: 0.28,
      socialSecurityRate: 0.11,
      healthInsuranceRate: 0.00
    },
    'Romania': {
      incomeTaxRate: 0.10,
      socialSecurityRate: 0.25,
      healthInsuranceRate: 0.10
    },
    'Slovakia': {
      incomeTaxRate: 0.19,
      socialSecurityRate: 0.10,
      healthInsuranceRate: 0.04
    },
    'Slovenia': {
      incomeTaxRate: 0.25,
      socialSecurityRate: 0.22,
      healthInsuranceRate: 0.00
    },
    'Spain': {
      incomeTaxRate: 0.24,
      socialSecurityRate: 0.06,
      healthInsuranceRate: 0.00
    },
    'Sweden': {
      incomeTaxRate: 0.32,
      socialSecurityRate: 0.07,
      healthInsuranceRate: 0.00
    }
  };
  
  return taxRates[countryName] || null;
};
