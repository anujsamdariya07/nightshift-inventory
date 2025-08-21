"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import useAuthStore from "@/store/authStore"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Features", href: "/features" },
  { name: "Workflow", href: "/workflow" },
  { name: "Orders", href: "/orders" },
  { name: "Vendors", href: "/vendors" },
  { name: "Customers", href: "/customers" },
  { name: "Contact", href: "/contact" },
]

const authItems = [
  { name: "Home", href: "/" },
  { name: "Workflow", href: "/workflow" },
  { name: "Contact", href: "/contact" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const {authUser} = useAuthStore()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
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

            {/* Desktop Navigation Links */}
            {authUser && (
              <div className='hidden md:flex items-center space-x-8'>
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
              </div>
            )}

            {/* {!authUser && (
              <div className='hidden md:flex items-center space-x-8'>
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
              </div>
            )} */}
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

    {/* Login Button */}
    <Link
      href="/login"
      className="px-4 py-2 text-sm font-semibold rounded-xl border border-primary 
                 text-primary hover:bg-primary hover:text-background 
                 transition-colors duration-300 shadow-sm"
    >
      Login
    </Link>

    {/* Signup Button */}
    <Link
      href="/signup"
      className="px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-background 
                 hover:bg-primary/90 transition-colors duration-300 shadow-md"
    >
      Signup
    </Link>
  </div>
)}


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

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className='fixed inset-0 z-40 md:hidden'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className='absolute inset-0 bg-background/80 backdrop-blur-sm'
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              className='absolute top-20 left-4 right-4 bg-card border border-border rounded-lg shadow-lg p-4'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className='flex flex-col space-y-2'>
                {navItems.map((item, index) => (
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
