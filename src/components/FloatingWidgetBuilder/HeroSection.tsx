
import React, { useState } from 'react';
import { MessageCircle, Zap, Shield, Users, X, Phone, Mail, Video } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoStep, setDemoStep] = useState(1);

  const toggleDemo = () => {
    setDemoOpen(!demoOpen);
    if (!demoOpen) {
      setDemoStep(1);
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Modern Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[length:20px_20px] opacity-30"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full opacity-15 animate-pulse delay-1000"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full opacity-25 animate-pulse delay-500"></div>

      <div className="relative z-10 text-center mb-16 pt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="text-left">
              <div className="inline-block mb-6 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/20 shadow-sm">
                <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ✨ Floating Contact Widget Builder
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Floating Contact
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block">
                  Widgets with Video
                </span>
                for Your Website
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Create professional floating contact buttons that connect visitors to your WhatsApp, Telegram, email, phone and more. 
                Add personal video messages to build trust and increase engagement.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <a 
                  href="#widget-form" 
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  Create Your Widget
                </a>
                <button 
                  onClick={toggleDemo}
                  className="px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200"
                >
                  See Live Demo
                </button>
              </div>

              <p className="text-sm text-gray-500">No coding required • Works on any website</p>
            </div>

            {/* Right Side - Interactive Demo */}
            <div className="relative">
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-xl">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Live Widget Preview</h3>
                  <p className="text-gray-600">See how it works on your site</p>
                </div>

                {/* Demo Widget Preview */}
                <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-6 min-h-[300px]">
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  
                  <div className="text-center mt-8 text-gray-500">
                    <div className="text-lg font-medium mb-2">Your Website</div>
                    <div className="text-sm">Contact widget appears here</div>
                  </div>

                  {/* Floating Widget Button */}
                  <div className="absolute bottom-6 right-6">
                    <button 
                      onClick={toggleDemo}
                      className="relative group"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 animate-pulse">
                        <MessageCircle className="w-8 h-8 text-white" />
                      </div>
                      {demoStep === 1 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">1</span>
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Demo Contact Widget */}
                  {demoOpen && (
                    <div className="absolute bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border animate-scale-in">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-semibold">Contact Us</div>
                            <div className="text-white/80 text-sm">We're here to help!</div>
                          </div>
                        </div>
                        <button 
                          onClick={toggleDemo}
                          className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="p-4">
                        {/* Video Preview Section */}
                        <div className="bg-gray-100 rounded-lg p-3 mb-4 text-center">
                          <Video className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <p className="text-sm text-gray-700 font-medium">
                            Personal Video Message
                          </p>
                          <p className="text-xs text-gray-500">
                            Add your own video to build trust
                          </p>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-3">Choose how to contact us:</p>
                          <div className="flex gap-2 flex-wrap">
                            <button className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-full text-sm hover:bg-green-600 transition-colors">
                              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                <span className="text-green-500 text-xs">W</span>
                              </div>
                              WhatsApp
                            </button>
                            <button className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-full text-sm hover:bg-blue-600 transition-colors">
                              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                <span className="text-blue-500 text-xs">T</span>
                              </div>
                              Telegram
                            </button>
                            <button className="flex items-center gap-2 bg-purple-500 text-white px-3 py-2 rounded-full text-sm hover:bg-purple-600 transition-colors">
                              <Phone className="w-4 h-4" />
                              Call
                            </button>
                            <button className="flex items-center gap-2 bg-orange-500 text-white px-3 py-2 rounded-full text-sm hover:bg-orange-600 transition-colors">
                              <Mail className="w-4 h-4" />
                              Email
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Get Your Widget in Three Simple Steps */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Create Your Contact Widget in 3 Steps</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Add Contact Channels</h3>
                <p className="text-gray-600">Add your WhatsApp, Telegram, email, phone and other contact methods</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customize & Add Video</h3>
                <p className="text-gray-600">Design your widget and optionally add a personal video message</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Install on Website</h3>
                <p className="text-gray-600">Copy the code and paste it to your website - it's that simple!</p>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div id="features" className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-3 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Setup</h3>
              <p className="text-gray-600 leading-relaxed">Get your contact widget up and running in under 5 minutes with our intuitive builder</p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-3 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Multi-Channel Support</h3>
              <p className="text-gray-600 leading-relaxed">Connect via WhatsApp, Telegram, Email, Phone and other contact methods</p>
            </div>

            <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/30 shadow-sm hover:shadow-lg transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:rotate-3 transition-transform duration-300">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Video Integration</h3>
              <p className="text-gray-600 leading-relaxed">Add personal video messages to build trust and connect with your visitors</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-3xl p-10 border border-white/30 shadow-sm mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">Create your first contact widget below and see how it transforms your website engagement!</p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
