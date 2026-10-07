import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiEndpoints } from '../services/api';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiEndpoints.sendPasswordResetOTP({ email });
      setSubmitted(true);
      toast.success('OTP sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="page-shell min-h-[calc(100vh-72px)] flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="card-premium p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-bold mb-4">OTP Sent</h1>
            <p className="text-slate-600 mb-6">
              We've sent a 6-digit OTP to <span className="font-semibold">{email}</span>. 
              Please check your email and enter the OTP to reset your password.
            </p>
            <Link to="/verify-otp" state={{ email }} className="btn-premium w-full">
              Enter OTP
            </Link>
            <p className="text-sm text-slate-500 mt-4">
              Didn't receive OTP?{' '}
              <button onClick={() => setSubmitted(false)} className="text-indigo-600 hover:text-indigo-700 font-medium">
                Resend
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-shell min-h-[calc(100vh-72px)] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <h1 className="text-3xl font-display mb-2">Forgot Password</h1>
        <p className="text-slate-600 mb-8">Enter your email to receive a password reset OTP</p>
        <div className="card-premium p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-premium">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-premium"
                placeholder="Enter your email"
              />
            </div>
            <motion.button type="submit" className="btn-premium w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </motion.button>
          </form>
        </div>
        <p className="text-center text-sm text-slate-500 mt-6">
          Remember your password?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
