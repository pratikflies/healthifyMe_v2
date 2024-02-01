"use-client"

import React from 'react';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import { PieChartProps } from '@/lib/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChartComponent = ({ runningCount, cyclingCount, swimmingCount } : PieChartProps) => {
   const data = [
    { name: "Running", value: runningCount },
    { name: "Cycling", value: cyclingCount },
    { name: "Swimming", value: swimmingCount },
  ];
  return (
    <PieChart width={400} height={400}>
      <Pie
        dataKey="value"
        isAnimationActive={true}
        data={data}
        cx={180}
        cy={150}
        outerRadius={120}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend />
      <Tooltip />
    </PieChart>
  );
};

export default PieChartComponent;