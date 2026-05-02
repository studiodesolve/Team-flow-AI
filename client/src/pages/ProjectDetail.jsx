import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { projectService, taskService, extraService } from '../services/api';
import { Plus, ChevronLeft, User, Search, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterAssignee, setFilterAssignee] = useState('ALL');
  const [newMember, setNewMember] = useState({ email: '', role: 'MEMBER' });
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    status: 'TODO', 
    priority: 'MEDIUM',
    dueDate: '',
    assignedToId: '' 
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const projRes = await projectService.getById(id);
      setProject(projRes.data);

      const taskRes = await taskService.getByProject(id);
      setTasks(taskRes.data);

      const activityRes = await extraService.getActivities(id);
      setActivities(activityRes.data);
    } catch (error) {
      toast.error('Failed to load project details');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.create({ ...newTask, projectId: id });
      toast.success('Task created');
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', assignedToId: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateStatus = async (taskId, status) => {
    try {
      await taskService.update(taskId, { status });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unauthorized');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskService.delete(taskId);
      toast.success('Task deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin h-6 w-6 border-2 border-apple-grayDark border-t-black rounded-full"></div>
    </div>
  );

  const getTasksByStatus = (status) => tasks.filter(t => {
    const matchesStatus = t.status === status;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = filterPriority === 'ALL' || t.priority === filterPriority;
    const matchesAssignee = filterAssignee === 'ALL' || t.assignedTo?._id === filterAssignee;
    return matchesStatus && matchesSearch && matchesPriority && matchesAssignee;
  });

  return (
    <div className="space-y-10 pb-20">
      <Link to="/projects" className="inline-flex items-center text-[15px] text-apple-blue hover:underline mb-2">
        <ChevronLeft size={16} /> Projects
      </Link>

      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-apple-border/50 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-[40px] leading-tight font-display font-semibold text-apple-black tracking-tight">{project.name}</h1>
            <span className="text-[11px] font-medium text-apple-grayDark uppercase tracking-wide border border-apple-border rounded-full px-2 py-0.5">
              {project.myRole}
            </span>
          </div>
          <p className="text-[17px] text-apple-grayDark max-w-2xl">{project.description}</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-apple-grayDark">{project.members.length} Members</span>
            {project.myRole === 'ADMIN' && (
              <button onClick={() => setShowMemberModal(true)} className="apple-link text-[13px]">
                Add Member
              </button>
            )}
          </div>
          <button onClick={() => setShowTaskModal(true)} className="apple-button-primary">
            New Task
          </button>
        </div>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-grayDark" size={16} />
          <input 
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="apple-input-gray pl-9 py-2 text-[15px] w-full"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-40">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-grayDark" size={14} />
            <select 
              value={filterPriority} 
              onChange={(e) => setFilterPriority(e.target.value)}
              className="apple-input-gray pl-8 py-2 text-[13px] appearance-none"
            >
              <option value="ALL">Priority</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          <div className="relative flex-1 md:w-40">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-grayDark" size={14} />
            <select 
              value={filterAssignee} 
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="apple-input-gray pl-8 py-2 text-[13px] appearance-none"
            >
              <option value="ALL">Assignee</option>
              {project.members.map(m => (
                <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kanban Columns */}
        {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
          <div key={status} className="flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-apple-border/50">
              <h3 className="text-[17px] font-semibold text-apple-black">
                {status === 'TODO' ? 'To Do' : status === 'IN_PROGRESS' ? 'In Progress' : 'Done'}
              </h3>
              <span className="text-[13px] text-apple-grayDark">{getTasksByStatus(status).length}</span>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence>
                {getTasksByStatus(status).map(task => (
                  <TaskCard key={task._id} task={task} project={project} onUpdate={handleUpdateStatus} onDelete={handleDeleteTask} />
                ))}
              </AnimatePresence>
              {getTasksByStatus(status).length === 0 && (
                <div className="py-8 text-center text-[13px] text-apple-grayDark">No tasks.</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-12 border-t border-apple-border/50">
        <h3 className="text-[22px] font-display font-semibold text-apple-black mb-6">Activity.</h3>
        <div className="space-y-4">
          {activities.map(act => (
            <div key={act._id} className="flex items-center gap-3 text-[15px]">
              <span className="font-semibold text-apple-black">{act.user.name}</span>
              <span className="text-apple-grayDark">{act.details.toLowerCase()}</span>
              <span className="text-[13px] text-apple-grayDark ml-auto">{new Date(act.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
          {activities.length === 0 && (
             <p className="text-[15px] text-apple-grayDark">No activity yet.</p>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTaskModal(false)} className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[20px] p-8 w-full max-w-lg shadow-apple-md relative z-10">
              <h2 className="text-[28px] font-display font-semibold text-apple-black mb-6">New Task.</h2>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <input type="text" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="apple-input" placeholder="Title" required />
                <textarea value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="apple-input h-24 resize-none" placeholder="Description"></textarea>
                <div className="grid grid-cols-2 gap-4">
                  <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})} className="apple-input">
                    <option value="LOW">Low Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="HIGH">High Priority</option>
                  </select>
                  <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} className="apple-input text-apple-grayDark" />
                </div>
                <select value={newTask.assignedToId} onChange={(e) => setNewTask({...newTask, assignedToId: e.target.value})} className="apple-input">
                  <option value="">Unassigned</option>
                  {project.members.map(m => <option key={m.user._id} value={m.user._id}>{m.user.name}</option>)}
                </select>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowTaskModal(false)} className="apple-button-secondary">Cancel</button>
                  <button type="submit" className="apple-button-primary">Create Task</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Member Modal */}
      <AnimatePresence>
        {showMemberModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMemberModal(false)} className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white rounded-[20px] p-8 w-full max-w-sm shadow-apple-md relative z-10">
              <h2 className="text-[28px] font-display font-semibold text-apple-black mb-6">Add Member.</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await projectService.addMember(id, newMember);
                  toast.success('Member added');
                  setShowMemberModal(false);
                  setNewMember({ email: '', role: 'MEMBER' });
                  fetchData();
                } catch (error) {
                  toast.error(error.response?.data?.message || 'Failed to add member');
                }
              }} className="space-y-4">
                <input type="email" value={newMember.email} onChange={(e) => setNewMember({...newMember, email: e.target.value})} className="apple-input" placeholder="Email Address" required />
                <select value={newMember.role} onChange={(e) => setNewMember({...newMember, role: e.target.value})} className="apple-input">
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowMemberModal(false)} className="apple-button-secondary">Cancel</button>
                  <button type="submit" className="apple-button-primary">Add</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TaskCard = ({ task, project, onUpdate, onDelete }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-apple-gray rounded-[14px] p-4 group"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-[15px] text-apple-black leading-snug">{task.title}</h4>
        {project.myRole === 'ADMIN' && (
          <button onClick={() => onDelete(task._id)} className="text-apple-grayDark hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[11px] uppercase font-medium">Delete</span>
          </button>
        )}
      </div>
      
      {task.description && (
        <p className="text-[13px] text-apple-grayDark line-clamp-2 mb-4">{task.description}</p>
      )}
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          {task.assignedTo && (
            <span className="text-[12px] font-medium text-apple-grayDark">{task.assignedTo.name.split(' ')[0]}</span>
          )}
          <span className={`w-2 h-2 rounded-full ${
            task.priority === 'HIGH' ? 'bg-[#ff3b30]' : task.priority === 'MEDIUM' ? 'bg-[#ff9500]' : 'bg-[#34c759]'
          }`} />
        </div>
        
        <select 
          value={task.status}
          onChange={(e) => onUpdate(task._id, e.target.value)}
          className="text-[12px] bg-transparent font-medium text-apple-black cursor-pointer outline-none text-right"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
