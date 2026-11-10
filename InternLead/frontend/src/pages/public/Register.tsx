import { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    collegeName: '',
    course: '',
    branch: '',
    currentYear: '',
    preferredMode: '',
    message: '',
    consent: false
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interests = [
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
    'Business Development'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      alert('Please accept the consent checkbox');
      return;
    }

    if (selectedInterests.length === 0) {
      alert('Please select at least one interest');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          interests: selectedInterests
        })
      });

      if (response.ok) {
        alert('Registration Successful! ✅');
        // Reset form
        setFormData({
          fullName: '', phone: '', email: '', collegeName: '',
          course: '', branch: '', currentYear: '', preferredMode: '',
          message: '', consent: false
        });
        setSelectedInterests([]);
      } else {
        const error = await response.json();
        alert('Error: ' + (error.error || 'Registration failed'));
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 InternLead
          </h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Start Your Career Journey
          </h2>
          <p className="text-gray-600">
            Register now for internship and career opportunities
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[6-9][0-9]{9}"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="your.email@example.com (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Education Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Education Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    College Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.collegeName}
                    onChange={(e) => setFormData({...formData, collegeName: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Enter your college name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.course}
                    onChange={(e) => setFormData({...formData, course: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select course</option>
                    <option>B.Tech</option>
                    <option>BCA</option>
                    <option>MCA</option>
                    <option>BBA</option>
                    <option>MBA</option>
                    <option>B.Sc</option>
                    <option>Diploma</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select branch</option>
                    <option>Computer Science</option>
                    <option>Information Technology</option>
                    <option>AI & ML</option>
                    <option>Data Science</option>
                    <option>Mechanical</option>
                    <option>Civil</option>
                    <option>Electronics</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.currentYear}
                    onChange={(e) => setFormData({...formData, currentYear: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select year</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>Final Year</option>
                    <option>Graduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Mode <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.preferredMode}
                    onChange={(e) => setFormData({...formData, preferredMode: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select mode</option>
                    <option>Online</option>
                    <option>Offline</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Interests */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What are you interested in? <span className="text-red-500">*</span>
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Select all that apply (minimum 1 required)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedInterests.includes(interest)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedInterests.includes(interest)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedInterests.includes(interest) && (
                          <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium">{interest}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message / Questions
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Tell us what you are looking for..."
              />
            </div>

            {/* Consent */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                required
                checked={formData.consent}
                onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700">
                I agree to be contacted regarding internship, courses and career opportunities. <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition-all text-lg"
            >
              🚀 Register Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
