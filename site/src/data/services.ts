// Services page content (supplied by the user — don't change wording without asking).
// 2026-11: the page shows `serviceSections` with a call to action instead of prices. The older price data below
// (launch offer, website, management, addOns, seo, pricing) is kept for reference and is no longer shown.
// `id` is also used by the contact form: /contact/?service=<id> ticks that option.

// Services shown on the page: three groups, each with a list and a call to action (no prices).
export const serviceSections = [
  { id: 'website', no: '01', tag: 'Websites', name: 'Websites', items: ['Custom web design', 'Development', 'Mobile optimization', 'Hosting/deployment setup', 'Ongoing maintenance and support'], cta: 'Start a project' },
  { id: 'content', no: '02', tag: 'Content', name: 'Content', items: ['Photography', 'Videography', 'Short-form content', 'Long-form brand video', 'On-location shoots', 'Website and social media content'], cta: 'Request a quote' },
  { id: 'social', no: '03', tag: 'Social media', name: 'Social Media Content', items: ['Feed posts', 'Carousels', 'Reels', 'Promotional graphics', 'Launch campaigns', 'Monthly content packages'], cta: 'Tell us about your project' },
];

// Launch offer (no longer shown): the regular prices ($500 setup / $150 a month) apply once the first 10 clients have signed.
export const launch = { label: 'Launch pricing', limit: 'First 10 clients', note: 'Launch pricing for our first 10 clients. Regular pricing applies after that.' };

export const website = {
  id: 'website',
  name: 'Website Design & Development',
  price: { lead: 'Setup', amount: '$0', was: '$500' },
  lede: 'Custom websites designed and developed specifically for your business.',
  body: [
    'We don’t believe a professional website needs to cost thousands of dollars just to look modern. By combining an efficient development process, modern technology, AI and human creative direction, we’re able to create high-quality digital experiences without the traditional agency overhead.',
    'Every website is designed around the business behind it — not pulled from a one-size-fits-all template.',
  ],
  includesLabel: 'Website projects can include',
  includes: [
    'Custom website design',
    'Website development',
    'Mobile and responsive optimization',
    'Contact and inquiry forms',
    'Google Maps and social integration',
    'Basic on-page SEO',
    'Search engine setup',
    'Performance optimization',
    'Domain and launch setup',
    'SSL / security setup',
  ],
  note: 'Final scope depends on the needs of the project.',
};

export const management = {
  id: 'management',
  name: 'Website Management',
  price: { amount: '$100', per: '/month', was: '$150' },
  lede: 'Launching the website isn’t where our relationship has to end.',
  body: 'Solace can continue managing the website after launch so business owners don’t have to worry about hosting, maintenance, technical issues or every small change that comes up.',
  includesLabel: 'Website management includes',
  includes: [
    'Website hosting',
    'SSL and security',
    'Website maintenance',
    'Backups',
    'Technical support',
    'Performance monitoring',
    'Minor content changes',
    'Photo replacements',
    'Hours updates',
    'Price updates',
    'Service / menu updates',
    'Small text changes',
    'General website upkeep',
  ],
  motto: 'You run the business. We take care of the website.',
  note: 'For larger redesigns, new pages, major functionality or significant additions outside normal maintenance, we’ll provide a separate quote before beginning the work.',
};

export const addOns = [
  {
    id: 'photography',
    name: 'Photography',
    text: 'Professional photography created specifically for your business and digital presence.',
    label: 'Potential projects include',
    items: ['Business / location', 'Interior', 'Product', 'Food', 'Team / staff', 'Lifestyle imagery', 'Website photography', 'Social / content'],
    price: 'Custom quote based on project',
  },
  {
    id: 'videography',
    name: 'Videography',
    text: 'Video content designed to bring more movement, personality and atmosphere into your digital presence.',
    label: 'Potential projects include',
    items: ['Website hero videos', 'Business / location videos', 'Short-form promo content', 'Product / service videos', 'Social media content', 'Cinematic brand footage'],
    price: 'Custom quote based on project',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce',
    text: 'For businesses that need to sell products online, e-commerce can be added to the website project.',
    label: 'Depending on the business, this may include',
    items: ['Online storefront', 'Product pages', 'Product organization', 'Shopping cart', 'Checkout', 'Payment integration', 'Inventory configuration', 'Shipping configuration', 'Store setup'],
    price: 'Custom quote based on store size and requirements',
  },
  {
    id: 'social',
    name: 'Social Media Management',
    text: 'Ongoing social media for businesses that want a consistent, professional presence without managing it themselves.',
    label: 'Depending on the business, this may include',
    items: ['Content planning', 'Post design', 'Short-form video content', 'Caption writing', 'Scheduling and posting', 'Community engagement', 'Profile setup and optimization', 'Performance reporting'],
    price: 'Custom quote based on project',
  },
];

export const seo = {
  id: 'seo',
  name: 'SEO & Digital Growth',
  lede: 'Every Solace website should launch with a strong technical foundation for search.',
  included: 'Basic SEO setup is included with the website.',
  body: 'Businesses that want more ongoing search optimization can add additional SEO services separately.',
  label: 'Potential ongoing work can include',
  items: ['Search performance monitoring', 'Keyword research', 'Content optimization', 'Local search optimization', 'Technical SEO improvements', 'Search Console monitoring', 'Continued page optimization'],
  price: 'Custom quote based on goals and scope',
};

export const pricing = [
  { id: 'website', name: 'Website Design & Development', price: 'Setup $0', was: '$500' },
  { id: 'management', name: 'Website Management', price: '$100/month', was: '$150/month' },
  { id: 'photography', name: 'Photography', price: 'Custom quote' },
  { id: 'videography', name: 'Videography', price: 'Custom quote' },
  { id: 'ecommerce', name: 'E-Commerce', price: 'Custom quote' },
  { id: 'seo', name: 'Advanced SEO & Optimization', price: 'Custom quote' },
  { id: 'social', name: 'Social Media Management', price: 'Custom quote' },
];

// Options on the contact form
export const formOptions = [
  { id: 'website', label: 'Websites' },
  { id: 'content', label: 'Content (photo / video)' },
  { id: 'social', label: 'Social media content' },
  { id: 'unsure', label: 'Not sure yet' },
];
