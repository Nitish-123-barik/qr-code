export const COURSES = [
  'B.Tech',
  'BCA',
  'MCA',
  'BBA',
  'MBA',
  'B.Sc',
  'M.Sc',
  'Diploma',
  'Other',
];

export const BRANCHES = [
  'Computer Science',
  'Information Technology',
  'AI & ML',
  'Data Science',
  'Mechanical',
  'Civil',
  'Electronics',
  'Electrical',
  'Other',
];

export const CURRENT_YEARS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  'Final Year',
  'Graduate',
];

export const INTERESTS = [
  'Full Stack Development',
  'Frontend Development',
  'Backend Development',
  'React Development',
  'Python Development',
  'Java Development',
  'AI / Machine Learning',
  'Data Science',
  'UI/UX Design',
  'Digital Marketing',
  'Graphic Design',
  'Business Development',
  'Other',
];

export const PREFERRED_MODES = ['Online', 'Offline', 'Hybrid'];

export const LEAD_STATUSES = [
  { value: 'New', label: 'New', color: 'bg-blue-100 text-blue-800' },
  { value: 'Contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'Interested', label: 'Interested', color: 'bg-purple-100 text-purple-800' },
  { value: 'Follow Up', label: 'Follow Up', color: 'bg-orange-100 text-orange-800' },
  { value: 'Enrolled', label: 'Enrolled', color: 'bg-green-100 text-green-800' },
  { value: 'Not Interested', label: 'Not Interested', color: 'bg-gray-100 text-gray-800' },
  { value: 'Rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
];

export const CAMPAIGN_TYPES = [
  'College',
  'Seminar',
  'Pamphlet',
  'Event',
  'Social Media',
  'Other',
];

export const getStatusColor = (status: string) => {
  const statusObj = LEAD_STATUSES.find(
    (s) => s.value.toLowerCase() === status.toLowerCase()
  );
  return statusObj?.color || 'bg-gray-100 text-gray-800';
};
