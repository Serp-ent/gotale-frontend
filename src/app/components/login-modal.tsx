"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './auth-provider';
import { Button } from '@/components/ui/button';
import { X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

// Reusable Error Message Component
const ErrorMessage = ({ error }: { error?: string[] }) => {
  if (!error || error.length === 0) return null;
  return <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error.join(', ')}</p>;
};

// Reusable Input Field Component
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  hasError?: boolean;
  error?: string[];
}

const InputField = ({ label, name, hasError, error, className, required, ...props }: InputFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500 dark:text-red-400">*</span>}
      </label>
      <input
        name={name}
        required={required}
        className={cn(
          "w-full p-2 rounded-md border bg-background focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-colors",
          hasError 
            ? 'border-red-500 dark:border-red-400 ring-1 ring-red-500 dark:ring-red-400' 
            : 'border-border',
          className
        )}
        {...props}
      />
      <ErrorMessage error={error} />
    </div>
  );
};

export default function LoginModal() {
  const { showLoginModal, setShowLoginModal, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Unified Form State
  const initialFormState = {
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    first_name: '',
    last_name: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setErrors({});
  }, []);

  // Reset on open/close
  useEffect(() => {
    if (!showLoginModal) {
      resetForm();
    }
  }, [showLoginModal, resetForm]);

  // Reset on mode switch
  useEffect(() => {
    resetForm();
  }, [isLogin, resetForm]);

  if (!showLoginModal) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear specific field error and general errors on type
    if (errors[name] || errors.non_field_errors || errors.detail) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        delete newErrors.non_field_errors;
        delete newErrors.detail;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        await login({ 
            username: formData.username, 
            password: formData.password, 
            access: '', 
            refresh: '' 
        });
      } else {
        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: ["Hasła muszą być identyczne"] });
            setIsLoading(false);
            return;
        }
        await register({ 
            username: formData.username, 
            password: formData.password, 
            email: formData.email, 
            first_name: formData.first_name, 
            last_name: formData.last_name 
        });
        setIsLogin(true);
      }
    } catch (error) {
       if (axios.isAxiosError(error) && error.response?.data) {
          const data = error.response.data;
          if (data.detail && !data.non_field_errors) {
              setErrors({ ...data, non_field_errors: [data.detail] });
          } else {
              setErrors(data);
          }
       }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card text-card-foreground w-full max-w-md p-6 rounded-xl shadow-2xl border border-border relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => setShowLoginModal(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? 'Zaloguj się' : 'Zarejestruj się'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Nazwa użytkownika"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            hasError={!!errors.username}
            error={errors.username}
            required
          />

          {!isLogin && (
            <>
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                hasError={!!errors.email}
                error={errors.email}
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Imię"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  hasError={!!errors.first_name}
                  error={errors.first_name}
                />
                <InputField
                  label="Nazwisko"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  hasError={!!errors.last_name}
                  error={errors.last_name}
                />
              </div>
            </>
          )}

          <InputField
            label="Hasło"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            hasError={!!errors.password}
            error={errors.password}
            required
          />

          {!isLogin && (
            <InputField
              label="Potwierdź hasło"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              hasError={!!errors.confirmPassword}
              error={errors.confirmPassword}
              required
            />
          )}

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-white font-bold mt-4" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? 'Zaloguj' : 'Zarejestruj'}
          </Button>

          {errors.non_field_errors && (
             <div className="bg-red-500/10 text-red-500 dark:text-red-400 p-3 rounded-md text-sm border border-red-500/20 mt-4 animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.non_field_errors.join(', ')}
             </div>
          )}
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {isLogin ? (
            <>
              Nie masz konta?{' '}
              <button 
                onClick={() => setIsLogin(false)} 
                className="text-accent hover:underline font-medium"
              >
                Zarejestruj się
              </button>
            </>
          ) : (
            <>
              Masz już konto?{' '}
              <button 
                onClick={() => setIsLogin(true)} 
                className="text-accent hover:underline font-medium"
              >
                Zaloguj się
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
