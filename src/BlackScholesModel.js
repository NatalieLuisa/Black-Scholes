import React, { useState, useEffect } from 'react';
import { erf } from 'mathjs';
import Plot from 'react-plotly.js';
import './BlackScholesModel.css';

function BlackScholesModel() {
  const [currentAssetPrice, setCurrentAssetPrice] = useState(50);
  const [strikePrice, setStrikePrice] = useState(100);
  const [timeToMaturity, setTimeToMaturity] = useState(0.6);
  const [volatility, setVolatility] = useState(0.2);
  const [riskFreeRate, setRiskFreeRate] = useState(0.05);
  const [minSpotPrice, setMinSpotPrice] = useState(40);
  const [maxSpotPrice, setMaxSpotPrice] = useState(60);
  const [minVolatility, setMinVolatility] = useState(0.01);
  const [maxVolatility, setMaxVolatility] = useState(0.8);
  const [callData, setCallData] = useState([]);
  const [putData, setPutData] = useState([]);
  const [spotPrices, setSpotPrices] = useState([]);
  const [volatilities, setVolatilities] = useState([]);

  useEffect(() => {
    generateHeatmaps();
  }, [minSpotPrice, maxSpotPrice, minVolatility, maxVolatility]);

  const calculateD1 = (S, X, T, r, sigma) => {
    return (Math.log(S / X) + (r + (sigma ** 2) / 2) * T) / (sigma * Math.sqrt(T));
  };

  const calculateD2 = (d1, sigma, T) => {
    return d1 - sigma * Math.sqrt(T);
  };

  const cumulativeDistribution = (x) => {
    return (1 + erf(x / Math.sqrt(2))) / 2;
  };

  const calculateCallPrice = (S, X, T, r, sigma) => {
    const d1 = calculateD1(S, X, T, r, sigma);
    const d2 = calculateD2(d1, sigma, T);
    return (S * cumulativeDistribution(d1) - X * Math.exp(-r * T) * cumulativeDistribution(d2)).toFixed(2);
  };

  const calculatePutPrice = (S, X, T, r, sigma) => {
    const d1 = calculateD1(S, X, T, r, sigma);
    const d2 = calculateD2(d1, sigma, T);
    return (X * Math.exp(-r * T) * cumulativeDistribution(-d2) - S * cumulativeDistribution(-d1)).toFixed(2);
  };

  const handleInputChange = (setter) => (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setter(value);
    }
  };

  const generateHeatmaps = () => {
    const spPrices = [];
    const volats = [];
    const callValues = [];
    const putValues = [];

    const spStep = (maxSpotPrice - minSpotPrice) / 10;
    const volStep = (maxVolatility - minVolatility) / 10;

    if (spStep <= 0 || volStep <= 0) {
      console.error("Invalid step size for heatmap generation.");
      return;
    }

    for (let sp = minSpotPrice; sp <= maxSpotPrice; sp += spStep) {
      spPrices.push(sp.toFixed(2));
    }
    for (let vol = minVolatility; vol <= maxVolatility; vol += volStep) {
      volats.push(vol.toFixed(2));
    }

    for (let i = 0; i < volats.length; i++) {
      const callRow = [];
      const putRow = [];
      for (let j = 0; j < spPrices.length; j++) {
        const callPrice = parseFloat(calculateCallPrice(parseFloat(spPrices[j]), strikePrice, timeToMaturity, riskFreeRate, parseFloat(volats[i])));
        const putPrice = parseFloat(calculatePutPrice(parseFloat(spPrices[j]), strikePrice, timeToMaturity, riskFreeRate, parseFloat(volats[i])));
        callRow.push(callPrice);
        putRow.push(putPrice);
      }
      callValues.push(callRow);
      putValues.push(putRow);
    }

    setSpotPrices(spPrices);
    setVolatilities(volats);
    setCallData(callValues);
    setPutData(putValues);
  };

  return (
    <div className="black-scholes">
      <div className="inputs">
        <label>Black-Scholes Model</label>
        <label>
          Current Asset Price
          <input
            type="number"
            value={currentAssetPrice}
            onChange={handleInputChange(setCurrentAssetPrice)}
          />
        </label>
        <label>
          Strike Price
          <input
            type="number"
            value={strikePrice}
            onChange={handleInputChange(setStrikePrice)}
          />
        </label>
        <label>
          Time to Maturity (Years)
          <input
            type="number"
            value={timeToMaturity}
            onChange={handleInputChange(setTimeToMaturity)}
          />
        </label>
        <label>
          Volatility (σ)
          <input
            type="number"
            value={volatility}
            onChange={handleInputChange(setVolatility)}
          />
        </label>
        <label>
          Risk-Free Interest Rate
          <input
            type="number"
            value={riskFreeRate}
            onChange={handleInputChange(setRiskFreeRate)}
          />
        </label>
        <h3>Heatmap Parameters</h3>
        <label>
          Min Spot Price
          <input
            type="number"
            value={minSpotPrice}
            onChange={handleInputChange(setMinSpotPrice)}
          />
        </label>
        <label>
          Max Spot Price
          <input
            type="number"
            value={maxSpotPrice}
            onChange={handleInputChange(setMaxSpotPrice)}
          />
        </label>
        <label>
          Min Volatility for Heatmap
          <input
            type="range"
            min="0.01"
            max="1.00"
            step="0.01"
            value={minVolatility}
            onChange={handleInputChange(setMinVolatility)}
          />
          <span>{minVolatility}</span>
        </label>
        <label>
          Max Volatility for Heatmap
          <input
            type="range"
            min="0.01"
            max="1.00"
            step="0.01"
            value={maxVolatility}
            onChange={handleInputChange(setMaxVolatility)}
          />
          <span>{maxVolatility}</span>
        </label>
        <button onClick={generateHeatmaps}>Generate Heatmaps</button>
      </div>
      <div className="results">
        <h1>Black-Scholes Pricing Model</h1>
        <table>
          <thead>
            <tr>
              <th>Current Asset Price</th>
              <th>Strike Price</th>
              <th>Time to Maturity (Years)</th>
              <th>Volatility (σ)</th>
              <th>Risk-Free Interest Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{parseFloat(currentAssetPrice).toFixed(4)}</td>
              <td>{parseFloat(strikePrice).toFixed(4)}</td>
              <td>{parseFloat(timeToMaturity).toFixed(4)}</td>
              <td>{parseFloat(volatility).toFixed(4)}</td>
              <td>{parseFloat(riskFreeRate).toFixed(4)}</td>
            </tr>
          </tbody>
        </table>
        <div className="values">
          <div className="call-value">
            <h2>CALL Value</h2>
            <p>${calculateCallPrice(currentAssetPrice, strikePrice, timeToMaturity, riskFreeRate, volatility)}</p>
          </div>
          <div className="put-value">
            <h2>PUT Value</h2>
            <p>${calculatePutPrice(currentAssetPrice, strikePrice, timeToMaturity, riskFreeRate, volatility)}</p>
          </div>
        </div>
      </div>
      <h1 className="centered-header">Options Price - Interactive Heatmap</h1>
      <div className="heatmaps">
        <Plot
          data={[
            {
              x: spotPrices,
              y: volatilities,
              z: callData,
              type: 'heatmap',
              colorscale: 'YlGnBu',
            },
          ]}
          layout={{ title: 'Call Price Heatmap', xaxis: { title: 'Spot Price' }, yaxis: { title: 'Volatility' } }}
        />
        <Plot
          data={[
            {
              x: spotPrices,
              y: volatilities,
              z: putData,
              type: 'heatmap',
              colorscale: 'YlGnBu',
            },
          ]}
          layout={{ title: 'Put Price Heatmap', xaxis: { title: 'Spot Price' }, yaxis: { title: 'Volatility' } }}
        />
      </div>
    </div>
  );
}

export default BlackScholesModel;
