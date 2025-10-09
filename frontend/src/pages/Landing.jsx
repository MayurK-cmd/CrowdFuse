import React from 'react';
import { Calendar, Users, CheckCircle, Sparkles, ArrowRight, Menu } from 'lucide-react';
import BlurText from '../components/BlurText';
import AnimatedContent from '../components/AnimatedContent';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-black" />
              <span className="ml-2 text-2xl font-bold text-black">CrowdFuse</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="/login" className="px-4 py-2 text-black hover:text-gray-600 transition">
                Login
              </a>
              <a href="/signup" className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                Sign Up
              </a>
            </div>
            <button className="md:hidden">
              <Menu className="h-6 w-6 text-black" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Manage Events That
            <span className="block mt-2">Bring People Together</span>
          </h1> */}
          
          <BlurText
            text="Manage Events That Bring People Together"
            delay={150}
            animateBy="words"
            direction="top"
  className="text-5xl md:text-6xl font-bold text-black mb-6"
/>

          <p className="mt-5 text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Create, organize, and manage events seamlessly. Connect with attendees and volunteers all in one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="px-8 py-4 bg-black text-white rounded-lg text-lg font-semibold hover:bg-gray-800 transition inline-flex items-center justify-center">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <button className="px-8 py-4 border-2 border-black text-black rounded-lg text-lg font-semibold hover:bg-gray-50 transition">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Everything You Need</h2>
          <p className="text-xl text-gray-600">Powerful features to make event management effortless</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
  <AnimatedContent
    distance={100}
    direction="vertical"
    duration={0.8}
    ease="power3.out"
    delay={0}
  >
    <div className="bg-white p-8 rounded-xl border border-gray-200">
      <div className="h-12 w-12 bg-black rounded-lg flex items-center justify-center mb-6">
        <Calendar className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-black mb-4">Create Events</h3>
      <p className="text-gray-600">
        Set up your event in minutes with our intuitive event creation flow. Add details, schedules, and customize to your needs.
      </p>
    </div>
  </AnimatedContent>

  <AnimatedContent
    distance={100}
    direction="vertical"
    duration={0.8}
    ease="power3.out"
    delay={0.2}
  >
    <div className="bg-white p-8 rounded-xl border border-gray-200">
      <div className="h-12 w-12 bg-black rounded-lg flex items-center justify-center mb-6">
        <CheckCircle className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-black mb-4">Easy RSVP</h3>
      <p className="text-gray-600">
        Let attendees RSVP with a single click. Track who's coming as an attendee or volunteer effortlessly.
      </p>
    </div>
  </AnimatedContent>

  <AnimatedContent
    distance={100}
    direction="vertical"
    duration={0.8}
    ease="power3.out"
    delay={0.4}
  >
    <div className="bg-white p-8 rounded-xl border border-gray-200">
      <div className="h-12 w-12 bg-black rounded-lg flex items-center justify-center mb-6">
        <Users className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-black mb-4">Manage Teams</h3>
      <p className="text-gray-600">
        Organize volunteers and attendees. Send updates, coordinate schedules, and keep everyone in sync.
      </p>
    </div>
  </AnimatedContent>
</div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-black rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Events?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers who trust CrowdFuse to bring their communities together.
          </p>
          <a href="/signup" className="inline-flex items-center px-8 py-4 bg-white text-black rounded-lg text-lg font-semibold hover:bg-gray-100 transition">
            Start Your Journey Now!
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-black" />
              <span className="ml-2 text-xl font-bold text-black">CrowdFuse</span>
            </div>
            <p className="text-gray-600">© 2025 CrowdFuse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}