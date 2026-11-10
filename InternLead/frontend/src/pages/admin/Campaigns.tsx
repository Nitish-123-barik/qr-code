import React, { useEffect, useState } from 'react';
import {
  Plus,
  QrCode,
  Download,
  Copy,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Users,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import { campaignAPI } from '../../services/api';
import { Campaign } from '../../types';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';
import CreateCampaignModal from '../../components/admin/CreateCampaignModal';

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await campaignAPI.getAll();
      setCampaigns(response.data);
    } catch (error) {
      toast.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleViewQR = async (campaignId: string) => {
    try {
      const response = await campaignAPI.getQRCode(campaignId);
      const { dataUrl, url } = response.data;

      // Open in new window with QR code
      const qrWindow = window.open('', '_blank', 'width=500,height=600');
      if (qrWindow) {
        qrWindow.document.write(`
          <html>
            <head>
              <title>QR Code</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  padding: 20px;
                  background: #f9fafb;
                }
                img {
                  max-width: 400px;
                  border: 2px solid #e5e7eb;
                  border-radius: 8px;
                  background: white;
                  padding: 20px;
                }
                .url {
                  margin-top: 20px;
                  padding: 10px;
                  background: white;
                  border: 1px solid #e5e7eb;
                  border-radius: 4px;
                  word-break: break-all;
                }
                button {
                  margin-top: 20px;
                  padding: 10px 20px;
                  background: #3b82f6;
                  color: white;
                  border: none;
                  border-radius: 6px;
                  cursor: pointer;
                }
                button:hover {
                  background: #2563eb;
                }
              </style>
            </head>
            <body>
              <h2>Campaign QR Code</h2>
              <img src="${dataUrl}" alt="QR Code" />
              <div class="url">${url}</div>
              <button onclick="window.print()">Download / Print</button>
            </body>
          </html>
        `);
      }
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  const handleCopyUrl = (campaign: Campaign) => {
    const url = campaign.qrCodes?.[0]?.registrationUrl || '';
    navigator.clipboard.writeText(url);
    toast.success('Registration URL copied!');
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await campaignAPI.toggleStatus(id);
      toast.success('Campaign status updated');
      fetchCampaigns();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) {
      return;
    }

    try {
      await campaignAPI.delete(id);
      toast.success('Campaign deleted successfully');
      fetchCampaigns();
    } catch (error) {
      toast.error('Failed to delete campaign');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader size="lg" message="Loading campaigns..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            QR Campaigns
          </h1>
          <p className="text-gray-600">
            Create and manage QR code campaigns
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingCampaign(null);
            setShowCreateModal(true);
          }}
        >
          <Plus className="w-5 h-5" />
          Create Campaign
        </Button>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {campaign.name}
                  </h3>
                  <Badge
                    variant={
                      campaign.status === 'active' ? 'success' : 'default'
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>
                <button
                  onClick={() => handleToggleStatus(campaign.id)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Toggle Status"
                >
                  {campaign.status === 'active' ? (
                    <ToggleRight className="w-6 h-6 text-green-600" />
                  ) : (
                    <ToggleLeft className="w-6 h-6" />
                  )}
                </button>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>
                    {campaign._count?.students || 0} registrations
                  </span>
                </div>

                <div>
                  <span className="text-gray-600">Type:</span>{' '}
                  <span className="font-medium">{campaign.campaignType}</span>
                </div>

                {campaign.collegeName && (
                  <div>
                    <span className="text-gray-600">College:</span>{' '}
                    <span className="font-medium">{campaign.collegeName}</span>
                  </div>
                )}

                {campaign.location && (
                  <div>
                    <span className="text-gray-600">Location:</span>{' '}
                    <span className="font-medium">{campaign.location}</span>
                  </div>
                )}

                <div>
                  <span className="text-gray-600">Created:</span>{' '}
                  <span className="font-medium">
                    {formatDate(campaign.createdAt)}
                  </span>
                </div>
              </div>

              {/* Description */}
              {campaign.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {campaign.description}
                </p>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleViewQR(campaign.id)}
                >
                  <QrCode className="w-4 h-4" />
                  View QR
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopyUrl(campaign)}
                >
                  <Copy className="w-4 h-4" />
                  Copy URL
                </Button>

                <button
                  onClick={() => handleDelete(campaign.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {campaigns.length === 0 && (
        <Card className="text-center py-12">
          <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No campaigns yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first QR campaign to start tracking registrations
          </p>
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-5 h-5" />
            Create Campaign
          </Button>
        </Card>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <CreateCampaignModal
          campaign={editingCampaign}
          onClose={() => {
            setShowCreateModal(false);
            setEditingCampaign(null);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            setEditingCampaign(null);
            fetchCampaigns();
          }}
        />
      )}
    </div>
  );
};

export default Campaigns;
