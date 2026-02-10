'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  BarChart3,
  CheckCircle,
  Star,
  Loader,
} from 'lucide-react';
import Link from 'next/link';
import useAuthStore from '@/store/useAuthStore';
import { redirect, useRouter } from 'next/navigation';

function useTypingAnimation(text: string, speed = 100) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return displayText;
}

function useAnimatedCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

const stats = [
  { label: 'Orders Processed', value: 5000, suffix: '+' },
  { label: 'Active Vendors', value: 200, suffix: '+' },
  { label: 'Customers Served', value: 10000, suffix: '+' },
  { label: 'Items Tracked', value: 50000, suffix: '+' },
];

export default function HomePage() {
  const typedText = useTypingAnimation(
    'NightShift Inventory Management System',
    80
  );
  const [showTagline, setShowTagline] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const router = useRouter();
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    const taglineTimer = setTimeout(() => setShowTagline(true), 3000);
    const statsTimer = setTimeout(() => setShowStats(true), 4000);

    checkAuth();

    return () => {
      clearTimeout(taglineTimer);
      clearTimeout(statsTimer);
    };
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background gradient-bg'>
      {/* Hero Content */}
      <main className='relative'>
        {/* Parallax Background */}
        <div className='fixed inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90' />
          <motion.div
            className='absolute inset-0 opacity-10'
            style={{
              backgroundImage: `url('/futuristic-warehouse.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
          />

          <div className='absolute inset-0 opacity-5'>
            <div className='h-full w-full bg-[linear-gradient(rgba(0,188,212,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,188,212,0.2)_1px,transparent_1px)] bg-[size:60px_60px]' />
          </div>
        </div>

        {/* Hero Content */}
        <section className='relative z-10 min-h-screen flex items-center justify-center px-4 pt-20'>
          <div className='text-center max-w-6xl mx-auto'>
            <motion.h1
              className='text-4xl md:text-6xl lg:text-7xl font-bold font-mono text-primary mb-6 min-h-[1.2em] tracking-tight'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                textShadow: '0 0 20px rgba(0, 188, 212, 0.3)',
              }}
            >
              {typedText}
              <motion.span
                className='inline-block w-1 h-[0.8em] bg-primary ml-2'
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.h1>

            <motion.p
              className='text-xl md:text-2xl text-muted-foreground mb-12 font-medium tracking-wide'
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: showTagline ? 1 : 0,
                y: showTagline ? 0 : 20,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              Smart Inventory · Vendor Traceability · Customer Insights
            </motion.p>

            <motion.div
              className='flex flex-col sm:flex-row gap-6 justify-center mb-20'
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: showTagline ? 1 : 0,
                y: showTagline ? 0 : 30,
              }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
                <motion.button
                onClick={authUser? redirect('/dashboard'): redirect('/login')}
                  className='relative px-10 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg overflow-hidden professional-hover shadow-lg'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className='relative z-10'>Get Started</span>
                  <motion.div
                    className='absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20'
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>

              <motion.button
                className='relative px-10 py-4 border-2 border-secondary text-secondary rounded-lg font-semibold text-lg professional-hover hover:bg-secondary hover:text-secondary-foreground shadow-lg'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className='relative z-10'>Learn More</span>
              </motion.button>
            </motion.div>

            {/* Animated Stats Section */}
            <motion.div
              className='grid grid-cols-2 md:grid-cols-4 gap-8'
              initial={{ opacity: 0, y: 40 }}
              animate={{
                opacity: showStats ? 1 : 0,
                y: showStats ? 0 : 40,
              }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              {stats.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} delay={index * 0.2} />
              ))}
            </motion.div>

            {/* Spacing before footer */}
            <div className='h-auto'></div>

            {/* Scroll Indicator */}
            <motion.div
              className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10'
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            >
              <div className='w-6 h-10 border-2 border-primary/60 rounded-full flex justify-center backdrop-blur-sm'>
                <motion.div
                  className='w-1 h-3 bg-primary rounded-full mt-2'
                  animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
                  transition={{
                    duration: 2.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Overview Section */}
        <section className='relative z-10 py-24 px-4'>
          <div className='max-w-7xl mx-auto'>
            <motion.div
              className='text-center mb-16'
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className='text-4xl md:text-5xl font-bold font-mono text-primary mb-6'>
                Why Choose NightShift?
              </h2>
              <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
                Experience the future of inventory management with our
                comprehensive platform designed for modern businesses.
              </p>
            </motion.div>

            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {[
                {
                  icon: Shield,
                  title: 'Secure & Reliable',
                  description:
                    'Enterprise-grade security with complete audit trails and data protection.',
                },
                {
                  icon: Zap,
                  title: 'Lightning Fast',
                  description:
                    'Real-time updates and instant synchronization across all your operations.',
                },
                {
                  icon: Users,
                  title: 'Team Collaboration',
                  description:
                    'Role-based access control with seamless team workflow management.',
                },
                {
                  icon: BarChart3,
                  title: 'Advanced Analytics',
                  description:
                    'Comprehensive insights and reporting to drive data-driven decisions.',
                },
                {
                  icon: CheckCircle,
                  title: 'Easy Integration',
                  description:
                    'Seamlessly integrate with your existing tools and workflows.',
                },
                {
                  icon: Star,
                  title: '24/7 Support',
                  description:
                    'Round-the-clock customer support to keep your business running smoothly.',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className='p-8 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 professional-hover group'
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <feature.icon className='w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform duration-300' />
                  <h3 className='text-xl font-semibold text-foreground mb-3'>
                    {feature.title}
                  </h3>
                  <p className='text-muted-foreground'>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className='relative z-10 py-24 px-4'>
          <div className='max-w-4xl mx-auto text-center'>
            <motion.div
              className='p-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 backdrop-blur-sm'
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className='text-3xl md:text-4xl font-bold font-mono text-primary mb-6'>
                Ready to Transform Your Inventory Management?
              </h2>
              <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
                Join thousands of businesses already using NightShift to
                streamline their operations and boost efficiency.
              </p>
              <Link href={'/login'}>
                <motion.button
                  className='inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg professional-hover shadow-lg hover:cursor-pointer'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Free Trial
                  <ArrowRight className='w-5 h-5' />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ stat, delay }: { stat: (typeof stats)[0]; delay: number }) {
  const count = useAnimatedCounter(stat.value, 2000);

  return (
    <motion.div
      className='text-center p-6 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 professional-hover group'
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.03 }}
    >
      <motion.div
        className='text-3xl md:text-4xl font-bold font-mono text-primary mb-2 tracking-tight'
        key={count}
        style={{
          textShadow: '0 0 15px rgba(0, 188, 212, 0.2)',
        }}
      >
        {count.toLocaleString()}
        {stat.suffix}
      </motion.div>
      <div className='text-sm md:text-base text-muted-foreground font-medium tracking-wide'>
        {stat.label}
      </div>
    </motion.div>
  );
}
