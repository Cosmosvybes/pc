import LegalLayout from './LegalLayout';

export default function Refund() {
  return (
    <LegalLayout title="Refund Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h3>1. 14-Day Money Back Guarantee</h3>
      <p>We want you to be satisfied with your purchase. If you are not satisfied with the Service, you are eligible for a full refund within 14 days of your initial purchase.</p>

      <h3>2. How to Request a Refund</h3>
      <p>To request a refund, please contact our support team at support@parentingcertainty.com with your order details. We will process your refund immediately, no questions asked.</p>

      <h3>3. Processing</h3>
      <p>Refunds are processed by our merchant of record, Paddle. You will receive the credit to your original method of payment within 5-10 business days, depending on your card issuer's policies.</p>
    </LegalLayout>
  );
}
