
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, User } from 'lucide-react';

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Yüklənir...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Xoş gəlmisiniz
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {user.email}
                    </span>
                  </div>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Çıxış</span>
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Giriş
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {user ? `Salam, ${user.email}!` : 'Ana Səhifə'}
          </h2>
          
          {user ? (
            <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
              <p className="text-gray-600 mb-4">
                Siz uğurla daxil olmusunuz!
              </p>
              <p className="text-sm text-gray-500">
                Hesab yaradılma tarixi: {new Date(user.created_at).toLocaleDateString('az-AZ')}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
              <p className="text-gray-600 mb-4">
                Daxil olmaq üçün yuxarıdakı "Giriş" düyməsinə klikləyin
              </p>
              <Button
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                İndi Daxil Ol
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Index;
