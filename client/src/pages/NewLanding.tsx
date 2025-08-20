import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faCalendarCheck, 
  faFingerprint, 
  faCamera,
  faIdCard,
  faShieldAlt,
  faUsers,
  faBolt,
  faArrowRight,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/hooks/useAuth';

export function NewLanding() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-elevated">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-success rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 px-6 py-4 border-b border-border/50 backdrop-blur-sm bg-background/80">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faGraduationCap} className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-primary">CBT Attendance</h1>
                <p className="text-sm text-text-muted">Smart Training Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary hover:bg-primary/90"
                  data-testid="button-dashboard"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/login')}
                    className="hover:bg-primary/10"
                    data-testid="button-login"
                  >
                    Login
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/signup')}
                    className="border-primary/20 hover:bg-primary/5"
                    data-testid="button-signup"
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="outline" className="mb-6 bg-primary/5 border-primary/20 text-primary">
              <FontAwesomeIcon icon={faBolt} className="mr-2" />
              Next-Generation Attendance System
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6">
              Smart{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  CBT Attendance
                </span>
                <svg className="absolute -bottom-2 left-0 w-full h-3 fill-accent/20" viewBox="0 0 100 10">
                  <path d="M0,8 Q50,0 100,8 L100,10 L0,10 Z"/>
                </svg>
              </span>{' '}
              Platform
            </h1>
            
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Revolutionary attendance management with biometric verification, face recognition, and seamless digital integration. 
              Built for modern educational institutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {user ? (
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl transition-all"
                  onClick={() => navigate('/dashboard')}
                  data-testid="button-go-dashboard"
                >
                  Go to Dashboard
                  <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-6 bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl transition-all"
                    onClick={() => navigate('/signup')}
                    data-testid="button-get-started"
                  >
                    Register Now
                    <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="text-lg px-8 py-6 border-2 hover:bg-accent/5"
                    onClick={() => navigate('/login')}
                    data-testid="button-student-login"
                  >
                    Student Login
                  </Button>
                </>
              )}
            </div>

            {/* Feature Icons */}
            <div className="flex flex-wrap justify-center gap-6 mb-20">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-border/30">
                <FontAwesomeIcon icon={faFingerprint} className="text-primary" />
                <span className="text-sm text-text-secondary">Biometric Verification</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-border/30">
                <FontAwesomeIcon icon={faCamera} className="text-accent" />
                <span className="text-sm text-text-secondary">Face Recognition</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-border/30">
                <FontAwesomeIcon icon={faIdCard} className="text-success" />
                <span className="text-sm text-text-secondary">ID Upload</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-surface/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Advanced Features for Modern Education
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Everything you need to manage attendance with precision, security, and ease.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Biometric Security */}
            <Card className="p-8 hover:shadow-lg transition-shadow border-border/50">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <FontAwesomeIcon icon={faFingerprint} className="text-primary text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Biometric Security</h3>
                <p className="text-text-secondary mb-6">
                  Advanced fingerprint recognition ensures only authorized students can mark attendance, eliminating proxy attendance completely.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success text-xs" />
                    Fingerprint scanning
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success text-xs" />
                    99.9% accuracy rate
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success text-xs" />
                    Encrypted storage
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Face Recognition */}
            <Card className="p-8 hover:shadow-lg transition-shadow border-border/50">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6">
                  <FontAwesomeIcon icon={faCamera} className="text-accent text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Face Recognition</h3>
                <p className="text-text-secondary mb-6">
                  AI-powered facial recognition technology provides contactless attendance marking with real-time verification capabilities.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success text-xs" />
                    Real-time detection
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success text-xs" />
                    Anti-spoofing protection
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success text-xs" />
                    Contactless operation
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Smart Analytics */}
            <Card className="p-8 hover:shadow-lg transition-shadow border-border/50">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mb-6">
                  <FontAwesomeIcon icon={faCalendarCheck} className="text-success text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-4">Smart Analytics</h3>
                <p className="text-text-secondary mb-6">
                  Comprehensive attendance analytics with real-time reporting, patterns analysis, and automated notifications.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success text-xs" />
                    Live dashboards
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success text-xs" />
                    Pattern analysis
                  </li>
                  <li className="flex items-center gap-2 text-sm text-text-secondary">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success text-xs" />
                    Auto notifications
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Stats Row */}
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-text-secondary">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">&lt;2s</div>
              <div className="text-text-secondary">Recognition Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-2">500+</div>
              <div className="text-text-secondary">Institutions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-warning mb-2">24/7</div>
              <div className="text-text-secondary">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-hover opacity-50"></div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <FontAwesomeIcon icon={faUsers} className="text-6xl mb-6 opacity-80" />
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Attendance System?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join hundreds of institutions already using our platform to streamline attendance management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => navigate('/signup')}
              data-testid="button-start-free-trial"
            >
              Start Free Trial
              <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10"
              onClick={() => navigate('/admin')}
              data-testid="button-admin-demo"
            >
              <FontAwesomeIcon icon={faShieldAlt} className="mr-2" />
              Admin Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-surface border-t border-border/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faGraduationCap} className="text-white text-sm" />
              </div>
              <div>
                <div className="font-semibold text-text-primary">CBT Attendance Platform</div>
                <div className="text-xs text-text-muted">Smart Training Solutions</div>
              </div>
            </div>
            
            <div className="text-sm text-text-secondary">
              © 2024 CBT Attendance Platform. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}