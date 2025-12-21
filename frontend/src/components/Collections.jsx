import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Collections = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const categories = [
    { name: "Women Analog Watches", path: "/category/watches/Women-watches/Women-analog-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765215874/unnamed_vxpktl.jpg" },
    { name: "Men Caps", path: "/category/accessories/men-accessories/men-caps", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765627558/unnamed_frs0um.jpg" },
    { name: "Women Digital Watches", path: "/category/watches/Women-watches/Women-digital-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765215976/unnamed_whrlsk.jpg" },
    { name: "Women Goggles", path: "/category/accessories/women-accessories/women-goggles", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765624604/unnamed_zqbgyk.jpg" },
    { name: "Men Luxury Watches", path: "/category/watches/men-watches/Men-luxury-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765217016/unnamed_g02sys.jpg" },
    { name: "Men Digital Watches", path: "/category/watches/men-watches/Men-digital-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765216828/unnamed_o0mzpn.jpg" },
    { name: "Men Sunglasses", path: "/category/accessories/men-accessories/men-sunglasses", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765627303/unnamed_kjcjqf.jpg" },
    { name: "Women Smart Watches", path: "/category/watches/Women-watches/Women-smart-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765216050/unnamed_ysaacr.jpg" },
    { name: "Men Smart Watches", path: "/category/watches/men-watches/Men-smart-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765216850/unnamed_gjfozw.jpg" },
    { name: "Men Sports Watches", path: "/category/watches/men-watches/Men-sports-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765216975/unnamed_nojuvl.jpg" },
    { name: "Women Fitness Trackers", path: "/category/watches/Women-watches/Women-fitness-trackers", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765216223/unnamed_nmip79.jpg" },
    { name: "Women Classic Watches", path: "/category/watches/Women-watches/Women-classic-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765216236/unnamed_o49ofl.jpg" },

    // Men Watches Subcategories
    { name: "Men Analog Watches", path: "/category/watches/men-watches/Men-analog-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765216780/unnamed_v1mbbj.jpg" },
    { name: "Men Chronograph Watches", path: "/category/watches/men-watches/Men-chronograph-watches", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765217016/unnamed_g02sys.jpg" },
    // Men's Shoes Subcategories
    { name: "Men Sports Shoes", path: "/category/shoes/mens-shoes/Men-sports-shoes", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765206732/unnamed_p3ovth.jpg" },
    { name: "Men Casual Shoes", path: "/category/shoes/mens-shoes/Men-casual-shoes", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765206928/ac0404c8-d323-4367-a2fa-d988b9bb642b.png" },
    { name: "Men Formal Shoes", path: "/category/shoes/mens-shoes/Men-formal-shoes", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207062/b3aae7be-8c69-4702-99ce-ceea80362b2f.png" },
    { name: "Men Sneakers", path: "/category/shoes/mens-shoes/Men-sneakers", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207177/unnamed_prumtn.jpg" },
    { name: "Men Boots", path: "/category/shoes/mens-shoes/Men-boots", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207208/unnamed_howyee.jpg" },
    { name: "Men Sandals", path: "/category/shoes/mens-shoes/Men-sandals", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207245/unnamed_chcwum.jpg" },
    
    // Women's Shoes Subcategories
    { name: "Women Heels", path: "/category/shoes/womens-shoes/Women-heels", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207254/unnamed_av2vv2.jpg" },
    { name: "Women Flats", path: "/category/shoes/womens-shoes/Women-flats", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207315/unnamed_hmoyfa.jpg" },
    { name: "Women Sneakers", path: "/category/shoes/womens-shoes/Women-sneakers", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207807/unnamed_ldee8d.jpg" },
    { name: "Women Sports Shoes", path: "/category/shoes/womens-shoes/Women-sports-shoes", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207816/unnamed_p7tedm.jpg" },
    { name: "Women Chappals", path: "/category/shoes/womens-shoes/Women-chappals", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207827/unnamed_gwgxpw.jpg" },
    { name: "Women Sandals", path: "/category/shoes/womens-shoes/Women-sandals", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765207839/unnamed_otxqea.jpg" },
    
    // Women Accessories Subcategories
    { name: "Women Belts", path: "/category/accessories/women-accessories/women-belts", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765624402/unnamed_wsvlka.jpg" },
    { name: "Women Sunglasses", path: "/category/accessories/women-accessories/women-sunglasses", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765624740/unnamed_p4eskj.jpg" },
    
    // Men Accessories Subcategories
    { name: "Men Belts", path: "/category/accessories/men-accessories/men-belts", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765625319/unnamed_yb9rfg.jpg" },
    { name: "Women Handbags", path: "/category/accessories/women-accessories/women-handbags", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765624892/unnamed_waspa8.jpg" },
    { name: "Men Goggles", path: "/category/accessories/men-accessories/men-goggles", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765627211/unnamed_v26uui.jpg" },
    { name: "Men Wallets", path: "/category/accessories/men-accessories/men-wallets", image: "https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765627384/unnamed_od7plr.jpg" },
    
  ];

  return (
    <section className="pt-4 md:pt-6 pb-4 md:pb-6 bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-4 2xl:px-6">
        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, idx) => (
            <div
              key={idx}
              onClick={() => navigate(category.path)}
              onMouseEnter={() => setHoveredCard(`cat-${idx}`)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
            >
              <div className="aspect-square relative bg-gray-100 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-150"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 via-black/60 to-transparent">
                <h3 className="text-white font-medium text-sm md:text-base lg:text-lg text-center uppercase">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Banner Image with Text Overlay */}
        <div className="w-full mt-4 md:mt-6 mb-0 relative">
          <picture>
            <source 
              media="(max-width: 1023px)" 
              srcSet="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765205176/b073eda1-3a35-4ab9-93d4-5f66f27c046b.png" 
            />
            <source 
              media="(min-width: 1024px)" 
              srcSet="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765205478/821ba8cf-8fd0-4568-8bc6-947bf94888b4.png" 
            />
            <img 
              src="https://res.cloudinary.com/dvkxgrcbv/image/upload/v1765205478/821ba8cf-8fd0-4568-8bc6-947bf94888b4.png" 
              alt="TickNTrack Banner" 
              className="w-full h-auto object-cover"
            />
          </picture>
          
          {/* Text Overlay for Desktop */}
          <div className="hidden lg:flex absolute inset-0 items-center justify-end pr-8 md:pr-12 lg:pr-16 xl:pr-20">
            <div className="text-right max-w-md">
              <p className="text-sm md:text-base text-gray-700 mb-2 font-medium">Machine Washable</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-2 leading-tight">
                SNEAKERS DESIGNED TO
              </h2>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                MOVE YOU FORWARD.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collections;
