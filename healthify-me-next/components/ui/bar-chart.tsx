"use-client"

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Category A', value: 500 },
  { name: 'Category B', value: 200 },
];

const BarChartComponent = () => {
  return (
    <BarChart width={250} height={370} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#FF5733" />
    </BarChart>
  );
};

export default BarChartComponent;


