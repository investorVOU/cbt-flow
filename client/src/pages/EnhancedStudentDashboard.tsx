import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { BiometricCapture } from '@/components/BiometricCapture';
import { supabase } from '@/integrations/supabase/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClipboardCheck,
  faSignOutAlt,
  faUser,
  faCalendarDays,
  faClock,
  faRefresh,
  faFingerprint,
  faCamera,
  faIdCard,
  faCheckCircle,
  faTimesCircle,
  faChartLine,
  faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/hooks/useAuth';

export function EnhancedStudentDashboard() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState({
    totalDays: 0,
    presentDays: 0,
    attendanceRate: 0
  });
  const [showBiometric, setShowBiometric] = useState(false);
  const [lastVerification, setLastVerification] = useState<any>(null);
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchProfile(),
      fetchRecentAttendance(),
      fetchAttendanceStats()
    ]);
    setLoading(false);
  };

  const fetchProfile = async () => {
    if (!user) return;

    try {
      // Get from Supabase profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!profileError && profileData) {
        setProfile({
          id: profileData.id,
          name: profileData.display_name || profileData.username || user.email?.split('@')[0] || 'Student',
          email: user.email,
          student_id: profileData.student_id || `ST${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          course: 'Computer Science',
          is_active: true,
          display_name: profileData.display_name,
          username: profileData.username,
          created_at: profileData.created_at
        });
        return;
      }

      // If no profile exists, create a basic fallback
      setProfile({
        id: user.id,
        name: user.email?.split('@')[0] || 'Student',
        email: user.email,
        student_id: `ST${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        course: 'Computer Science',
        is_active: true
      });
    } catch (error) {
      console.error('Error fetching profile:', error);

      // Fallback profile
      setProfile({
        id: user.id,
        name: user.email?.split('@')[0] || 'Student',
        email: user.email,
        student_id: 'ST000',
        course: 'Computer Science',
        is_active: true
      });
    }
  };

  const fetchRecentAttendance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          id,
          status,
          method,
          location,
          timestamp,
          created_at,
          students (
            name,
            email
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        const formattedData = data.map(record => ({
          id: record.id,
          status: record.status,
          method: record.method,
          location: record.location,
          timestamp: record.timestamp || record.created_at,
        }));
        setRecentAttendance(formattedData);
      } else {
        console.error('Error fetching attendance:', error);
        // Sample data for demonstration
        setRecentAttendance([
          {
            id: 1,
            timestamp: new Date().toISOString(),
            status: 'present',
            method: 'face_scan',
            location: 'Lab 1'
          },
          {
            id: 2,
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            status: 'present',
            method: 'biometric',
            location: 'Lab 2'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchAttendanceStats = async () => {
    // Calculate attendance statistics
    const totalDays = 20; // Sample: 20 training days
    const presentDays = recentAttendance.filter(record => record.status === 'present').length;
    const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    setAttendanceStats({
      totalDays,
      presentDays,
      attendanceRate
    });
  };

  const handleBiometricCapture = async (data: { type: string; data: string; confidence: number }) => {
    setLoading(true);

    try {
      // Store the verification result
      setLastVerification({
        type: data.type,
        confidence: data.confidence,
        timestamp: new Date().toISOString()
      });

      // Create attendance record - create a student record first if needed
      let studentId = profile?.id;

      // For now, let's create the attendance record without foreign key constraint
      // In production, we would first ensure the student exists in the students table
      const attendanceRecord = {
        student_id: studentId,
        status: 'present',
        method: data.type,
        location: 'Campus',
        ip_address: '127.0.0.1',
        device_info: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      // Try to insert into Supabase database
      try {
        console.log('Inserting attendance record:', attendanceRecord);

        const { data, error } = await supabase
          .from('attendance')
          .insert([attendanceRecord])
          .select();

        if (error) {
          console.error('Supabase error:', error);
          alert(`Database error: ${error.message}`);
          return;
        }

        console.log('Attendance recorded successfully:', data);
        alert('Attendance recorded successfully in database!');
      } catch (supabaseError) {
        console.error('Failed to insert attendance record:', supabaseError);
        alert('Failed to save to database. Please try again.');
        return;
      }

      // Refresh data
      await fetchData();
      setShowBiometric(false);

      // Show success message
      alert(`Attendance marked successfully using ${data.type.replace('_', ' ')}! Confidence: ${Math.round(data.confidence * 100)}%`);
    } catch (error) {
      console.error('Error recording attendance:', error);
      alert('Error recording attendance. Please try again.');
    }

    setLoading(false);
  };

  const handleBiometricError = (error: string) => {
    console.error('Biometric error:', error);
    alert(`Biometric verification failed: ${error}`);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/30 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faUser} className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">Student Dashboard</h1>
                <p className="text-sm text-text-secondary">
                  Welcome back, {profile?.name || 'Student'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchData}
                disabled={loading}
                data-testid="button-refresh"
              >
                <FontAwesomeIcon icon={faRefresh} className={loading ? 'animate-spin' : ''} />
                Refresh
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                data-testid="button-logout"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Profile Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="text-primary" />
              Student Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-muted">Name</p>
                  <p className="text-lg font-medium text-text-primary">{profile?.name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Student ID</p>
                  <p className="text-lg font-medium text-text-primary">{profile?.student_id || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Email</p>
                  <p className="text-lg font-medium text-text-primary">{profile?.email || user?.email}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-text-muted">Course</p>
                  <p className="text-lg font-medium text-text-primary">{profile?.course || 'Not assigned'}</p>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Status</p>
                  <Badge variant={profile?.is_active !== false ? 'default' : 'outline'}>
                    {profile?.is_active !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-text-muted">Attendance Rate</p>
                  <div className="flex items-center gap-3">
                    <Progress value={attendanceStats.attendanceRate} className="flex-1" />
                    <span className="text-sm font-medium text-text-primary">
                      {attendanceStats.attendanceRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mark Attendance Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faClipboardCheck} className="text-accent" />
              Mark Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showBiometric ? (
              <div className="text-center py-8">
                <div className="mb-6">
                  <FontAwesomeIcon icon={faCalendarCheck} className="text-5xl text-primary mb-4" />
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Ready to mark attendance?
                  </h3>
                  <p className="text-text-secondary max-w-md mx-auto">
                    Use our secure biometric verification system to mark your attendance quickly and safely.
                  </p>
                </div>

                <Button
                  onClick={() => setShowBiometric(true)}
                  size="lg"
                  className="px-8 py-6 text-lg"
                  data-testid="button-start-verification"
                >
                  <FontAwesomeIcon icon={faFingerprint} className="mr-2" />
                  Start Verification
                </Button>

                {lastVerification && (
                  <Alert className="mt-6 max-w-md mx-auto">
                    <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4" />
                    <AlertDescription>
                      Last verification: {lastVerification.type.replace('_', ' ')} at{' '}
                      {new Date(lastVerification.timestamp).toLocaleString()}
                      <br />
                      Confidence: {Math.round(lastVerification.confidence * 100)}%
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <BiometricCapture
                onCapture={handleBiometricCapture}
                onError={handleBiometricError}
              />
            )}
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCalendarDays} className="text-success" />
                Recent Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAttendance.length > 0 ? (
                  recentAttendance.map((record, index) => (
                    <div key={record.id || index} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                      <div>
                        <p className="font-medium text-text-primary">
                          {new Date(record.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-text-muted">
                          {record.method?.replace('_', ' ') || 'Manual'} • {record.location || 'Campus'}
                        </p>
                      </div>
                      <Badge variant={record.status === 'present' ? 'default' : 'destructive'}>
                        {record.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-text-muted py-8">
                    No attendance records yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Attendance Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="text-warning" />
                Attendance Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {attendanceStats.attendanceRate}%
                  </div>
                  <p className="text-text-secondary">Overall Attendance</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-success/5 rounded-lg">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success text-2xl mb-2" />
                    <div className="text-xl font-bold text-text-primary">{attendanceStats.presentDays}</div>
                    <p className="text-sm text-text-muted">Present Days</p>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-lg">
                    <FontAwesomeIcon icon={faClock} className="text-text-muted text-2xl mb-2" />
                    <div className="text-xl font-bold text-text-primary">{attendanceStats.totalDays}</div>
                    <p className="text-sm text-text-muted">Total Days</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Face Recognition</span>
                    <Badge variant="outline">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">Biometric Scan</span>
                    <Badge variant="outline">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">ID Upload</span>
                    <Badge variant="outline">Available</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}