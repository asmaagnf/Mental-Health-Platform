import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    userType: 'PATIENT', // backend expects uppercase enum names
    gender: '',          // e.g., "MALE", "FEMALE"
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Invalid email address';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.agreeTerms)
      newErrors.agreeTerms = 'You must agree to the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Compose payload with embedded objects and enums (uppercase)
    const requestPayload = {
      name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
    email: formData.email.trim(),
  password: formData.password,
  phoneNumber: formData.phoneNumber.trim() || null,
  dateOfBirth: null,
  address: null,
  gender: formData.gender.toUpperCase(),
  role: formData.userType.toUpperCase(),
      // Do NOT send profilePictureUrl
    };

    try {
      const response = await axios.post(
        'http://localhost:8090/api/auth/register',
        requestPayload
      );

      if (response.status === 200) {
        toast.success('Registration successful!');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (error: any) {
      console.error('Error during registration:', error);
      toast.error(
        error?.response?.data?.message || 'Registration failed! Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = () => {
    const { password } = formData;
    if (!password) return { text: '', color: '' };
    if (password.length < 8) return { text: 'Weak', color: 'text-red-500' };
    if (password.length < 12) return { text: 'Moderate', color: 'text-yellow-500' };
    return { text: 'Strong', color: 'text-green-500' };
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8 animate-fade-in">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Create an Account</h2>
          <p className="text-slate-600 mb-8">
            Join MindPulse and start your mental wellness journey
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="form-label">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                className={`form-input ${errors.firstName ? 'border-red-500' : ''}`}
                value={formData.firstName}
                onChange={handleChange}
              />
              {errors.firstName && <p className="form-error">{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="form-label">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                className={`form-input ${errors.lastName ? 'border-red-500' : ''}`}
                value={formData.lastName}
                onChange={handleChange}
              />
              {errors.lastName && <p className="form-error">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className={`form-input ${errors.email ? 'border-red-500' : ''}`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="userType" className="form-label">
              I am a:
            </label>
            <select
              id="userType"
              name="userType"
              className="form-input"
              value={formData.userType}
              onChange={handleChange}
            >
              <option value="PATIENT">Patient (seeking therapy)</option>
              <option value="THERAPIST">Therapist (providing services)</option>
            </select>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              className={`form-input ${errors.phoneNumber ? 'border-red-500' : ''}`}
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            {errors.phoneNumber && <p className="form-error">{errors.phoneNumber}</p>}
          </div>

          <div>
            <label htmlFor="gender" className="form-label">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              className={`form-input ${errors.gender ? 'border-red-500' : ''}`}
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
            {errors.gender && <p className="form-error">{errors.gender}</p>}
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`form-input pr-10 ${errors.password ? 'border-red-500' : ''}`}
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.password && (
              <p className={`mt-1 text-sm ${passwordStrength().color}`}>
                Password strength: {passwordStrength().text}
              </p>
            )}
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="form-label">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                className={`form-input pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeTerms" className="text-slate-700">
                I agree to the{' '}
                <Link
                  to="/terms"
                  className="font-medium text-teal-600 hover:text-teal-500"
                  target="_blank"
                >
                  terms and conditions
                </Link>
              </label>
              {errors.agreeTerms && <p className="form-error">{errors.agreeTerms}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-md bg-teal-600 text-white font-semibold hover:bg-teal-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-teal-600 hover:text-teal-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
