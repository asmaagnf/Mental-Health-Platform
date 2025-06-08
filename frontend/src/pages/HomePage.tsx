import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, UserCircle, BarChart2 } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="animate-slide-up">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Mental Wellness Journey Starts Here</h1>
              <p className="text-xl mb-8 text-teal-50">
                Connect with qualified therapists, track your progress, and take control of your mental health with MindPulse.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/therapists" className="btn bg-white text-teal-600 hover:bg-teal-50">
                  Find a Therapist
                </Link>
                <Link to="/register" className="btn bg-teal-600 text-white border border-white hover:bg-teal-700">
                  Sign Up for Free
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.pexels.com/photos/5699475/pexels-photo-5699475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Therapy Session" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How MindPulse Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our platform makes it easy to find the right therapist and manage your mental health journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <UserCircle className="h-12 w-12 text-teal-500" />,
                title: "Find Your Therapist",
                description: "Browse profiles of qualified mental health professionals and find your perfect match."
              },
              {
                icon: <Calendar className="h-12 w-12 text-teal-500" />,
                title: "Book Sessions",
                description: "Schedule appointments easily with our intuitive booking system."
              },
              {
                icon: <CheckCircle className="h-12 w-12 text-teal-500" />,
                title: "Attend Sessions",
                description: "Connect via secure video consultations or in-person meetings."
              },
              {
                icon: <BarChart2 className="h-12 w-12 text-teal-500" />,
                title: "Track Progress",
                description: "Monitor your mental health journey with our tracking tools."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-slate-50 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              MindPulse has helped thousands of people on their mental health journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "Finding a therapist who truly understood my needs was easy with MindPulse. The platform made the whole process stress-free.",
                author: "Sarah J.",
                role: "User"
              },
              {
                quote: "As a therapist, MindPulse has simplified my practice management and helped me connect with clients who are the right fit for my expertise.",
                author: "Dr. Michael T.",
                role: "Therapist"
              },
              {
                quote: "The health tracking tools have been invaluable in helping me understand my patterns and progress. I feel more in control of my mental health journey.",
                author: "Alex R.",
                role: "User"
              }
            ].map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <span className="text-teal-600 font-medium">{testimonial.author.charAt(0)}</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-slate-900 font-medium">{testimonial.author}</p>
                    <p className="text-slate-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-slate-600 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Join thousands of others who have taken the first step toward better mental health.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn bg-white text-purple-600 hover:bg-purple-50">
              Sign Up Now
            </Link>
            <Link to="/therapists" className="btn bg-purple-700 border border-white text-white hover:bg-purple-800">
              Browse Therapists
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;