import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';
import { erf } from 'mathjs';

const generateData = (minSpotPrice, maxSpotPrice, minVolatility, maxVolatility, calculateCallPrice, calculatePutPrice) => {
  const spotPrices = Array.from({ length: 10 }, (_, i) => minSpotPrice + ((maxSpotPrice - minSpotPrice) / 9) * i);
  const volatilities = Array.from({ length: 10 }, (_, i) => minVolatility + ((maxVolatility - minVolatility) / 9) * i);

  const callData = spotPrices.map((S) => {
    return volatilities.map((sigma) => {
      return calculateCallPrice(S, sigma);
    });
  });

  const putData = spotPrices.map((S) => {
    return volatilities.map((sigma) => {
      return calculatePutPrice(S, sigma);
    });
  });

  return { callData, putData, spotPrices, volatilities };
};

const Heatmap = ({ minSpotPrice, maxSpotPrice, minVolatility, maxVolatility, calculateCallPrice, calculatePutPrice }) => {
  const callCanvasRef = useRef(null);
  const putCanvasRef = useRef(null);

  useEffect(() => {
    const { callData, putData, spotPrices, volatilities } = generateData(minSpotPrice, maxSpotPrice, minVolatility, maxVolatility, calculateCallPrice, calculatePutPrice);

    if (callCanvasRef.current) {
      new Chart(callCanvasRef.current, {
        type: 'matrix',
        data: {
          datasets: [{
            label: 'Call Price Heatmap',
            data: callData.flat(),
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          }]
        }
      });
    }

    if (putCanvasRef.current) {
      new Chart(putCanvasRef.current, {
        type: 'matrix',
        data: {
          datasets: [{
            label: 'Put Price Heatmap',
            data: putData.flat(),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }]
        }
      });
    }
  }, [minSpotPrice, maxSpotPrice, minVolatility, maxVolatility, calculateCallPrice, calculatePutPrice]);

  return (
    <div>
      <h2>Call Price Heatmap</h2>
      <canvas ref={callCanvasRef}></canvas>
      <h2>Put Price Heatmap</h2>
      <canvas ref={putCanvasRef}></canvas>
    </div>
  );
};

export default Heatmap;
