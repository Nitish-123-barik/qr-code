import prisma from '../config/database';
import QRCode from 'qrcode';
import { CreateCampaignDto } from '../types';
import { generateSlug } from '../utils/validation';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export class CampaignService {
  async create(data: CreateCampaignDto) {
    const slug = generateSlug(data.name) + '-' + Date.now();

    const campaign = await prisma.campaign.create({
      data: {
        name: data.name,
        slug: slug,
        description: data.description,
        location: data.location,
        collegeName: data.collegeName,
        campaignType: data.campaignType,
      },
    });

    // Generate QR code
    const registrationUrl = `${FRONTEND_URL}/register/${slug}`;
    const uniqueCode = `QR-${campaign.id}`;

    await prisma.qRCode.create({
      data: {
        campaignId: campaign.id,
        uniqueCode: uniqueCode,
        registrationUrl: registrationUrl,
      },
    });

    return await this.getById(campaign.id);
  }

  async getAll() {
    const campaigns = await prisma.campaign.findMany({
      include: {
        _count: {
          select: {
            students: true,
          },
        },
        qrCodes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return campaigns;
  }

  async getById(id: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
          },
        },
        qrCodes: true,
      },
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    return campaign;
  }

  async update(id: string, data: Partial<CreateCampaignDto>) {
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        location: data.location,
        collegeName: data.collegeName,
        campaignType: data.campaignType,
      },
    });

    return await this.getById(campaign.id);
  }

  async delete(id: string) {
    await prisma.campaign.delete({
      where: { id },
    });
  }

  async toggleStatus(id: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      throw new Error('Campaign not found');
    }

    const newStatus = campaign.status === 'active' ? 'inactive' : 'active';

    return await prisma.campaign.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  async generateQRCode(campaignId: string) {
    const qrCode = await prisma.qRCode.findFirst({
      where: { campaignId },
    });

    if (!qrCode) {
      throw new Error('QR Code not found');
    }

    const qrCodeDataUrl = await QRCode.toDataURL(qrCode.registrationUrl, {
      width: 400,
      margin: 2,
    });

    return {
      dataUrl: qrCodeDataUrl,
      url: qrCode.registrationUrl,
    };
  }
}
