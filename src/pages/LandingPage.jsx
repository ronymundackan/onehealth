import React from 'react';
import '../styles/landing-page-styles.css'; // Renamed CSS file

function LandingPage() {
  return (
    <div className="one-health-landing"> {/* Added namespace wrapper */}
      <header className="header">
        <div className="logo-container">
          <h1 className="logo">One<span>Health</span></h1>
        </div>
        <nav className="navigation">
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#testimonials">Testimonials</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <a href="/login" className="login-btn">Login</a>
          <a href="/signup" className="signup-btn">Sign Up</a>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2>Your Medical Records, Unified and Accessible</h2>
          <p>One Health connects your medical history across healthcare providers, giving you complete access to your health information whenever you need it.</p>
          <div className="hero-buttons">
            <a href="/signup" className="primary-btn">Get Started</a>
            <a href="#how-it-works" className="secondary-btn">Learn More</a>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://via.placeholder.com/600x400" alt="Medical records on mobile and desktop" />
        </div>
      </section>

      <section id="features" className="features">
        <h2 className="section-title">Why Choose One Health?</h2>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Complete History</h3>
            <p>Access your entire medical history from all your healthcare providers in one place.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Private & Secure</h3>
            <p>Your data is protected with bank-level security and encryption.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Always Available</h3>
            <p>Access your records anytime, anywhere, from any device.</p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Create Your Account</h3>
              <p>Sign up and verify your identity to ensure your information stays secure.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Connect Your Providers</h3>
              <p>Link the hospitals and clinics where you receive care to your One Health account.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Access Your Records</h3>
              <p>View your complete medical history, prescriptions, and test results in one place.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h3>Share When Needed</h3>
              <p>Easily share your records with new doctors or specialists with secure, temporary access.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="testimonials">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"One Health has simplified my healthcare journey. I no longer worry about remembering my medical history or carrying paper records between doctors."</p>
            </div>
            <div className="testimonial-author">
              <img src="https://via.placeholder.com/60x60" alt="Sarah Johnson" />
              <div>
                <h4>Sarah Johnson</h4>
                <p>One Health User</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"As someone with chronic conditions, having all my records in one place has been life-changing. My new specialists can see my complete history instantly."</p>
            </div>
            <div className="testimonial-author">
              <img src="https://via.placeholder.com/60x60" alt="Michael Chen" />
              <div>
                <h4>Michael Chen</h4>
                <p>One Health User</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <h2>Take control of your health information</h2>
          <p>Join thousands of patients who have simplified their healthcare experience with One Health.</p>
          <a href="/signup" className="primary-btn">Create Your Account</a>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2 className="logo">One<span>Health</span></h2>
            <p>Your health information, unified.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h3>Product</h3>
              <ul>
                <li><a href="/features">Features</a></li>
                <li><a href="/security">Security</a></li>
                <li><a href="/mobile">Mobile App</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Resources</h3>
              <ul>
                <li><a href="/help">Help Center</a></li>
                <li><a href="/guides">User Guides</a></li>
                <li><a href="/faq">FAQ</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Company</h3>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/blog">Blog</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} One Health. All rights reserved.</p>
          <div className="footer-legal">
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
