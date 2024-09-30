'use client';
import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Typography } from '@mui/material';
import styled from 'styled-components';

const ChartContainer = styled.div`
  width: 100%;
  height: 400px;
  @media (max-width: 600px) {
    height: 300px;
  }
`;

interface ChartProps {
  title: string;
  type: 'bar' | 'line' | 'pie';
  data: any;
  options?: any;
}

const Chart: React.FC<ChartProps> = ({ title, type, data, options }) => {
  const defaultOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data} options={{ ...defaultOptions, ...options }} />;
      case 'line':
        return <Line data={data} options={{ ...defaultOptions, ...options }} />;
      case 'pie':
        return (
          <ChartContainer>
            <Pie data={data} options={{ ...defaultOptions, ...options }} />
          </ChartContainer>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Typography variant="h6">{title}</Typography>
      {renderChart()}
    </>
  );
};

export default Chart;
