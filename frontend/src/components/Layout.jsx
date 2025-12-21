import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  const headerWrapRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (headerWrapRef.current) {
        setHeaderHeight(headerWrapRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div className="flex flex-col min-h-screen" style={{ '--app-header-height': `${headerHeight}px` }}>
      {/* Navbar - Fixed at top */}
      <div ref={headerWrapRef} className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/30" style={{ overflow: 'visible' }}>
        <Navbar />
      </div>

      {/* Spacer equal to header height to avoid overlap */}
      <div aria-hidden="true" style={{ height: headerHeight }} className="bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/30 border-b border-gray-300" />

      {/* Main Content Area with responsive padding */}
      <main className="flex-grow" style={{ position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
