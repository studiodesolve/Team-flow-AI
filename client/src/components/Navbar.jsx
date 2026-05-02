import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Briefcase, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <div className="logo-icon">T</div>
        <span className="logo-text">TeamFlow</span>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <Briefcase size={20} />
          <span>Projects</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <User size={20} />
          <span>Profile</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <User size={18} />
          </div>
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar {
          width: 280px;
          height: 100vh;
          display: flex;
          flex-direction: column;
          padding: 2rem;
          position: fixed;
          left: 0;
          top: 0;
          background: #ffffff;
          border-right: 1px solid var(--border);
          z-index: 100;
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 3.5rem;
        }
        .logo-icon {
          width: 36px;
          height: 36px;
          background: var(--primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.3rem;
          color: white;
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
        }
        .logo-text {
          font-size: 1.4rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #0f172a;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-md);
          color: var(--text-muted);
          font-weight: 600;
          font-size: 0.95rem;
        }
        .nav-item:hover {
          background: var(--bg-main);
          color: var(--primary);
        }
        .nav-item.active {
          background: var(--primary-light);
          color: var(--primary);
        }
        .sidebar-footer {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border);
        }
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-avatar {
          width: 42px;
          height: 42px;
          background: var(--primary-light);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border);
          color: var(--primary);
        }
        .user-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: #0f172a;
        }
        .user-role {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-weight: 500;
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: transparent;
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.5rem;
          width: fit-content;
        }
        .logout-btn:hover {
          color: var(--danger);
        }

        /* Layout helpers */
        .layout {
          display: flex;
        }
        .content {
          margin-left: 280px;
          flex: 1;
          padding: 2.5rem;
          min-height: 100vh;
          background: var(--bg-main);
        }
      `}} />
    </aside>
  );
};

export default Navbar;
