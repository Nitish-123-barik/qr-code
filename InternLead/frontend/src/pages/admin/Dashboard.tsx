import React, { useEffect, useState } from 'react';
import {
  Users,
  UserPlus,
  Phone,
  ThumbsUp,
  GraduationCap,
  XCircle,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import { analyticsAPI } from '../../services/api';
import { DashboardStats } from '../../types';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await analyticsAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" message="Loading dashboard..." />
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'New Leads',
      value: stats.new,
      icon: UserPlus,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Contacted',
      value: stats.contacted,
      icon: Phone,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Interested',
      value: stats.interested,
      icon: ThumbsUp,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Enrolled',
      value: stats.enrolled,
      icon: GraduationCap,
      color: 'bg-teal-500',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Today</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">
            {stats.todayRegistrations}
          </p>
          <p className="text-sm text-gray-600 mt-1">New registrations</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">
            {stats.weekRegistrations}
          </p>
          <p className="text-sm text-gray-600 mt-1">New registrations</p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">
            {stats.monthRegistrations}
          </p>
          <p className="text-sm text-gray-600 mt-1">New registrations</p>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Lead Status Distribution
        </h3>
        <div className="space-y-3">
          {[
            { label: 'New', value: stats.new, total: stats.totalRegistrations, color: 'bg-blue-500' },
            { label: 'Contacted', value: stats.contacted, total: stats.totalRegistrations, color: 'bg-yellow-500' },
            { label: 'Interested', value: stats.interested, total: stats.totalRegistrations, color: 'bg-purple-500' },
            { label: 'Enrolled', value: stats.enrolled, total: stats.totalRegistrations, color: 'bg-green-500' },
          ].map((item) => {
            const percentage = stats.totalRegistrations > 0 
              ? (item.value / item.total) * 100 
              : 0;
            return (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="text-gray-600">
                    {item.value} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
