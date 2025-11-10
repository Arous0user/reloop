import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Shipping Policy</h2>
        <p className="mb-2">
          All orders are processed within 1-2 business days. Shipping times vary based on your location and the shipping method selected at checkout.
          Standard shipping typically takes 5-7 business days, while expedited shipping options are available for faster delivery.
          We partner with reliable carriers to ensure your products arrive safely and on time.
          You will receive a tracking number via email once your order has been dispatched.
        </p>
        <p className="mb-2">
          Please note that delivery times are estimates and may be subject to delays due to unforeseen circumstances (e.g., weather, customs, carrier issues).
          We are not responsible for delays caused by the shipping carrier.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Refund and Replacement Policy</h2>
        <h3 className="text-xl font-medium mb-2">2.1. Eligibility for Refund/Replacement</h3>
        <p className="mb-2">
          We offer refunds or replacements for products that are defective, damaged during shipping, or if you receive the wrong item.
          To be eligible, you must notify us within 7 days of receiving your order.
          The item must be unused, in its original packaging, and accompanied by proof of purchase.
        </p>
        <p className="mb-2">
          Products that are not defective or damaged but you wish to return for other reasons (e.g., change of mind) may be subject to a restocking fee and return shipping costs.
          Such returns must also be initiated within 7 days of receipt and meet the same conditions as above.
        </p>

        <h3 className="text-xl font-medium mb-2">2.2. Non-Eligible Items</h3>
        <p className="mb-2">
          Certain items are exempt from being returned, such as:
          <ul className="list-disc list-inside ml-4">
            <li>Digital products</li>
            <li>Gift cards</li>
            <li>Items not in their original condition, damaged or missing parts for reasons not due to our error</li>
            <li>Items returned more than 7 days after delivery</li>
          </ul>
        </p>

        <h3 className="text-xl font-medium mb-2">2.3. How to Initiate a Refund/Replacement</h3>
        <p className="mb-2">
          To request a refund or replacement, please contact our customer service team at support@reloop.com with your order number and a detailed description of the issue,
          including photos if the item is damaged or defective. Our team will guide you through the process.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Refund Time</h2>
        <p className="mb-2">
          Once your return is received and inspected, we will send you an email to notify you that we have received your returned item.
          We will also notify you of the approval or rejection of your refund.
        </p>
        <p className="mb-2">
          If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment,
          within 5-10 business days. Please note that it may take some additional time for your bank or credit card company to post the refund to your account.
        </p>
        <p className="mb-2">
          If you haven’t received a refund yet, first check your bank account again.
          Then contact your credit card company, it may take some time before your refund is officially posted.
          Next contact your bank. There is often some processing time before a refund is posted.
          If you’ve done all of this and you still have not received your refund yet, please contact us at support@reloop.com.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Replacements</h2>
        <p className="mb-2">
          We only replace items if they are defective or damaged. If you need to exchange it for the same item,
          send us an email at support@reloop.com and send your item to: [Your Return Address Here].
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Changes to Terms and Conditions</h2>
        <p className="mb-2">
          We reserve the right to update, change or replace any part of these Terms and Conditions by posting updates and/or changes to our website.
          It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes
          constitutes acceptance of those changes.
        </p>
      </section>
    </div>
  );
};

export default TermsAndConditions;
