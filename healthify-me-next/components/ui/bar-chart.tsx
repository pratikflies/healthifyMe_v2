"use-client"

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BarChartProps } from '@/lib/types';

const BarChartComponent = ({ distanceCovered, target } : BarChartProps) => {
  const data = [
    { name: 'Distance Covered', value: distanceCovered },
    { name: 'Target', value: target },
  ];
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


