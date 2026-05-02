import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check } from 'lucide-react';
import { extraService } from '../services/api';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await extraService.getNotifications();
      setNotifications(res.data);
    } catch (error) {}
  };

  const handleMarkRead = async (id) => {
    try {
      await extraService.markRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {}
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-slate-400 hover:text-primary transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-5 w-5 bg-danger text-white text-[10px] font-black flex items-center justify-center rounded-full ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[2000] fade-in overflow-hidden">
          <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-extrabold text-slate-900">Notifications</h3>
            <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary-light px-2 py-0.5 rounded-full">
              Recent
            </span>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map(n => (
              <div 
                key={n._id} 
                className={`p-4 border-b border-slate-50 flex gap-3 transition-colors ${n.isRead ? 'bg-white' : 'bg-primary-light/30'}`}
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 leading-snug">{n.message}</p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase mt-1 block">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {!n.isRead && (
                  <button 
                    onClick={() => handleMarkRead(n._id)}
                    className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-110 transition-transform"
                  >
                    <Check size={14} />
                  </button>
                )}
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="p-10 text-center text-slate-400 font-medium text-sm">
                No new notifications.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
