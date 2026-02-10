import { User, ProfileStatus } from '@/lib/types';
import { X, Check, XCircle } from 'lucide-react';

interface UserDetailModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: UserDetailModalProps) {
  if (!isOpen) return null;

  const handleApprove = () => {
    onApprove(user.id);
    onClose();
  };

  const handleReject = () => {
    onReject(user.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h3>
              <div className="space-y-3">
                <InfoItem label="Full Name" value={`${user.name} ${user.surname}`} />
                <InfoItem label="Email" value={user.email} />
                <InfoItem label="Gender" value={user.gender} />
                <InfoItem label="Date of Birth" value={new Date(user.dob).toLocaleDateString()} />
                <InfoItem label="Marital Status" value={user.marital_status} />
                <InfoItem label="Height" value={user.height} />
                <InfoItem label="Weight" value={user.weight} />
                <InfoItem label="Color/Complexion" value={user.color_complexion} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Contact & Location
              </h3>
              <div className="space-y-3">
                <InfoItem label="Street" value={user.street} />
                <InfoItem label="City" value={user.city} />
                <InfoItem label="Pincode" value={user.pincode} />
                <InfoItem label="Native Place" value={user.native_place} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Education</h3>
              <div className="space-y-3">
                <InfoItem label="Education" value={user.education} />
                <InfoItem label="Deeni Education" value={user.deeni_education} />
                <InfoItem label="Religion/Sect" value={user.religion_sect} />
                {user.income && <InfoItem label="Income" value={user.income} />}
                {user.work_status && <InfoItem label="Work Status" value={user.work_status} />}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Guardian Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Guardian 1</p>
                  <InfoItem label="Name" value={user.guardian1_name} />
                  <InfoItem label="Details" value={user.guardian1_details} />
                  <InfoItem label="Mobile" value={user.guardian1_mobile} />
                </div>
                <div className="mt-3">
                  <p className="font-medium text-gray-700 dark:text-gray-300">Guardian 2</p>
                  <InfoItem label="Name" value={user.guardian2_name} />
                  <InfoItem label="Details" value={user.guardian2_details} />
                  <InfoItem label="Mobile" value={user.guardian2_mobile} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Description
            </h3>
            <p className="text-gray-700 dark:text-gray-300">{user.description}</p>
          </div>

          <div className="mt-6">
            <InfoItem label="Profile Status" value={user.status} />
            {user.rejectionReason && (
              <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-sm font-medium text-red-800 dark:text-red-300">
                  Rejection Reason:
                </p>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  {user.rejectionReason}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            {user.status !== ProfileStatus.APPROVED && (
              <button
                onClick={handleApprove}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Check className="w-5 h-5" />
                Approve Profile
              </button>
            )}
            {user.status !== ProfileStatus.REJECTED && (
              <button
                onClick={handleReject}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle className="w-5 h-5" />
                Reject Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
