import express from 'express';
import {
  createCampaign,
  getAllCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  toggleCampaignStatus,
  generateQRCode,
} from '../controllers/campaignController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/', createCampaign);
router.get('/', getAllCampaigns);
router.get('/:id', getCampaign);
router.put('/:id', updateCampaign);
router.delete('/:id', deleteCampaign);
router.patch('/:id/toggle-status', toggleCampaignStatus);
router.get('/:id/qrcode', generateQRCode);

export default router;
