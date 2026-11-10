import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { campaignAPI } from '../../services/api';
import { Campaign, CampaignFormData } from '../../types';
import { CAMPAIGN_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';

interface CreateCampaignModalProps {
  campaign?: Campaign | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  campaign,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const isEdit = !!campaign;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CampaignFormData>({
    defaultValues: campaign
      ? {
          name: campaign.name,
          description: campaign.description || '',
          location: campaign.location || '',
          collegeName: campaign.collegeName || '',
          campaignType: campaign.campaignType,
        }
      : undefined,
  });

  const onSubmit = async (data: CampaignFormData) => {
    setLoading(true);
    try {
      if (isEdit) {
        await campaignAPI.update(campaign.id, data);
        toast.success('Campaign updated successfully');
      } else {
        await campaignAPI.create(data);
        toast.success('Campaign created successfully');
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Campaign' : 'Create New Campaign'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <Input
            label="Campaign Name"
            placeholder="e.g., ABC College Drive 2026"
            {...register('name', {
              required: 'Campaign name is required',
              minLength: {
                value: 3,
                message: 'Name must be at least 3 characters',
              },
            })}
            error={errors.name?.message}
          />

          <Select
            label="Campaign Type"
            options={CAMPAIGN_TYPES}
            {...register('campaignType', {
              required: 'Campaign type is required',
            })}
            error={errors.campaignType?.message}
          />

          <Input
            label="College Name"
            placeholder="e.g., ABC College of Engineering"
            {...register('collegeName')}
          />

          <Input
            label="Location"
            placeholder="e.g., Mumbai, Maharashtra"
            {...register('location')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Brief description about this campaign..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              {isEdit ? 'Update Campaign' : 'Create Campaign'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaignModal;
