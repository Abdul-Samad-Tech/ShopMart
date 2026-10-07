import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiEndpoints } from '../services/api';
import toast from 'react-hot-toast';

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      await apiEndpoints.verifyPasswordResetOTP({ email, otp });
      toast.success('OTP verified successfully');
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await apiEndpoints.sendPasswordResetOTP({ email });
      toast.success('OTP resent to your email');
    } catch (err) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="page-shell min-h-[calc(100vh-72px)] flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <h1 className="text-3xl font-display mb-2">Verify OTP</h1>
        <p className="text-slate-600 mb-8">
          Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
        </p>
        <div className="card p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Enter OTP</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="input text-center text-2xl tracking-widest"
                placeholder="000000"
              />
            </div>
            <motion.button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </motion.button>
          </form>
        </div>
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-slate-500">
            Didn't receive OTP?{' '}
            <button onClick={handleResend} className="text-brand-text hover:text-brand-strong font-medium">
              Resend OTP
            </button>
          </p>
          <p className="text-sm text-slate-500">
            <Link to="/forgot-password" className="text-brand-text hover:text-brand-strong font-medium">
              Change email
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTPPage;
