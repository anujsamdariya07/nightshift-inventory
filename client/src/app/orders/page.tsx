"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"

// Mock data for demonstration
const mockOrders = [
  {
    id: "ORD-001",
    customer: { name: "Acme Corp", email: "orders@acme.com", phone: "+1-555-0123" },
    items: [
      { name: "Industrial Bearings", quantity: 50, price: 25.99, stock: 120, maxStock: 200 },
      { name: "Steel Bolts M8", quantity: 200, price: 0.75, stock: 800, maxStock: 1000 },
    ],
    status: "processing",
    orderDate: "2025-01-20",
    total: 1449.5,
    priority: "high",
  },
  {
    id: "ORD-002",
    customer: { name: "TechFlow Solutions", email: "procurement@techflow.com", phone: "+1-555-0456" },
    items: [
      { name: "Hydraulic Pumps", quantity: 5, price: 299.99, stock: 15, maxStock: 25 },
      { name: "Pressure Gauges", quantity: 10, price: 45.5, stock: 35, maxStock: 50 },
    ],
    status: "shipped",
    orderDate: "2025-01-19",
    total: 1954.95,
    priority: "medium",
  },
  {
    id: "ORD-003",
    customer: { name: "BuildRight Construction", email: "supplies@buildright.com", phone: "+1-555-0789" },
    items: [
      { name: "Safety Helmets", quantity: 25, price: 35.0, stock: 75, maxStock: 100 },
      { name: "Work Gloves", quantity: 50, price: 12.99, stock: 150, maxStock: 200 },
    ],
    status: "delivered",
    orderDate: "2025-01-18",
    total: 1524.5,
    priority: "low",
  },
  {
    id: "ORD-004",
    customer: { name: "AutoParts Plus", email: "orders@autoparts.com", phone: "+1-555-0321" },
    items: [
      { name: "Engine Oil Filters", quantity: 100, price: 8.99, stock: 250, maxStock: 400 },
      { name: "Brake Pads", quantity: 40, price: 45.99, stock: 80, maxStock: 120 },
    ],
    status: "pending",
    orderDate: "2025-01-21",
    total: 2738.6,
    priority: "high",
  },
]

const statusColors = {
  pending: "chart-4",
  processing: "chart-1",
  shipped: "secondary",
  delivered: "accent",
}

const priorityColors = {
  low: "muted",
  medium: "chart-2",
  high: "chart-4",
}

const filterOptions = [
  { label: "All Orders", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState(mockOrders)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showNewOrderModal, setShowNewOrderModal] = useState(false)

  useEffect(() => {
    let filtered = orders

    if (activeFilter !== "all") {
      filtered = filtered.filter((order) => order.status === activeFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredOrders(filtered)
  }, [activeFilter, searchTerm, orders])

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
                Orders Management
              </h1>
              <p className="text-lg text-muted-foreground">Track and manage all customer orders in real-time</p>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:neon-glow transition-all duration-300"
                onClick={() => setShowNewOrderModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                New Order
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
                placeholder="Search orders, customers, or items..."
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

        {/* Orders Grid */}
        <section className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order, index) => (
                <OrderCard key={order.id} order={order} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredOrders.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No orders found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </motion.div>
          )}
        </section>

        {/* Stats Summary */}
        <section className="container mx-auto px-4 mt-16">
          <OrderStats orders={filteredOrders} />
        </section>
      </main>

      {/* New Order Modal */}
      <NewOrderModal
        isOpen={showNewOrderModal}
        onClose={() => setShowNewOrderModal(false)}
        onSubmit={(newOrder) => {
          setOrders([newOrder, ...orders])
          setShowNewOrderModal(false)
        }}
      />
    </div>
  )
}

function OrderCard({ order, index }: { order: (typeof mockOrders)[0]; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      layout
    >
      {/* Order Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {order.id}
          </h3>
          <p className="text-sm text-muted-foreground">{order.customer.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          <PriorityBadge priority={order.priority} />
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Order Date</p>
          <p className="text-sm font-medium text-foreground">{order.orderDate}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Amount</p>
          <p className="text-sm font-bold text-primary">${order.total.toFixed(2)}</p>
        </div>
      </div>

      {/* Items Preview */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Items ({order.items.length})</p>
        <div className="space-y-2">
          {order.items.slice(0, expanded ? order.items.length : 2).map((item, itemIndex) => (
            <ItemRow key={itemIndex} item={item} />
          ))}
        </div>
      </div>

      {/* Expand/Collapse Button */}
      {order.items.length > 2 && (
        <motion.button
          className="w-full py-2 text-sm text-primary hover:text-primary/80 transition-colors duration-300"
          onClick={() => setExpanded(!expanded)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {expanded ? "Show Less" : `Show ${order.items.length - 2} More Items`}
        </motion.button>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <motion.button
          className="flex-1 py-2 px-4 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Details
        </motion.button>
        <motion.button
          className="flex-1 py-2 px-4 bg-secondary/10 text-secondary rounded-lg text-sm font-medium hover:bg-secondary hover:text-secondary-foreground transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Update Status
        </motion.button>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
    </motion.div>
  )
}

function ItemRow({ item }: { item: (typeof mockOrders)[0]["items"][0] }) {
  const stockPercentage = (item.stock / item.maxStock) * 100

  return (
    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">{item.name}</p>
        <p className="text-xs text-muted-foreground">
          Qty: {item.quantity} × ${item.price}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-bold text-foreground">${(item.quantity * item.price).toFixed(2)}</p>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  stockPercentage > 50 ? "bg-accent" : stockPercentage > 25 ? "bg-chart-2" : "bg-chart-4"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${stockPercentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{item.stock}</span>
          </div>
        </div>
      </div>
    </div>
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

function PriorityBadge({ priority }: { priority: string }) {
  const colorClass = priorityColors[priority as keyof typeof priorityColors] || "muted"

  return (
    <motion.span
      className={`px-2 py-1 text-xs font-medium rounded-full bg-${colorClass}/20 text-${colorClass} border border-${colorClass}/30`}
      whileHover={{ scale: 1.05 }}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </motion.span>
  )
}

function OrderStats({ orders }: { orders: typeof mockOrders }) {
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    totalValue: orders.reduce((sum, order) => sum + order.total, 0),
  }

  return (
    <motion.div
      className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Order Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <StatCard label="Total Orders" value={stats.total} color="primary" />
        <StatCard label="Pending" value={stats.pending} color="chart-4" />
        <StatCard label="Processing" value={stats.processing} color="chart-1" />
        <StatCard label="Shipped" value={stats.shipped} color="secondary" />
        <StatCard label="Delivered" value={stats.delivered} color="accent" />
        <StatCard label="Total Value" value={`$${stats.totalValue.toFixed(0)}`} color="primary" />
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

function NewOrderModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (order: any) => void
}) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    items: [{ name: "", quantity: 1, price: 0 }],
    priority: "medium",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newOrder = {
      id: `ORD-${String(Date.now()).slice(-3)}`,
      customer: {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
      },
      items: formData.items.map((item) => ({
        ...item,
        stock: Math.floor(Math.random() * 200) + 50,
        maxStock: 300,
      })),
      status: "pending",
      orderDate: new Date().toISOString().split("T")[0],
      total: formData.items.reduce((sum, item) => sum + item.quantity * item.price, 0),
      priority: formData.priority,
    }

    onSubmit(newOrder)
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      items: [{ name: "", quantity: 1, price: 0 }],
      priority: "medium",
    })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", quantity: 1, price: 0 }],
    })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = formData.items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    setFormData({ ...formData, items: updatedItems })
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
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
              <h2 className="text-2xl font-bold text-primary">Create New Order</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Customer Name"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Customer Email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    required
                  />
                </div>
                <input
                  type="tel"
                  placeholder="Customer Phone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  required
                />
              </div>

              {/* Items */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-foreground">Order Items</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-secondary/80 transition-colors"
                  >
                    Add Item
                  </button>
                </div>

                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-background/50 rounded-lg">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={item.name}
                      onChange={(e) => updateItem(index, "name", e.target.value)}
                      className="px-3 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground focus:border-primary"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                      className="px-3 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground focus:border-primary"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => updateItem(index, "price", Number.parseFloat(e.target.value) || 0)}
                      className="px-3 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="px-3 py-2 bg-destructive/20 text-destructive rounded hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      disabled={formData.items.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
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
                  Create Order
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
