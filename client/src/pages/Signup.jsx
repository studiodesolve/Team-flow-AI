import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Hexagon } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.signup(formData);
      login(res.data.user, res.data.token);
      toast.success('Account created');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f5f5f7] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-60"></div>

      <div className="w-full max-w-[440px] z-10">
        <div className="bg-white/70 backdrop-blur-2xl p-10 rounded-[32px] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-apple-black rounded-2xl flex items-center justify-center mb-6 shadow-xl">
               <Hexagon size={32} className="text-white" />
             </div>
            <h1 className="text-[32px] font-display font-semibold text-apple-black tracking-tight leading-tight mb-2">
              Create your ID.
            </h1>
            <p className="text-apple-grayDark font-medium">One account for all your projects.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-apple-grayDark ml-1">Full Name</label>
              <input 
                type="text" 
                placeholder="Prince Yadav" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="apple-input-gray py-4 px-5 text-[16px] bg-white/50 focus:bg-white transition-all"
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-apple-grayDark ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="name@company.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="apple-input-gray py-4 px-5 text-[16px] bg-white/50 focus:bg-white transition-all"
                required 
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-[13px] font-semibold text-apple-grayDark ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="apple-input-gray py-4 px-5 text-[16px] bg-white/50 focus:bg-white transition-all"
                required 
              />
            </div>
            
            <div className="pt-4">
              <button type="submit" className="apple-button-primary w-full py-4 text-[17px] font-semibold shadow-lg hover:shadow-apple-black/10 transition-all active:scale-[0.98]" disabled={loading}>
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full mx-auto"></div>
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-apple-border/50 text-center">
            <p className="text-[15px] text-apple-grayDark">
              Already have an ID? <Link to="/login" className="apple-link font-semibold">Sign in</Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-[13px] text-apple-grayDark font-medium opacity-60">
          Built with precision by Prince Yadav • © 2026
        </p>
      </div>
    </div>
  );
};

export default Signup;
