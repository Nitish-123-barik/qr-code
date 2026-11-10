import express from 'express';
import {
  getDashboard,
  getRegistrationsOverTime,
  getInterestDistribution,
  getCampaignPerformance,
} from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.get('/dashboard', getDashboard);
router.get('/registrations', getRegistrationsOverTime);
router.get('/interests', getInterestDistribution);
router.get('/campaigns', getCampaignPerformance);

export default router;
