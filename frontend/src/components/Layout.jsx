import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import SecondaryNavbar from './SecondaryNavbar';
import Footer from './Footer';

const Layout = () => {
  const headerWrapRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  const updateHeight = () => {
    if (headerWrapRef.current) {
      setHeaderHeight(headerWrapRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    updateHeight();
    const t = setTimeout(updateHeight, 350);
    window.addEventListener('resize', updateHeight);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Re-measure header when its height changes (e.g. mobile Categories dropdown open/close)
  useEffect(() => {
    const el = headerWrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      updateHeight();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);


  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0" style={{ '--app-header-height': `${headerHeight}px` }}>
      {/* Navbar - Fixed at top */}
      <div ref={headerWrapRef} className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-br from-gray-50 via-teal-50/30 to-cyan-50/30 transition-[height] duration-200" style={{ overflow: 'visible' }}>
        <Navbar />
        {/* Secondary Navbar - Desktop only, always sticky, hidden on mobile */}
        <div className="hidden md:block">
          <SecondaryNavbar />
        </div>
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
