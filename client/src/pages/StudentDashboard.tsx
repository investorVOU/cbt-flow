import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faUser, faSignOutAlt, faClock, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const StudentDashboard = () => {
  const [studentId, setStudentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Fetch user profile and attendance data
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchRecentAttendance();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    setProfile(data);
  };

  const fetchRecentAttendance = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    setRecentAttendance(data || []);
  };

  const handleAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('attendance')
        .insert([
          {
            user_id: user.id,
            student_id: studentId.trim()
          }
        ]);

      if (error) throw error;
      
      setStudentId('');
      fetchRecentAttendance(); // Refresh attendance list
      alert('Attendance marked successfully!');
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      alert('Failed to mark attendance. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Logo size="md" />
          <p className="text-text-secondary mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-text-primary">{profile?.display_name || user.email}</p>
                <p className="text-sm text-text-secondary">{profile?.student_id || 'N/A'}</p>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="text-text-muted hover:text-danger"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Welcome back, {profile?.display_name?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-text-secondary">
              Mark your attendance and view your records from your dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mark Attendance Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faClipboardCheck} className="text-primary" />
                  Mark Attendance
                </CardTitle>
                <CardDescription>
                  Enter your student ID to record your attendance for today's session
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleAttendanceSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="attendanceStudentId">Student ID</Label>
                    <Input
                      id="attendanceStudentId"
                      type="text"
                      placeholder="Enter your student ID"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    <FontAwesomeIcon icon={faClipboardCheck} />
                    {isSubmitting ? 'Marking Attendance...' : 'Mark Present'}
                  </Button>
                </form>

                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-text-secondary">
                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                    Current time: {new Date().toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Student Info Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faUser} className="text-accent" />
                  Your Information
                </CardTitle>
                <CardDescription>
                  Your registered student details
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-xs text-text-muted">Full Name</Label>
                    <p className="font-medium text-text-primary">{profile?.display_name || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-text-muted">Email Address</Label>
                    <p className="font-medium text-text-primary">{user.email}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-text-muted">Username</Label>
                    <p className="font-medium text-text-primary">{profile?.username || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-text-muted">Student ID</Label>
                    <p className="font-medium text-text-primary">{profile?.student_id || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Attendance */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarCheck} className="text-success" />
                Recent Attendance
              </CardTitle>
              <CardDescription>
                Your attendance history for the past sessions
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {recentAttendance.length > 0 ? (
                  recentAttendance.map((record, index) => (
                    <div 
                      key={record.id || index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-text-primary">
                          {new Date(record.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-text-secondary">
                          {new Date(record.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-success-light text-success text-sm font-medium rounded-full">
                          Present
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-text-secondary">
                    No attendance records yet. Mark your first attendance above!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;