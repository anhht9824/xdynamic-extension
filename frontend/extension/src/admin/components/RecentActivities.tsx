import React from 'react';
import { Activity } from '../services/admin.service';

interface RecentActivitiesProps {
  activities: Activity[];
}

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
      
      <div className="flex gap-4 mb-6 border-b border-gray-100">
        <button className="pb-2 border-b-2 border-gray-900 font-medium text-sm">Filtered Content</button>
        <button className="pb-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">Logins</button>
        <button className="pb-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">Reports</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-gray-500 font-medium border-b border-gray-100">
            <tr>
              <th className="py-3 font-medium">Content</th>
              <th className="py-3 font-medium">User</th>
              <th className="py-3 font-medium">Date</th>
              <th className="py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {activities.map((activity) => (
              <tr key={activity.id} className="group hover:bg-gray-50 transition-colors">
                <td className="py-4 pr-4 font-medium text-gray-900 max-w-[200px] truncate">
                  {activity.content}
                </td>
                <td className="py-4 px-4 text-blue-600">
                  {activity.user}
                </td>
                <td className="py-4 px-4 text-gray-500">
                  {new Date(activity.date).toLocaleDateString()}
                </td>
                <td className="py-4 pl-4 text-right">
                  <button className="text-gray-500 hover:text-gray-900 font-medium">
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
