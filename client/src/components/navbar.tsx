'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader, Menu, X, LogOut, Loader2 } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import useCustomerStore from '@/store/useCustomerStore';
import useEmployeeStore from '@/store/useEmployeeStore';
import useItemStore from '@/store/useItemStore';
import useOrderStore from '@/store/useOrderStore';
import useVendorStore from '@/store/useVendorStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const navItems = [
  { name: 'Orders', href: '/orders' },
  { name: 'Vendors', href: '/vendors' },
  { name: 'Items', href: '/items' },
  { name: 'Customers', href: '/customers' },
  { name: 'Employees', href: '/employees' },
];

const authItems = [
  { name: 'Home', href: '/' },
  { name: 'Workflow', href: '/workflow' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { authUser, logout, loading } = useAuthStore();
  const { logout: customerLogout } = useCustomerStore();
  const { logout: employeeLogout } = useEmployeeStore();
  const { logout: itemLogout } = useItemStore();
  const { logout: orderLogout } = useOrderStore();
  const { logout: vendorLogout } = useVendorStore();

  const router = useRouter();

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [pathname]);

  if (!hydrated) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    );
  }

  return (
    <>
      {/* Navbar */}
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 prevent-select',
          scrolled
            ? 'bg-background/95 backdrop-blur-md py-2 shadow-lg shadow-primary/10'
            : 'bg-background/80 backdrop-blur-sm py-4'
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <Link href='/' className='flex items-center space-x-2'>
              <motion.div
                className='text-2xl font-bold font-mono text-primary hover:text-primary/80 transition-colors'
                whileHover={{ scale: 1.05 }}
              >
                NightShift Inventory
              </motion.div>
            </Link>

            {authUser && (
              <div className='hidden md:flex items-center space-x-6'>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'relative px-3 py-2 text-sm font-medium transition-all duration-300',
                      'hover:text-primary',
                      pathname === item.href
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    {item.name}
                    {pathname === item.href && (
                      <motion.div
                        className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary'
                        layoutId='activeLink'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                ))}

                {/* Greeting + Logout */}

                <div className='flex items-center border'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className='flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-accent transition-colors focus:outline-none'>
                        {/* Avatar Circle */}
                        <div className='h-8 w-8 flex items-center justify-center rounded-full bg-primary text-background font-semibold shadow'>
                          {authUser.name.charAt(0).toUpperCase()}
                        </div>
                        {/* Greeting */}
                        <span className='text-sm font-medium text-muted-foreground'>
                          Hi,{' '}
                          <span className='text-primary font-semibold'>
                            {authUser.name.split(' ')[0]}
                          </span>
                        </span>
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align='end'
                      className='w-48 rounded-xl shadow-lg border p-2'
                    >
                      <DropdownMenuLabel className='text-xs text-muted-foreground'>
                        Quick Links
                      </DropdownMenuLabel>

                      <DropdownMenuItem asChild>
                        <Link
                          href='/contact'
                          className='w-full cursor-pointer px-3 py-2 rounded-md hover:bg-accent text-sm'
                        >
                          Contact
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          href='/workflow'
                          className='w-full cursor-pointer px-3 py-2 rounded-md hover:bg-accent text-sm'
                        >
                          Workflow
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem asChild>
                        <button
                          onClick={() => setShowLogoutModal(true)}
                          className='w-full px-3 py-2 text-sm font-semibold rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors shadow'
                        >
                          Logout
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}

            {!authUser && (
              <div className='hidden md:flex items-center space-x-6'>
                {authItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'relative px-3 py-2 text-sm font-medium transition-all duration-300',
                      'hover:text-primary',
                      pathname === item.href
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    {item.name}
                    {pathname === item.href && (
                      <motion.div
                        className='absolute bottom-0 left-0 right-0 h-0.5 bg-primary'
                        layoutId='activeLink'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                ))}

                <Link
                  href='/login'
                  className='px-4 py-2 text-sm font-semibold rounded-xl border border-primary 
                             text-primary hover:bg-primary hover:text-background 
                             transition-colors duration-300 shadow-sm'
                >
                  Login
                </Link>
                <Link
                  href='/signup'
                  className='px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-background 
                             hover:bg-primary/90 transition-colors duration-300 shadow-md'
                >
                  Signup
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              className='md:hidden p-2 text-primary hover:text-primary/80 rounded-lg transition-colors'
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className='w-6 h-6' />
              ) : (
                <Menu className='w-6 h-6' />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className='fixed inset-0 z-40 md:hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className='absolute inset-0 bg-background/80 backdrop-blur-sm'
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              className='absolute top-20 left-4 right-4 bg-card border border-border rounded-lg shadow-lg p-4'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className='flex flex-col space-y-2'>
                {(authUser ? navItems : authItems).map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                        'hover:bg-primary/10 hover:text-primary',
                        pathname === item.href
                          ? 'text-primary bg-primary/5 border-l-2 border-primary'
                          : 'text-muted-foreground'
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                {!authUser ? (
                  <div className='flex flex-col space-y-2 mt-4'>
                    <Link
                      href='/login'
                      className='block px-4 py-3 text-sm font-semibold rounded-lg border border-primary text-primary hover:bg-primary hover:text-background transition-colors duration-200'
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href='/signup'
                      className='block px-4 py-3 text-sm font-semibold rounded-lg bg-primary text-background hover:bg-primary/90 transition-colors duration-200'
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Signup
                    </Link>
                  </div>
                ) : (
                  <div className='flex flex-col space-y-2 mt-4'>
                    <span className='px-4 text-sm font-medium text-muted-foreground'>
                      Hi,{' '}
                      <span className='text-primary'>
                        {authUser.name.split(' ')[0]}
                      </span>
                    </span>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className='px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-background 
                                 hover:bg-primary/90 transition-colors duration-300 shadow-md'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className='fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className='bg-card rounded-2xl shadow-lg p-6 w-[90%] max-w-sm border border-border'
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className='text-lg font-semibold text-foreground mb-2'>
                Confirm Logout
              </h2>
              <p className='text-sm text-muted-foreground mb-6'>
                Are you sure you want to logout? You’ll need to login again.
              </p>

              <div className='flex justify-end space-x-3'>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className='px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground 
                             hover:bg-muted transition-colors duration-200'
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await logout();
                    await customerLogout();
                    await employeeLogout();
                    await itemLogout();
                    await orderLogout();
                    await vendorLogout();
                    router.push('/');
                    setShowLogoutModal(false);
                  }}
                  disabled={loading}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg 
                             bg-destructive text-destructive-foreground 
                             hover:bg-destructive/90 transition-colors duration-200 ${
                               loading ? 'opacity-70 cursor-not-allowed' : ''
                             }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className='w-4 h-4 animate-spin' />
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className='w-4 h-4' /> Confirm
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
