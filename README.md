# Black-Scholes
This web application calculates the prices of Call and Put options using the Black-Scholes model. It also provides interactive heatmaps to visualize how the option prices change with varying spot prices and volatilities.

## Features

- Calculate Call and Put option prices based on user inputs
- Interactive heatmaps to visualize option prices
- Responsive design for different screen sizes
Usage
Open the web application in your browser.
Enter the required inputs for the Black-Scholes model:
Current Asset Price
Strike Price
Time to Maturity (Years)
Volatility (σ)
Risk-Free Interest Rate
Adjust the heatmap parameters:
Min and Max Spot Price
Min and Max Volatility
Click on the "Generate Heatmaps" button to visualize the option prices on the heatmaps.
Project Structure
src/: Contains the source code for the project.
BlackScholesModel.js: Main component for the Black-Scholes pricing model and heatmaps.
BlackScholesModel.css: Styling for the Black-Scholes model component.
index.js: Entry point for the React application.
App.js: Root component for the application.
public/: Contains the public assets and HTML file.
Technologies Used
React
Plotly.js for interactive heatmaps
CSS for styling
HTML
js
