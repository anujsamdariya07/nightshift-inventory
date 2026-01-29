'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function OrganizationCentricDesignPage() {
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
            <div className='text-6xl mb-6'>🏢</div>
            <h1 className='text-4xl md:text-6xl font-bold font-mono text-primary mb-6'>
              Organization-Centric Design
            </h1>
            <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
              Complete data isolation and customizable workflows for each
              organization with enterprise-grade security and scalability.
            </p>
          </motion.div>

          {/* Key Benefits */}
          <motion.section
            className='mb-16'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className='text-3xl font-bold text-foreground mb-8 text-center'>
              Key Benefits
            </h2>
            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {[
                {
                  title: 'Multi-Tenant Architecture',
                  description:
                    'Secure data separation with shared infrastructure efficiency',
                  icon: '🏗️',
                },
                {
                  title: 'Custom Branding',
                  description:
                    'White-label solutions with organization-specific theming',
                  icon: '🎨',
                },
                {
                  title: 'Role-Based Access',
                  description:
                    'Granular permissions and user management per organization',
                  icon: '🔐',
                },
                {
                  title: 'Isolated Environments',
                  description:
                    'Complete data privacy with zero cross-contamination',
                  icon: '🛡️',
                },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  className='bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className='text-3xl mb-4'>{benefit.icon}</div>
                  <h3 className='text-lg font-semibold text-foreground mb-2'>
                    {benefit.title}
                  </h3>
                  <p className='text-muted-foreground text-sm'>
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Technical Features */}
          <motion.section
            className='mb-16'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className='text-3xl font-bold text-foreground mb-8 text-center'>
              Technical Features
            </h2>
            <div className='grid lg:grid-cols-2 gap-8'>
              <div className='bg-card/30 backdrop-blur-sm border border-border rounded-xl p-8'>
                <h3 className='text-xl font-semibold text-primary mb-4'>
                  Data Isolation
                </h3>
                <ul className='space-y-3 text-muted-foreground'>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0' />
                    Database-level tenant separation with encrypted schemas
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0' />
                    API-level access controls with tenant validation
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0' />
                    File storage isolation with organization-specific buckets
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0' />
                    Audit trails maintained separately per organization
                  </li>
                </ul>
              </div>
              <div className='bg-card/30 backdrop-blur-sm border border-border rounded-xl p-8'>
                <h3 className='text-xl font-semibold text-primary mb-4'>
                  Customization Options
                </h3>
                <ul className='space-y-3 text-muted-foreground'>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0' />
                    Custom workflows and approval processes
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0' />
                    Configurable user roles and permissions
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0' />
                    Organization-specific reporting and analytics
                  </li>
                  <li className='flex items-start'>
                    <div className='w-2 h-2 bg-secondary rounded-full mt-2 mr-3 flex-shrink-0' />
                    Custom fields and metadata per organization
                  </li>
                </ul>
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
              Ready to Scale Your Organization?
            </h2>
            <p className='text-lg text-muted-foreground mb-8 max-w-2xl mx-auto'>
              Experience enterprise-grade multi-tenancy with complete data
              isolation and unlimited customization.
            </p>
            <motion.button
              className='px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:neon-glow transition-all duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Free Trial
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
