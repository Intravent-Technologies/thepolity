'use client';

import { motion, type Variants } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const services = [
  {
    title: 'IT Consultancy',
    description: 'Smart technology solutions tailored to drive efficiency, innovation, and growth.',
    image: '/service-it.svg'
  },
  {
    title: 'Media',
    description: 'Strategic media and content solutions designed to enhance visibility and communicate your message effectively.',
    image: '/service-media.svg'
  },
  {
    title: 'Project Management',
    description: 'Efficient, structured project delivery from planning to completion.',
    image: '/service-project.svg'
  }
];

const stats = [
  { number: '1K+', label: 'Consultations Completed' },
  { number: '3M+', label: 'Revenue Achieved' },
  { number: '80%', label: 'Customer Satisfaction' },
  { number: '100+', label: 'Global Partnerships' }
];

const skills = [
  { name: 'Creativity', percentage: 80 },
  { name: 'Strategy', percentage: 70 },
  { name: 'Engagement', percentage: 60 }
];

const faqs = [
  { question: 'What services do you provide?', answer: 'We provide IT consultancy, media solutions, and project management services tailored to your business needs.' },
  { question: 'What is the usual duration of a project?', answer: 'Project duration varies based on scope and complexity, typically ranging from 2 weeks to 3 months.' },
  { question: 'Do you offer revisions?', answer: 'Yes, we offer multiple revision rounds to ensure the final deliverable meets your expectations.' },
  { question: 'How can I get a quote?', answer: 'You can request a quote by filling out our contact form or scheduling a free consultation call.' },
  { question: 'What payment methods do you accept?', answer: 'We accept bank transfers, credit cards, and PayPal for your convenience.' }
];

const blogPosts = [
  { title: 'The Future of Digital Strategy', category: 'Strategy', date: 'Jan 15, 2025' },
  { title: 'Maximizing ROI with IT Solutions', category: 'Technology', date: 'Jan 10, 2025' },
  { title: 'Building Brands That Last', category: 'Branding', date: 'Jan 5, 2025' }
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Header />
      <main className="bg-[#0a0a0a] text-white overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001F3F]/30 via-[#0a0a0a] to-[#0a0a0a]" />
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[#FF6B35]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#001F3F]/20 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
          
          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              <div className="space-y-10">
                <motion.div 
                  variants={fadeInUp} 
                  className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-full border border-white/10"
                >
                  <div className="flex -space-x-2">
                    <img src="/avatar1.svg" alt="Reviewer" className="w-6 h-6 rounded-full border-2 border-[#0a0a0a] object-cover" />
                    <img src="/avatar2.svg" alt="Reviewer" className="w-6 h-6 rounded-full border-2 border-[#0a0a0a] object-cover" />
                    <img src="/avatar3.svg" alt="Reviewer" className="w-6 h-6 rounded-full border-2 border-[#0a0a0a] object-cover" />
                  </div>
                  <span className="text-sm text-white/70">4.97/5 from <span className="text-white font-medium">600+ reviews</span></span>
                </motion.div>

                <motion.h1 
                  variants={fadeInUp}
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1]"
                >
                  Transform Your
                  <br />
                  <span className="text-[#FF6B35]">Business</span> Strategy
                </motion.h1>

                <motion.p 
                  variants={fadeInUp}
                  className="text-lg text-white/70 max-w-xl leading-relaxed"
                >
                  We blend technology, media, and strategy to deliver results that matter. 
                  Partner with experts who understand your vision.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B35] text-white rounded-full font-medium hover:bg-[#FF9F66] transition-all hover:scale-105"
                  >
                    Free consultation
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/work"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 text-white rounded-full font-medium border border-white/20 hover:bg-white/10 transition-all"
                  >
                    View Our Work
                  </Link>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex gap-8 pt-4">
                  {stats.slice(0, 3).map((stat, i) => (
                    <div key={i}>
                      <div className="text-2xl font-bold text-white">{stat.number}</div>
                      <div className="text-xs text-white/50">{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </div>

<motion.div 
                  variants={fadeInUp}
                  className="relative hidden lg:block"
                >
                  <div className="relative">
                    <div className="relative z-10 grid grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <img src="/hero-tech1.svg" alt="IT Consulting" className="h-40 w-full object-cover rounded-3xl border border-white/10 backdrop-blur-sm" />
                        <img src="/hero-team.svg" alt="Team collaboration" className="h-56 w-full object-cover rounded-3xl border border-white/10 backdrop-blur-sm" />
                      </div>
                      <div className="space-y-6 pt-12">
                        <img src="/hero-office.svg" alt="Modern office" className="h-56 w-full object-cover rounded-3xl border border-white/10 backdrop-blur-sm" />
                        <img src="/hero-meeting.svg" alt="Business meeting" className="h-40 w-full object-cover rounded-3xl border border-white/10 backdrop-blur-sm" />
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#FF6B35]/20 rounded-2xl border border-[#FF6B35]/30 backdrop-blur-sm" />
                    <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-[#001F3F]/40 rounded-2xl border border-white/10 backdrop-blur-sm" />
                  </div>
                </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2"
            >
              <motion.div className="w-1 h-2 bg-[#FF6B35] rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* Services Section */}
        <section className="py-24 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">Our Expert Services</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Providing top-notch solutions tailored to enhance your business growth and efficiency.
              </p>
              <Link href="/services" className="inline-flex items-center gap-2 text-[#FF6B35] mt-4 hover:underline">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl p-8 border border-white/10 hover:border-[#FF6B35]/50 transition-all duration-300"
                >
                  {service.image ? (
                    <img src={service.image} alt={service.title} className="h-48 w-full object-cover rounded-xl mb-6" />
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-[#001F3F]/20 to-[#FF6B35]/10 rounded-xl mb-6" />
                  )}
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-white/60 text-sm mb-4">{service.description}</p>
                  <Link 
                    href={`/services#${service.title.toLowerCase().replace(' ', '-')}`}
                    className="inline-flex items-center gap-2 text-[#FF6B35] text-sm font-medium group-hover:gap-3 transition-all"
                  >
                    Explore {service.title.split(' ')[0]} <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats & Skills Section */}
        <section className="py-24 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-[#0a0a0a] to-[#0f0f0f]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl sm:text-5xl font-bold mb-6">Creating Brands That Last</h2>
                <p className="text-white/70 mb-10">
                  We blend creativity and strategy to craft compelling brand stories that connect, engage, and leave a lasting impact.
                </p>

                <div className="space-y-6">
                  {skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-[#FF6B35]">{skill.percentage}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-[#FF6B35] to-[#FF9F66] rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Link 
                  href="/about"
                  className="inline-flex items-center gap-2 mt-10 px-6 py-3 border border-white/20 rounded-full hover:bg-white/5 transition-colors"
                >
                  Discover Our Journey <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-8"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center p-6 bg-gradient-to-br from-white/5 to-transparent rounded-2xl border border-white/10"
                  >
                    <div className="text-4xl sm:text-5xl font-bold text-[#FF6B35] mb-2">{stat.number}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-24 px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-8">
                Working with THE POLITY transformed our website&apos;s impact!
              </h2>
              <p className="text-white/70 text-lg mb-8">
                Unparalleled creativity and strategic content elevated our brand&apos;s presence, driving engagement and boosting conversions. Highly recommend their expertise to any business looking to grow!
              </p>
              <div className="flex items-center justify-center gap-4">
                <img src="/brightvision-logo.svg" alt="BrightVision" className="w-12 h-12 object-contain rounded-full" />
                <div className="text-left">
                  <div className="font-semibold">Alex R.</div>
                  <div className="text-white/60 text-sm">Founder & CEO of BrightVision</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#001F3F] to-[#0a0a0a] rounded-3xl p-12 lg:p-16 text-center border border-white/10"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">Let&apos;s Take Your Business Further</h2>
              <p className="text-white/70 max-w-2xl mx-auto mb-8">
                Partner with us for tailored strategies that drive success. Our experts are ready to help you grow and thrive—let&apos;s make it happen!
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF6B35] text-white rounded-full font-medium hover:bg-[#FF9F66] transition-colors"
              >
                Schedule a Call <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="flex justify-center gap-8 mt-12 text-2xl font-bold text-white/20">
                {['Win.', 'Grow.', 'Thrive.', 'Lead.'].map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="hover:text-[#FF6B35] transition-colors cursor-default"
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 px-6 sm:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-white/70">
                Got questions? We&apos;ve got answers! Find quick responses to common queries about our services, timelines, and more.
              </p>
              <Link href="/faqs" className="inline-flex items-center gap-2 text-[#FF6B35] mt-4 hover:underline">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-white/10 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-medium">{faq.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} 
                    />
                  </button>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-white/60"
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className="py-24 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">The Creative Edge</h2>
              <p className="text-white/70">
                Inspiration, tools, and techniques to bring your ideas to life effortlessly.
              </p>
              <Link href="/blog" className="inline-flex items-center gap-2 text-[#FF6B35] mt-4 hover:underline">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="h-48 bg-gradient-to-br from-[#001F3F]/30 to-[#FF6B35]/10 rounded-2xl mb-4 border border-white/10 group-hover:border-[#FF6B35]/50 transition-colors overflow-hidden">
                    <img src="/blog-creative.svg" alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="text-[#FF6B35] text-sm mb-2">{post.category}</div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF6B35] transition-colors">{post.title}</h3>
                  <div className="text-white/50 text-sm">{post.date}</div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-24 px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#FF6B35]/10 to-[#FF6B35]/5 rounded-3xl p-12 text-center border border-[#FF6B35]/20"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join Our Newsletter</h2>
              <p className="text-white/70 mb-8">
                Stay updated with expert insights, business tips, and the latest trends that drive success. Sign up today!
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email for business updates"
                  className="flex-1 px-6 py-4 bg-white/5 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF6B35]"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-[#FF6B35] text-white rounded-full font-medium hover:bg-[#FF9F66] transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}