import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analyticsService';

const analyticsService = new AnalyticsService();

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getDashboardStats();
    res.json(stats);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getRegistrationsOverTime = async (req: Request, res: Response) => {
  try {
    const days = parseInt(req.query.days as string) || 30;
    const data = await analyticsService.getRegistrationsOverTime(days);
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getInterestDistribution = async (req: Request, res: Response) => {
  try {
    const data = await analyticsService.getInterestDistribution();
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const getCampaignPerformance = async (req: Request, res: Response) => {
  try {
    const data = await analyticsService.getCampaignPerformance();
    res.json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
