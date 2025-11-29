import React from 'react';
import { TopCategory } from '../services/admin.service';

interface TopCategoriesProps {
  categories: TopCategory[];
}

export const TopCategories: React.FC<TopCategoriesProps> = ({ categories }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Top Blocked Categories</h3>
        <div className="flex items-center mt-1">
          <span className="text-3xl font-bold text-gray-900">30%</span>
          <span className="text-sm text-red-500 ml-2 font-medium">-5%</span>
        </div>
      </div>

      <div className="space-y-6">
        {categories.map((cat, index) => (
          <div key={index}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">{cat.category}</span>
              <span className="text-gray-500">{cat.percentage}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-200 rounded-full" 
                style={{ width: `${cat.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
