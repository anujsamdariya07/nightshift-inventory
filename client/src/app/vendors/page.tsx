"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"

// Mock data for demonstration
const mockVendors = [
  {
    id: "VEN-001",
    name: "Industrial Supply Co.",
    email: "contact@industrialsupply.com",
    phone: "+1-555-0123",
    gst: "GST123456789",
    status: "active",
    rating: 4.8,
    totalOrders: 156,
    totalValue: 245000,
    lastOrder: "2025-01-20",
    specialties: ["Bearings", "Bolts", "Industrial Tools"],
    replenishmentHistory: [
      { month: "Jan", value: 45000 },
      { month: "Feb", value: 52000 },
      { month: "Mar", value: 38000 },
      { month: "Apr", value: 61000 },
      { month: "May", value: 49000 },
      { month: "Jun", value: 55000 },
    ],
    performance: {
      onTimeDelivery: 95,
      qualityScore: 92,
      responseTime: 88,
    },
  },
  {
    id: "VEN-002",
    name: "TechFlow Components",
    email: "sales@techflow.com",
    phone: "+1-555-0456",
    gst: "GST987654321",
    status: "active",
    rating: 4.6,
    totalOrders: 89,
    totalValue: 189000,
    lastOrder: "2025-01-19",
    specialties: ["Hydraulics", "Pumps", "Gauges"],
    replenishmentHistory: [
      { month: "Jan", value: 32000 },
      { month: "Feb", value: 28000 },
      { month: "Mar", value: 35000 },
      { month: "Apr", value: 41000 },
      { month: "May", value: 29000 },
      { month: "Jun", value: 24000 },
    ],
    performance: {
      onTimeDelivery: 89,
      qualityScore: 94,
      responseTime: 91,
    },
  },
  {
    id: "VEN-003",
    name: "Safety First Equipment",
    email: "orders@safetyfirst.com",
    phone: "+1-555-0789",
    gst: "GST456789123",
    status: "pending",
    rating: 4.2,
    totalOrders: 67,
    totalValue: 98000,
    lastOrder: "2025-01-15",
    specialties: ["Safety Gear", "PPE", "Helmets"],
    replenishmentHistory: [
      { month: "Jan", value: 18000 },
      { month: "Feb", value: 22000 },
      { month: "Mar", value: 15000 },
      { month: "Apr", value: 19000 },
      { month: "May", value: 12000 },
      { month: "Jun", value: 12000 },
    ],
    performance: {
      onTimeDelivery: 82,
      qualityScore: 87,
      responseTime: 79,
    },
  },
  {
    id: "VEN-004",
    name: "AutoParts Direct",
    email: "supply@autopartsdirect.com",
    phone: "+1-555-0321",
    gst: "GST789123456",
    status: "inactive",
    rating: 3.9,
    totalOrders: 34,
    totalValue: 67000,
    lastOrder: "2025-01-10",
    specialties: ["Filters", "Brake Parts", "Engine Components"],
    replenishmentHistory: [
      { month: "Jan", value: 12000 },
      { month: "Feb", value: 8000 },
      { month: "Mar", value: 15000 },
      { month: "Apr", value: 11000 },
      { month: "May", value: 9000 },
      { month: "Jun", value: 12000 },
    ],
    performance: {
      onTimeDelivery: 76,
      qualityScore: 81,
      responseTime: 73,
    },
  },
]

const statusColors = {
  active: "accent",
  pending: "chart-2",
  inactive: "muted",
}

const filterOptions = [
  { label: "All Vendors", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Inactive", value: "inactive" },
]

export default function VendorsPage() {
  const [vendors, setVendors] = useState(mockVendors)
  const [filteredVendors, setFilteredVendors] = useState(mockVendors)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null)
  const [showNewVendorModal, setShowNewVendorModal] = useState(false)

  useEffect(() => {
    let filtered = vendors

    if (activeFilter !== "all") {
      filtered = filtered.filter((vendor) => vendor.status === activeFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredVendors(filtered)
  }, [activeFilter, searchTerm, vendors])

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
                Vendors Management
              </h1>
              <p className="text-lg text-muted-foreground">Manage supplier relationships and track performance</p>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:neon-glow transition-all duration-300"
                onClick={() => setShowNewVendorModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add Vendor
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
                placeholder="Search vendors, specialties, or contact info..."
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

        {/* Vendors Grid */}
        <section className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredVendors.map((vendor, index) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  index={index}
                  isSelected={selectedVendor === vendor.id}
                  onSelect={() => setSelectedVendor(selectedVendor === vendor.id ? null : vendor.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredVendors.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4">🏭</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No vendors found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </section>

        {/* Vendor Stats */}
        <section className="container mx-auto px-4 mt-16">
          <VendorStats vendors={filteredVendors} />
        </section>
      </main>

      {/* New Vendor Modal */}
      <NewVendorModal
        isOpen={showNewVendorModal}
        onClose={() => setShowNewVendorModal(false)}
        onSubmit={(newVendor) => {
          setVendors([newVendor, ...vendors])
          setShowNewVendorModal(false)
        }}
      />
    </div>
  )
}

function VendorCard({
  vendor,
  index,
  isSelected,
  onSelect,
}: {
  vendor: (typeof mockVendors)[0]
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

      {/* Vendor Header */}
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {vendor.name}
            </h3>
            <p className="text-sm text-muted-foreground">{vendor.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={vendor.status} />
            <RatingBadge rating={vendor.rating} />
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-primary">📧</span>
            {vendor.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-primary">📞</span>
            {vendor.phone}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-primary">🏢</span>
            {vendor.gst}
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2">Specialties</p>
          <div className="flex flex-wrap gap-1">
            {vendor.specialties.map((specialty) => (
              <span
                key={specialty}
                className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full border border-primary/30"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Orders</p>
            <p className="text-sm font-bold text-foreground">{vendor.totalOrders}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Value</p>
            <p className="text-sm font-bold text-primary">${vendor.totalValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="space-y-2 mb-4">
          <PerformanceBar label="On-time Delivery" value={vendor.performance.onTimeDelivery} color="accent" />
          <PerformanceBar label="Quality Score" value={vendor.performance.qualityScore} color="chart-1" />
          <PerformanceBar label="Response Time" value={vendor.performance.responseTime} color="secondary" />
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
                <h4 className="text-sm font-semibold text-foreground mb-3">Replenishment History</h4>
                <ReplenishmentChart data={vendor.replenishmentHistory} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <motion.button
            className="flex-1 py-2 px-4 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => e.stopPropagation()}
          >
            View Orders
          </motion.button>
          <motion.button
            className="flex-1 py-2 px-4 bg-secondary/10 text-secondary rounded-lg text-sm font-medium hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
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

function RatingBadge({ rating }: { rating: number }) {
  return (
    <motion.div
      className="flex items-center gap-1 px-2 py-1 bg-chart-2/20 text-chart-2 rounded-full border border-chart-2/30"
      whileHover={{ scale: 1.05 }}
    >
      <span className="text-xs">⭐</span>
      <span className="text-xs font-medium">{rating}</span>
    </motion.div>
  )
}

function PerformanceBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-xs font-medium text-foreground">{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
    </div>
  )
}

function ReplenishmentChart({ data }: { data: { month: string; value: number }[] }) {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="h-32 flex items-end justify-between gap-2">
      {data.map((item, index) => (
        <div key={item.month} className="flex-1 flex flex-col items-center">
          <motion.div
            className="w-full bg-primary/30 rounded-t-sm relative overflow-hidden"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
            initial={{ height: 0 }}
            animate={{ height: `${(item.value / maxValue) * 100}%` }}
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
  )
}

function VendorStats({ vendors }: { vendors: typeof mockVendors }) {
  const stats = {
    total: vendors.length,
    active: vendors.filter((v) => v.status === "active").length,
    pending: vendors.filter((v) => v.status === "pending").length,
    inactive: vendors.filter((v) => v.status === "inactive").length,
    totalValue: vendors.reduce((sum, vendor) => sum + vendor.totalValue, 0),
    avgRating: vendors.reduce((sum, vendor) => sum + vendor.rating, 0) / vendors.length,
  }

  return (
    <motion.div
      className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Vendor Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <StatCard label="Total Vendors" value={stats.total} color="primary" />
        <StatCard label="Active" value={stats.active} color="accent" />
        <StatCard label="Pending" value={stats.pending} color="chart-2" />
        <StatCard label="Inactive" value={stats.inactive} color="muted" />
        <StatCard label="Total Value" value={`$${(stats.totalValue / 1000).toFixed(0)}K`} color="primary" />
        <StatCard label="Avg Rating" value={stats.avgRating.toFixed(1)} color="chart-2" />
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

function NewVendorModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (vendor: any) => void
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gst: "",
    specialties: [""],
    status: "pending",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newVendor = {
      id: `VEN-${String(Date.now()).slice(-3)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      gst: formData.gst,
      status: formData.status,
      rating: 0,
      totalOrders: 0,
      totalValue: 0,
      lastOrder: new Date().toISOString().split("T")[0],
      specialties: formData.specialties.filter((s) => s.trim() !== ""),
      replenishmentHistory: [
        { month: "Jan", value: 0 },
        { month: "Feb", value: 0 },
        { month: "Mar", value: 0 },
        { month: "Apr", value: 0 },
        { month: "May", value: 0 },
        { month: "Jun", value: 0 },
      ],
      performance: {
        onTimeDelivery: 0,
        qualityScore: 0,
        responseTime: 0,
      },
    }

    onSubmit(newVendor)
    setFormData({
      name: "",
      email: "",
      phone: "",
      gst: "",
      specialties: [""],
      status: "pending",
    })
  }

  const addSpecialty = () => {
    setFormData({
      ...formData,
      specialties: [...formData.specialties, ""],
    })
  }

  const updateSpecialty = (index: number, value: string) => {
    const updatedSpecialties = formData.specialties.map((specialty, i) => (i === index ? value : specialty))
    setFormData({ ...formData, specialties: updatedSpecialties })
  }

  const removeSpecialty = (index: number) => {
    if (formData.specialties.length > 1) {
      setFormData({
        ...formData,
        specialties: formData.specialties.filter((_, i) => i !== index),
      })
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-card border border-border rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary">Add New Vendor</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Vendor Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <input
                    type="text"
                    placeholder="GST Number"
                    value={formData.gst}
                    onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                    className="px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-foreground">Specialties</h3>
                  <button
                    type="button"
                    onClick={addSpecialty}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-secondary/80 transition-colors"
                  >
                    Add Specialty
                  </button>
                </div>

                {formData.specialties.map((specialty, index) => (
                  <div key={index} className="flex gap-4">
                    <input
                      type="text"
                      placeholder="Specialty (e.g., Industrial Tools)"
                      value={specialty}
                      onChange={(e) => updateSpecialty(index, e.target.value)}
                      className="flex-1 px-3 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecialty(index)}
                      className="px-3 py-2 bg-destructive/20 text-destructive rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      disabled={formData.specialties.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-6 border border-border text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300"
                >
                  Add Vendor
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
