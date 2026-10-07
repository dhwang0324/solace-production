import photographyFighter from '../assets/services/photography-fighter.webp';

// Services page content and pricing (supplied by the user — don't change prices or wording without asking).
// `id` is also used by the contact form: /contact/?service=<id> ticks that option.

export const website = {
  id: 'website',
  name: 'Website Design & Development',
  price: { lead: 'Starting at', amount: '$500' },
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
  price: { amount: '$100', per: '/month' },
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
    photo: { src: photographyFighter, alt: 'A fighter in white gloves and red-and-white shorts moving inside a blue-lit cage during a bout' },
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
    id: 'features',
    name: 'Additional Website Features',
    text: 'Some businesses need more than a standard informational website.',
    label: 'Quoted based on the project, such as',
    items: ['Additional pages', 'Advanced forms', 'Booking integrations', 'Menu systems', 'Galleries', 'Custom interactive features', 'Third-party integrations', 'Advanced animations', 'Specialized functionality'],
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
  { id: 'website', name: 'Website Design & Development', price: 'Starting at $500' },
  { id: 'management', name: 'Website Management', price: '$100/month' },
  { id: 'photography', name: 'Photography', price: 'Custom quote' },
  { id: 'videography', name: 'Videography', price: 'Custom quote' },
  { id: 'ecommerce', name: 'E-Commerce', price: 'Custom quote' },
  { id: 'seo', name: 'Advanced SEO & Optimization', price: 'Custom quote' },
  { id: 'features', name: 'Additional Features & Custom Work', price: 'Custom quote' },
];

// Options on the contact form
export const formOptions = [
  { id: 'website', label: 'Website' },
  { id: 'management', label: 'Website management' },
  { id: 'photography', label: 'Photography' },
  { id: 'videography', label: 'Videography' },
  { id: 'ecommerce', label: 'E-commerce' },
  { id: 'seo', label: 'SEO' },
  { id: 'features', label: 'Custom features' },
  { id: 'unsure', label: 'Not sure yet' },
];
