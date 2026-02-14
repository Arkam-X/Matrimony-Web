import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { UserRole, ProfileStatus, User } from '@/lib/types';
import { UserSidebar } from '@/app/components/user/UserSidebar';
import { UserNavbar } from '@/app/components/user/UserNavbar';
import { Search, MapPin, GraduationCap, Briefcase, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { getBrowseProfiles } from '@/lib/api';

export function UserDashboard() {
  const navigate = useNavigate();
  const currentUser = useAppStore((state) => state.currentUser);

  const [profiles, setProfiles] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // 🔐 Auth guard + approval routing
  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.USER) {
      navigate('/login');
      return;
    }

    if (currentUser.status !== ProfileStatus.APPROVED) {
      if (currentUser.status === ProfileStatus.PENDING) {
        navigate('/user/pending');
      } else if (currentUser.status === ProfileStatus.REJECTED) {
        navigate('/user/rejected');
      }
    }
  }, [currentUser, navigate]);

  // 🌐 Fetch real profiles from backend
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getBrowseProfiles();
        setProfiles(data);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (!currentUser || currentUser.role !== UserRole.USER || !currentUser.gender) {
    return null;
  }

  if (loading) {
    return null; // keep UI unchanged
  }

  // 🔎 Filtering logic (UNCHANGED UI behavior)
  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch =
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCity = !cityFilter || profile.city.toLowerCase().includes(cityFilter.toLowerCase());

    return matchesSearch && matchesCity;
  });

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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Browse Profiles</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Find your perfect match
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <input
                type="text"
                placeholder="Filter by city..."
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-gray-700 dark:text-white md:w-64"
              />
            </div>
          </div>

          {filteredProfiles.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No profiles found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  onClick={() => navigate(`/user/profile/${profile.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                >
                  {profile.image && profile.gender === 'MALE' && (
                    <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 flex items-center justify-center">
                      <div className="text-6xl">👤</div>
                    </div>
                  )}
                  {profile.gender === 'FEMALE' && (
                    <div className="h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                      <Heart className="w-16 h-16 text-pink-400 fill-pink-400" />
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {profile.name} {profile.surname}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {calculateAge(profile.dob)} years
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {profile.city}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        {profile.education}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {profile.marital_status}
                      </div>
                    </div>

                    <button className="w-full mt-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
