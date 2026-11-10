import { Request, Response } from 'express';
import { CampaignService } from '../services/campaignService';

const campaignService = new CampaignService();

export const createCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await campaignService.create(req.body);
    res.status(201).json(campaign);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await campaignService.getAll();
    res.json(campaigns);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await campaignService.getById(req.params.id);
    res.json(campaign);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await campaignService.update(req.params.id, req.body);
    res.json(campaign);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    await campaignService.delete(req.params.id);
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const toggleCampaignStatus = async (req: Request, res: Response) => {
  try {
    const campaign = await campaignService.toggleStatus(req.params.id);
    res.json(campaign);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const generateQRCode = async (req: Request, res: Response) => {
  try {
    const qrCode = await campaignService.generateQRCode(req.params.id);
    res.json(qrCode);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
