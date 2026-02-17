import { FileText } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">Contact Us</h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-2">TickNTrack by <b>WING FUSION ECOMMERCE PRIVATE LIMITED</b></p>

        <div className="space-y-8">
          <div>
            <p className="text-base sm:text-lg font-semibold text-gray-500 uppercase tracking-wider mb-2">Email</p>
            <a
              href="mailto:wingfusionpvttld@gmail.com"
              className="text-lg sm:text-xl text-teal-600 hover:text-teal-700 font-medium"
            >
              wingfusionpvttld@gmail.com
            </a>
          </div>

          <div>
            <p className="text-base sm:text-lg font-semibold text-gray-500 uppercase tracking-wider mb-2">Phone</p>
            <p className="text-lg sm:text-xl font-medium">+91 7383821908</p>
          </div>

          <div>
            <p className="text-base sm:text-lg font-semibold text-gray-500 uppercase tracking-wider mb-2">Address</p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              Building No./Flat No. FF-5, Mayurpankh Appt, Member Association Road/Street, Navranpura, Ahmedabad, Ahmedabad District, Gujarat – 380009
            </p>
          </div>

          <div>
            <p className="text-base sm:text-lg font-semibold text-gray-500 uppercase tracking-wider mb-2">Support Hours</p>
            <p className="text-base sm:text-lg text-gray-700">Monday – Saturday · 9:00 AM to 9:00 PM IST</p>
          </div>

          <div>
            <p className="text-base sm:text-lg font-semibold text-gray-500 uppercase tracking-wider mb-2">CIN</p>
            <p className="text-base sm:text-lg text-gray-700 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-500 flex-shrink-0" />
              Wing Fusion Ecommerce Private Limited · CIN: U47912GJ20240PC156357
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
