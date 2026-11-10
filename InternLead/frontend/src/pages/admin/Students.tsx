import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Eye,
  MessageCircle,
  Trash2,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { studentAPI, campaignAPI } from '../../services/api';
import { Student, Campaign } from '../../types';
import { formatDate, getWhatsAppLink, downloadFile } from '../../utils/helpers';
import { getStatusColor, LEAD_STATUSES, COURSES, CURRENT_YEARS } from '../../utils/constants';
import toast from 'react-hot-toast';

const Students: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    leadStatus: '',
    course: '',
    currentYear: '',
    campaignId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchData = async () => {
    try {
      const [studentsRes, campaignsRes] = await Promise.all([
        studentAPI.getAll(),
        campaignAPI.getAll(),
      ]);
      setStudents(studentsRes.data);
      setCampaigns(campaignsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll(filters);
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to load students');
    }
  };

  const handleExport = async () => {
    try {
      const response = await studentAPI.exportCSV(filters);
      downloadFile(response.data, `students-${Date.now()}.csv`);
      toast.success('Export successful!');
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) {
      return;
    }

    try {
      await studentAPI.delete(id);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" message="Loading students..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            All Students
          </h1>
          <p className="text-gray-600">
            Manage and track student registrations
          </p>
        </div>
        <Button variant="primary" onClick={handleExport}>
          <Download className="w-5 h-5" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            placeholder="Search by name, phone, email..."
            icon={<Search className="w-5 h-5" />}
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />

          <Select
            options={LEAD_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
            value={filters.leadStatus}
            onChange={(e) =>
              setFilters({ ...filters, leadStatus: e.target.value })
            }
          >
            <option value="">All Status</option>
          </Select>

          <Select
            options={COURSES}
            value={filters.course}
            onChange={(e) =>
              setFilters({ ...filters, course: e.target.value })
            }
          >
            <option value="">All Courses</option>
          </Select>

          <Select
            options={CURRENT_YEARS}
            value={filters.currentYear}
            onChange={(e) =>
              setFilters({ ...filters, currentYear: e.target.value })
            }
          >
            <option value="">All Years</option>
          </Select>

          <Select
            options={campaigns.map((c) => ({ value: c.id, label: c.name }))}
            value={filters.campaignId}
            onChange={(e) =>
              setFilters({ ...filters, campaignId: e.target.value })
            }
          >
            <option value="">All Campaigns</option>
          </Select>
        </div>
      </Card>

      {/* Students Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Education
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No students found
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {student.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.registrationId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.phone}
                      </div>
                      {student.email && (
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {student.course} - {student.branch}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.collegeName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {student.currentYear}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {student.interests.slice(0, 2).map((item) => (
                          <Badge key={item.id} variant="info">
                            {item.interest.name}
                          </Badge>
                        ))}
                        {student.interests.length > 2 && (
                          <Badge variant="default">
                            +{student.interests.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          student.leadStatus
                        )}`}
                      >
                        {student.leadStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.campaign?.name || 'Direct'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(student.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/students/${student.id}`)
                          }
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <a
                          href={getWhatsAppLink(
                            student.phone,
                            `Hello ${student.fullName}, Thank you for registering with InternLead!`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </a>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary */}
      <div className="text-center text-sm text-gray-600">
        Showing {students.length} student{students.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default Students;
