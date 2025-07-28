
import React from 'react';
import { MessageCircle, Zap, Shield, Users } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-block mb-6 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
                <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ✨ Build Beautiful Widgets in Minutes
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Engage with your customers in the
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block">
                  channels they prefer
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
                Omnichannel solution enabling companies to connect with their customers in all messaging apps and social networks, via live chat and e-mail
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <a 
                  href="#widget-form" 
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Try for free
                </a>
                <div className="text-sm text-gray-500 mt-2">
                  *10-day free trial
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px]">
              <img 
                src="https://blinger.io/img/presentation.svg" 
                alt="Customer engagement illustration" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-3 transition-transform duration-300">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Setup</h3>
            <p className="text-gray-600 leading-relaxed">Get your widget up and running in under 5 minutes with our intuitive builder</p>
          </div>

          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-3 transition-transform duration-300">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Multi-Channel</h3>
            <p className="text-gray-600 leading-relaxed">Support WhatsApp, Telegram, Email, Phone and custom contact methods</p>
          </div>

          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-3 transition-transform duration-300">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Video Enabled</h3>
            <p className="text-gray-600 leading-relaxed">Add personal video messages to build trust and connect with visitors</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-3xl p-10 border border-white/30 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Create your first widget below and see the magic happen!</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
        </div>
      </div>
    </section>
  );
};
