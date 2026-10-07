import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import { apiEndpoints } from '../services/api';

const Careers = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    city: '',
    coverLetter: '',
    resume: null
  });

  const benefits = [
    'Competitive Salary',
    'Health Insurance',
    'Career Growth',
    'Flexible Hours'
  ];

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await apiEndpoints.getPageContent('careers');
        setPageContent(res.data);
      } catch (err) {
        console.error('Failed to fetch page content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="container-premium py-16 text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const jobCategories = pageContent?.sections?.[0]?.content ?
    JSON.parse(pageContent.sections[0].content) : [
    {
      title: 'Corporate Positions',
      jobs: [
        { title: 'Marketing Manager', location: 'Karachi', type: 'Full-time' },
        { title: 'Finance Analyst', location: 'Lahore', type: 'Full-time' },
        { title: 'HR Manager', location: 'Karachi', type: 'Full-time' },
        { title: 'IT Support Specialist', location: 'Islamabad', type: 'Full-time' }
      ]
    },
    {
      title: 'Store Positions',
      jobs: [
        { title: 'Store Manager', location: 'Multiple Cities', type: 'Full-time' },
        { title: 'Assistant Store Manager', location: 'Multiple Cities', type: 'Full-time' },
        { title: 'Cashier', location: 'Multiple Cities', type: 'Full-time/Part-time' },
        { title: 'Sales Associate', location: 'Multiple Cities', type: 'Full-time/Part-time' },
        { title: 'Stock Clerk', location: 'Multiple Cities', type: 'Full-time' }
      ]
    },
    {
      title: 'Warehouse & Logistics',
      jobs: [
        { title: 'Warehouse Supervisor', location: 'Karachi', type: 'Full-time' },
        { title: 'Inventory Manager', location: 'Lahore', type: 'Full-time' },
        { title: 'Forklift Operator', location: 'Karachi', type: 'Full-time' },
        { title: 'Delivery Driver', location: 'Multiple Cities', type: 'Full-time' }
      ]
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiEndpoints.submitCareerForm(formData);
      alert('Thank you for your application! Our HR team will review it and contact you if your profile matches our requirements.');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        city: '',
        coverLetter: ''
      });
    } catch (err) {
      console.error('Failed to submit career form:', err);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <div className="page-shell">
      <PageHeader
        title={pageContent?.title || 'Careers'}
        subtitle={pageContent?.subtitle || 'Join Our Growing Team'}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Careers' }]}
      />

      {/* Hero Section */}
      <section className="section-premium bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-premium text-center py-16">
          <h2 className="text-4xl font-display mb-4">Build Your Career With ShopMart</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join a dynamic team and grow your career in Pakistan's leading retail chain. We offer competitive benefits, 
            growth opportunities, and a supportive work environment.
          </p>
          <a href="#apply" className="inline-block btn-mart bg-white text-primary-600 hover:bg-white/90">
            Apply Now
          </a>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="section-premium">
        <div className="container-premium">
          <h2 className="text-3xl font-display mb-12 text-center">Why Work With Us</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-6 text-center"
              >
                <svg className="w-8 h-8 text-gold-500 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-luxury-muted">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="section-premium bg-luxury-ivory dark:bg-luxury-slate/30">
        <div className="container-premium">
          <h2 className="text-3xl font-display mb-12 text-center">Open Positions</h2>
          <div className="space-y-12">
            {jobCategories.map((category, catIndex) => (
              <div key={category.title}>
                <h3 className="font-display text-xl mb-6">{category.title}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {category.jobs.map((job, jobIndex) => (
                    <motion.div
                      key={job.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: (catIndex * 3 + jobIndex) * 0.05 }}
                      className="card-premium p-6 hover:shadow-premium-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-display text-lg">{job.title}</h4>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-600">
                          {job.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-luxury-muted">
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {job.location}
                        </span>
                      </div>
                      <a href="#apply" className="inline-block mt-4 text-sm font-medium text-primary-600 hover:underline">
                        Apply Now →
                      </a>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="section-premium">
        <div className="container-premium max-w-3xl">
          <h2 className="text-3xl font-display mb-8 text-center">Apply Online</h2>
          <form onSubmit={handleSubmit} className="card-premium p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Position Applied For *</label>
                <select
                  name="position"
                  required
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
                >
                  <option value="">Select Position</option>
                  {jobCategories.flatMap(cat => cat.jobs).map(job => (
                    <option key={job.title} value={job.title}>{job.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Years of Experience *</label>
                <select
                  name="experience"
                  required
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
                >
                  <option value="">Select Experience</option>
                  <option value="0-1">0-1 Years</option>
                  <option value="1-3">1-3 Years</option>
                  <option value="3-5">3-5 Years</option>
                  <option value="5-10">5-10 Years</option>
                  <option value="10+">10+ Years</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Preferred City *</label>
              <select
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
              >
                <option value="">Select City</option>
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Multan">Multan</option>
                <option value="Peshawar">Peshawar</option>
                <option value="Gujrat">Gujrat</option>
                <option value="Sialkot">Sialkot</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Cover Letter</label>
              <textarea
                name="coverLetter"
                rows={4}
                value={formData.coverLetter}
                onChange={handleChange}
                placeholder="Tell us why you're interested in this position..."
                className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none resize-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Resume/CV *</label>
              <input
                type="file"
                name="resume"
                required
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
              />
              <p className="text-xs text-luxury-muted mt-2">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
            </div>

            <button type="submit" className="btn-premium w-full">
              Submit Application
            </button>
          </form>
        </div>
      </section>

      {/* Contact */}
      <section className="section-premium bg-mart-green text-white">
        <div className="container-premium text-center">
          <h2 className="text-3xl font-display mb-4">Questions?</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            If you have any questions about career opportunities at ShopMart, please contact our HR department.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="tel:021111468429" className="flex items-center gap-2 hover:underline">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              021-111-468-429
            </a>
            <a href="mailto:hr@shopmart.pk" className="flex items-center gap-2 hover:underline">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              hr@shopmart.pk
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
