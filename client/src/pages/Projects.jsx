import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { projectService } from '../services/api';
import { Search, Users, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [newProject, setNewProject] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await projectService.getAll();
      setProjects(res.data);
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await projectService.create(newProject);
      toast.success('Project created');
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="animate-spin h-6 w-6 border-2 border-apple-grayDark border-t-black rounded-full"></div>
    </div>
  );

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-10 pb-6 border-b border-apple-border/50">
        <div>
          <h1 className="text-5xl font-display font-semibold tracking-tight text-apple-black mb-2">
            Projects.
          </h1>
          <p className="text-xl text-apple-grayDark">
            Your workspaces.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-grayDark" size={16} />
            <input 
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="apple-input-gray pl-10 py-2 text-[15px]"
            />
          </div>
          <button onClick={() => setShowModal(true)} className="apple-button-primary whitespace-nowrap">
            New Project
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/projects/${project._id}`} className="apple-card block h-full flex flex-col hover:bg-[#ebebe8] transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-[22px] font-display font-semibold text-apple-black leading-tight truncate pr-4">
                    {project.name}
                  </h3>
                  <span className="text-[12px] font-medium text-apple-grayDark uppercase tracking-wide">
                    {project.role}
                  </span>
                </div>
                
                <p className="text-[15px] text-apple-grayDark mb-8 line-clamp-2 flex-1">
                  {project.description || 'No description provided.'}
                </p>
                
                <div className="flex items-center gap-6 mt-auto pt-6 border-t border-apple-border/30">
                  <div className="flex items-center gap-2 text-[13px] text-apple-grayDark font-semibold">
                     <div className="w-6 h-6 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                       <Users size={14} />
                     </div>
                    {project.membersCount || 1} Members
                  </div>
                  <div className="flex items-center gap-2 text-[13px] text-apple-grayDark font-semibold">
                     <div className="w-6 h-6 bg-green-50 text-green-500 rounded-lg flex items-center justify-center">
                       <CheckSquare size={14} />
                     </div>
                    {project.tasksCount || 0} Tasks
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredProjects.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <h3 className="text-2xl font-display font-semibold text-apple-black mb-2">No projects found.</h3>
            <p className="text-[17px] text-apple-grayDark">Create a new one to get started.</p>
          </div>
        )}
      </div>

      {/* Minimal Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[20px] p-8 w-full max-w-md shadow-apple-md relative z-10"
            >
              <h2 className="text-[28px] font-display font-semibold text-apple-black mb-6">New Project.</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    className="apple-input"
                    placeholder="Name"
                    required 
                  />
                </div>
                <div>
                  <textarea 
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="apple-input h-32 resize-none"
                    placeholder="Description (optional)"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-apple-border/50">
                  <button type="button" onClick={() => setShowModal(false)} className="apple-button-secondary">Cancel</button>
                  <button type="submit" className="apple-button-primary">Create</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
