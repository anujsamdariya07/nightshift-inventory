'use client';

import { motion, easeOut } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Navbar } from '@/components/navbar';

const features = [
  {
    title: 'Organization-Centric Design',
    description:
      'Isolated ecosystem for each organization with complete data separation and customizable workflows.',
    icon: '🏢',
    details: [
      'Multi-tenant architecture',
      'Custom branding per organization',
      'Role-based access control',
      'Isolated data environments',
    ],
    color: 'primary',
  },
  {
    title: 'Smart Item Management',
    description:
      'Add/update items with automatic stock control, vendor linkage, and intelligent categorization.',
    icon: '📦',
    details: [
      'Automated stock tracking',
      'Vendor relationship mapping',
      'Smart categorization',
      'Bulk import/export tools',
    ],
    color: 'secondary',
  },
  {
    title: 'Update History (Audit Trail)',
    description:
      'Complete logs of all replenishments, orders, and system changes with detailed timestamps.',
    icon: '📋',
    details: [
      'Complete audit trails',
      'Real-time change tracking',
      'Historical data analysis',
      'Compliance reporting',
    ],
    color: 'accent',
  },
  {
    title: 'Vendor Management',
    description:
      'Unique validation checks for email/phone/GST, status control, and comprehensive replenishment history.',
    icon: '🤝',
    details: [
      'Unique vendor validation',
      'Status management system',
      'Replenishment tracking',
      'Performance analytics',
    ],
    color: 'chart-1',
  },
  {
    title: 'Customer Management',
    description:
      'Register customers, track multiple orders, and gain valuable customer insights and analytics.',
    icon: '👥',
    details: [
      'Customer registration system',
      'Order history tracking',
      'Behavioral analytics',
      'Loyalty program integration',
    ],
    color: 'chart-2',
  },
  {
    title: 'Employee Management',
    description:
      'Restricted access by roles including admin, stock manager, and sales with granular permissions.',
    icon: '👤',
    details: [
      'Role-based permissions',
      'Activity monitoring',
      'Performance tracking',
      'Team collaboration tools',
    ],
    color: 'chart-3',
  },
  {
    title: 'Order Management',
    description:
      'Place orders with auto-decrement stock, snapshot pricing, and complete order history tracking.',
    icon: '🛒',
    details: [
      'Automated stock updates',
      'Dynamic pricing snapshots',
      'Order lifecycle tracking',
      'Fulfillment automation',
    ],
    color: 'chart-4',
  },
  {
    title: 'Vendor–Customer–Item Traceability',
    description:
      'Two-way tracking system showing which vendor supplied which item and which customer ordered what.',
    icon: '🔗',
    details: [
      'End-to-end traceability',
      'Supply chain visibility',
      'Quality control tracking',
      'Recall management',
    ],
    color: 'chart-5',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      // ease: "easeOut" as const,
      ease: easeOut,
    },
  },
};

export default function FeaturesPage() {
  return (
    <div className='min-h-screen bg-background'>
      <Navbar />

      <main className='pt-24 pb-16'>
        {/* Header Section */}
        <section className='container mx-auto px-4 mb-16'>
          <motion.div
            className='text-center max-w-4xl mx-auto'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className='text-4xl md:text-6xl font-bold font-mono text-primary neon-text mb-6'>
              Powerful Features
            </h1>
            <p className='text-xl text-muted-foreground mb-8'>
              Comprehensive inventory management capabilities designed for
              modern businesses
            </p>
            <div className='w-24 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full' />
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className='container mx-auto px-4'>
          <motion.div
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
              />
            ))}
          </motion.div>
        </section>

        {/* Call to Action */}
        <section className='container mx-auto px-4 mt-20'>
          <motion.div
            className='text-center bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-12'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className='text-3xl md:text-4xl font-bold text-foreground mb-4'>
              Ready to Transform Your Inventory?
            </h2>
            <p className='text-lg text-muted-foreground mb-8 max-w-2xl mx-auto'>
              Experience the power of modern inventory management with all these
              features working seamlessly together.
            </p>
            <motion.button
              className='px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:neon-glow transition-all duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Free Trial
            </motion.button>
          </motion.div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  return (
    <motion.div
      className='group relative bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer'
      variants={cardVariants}
      whileHover={{
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* Neon glow effect on hover */}
      <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl' />

      {/* Card content */}
      <div className='relative z-10'>
        {/* Icon */}
        <motion.div
          className='text-4xl mb-4 group-hover:scale-110 transition-transform duration-300'
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {feature.icon}
        </motion.div>

        {/* Title */}
        <h3 className='text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300'>
          {feature.title}
        </h3>

        {/* Description */}
        <p className='text-muted-foreground mb-4 text-sm leading-relaxed'>
          {feature.description}
        </p>

        {/* Feature details */}
        <ul className='space-y-2 mb-6'>
          {feature.details.map((detail, detailIndex) => (
            <motion.li
              key={detail}
              className='flex items-center text-xs text-muted-foreground'
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + detailIndex * 0.05 }}
            >
              <div className='w-1.5 h-1.5 bg-primary rounded-full mr-2 group-hover:neon-glow' />
              {detail}
            </motion.li>
          ))}
        </ul>

        {/* Explore More button with dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <motion.button
              className='inline-flex items-center px-4 py-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 rounded-lg text-primary text-sm font-medium transition-all duration-300 group-hover:neon-glow'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore More
              <motion.svg
                className='ml-2 w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </motion.svg>
            </motion.button>
          </DialogTrigger>

          <DialogContent className='max-w-lg'>
            <DialogHeader>
              <DialogTitle className='text-2xl font-bold neon-text text-primary'>
                {feature.title}
              </DialogTitle>
            </DialogHeader>
            <p className='text-lg text-muted-foreground leading-relaxed'>
              {feature.description}
            </p>
            {feature.details.map((detail, detailIndex) => (
              <motion.li
                key={detail}
                className='flex items-center text-lg text-muted-foreground'
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + detailIndex * 0.05 }}
              >
                <div className='w-1.5 h-1.5 bg-primary rounded-full mr-2 group-hover:neon-glow' />
                {detail}
              </motion.li>
            ))}
          </DialogContent>
        </Dialog>

        {/* Hover indicator */}
        <motion.div
          className='absolute top-4 right-4 w-6 h-6 border-2 border-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'
          whileHover={{ scale: 1.2 }}
        >
          <motion.div
            className='w-2 h-2 bg-primary rounded-full'
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </motion.div>
      </div>

      {/* Background pattern */}
      <div className='absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300'>
        <div className='h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,188,212,0.3)_0%,transparent_50%)]' />
      </div>
    </motion.div>
  );
}
