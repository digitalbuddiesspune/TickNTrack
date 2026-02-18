import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, FileText, Facebook, Instagram, Twitter, Youtube, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';
import { LOGO_URL } from '../constants/app';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact Us', path: '/contact-us' },
  ];

  const toTitleCase = (str) =>
    str
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  const categories = CATEGORIES.map((cat) => ({
    name: toTitleCase(cat.name),
    path: cat.path,
  }));


  const companyInfo = [
    { name: 'Our Story', path: '/about-us' },
    { name: 'Careers', path: '/careers' },
    { name: 'Press', path: '/press' },
    { name: 'Partner with Us', path: '/partners' },
    { name: 'Terms & Conditions', path: '/terms-and-conditions' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      url: 'https://facebook.com/tickntrack',
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      url: 'https://instagram.com/tickntrack',
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      url: 'https://twitter.com/tickntrack',
    },
    {
      name: 'YouTube',
      icon: <Youtube className="w-5 h-5" />,
      url: 'https://youtube.com/tickntrack',
    },
  ];

  return (
    <footer className="bg-gray-900 text-white w-full">
      {/* Main Footer Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-6 pt-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
          {/* Brand Column */}
          <div className="lg:col-span-1 flex flex-col">
            <Link to="/" className="mb-4 block">
              <img
                src={LOGO_URL}
                alt="TickNTrack"
                className="h-10 sm:h-12 w-auto object-contain filter brightness-0 invert hover:opacity-90 transition-opacity"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  const parent = e.target.parentElement;
                  if (parent && !parent.querySelector('.text-logo-fallback')) {
                    const textLogo = document.createElement('div');
                    textLogo.className = 'text-logo-fallback text-2xl font-bold text-white';
                    textLogo.textContent = 'TickNTrack';
                    parent.appendChild(textLogo);
                  }
                }}
              />
            </Link>
            <p className="text-gray-400 leading-relaxed text-sm mb-4">
              Your trusted destination for premium footwear and luxury timepieces.
            </p>
            <div>
              <h5 className="font-semibold text-white mb-4">Follow Us</h5>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-colors duration-300"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold text-white mb-4">Quick Links</h5>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h5 className="font-semibold text-white mb-4">Shop by Category</h5>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link 
                    to={category.path}
                    className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center gap-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Right Side */}
          <div>
            <h5 className="font-semibold text-white mb-4">Contact Us</h5>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-5 h-5 text-teal-500 flex-shrink-0" />
                <span>+91 7383821908</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-5 h-5 text-teal-500 flex-shrink-0" />
                <span>wingfusionpvttld@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-teal-500 flex-shrink-0" />
                <span className="block">
                  
                Navranpura, Ahmedabad – 380009<br />
                  Gujarat, India
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <FileText className="w-5 h-5 text-teal-500 flex-shrink-0" />
                <span>Wing Fusion Ecommerce Private Limited · CIN: U47912GJ20240PC156357</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-6 py-6">
          <div className="flex flex-col gap-4 items-center">
            <div className="text-gray-400 text-xs sm:text-sm text-center max-w-full">
              © {currentYear} TickNTrack by WING FUSION ECOMMERCE PRIVATE LIMITED. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center md:justify-end w-full">
              <Link to="/terms-and-conditions" className="text-gray-400 hover:text-teal-400 text-xs sm:text-sm transition-colors duration-300">Terms & Conditions</Link>
              <Link to="/privacy-policy" className="text-gray-400 hover:text-teal-400 text-xs sm:text-sm transition-colors duration-300">Privacy Policy</Link>
              <Link to="/shipping-policy" className="text-gray-400 hover:text-teal-400 text-xs sm:text-sm transition-colors duration-300">Shipping Policy</Link>
              <Link to="/refund-cancellation-policy" className="text-gray-400 hover:text-teal-400 text-xs sm:text-sm transition-colors duration-300">Refund & Cancellation Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
