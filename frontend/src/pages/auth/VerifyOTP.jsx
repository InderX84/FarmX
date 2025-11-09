import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/slices/authSlice';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import heroImg from '../../assets/hero.png';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  
  const { userId, email } = location.state || {};

  useEffect(() => {
    if (!userId || !email) {
      navigate('/register');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [userId, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', {
        userId,
        otp
      });
      
      localStorage.setItem('token', response.data.token);
      dispatch(loginSuccess(response.data));
      toast.success('Email verified successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await api.post('/auth/resend-otp', { userId });
      toast.success('OTP sent successfully!');
      setTimer(60);
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.response?.data?.message || 'Failed to resend OTP');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Website Name */}
      <div className="flex-1 bg-gradient-to-br from-green-600 via-green-700 to-green-800 flex items-center justify-center relative py-12 lg:py-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 via-green-700/30 to-green-800/30"></div>
        
        <div className="relative text-center px-4">
          <div className="flex items-center justify-center mb-6">
            <svg className="w-12 h-12 md:w-16 md:h-16 text-white mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              <path d="M12 2v4a4 4 0 014 4h4a8 8 0 00-8-8z"/>
              <path d="M20 12a8 8 0 01-8 8v4c6.627 0 12-5.373 12-12h-4zm-2-5.291A7.962 7.962 0 0120 12h4c0-3.042-1.135-5.824-3-7.938l-3 2.647z"/>
            </svg>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              2 Fast Ale
            </h1>
          </div>
          <p className="text-lg md:text-xl lg:text-2xl text-green-100 mb-6">
            The Ultimate Hub for Farming Simulator Mods
          </p>
          <img 
            src={heroImg} 
            alt="2 Fast Ale Hero" 
            className="max-w-full h-auto max-h-48 md:max-h-64 lg:max-h-80 object-contain mx-auto"
          />
        </div>
      </div>
      
      {/* Right Side - OTP Form */}
      <div className="flex-1 bg-white dark:bg-gray-900 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Verify Your Email
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              We've sent a 6-digit code to <span className="font-semibold">{email}</span>
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength="6"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
            
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Didn't receive the code?
              </p>
              {timer > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend in {timer} seconds
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="text-green-600 hover:text-green-500 font-semibold transition-colors disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend OTP'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;