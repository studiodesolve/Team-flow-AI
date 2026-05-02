import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Hexagon } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center text-center mb-10">
          <Hexagon size={48} className="text-apple-black mb-6" />
          <h1 className="text-[32px] font-display font-semibold text-apple-black tracking-tight leading-tight">
            Create your ID.
          </h1>
          <p className="text-[17px] text-apple-grayDark mt-2">
            One account for everything TeamFlow AI.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="First and last name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="apple-input-gray py-4 text-[17px] text-center"
            required 
          />
          <input 
            type="email" 
            placeholder="name@example.com" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="apple-input-gray py-4 text-[17px] text-center"
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="apple-input-gray py-4 text-[17px] text-center"
            required 
          />
          
          <div className="pt-6">
            <button type="submit" className="apple-button-primary w-full py-3 text-[17px]" disabled={loading}>
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full mx-auto"></div>
              ) : (
                'Continue'
              )}
            </button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-apple-border/50 text-center">
          <Link to="/login" className="apple-link text-[15px]">
            Already have an ID? Sign in.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
