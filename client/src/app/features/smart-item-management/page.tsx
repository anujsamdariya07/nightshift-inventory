'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SmartItemManagementPage() {
  return (
    <div className='min-h-screen bg-background'>
      <main className='pt-24 pb-16'>
        <div className='container mx-auto px-4'>
          {/* Breadcrumb */}
          <motion.nav
            className='mb-8'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href='/features'
              className='text-primary hover:text-primary/80 transition-colors'
            >
              ← Back to Features
            </Link>
          </motion.nav>

          {/* Header */}
          <motion.div
            className='text-center mb-16'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className='text-6xl mb-6'>📦</div>
            <h1 className='text-4xl md:text-6xl font-bold font-mono text-primary mb-6'>
              Smart Item Management
            </h1>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Intelligent inventory tracking with automated stock control,
              vendor relationships, and AI-powered categorization.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.section
            className='mb-16'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className='grid md:grid-cols-2 gap-8'>
              {[
                {
                  title: 'Automated Stock Tracking',
                  description:
                    'Real-time inventory levels with automatic reorder points and low-stock alerts',
                  features: [
                    'Real-time stock updates',
                    'Automatic reorder points',
                    'Low stock alerts',
                    'Batch tracking',
                  ],
                  icon: '📊',
                },
                {
                  title: 'Vendor Relationship Mapping',
                  description:
                    'Connect items to suppliers with pricing history and performance metrics',
                  features: [
                    'Supplier linking',
                    'Price history tracking',
                    'Performance analytics',
                    'Lead time monitoring',
                  ],
                  icon: '🔗',
                },
                {
                  title: 'Smart Categorization',
                  description:
                    'AI-powered item classification with custom taxonomies and attributes',
                  features: [
                    'AI categorization',
                    'Custom attributes',
                    'Hierarchical categories',
                    'Tag management',
                  ],
                  icon: '🧠',
                },
                {
                  title: 'Bulk Operations',
                  description:
                    'Import, export, and manage thousands of items with powerful bulk tools',
                  features: [
                    'CSV import/export',
                    'Bulk editing',
                    'Mass updates',
                    'Data validation',
                  ],
                  icon: '⚡',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className='bg-card/50 backdrop-blur-sm border border-border rounded-xl p-8 hover:border-primary/50 transition-all duration-300'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className='text-4xl mb-4'>{feature.icon}</div>
                  <h3 className='text-xl font-semibold text-foreground mb-3'>
                    {feature.title}
                  </h3>
                  <p className='text-muted-foreground mb-4'>
                    {feature.description}
                  </p>
                  <ul className='space-y-2'>
                    {feature.features.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className='flex items-center text-sm text-muted-foreground'
                      >
                        <div className='w-1.5 h-1.5 bg-primary rounded-full mr-3' />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Workflow Diagram */}
          <motion.section
            className='mb-16'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className='text-3xl font-bold text-foreground mb-8 text-center'>
              Item Management Workflow
            </h2>
            <div className='bg-card/30 backdrop-blur-sm border border-border rounded-xl p-8'>
              <div className='flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-6'>
                {[
                  {
                    step: '1',
                    title: 'Add Item',
                    desc: 'Create or import items with details',
                  },
                  {
                    step: '2',
                    title: 'Categorize',
                    desc: 'AI-powered smart categorization',
                  },
                  {
                    step: '3',
                    title: 'Link Vendors',
                    desc: 'Connect to suppliers and pricing',
                  },
                  {
                    step: '4',
                    title: 'Track Stock',
                    desc: 'Monitor levels and movements',
                  },
                  {
                    step: '5',
                    title: 'Optimize',
                    desc: 'Analyze and improve processes',
                  },
                ].map((item, index) => (
                  <div
                    key={item.step}
                    className='flex flex-col items-center text-center'
                  >
                    <motion.div
                      className='w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold mb-3'
                      whileHover={{ scale: 1.1 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: index * 0.2,
                      }}
                    >
                      {item.step}
                    </motion.div>
                    <h4 className='font-semibold text-foreground mb-1'>
                      {item.title}
                    </h4>
                    <p className='text-sm text-muted-foreground max-w-24'>
                      {item.desc}
                    </p>
                    {index < 4 && (
                      <motion.div
                        className='hidden md:block absolute w-8 h-0.5 bg-primary/50 mt-6'
                        style={{ left: `${(index + 1) * 20}%` }}
                        animate={{ scaleX: [0, 1] }}
                        transition={{ duration: 1, delay: index * 0.3 }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            className='text-center bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-12'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className='text-3xl font-bold text-foreground mb-4'>
              Transform Your Inventory Management
            </h2>
            <p className='text-lg text-muted-foreground mb-8 max-w-2xl mx-auto'>
              Experience intelligent item management with automated tracking and
              AI-powered insights.
            </p>
            <motion.button
              className='px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:neon-glow transition-all duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
