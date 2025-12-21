import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ShoppingBag, Truck, Shield, RotateCcw, HeadphonesIcon, Clock, ChevronRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const categories = [
    { name: 'Men\'s Shoes', path: '/category/shoes/mens-shoes' },
    { name: 'Women\'s Shoes', path: '/category/shoes/womens-shoes' },
    { name: 'Sports Shoes', path: '/category/shoes/sports-shoes' },
    { name: 'Luxury Watches', path: '/category/watches/luxury-watches' },
    { name: 'Smart Watches', path: '/category/watches/smart-watches' },
    { name: 'Accessories', path: '/category/accessories' },
  ];


  const companyInfo = [
    { name: 'Our Story', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Press', path: '/press' },
    { name: 'Partner with Us', path: '/partners' },
    { name: 'Terms & Conditions', path: '/terms' },
    { name: 'Privacy Policy', path: '/privacy' },
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

  const features = [
    { icon: <Truck className="w-6 h-6" />, title: 'Free Shipping', description: 'On orders above ₹999' },
    { icon: <RotateCcw className="w-6 h-6" />, title: 'Easy Returns', description: '7-day return policy' },
    { icon: <Shield className="w-6 h-6" />, title: 'Secure Payment', description: '100% secure transactions' },
    { icon: <HeadphonesIcon className="w-6 h-6" />, title: '24/7 Support', description: 'Dedicated customer care' },
  ];

  return (
    <footer className="bg-gray-900 text-white w-full">
      {/* Main Footer Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-6 pt-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="mb-6 -mx-2 -mt-8">
              <Link to="/" className="inline-block -mt-4">
                <img 
                  src="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765853492/image-removebg-preview_ji9lfq.png"
                  alt="TickNTrack"
                  className="h-32 sm:h-40 w-auto object-contain filter brightness-0 invert hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    if (parent && !parent.querySelector('.text-logo-fallback')) {
                      const textLogo = document.createElement('div');
                      textLogo.className = 'text-logo-fallback text-4xl font-bold text-white mb-4';
                      textLogo.textContent = 'TickNTrack';
                      parent.appendChild(textLogo);
                    }
                  }}
                />
              </Link>
              <p className="text-gray-400 leading-relaxed max-w-md -mt-10 mb-6">
                Your trusted destination for premium footwear and luxury timepieces. 
                We bring you the finest collection of shoes and watches from top brands worldwide.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-5 h-5 text-teal-500" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-5 h-5 text-teal-500" />
                  <span>support@tickntrack.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 text-teal-500" />
                  <span>123 Fashion Street, Mumbai, India 400001</span>
                </div>
              </div>

              {/* Social Links */}
              <div>
                <h5 className="font-semibold text-white mb-4">Follow Us</h5>
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-teal-600 hover:text-white transition-colors duration-300"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
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
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {currentYear} TickNTrack. All rights reserved. Made with 
              <Heart className="w-4 h-4 inline mx-1 text-red-500" /> 
              in India
            </div>
            <div className="flex gap-6">
              <Link to="/terms" className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-300">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-300">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-800">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-6 py-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">We Accept</p>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              {/* VISA */}
              <div className="w-16 h-10 bg-white rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" 
                  alt="VISA" 
                  className="h-6 w-auto object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentElement.innerHTML = '<span class="text-xs font-bold text-gray-800">VISA</span>';
                  }}
                />
              </div>
              
              {/* Mastercard */}
              <div className="w-16 h-10 bg-white rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/2560px-Mastercard-logo.svg.png" 
                  alt="Mastercard" 
                  className="h-6 w-auto object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentElement.innerHTML = '<span class="text-xs font-bold text-gray-800">MC</span>';
                  }}
                />
              </div>
              
              {/* UPI */}
              <div className="w-16 h-10 bg-white rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" 
                  alt="UPI" 
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentElement.innerHTML = '<span class="text-xs font-bold text-gray-800">UPI</span>';
                  }}
                />
              </div>
              
              {/* Google Pay */}
              <div className="w-16 h-10 bg-white rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow p-1.5">
                <img 
                  src="https://www.google.com/pay/static/images/gpay.svg" 
                  alt="Google Pay" 
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    const parent = e.target.parentElement;
                    if (parent && !parent.querySelector('.gpay-fallback')) {
                      const fallback = document.createElement('div');
                      fallback.className = 'gpay-fallback flex items-center gap-1';
                      fallback.innerHTML = `
                        <div class="flex gap-0.5">
                          <div class="w-2 h-2 rounded-full bg-blue-500"></div>
                          <div class="w-2 h-2 rounded-full bg-red-500"></div>
                          <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <div class="w-2 h-2 rounded-full bg-green-500"></div>
                        </div>
                        <span class="text-gray-800 text-[10px] font-bold">Pay</span>
                      `;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              </div>
              
              {/* PayTM */}
              <div className="w-16 h-10 bg-white rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow p-1">
                <div className="flex flex-col items-center justify-center h-full w-full">
                  <div className="w-10 h-5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded flex items-center justify-center mb-0.5">
                    <span className="text-white text-[9px] font-bold">Pay</span>
                  </div>
                  <span className="text-gray-800 text-[8px] font-bold">TM</span>
                </div>
              </div>
              
              {/* COD */}
              <div className="w-16 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <span className="text-xs font-bold text-white">COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
