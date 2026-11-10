import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create Admin
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin created:', admin.email);

  // Create Interests
  const interestNames = [
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
  ];

  for (const name of interestNames) {
    await prisma.interest.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('✅ Interests created');

  // Create Campaigns
  const campaigns = [
    {
      name: 'ABC College Campus Drive',
      slug: 'abc-college-2026',
      description: 'Internship drive at ABC College',
      location: 'ABC College Campus',
      collegeName: 'ABC College of Engineering',
      campaignType: 'College',
      status: 'active',
    },
    {
      name: 'XYZ College Seminar',
      slug: 'xyz-college-seminar',
      description: 'Career seminar at XYZ College',
      location: 'XYZ College Auditorium',
      collegeName: 'XYZ Institute of Technology',
      campaignType: 'Seminar',
      status: 'active',
    },
    {
      name: 'LinkedIn Campaign',
      slug: 'linkedin-2026',
      description: 'Social media campaign on LinkedIn',
      campaignType: 'Social Media',
      status: 'active',
    },
  ];

  for (const campaign of campaigns) {
    const created = await prisma.campaign.upsert({
      where: { slug: campaign.slug },
      update: {},
      create: campaign,
    });

    // Create QR Code for campaign
    const registrationUrl = `http://localhost:5173/register/${campaign.slug}`;
    await prisma.qRCode.upsert({
      where: { uniqueCode: `QR-${created.id}` },
      update: {},
      create: {
        campaignId: created.id,
        uniqueCode: `QR-${created.id}`,
        registrationUrl,
      },
    });
  }
  console.log('✅ Campaigns created');

  // Create Sample Students
  const sampleStudents = [
    {
      fullName: 'Rahul Kumar',
      phone: '9876543210',
      email: 'rahul@example.com',
      collegeName: 'ABC College of Engineering',
      course: 'B.Tech',
      branch: 'Computer Science',
      currentYear: '3rd Year',
      preferredMode: 'Online',
      message: 'Interested in Full Stack Development',
      leadStatus: 'New',
      interests: ['Full Stack Development', 'React Development'],
    },
    {
      fullName: 'Priya Sharma',
      phone: '9876543211',
      email: 'priya@example.com',
      collegeName: 'XYZ Institute of Technology',
      course: 'BCA',
      branch: 'Information Technology',
      currentYear: 'Final Year',
      preferredMode: 'Hybrid',
      message: 'Looking for UI/UX internship',
      leadStatus: 'Contacted',
      interests: ['UI/UX Design', 'Frontend Development'],
    },
    {
      fullName: 'Amit Patel',
      phone: '9876543212',
      email: 'amit@example.com',
      collegeName: 'ABC College of Engineering',
      course: 'B.Tech',
      branch: 'AI & ML',
      currentYear: '2nd Year',
      preferredMode: 'Online',
      leadStatus: 'Interested',
      interests: ['AI / Machine Learning', 'Python Development'],
    },
    {
      fullName: 'Sneha Reddy',
      phone: '9876543213',
      collegeName: 'PQR Engineering College',
      course: 'MCA',
      branch: 'Computer Science',
      currentYear: '1st Year',
      preferredMode: 'Offline',
      message: 'Want to learn Data Science',
      leadStatus: 'New',
      interests: ['Data Science', 'Python Development'],
    },
    {
      fullName: 'Vikram Singh',
      phone: '9876543214',
      email: 'vikram@example.com',
      collegeName: 'XYZ Institute of Technology',
      course: 'B.Tech',
      branch: 'Computer Science',
      currentYear: '3rd Year',
      preferredMode: 'Online',
      leadStatus: 'Enrolled',
      interests: ['Backend Development', 'Java Development'],
    },
  ];

  const allCampaigns = await prisma.campaign.findMany();
  const allInterests = await prisma.interest.findMany();

  for (let i = 0; i < sampleStudents.length; i++) {
    const studentData = sampleStudents[i];
    const campaign = allCampaigns[i % allCampaigns.length];

    const student = await prisma.student.create({
      data: {
        fullName: studentData.fullName,
        phone: studentData.phone,
        email: studentData.email,
        collegeName: studentData.collegeName,
        course: studentData.course,
        branch: studentData.branch,
        currentYear: studentData.currentYear,
        preferredMode: studentData.preferredMode,
        message: studentData.message,
        consent: true,
        leadStatus: studentData.leadStatus,
        campaignId: campaign.id,
      },
    });

    // Add interests
    for (const interestName of studentData.interests) {
      const interest = allInterests.find((i) => i.name === interestName);
      if (interest) {
        await prisma.studentInterest.create({
          data: {
            studentId: student.id,
            interestId: interest.id,
          },
        });
      }
    }
  }
  console.log('✅ Sample students created');

  // Create Settings
  await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      companyName: 'InternLead',
      successMessage: 'Thank you for registering! Our team will contact you soon.',
      whatsappContact: '9876543210',
      defaultWhatsappMessage: 'Hello {name}, Thank you for registering for our internship and career opportunities. We would like to know more about your interest in {interest}. Our team will be happy to guide you. Thank you!',
    },
  });
  console.log('✅ Settings created');

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
