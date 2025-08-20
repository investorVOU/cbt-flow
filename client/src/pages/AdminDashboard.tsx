import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Logo } from '@/components/ui/logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignOutAlt, 
  faUsers, 
  faClipboardCheck, 
  faUserPlus, 
  faEdit, 
  faTrash,
  faEye,
  faRefresh
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string | number;
  user_id?: string;
  name: string;
  email: string;
  student_id: string | null;
  course?: string;
  is_active: boolean;
  display_name?: string | null;
  username?: string | null;
  created_at: string;
}

interface AttendanceRecord {
  id: string | number;
  user_id?: string;
  student_id?: string | number;
  student_name?: string;
  status: string;
  method: string;
  location?: string;
  timestamp?: string;
  created_at?: string;
  profiles?: {
    display_name: string | null;
    username: string | null;
  };
}

interface AdminLog {
  id: string | number;
  action: string;
  details?: string;
  admin_email?: string;
  created_at?: string;
  timestamp: string;
  admin_email: string;
}

const AdminDashboard = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Profile | null>(null);
  const [editingAttendance, setEditingAttendance] = useState<AttendanceRecord | null>(null);
  const navigate = useNavigate();

  // Simulate admin session - in real app this would come from auth
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@school.edu';

  useEffect(() => {
    if (!localStorage.getItem('adminEmail')) {
      navigate('/admin');
      return;
    }
    fetchAllData();
  }, [navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchAttendanceRecords(),
      fetchProfiles(),
      fetchAdminLogs()
    ]);
    setLoading(false);
  };

  const fetchAttendanceRecords = async () => {
    try {
      // Fetch attendance data with student information
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select(`
          id,
          status,
          method,
          location,
          timestamp,
          created_at,
          user_id,
          students (
            id,
            name,
            email,
            student_id
          )
        `)
        .order('created_at', { ascending: false });

      // Also get profiles data for fallback
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (!attendanceError && attendanceData) {
        // Map attendance records with student names
        const transformedData = attendanceData.map(record => {
          const studentProfile = profilesData?.find(p => p.user_id === record.user_id);
          const studentName = record.students?.name || 
                             studentProfile?.display_name || 
                             studentProfile?.username || 
                             'Unknown Student';
          const studentEmail = record.students?.email || 
                              studentProfile?.username || 
                              'No email';
          
          return {
            ...record,
            status: record.status || 'present',
            method: record.method || 'manual',
            student_name: studentName,
            student_email: studentEmail,
            timestamp: record.timestamp || record.created_at,
            location: record.location || 'Campus'
          };
        });
        
        setAttendanceRecords(transformedData);
        return;
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }

    // Fallback: create sample data for testing
    const sampleAttendance = [
      {
        id: 1,
        student_name: 'John Doe',
        student_email: 'john@school.edu', 
        status: 'present',
        method: 'face_scan',
        timestamp: new Date().toISOString(),
        location: 'Lab 1'
      },
      {
        id: 2,
        student_name: 'Jane Smith',
        student_email: 'jane@school.edu',
        status: 'present', 
        method: 'biometric',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        location: 'Lab 2'
      }
    ];
    setAttendanceRecords(sampleAttendance);
  };

  const fetchProfiles = async () => {
    try {
      // Fetch from Supabase profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Transform profiles data to match expected format
        const transformedProfiles = data.map(profile => ({
          ...profile,
          name: profile.display_name || profile.username || 'No name set',
          email: profile.username || 'No email', // username field might store email
          student_id: profile.student_id,
          course: 'Computer Science', // Default course
          is_active: true // Default to active
        }));
        
        setProfiles(transformedProfiles);
        return;
      }
    } catch (error) {
      console.error('Error fetching student profiles:', error);
    }

    // Fallback: create sample data for testing
    const sampleStudents = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@school.edu',
        student_id: 'ST001', 
        course: 'Computer Science',
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Jane Smith', 
        email: 'jane@school.edu',
        student_id: 'ST002',
        course: 'Information Technology',
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];
    setProfiles(sampleStudents);
  };

  const fetchAdminLogs = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from('admin_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        // If table doesn't exist, use localStorage fallback
        console.log('Admin logs table may not exist yet, using localStorage');
        const localLogs = JSON.parse(localStorage.getItem('adminLogs') || '[]');
        setAdminLogs(localLogs);
        return;
      }
      setAdminLogs(data || []);
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      // Fallback to localStorage
      const localLogs = JSON.parse(localStorage.getItem('adminLogs') || '[]');
      setAdminLogs(localLogs);
    }
  };

  const logAdminAction = async (action: string, details: string) => {
    try {
      const logEntry = {
        action,
        details,
        admin_email: adminEmail,
        created_at: new Date().toISOString()
      };

      // Try to insert to Supabase, fallback to local storage
      try {
        const { error } = await (supabase as any)
          .from('admin_logs')
          .insert([logEntry]);

        if (error) throw error;
      } catch (supabaseError) {
        // Fallback to localStorage
        const existingLogs = JSON.parse(localStorage.getItem('adminLogs') || '[]');
        const newLog = { ...logEntry, id: Date.now().toString() };
        const updatedLogs = [newLog, ...existingLogs].slice(0, 50);
        localStorage.setItem('adminLogs', JSON.stringify(updatedLogs));
        setAdminLogs(updatedLogs);
      }
      
      fetchAdminLogs();
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  };

  const handleDeleteAttendance = async (recordId: string | number) => {
    await logAdminAction('Delete Attendance', `Deleted attendance record ID: ${recordId}`);
    setAttendanceRecords(prev => prev.filter(record => record.id !== recordId));
  };

  const deleteStudent = async (profile: Profile) => {
    if (!confirm(`Are you sure you want to delete student ${profile.display_name || profile.username}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profile.id);

      if (error) throw error;
      
      await logAdminAction('DELETE_STUDENT', `Deleted student: ${profile.display_name || profile.username} (ID: ${profile.student_id})`);
      fetchProfiles();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student');
    }
  };

  const deleteAttendanceRecord = async (record: AttendanceRecord) => {
    if (!confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', record.id);

      if (error) throw error;
      
      await logAdminAction('DELETE_ATTENDANCE', `Deleted attendance record for student ID: ${record.student_id}`);
      fetchAttendanceRecords();
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      alert('Failed to delete attendance record');
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('adminEmail');
    await logAdminAction('LOGOUT', 'Admin logged out');
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Logo size="md" />
          <p className="text-text-secondary mt-4">Loading admin dashboard...</p>
        </div>
      </div>
    );
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
                <p className="font-medium text-text-primary">Admin Dashboard</p>
                <p className="text-sm text-text-secondary">{adminEmail}</p>
              </div>
              
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
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faUsers} className="text-primary text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{profiles.length}</p>
                  <p className="text-text-secondary">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faClipboardCheck} className="text-accent text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{attendanceRecords.length}</p>
                  <p className="text-text-secondary">Attendance Records</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <FontAwesomeIcon icon={faEye} className="text-success text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">{adminLogs.length}</p>
                  <p className="text-text-secondary">Admin Actions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Refresh Button */}
        <div className="mb-6">
          <Button onClick={fetchAllData} variant="outline" data-testid="button-refresh">
            <FontAwesomeIcon icon={faRefresh} />
            Refresh Data
          </Button>
        </div>

        {/* Attendance Records Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>Live view of all student attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.timestamp ? new Date(record.timestamp).toLocaleString() : 'N/A'}</TableCell>
                      <TableCell className="font-medium">{(record as any).student_name}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={record.status === 'present' ? 'default' : 'destructive'}
                          data-testid={`badge-status-${record.id}`}
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {record.method?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.location || 'Campus'}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteAttendance(record.id)}
                          data-testid={`button-delete-attendance-${record.id}`}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Student Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Student Management</CardTitle>
            <CardDescription>Manage student accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell className="font-medium">{profile.name}</TableCell>
                      <TableCell>{profile.email}</TableCell>
                      <TableCell>{profile.student_id || 'N/A'}</TableCell>
                      <TableCell>{profile.course || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={profile.is_active ? 'default' : 'outline'}>
                          {profile.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteStudent(profile)}
                            data-testid={`button-delete-student-${profile.id}`}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Admin Activity Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Activity Logs</CardTitle>
            <CardDescription>Recent administrative actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                      <TableCell>{log.admin_email}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 bg-accent/10 text-accent rounded text-sm">
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell>{log.details}</TableCell>
                    </TableRow>
                  ))}
                  {adminLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-text-muted">
                        No admin logs available yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;