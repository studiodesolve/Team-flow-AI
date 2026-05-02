import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { Hexagon } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      login(res.data.user, res.data.token);
      toast.success('Signed in');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign in failed');
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
            Sign in to TeamFlow AI.
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email or Account Name" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="apple-input-gray py-4 text-[17px] text-center"
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="apple-input-gray py-4 text-[17px] text-center"
            required 
          />
          
          <div className="pt-6">
            <button type="submit" className="apple-button-primary w-full py-3 text-[17px]" disabled={loading}>
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full mx-auto"></div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-apple-border/50 text-center">
          <Link to="/signup" className="apple-link text-[15px]">
            Create yours now.
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
