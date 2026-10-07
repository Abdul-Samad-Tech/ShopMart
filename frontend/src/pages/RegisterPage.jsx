import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { registerStart, registerSuccess, registerFailure } from '../store/authSlice';
import { apiEndpoints } from '../services/api';
import toast from 'react-hot-toast';
import GoogleSignIn from '../components/auth/GoogleSignIn';
import { getApiErrorMessage } from '../utils/apiError';
import { Sparkles, Lock, Mail, User, ArrowRight, Eye, EyeOff, Check, Gift, Zap, Package, Heart } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFocused, setIsFocused] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    dispatch(registerStart());
    try {
      const { data } = await apiEndpoints.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      dispatch(registerSuccess(data));
      toast.success('Welcome! Check your email for a welcome note.');
      navigate('/dashboard');
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Registration failed');
      dispatch(registerFailure(msg));
      toast.error(msg);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
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

  const benefits = [
    { icon: Gift, text: 'Exclusive member deals' },
    { icon: Zap, text: 'Fast checkout experience' },
    { icon: Package, text: 'Order tracking and updates' },
    { icon: Heart, text: 'Personalized recommendations' },
  ];

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
              <p className="text-brand-text text-sm uppercase tracking-[0.3em] mb-4">Join ShopMart</p>
              <h2 className="text-5xl font-display font-bold text-white mb-6 leading-tight">
                Start Your Shopping Journey
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Create an account to unlock exclusive deals, track your orders, and get personalized recommendations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-3 text-white/90"
                >
                  <benefit.icon className="w-5 h-5 text-brand-text" aria-hidden="true" />
                  <span className="text-sm">{benefit.text}</span>
                </motion.div>
              ))}
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
              <h1 className="text-4xl font-display font-bold text-white mb-3">Create Account</h1>
              <p className="text-white/60">Join ShopMart and start shopping today</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/10 bg-chrome/80 rounded-3xl p-8 border border-white/20 shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
                  <div className={`relative transition-all duration-300 ${isFocused === 'name' ? 'transform scale-[1.02]' : ''}`}>
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={() => setIsFocused('name')}
                      onBlur={() => setIsFocused('')}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                </motion.div>

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
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
                  <div className={`relative transition-all duration-300 ${isFocused === 'confirmPassword' ? 'transform scale-[1.02]' : ''}`}>
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      onFocus={() => setIsFocused('confirmPassword')}
                      onBlur={() => setIsFocused('')}
                      className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-300"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 text-green-400"
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  )}
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-brand to-brand-strong hover:from-brand-strong hover:to-brand-strong text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>Create Account</span>
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
                  <GoogleSignIn label="Sign up with your Google account" />
                </div>
              </motion.div>
            </motion.div>

            <motion.p variants={itemVariants} className="text-center text-sm text-white/60 mt-8">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-text hover:text-brand-text font-semibold transition-colors">
                Sign in
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
