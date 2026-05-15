import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import type { TutorProfile } from '../services/api';
import { Check, X, Shield, Users, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [pendingTutors, setPendingTutors] = useState<TutorProfile[]>([]);
  const [verifiedTutors, setVerifiedTutors] = useState<TutorProfile[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [pendingRes, verifiedRes, statsRes] = await Promise.all([
        adminApi.getPendingTutors(),
        adminApi.getVerifiedTutors(),
        adminApi.getSystemStats()
      ]);
      setPendingTutors(pendingRes.data);
      setVerifiedTutors(verifiedRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Error loading admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerify = async (id: number, verified: boolean) => {
    try {
      await adminApi.verifyTutor(id, { verified });
      toast.success(`Tutor ${verified ? 'approved' : 'rejected'} successfully`);
      fetchData(); // Refresh lists
    } catch (error) {
      toast.error('Error updating tutor status');
    }
  };

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Users</p>
            <p className="text-2xl font-bold text-slate-800">{stats?.totalUsers || 0}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-xl">
            <Check className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Verified Tutors</p>
            <p className="text-2xl font-bold text-slate-800">{verifiedTutors.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Registered Classes</p>
            <p className="text-2xl font-bold text-slate-800">{stats?.totalClasses || 0}</p>
          </div>
        </div>
      </div>

      {/* Pending Tutors Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Pending Requests
            <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {pendingTutors.length}
            </span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Tutor</th>
                <th className="px-6 py-4">Rate / Exp</th>
                <th className="px-6 py-4">Subjects</th>
                <th className="px-6 py-4">Documents</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {pendingTutors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No pending requests.
                  </td>
                </tr>
              ) : (
                pendingTutors.map((tutor) => (
                  <tr key={tutor.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={tutor.profilePictureUrl || 'https://via.placeholder.com/40'} alt={tutor.fullName} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold text-slate-900">{tutor.fullName}</p>
                          <p className="text-xs text-slate-500">{tutor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">${tutor.hourlyRate}/h</p>
                      <p className="text-xs text-slate-500">{tutor.yearsOfExperience} years exp.</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {tutor.subjects.map((sub, i) => (
                          <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-xs">
                        {tutor.credentialsUrl && <a href={tutor.credentialsUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">ID Document</a>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleVerify(tutor.userId, true)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleVerify(tutor.userId, false)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
