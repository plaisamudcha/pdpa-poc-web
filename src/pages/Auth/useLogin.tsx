import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { getErrorMessage } from '@/services/api/axios';
import { TypeLogin } from '@/types/products/auth';

const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<TypeLogin>({ defaultValues: { username: '', password: '' } });

  const onSubmit = form.handleSubmit(async (values) => {
    setErrorMessage(null);
    try {
      await login(values);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from && from !== '/login' ? from : '/admin/users', { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      form.resetField('password');
    }
  });

  return { form, onSubmit, errorMessage, showPassword, toggleShowPassword: () => setShowPassword((v) => !v) };
};

export default useLogin;
