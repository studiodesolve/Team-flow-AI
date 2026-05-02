import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, Mail, Key, UserCheck, Database } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="fade-in max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">My Profile</h1>
        <p className="text-lg text-slate-500 font-medium">Manage your personal information and preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card lg:col-span-1 flex flex-col items-center text-center py-10">
          <div className="h-32 w-32 rounded-3xl bg-primary-light text-primary flex items-center justify-center font-black text-4xl mb-6 shadow-xl shadow-primary/10">
            {user?.name.charAt(0)}
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mb-1">{user?.name}</h3>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">{user?.email}</p>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="card space-y-8">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <UserCheck className="text-primary" /> Account Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Name</p>
                <p className="text-lg font-bold text-slate-800">{user?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                <p className="text-lg font-bold text-slate-800">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="card bg-slate-900 text-white border-none">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white/10 rounded-xl text-primary-light">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold">Data Sovereignty</h3>
                <p className="text-slate-400 font-medium text-sm">Role-based access information</p>
              </div>
            </div>
            <p className="text-slate-300 font-medium mb-8 leading-relaxed">
              Your data is secured using industry-standard NoSQL practices on MongoDB. 
              Only authorized project admins can manage memberships and assign tasks.
            </p>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
              <Database className="text-primary-light" size={20} />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Storage Engine: <span className="text-white ml-2">MongoDB Atlas / Local</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
