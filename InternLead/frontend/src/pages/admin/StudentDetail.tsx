import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  GraduationCap,
  MessageCircle,
  Calendar,
  Edit,
  Save,
  X,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Select from '../../components/common/Select';
import { studentAPI } from '../../services/api';
import { Student } from '../../types';
import { formatDateTime, getWhatsAppLink } from '../../utils/helpers';
import { getStatusColor, LEAD_STATUSES } from '../../utils/constants';
import toast from 'react-hot-toast';

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      const response = await studentAPI.getById(id!);
      setStudent(response.data);
      setSelectedStatus(response.data.leadStatus);
    } catch (error) {
      toast.error('Failed to load student details');
      navigate('/admin/students');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note');
      return;
    }

    setAddingNote(true);
    try {
      await studentAPI.addNote(id!, newNote);
      toast.success('Note added successfully');
      setNewNote('');
      fetchStudent();
    } catch (error) {
      toast.error('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (selectedStatus === student?.leadStatus) {
      return;
    }

    setUpdatingStatus(true);
    try {
      await studentAPI.updateStatus(id!, selectedStatus);
      toast.success('Status updated successfully');
      fetchStudent();
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" message="Loading student details..." />
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="secondary" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {student.fullName}
          </h1>
          <p className="text-gray-600">Registration ID: {student.registrationId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{student.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{student.phone}</p>
                </div>
              </div>
              {student.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{student.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Registration Date</p>
                  <p className="font-medium">{formatDateTime(student.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Button
                variant="success"
                onClick={() =>
                  window.open(
                    getWhatsAppLink(
                      student.phone,
                      `Hello ${student.fullName}, Thank you for registering with InternLead!`
                    ),
                    '_blank'
                  )
                }
              >
                <MessageCircle className="w-5 h-5" />
                Contact via WhatsApp
              </Button>
            </div>
          </Card>

          {/* Education Information */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Education Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">College</p>
                <p className="font-medium">{student.collegeName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Course</p>
                <p className="font-medium">{student.course}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Branch</p>
                <p className="font-medium">{student.branch}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Year</p>
                <p className="font-medium">{student.currentYear}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Preferred Mode</p>
                <p className="font-medium">{student.preferredMode}</p>
              </div>
            </div>
          </Card>

          {/* Interests */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Interests
            </h2>
            <div className="flex flex-wrap gap-2">
              {student.interests.map((item) => (
                <Badge key={item.id} variant="info">
                  {item.interest.name}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Message */}
          {student.message && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Message
              </h2>
              <p className="text-gray-700">{student.message}</p>
            </Card>
          )}

          {/* Notes */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes</h2>
            
            {/* Add Note Form */}
            <div className="mb-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Add a note about this student..."
              />
              <div className="mt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddNote}
                  loading={addingNote}
                  disabled={!newNote.trim()}
                >
                  <Save className="w-4 h-4" />
                  Add Note
                </Button>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-4">
              {student.notes && student.notes.length > 0 ? (
                student.notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <p className="text-gray-800 mb-2">{note.note}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{note.admin.name}</span>
                      <span>{formatDateTime(note.createdAt)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No notes yet</p>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Lead Status
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Current Status</p>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    student.leadStatus
                  )}`}
                >
                  {student.leadStatus}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <Select
                  options={LEAD_STATUSES.map((s) => ({
                    value: s.value,
                    label: s.label,
                  }))}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                />
              </div>

              <Button
                variant="primary"
                onClick={handleUpdateStatus}
                loading={updatingStatus}
                disabled={selectedStatus === student.leadStatus}
                className="w-full"
              >
                <Save className="w-5 h-5" />
                Update Status
              </Button>
            </div>
          </Card>

          {/* Campaign Info */}
          {student.campaign && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Campaign
              </h2>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Campaign Name</p>
                  <p className="font-medium">{student.campaign.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <Badge>{student.campaign.campaignType}</Badge>
                </div>
                {student.campaign.location && (
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{student.campaign.location}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Status History */}
          {student.statusHistory && student.statusHistory.length > 0 && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Status History
              </h2>
              <div className="space-y-3">
                {student.statusHistory.map((history) => (
                  <div
                    key={history.id}
                    className="text-sm border-l-2 border-blue-500 pl-3"
                  >
                    <p className="font-medium text-gray-900">
                      {history.oldStatus || 'New'} → {history.newStatus}
                    </p>
                    <p className="text-gray-600 text-xs mt-1">
                      {history.admin.name} • {formatDateTime(history.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
