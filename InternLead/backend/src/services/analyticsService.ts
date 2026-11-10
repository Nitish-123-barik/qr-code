import prisma from '../config/database';

export class AnalyticsService {
  async getDashboardStats() {
    const totalRegistrations = await prisma.student.count();
    
    const statusCounts = await prisma.student.groupBy({
      by: ['leadStatus'],
      _count: true,
    });

    const stats: any = {
      totalRegistrations,
      new: 0,
      contacted: 0,
      interested: 0,
      enrolled: 0,
      rejected: 0,
      followUp: 0,
    };

    statusCounts.forEach((status) => {
      const statusName = status.leadStatus.toLowerCase().replace(/\s+/g, '');
      if (statusName === 'new') stats.new = status._count;
      else if (statusName === 'contacted') stats.contacted = status._count;
      else if (statusName === 'interested') stats.interested = status._count;
      else if (statusName === 'enrolled') stats.enrolled = status._count;
      else if (statusName === 'rejected' || statusName === 'notinterested') {
        stats.rejected += status._count;
      } else if (statusName === 'followup') stats.followUp = status._count;
    });

    // Today's registrations
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRegistrations = await prisma.student.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    // This week's registrations
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekRegistrations = await prisma.student.count({
      where: {
        createdAt: {
          gte: weekAgo,
        },
      },
    });

    // This month's registrations
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const monthRegistrations = await prisma.student.count({
      where: {
        createdAt: {
          gte: monthAgo,
        },
      },
    });

    return {
      ...stats,
      todayRegistrations,
      weekRegistrations,
      monthRegistrations,
    };
  }

  async getRegistrationsOverTime(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const registrations = await prisma.student.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
      },
    });

    const grouped: { [key: string]: number } = {};

    registrations.forEach((reg) => {
      const date = reg.createdAt.toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getInterestDistribution() {
    const interests = await prisma.interest.findMany({
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    return interests.map((interest) => ({
      name: interest.name,
      count: interest._count.students,
    }));
  }

  async getCampaignPerformance() {
    const campaigns = await prisma.campaign.findMany({
      include: {
        _count: {
          select: {
            students: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return campaigns.map((campaign) => ({
      name: campaign.name,
      type: campaign.campaignType,
      registrations: campaign._count.students,
    }));
  }
}
