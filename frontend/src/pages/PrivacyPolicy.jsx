import React from "react";

const PrivacyPolicy = () => {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800">
      <div className="max-w-5xl mx-auto px-5 lg:px-20 py-5 lg:py-24">
        {/* Header */}
        <header className="mb-8 lg:mb-12 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm lg:text-base text-gray-600">
            Version 1.0 • Last updated: {lastUpdated}
          </p>
          <p className="mt-3 text-sm lg:text-base text-gray-700 max-w-3xl mx-auto">
            This Privacy Policy explains how{" "}
            <strong>TickNTrack</strong> ("we",
            "our" or "us") collects, uses, shares and protects your information
            when you browse or shop for our products
            through our website (the "Service").
          </p>
        </header>

        {/* Quick summary */}
        <section className="mb-8 lg:mb-10">
          <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6 border border-gray-100">
            <h2 className="text-lg lg:text-xl font-semibold mb-3">
              At a Glance – What This Policy Covers
            </h2>
            <ul className="list-disc list-inside text-sm lg:text-base space-y-1">
              <li>What personal and technical data we collect.</li>
              <li>How we use your data to process orders and improve our store.</li>
              <li>How cookies, payments and analytics work on our site.</li>
              <li>When we share data with trusted partners (couriers, gateways, etc.).</li>
              <li>Your rights to access, correct or delete your data.</li>
              <li>How to contact our Grievance Officer for privacy concerns.</li>
            </ul>
          </div>
        </section>

        <div className="space-y-8 lg:space-y-10">
          {/* 1. Introduction */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              1. Introduction
            </h2>
            <p className="mb-2 leading-relaxed">
              By accessing or using our website, you agree to the collection and
              use of your information in accordance with this Privacy Policy. If
              you do not agree with any part of this Policy, please discontinue
              use of our website and services.
            </p>
            <p className="leading-relaxed">
              This Policy applies to all users of our website, including
              visitors, registered customers and anyone who interacts with us
              through contact forms, WhatsApp, email or social media.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              2. Information We Collect
            </h2>
            <p className="mb-2">
              We collect the following categories of information:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Personal Information:</strong> Name, email address,
                phone number, shipping/billing address and other details
                provided during checkout or account creation.
              </li>
              <li>
                <strong>Order & Transaction Information:</strong> Products
                purchased (products), order history, payment
                method used and transaction identifiers. Card details are
                processed securely by our payment gateway; we do not store your
                full card information.
              </li>
              <li>
                <strong>Account Information:</strong> Username, password,
                preferences, saved addresses and wishlist items (if you create
                an account).
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, time spent, clicked
                links and other analytical data regarding how you use our
                website.
              </li>
              <li>
                <strong>Device & Technical Data:</strong> IP address, browser
                type, device type, operating system and similar technical
                information.
              </li>
              <li>
                <strong>Communication Data:</strong> Messages, reviews, queries
                or feedback you send via forms, email, WhatsApp or social media.
              </li>
            </ul>
          </section>

          {/* 3. How We Use Your Information */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              3. How We Use Your Information
            </h2>
            <p className="mb-2">
              We use your information for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>To process, confirm and deliver your orders.</li>
              <li>To manage your account, order history and preferences.</li>
              <li>
                To communicate with you regarding orders, deliveries, returns and
                support.
              </li>
              <li>
                To send you offers, new collections and styling updates (only if
                you have opted in).
              </li>
              <li>
                To improve our website design, product catalogue and user
                experience using analytics and feedback.
              </li>
              <li>
                To prevent fraud, abuse or security threats to our systems.
              </li>
              <li>To comply with legal, tax and regulatory obligations.</li>
            </ul>
          </section>

          {/* 4. Legal Basis */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              4. Legal Basis for Processing (Where Applicable)
            </h2>
            <p className="mb-2">
              Depending on your jurisdiction, we may rely on the following legal
              bases:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Your consent (e.g., for marketing communications).</li>
              <li>Performance of a contract (to fulfil your order).</li>
              <li>Compliance with legal obligations.</li>
              <li>Our legitimate interests (improving services, preventing fraud).</li>
            </ul>
          </section>

          {/* 5. Cookies */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              5. Cookies and Tracking Technologies
            </h2>
            <p className="mb-2">
              We use cookies and similar technologies to enhance and personalise
              your shopping experience. Cookies help us:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Remember your cart items and login sessions.</li>
              <li>Show recently viewed products and suggestions.</li>
              <li>Measure website performance and fix issues.</li>
            </ul>
            <p className="mt-2">
              You can control cookies from your browser settings. Some features
              of the website may not work properly if cookies are disabled.
            </p>
          </section>

          {/* 6. Payment Security */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              6. Payment Information & Security
            </h2>
            <p className="mb-2 leading-relaxed">
              Online payments made on our website are processed through secure,
              reputable payment gateway partners that use industry-standard
              encryption and security certifications. Your full payment card
              details are <strong>not stored</strong> on our servers.
            </p>
            <p className="leading-relaxed">
              Please do not share your OTP, CVV or net-banking credentials with
              anyone, including anyone claiming to be from our support team.
            </p>
          </section>

          {/* 7. Sharing of Information */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              7. How We Share Your Information
            </h2>
            <p className="mb-2">
              We do <strong>not</strong> sell your personal information. We may
              share your data only with:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Payment gateways & banks – to securely process your payments.
              </li>
              <li>
                Courier & logistics partners – to deliver your orders to your
                address.
              </li>
              <li>
                Technology & hosting providers – for website hosting, storage,
                analytics and communication tools.
              </li>
              <li>
                Marketing & analytics tools – to understand usage and improve
                our offerings, where permitted by law.
              </li>
              <li>
                Legal or regulatory authorities – when required to comply with
                obligations or protect our rights, property or safety.
              </li>
            </ul>
          </section>

          {/* 8. Data Security */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              8. Data Security
            </h2>
            <p className="mb-2 leading-relaxed">
              We implement reasonable technical and organisational measures to
              protect your personal data from unauthorised access, alteration,
              disclosure or destruction.
            </p>
            <p className="leading-relaxed">
              However, no method of transmission over the Internet or electronic
              storage is completely secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          {/* 9. Data Retention */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              9. Data Retention
            </h2>
            <p className="leading-relaxed">
              We retain your information for as long as necessary to fulfil the
              purposes outlined in this Policy, including order fulfilment,
              accounting, tax and legal requirements. Order and transaction
              records may be retained for longer periods as required by law.
            </p>
          </section>

          {/* 10. Your Rights */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              10. Your Rights and Choices
            </h2>
            <p className="mb-2">
              Subject to applicable law, you may have the right to:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>
                Request deletion of your data, subject to legal and contractual
                limitations.
              </li>
              <li>Object to or restrict certain types of processing.</li>
              <li>Withdraw consent where processing is based on consent.</li>
            </ul>
            <p className="mt-2 leading-relaxed">
              To exercise these rights, please contact us using the details
              provided below. We may need to verify your identity before
              responding.
            </p>
          </section>

          {/* 11. Children's Privacy */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              11. Children's Privacy
            </h2>
            <p className="leading-relaxed">
              Our website and services are intended for individuals who are at
              least 18 years of age. We do not knowingly collect personal
              information from children under 18. If you believe that a child
              has provided us with personal data, please contact us so that we
              can delete such information.
            </p>
          </section>

          {/* 12. Third-Party Links */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              12. Third-Party Websites and Services
            </h2>
            <p className="leading-relaxed">
              Our website may contain links to third-party websites or services
              such as social media platforms and payment gateways. We are not
              responsible for the privacy practices or content of these external
              sites. We encourage you to review their privacy policies before
              sharing any personal information with them.
            </p>
          </section>

          {/* 13. International Transfers */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              13. International Data Transfers
            </h2>
            <p className="leading-relaxed">
              Your information may be transferred to and stored on servers
              located outside your state or country, where data-protection laws
              may differ. By using our website, you consent to such transfers in
              accordance with this Privacy Policy.
            </p>
          </section>

          {/* 14. Grievance Officer */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              14. Grievance Officer & Data Protection Queries
            </h2>
            <p className="mb-2 leading-relaxed">
              In accordance with applicable Indian data-protection regulations,
              you may contact our Grievance Officer for concerns, complaints or
              queries relating to your personal data or this Privacy Policy.
            </p>
            <p className="leading-relaxed">
              <strong>Grievance Officer:</strong> TickNTrack Support Team <br />
              Email:{" "}
              <span className="text-blue-600">
                support@tickntrack.com
              </span>{" "}
              <br />
              Phone:{" "}
              <span className="text-blue-600">
                +91 98765 43210
              </span>
            </p>
          </section>

          {/* 15. Changes to Policy */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              15. Changes to This Privacy Policy
            </h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices, legal requirements or operational needs.
              Any changes will be posted on this page with an updated "Last
              updated" date. We encourage you to review this Policy periodically.
            </p>
          </section>

          {/* 16. Contact Details */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              16. Contact Us
            </h2>
            <p className="mb-2">
              If you have any questions or concerns regarding this Privacy
              Policy or your personal information, you may contact us at:
            </p>
            <p className="leading-relaxed">
              <strong>TickNTrack</strong> <br />
              Email:{" "}
              <span className="text-blue-600">
                support@tickntrack.com
              </span>{" "}
              <br />
              Phone:{" "}
              <span className="text-blue-600">
                +91 98765 43210
              </span>
              <br />
              Address: 123 Fashion Street, Mumbai, Maharashtra 400001, India
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

