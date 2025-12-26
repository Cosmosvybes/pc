import LegalLayout from './LegalLayout';

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <h3>1. Information We Collect</h3>
      <p>We collect information you provide directly to us, such as when you create an account, subscribe, or contact customer support.</p>
      <ul>
        <li><strong>Account Information:</strong> Name, email address, and profile picture (via Google Auth/Supabase).</li>
        <li><strong>Usage Data:</strong> We may collect data on how you interact with our Service (e.g., features used, session duration).</li>
      </ul>

      <h3>2. How We Use Your Information</h3>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Provide, maintain, and improve our Service.</li>
        <li>Process transactions and manage your subscription.</li>
        <li>Send you technical notices, updates, security alerts, and support messages.</li>
      </ul>

      <h3>3. Data Storage and Security</h3>
      <p>We use Supabase for data storage and authentication. We implement reasonable security measures to protect your information, but no method of transmission over the Internet is 100% secure.</p>

      <h3>4. Third-Party Services</h3>
      <p>We may use third-party services that collect, monitor and analyze this type of information in order to increase our Service's functionality. These third-party service providers have their own privacy policies addressing how they use such information.</p>
      <ul>
          <li><strong>Payments:</strong> All payments are processed by Paddle. We do not store your credit card details.</li>
      </ul>

      <h3>5. Your Rights</h3>
      <p>You have the right to access, update, or delete your personal information at any time by contacting us.</p>

      <h3>6. Contact Us</h3>
      <p>If you have any questions about this Privacy Policy, please contact us at support@parentingcertainty.com.</p>
    </LegalLayout>
  );
}
