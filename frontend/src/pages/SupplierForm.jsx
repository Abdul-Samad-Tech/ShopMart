import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import { apiEndpoints } from '../services/api';

const SupplierForm = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    productCategory: '',
    productDescription: '',
    annualCapacity: '',
    certifications: '',
    businessRegistration: '',
    taxNumber: '',
    additionalInfo: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await apiEndpoints.getPageContent('supplier-form');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiEndpoints.submitSupplierForm(formData);
      alert('Thank you for your interest in becoming a supplier. Our team will review your application and contact you within 5-7 business days.');
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        productCategory: '',
        productDescription: '',
        annualCapacity: '',
        certifications: '',
        businessRegistration: '',
        taxNumber: '',
        additionalInfo: ''
      });
    } catch (err) {
      console.error('Failed to submit supplier form:', err);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const categories = [
    'Food & Groceries',
    'Beverages',
    'Personal Care',
    'Household Items',
    'Electronics',
    'Clothing & Textiles',
    'Organic Products',
    'Other'
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title={pageContent?.title || 'Become a Supplier'}
        subtitle={pageContent?.subtitle || 'Partner With ShopMart'}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Supplier Form' }]}
      />

      {/* Hero Section */}
      <section className="section-premium bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container-premium text-center py-16">
          <h2 className="text-4xl font-display mb-4">Partner With Us</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our network of trusted suppliers and reach millions of customers across Pakistan. We are always looking for 
            quality products to enhance our offerings.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-premium">
        <div className="container-premium">
          <h2 className="text-3xl font-display mb-12 text-center">Why Partner With ShopMart?</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '📈', title: 'Wide Reach', description: 'Access to millions of customers across Pakistan' },
              { icon: '💰', title: 'Timely Payments', description: 'Reliable and prompt payment cycles' },
              { icon: '🤝', title: 'Long-term Partnership', description: 'Build lasting business relationships' },
              { icon: '📊', title: 'Market Insights', description: 'Access to customer trends and data' }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-premium p-6 text-center"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-display text-lg mb-2">{benefit.title}</h3>
                <p className="text-sm text-luxury-muted">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="section-premium bg-luxury-ivory dark:bg-luxury-slate/30">
        <div className="container-premium max-w-4xl">
          <h2 className="text-3xl font-display mb-8 text-center">Supplier Application Form</h2>
          <form onSubmit={handleSubmit} className="card-premium p-8">
            {/* Company Information */}
            <div className="mb-8">
              <h3 className="font-display text-xl mb-4 text-gold-600">Company Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Person *</label>
                  <input
                    type="text"
                    name="contactPerson"
                    required
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
                  />
                </div>
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
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
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Business Registration Number *</label>
                  <input
                    type="text"
                    name="businessRegistration"
                    required
                    value={formData.businessRegistration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tax Number (NTN) *</label>
                  <input
                    type="text"
                    name="taxNumber"
                    required
                    value={formData.taxNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="mb-8">
              <h3 className="font-display text-xl mb-4 text-gold-600">Product Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Category *</label>
                  <select
                    name="productCategory"
                    required
                    value={formData.productCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Annual Production Capacity *</label>
                  <select
                    name="annualCapacity"
                    required
                    value={formData.annualCapacity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
                  >
                    <option value="">Select Capacity</option>
                    <option value="Less than 100,000 units">Less than 100,000 units</option>
                    <option value="100,000 - 500,000 units">100,000 - 500,000 units</option>
                    <option value="500,000 - 1,000,000 units">500,000 - 1,000,000 units</option>
                    <option value="More than 1,000,000 units">More than 1,000,000 units</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Product Description *</label>
                  <textarea
                    name="productDescription"
                    required
                    rows={4}
                    value={formData.productDescription}
                    onChange={handleChange}
                    placeholder="Describe your products in detail..."
                    className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none resize-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Certifications (ISO, HACCP, etc.)</label>
                  <input
                    type="text"
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleChange}
                    placeholder="List any relevant certifications"
                    className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-8">
              <h3 className="font-display text-xl mb-4 text-gold-600">Additional Information</h3>
              <div>
                <label className="block text-sm font-medium mb-2">Additional Information</label>
                <textarea
                  name="additionalInfo"
                  rows={4}
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Any other information you would like to share..."
                  className="w-full px-4 py-3 rounded-xl border border-luxury-line focus:border-primary-500 outline-none resize-none"
                />
              </div>
            </div>

            {/* Terms */}
            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-5 h-5 rounded border-luxury-line"
                />
                <span className="text-sm text-luxury-muted">
                  I confirm that all information provided is accurate and I agree to ShopMart's supplier terms and conditions.
                </span>
              </label>
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
            If you have any questions about becoming a supplier, please contact our procurement team.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="mailto:procurement@shopmart.pk" className="flex items-center gap-2 hover:underline">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              procurement@shopmart.pk
            </a>
            <a href="tel:021111468429" className="flex items-center gap-2 hover:underline">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              021-111-468-429
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupplierForm;
