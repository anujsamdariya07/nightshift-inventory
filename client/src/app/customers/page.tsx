"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import useAuthStore from "@/store/useAuthStore"
import { useRouter } from "next/navigation"

// Mock data for demonstration
const mockCustomers = [
  {
    id: "CUS-001",
    name: "Acme Corporation",
    email: "orders@acme.com",
    phone: "555-0123",
    address: "123 Industrial Ave, Tech City, TC 12345",
    status: "active",
    registrationDate: "2024-03-15",
    totalOrders: 45,
    totalSpent: 125000,
    lastOrder: "2025-01-20",
    orderFrequency: "weekly",
    preferredCategories: ["Industrial Tools", "Bearings", "Safety Equipment"],
    orderHistory: [
      { month: "Jul", orders: 6, value: 15000 },
      { month: "Aug", orders: 8, value: 18000 },
      { month: "Sep", orders: 5, value: 12000 },
      { month: "Oct", orders: 9, value: 22000 },
      { month: "Nov", orders: 7, value: 16000 },
      { month: "Dec", orders: 10, value: 25000 },
    ],
    satisfaction: 4.8,
    loyaltyTier: "platinum",
  },
  {
    id: "CUS-002",
    name: "TechFlow Solutions",
    email: "procurement@techflow.com",
    phone: "555-0456",
    address: "456 Business Blvd, Innovation Park, IP 67890",
    status: "active",
    registrationDate: "2024-05-22",
    totalOrders: 32,
    totalSpent: 89000,
    lastOrder: "2025-01-19",
    orderFrequency: "bi-weekly",
    preferredCategories: ["Hydraulics", "Pumps", "Electronic Components"],
    orderHistory: [
      { month: "Jul", orders: 4, value: 12000 },
      { month: "Aug", orders: 5, value: 14000 },
      { month: "Sep", orders: 3, value: 8000 },
      { month: "Oct", orders: 6, value: 16000 },
      { month: "Nov", orders: 4, value: 11000 },
      { month: "Dec", orders: 7, value: 18000 },
    ],
    satisfaction: 4.6,
    loyaltyTier: "gold",
  },
  {
    id: "CUS-003",
    name: "BuildRight Construction",
    email: "supplies@buildright.com",
    phone: "555-0789",
    address: "789 Construction Way, Builder City, BC 54321",
    status: "active",
    registrationDate: "2024-01-10",
    totalOrders: 67,
    totalSpent: 156000,
    lastOrder: "2025-01-18",
    orderFrequency: "monthly",
    preferredCategories: ["Safety Gear", "Construction Tools", "Hardware"],
    orderHistory: [
      { month: "Jul", orders: 8, value: 20000 },
      { month: "Aug", orders: 10, value: 24000 },
      { month: "Sep", orders: 6, value: 15000 },
      { month: "Oct", orders: 12, value: 28000 },
      { month: "Nov", orders: 9, value: 21000 },
      { month: "Dec", orders: 11, value: 26000 },
    ],
    satisfaction: 4.4,
    loyaltyTier: "platinum",
  },
  {
    id: "CUS-004",
    name: "AutoParts Plus",
    email: "orders@autoparts.com",
    phone: "555-0321",
    address: "321 Auto Street, Motor Town, MT 98765",
    status: "pending",
    registrationDate: "2024-11-05",
    totalOrders: 12,
    totalSpent: 34000,
    lastOrder: "2025-01-15",
    orderFrequency: "monthly",
    preferredCategories: ["Auto Parts", "Filters", "Brake Components"],
    orderHistory: [
      { month: "Jul", orders: 0, value: 0 },
      { month: "Aug", orders: 0, value: 0 },
      { month: "Sep", orders: 0, value: 0 },
      { month: "Oct", orders: 0, value: 0 },
      { month: "Nov", orders: 4, value: 12000 },
      { month: "Dec", orders: 8, value: 22000 },
    ],
    satisfaction: 4.2,
    loyaltyTier: "silver",
  },
]

const statusColors = {
  active: "accent",
  pending: "chart-2",
  inactive: "muted",
}

const tierColors = {
  platinum: "primary",
  gold: "chart-2",
  silver: "muted",
  bronze: "chart-4",
}

const filterOptions = [
  { label: "All Customers", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Inactive", value: "inactive" },
]

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [filteredCustomers, setFilteredCustomers] = useState(mockCustomers)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false)

  useEffect(() => {
    let filtered = customers

    if (activeFilter !== "all") {
      filtered = filtered.filter((customer) => customer.status === activeFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.preferredCategories.some((category) => category.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredCustomers(filtered)
  }, [activeFilter, searchTerm, customers])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Header Section */}
        <section className="container mx-auto px-4 mb-8">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold font-mono text-primary neon-text mb-2">
                Customers Management
              </h1>
              <p className="text-lg text-muted-foreground">Track customer relationships and analyze buying patterns</p>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:neon-glow transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNewCustomerModal(true)}
              >
                Add Customer
              </motion.button>
              <motion.button
                className="px-6 py-3 border border-secondary text-secondary rounded-lg font-semibold hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Filters
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Search and Filters */}
        <section className="container mx-auto px-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <input
                type="text"
                placeholder="+91-Search customers, categories, or contact info..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
            </motion.div>

            {/* Filter Buttons */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0, x: 20, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: 20, width: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {filterOptions.map((option) => (
                    <motion.button
                      key={option.value}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                        activeFilter === option.value
                          ? "bg-primary text-primary-foreground neon-glow"
                          : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                      }`}
                      onClick={() => setActiveFilter(option.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Customers Grid */}
        <section className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredCustomers.map((customer, index) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  index={index}
                  isSelected={selectedCustomer === customer.id}
                  onSelect={() => setSelectedCustomer(selectedCustomer === customer.id ? null : customer.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredCustomers.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No customers found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </section>

        {/* Customer Stats */}
        <section className="container mx-auto px-4 mt-16">
          <CustomerStats customers={filteredCustomers} />
        </section>
      </main>

      {/* New Customer Modal */}
      <AnimatePresence>
        {showNewCustomerModal && (
          <NewCustomerModal
            onClose={() => setShowNewCustomerModal(false)}
            onSubmit={(newCustomer) => {
              setCustomers([...customers, newCustomer])
              setShowNewCustomerModal(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function CustomerCard({
  customer,
  index,
  isSelected,
  onSelect,
}: {
  customer: (typeof mockCustomers)[0]
  index: number
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <motion.div
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={onSelect}
      layout
    >
      {/* Neon glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />

      {/* Customer Header */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {customer.name}
            </h3>
            <p className="text-sm text-muted-foreground">{customer.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={customer.status} />
            <LoyaltyBadge tier={customer.loyaltyTier} />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-primary">📧</span>
            {customer.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-primary">📞</span>
            +91-{customer.phone}
          </div>
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-primary">📍</span>
            <span className="flex-1">{customer.address}</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Orders</p>
            <p className="text-sm font-bold text-foreground">{customer.totalOrders}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="text-sm font-bold text-primary">${customer.totalSpent.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Order</p>
            <p className="text-sm font-medium text-foreground">{customer.lastOrder}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Satisfaction</p>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-chart-2">⭐ {customer.satisfaction}</span>
            </div>
          </div>
        </div>

        {/* Preferred Categories */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Preferred Categories</p>
          <div className="flex flex-wrap gap-1">
            {customer.preferredCategories.slice(0, 2).map((category) => (
              <span
                key={category}
                className="px-2 py-1 text-xs bg-secondary/20 text-secondary rounded-full border border-secondary/30"
              >
                {category}
              </span>
            ))}
            {customer.preferredCategories.length > 2 && (
              <span className="px-2 py-1 text-xs bg-muted/20 text-muted-foreground rounded-full border border-muted/30">
                +{customer.preferredCategories.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="border-t border-border pt-4 mt-4">
                <h4 className="text-sm font-semibold text-foreground mb-3">Order History</h4>
                <OrderHistoryChart data={customer.orderHistory} />
                <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Order Frequency: </span>
                    <span className="text-foreground font-medium">{customer.orderFrequency}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Member Since: </span>
                    <span className="text-foreground font-medium">{customer.registrationDate}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <motion.button
            type="button"
            className="flex-1 py-2 px-4 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground hover:neon-glow transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            View Orders
          </motion.button>
          <motion.button
            type="button"
            className="flex-1 py-2 px-4 bg-secondary/10 text-secondary rounded-lg text-sm font-medium hover:bg-secondary hover:text-secondary-foreground hover:neon-glow transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            Contact
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colorClass = statusColors[status as keyof typeof statusColors] || "muted"

  return (
    <motion.span
      className={`px-2 py-1 text-xs font-medium rounded-full bg-${colorClass}/20 text-${colorClass} border border-${colorClass}/30`}
      whileHover={{ scale: 1.05 }}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </motion.span>
  )
}

function LoyaltyBadge({ tier }: { tier: string }) {
  const colorClass = tierColors[tier as keyof typeof tierColors] || "muted"

  return (
    <motion.span
      className={`px-2 py-1 text-xs font-medium rounded-full bg-${colorClass}/20 text-${colorClass} border border-${colorClass}/30`}
      whileHover={{ scale: 1.05 }}
    >
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </motion.span>
  )
}

function OrderHistoryChart({ data }: { data: { month: string; orders: number; value: number }[] }) {
  const maxOrders = Math.max(...data.map((d) => d.orders))
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="space-y-4">
      {/* Orders Chart */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Orders per Month</p>
        <div className="h-20 flex items-end justify-between gap-1">
          {data.map((item, index) => (
            <div key={`orders-${item.month}`} className="flex-1 flex flex-col items-center">
              <motion.div
                className="w-full bg-primary/30 rounded-t-sm relative overflow-hidden"
                style={{ height: `${item.orders > 0 ? Math.max((item.orders / maxOrders) * 100, 10) : 0}%` }}
                initial={{ height: 0 }}
                animate={{
                  height: `${item.orders > 0 ? Math.max((item.orders / maxOrders) * 100, 10) : 0}%`,
                }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <motion.div
                  className="absolute inset-0 bg-primary"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  style={{ transformOrigin: "bottom" }}
                />
              </motion.div>
              <span className="text-xs text-muted-foreground mt-1">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Value Chart */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Value per Month ($)</p>
        <div className="h-20 flex items-end justify-between gap-1">
          {data.map((item, index) => (
            <div key={`value-${item.month}`} className="flex-1 flex flex-col items-center">
              <motion.div
                className="w-full bg-secondary/30 rounded-t-sm relative overflow-hidden"
                style={{ height: `${item.value > 0 ? Math.max((item.value / maxValue) * 100, 10) : 0}%` }}
                initial={{ height: 0 }}
                animate={{
                  height: `${item.value > 0 ? Math.max((item.value / maxValue) * 100, 10) : 0}%`,
                }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              >
                <motion.div
                  className="absolute inset-0 bg-secondary"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  style={{ transformOrigin: "bottom" }}
                />
              </motion.div>
              <span className="text-xs text-muted-foreground mt-1">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CustomerStats({ customers }: { customers: typeof mockCustomers }) {
  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    pending: customers.filter((c) => c.status === "pending").length,
    totalRevenue: customers.reduce((sum, customer) => sum + customer.totalSpent, 0),
    avgOrderValue:
      customers.reduce((sum, customer) => sum + customer.totalSpent, 0) /
      customers.reduce((sum, customer) => sum + customer.totalOrders, 0),
    avgSatisfaction: customers.reduce((sum, customer) => sum + customer.satisfaction, 0) / customers.length,
  }

  return (
    <motion.div
      className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Customer Analytics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <StatCard label="Total Customers" value={stats.total} color="primary" />
        <StatCard label="Active" value={stats.active} color="accent" />
        <StatCard label="Pending" value={stats.pending} color="chart-2" />
        <StatCard label="Total Revenue" value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`} color="primary" />
        <StatCard label="Avg Order Value" value={`$${stats.avgOrderValue.toFixed(0)}`} color="secondary" />
        <StatCard label="Avg Satisfaction" value={stats.avgSatisfaction.toFixed(1)} color="chart-2" />
      </div>
    </motion.div>
  )
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <motion.div
      className="text-center p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-all duration-300"
      whileHover={{ scale: 1.05, y: -2 }}
    >
      <motion.div
        className={`text-2xl font-bold font-mono text-${color} neon-text mb-1`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        {value}
      </motion.div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </motion.div>
  )
}

function NewCustomerModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (customer: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    preferredCategories: [] as string[],
  })

  const categoryOptions = [
    "Industrial Tools",
    "Bearings",
    "Safety Equipment",
    "Hydraulics",
    "Pumps",
    "Electronic Components",
    "Safety Gear",
    "Construction Tools",
    "Hardware",
    "Auto Parts",
    "Filters",
    "Brake Components",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newCustomer = {
      id: `CUS-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
      ...formData,
      status: "pending",
      registrationDate: new Date().toISOString().split("T")[0],
      totalOrders: 0,
      totalSpent: 0,
      lastOrder: "Never",
      orderFrequency: "monthly",
      orderHistory: [],
      satisfaction: 0,
      loyaltyTier: "bronze",
    }

    onSubmit(newCustomer)
  }

  const toggleCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredCategories: prev.preferredCategories.includes(category)
        ? prev.preferredCategories.filter((c) => c !== category)
        : [...prev.preferredCategories, category],
    }))
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-card border border-border rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">Add New Customer</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Company Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                placeholder="+91-Enter company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                placeholder="+91-company@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                placeholder="+91-555-0123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Address *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                placeholder="+91-123 Business St, City, State 12345"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Preferred Categories</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {categoryOptions.map((category) => (
                <motion.button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all duration-300 ${
                    formData.preferredCategories.includes(category)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <motion.button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-border text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:neon-glow transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Customer
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
