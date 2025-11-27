import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

     try {
      const result = await login(formData.username, formData.password);
      setSubmitting(false);

      console.log('Login result:', result);
      if (result || result.success) {
        const isPolice = result?.account?.roles?.includes('POLICE');
        if (isPolice) {
          navigate('/police-dashboard');
          return;
        }
        navigate('/dashboard'); 
      } else {
        setError(result?.error || 'Login failed');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-700 p-5 animate-[slideUp_0.5s_ease-out]">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-gray-800 text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-500 text-base">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-5">
          {error && (
            <div className="bg-red-100 text-red-700 px-3 py-3 rounded-lg mb-5 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="mb-5">
            <label htmlFor="username" className="block mb-2 text-gray-800 font-medium text-sm">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="block mb-2 text-gray-800 font-medium text-sm">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 px-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-5">
          <p className="text-gray-500 text-sm">
            Don't have an account?{' '}
            <a href="/register" className="text-indigo-500 no-underline font-medium hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
