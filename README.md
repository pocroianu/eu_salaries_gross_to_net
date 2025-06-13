# EU Salaries: Gross to Net Visualization

An interactive visualization tool for comparing net salaries after taxes and social security deductions across European countries.

## Features

- Interactive salary input with slider
- Country selection for detailed breakdown
- Visual breakdown of tax and social security deductions
- European map with color-coded net salary percentages
- Comparison chart of top countries by net salary percentage

## Project Overview

This application allows users to:
- Input a gross salary amount
- Select a European country
- View a detailed breakdown of taxes and deductions
- Compare net salary percentages across European countries
- Visualize the data on an interactive map and chart

## Data Visualization

The project includes several types of visualizations:
1. **Salary Breakdown** - Shows the detailed breakdown of gross salary into net salary and various deductions
2. **European Map** - Color-coded map showing net salary percentages across Europe
3. **Comparison Chart** - Bar chart comparing the top countries by net salary percentage

## Technical Details

- Built with Vite for optimal performance
- React for component-based UI
- D3.js and react-simple-maps for the interactive European map
- Recharts for responsive and interactive charts

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

### Building for Production

Build the project for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Data Sources

The current implementation uses sample data for demonstration purposes. In a production environment, this would be replaced with actual tax rates and calculations for each European country.

## Disclaimer

This visualization is for informational purposes only and may not reflect all tax situations. The calculations are simplified and may not account for all tax brackets, deductions, or special circumstances that might apply in each country.

## License

MIT
