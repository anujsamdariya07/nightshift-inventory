"use client"

import { motion } from "framer-motion"

const workflowSteps = [
  {
    id: "supplier",
    title: "Supplier Management",
    description: "Vendors register and supply items to inventory",
    icon: "🏭",
    details: [
      "Vendor registration & validation",
      "Supply agreements & contracts",
      "Quality control & compliance",
      "Delivery scheduling",
    ],
    position: { x: 0, y: 0 },
  },
  {
    id: "inventory",
    title: "Smart Inventory",
    description: "Central hub for all inventory operations",
    icon: "📦",
    details: ["Real-time stock tracking", "Automated reorder points", "Item categorization", "Audit trail maintenance"],
    position: { x: 1, y: 0 },
  },
  {
    id: "customer",
    title: "Customer Orders",
    description: "Customers place orders and receive products",
    icon: "🛒",
    details: [
      "Order placement & processing",
      "Stock allocation & reservation",
      "Fulfillment & shipping",
      "Customer satisfaction tracking",
    ],
    position: { x: 2, y: 0 },
  },
]

const connections = [
  { from: "supplier", to: "inventory", label: "Supply Items" },
  { from: "inventory", to: "customer", label: "Fulfill Orders" },
]

const subProcesses = [
  {
    title: "Employee Management",
    description: "Role-based access control for all operations",
    icon: "👥",
    color: "secondary",
  },
  {
    title: "Audit & Compliance",
    description: "Complete traceability and regulatory compliance",
    icon: "📋",
    color: "accent",
  },
  {
    title: "Analytics & Insights",
    description: "Data-driven decision making and reporting",
    icon: "📊",
    color: "chart-1",
  },
]

export default function WorkflowPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        {/* Header Section */}
        <section className="container mx-auto px-4 mb-16">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold font-mono text-primary neon-text mb-6">System Workflow</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Visualize how data flows through our comprehensive inventory management system
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary via-secondary to-accent mx-auto rounded-full" />
          </motion.div>
        </section>

        {/* Main Workflow Diagram */}
        <section className="container mx-auto px-4 mb-20">
          <div className="relative max-w-6xl mx-auto">
            {/* Workflow Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 relative">
              {workflowSteps.map((step, index) => (
                <WorkflowStep key={step.id} step={step} index={index} />
              ))}

              {/* <div className="hidden md:block">
                {connections.map((connection, index) => (
                  <AnimatedArrow key={`${connection.from}-${connection.to}`} connection={connection} index={index} />
                ))}
              </div> */}
            </div>

            {/* Mobile Arrows */}
            {/* <div className="md:hidden flex flex-col items-center space-y-4 mt-8">
              {connections.map((connection, index) => (
                <MobileArrow key={`mobile-${connection.from}-${connection.to}`} connection={connection} index={index} />
              ))}
            </div> */}
          </div>
        </section>

        {/* Wave Divider */}
        <WaveDivider />

        {/* Sub-processes Section */}
        <section className="container mx-auto px-4 mt-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Supporting Systems</h2>
            <p className="text-lg text-muted-foreground">
              Additional processes that enhance and support the main workflow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subProcesses.map((process, index) => (
              <SubProcessCard key={process.title} process={process} index={index} />
            ))}
          </div>
        </section>

        {/* Integration Flow */}
        <section className="container mx-auto px-4 mt-20">
          <motion.div
            className="bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-8">Complete Integration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-xl font-semibold text-primary mb-4">Real-time Data Flow</h4>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3 neon-glow" />
                    Instant inventory updates across all touchpoints
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-secondary rounded-full mr-3 neon-glow" />
                    Automated notifications and alerts
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3 neon-glow" />
                    Seamless integration with existing systems
                  </li>
                </ul>
              </div>
              <div className="relative">
                <motion.div
                  className="w-full h-48 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-xl flex items-center justify-center"
                  animate={{
                    background: [
                      "linear-gradient(135deg, rgba(0,188,212,0.2), rgba(156,39,176,0.2), rgba(118,255,3,0.2))",
                      "linear-gradient(135deg, rgba(156,39,176,0.2), rgba(118,255,3,0.2), rgba(0,188,212,0.2))",
                      "linear-gradient(135deg, rgba(118,255,3,0.2), rgba(0,188,212,0.2), rgba(156,39,176,0.2))",
                    ],
                  }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                >
                  <motion.div
                    className="text-4xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  >
                    ⚙️
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  )
}

function WorkflowStep({ step, index }: { step: (typeof workflowSteps)[0]; index: number }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
    >
      <motion.div
        className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
        whileHover={{ scale: 1.05, y: -5 }}
      >
        {/* Icon */}
        <motion.div
          className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform duration-300"
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {step.icon}
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-bold text-center text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
          {step.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-center mb-4 text-sm">{step.description}</p>

        {/* Details */}
        <ul className="space-y-2">
          {step.details.map((detail, detailIndex) => (
            <motion.li
              key={detail}
              className="flex items-center text-xs text-muted-foreground"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 + detailIndex * 0.1 }}
            >
              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 group-hover:neon-glow" />
              {detail}
            </motion.li>
          ))}
        </ul>

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
      </motion.div>
    </motion.div>
  )
}

function AnimatedArrow({ connection, index }: { connection: (typeof connections)[0]; index: number }) {
  return (
    <motion.div
      className="absolute top-1/2 transform -translate-y-1/2 z-10"
      style={{
        left: index === 0 ? "calc(33.33% + 2rem)" : "calc(66.66% + 2rem)",
        width: "calc(33.33% - 4rem)",
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 1 + index * 0.3 }}
    >
      <div className="relative flex items-center justify-center h-8">
        {/* Arrow line */}
        <motion.div
          className="h-0.5 bg-gradient-to-r from-primary to-secondary flex-1"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.5 + index * 0.3 }}
        />

        {/* Arrow head */}
        <motion.div
          className="w-0 h-0 border-l-4 border-l-secondary border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 2.5 + index * 0.3 }}
        />

        <motion.div
          className="absolute w-2 h-2 bg-primary rounded-full neon-glow"
          animate={{
            x: ["0%", "90%"],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: 3 + index * 0.5,
          }}
        />

        {/* Label */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap bg-background/80 px-2 py-1 rounded">
          {connection.label}
        </div>
      </div>
    </motion.div>
  )
}

function MobileArrow({ connection, index }: { connection: (typeof connections)[0]; index: number }) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1 + index * 0.3 }}
    >
      <motion.div
        className="w-0.5 h-8 bg-gradient-to-b from-primary to-secondary"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1, delay: 1.5 + index * 0.3 }}
      />
      <motion.div
        className="w-0 h-0 border-t-4 border-t-secondary border-l-2 border-l-transparent border-r-2 border-r-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 2.5 + index * 0.3 }}
      />
      <div className="text-xs text-muted-foreground mt-2">{connection.label}</div>
    </motion.div>
  )
}

function SubProcessCard({ process, index }: { process: (typeof subProcesses)[0]; index: number }) {
  return (
    <motion.div
      className="bg-card/30 backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{process.icon}</div>
      <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
        {process.title}
      </h4>
      <p className="text-sm text-muted-foreground">{process.description}</p>
    </motion.div>
  )
}

function WaveDivider() {
  return (
    <div className="relative w-full h-24 overflow-hidden">
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(0,188,212)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="rgb(156,39,176)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="rgb(118,255,3)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
          fill="url(#waveGradient)"
          animate={{
            d: [
              "M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z",
              "M0,40 C300,0 900,120 1200,40 L1200,120 L0,120 Z",
              "M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
    </div>
  )
}
