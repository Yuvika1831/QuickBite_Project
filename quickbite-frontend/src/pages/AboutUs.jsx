import React from 'react';
import '../styles/AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">Our Story</h1>
          <p className="hero-subtitle">
            Redefining food delivery with passion, quality, and innovation
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-content">
              <h2>Our Mission</h2>
              <p>
                At QuickBite, we believe that great food should be accessible to everyone, 
                anytime. We're committed to connecting food lovers with the best local 
                restaurants, delivering exceptional experiences right to your doorstep.
              </p>
              <div className="mission-stats">
                <div className="stat">
                  <h3>50K+</h3>
                  <p>Happy Customers</p>
                </div>
                <div className="stat">
                  <h3>500+</h3>
                  <p>Partner Restaurants</p>
                </div>
                <div className="stat">
                  <h3>15+</h3>
                  <p>Cities Served</p>
                </div>
              </div>
            </div>
            <div className="mission-image">
              <div className="image-placeholder">
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🚀</div>
              <h3>Innovation</h3>
              <p>
                Constantly evolving our technology to provide faster, smarter, 
                and more personalized food delivery experiences.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Quality</h3>
              <p>
                Partnering with the finest restaurants and maintaining the highest 
                standards in every delivery.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Community</h3>
              <p>
                Supporting local businesses and building strong relationships 
                within the communities we serve.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Leadership Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">
                <span>SD</span>
              </div>
              <h3>Sarah Johnson</h3>
              <p className="member-role">CEO & Founder</p>
              <p className="member-bio">
                Former restaurant owner with 15+ years in the food industry.
              </p>
            </div>
            <div className="team-member">
              <div className="member-avatar">
                <span>MR</span>
              </div>
              <h3>Michael Chen</h3>
              <p className="member-role">CTO</p>
              <p className="member-bio">
                Tech innovator passionate about creating seamless user experiences.
              </p>
            </div>
            <div className="team-member">
              <div className="member-avatar">
                <span>EP</span>
              </div>
              <h3>Emily Parker</h3>
              <p className="member-role">Head of Operations</p>
              <p className="member-bio">
                Logistics expert dedicated to perfecting the delivery process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Join the QuickBite Family</h2>
          <p>
            Whether you're a food lover, restaurant partner, or delivery driver, 
            there's a place for you in our growing community.
          </p>
          <div className="cta-buttons">
            <button className="btn-primary">Order Now</button>
            <button className="btn-secondary">Partner With Us</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
