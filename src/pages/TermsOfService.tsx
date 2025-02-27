
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileText, AlertTriangle, BookOpen } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4 font-display bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Terms of Service</h1>
            <p className="text-lg text-gray-600">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          
          <div className="bg-white shadow-xl rounded-xl p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              <div className="border-l-4 border-amber-400 bg-amber-50 p-5 rounded-r mb-8">
                <p className="text-amber-800 font-medium">
                  Please read these Terms of Service carefully before using ColorPage AI. By accessing or using our service, you agree to be bound by these terms.
                </p>
              </div>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center text-gray-800">
                <span className="bg-purple-100 text-purple-700 p-1.5 rounded-full mr-3 flex items-center justify-center w-8 h-8">1</span>
                Agreement to Terms
              </h2>
              <p>
                By accessing or using ColorPage AI ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you do not agree to these Terms, you may not access or use the Service.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center text-gray-800">
                <span className="bg-purple-100 text-purple-700 p-1.5 rounded-full mr-3 flex items-center justify-center w-8 h-8">2</span>
                Description of Service
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                <div className="flex items-start">
                  <BookOpen className="h-6 w-6 text-purple-600 mt-1 mr-3 flex-shrink-0" />
                  <p>
                    ColorPage AI provides an AI-powered platform that transforms text descriptions into coloring pages. 
                    Features, functionality, and availability of the Service may change without notice.
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center text-gray-800">
                <span className="bg-purple-100 text-purple-700 p-1.5 rounded-full mr-3 flex items-center justify-center w-8 h-8">3</span>
                Account Registration
              </h2>
              <p>
                To use certain features of our Service, you may need to create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-1 marker:text-purple-500">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the security and confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center text-gray-800">
                <span className="bg-purple-100 text-purple-700 p-1.5 rounded-full mr-3 flex items-center justify-center w-8 h-8">4</span>
                Subscription and Payments
              </h2>
              <p>
                We offer both free and paid subscription plans. For paid subscriptions:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-1 marker:text-purple-500">
                <li>Payment is charged at the beginning of your subscription period</li>
                <li>Subscriptions automatically renew unless cancelled before the renewal date</li>
                <li>You can cancel your subscription at any time through your account settings</li>
                <li>Refunds are provided in accordance with our Refund Policy</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center text-gray-800">
                <span className="bg-purple-100 text-purple-700 p-1.5 rounded-full mr-3 flex items-center justify-center w-8 h-8">5</span>
                User Content
              </h2>
              <p>
                You retain ownership of any content you submit through our Service ("User Content"). 
                By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, 
                reproduce, modify, adapt, publish, and display such User Content for the purpose of providing and improving our Service.
              </p>
              <p>
                You are solely responsible for your User Content and represent that you have all necessary rights to submit it. 
                You agree not to submit User Content that:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-1 marker:text-purple-500">
                <li>Infringes on the intellectual property rights of others</li>
                <li>Contains illegal, offensive, harmful, or inappropriate content</li>
                <li>Violates any applicable laws or regulations</li>
                <li>Contains malware, viruses, or other harmful code</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center text-gray-800">
                <span className="bg-purple-100 text-purple-700 p-1.5 rounded-full mr-3 flex items-center justify-center w-8 h-8">6</span>
                Acceptable Use
              </h2>
              <p>
                You agree not to use our Service to:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-1 marker:text-purple-500">
                <li>Violate any laws or regulations</li>
                <li>Infringe on the rights of others</li>
                <li>Harass, abuse, or harm another person or entity</li>
                <li>Distribute unsolicited or unauthorized advertising or promotional material</li>
                <li>Interfere with or disrupt the Service or servers or networks connected to the Service</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center text-gray-800">
                <span className="bg-purple-100 text-purple-700 p-1.5 rounded-full mr-3 flex items-center justify-center w-8 h-8">7</span>
                Intellectual Property
              </h2>
              <p>
                The Service and all content, features, and functionality (including but not limited to all information, software, text, 
                displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by us or our licensors 
                and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center text-gray-800">
                <span className="bg-purple-100 text-purple-700 p-1.5 rounded-full mr-3 flex items-center justify-center w-8 h-8">8</span>
                Disclaimer of Warranties
              </h2>
              <div className="bg-red-50 p-6 rounded-lg border border-red-100 mb-6">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-gray-800">
                    THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, 
                    INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
                    NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center text-gray-800">
                <span className="bg-purple-100 text-purple-700 p-1.5 rounded-full mr-3 flex items-center justify-center w-8 h-8">9</span>
                Limitation of Liability
              </h2>
              <p>
                IN NO EVENT SHALL WE BE LIABLE FOR ANY SPECIAL, INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING 
                OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center text-gray-800">
                <span className="bg-purple-100 text-purple-700 p-1.5 rounded-full mr-3 flex items-center justify-center w-8 h-8">10</span>
                Termination
              </h2>
              <p>
                We may terminate or suspend your account and access to the Service at our sole discretion, without notice, for any reason, 
                including if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center text-gray-800">
                <span className="bg-purple-100 text-purple-700 p-1.5 rounded-full mr-3 flex items-center justify-center w-8 h-8">11</span>
                Changes to Terms
              </h2>
              <p>
                We may modify these Terms at any time. The updated Terms will be posted on this page with a new effective date. 
                Your continued use of the Service after any changes to the Terms constitutes your acceptance of such changes.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center text-gray-800">
                <span className="bg-purple-100 text-purple-700 p-1.5 rounded-full mr-3 flex items-center justify-center w-8 h-8">12</span>
                Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United States, 
                without regard to its conflict of law provisions.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4 flex items-center text-gray-800">
                <span className="bg-purple-100 text-purple-700 p-1.5 rounded-full mr-3 flex items-center justify-center w-8 h-8">13</span>
                Contact Information
              </h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p>
                  If you have questions about these Terms, please contact us at:
                </p>
                <div className="mt-3">
                  <a href="/contact" className="text-purple-600 font-medium hover:underline">Visit our Contact Page</a>
                  <span className="mx-2 text-gray-400">|</span>
                  <a href="mailto:legal@colorpageai.com" className="text-purple-600 font-medium hover:underline">legal@colorpageai.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
