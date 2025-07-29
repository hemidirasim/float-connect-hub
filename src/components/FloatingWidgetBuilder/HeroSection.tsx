
import React from 'react';
import { MessageCircle, Zap, Shield, Users, ArrowRight, Play, Star } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-20">
        {/* Main Hero Content */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 mb-8 bg-white/70 backdrop-blur-sm rounded-full border border-white/20 shadow-lg">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Trusted by 10,000+ websites worldwide
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-8">
            Connect with your
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              customers instantly
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-12">
            Create beautiful floating contact buttons that connect visitors to WhatsApp, Telegram, Email, Phone and other messaging platforms in just minutes
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-12">
            <a 
              href="#widget-form" 
              className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center">
                Start Building for Free
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </a>
            
            <button className="group flex items-center px-8 py-5 bg-white/80 backdrop-blur-sm text-gray-900 font-semibold text-lg rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
              Watch Demo
            </button>
          </div>

          <div className="text-sm text-gray-500">
            ✨ No coding required • 30-second setup • Free forever plan
          </div>
        </div>

        {/* Hero Image/Illustration */}
        <div className="relative mb-20">
          <div className="relative mx-auto max-w-4xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-2xl">
              <img 
                src="https://blinger.io/img/presentation.svg" 
                alt="Customer engagement platform illustration" 
                className="w-full h-auto object-contain max-h-96"
              />
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-10 border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:rotate-6 transition-transform duration-300">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Lightning Fast Setup</h3>
              <p className="text-gray-600 text-lg leading-relaxed text-center">Get your widget up and running in under 2 minutes with our intuitive visual builder</p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-10 border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:rotate-6 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Multi-Platform Support</h3>
              <p className="text-gray-600 text-lg leading-relaxed text-center">Connect with WhatsApp, Telegram, Email, Phone calls and 15+ other platforms seamlessly</p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-10 border border-white/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:transform hover:scale-105">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl flex items-center justify-center mb-8 mx-auto group-hover:rotate-6 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Video Integration</h3>
              <p className="text-gray-600 text-lg leading-relaxed text-center">Add personal video messages to build trust and increase engagement rates by 300%</p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-3xl p-12 border border-white/30 shadow-xl mb-20">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">10K+</div>
              <div className="text-gray-600 font-medium">Active Websites</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">300%</div>
              <div className="text-gray-600 font-medium">Engagement Boost</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">2 Min</div>
              <div className="text-gray-600 font-medium">Setup Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Support</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-16 border border-blue-100">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Ready to boost your conversions?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of businesses using our floating contact widgets to increase customer engagement and drive more sales
          </p>
          <a 
            href="#widget-form"
            className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            Create Your Widget Now
            <ArrowRight className="w-6 h-6 ml-3" />
          </a>
          <div className="mt-6 text-gray-500">
            Start free • No credit card required
          </div>
        </div>
      </div>
    </section>
  );
};
