import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AccuracyStats } from '../services/admin.service';

interface AccuracyChartProps {
  data: AccuracyStats;
}

export const AccuracyChart: React.FC<AccuracyChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Accurate', value: data.accurate_count },
    { name: 'Inaccurate', value: data.inaccurate_count },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Detection Accuracy</h3>
        <div className="flex items-center mt-1">
          <span className="text-3xl font-bold text-gray-900">{data.accuracy_percentage}%</span>
          <span className="text-sm text-green-600 ml-2 font-medium">+{data.last_30_days_change}%</span>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={60}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              <Cell fill="#E5E7EB" />
              <Cell fill="#E5E7EB" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
