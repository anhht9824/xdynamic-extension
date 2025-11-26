import React from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { 
  FileText, 
  Image, 
  Video, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Download,
  Filter,
  Eye
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell 
} from 'recharts';

const statsCards = [
  { 
    title: 'Total Content', 
    value: '5,678', 
    icon: FileText, 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-50',
    change: '+12%'
  },
  { 
    title: 'Flagged Content', 
    value: '234', 
    icon: AlertTriangle, 
    color: 'text-orange-600', 
    bgColor: 'bg-orange-50',
    change: '+8%'
  },
  { 
    title: 'Approved Content', 
    value: '5,444', 
    icon: CheckCircle, 
    color: 'text-green-600', 
    bgColor: 'bg-green-50',
    change: '+15%'
  },
  { 
    title: 'Engagement Rate', 
    value: '87%', 
    icon: Activity, 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50',
    change: '+3%'
  },
];

const contentTypeData = [
  { name: 'Text', value: 60, color: '#007BFF' },
  { name: 'Image', value: 25, color: '#28A745' },
  { name: 'Video', value: 15, color: '#FFC107' },
];

const trendData = [
  { month: 'Jan', flagged: 180, approved: 4200 },
  { month: 'Feb', flagged: 195, approved: 4500 },
  { month: 'Mar', flagged: 210, approved: 4800 },
  { month: 'Apr', flagged: 225, approved: 5100 },
  { month: 'May', flagged: 234, approved: 5444 },
];

interface ContentItem {
  id: string;
  preview: string;
  type: 'Text' | 'Image' | 'Video';
  views: number;
  flags: number;
  date: string;
}

const topContent: ContentItem[] = [
  { id: '1', preview: 'Product Review: Amazing Quality...', type: 'Text', views: 12543, flags: 2, date: '2024-10-01' },
  { id: '2', preview: 'Tutorial_Video_Final.mp4', type: 'Video', views: 8932, flags: 0, date: '2024-10-02' },
  { id: '3', preview: 'Product_Image_001.jpg', type: 'Image', views: 7821, flags: 1, date: '2024-10-03' },
  { id: '4', preview: 'Customer Testimonial Post...', type: 'Text', views: 6543, flags: 3, date: '2024-10-04' },
  { id: '5', preview: 'Feature_Demo.mp4', type: 'Video', views: 5432, flags: 0, date: '2024-10-05' },
];

export const ContentAnalytics: React.FC = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Text': return <FileText className="w-4 h-4" />;
      case 'Image': return <Image className="w-4 h-4" />;
      case 'Video': return <Video className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Analytics</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor and analyze content performance</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn btn-secondary flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter Trends</span>
            </button>
            <button className="btn btn-primary flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-green-600 font-medium">{stat.change}</span>
                      <span className="text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`${stat.bgColor} p-4 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart - Content Types */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Content Distribution</h3>
              <div className="text-xs text-gray-500">By Type</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Text (60%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Image (25%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Video (15%)</span>
              </div>
            </div>
          </div>

          {/* Line Chart - Trends */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Flagged Content Trends</h3>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-green-600 font-medium">+8%</span>
                <span className="text-gray-500">increase</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="flagged" 
                  stroke="#FFC107" 
                  strokeWidth={3}
                  name="Flagged"
                  dot={{ fill: '#FFC107', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="approved" 
                  stroke="#28A745" 
                  strokeWidth={3}
                  name="Approved"
                  dot={{ fill: '#28A745', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Content Table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Content</h3>
            <p className="text-sm text-gray-500 mt-1">Most viewed content in the last 30 days</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Content Preview
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Flags
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topContent.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{content.preview}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">{getTypeIcon(content.type)}</span>
                        <span className="text-sm text-gray-600">{content.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {content.views.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${content.flags === 0 ? 'badge-success' : content.flags > 2 ? 'badge-danger' : 'badge-warning'}`}>
                        {content.flags} flag{content.flags !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {content.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <button className="btn btn-secondary text-sm">View Details</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
