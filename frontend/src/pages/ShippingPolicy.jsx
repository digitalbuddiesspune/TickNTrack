import React from "react";

const ShippingPolicy = () => {
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
            Shipping Policy
          </h1>
          <p className="text-sm lg:text-base text-gray-600">
            Last updated: {lastUpdated}
          </p>
          <p className="mt-3 text-sm lg:text-base text-gray-700 max-w-3xl mx-auto">
            This Shipping Policy explains how{" "}
            <strong>Shivrudray International Private Limited</strong> ("we",
            "our" or "us") handles shipping and delivery of orders placed for
            products through our website.
          </p>
        </header>

        <div className="space-y-8 lg:space-y-10">
          {/* 1. Serviceable Locations */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              1. Serviceable Locations
            </h2>
            <p className="leading-relaxed mb-2">
              We currently ship orders across most locations in India through
              our trusted courier partners, subject to serviceability of your
              PIN code.
            </p>
            <p className="leading-relaxed text-sm text-gray-700">
              If your PIN code is not serviceable, we will contact you to
              discuss alternatives or process a refund.
            </p>
          </section>

          {/* 2. Order Processing Time */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              2. Order Processing Time
            </h2>
            <p className="leading-relaxed mb-2">
              After your order and payment are successfully confirmed, we
              typically take <strong>1–3 business days</strong> to process and
              dispatch your order.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Orders are processed Monday to Saturday (excluding holidays).</li>
              <li>
                Orders placed on Sundays or public holidays are processed on the
                next working day.
              </li>
              <li>
                During sale periods or festive seasons, processing times may be
                slightly longer.
              </li>
            </ul>
          </section>

          {/* 3. Shipping Charges */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              3. Shipping Charges
            </h2>
            <p className="leading-relaxed mb-2">
              Shipping charges (if applicable) will be clearly displayed at
              checkout before you confirm your order. Our standard structure is:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Standard Shipping:</strong> ₹[X] for orders below ₹[Amount].
              </li>
              <li>
                <strong>Free Shipping:</strong> for orders above ₹[Amount] (if
                offered).
              </li>
            </ul>
            <p className="text-sm text-gray-700 mt-2">
              Replace the placeholder amounts above with your actual shipping
              fee rules.
            </p>
          </section>

          {/* 4. Estimated Delivery Timelines */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              4. Estimated Delivery Timelines
            </h2>
            <p className="leading-relaxed mb-2">
              After dispatch, estimated delivery times are:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Metro Cities:</strong> 3–5 business days.
              </li>
              <li>
                <strong>Other Cities & Towns:</strong> 4–7 business days.
              </li>
              <li>
                <strong>Remote / Out-of-delivery Areas:</strong> 7–10 business
                days (subject to courier coverage).
              </li>
            </ul>
            <p className="text-sm text-gray-700 mt-2">
              Actual delivery may vary due to courier delays, weather, strikes,
              festivals or other events beyond our control.
            </p>
          </section>

          {/* 5. Order Tracking */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              5. Order Tracking
            </h2>
            <p className="leading-relaxed mb-2">
              Once your order is dispatched, you will receive a tracking ID and
              link via SMS/WhatsApp/email (where available), which you can use
              to follow your shipment.
            </p>
            <p className="leading-relaxed">
              If you face any difficulty in tracking, contact us with your order
              ID and registered mobile number or email.
            </p>
          </section>

          {/* 6. Address Accuracy */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              6. Shipping Address & Contact Details
            </h2>
            <p className="leading-relaxed mb-2">
              Please ensure your address, PIN code and contact number are
              correct at the time of placing the order.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                We are not responsible for delays or non-delivery caused by
                incorrect or incomplete details.
              </li>
              <li>
                Address changes after dispatch may not be possible. For changes
                before dispatch, please contact us at the earliest.
              </li>
            </ul>
          </section>

          {/* 7. Undelivered / Returned Shipments */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              7. Undelivered or Returned Shipments
            </h2>
            <p className="leading-relaxed mb-2">
              Orders may be returned to us by the courier due to:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Incorrect or incomplete address.</li>
              <li>Customer unavailable during multiple delivery attempts.</li>
              <li>Customer not reachable on phone.</li>
              <li>Refusal to accept delivery.</li>
            </ul>
            <p className="leading-relaxed mt-2">
              Once we receive the returned shipment, we will contact you to
              either:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Re-ship the order (additional shipping charges may apply), or</li>
              <li>
                Process a refund/store credit as per our Refund & Cancellation
                Policy.
              </li>
            </ul>
          </section>

          {/* 8. Delays Beyond Our Control */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              8. Delays Beyond Our Control
            </h2>
            <p className="leading-relaxed">
              While we aim for timely delivery, certain events such as natural
              disasters, strikes, lockdowns, or issues at the courier's end may
              cause delays. We will coordinate with the courier to expedite
              delivery wherever possible and request your understanding in such
              cases.
            </p>
          </section>

          {/* 9. International Shipping */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              9. International Shipping
            </h2>
            <p className="leading-relaxed">
              Currently, we{" "}
              <strong>do not offer international shipping</strong>. If we start
              shipping outside India in future, this section will be updated
              with applicable terms, duties and taxes.
            </p>
          </section>

          {/* 10. Damaged Packages */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              10. Damaged, Opened or Tampered Packages
            </h2>
            <p className="leading-relaxed mb-2">
              If you receive a package that appears damaged, tampered or opened:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Kindly mention this to the delivery person immediately.</li>
              <li>
                Take clear photos/videos of the package and product and share
                them with us within <strong>24–48 hours</strong>.
              </li>
            </ul>
            <p className="leading-relaxed mt-2">
              We will review the case as per our Refund & Cancellation Policy
              and provide a suitable resolution.
            </p>
          </section>

          {/* 11. COD */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              11. Cash on Delivery (COD)
            </h2>
            <p className="leading-relaxed mb-2">
              Cash on Delivery (COD) service is{" "}
              <strong>[available / not available]</strong>. If offered:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>COD eligibility and charges will be shown at checkout.</li>
              <li>
                Repeated refusal of COD orders may lead to restrictions on
                future COD availability.
              </li>
            </ul>
          </section>

          {/* 12. Changes */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              12. Changes to This Shipping Policy
            </h2>
            <p className="leading-relaxed">
              We may revise this Shipping Policy from time to time. Any updates
              will be posted on this page with an updated "Last updated" date.
            </p>
          </section>

          {/* 13. Contact */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              13. Contact Us
            </h2>
            <p className="leading-relaxed mb-2">
              For questions about shipping or delivery, contact:
            </p>
            <p className="leading-relaxed">
              <strong>Shivrudray International Private Limited</strong> <br />
              Email:{" "}
              <span className="text-blue-600">
                shivrudrayinternational03@gmail.com
              </span>{" "}
              <br />
              Phone:{" "}
              <span className="text-blue-600">
                +91 92744 90602 / +91 92740 99941
              </span>{" "}
              <br />
              Address: Broker Office No. A-417, THE APMC RS No. 261, Morbi
              Rajkot Highway, Bedi, Rajkot – 360003, Gujarat, India
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;

