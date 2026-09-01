import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Users, 
  UserPlus, 
  Search, 
  KeyRound, 
  UserX, 
  UserCheck, 
  AlertCircle,
  X,
  CheckCircle2,
  Lock,
  Mail,
  GraduationCap
} from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [resetModalUser, setResetModalUser] = useState(null);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Create form state
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    registerNo: '',
    section: 'A',
    year: 'III Year',
    password: 'College@123',
    cgpa: '8.5',
    attendance: '88.0'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userObj) => {
    try {
      await api.toggleUserStatus(userObj.id);
      setMsg({ text: `Account status updated for ${userObj.name}.`, type: 'success' });
      fetchUsers();
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetModalUser || !newPasswordInput) return;
    try {
      await api.resetPassword(resetModalUser.id, newPasswordInput);
      setMsg({ text: `Password reset successfully for ${resetModalUser.name}.`, type: 'success' });
      setResetModalUser(null);
      setNewPasswordInput('');
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.createUser(createForm);
      setMsg({ text: `New user ${createForm.name} created successfully.`, type: 'success' });
      setIsCreateOpen(false);
      setCreateForm({
        name: '',
        email: '',
        role: 'STUDENT',
        department: 'Computer Science & Engineering',
        registerNo: '',
        section: 'A',
        year: 'III Year',
        password: 'College@123',
        cgpa: '8.5',
        attendance: '88.0'
      });
      fetchUsers();
    } catch (err) {
      setMsg({ text: err.message, type: 'error' });
    }
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = searchQuery === '' ||
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.registerNo && u.registerNo.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-400" />
            <span>Institutional User Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage Student, Staff, and Administrator accounts & authentication security.</p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Create New User Account</span>
        </button>
      </div>

      {msg.text && (
        <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
          msg.type === 'error' ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
        }`}>
          <span>{msg.text}</span>
          <button onClick={() => setMsg({ text: '', type: '' })}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-sans"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 font-medium"
        >
          <option value="ALL">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="STAFF">Staff</option>
          <option value="ADMINISTRATOR">Administrators</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs font-mono">Loading user directory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">User ID & Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-white text-xs">{u.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{u.id} • {u.registerNo || 'N/A'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        u.role === 'STUDENT' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                        u.role === 'STAFF' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">{u.department}</td>
                    <td className="py-3.5 px-4">
                      {u.status === 'ACTIVE' ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Active</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">Disabled</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                          u.status === 'ACTIVE' ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                        }`}
                        title={u.status === 'ACTIVE' ? 'Disable User' : 'Enable User'}
                      >
                        {u.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                      </button>

                      <button
                        onClick={() => setResetModalUser(u)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition inline-flex items-center gap-1"
                        title="Reset User Password"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                        <span>Reset Pwd</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateUser} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 relative">
            <button type="button" onClick={() => setIsCreateOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-rose-400" />
              <span>Create New User Account</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name</label>
                <input required type="text" value={createForm.name} onChange={e => setCreateForm({...createForm, name: e.target.value})} placeholder="e.g. Priya Staff" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email</label>
                <input required type="email" value={createForm.email} onChange={e => setCreateForm({...createForm, email: e.target.value})} placeholder="priya@college.edu" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Role</label>
                <select value={createForm.role} onChange={e => setCreateForm({...createForm, role: e.target.value})} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white">
                  <option value="STUDENT">STUDENT</option>
                  <option value="STAFF">STAFF</option>
                  <option value="ADMINISTRATOR">ADMINISTRATOR</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Department</label>
                <input type="text" value={createForm.department} onChange={e => setCreateForm({...createForm, department: e.target.value})} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Password</label>
              <input required type="password" value={createForm.password} onChange={e => setCreateForm({...createForm, password: e.target.value})} className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">Create Account</button>
            </div>
          </form>
        </div>
      )}

      {/* Reset Password Modal */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleResetPassword} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 relative">
            <button type="button" onClick={() => setResetModalUser(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <span>Reset Password</span>
            </h3>
            <p className="text-xs text-slate-400">Resetting password for <strong className="text-white">{resetModalUser.name}</strong> ({resetModalUser.email})</p>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">New Password</label>
              <input required type="password" minLength={6} value={newPasswordInput} onChange={e => setNewPasswordInput(e.target.value)} placeholder="Minimum 6 characters" className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white" />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button type="button" onClick={() => setResetModalUser(null)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold">Update Password</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
