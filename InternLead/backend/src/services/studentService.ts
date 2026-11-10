import prisma from '../config/database';
import { RegisterStudentDto, UpdateStudentDto, AddNoteDto, UpdateStatusDto } from '../types';
import { validatePhone, validateEmail } from '../utils/validation';

export class StudentService {
  async register(data: RegisterStudentDto) {
    // Validate phone
    if (!validatePhone(data.phone)) {
      throw new Error('Invalid phone number format');
    }

    // Validate email if provided
    if (data.email && !validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    // Check for duplicate phone
    const existingStudent = await prisma.student.findUnique({
      where: { phone: data.phone },
    });

    if (existingStudent) {
      throw new Error('You have already registered with us');
    }

    // Find campaign if slug provided
    let campaignId = null;
    if (data.campaignSlug) {
      const campaign = await prisma.campaign.findUnique({
        where: { slug: data.campaignSlug },
      });
      campaignId = campaign?.id || null;
    }

    // Create student
    const student = await prisma.student.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        collegeName: data.collegeName,
        course: data.course,
        branch: data.branch,
        currentYear: data.currentYear,
        preferredMode: data.preferredMode,
        message: data.message,
        consent: data.consent,
        campaignId: campaignId,
      },
    });

    // Add interests
    for (const interestName of data.interests) {
      let interest = await prisma.interest.findUnique({
        where: { name: interestName },
      });

      if (!interest) {
        interest = await prisma.interest.create({
          data: { name: interestName },
        });
      }

      await prisma.studentInterest.create({
        data: {
          studentId: student.id,
          interestId: interest.id,
        },
      });
    }

    return await this.getById(student.id);
  }

  async getAll(filters?: any) {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { fullName: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { collegeName: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters?.college) {
      where.collegeName = { contains: filters.college, mode: 'insensitive' };
    }

    if (filters?.course) {
      where.course = filters.course;
    }

    if (filters?.currentYear) {
      where.currentYear = filters.currentYear;
    }

    if (filters?.leadStatus) {
      where.leadStatus = filters.leadStatus;
    }

    if (filters?.campaignId) {
      where.campaignId = filters.campaignId;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.createdAt.lte = new Date(filters.endDate);
      }
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        interests: {
          include: {
            interest: true,
          },
        },
        campaign: {
          select: {
            name: true,
            campaignType: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return students;
  }

  async getById(id: string) {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        interests: {
          include: {
            interest: true,
          },
        },
        campaign: true,
        notes: {
          include: {
            admin: {
              select: {
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        statusHistory: {
          include: {
            admin: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!student) {
      throw new Error('Student not found');
    }

    return student;
  }

  async update(id: string, data: UpdateStudentDto) {
    if (data.phone && !validatePhone(data.phone)) {
      throw new Error('Invalid phone number format');
    }

    if (data.email && !validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    const updateData: any = { ...data };
    delete updateData.interests;

    const student = await prisma.student.update({
      where: { id },
      data: updateData,
    });

    // Update interests if provided
    if (data.interests) {
      await prisma.studentInterest.deleteMany({
        where: { studentId: id },
      });

      for (const interestName of data.interests) {
        let interest = await prisma.interest.findUnique({
          where: { name: interestName },
        });

        if (!interest) {
          interest = await prisma.interest.create({
            data: { name: interestName },
          });
        }

        await prisma.studentInterest.create({
          data: {
            studentId: student.id,
            interestId: interest.id,
          },
        });
      }
    }

    return await this.getById(id);
  }

  async delete(id: string) {
    await prisma.student.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, data: UpdateStatusDto, adminId: string) {
    const student = await prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new Error('Student not found');
    }

    const oldStatus = student.leadStatus;

    await prisma.student.update({
      where: { id },
      data: { leadStatus: data.status },
    });

    await prisma.leadStatusHistory.create({
      data: {
        studentId: id,
        oldStatus: oldStatus,
        newStatus: data.status,
        changedBy: adminId,
      },
    });

    return await this.getById(id);
  }

  async addNote(id: string, data: AddNoteDto, adminId: string) {
    await prisma.leadNote.create({
      data: {
        studentId: id,
        adminId: adminId,
        note: data.note,
      },
    });

    return await this.getById(id);
  }
}
