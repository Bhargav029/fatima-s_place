import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare } from 'lucide-react';
import Navbar from '../components/NavBarhome'; // Adjust path if needed
import Footer from '../components/Footer'; // Adjust path if needed

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // --- 🟢 MOCK BACKEND CODE ---
    // Simulating a 1.5-second delay to show the "Sending..." animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });

    // Hide the success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen font-sans bg-[#f8f9fb] dark:bg-[#0a0b10] transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-[#5b6aff] text-white pt-16 pb-24 px-6 md:px-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
          <MessageSquare className="absolute w-64 h-64 -top-10 -left-10 rotate-12" />
          <MapPin className="absolute w-80 h-80 -bottom-20 -right-20 -rotate-12" />
        </div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-widest text-indigo-200 uppercase bg-indigo-900/30 rounded-full">Get In Touch</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">We'd love to hear from you</h1>
          <p className="text-lg text-indigo-100">Whether you have a question about our menu, reservations, or catering, our team is ready to answer all your questions.</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-20 -mt-10 pb-20 relative z-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Contact Info & Hours */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Contact Cards */}
            <div className="bg-white dark:bg-[#16171d] rounded-3xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
              
              <div className="space-y-6 text-gray-600 dark:text-gray-400 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-[#5b6aff] shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-200 mb-1">Our Location</p>
                    <p className="leading-relaxed">Resort, Small Rd, Opp Leaney, Dmello Vaddo<br/>Vagator, Goa 403509</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-pink-500/10 flex items-center justify-center text-[#ec4899] shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-200 mb-1">Call Us</p>
                    <p>+91 987 654 3210</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-200 mb-1">Email Us</p>
                    <p>hello@fatimasplace.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white dark:bg-[#16171d] rounded-3xl p-8 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="text-[#5b6aff]" size={24} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Opening Hours</h3>
              </div>
              
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800/50">
                  <span className="font-medium">Monday - Friday</span>
                  <span className="font-bold text-gray-900 dark:text-gray-300">11:00 AM - 11:00 PM</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-800/50">
                  <span className="font-medium">Saturday - Sunday</span>
                  <span className="font-bold text-[#ec4899]">11:00 AM - 12:00 AM</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#16171d] rounded-3xl p-8 md:p-10 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800 h-full">
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Send us a message</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Fill out the form below and we will get back to you within 24 hours.</p>

              {isSubmitted ? (
                <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300 h-64 flex flex-col items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent Successfully!</h3>
                  <p className="text-green-600 dark:text-green-400 text-sm">Thank you for reaching out. Our team will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-1">Your Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-sm focus:border-[#5b6aff] focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 outline-none transition-all dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-sm focus:border-[#5b6aff] focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 outline-none transition-all dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-1">Subject</label>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Table Reservation / Party Booking / Feedback"
                      className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-sm focus:border-[#5b6aff] focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 outline-none transition-all dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-bold text-gray-700 dark:text-gray-300 ml-1">Message</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder="How can we help you today?"
                      className="w-full bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl py-3 px-4 text-sm focus:border-[#5b6aff] focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-500/10 outline-none transition-all resize-none dark:text-white"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full bg-[#5b6aff] text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 mt-4 
                      ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#4a58e8] hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-none'}`}
                  >
                    {isSubmitting ? (
                      'Sending Message...'
                    ) : (
                      <>Send Message <Send size={18} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
       <Footer />
    </div>
  );
};

export default Contact;