import React from 'react';
import Collections from '../components/Collections';
import MobileBottomNav from '../components/MobileBottomNav';
import HeroSlider from '../components/HeroSlider';
import TickNTrackSections from '../components/TickNTrackSections';

const Home = () => {
  return (
    <div className="min-h-screen pt-0 pb-16 md:pb-0 mt-0 -mt-0">
      {/* Hero Slider */}
      <HeroSlider
        slides={[
          {
            desktop: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765793761/Black_Bold_Texts_Login_Page_Wireframe_Website_UI_Prototype_2048_x_594_px_1590_x_504_px_1_o6nx7i.svg',
            alt: 'TickNTrack - Premium Shoes & Watches Collection',
          },
          {
            desktop: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765795400/Black_Bold_Texts_Login_Page_Wireframe_Website_UI_Prototype_2048_x_594_px_1_morepy.svg',
            alt: 'TickNTrack - Premium Collection',
          },
          {
            desktop: 'https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765793938/Black_Bold_Texts_Login_Page_Wireframe_Website_UI_Prototype_2048_x_594_px_2_pl1jml.png',
            alt: 'Festive Offer - TickNTrack',
          },
        ]}
        mobileSrc="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765774178/febeb7e114e3b4a6ecf505026489a318_qldt6e.jpg"
      />

      {/* TickNTrack Sections */}
      <TickNTrackSections />

      {/* Featured Collections */}

       
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default Home;
