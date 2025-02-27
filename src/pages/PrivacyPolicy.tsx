
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 font-display">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-lg mb-6">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to ColorPage AI ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium mt-6 mb-3">2.1 Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide when using our service, including:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Name and contact information (email address)</li>
              <li>Account credentials</li>
              <li>Billing and payment information</li>
              <li>User-generated content, including prompts and created images</li>
              <li>Communications with us</li>
            </ul>
            
            <h3 className="text-xl font-medium mt-6 mb-3">2.2 Automatically Collected Information</h3>
            <p>When you access our service, we may automatically collect:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Device information (browser type, operating system, device type)</li>
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>IP address and location information</li>
              <li>Cookies and similar technologies data</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and manage your account</li>
              <li>Send you service-related communications</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Protect against unauthorized access and legal liability</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Sharing Your Information</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Service providers who perform services on our behalf</li>
              <li>Partners with whom we offer co-branded services or promotions</li>
              <li>Legal authorities when required by law or to protect our rights</li>
              <li>A successor entity in the event of a merger, acquisition, or reorganization</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, 
              accidental loss, destruction, or damage. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal data, including:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Access to your personal data</li>
              <li>Correction of inaccurate or incomplete data</li>
              <li>Deletion of your personal data</li>
              <li>Restriction or objection to processing</li>
              <li>Data portability</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Cookies Policy</h2>
            <p>
              Our service uses cookies and similar technologies to enhance user experience and analyze usage patterns. 
              You can control cookie settings through your browser preferences.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children's Privacy</h2>
            <p>
              Our service is not directed at children under 13 years of age. We do not knowingly collect personal information from children under 13. 
              If you believe a child under 13 has provided us with personal information, please contact us.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
              and updating the "Last Updated" date.
            </p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:privacy@colorpageai.com" className="text-primary hover:underline">privacy@colorpageai.com</a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
