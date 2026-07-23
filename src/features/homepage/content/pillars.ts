/**
 * THE SEVEN PILLARS — the homepage story. These are real PAR Technologys capabilities, not
 * placeholders. The homepage must read as one continuous journey through them, each pillar
 * its own world (its own accent, its own environment) while belonging to a single experience.
 */

export type Pillar = {
  id: string;
  index: string;
  title: string;
  lead: string;
  accent: string;
  capabilities: string[];
};

export const PILLARS: Pillar[] = [
  {
    id: 'intelligence',
    index: '01',
    title: 'We Build Intelligence',
    lead: 'Systems that reason, listen, see, and decide.',
    accent: '#6EE7F9',
    capabilities: [
      'AI Chatbots',
      'AI Voice Agents',
      'AI Business Assistants',
      'Machine Learning',
      'Generative AI',
      'Computer Vision',
      'Speech AI',
      'Predictive Analytics',
      'AI Automation',
    ],
  },
  {
    id: 'software',
    index: '02',
    title: 'We Build Software',
    lead: 'Products engineered to carry a business, not demo well.',
    accent: '#7AA2F7',
    capabilities: [
      'Custom Software',
      'Enterprise Platforms',
      'SaaS Products',
      'Web Applications',
      'Mobile Applications',
      'MVPs',
      'Product Engineering',
      'Enterprise Systems',
    ],
  },
  {
    id: 'transform',
    index: '03',
    title: 'We Transform Businesses',
    lead: 'The operational spine: what a company runs on every day.',
    accent: '#F0A868',
    capabilities: [
      'Workflow Automation',
      'CRM',
      'ERP',
      'HR Systems',
      'Inventory',
      'Project Management',
      'Business Process Automation',
      'Digital Transformation',
    ],
  },
  {
    id: 'experiences',
    index: '04',
    title: 'We Build Digital Experiences',
    lead: 'Interfaces people remember, and want to return to.',
    accent: '#C58AF9',
    capabilities: [
      'Luxury Websites',
      'Interactive Web Applications',
      'E-Commerce',
      'UI/UX',
      'Branding',
      'Product Design',
      'Motion Design',
      'Design Systems',
    ],
  },
  {
    id: 'cloud',
    index: '05',
    title: 'We Build Cloud Infrastructure',
    lead: 'The foundation everything above is allowed to depend on.',
    accent: '#8ED0F0',
    capabilities: [
      'Cloud',
      'AWS',
      'Azure',
      'Google Cloud',
      'APIs',
      'DevOps',
      'CI/CD',
      'Database Engineering',
      'Third-party Integrations',
    ],
  },
  {
    id: 'data',
    index: '06',
    title: 'We Build Data Platforms',
    lead: 'Turning what a business records into what it can act on.',
    accent: '#7FE0A8',
    capabilities: [
      'Dashboards',
      'Business Intelligence',
      'Analytics',
      'Data Engineering',
      'ETL',
      'Reporting',
      'Warehousing',
      'Migration',
    ],
  },
  {
    id: 'growth',
    index: '07',
    title: 'We Help Businesses Grow',
    lead: 'Engineering applied to demand, not just to product.',
    accent: '#F5D07A',
    capabilities: [
      'SEO',
      'AEO',
      'GEO',
      'PPC',
      'Marketing Automation',
      'Content Strategy',
      'Email Marketing',
      'Conversion Optimization',
    ],
  },
];

export const COMMISSION_EMAIL = 'commission@partechnologys.com';
