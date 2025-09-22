'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';
const quickLinks = [
  { name: 'Home', href: '/' },
  { name: 'Features', href: '/features' },
  { name: 'Workflow', href: '/workflow' },
  { name: 'Contact', href: '/contact' },
];

const socialLinks = [
  { name: 'Twitter', href: 'https://x.com/anujsamdariya07', icon: Twitter },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/anuj-samdariya-569162254/',
    icon: Linkedin,
  },
  { name: 'GitHub', href: 'https://github.com/anujsamdariya07/', icon: Github },
];

export function Footer() {
  return (
    <footer className='bg-card border-t border-border prevent-select'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Logo and Description */}
          <div className='col-span-1 md:col-span-2'>
            <motion.div className='text-2xl font-bold font-mono text-primary neon-text mb-4'>
              NightShift Inventory
            </motion.div>
            <p className='text-muted-foreground mb-4 max-w-md'>
              Smart Inventory Management System with Vendor Traceability and
              Customer Insights. Streamline your warehouse operations with our
              futuristic platform.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              Quick Links
            </h3>
            <ul className='space-y-2'>
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className='text-muted-foreground hover:text-primary transition-colors duration-300 hover:neon-text'
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className='text-lg font-semibold text-foreground mb-4'>
              Connect
            </h3>
            <div className='space-y-2 mb-4'>
              <p className='text-muted-foreground'>anujsamdariya07@gmail.com</p>
            </div>
            <div className='flex space-x-4'>
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target='_blank'
                  className='w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:neon-glow'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-muted-foreground text-sm'>
            © 2025 NightShift. All rights reserved.
          </p>
          <div className='flex space-x-6 mt-4 md:mt-0'>
            <Link
              href='#'
              className='text-muted-foreground hover:text-primary text-sm transition-colors'
            >
              Privacy Policy
            </Link>
            <Link
              href='#'
              className='text-muted-foreground hover:text-primary text-sm transition-colors'
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
