import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);
  const cursorDotRef = useRef(null);
  const isDark = localStorage.getItem('nexusai_theme') !== 'light';

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorRing = cursorRingRef.current;
    const cursorDot = cursorDotRef.current;
    
    if (!cursor || !cursorRing || !cursorDot) return;

    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // GSAP quick set for initial position
    gsap.set([cursor, cursorRing, cursorDot], { xPercent: -50, yPercent: -50, opacity: 0 });
    
    // Mouse move animation with smooth following
    const onMouseMove = (e) => {
      // Main cursor dot follows instantly
      gsap.to(cursorDot, {
        duration: 0.05,
        x: e.clientX,
        y: e.clientY,
        ease: "power2.out"
      });
      
      // Outer ring follows with slight delay
      gsap.to(cursorRing, {
        duration: 0.3,
        x: e.clientX,
        y: e.clientY,
        ease: "back.out(0.5)"
      });
      
      // Middle glow follows
      gsap.to(cursor, {
        duration: 0.15,
        x: e.clientX,
        y: e.clientY,
        ease: "power2.out"
      });
    };
    
    // Fade in on mouse enter
    const onMouseEnter = () => {
      gsap.to([cursor, cursorRing, cursorDot], {
        duration: 0.3,
        opacity: 1,
        ease: "power2.out"
      });
    };
    
    // Fade out on mouse leave
    const onMouseLeave = () => {
      gsap.to([cursor, cursorRing, cursorDot], {
        duration: 0.3,
        opacity: 0,
        ease: "power2.out"
      });
    };
    
    // Add event listeners
    window.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseenter', onMouseEnter);
    document.body.addEventListener('mouseleave', onMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseenter', onMouseEnter);
      document.body.removeEventListener('mouseleave', onMouseLeave);
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <>
      {/* Outer glowing ring */}
      <div
        ref={cursorRingRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: `2px solid rgba(168,85,247,0.5)`,
          boxShadow: '0 0 15px rgba(168,85,247,0.3)',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          backdropFilter: 'blur(2px)'
        }}
      />
      {/* Middle glow */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #A855F7, #7C3AED)',
          boxShadow: '0 0 10px #A855F7',
          pointerEvents: 'none',
          zIndex: 99999,
          willChange: 'transform',
          opacity: 0.9
        }}
      />
      {/* Center dot */}
      <div
        ref={cursorDotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: '#fff',
          pointerEvents: 'none',
          zIndex: 100000,
          willChange: 'transform'
        }}
      />
    </>
  );
}