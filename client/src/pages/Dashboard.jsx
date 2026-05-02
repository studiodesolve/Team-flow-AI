import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { dashboardService } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Link } from 'react-router-dom';

const AppleStatCard = ({ label, value }) => (
  <div className="flex flex-col items-center justify-center text-center p-6 border-r border-apple-border/50 last:border-0">
    <h3 className="text-5xl font-display font-semibold text-apple-black tracking-tight">{value || 0}</h3>
    <p className="text-sm text-apple-grayDark mt-2 font-medium">{label}</p>
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
          Overview.
        </h1>
        <p className="text-xl text-apple-grayDark max-w-2xl mx-auto">
          A clear view of your team's progress.
        </p>
      </section>

      {/* Stats Ribbon */}
      <section className="bg-apple-gray rounded-[18px] flex flex-col md:flex-row justify-around py-8 px-4">
        <AppleStatCard label="Total Tasks" value={stats?.totalTasks} />
        <AppleStatCard label="Completed" value={stats?.completedTasks} />
        <AppleStatCard label="In Progress" value={stats?.pendingTasks} />
        <AppleStatCard label="Overdue" value={stats?.overdueTasks} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart Section */}
        <section className="apple-card">
          <h2 className="text-2xl font-display font-semibold mb-8">Performance.</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
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
        <section className="apple-card flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-display font-semibold">Recent Activity.</h2>
            <Link to="/projects" className="apple-link">View all</Link>
          </div>
          <div className="space-y-4 flex-1">
            {stats?.recentTasks?.map((task) => (
              <div key={task._id} className="pb-4 border-b border-apple-border/50 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-[17px] text-apple-black">{task.title}</h4>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                    task.status === 'DONE' ? 'bg-[#e5f5e8] text-[#34c759]' : 
                    task.status === 'IN_PROGRESS' ? 'bg-[#fff5e5] text-[#ff9500]' : 
                    'bg-[#f0f0f2] text-apple-grayDark'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[13px] text-apple-grayDark">{task.project?.name} • {new Date(task.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
            {(!stats?.recentTasks || stats.recentTasks.length === 0) && (
              <p className="text-apple-grayDark text-[15px] text-center py-8">No recent activity.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
