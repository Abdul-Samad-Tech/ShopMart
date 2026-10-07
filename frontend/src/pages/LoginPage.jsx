import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { apiEndpoints } from '../services/api';
import toast from 'react-hot-toast';
import GoogleSignIn from '../components/auth/GoogleSignIn';
import { getApiErrorMessage } from '../utils/apiError';
import { Sparkles, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { data } = await apiEndpoints.login(formData);
      dispatch(loginSuccess(data));
      toast.success('Welcome back.');
      if (data.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Invalid credentials');
      dispatch(loginFailure(msg));
      toast.error(msg);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <div className="min-h-screen bg-chrome overflow-hidden relative">
      <div className="relative min-h-screen flex">
        {/* Left Side - Hero Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex lg:w-1/2 items-center justify-center p-16 relative"
        >
          <div className="relative z-10 max-w-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <Sparkles className="w-12 h-12 text-brand-text mb-4" />
              <p className="text-brand-text text-sm uppercase tracking-[0.3em] mb-4">Welcome Back</p>
              <h2 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
                Experience the Future of Shopping
              </h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Join thousands of customers who trust ShopMart for premium products, exclusive deals, and exceptional service.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 p-6 bg-white/10 bg-chrome/80 rounded-2xl border border-white/20"
            >
              <p className="text-white/80 text-sm mb-3">Demo accounts use the emails below. Passwords stay in your local environment, not on this page.</p>
              <div className="space-y-2 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand rounded-full" />
                  <span>Member: demo@shophub.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-brand rounded-full" />
                  <span>Admin: admin@shophub.com</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-4xl font-display font-bold text-white mb-3">Sign In</h1>
              <p className="text-white/60">Enter your credentials to access your account</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/10 bg-chrome/80 rounded-3xl p-8 border border-white/20 shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
                  <div className={`relative transition-all duration-300 ${isFocused === 'email' ? 'transform scale-[1.02]' : ''}`}>
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      onFocus={() => setIsFocused('email')}
                      onBlur={() => setIsFocused('')}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-300"
                      placeholder="Enter your email"
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                  <div className={`relative transition-all duration-300 ${isFocused === 'password' ? 'transform scale-[1.02]' : ''}`}>
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      onFocus={() => setIsFocused('password')}
                      onBlur={() => setIsFocused('')}
                      className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-300"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="text-right mt-2">
                    <Link to="/forgot-password" className="text-sm text-brand-text hover:text-brand-text font-medium transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-brand to-brand-strong hover:from-brand-strong hover:to-brand-strong text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>

              <motion.div variants={itemVariants} className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-white/60">Or continue with</span>
                  </div>
                </div>
                <div className="mt-6">
                  <GoogleSignIn />
                </div>
              </motion.div>
            </motion.div>

            <motion.p variants={itemVariants} className="text-center text-sm text-white/60 mt-8">
              New to ShopMart?{' '}
              <Link to="/register" className="text-brand-text hover:text-brand-text font-semibold transition-colors">
                Create an account
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
