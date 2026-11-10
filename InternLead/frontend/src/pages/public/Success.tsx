import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, MessageCircle } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const Success: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const student = location.state?.student;

  if (!student) {
    navigate('/register');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <Card className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🎉 Registration Successful!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for registering with us
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">
              Registration Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Registration ID:</span>
                <span className="font-mono font-semibold text-blue-600">
                  {student.registrationId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{student.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{student.phone}</span>
              </div>
              {student.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{student.email}</span>
                </div>
              )}
            </div>

            {student.interests && student.interests.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-600 text-sm mb-2">Selected Interests:</p>
                <div className="flex flex-wrap gap-2">
                  {student.interests.map((item: any) => (
                    <Badge key={item.id} variant="info">
                      {item.interest.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
            <p className="text-gray-700 text-sm">
              Our team will review your details and contact you soon regarding
              internship and career opportunities. Please keep your phone
              accessible.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Button>
            <Button
              variant="success"
              onClick={() =>
                window.open(
                  `https://wa.me/919876543210?text=Hi, I just registered with ID: ${student.registrationId}`,
                  '_blank'
                )
              }
              className="w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5" />
              Contact Us on WhatsApp
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Success;
