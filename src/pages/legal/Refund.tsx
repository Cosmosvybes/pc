import LegalLayout from './LegalLayout';

export default function Refund() {
  return (
    <LegalLayout title="Refund Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h3>1. Digital Products</h3>
      <p>Due to the nature of digital goods, we generally do not offer refunds once the subscription has been accessed and features utilized. However, we want you to be satisfied with your purchase.</p>

      <h3>2. 14-Day Money Back Guarantee</h3>
      <p>If you are not satisfied with the Service, you may request a refund within 14 days of your initial purchase. We will review requests on a case-by-case basis.</p>

      <h3>3. How to Request a Refund</h3>
      <p>To request a refund, please contact our support team at support@parentingcertainty.com with your order details and the reason for your request.</p>

      <h3>4. Processing</h3>
      <p>If your refund is approved, we will initiate a refund to your credit card (or original method of payment) via Paddle. You will receive the credit within a certain amount of days, depending on your card issuer's policies.</p>
    </LegalLayout>
  );
}


