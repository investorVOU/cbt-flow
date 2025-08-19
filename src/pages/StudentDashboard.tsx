import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faUser, faSignOutAlt, faClock, faCalendarCheck } from '@fortawesome/free-solid-svg-icons';

const StudentDashboard = () => {
  const [studentId, setStudentId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock student data - replace with actual user data from Supabase
  const studentData = {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    username: 'johndoe',
    studentId: 'STU12345',
  };

  // Mock attendance records - replace with actual data from Supabase
  const recentAttendance = [
    { date: '2024-01-15', time: '10:30 AM', status: 'Present' },
    { date: '2024-01-14', time: '10:25 AM', status: 'Present' },
    { date: '2024-01-13', time: '10:35 AM', status: 'Present' },
  ];

  const handleAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement attendance submission to Supabase
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Attendance marked for student ID:', studentId);
      setStudentId('');
      // Show success message
    } catch (error) {
      console.error('Failed to mark attendance:', error);
      // Show error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    // TODO: Implement logout with Supabase
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-text-primary">{studentData.name}</p>
                <p className="text-sm text-text-secondary">{studentData.studentId}</p>
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
              Welcome back, {studentData.name.split(' ')[0]}!
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
                    <p className="font-medium text-text-primary">{studentData.name}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-text-muted">Email Address</Label>
                    <p className="font-medium text-text-primary">{studentData.email}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-text-muted">Username</Label>
                    <p className="font-medium text-text-primary">{studentData.username}</p>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-text-muted">Student ID</Label>
                    <p className="font-medium text-text-primary">{studentData.studentId}</p>
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
                {recentAttendance.map((record, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-text-primary">{record.date}</p>
                      <p className="text-sm text-text-secondary">{record.time}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-success-light text-success text-sm font-medium rounded-full">
                        {record.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;