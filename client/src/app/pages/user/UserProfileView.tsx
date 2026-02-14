import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { UserSidebar } from '@/app/components/user/UserSidebar';
import { UserNavbar } from '@/app/components/user/UserNavbar';
import { ArrowLeft, MapPin, GraduationCap, Heart, Phone, Home } from 'lucide-react';

export function UserProfileView() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const currentUser = useAppStore((state) => state.currentUser);
  const users = useAppStore((state) => state.users);

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.USER) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== UserRole.USER) {
    return null;
  }

  const profile = users.find((u) => u.id === userId);

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Profile not found</p>
      </div>
    );
  }

  const calculateAge = (dob: Date) => {
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <UserSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <UserNavbar />
        <main className="flex-1 overflow-y-auto p-6">
          <button
            onClick={() => navigate('/user/dashboard')}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Profiles
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {profile.image && profile.gender === 'MALE' && (
              <div className="h-64 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center">
                <div className="text-9xl">👤</div>
              </div>
            )}
            {profile.gender === 'FEMALE' && (
              <div className="h-64 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                <Heart className="w-32 h-32 text-pink-400 fill-pink-400" />
              </div>
            )}

            <div className="p-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {profile.name} {profile.surname}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {calculateAge(profile.dob)} years old
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <InfoRow icon={MapPin} label="Location" value={`${profile.city}, ${profile.native_place}`} />
                    <InfoRow icon={GraduationCap} label="Education" value={profile.education} />
                    <InfoRow icon={Heart} label="Marital Status" value={profile.marital_status} />
                    <InfoRow label="Religion/Sect" value={profile.religion_sect} />
                    <InfoRow label="Height" value={profile.height} />
                    <InfoRow label="Weight" value={profile.weight} />
                    <InfoRow label="Complexion" value={profile.color_complexion} />
                    {profile.income && <InfoRow label="Income" value={profile.income} />}
                    {profile.work_status && <InfoRow label="Work Status" value={profile.work_status} />}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <InfoRow icon={Home} label="Address" value={`${profile.street}, ${profile.city}, ${profile.pincode}`} />
                    
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Guardian 1</h4>
                      <div className="space-y-2">
                        <InfoRow label="Name" value={profile.guardian1_name} />
                        <InfoRow label="Details" value={profile.guardian1_details} />
                        <InfoRow icon={Phone} label="Mobile" value={profile.guardian1_mobile} />
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Guardian 2</h4>
                      <div className="space-y-2">
                        <InfoRow label="Name" value={profile.guardian2_name} />
                        <InfoRow label="Details" value={profile.guardian2_details} />
                        <InfoRow icon={Phone} label="Mobile" value={profile.guardian2_mobile} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  About
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {profile.description}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon?: any; label: string; value: string }) {
  return (
    <div className="flex items-start">
      {Icon && <Icon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />}
      <div className={!Icon ? 'ml-8' : ''}>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
