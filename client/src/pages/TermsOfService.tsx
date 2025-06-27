
import React from 'react';
import { Header } from "@/components/FloatingWidgetBuilder/Header";
import { Footer } from "@/components/FloatingWidgetBuilder/Footer";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { useState } from 'react';

const TermsOfService = () => {
  const { user, loading, signOut } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header 
        user={user}
        loading={loading}
        onSignOut={handleSignOut}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using Hiclient, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Use License</h2>
              <p className="text-gray-600 mb-4">
                Permission is granted to temporarily use Hiclient for personal and commercial purposes. This license shall automatically terminate if you violate any of these restrictions.
              </p>
              <p className="text-gray-600">Under this license you may not:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose without proper licensing</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Service Availability</h2>
              <p className="text-gray-600">
                We strive to maintain high service availability, but we do not guarantee uninterrupted access to our services. 
                We may temporarily suspend access for maintenance, updates, or other technical reasons.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Payment Terms</h2>
              <p className="text-gray-600">
                Our credit-based pricing system requires payment before service usage. All payments are processed securely 
                through our payment partner. Refunds are handled on a case-by-case basis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600">
                In no event shall Hiclient or its suppliers be liable for any damages arising out of the use or inability 
                to use the service, even if we have been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms of Service, please contact us at legal@hiclient.co
              </p>
            </section>

            <div className="text-sm text-gray-500 pt-4 border-t">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default TermsOfService;
