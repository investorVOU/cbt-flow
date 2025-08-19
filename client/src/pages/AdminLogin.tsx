import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSignInAlt, faShield } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const logAdminAction = async (action: string, details: string, adminEmail: string) => {
    try {
      const logEntry = {
        action,
        details,
        admin_email: adminEmail,
        created_at: new Date().toISOString()
      };

      // Try to insert to Supabase admin_logs table
      try {
        await (supabase as any).from('admin_logs').insert([logEntry]);
      } catch (supabaseError) {
        // Fallback to localStorage if Supabase fails
        const existingLogs = JSON.parse(localStorage.getItem('adminLogs') || '[]');
        const newLog = { ...logEntry, id: Date.now().toString() };
        const updatedLogs = [newLog, ...existingLogs].slice(0, 50);
        localStorage.setItem('adminLogs', JSON.stringify(updatedLogs));
        console.log('Logged to localStorage:', newLog);
      }
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simple admin authentication - in production, use proper admin roles
      const adminCredentials = [
        { email: 'admin@school.edu', password: 'admin123' },
        { email: 'administrator@institution.edu', password: 'admin456' },
        { email: formData.emailOrUsername, password: 'admin' } // Fallback for testing
      ];

      const isValidAdmin = adminCredentials.some(
        cred => cred.email === formData.emailOrUsername && cred.password === formData.password
      );

      if (isValidAdmin) {
        // Store admin session
        localStorage.setItem('adminEmail', formData.emailOrUsername);
        
        // Log the successful login
        await logAdminAction('LOGIN', 'Admin successfully logged in', formData.emailOrUsername);
        
        // Redirect to admin dashboard
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials. Please check your email and password.');
        await logAdminAction('LOGIN_FAILED', `Failed login attempt for: ${formData.emailOrUsername}`, formData.emailOrUsername);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <Logo size="lg" />
          <div className="mt-4 flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faShield} className="text-accent" />
            <p className="text-text-secondary">
              Administrative Access Portal
            </p>
          </div>
        </div>

        {/* Admin Login Card */}
        <Card className="shadow-lg border-accent/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faShield} className="text-accent" />
              Admin Login
            </CardTitle>
            <CardDescription className="text-center">
              Enter your administrative credentials
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="emailOrUsername">Email or Username</Label>
                <Input
                  id="emailOrUsername"
                  name="emailOrUsername"
                  type="text"
                  placeholder="Enter admin email or username"
                  value={formData.emailOrUsername}
                  onChange={handleInputChange}
                  className="h-11"
                  required
                  data-testid="input-admin-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="h-11 pr-10"
                    required
                    data-testid="input-admin-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary"
                    data-testid="button-toggle-password"
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full mt-6"
                disabled={loading}
                data-testid="button-admin-login"
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                {loading ? 'Signing In...' : 'Access Admin Panel'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-warning-light border border-warning/20 rounded-lg">
              <p className="text-warning-foreground text-sm text-center">
                <FontAwesomeIcon icon={faShield} className="mr-2" />
                This is a restricted area. Unauthorized access is prohibited.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;