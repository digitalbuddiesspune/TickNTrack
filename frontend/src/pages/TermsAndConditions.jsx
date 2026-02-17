import React from "react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
  const lastUpdated = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-200 text-gray-800">
      <div className="max-w-5xl mx-auto px-5 lg:px-20 py-5 lg:py-24">
        <header className="mb-8 lg:mb-12 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">
            Terms & Conditions
          </h1>
          <p className="text-sm lg:text-base text-gray-600">
            Last updated: {lastUpdated}
          </p>
        </header>

        <div className="space-y-8 lg:space-y-10">
          {/* 1 */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              1. Introduction
            </h2>
            <p className="leading-relaxed">
              These Terms & Conditions ("Terms") govern your use of the website
              and services offered by{" "}
              <strong>TickNTrack</strong> By <b> WING FUSION ECOMMERCE PRIVATE LIMITED</b> by accessing or purchasing from our website,
              you agree to be bound by these Terms. If you do not agree, please
              do not use our website.
            </p>
          </section>

          {/* 2 Products */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              2. Products, Availability & Pricing
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                We sell premium products including footwear, watches, and accessories. Product images are for
                reference; slight colour or texture variations may occur.
              </li>
              <li>
                Prices are listed in Indian Rupees (INR) and are subject to
                change at any time without prior notice.
              </li>
              <li>
                Acceptance of your order is subject to product availability and
                successful payment confirmation.
              </li>
            </ul>
          </section>

          {/* 3 Orders */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              3. Orders & Payments
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                When you place an order, you agree that all information provided
                is accurate and complete.
              </li>
              <li>
                We reserve the right to cancel any order in case of pricing
                errors, suspected fraud or other legitimate reasons. Any amount
                charged will be refunded in such cases.
              </li>
              <li>
                Payments must be made via the methods listed at checkout
                (UPI/cards/net banking/wallets etc.).
              </li>
            </ul>
          </section>

          {/* 4 Shipping */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              4. Shipping & Delivery
            </h2>
            <p className="leading-relaxed">
              Shipping timelines, charges and delivery conditions are governed
              by our{" "}
              <Link to="/shipping" className="text-blue-600 hover:underline">
                Shipping Policy
              </Link>
              . By placing an order, you agree to those terms as well.
            </p>
          </section>

          {/* 5 Refunds */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              5. Returns, Refunds & Cancellations
            </h2>
            <p className="leading-relaxed">
              All requests for returns, exchanges, refunds or cancellations are
              handled in accordance with our{" "}
              <Link to="/returns" className="text-blue-600 hover:underline">
                Refund & Cancellation Policy
              </Link>
              .
            </p>
          </section>

          {/* 6 User responsibilities */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              6. User Responsibilities
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Do not use the website for any unlawful or fraudulent purpose.</li>
              <li>Do not attempt to gain unauthorised access to our systems.</li>
              <li>
                Do not post or transmit any defamatory, abusive, obscene or
                harmful content.
              </li>
              <li>
                Do not resell our products commercially without written
                permission.
              </li>
            </ul>
          </section>

          {/* 7 IP */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              7. Intellectual Property
            </h2>
            <p className="leading-relaxed">
              All content on the website including logos, product photos,
              designs, text, graphics and layout is the property of{" "}
              <strong>TickNTrack</strong> or its
              licensors and is protected by applicable copyright and trademark
              laws. Unauthorised use, reproduction or distribution is strictly
              prohibited.
            </p>
          </section>

          {/* 8 Limitation */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              8. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              To the maximum extent permitted by law, we shall not be liable for
              any indirect, incidental, special or consequential damages
              arising out of your use of the website or purchase of products,
              including but not limited to loss due to courier delays, minor
              colour variations, improper washing or misuse of products.
            </p>
          </section>

          {/* 9 Fraud */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              9. Fraud Prevention
            </h2>
            <p className="leading-relaxed">
              We reserve the right to cancel orders, block accounts or refuse
              service in cases of suspected fraud, repeated COD refusals or
              policy abuse.
            </p>
          </section>

          {/* 10 Contact */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              10. Contact Us
            </h2>
            <p className="leading-relaxed">
              For any queries regarding these Terms, contact:
              <br />
              <strong>TickNTrack</strong> <br />
              Email:{" "}
              <span className="text-blue-600">
              wingfusionpvttld@gmail.com
              </span>{" "}
              <br />
              Phone:{" "}
              <span className="text-blue-600">
                +91 7383821908
              </span>{" "}
              <br />
              Address: Building No./Flat No. FF-5, Mayurpankh Appt, Member Association Road/Street, Navranpura, Ahmedabad, Ahmedabad District, Gujarat – 380009.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

