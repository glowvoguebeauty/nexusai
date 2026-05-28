// src/components/layout/Footer.jsx
import React from 'react';

const Footer = ({ isDark }) => {
  return (
    <footer style={{
      background: isDark ? '#050508' : '#f5f5f5',
      borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
      padding: '60px 40px 40px',
      width: '100%',
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Top grid: logo + 4 link columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
          gap: 40,
          marginBottom: 60
        }}>
          {/* Logo & description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: 'linear-gradient(135deg,#A855F7,#7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>⚡</div>
              <span style={{ fontSize: 18, fontWeight: 800, color: isDark ? '#fff' : '#1a1a1a' }}>NexusAI</span>
            </div>
            <p style={{
              color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
              fontSize: 13, lineHeight: 1.7, maxWidth: 240
            }}>
              The AI operating system powering the next generation of autonomous businesses worldwide.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {['𝕏', 'in', '▶', 'f'].map((icon) => (
                <div key={icon} style={{
                  width: 32, height: 32,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, cursor: 'pointer',
                  color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'
                }}>{icon}</div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'API Docs', 'Changelog'] },
            { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press', 'Partners'] },
            { title: 'Resources', links: ['Help Center', 'Case Studies', 'Templates', 'Community', 'Status'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'GDPR', 'Cookies'] }
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 16, color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>
                {col.title}
              </div>
              {col.links.map((link) => (
                <div key={link} style={{ marginBottom: 10 }}>
                  <a href="#" style={{
                    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
                    fontSize: 13, textDecoration: 'none', transition: 'color 0.2s'
                  }}>{link}</a>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <span style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)', fontSize: 13 }}>
            © 2026 NexusAI Inc. All rights reserved. Serving 137 countries worldwide.
          </span>
          <div style={{ display: 'flex', gap: 16 }}>
            {['🇺🇸 English', '🇪🇺 EUR', 'SOC2 ✓', 'ISO 27001 ✓'].map((badge) => (
              <span key={badge} style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontSize: 12 }}>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;