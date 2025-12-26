import LegalLayout from './LegalLayout';

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service">
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h3>1. Introduction</h3>
      <p>Welcome to ParentingCertainty ("we," "our," or "us"). By accessing or using our application "QuietKid" (the "Service"), you agree to be bound by these Terms of Service.</p>

      <h3>2. Subscription and Payments</h3>
      <p>We offer a paid subscription service ("Pro Access"). Billing is handled by our merchant of record, Paddle. By subscribing, you agree to Paddle's taxes and fees as applicable in your region.</p>

      <h3>3. Medical Disclaimer</h3>
      <p><strong>The Service provides information, not medical advice.</strong> The content, including crisis scripts and audio regulation tools, is for educational purposes only. Always seek the advice of a qualified health provider with any questions you may have regarding a medical condition.</p>

      <h3>4. User Accounts</h3>
      <p>You are responsible for safeguarding the credentials you use to access the Service. You agree not to disclose your password to any third party.</p>

      <h3>5. Limitation of Liability</h3>
      <p>In no event shall ParentingCertainty, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

      <h3>6. Changes</h3>
      <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time.</p>

      <h3>7. Contact Us</h3>
      <p>If you have any questions about these Terms, please contact us at support@parentingcertainty.com.</p>
    </LegalLayout>
  );
}
