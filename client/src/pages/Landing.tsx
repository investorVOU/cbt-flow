import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus, faClipboardCheck, faUsers, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-6 py-6">
        <Logo size="md" />
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
              Modern CBT 
              <span className="gradient-text block">Attendance</span>
              Platform
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Streamline your computer-based training attendance with our 
              professional, easy-to-use platform designed for educational institutions.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-surface p-6 rounded-xl shadow-md card-hover">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faClipboardCheck} className="text-primary text-xl" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Quick Attendance</h3>
              <p className="text-text-secondary text-sm">
                Mark attendance instantly with student ID verification
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl shadow-md card-hover">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faUsers} className="text-accent text-xl" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">Student Management</h3>
              <p className="text-text-secondary text-sm">
                Comprehensive student account and record management
              </p>
            </div>

            <div className="bg-surface p-6 rounded-xl shadow-md card-hover">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faQrcode} className="text-success text-xl" />
              </div>
              <h3 className="font-semibold text-text-primary mb-2">QR Code Ready</h3>
              <p className="text-text-secondary text-sm">
                Future-ready with QR code scanning capabilities
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Button 
              asChild
              variant="hero" 
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link to="/login">
                <FontAwesomeIcon icon={faSignInAlt} />
                Sign In
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link to="/signup">
                <FontAwesomeIcon icon={faUserPlus} />
                Create Account
              </Link>
            </Button>
          </div>

          <p className="text-xs text-text-muted mt-6">
            For administrative access, contact your system administrator
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-text-muted text-sm">
            © 2024 CBT Attendance Platform. Professional training management solution.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;