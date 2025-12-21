import React from "react";

const RefundCancellationPolicy = () => {
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
            Refund & Cancellation Policy
          </h1>
          <p className="text-sm lg:text-base text-gray-600">
            Last updated: {lastUpdated}
          </p>
          <p className="mt-3 text-sm lg:text-base text-gray-700 max-w-3xl mx-auto">
            This Refund & Cancellation Policy explains how{" "}
            <strong>Shivrudray International Private Limited</strong> ("we",
            "our" or "us") handles refunds, returns, exchanges and cancellations
            for orders placed for products through our
            website.
          </p>
        </header>

        <div className="space-y-8 lg:space-y-10">
          {/* 1. Cancellation Policy */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              1. Order Cancellation
            </h2>
            <p className="leading-relaxed mb-2">
              You may cancel your order before it is dispatched. To cancel:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Contact us via email or phone with your order ID as soon as
                possible.
              </li>
              <li>
                Cancellation requests received before dispatch will be processed
                immediately, and a full refund will be issued.
              </li>
              <li>
                Once an order is dispatched, cancellation may not be possible.
                In such cases, you may need to return the product as per our
                return policy.
              </li>
            </ul>
          </section>

          {/* 2. Return Policy */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              2. Return Policy
            </h2>
            <p className="leading-relaxed mb-2">
              We accept returns under the following conditions:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Return Window:</strong> Returns must be initiated within{" "}
                <strong>[X] days</strong> of delivery.
              </li>
              <li>
                <strong>Product Condition:</strong> Products must be unused,
                unwashed, with original tags and packaging intact.
              </li>
              <li>
                <strong>Reason for Return:</strong> Defective items, wrong
                product received, or size mismatch (subject to availability).
              </li>
              <li>
                <strong>Non-Returnable Items:</strong> Customised or personalised
                products, items damaged by customer, or items without original
                packaging may not be eligible for return.
              </li>
            </ul>
          </section>

          {/* 3. Return Process */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              3. How to Initiate a Return
            </h2>
            <p className="leading-relaxed mb-2">
              To initiate a return, please follow these steps:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Contact us via email at{" "}
                <span className="text-blue-600">
                  shivrudrayinternational03@gmail.com
                </span>{" "}
                or call us at{" "}
                <span className="text-blue-600">+91 92744 90602</span> with your
                order ID.
              </li>
              <li>
                Provide clear photos/videos of the product if it's defective or
                damaged.
              </li>
              <li>
                Once approved, we will provide you with a return address and
                instructions.
              </li>
              <li>
                Pack the product securely in its original packaging and ship it
                back to us.
              </li>
            </ul>
          </section>

          {/* 4. Refund Process */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              4. Refund Process
            </h2>
            <p className="leading-relaxed mb-2">
              Once we receive and inspect the returned product:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                We will process your refund within{" "}
                <strong>[X] business days</strong> of receiving the returned
                item.
              </li>
              <li>
                Refunds will be issued to the original payment method used for
                the order.
              </li>
              <li>
                For Cash on Delivery (COD) orders, refunds will be processed via
                bank transfer or store credit, as per your preference.
              </li>
              <li>
                Shipping charges (if any) are non-refundable unless the return
                is due to our error (wrong product, defective item, etc.).
              </li>
            </ul>
          </section>

          {/* 5. Exchange Policy */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              5. Exchange Policy
            </h2>
            <p className="leading-relaxed mb-2">
              We offer exchanges for size or colour mismatches, subject to:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Product availability in the desired size/colour.</li>
              <li>
                The product being in original, unused condition with tags
                intact.
              </li>
              <li>
                Exchange requests must be initiated within the return window
                period.
              </li>
              <li>
                Additional charges may apply if the exchanged product is of a
                higher value.
              </li>
            </ul>
          </section>

          {/* 6. Defective or Damaged Products */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              6. Defective or Damaged Products
            </h2>
            <p className="leading-relaxed mb-2">
              If you receive a defective or damaged product:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Contact us immediately (within 24–48 hours of delivery) with
                photos/videos of the defect or damage.
              </li>
              <li>
                We will arrange for a replacement or full refund, including
                return shipping charges.
              </li>
              <li>
                Do not wash or use the product if you notice any defect upon
                delivery.
              </li>
            </ul>
          </section>

          {/* 7. Wrong Product Received */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              7. Wrong Product Received
            </h2>
            <p className="leading-relaxed mb-2">
              If you receive a product different from what you ordered:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Contact us immediately with your order ID and photos of the
                product received.
              </li>
              <li>
                We will arrange for the correct product to be shipped to you, or
                process a full refund if the correct product is unavailable.
              </li>
              <li>Return shipping charges will be borne by us.</li>
            </ul>
          </section>

          {/* 8. Refund Timeline */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              8. Refund Timeline
            </h2>
            <p className="leading-relaxed mb-2">
              Refund processing times vary by payment method:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Credit/Debit Cards:</strong> 5–10 business days after
                processing.
              </li>
              <li>
                <strong>UPI/Wallets:</strong> 3–7 business days after
                processing.
              </li>
              <li>
                <strong>Net Banking:</strong> 5–10 business days after
                processing.
              </li>
              <li>
                <strong>Bank Transfer (for COD):</strong> 7–14 business days
                after processing.
              </li>
            </ul>
            <p className="text-sm text-gray-700 mt-2">
              Note: Actual credit to your account may take additional time
              depending on your bank's processing time.
            </p>
          </section>

          {/* 9. Non-Refundable Items */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              9. Non-Refundable Items & Situations
            </h2>
            <p className="leading-relaxed mb-2">
              The following items or situations are not eligible for refund:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Products damaged due to misuse or improper care.</li>
              <li>Products returned after the return window period.</li>
              <li>Products without original tags, packaging or labels.</li>
              <li>Customised or personalised items (unless defective).</li>
              <li>Items purchased during sale/clearance (unless defective).</li>
            </ul>
          </section>

          {/* 10. Store Credit */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              10. Store Credit
            </h2>
            <p className="leading-relaxed mb-2">
              In certain cases, we may offer store credit instead of a refund:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Store credit can be used for future purchases on our website.
              </li>
              <li>
                Store credit is valid for{" "}
                <strong>[X months]</strong> from the date of issue.
              </li>
              <li>
                Store credit cannot be transferred to another account or
                converted to cash.
              </li>
            </ul>
          </section>

          {/* 11. Changes to Policy */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              11. Changes to This Policy
            </h2>
            <p className="leading-relaxed">
              We may revise this Refund & Cancellation Policy from time to time.
              Any updates will be posted on this page with an updated "Last
              updated" date. We encourage you to review this Policy periodically.
            </p>
          </section>

          {/* 12. Contact */}
          <section>
            <h2 className="text-xl lg:text-2xl font-semibold mb-3">
              12. Contact Us
            </h2>
            <p className="leading-relaxed mb-2">
              For questions about refunds, returns, exchanges or cancellations,
              contact:
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

export default RefundCancellationPolicy;

