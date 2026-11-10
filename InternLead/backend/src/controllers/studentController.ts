import { Request, Response } from 'express';
import { StudentService } from '../services/studentService';
import { AuthRequest } from '../middleware/auth';

const studentService = new StudentService();

export const register = async (req: Request, res: Response) => {
  try {
    const student = await studentService.register(req.body);
    res.status(201).json({
      message: 'Registration successful',
      student,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const filters = {
      search: req.query.search as string,
      college: req.query.college as string,
      course: req.query.course as string,
      currentYear: req.query.currentYear as string,
      leadStatus: req.query.leadStatus as string,
      campaignId: req.query.campaignId as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };

    const students = await studentService.getAll(filters);
    res.json(students);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    const student = await studentService.getById(req.params.id);
    res.json(student);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await studentService.update(req.params.id, req.body);
    res.json(student);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    await studentService.delete(req.params.id);
    res.json({ message: 'Student deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const student = await studentService.updateStatus(
      req.params.id,
      req.body,
      req.user!.id
    );
    res.json(student);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const addNote = async (req: AuthRequest, res: Response) => {
  try {
    const student = await studentService.addNote(
      req.params.id,
      req.body,
      req.user!.id
    );
    res.json(student);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const exportStudents = async (req: Request, res: Response) => {
  try {
    const filters = {
      search: req.query.search as string,
      college: req.query.college as string,
      course: req.query.course as string,
      currentYear: req.query.currentYear as string,
      leadStatus: req.query.leadStatus as string,
      campaignId: req.query.campaignId as string,
      startDate: req.query.startDate as string,
      endDate: req.query.endDate as string,
    };

    const students = await studentService.getAll(filters);

    // Convert to CSV format
    const csvHeaders = [
      'Registration ID',
      'Full Name',
      'Phone',
      'Email',
      'College',
      'Course',
      'Branch',
      'Year',
      'Interests',
      'Preferred Mode',
      'Lead Status',
      'Campaign',
      'Registration Date',
    ];

    const csvRows = students.map((student) => [
      student.registrationId,
      student.fullName,
      student.phone,
      student.email || '',
      student.collegeName,
      student.course,
      student.branch,
      student.currentYear,
      student.interests.map((i) => i.interest.name).join('; '),
      student.preferredMode,
      student.leadStatus,
      student.campaign?.name || 'Direct',
      new Date(student.createdAt).toLocaleString(),
    ]);

    const csv = [
      csvHeaders.join(','),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="students-${Date.now()}.csv"`
    );
    res.send(csv);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
