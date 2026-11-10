import express from 'express';
import {
  register,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  updateStatus,
  addNote,
  exportStudents,
} from '../controllers/studentController';
import { authenticate } from '../middleware/auth';
import { registrationLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Public routes
router.post('/register', registrationLimiter, register);

// Admin routes
router.get('/students', authenticate, getAllStudents);
router.get('/students/:id', authenticate, getStudent);
router.put('/students/:id', authenticate, updateStudent);
router.delete('/students/:id', authenticate, deleteStudent);
router.put('/students/:id/status', authenticate, updateStatus);
router.post('/students/:id/notes', authenticate, addNote);
router.get('/export/csv', authenticate, exportStudents);

export default router;
