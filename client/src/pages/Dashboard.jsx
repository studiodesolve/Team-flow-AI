import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { dashboardService } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area
} from 'recharts';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, Clock, AlertCircle, Plus, Layout, ArrowRight, Activity as ActivityIcon 
} from 'lucide-react';

const AppleStatCard = ({ label, value, icon: Icon, color }) => (
  <div className="flex flex-col items-center justify-center text-center p-8 border-r border-apple-border/30 last:border-0 group hover:bg-white/50 transition-all duration-300">
    <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center ${color} shadow-sm group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <h3 className="text-4xl font-display font-semibold text-apple-black tracking-tight">{value || 0}</h3>
    <p className="text-[13px] text-apple-grayDark mt-1 font-semibold uppercase tracking-wider opacity-60">{label}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await dashboardService.getStats();
      setStats(res.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin h-6 w-6 border-2 border-apple-grayDark border-t-black rounded-full"></div>
    </div>
  );

  const chartData = [
    { name: 'Completed', value: stats?.completedTasks || 0, color: '#34c759' },
    { name: 'Pending', value: stats?.pendingTasks || 0, color: '#ff9500' },
    { name: 'Overdue', value: stats?.overdueTasks || 0, color: '#ff3b30' },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="text-center pt-10 pb-6 border-b border-apple-border/50">
        <h1 className="text-5xl md:text-6xl font-display font-semibold tracking-tight text-apple-black mb-4">
          Status Report.
        </h1>
        <p className="text-xl text-apple-grayDark max-w-2xl mx-auto font-medium">
          Everything you need to stay on top of the project.
        </p>
      </section>

      {/* Quick Actions Ribbon */}
      <section className="flex flex-wrap gap-4 items-center justify-center">
        <Link to="/projects" className="flex items-center gap-2 px-6 py-3 bg-apple-black text-white rounded-full font-semibold text-sm hover:scale-105 transition-all shadow-lg shadow-black/10">
          <Plus size={18} /> New Project
        </Link>
      </section>

      {/* Stats Ribbon */}
      <section className="bg-[#f2f2f7] rounded-[32px] flex flex-col md:flex-row justify-around overflow-hidden border border-apple-border/30 shadow-sm">
        <AppleStatCard label="Total Tasks" value={stats?.totalTasks} icon={Layout} color="bg-blue-50 text-blue-500" />
        <AppleStatCard label="Completed" value={stats?.completedTasks} icon={CheckCircle2} color="bg-green-50 text-green-500" />
        <AppleStatCard label="In Progress" value={stats?.pendingTasks} icon={Clock} color="bg-orange-50 text-orange-500" />
        <AppleStatCard label="Overdue" value={stats?.overdueTasks} icon={AlertCircle} color="bg-red-50 text-red-500" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <section className="apple-card overflow-hidden">
          <h2 className="text-2xl font-display font-semibold mb-8">Performance.</h2>
          <div className="h-64 w-full relative">
            {/* Added a key to force re-render when stats change, ensuring ResponsiveContainer re-calculates */}
            <ResponsiveContainer width="99.9%" height="100%" key={stats ? 'loaded' : 'loading'}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d2d2d7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#86868b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#86868b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f5f5f7'}}
                  contentStyle={{borderRadius: '12px', border: '1px solid #d2d2d7', boxShadow: '0 4px 16px rgba(0,0,0,0.08)'}}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Tasks Feed */}
        <section className="apple-card flex flex-col bg-white/40 backdrop-blur-md">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
                <ActivityIcon size={20} />
              </div>
              <h2 className="text-2xl font-display font-semibold text-apple-black">Recent Activity.</h2>
            </div>
            <Link to="/projects" className="text-sm font-semibold text-blue-500 hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-6 flex-1">
            {stats?.recentTasks?.map((task) => (
              <div key={task._id} className="flex gap-4 group">
                <div className="mt-1">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    task.status === 'DONE' ? 'bg-green-500' : 
                    task.status === 'IN_PROGRESS' ? 'bg-orange-500' : 'bg-apple-grayDark'
                  }`} />
                </div>
                <div className="flex-1 pb-6 border-b border-apple-border/30 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-[17px] text-apple-black group-hover:text-blue-600 transition-colors cursor-pointer">{task.title}</h4>
                    <span className="text-[11px] font-bold text-apple-grayDark uppercase tracking-widest">{task.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-apple-grayDark font-medium">
                    <span className="text-apple-black font-semibold">{task.project?.name}</span>
                    <span className="opacity-40">•</span>
                    <span>{new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            ))}
            {(!stats?.recentTasks || stats.recentTasks.length === 0) && (
              <p className="text-apple-grayDark text-[15px] text-center py-8">No recent activity.</p>
            )}
          </div>
        </section>
      </div>

      {/* Developer Note (Humanizing Touch) */}
      <section className="mt-20 pt-12 border-t border-apple-border/50">
        <div className="bg-[#fbfbfd] rounded-[24px] p-10 border border-apple-border/30">
          <h3 className="text-[21px] font-semibold text-apple-black mb-4">A note on the engineering...</h3>
          <p className="text-[17px] text-apple-grayDark leading-relaxed mb-6">
            This dashboard is built to demonstrate real-time data aggregation. Under the hood, it uses 
            a customized Mongoose pipeline to fetch task distributions, completion rates, and overdue 
            deadlines in a single efficient request. The UI is designed following Apple's Human Interface 
            Guidelines (HIG) for maximum clarity and focus.
          </p>
          <div className="flex gap-4">
            <span className="text-[13px] font-semibold px-3 py-1 bg-white border border-apple-border/50 rounded-full text-apple-grayDark">React 19</span>
            <span className="text-[13px] font-semibold px-3 py-1 bg-white border border-apple-border/50 rounded-full text-apple-grayDark">Mongoose Aggregation</span>
            <span className="text-[13px] font-semibold px-3 py-1 bg-white border border-apple-border/50 rounded-full text-apple-grayDark">Tailwind Tokens</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
