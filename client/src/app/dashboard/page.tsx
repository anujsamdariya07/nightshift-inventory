'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  Users,
  ShoppingCart,
  Truck,
  UserCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  Eye,
  Activity,
  IndianRupee,
  Calendar,
  Bell,
  X,
} from 'lucide-react';
import Link from 'next/link';
import useOrderStore, { Order } from '@/store/useOrderStore';
import useEmployeeStore, { Employee } from '@/store/useEmployeeStore';
import useItemStore, { Item } from '@/store/useItemStore';
import useVendorStore, { Vendor } from '@/store/useVendorStore';
import useCustomerStore, { Customer } from '@/store/useCustomerStore';
import { Navbar } from '@/components/navbar';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

const InventoryDashboard = () => {
  // Sample data - matches your existing structure
  const [dashboardData, setDashboardData] = useState<{
    employees: Employee[];
    orders: Order[];
    items: Item[];
    vendors: Vendor[];
    customers: Customer[];
  }>({
    employees: [
      {
        id: 'emp-1',
        orgId: 'org-1',
        employeeId: 'E001',
        name: 'John Smith',
        email: 'john.smith@company.com',
        password: 'hashed-password',
        mustChangePassword: false,
        role: 'MANAGER',
        department: 'Warehouse',
        phone: '+91-9876543210',
        location: 'New Delhi',
        performance: [],
        experience: 8,
        salary: 75000,
        status: 'ACTIVE',
        attendance: 95,
        hireDate: '2017-06-12',
        yearsOfService: 8,
        manager: null,
        skills: ['Inventory Management', 'Leadership'],
        messages: [],
      },
      {
        id: 'emp-2',
        orgId: 'org-1',
        employeeId: 'E002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        password: 'hashed-password',
        mustChangePassword: false,
        role: 'WORKER',
        department: 'Inventory',
        phone: '+91-9988776655',
        location: 'Mumbai',
        performance: [],
        experience: 3,
        salary: 40000,
        status: 'ACTIVE',
        attendance: 89,
        hireDate: '2022-02-10',
        yearsOfService: 3,
        manager: null,
        skills: ['Data Entry', 'Stock Auditing'],
        messages: [],
      },
      {
        id: 'emp-3',
        orgId: 'org-1',
        employeeId: 'E003',
        name: 'Mike Davis',
        email: 'mike.davis@company.com',
        password: 'hashed-password',
        mustChangePassword: false,
        role: 'WORKER',
        department: 'Shipping',
        phone: '+91-9777665544',
        location: 'Chennai',
        performance: [],
        experience: 2,
        salary: 32000,
        status: 'ACTIVE',
        attendance: 92,
        hireDate: '2023-07-15',
        yearsOfService: 2,
        manager: null,
        skills: ['Logistics', 'Packing'],
        messages: [],
      },
      {
        id: 'emp-4',
        orgId: 'org-1',
        employeeId: 'E004',
        name: 'Emily Chen',
        email: 'emily.chen@company.com',
        password: 'hashed-password',
        mustChangePassword: true,
        role: 'ADMIN',
        department: 'Quality',
        phone: '+91-9666554433',
        location: 'Bangalore',
        performance: [],
        experience: 6,
        salary: 60000,
        status: 'INACTIVE',
        attendance: 70,
        hireDate: '2019-05-01',
        yearsOfService: 6,
        manager: null,
        skills: ['Quality Assurance', 'Auditing'],
        messages: [],
      },
    ],
    orders: [
      {
        id: 'order-1001',
        orgId: 'org-1',
        employeeId: 'emp-1',
        employeeName: 'John Smith',
        customerId: 'cust-1',
        customerName: 'ABC Corporation',
        orderId: 'ORD-1001',
        items: [
          {
            itemId: 'item-1',
            itemName: 'Wireless Mouse',
            quantity: 2,
            priceAtOrder: 25.99,
          },
          {
            itemId: 'item-3',
            itemName: 'USB Cable',
            quantity: 3,
            priceAtOrder: 12.99,
          },
        ],
        totalAmount: 1250,
        status: 'PENDING',
        orderDate: new Date('2025-09-20'),
        deadline: new Date('2025-09-25'),
        notes: 'Urgent delivery requested',
      },
      {
        id: 'order-1002',
        orgId: 'org-1',
        employeeId: 'emp-2',
        employeeName: 'Sarah Johnson',
        customerId: 'cust-2',
        customerName: 'XYZ Limited',
        orderId: 'ORD-1002',
        items: [
          {
            itemId: 'item-2',
            itemName: 'Office Chair',
            quantity: 1,
            priceAtOrder: 199.99,
          },
          {
            itemId: 'item-5',
            itemName: 'Desk Lamp',
            quantity: 2,
            priceAtOrder: 34.99,
          },
        ],
        totalAmount: 890,
        status: 'SHIPPED',
        orderDate: new Date('2025-09-19'),
        deadline: new Date('2025-09-26'),
        notes: 'Standard shipping',
      },
      {
        id: 'order-1003',
        orgId: 'org-1',
        employeeId: 'emp-3',
        employeeName: 'Mike Davis',
        customerId: 'cust-3',
        customerName: 'Tech Solutions Inc',
        orderId: 'ORD-1003',
        items: [
          {
            itemId: 'item-3',
            itemName: 'USB Cable',
            quantity: 5,
            priceAtOrder: 12.99,
          },
          {
            itemId: 'item-6',
            itemName: 'Keyboard',
            quantity: 3,
            priceAtOrder: 45.99,
          },
        ],
        totalAmount: 2100,
        status: 'PROCESSING',
        orderDate: new Date('2025-09-21'),
        deadline: new Date('2025-09-27'),
        notes: 'Need partial shipment',
      },
      {
        id: 'order-1004',
        orgId: 'org-1',
        employeeId: 'emp-2',
        employeeName: 'Sarah Johnson',
        customerId: 'cust-4',
        customerName: 'Global Dynamics',
        orderId: 'ORD-1004',
        items: [
          {
            itemId: 'item-4',
            itemName: 'Notebook',
            quantity: 2,
            priceAtOrder: 8.99,
          },
        ],
        totalAmount: 750,
        status: 'DELIVERED',
        orderDate: new Date('2025-09-18'),
        deadline: new Date('2025-09-23'),
        notes: 'Delivered on time',
      },
      {
        id: 'order-1005',
        orgId: 'org-1',
        employeeId: 'emp-4',
        employeeName: 'Emily Chen',
        customerId: 'cust-2',
        customerName: 'Innovation Labs',
        orderId: 'ORD-1005',
        items: [
          {
            itemId: 'item-5',
            itemName: 'Desk Lamp',
            quantity: 1,
            priceAtOrder: 34.99,
          },
        ],
        totalAmount: 320,
        status: 'PENDING',
        orderDate: new Date('2025-09-17'),
        deadline: new Date('2025-09-22'),
        notes: 'Cancelled order',
      },
    ],
    items: [
      {
        id: 'item-1',
        orgId: 'org-1',
        name: 'Wireless Mouse',
        quantity: 15,
        itemId: '',
        threshold: 20,
        lastDateOfUpdate: new Date('2025-09-20'),
        image: '/images/wireless-mouse.png',
        updateHistory: [
          {
            vendorName: 'Electronics Hub',
            quantityUpdated: 20,
            cost: 400,
            updateType: 'REPLENISHMENT',
            date: new Date('2025-09-19'),
          },
        ],
      },
      {
        id: 'item-2',
        orgId: 'org-1',
        name: 'Office Chair',
        quantity: 5,
        itemId: '',
        threshold: 10,
        lastDateOfUpdate: new Date('2025-09-19'),
        image: '/images/office-chair.png',
        updateHistory: [
          {
            vendorName: 'Office World',
            quantityUpdated: 10,
            cost: 1800,
            updateType: 'REPLENISHMENT',
            date: new Date('2025-09-18'),
          },
        ],
      },
      {
        id: 'item-3',
        orgId: 'org-1',
        name: 'USB Cable',
        quantity: 3,
        itemId: '',
        threshold: 25,
        lastDateOfUpdate: new Date('2025-09-21'),
        image: '/images/usb-cable.png',
        updateHistory: [
          {
            vendorName: 'Tech Supplies Co',
            quantityUpdated: 30,
            cost: 300,
            updateType: 'REPLENISHMENT',
            date: new Date('2025-09-20'),
          },
        ],
      },
      {
        id: 'item-4',
        orgId: 'org-1',
        name: 'Notebook',
        itemId: '',
        quantity: 45,
        threshold: 30,
        lastDateOfUpdate: new Date('2025-09-18'),
        image: '/images/notebook.png',
        updateHistory: [
          {
            vendorName: 'Supply Chain Plus',
            quantityUpdated: 50,
            cost: 250,
            updateType: 'REPLENISHMENT',
            date: new Date('2025-09-17'),
          },
        ],
      },
      {
        id: 'item-5',
        orgId: 'org-1',
        name: 'Desk Lamp',
        itemId: '',
        quantity: 2,
        threshold: 15,
        lastDateOfUpdate: new Date('2025-09-17'),
        image: '/images/desk-lamp.png',
        updateHistory: [
          {
            vendorName: 'Office World',
            quantityUpdated: 15,
            cost: 450,
            updateType: 'REPLENISHMENT',
            date: new Date('2025-09-16'),
          },
        ],
      },
      {
        id: 'item-6',
        orgId: 'org-1',
        name: 'Keyboard',
        itemId: '',
        quantity: 0,
        threshold: 12,
        lastDateOfUpdate: new Date('2025-09-16'),
        image: '/images/keyboard.png',
        updateHistory: [
          {
            vendorName: 'Electronics Hub',
            quantityUpdated: 12,
            cost: 540,
            updateType: 'REPLENISHMENT',
            date: new Date('2025-09-15'),
          },
        ],
      },
    ],
    vendors: [
      {
        id: 'vendor-1',
        orgId: 'org-1',
        name: 'Tech Supplies Co',
        vendorId: 'V001',
        email: 'contact@techsupplies.com',
        phone: '+91-9012345678',
        status: 'active',
        gstNo: 'GST1234',
        specialities: ['Electronics', 'Cables'],
        address: 'Bangalore, India',
        totalRestocks: 24,
        totalValue: 15000,
        replenishmentHistory: [
          { itemId: 'item-3', itemName: 'USB Cable', quantity: 30, cost: 300 },
        ],
        rating: [5, 4, 4, 5],
        onTimeDelivery: [95, 97, 92],
        responseTime: [24, 18, 20],
      },
      {
        id: 'vendor-2',
        orgId: 'org-1',
        name: 'Office World',
        vendorId: 'V002',
        email: 'support@officeworld.com',
        phone: '+91-9023456789',
        status: 'active',
        gstNo: 'GST5678',
        specialities: ['Furniture', 'Office Supplies'],
        address: 'Delhi, India',
        totalRestocks: 18,
        totalValue: 9000,
        replenishmentHistory: [
          {
            itemId: 'item-2',
            itemName: 'Office Chair',
            quantity: 10,
            cost: 1800,
          },
        ],
        rating: [4, 4, 5],
        onTimeDelivery: [88, 90, 92],
        responseTime: [20, 19, 21],
      },
      {
        id: 'vendor-3',
        orgId: 'org-1',
        name: 'Electronics Hub',
        vendorId: 'V003',
        email: 'sales@electronichub.com',
        phone: '+91-9034567890',
        status: 'active',
        gstNo: 'GST8765',
        specialities: ['Electronics', 'Peripherals'],
        address: 'Hyderabad, India',
        totalRestocks: 31,
        totalValue: 20000,
        replenishmentHistory: [
          {
            itemId: 'item-1',
            itemName: 'Wireless Mouse',
            quantity: 20,
            cost: 400,
          },
        ],
        rating: [5, 5, 4],
        onTimeDelivery: [97, 95, 96],
        responseTime: [15, 18, 16],
      },
      {
        id: 'vendor-4',
        orgId: 'org-1',
        name: 'Supply Chain Plus',
        vendorId: 'V004',
        email: 'help@supplychainplus.com',
        phone: '+91-9045678901',
        status: 'inactive',
        gstNo: 'GST4321',
        specialities: ['Stationery'],
        address: 'Chennai, India',
        totalRestocks: 15,
        totalValue: 6000,
        replenishmentHistory: [
          { itemId: 'item-4', itemName: 'Notebook', quantity: 50, cost: 250 },
        ],
        rating: [3, 4, 4],
        onTimeDelivery: [80, 85, 83],
        responseTime: [30, 28, 32],
      },
    ],
    customers: [
      {
        id: 'cust-1',
        orgId: 'org-1',
        customerId: 'C001',
        name: 'ABC Corporation',
        phone: '+91-9090909090',
        email: 'abc@corp.com',
        address: 'Hyderabad, India',
        status: 'active',
        gstNo: 'GST9876',
        dateOfJoining: new Date('2022-01-15'),
        orders: [
          {
            orderId: 'ORD-1001',
            status: 'pending',
            orderDate: new Date('2025-09-20'),
            totalAmount: 1250,
          },
        ],
        satisfactionLevel: [5, 4, 5],
        preferredCategories: ['Electronics', 'Furniture'],
      },
      {
        id: 'cust-2',
        orgId: 'org-1',
        customerId: 'C002',
        name: 'XYZ Limited',
        phone: '+91-8080808080',
        email: 'xyz@ltd.com',
        address: 'Pune, India',
        status: 'active',
        gstNo: 'GST7654',
        dateOfJoining: new Date('2023-03-20'),
        orders: [
          {
            orderId: 'ORD-1002',
            status: 'shipped',
            orderDate: new Date('2025-09-19'),
            totalAmount: 890,
          },
          {
            orderId: 'ORD-1005',
            status: 'pending',
            orderDate: new Date('2025-09-17'),
            totalAmount: 320,
          },
        ],
        satisfactionLevel: [4, 4, 3],
        preferredCategories: ['Stationery', 'Furniture'],
      },
      {
        id: 'cust-3',
        orgId: 'org-1',
        customerId: 'C003',
        name: 'Tech Solutions Inc',
        phone: '+91-7070707070',
        email: 'tech@solutions.com',
        address: 'Delhi, India',
        status: 'active',
        gstNo: 'GST1122',
        dateOfJoining: new Date('2021-07-10'),
        orders: [
          {
            orderId: 'ORD-1003',
            status: 'processing',
            orderDate: new Date('2025-09-21'),
            totalAmount: 2100,
          },
        ],
        satisfactionLevel: [5, 5, 4],
        preferredCategories: ['Electronics', 'Peripherals'],
      },
      {
        id: 'cust-4',
        orgId: 'org-1',
        customerId: 'C004',
        name: 'Global Dynamics',
        phone: '+91-6060606060',
        email: 'global@dynamics.com',
        address: 'Bangalore, India',
        status: 'inactive',
        gstNo: 'GST3344',
        dateOfJoining: new Date('2020-05-05'),
        orders: [
          {
            orderId: 'ORD-1004',
            status: 'delivered',
            orderDate: new Date('2025-09-18'),
            totalAmount: 750,
          },
        ],
        satisfactionLevel: [3, 4, 3],
        preferredCategories: ['Stationery'],
      },
    ],
  });

  const { findOrders, loading: orderLoading, orders } = useOrderStore();
  const { authUser } = useAuthStore();
  const {
    fetchEmployees,
    loading: employeeLoading,
    employees,
  } = useEmployeeStore();
  const {
    fetchCustomers,
    loading: customerLoading,
    customers,
  } = useCustomerStore();
  const { fetchVendors, loading: vendorLoading, vendors } = useVendorStore();
  const { fetchItems, loading: itemLoading, items } = useItemStore();

  const router = useRouter();

  // Get alerts
  const lowStockItems = dashboardData.items.filter(
    (item) => item.quantity <= item.threshold
  );
  const outOfStockItems = dashboardData.items.filter(
    (item) => item.quantity === 0
  );

  const findAverage = (arr: Array<any>) => {
    if (arr) {
      let sum = 0;
      for (let i = 0; i < arr.length; i++) sum += arr[i];
      return sum / arr.length;
    }
    return 0;
  };

  const totalSpent = (customer: Customer) => {
    return customer.orders.reduce(
      (sum: number, order: any) => sum + order.totalAmount,
      0
    );
  };

  // Calculate summary stats
  const totalRevenue =
    dashboardData.orders &&
    dashboardData.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders =
    dashboardData.orders &&
    dashboardData.orders.filter(
      (order) => order.status === 'Pending'.toUpperCase()
    ).length;
  const totalItems =
    dashboardData.items &&
    dashboardData.items.reduce((sum, item) => sum + item.quantity, 0);
  const activeEmployees =
    dashboardData.employees &&
    dashboardData.employees.filter(
      (emp) => emp.status === 'active'.toUpperCase()
    ).length;

  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  const dismissAlert = (itemId: string) => {
    setDismissedAlerts((prev) => new Set([...prev, itemId]));
  };

  const visibleLowStockItems = lowStockItems.filter(
    (item) => !dismissedAlerts.has(item.id)
  );
  useEffect(() => {
    if (!authUser) router.push('/');
  }, []);
  useEffect(() => {
    const findFn = async () => {
      await findOrders();
      await fetchEmployees();
      await fetchCustomers();
      await fetchVendors();
      await fetchItems();
    };
    findFn();
  }, []);

  useEffect(() => {
    setDashboardData((prevData) => ({
      ...prevData,
      orders: orders,
      employees: employees,
      customers: customers,
      vendors: vendors,
      items: items,
    }));
  }, [orders, employees, customers, vendors, items]);

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <main className='pt-24 pb-16'>
        {/* Header */}

        <section className='container mx-auto px-4 mb-8'>
          <div className='flex justify-between items-center py-6'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className='text-4xl md:text-5xl font-bold font-mono text-primary neon-text'>
                Dashboard
              </h1>
              <p className='text-lg text-muted-foreground mt-1'>
                Overview of your inventory management system
              </p>
            </motion.div>

            <motion.div
              className='flex items-center gap-4'
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Calendar className='w-4 h-4' />
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </motion.div>
          </div>
        </section>
        <section className='container mx-auto px-4'>
          {/* Alerts Section */}
          <AnimatePresence>
            {visibleLowStockItems && visibleLowStockItems.length > 0 && (
              <motion.section
                className='mb-8'
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <div className='flex items-center gap-2 mb-4'>
                  <Bell className='w-5 h-5 text-chart-2' />
                  <h2 className='text-lg font-semibold text-foreground'>
                    Stock Alerts
                  </h2>
                  <span className='bg-chart-2/20 text-chart-2 px-2 py-1 rounded-full text-xs font-medium'>
                    {visibleLowStockItems.length}
                  </span>
                </div>

                <div className='grid gap-3'>
                  <AnimatePresence>
                    {visibleLowStockItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className='bg-gradient-to-r from-chart-2/10 to-destructive/5 border border-chart-2/30 rounded-xl p-4'
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <AlertTriangle className='w-5 h-5 text-chart-2' />
                            <div>
                              <p className='font-medium text-foreground'>
                                {item.quantity === 0
                                  ? 'Out of Stock'
                                  : 'Low Stock'}
                                : {item.name}
                              </p>
                              <p className='text-sm text-muted-foreground'>
                                Current: {item.quantity} | Threshold:{' '}
                                {item.threshold}
                              </p>
                            </div>
                          </div>

                          <div className='flex items-center gap-2'>
                            <motion.button
                              className='px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300'
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Restock
                            </motion.button>
                            <motion.button
                              onClick={() => dismissAlert(item.id)}
                              className='p-1 text-muted-foreground hover:text-foreground transition-colors'
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <X className='w-4 h-4' />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Summary Stats */}
          <motion.section
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <StatCard
              title='Total Revenue'
              value={`₹${totalRevenue.toLocaleString()}`}
              icon={IndianRupee}
              trend={12.5}
              color='accent'
            />
            <StatCard
              title='Total Items'
              value={totalItems.toLocaleString()}
              icon={Package}
              trend={-2.3}
              color='primary'
            />
            <StatCard
              title='Pending Orders'
              value={pendingOrders.toLocaleString()}
              icon={ShoppingCart}
              trend={8.7}
              color='chart-2'
            />
            <StatCard
              title='Active Staff'
              value={activeEmployees.toLocaleString()}
              icon={Users}
              trend={5.2}
              color='secondary'
            />
          </motion.section>

          {/* Main Content Grid */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Left Column - Recent Activity & Quick Stats */}
            <div className='lg:col-span-2 space-y-8'>
              {/* Recent Orders */}
              <motion.div
                className='bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className='flex items-center justify-between mb-6'>
                  <div className='flex items-center gap-2'>
                    <ShoppingCart className='w-5 h-5 text-primary' />
                    <h3 className='text-xl font-bold text-foreground'>
                      Recent Orders
                    </h3>
                  </div>
                  <Link href={'/orders'}>
                    <motion.button
                      className='text-sm text-primary hover:text-primary/80 flex items-center gap-1'
                      whileHover={{ scale: 1.05 }}
                    >
                      <Eye className='w-4 h-4' />
                      View All
                    </motion.button>
                  </Link>
                </div>

                <div className='space-y-3'>
                  {dashboardData.orders.slice(0, 5).map((order, index) => (
                    <motion.div
                      key={order.id}
                      className='flex items-center justify-between p-4 bg-background/50 rounded-xl hover:bg-background/70 transition-all duration-300'
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-1'>
                          <span className='font-medium text-foreground'>
                            #{order.orderId}
                          </span>
                          <StatusBadge status={order.status} />
                        </div>
                        <p className='text-sm text-muted-foreground'>
                          {order.customerName}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {order.items && order.items.length} items •{' '}
                          {new Date(order.orderDate).toDateString()}
                        </p>
                        <ul className='mt-1 text-xs text-muted-foreground space-y-1'>
                          {order.items.map((item) => (
                            <li key={item.itemId}>
                              {item.itemName} × {item.quantity} @ ₹
                              {item.priceAtOrder}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className='text-right'>
                        <p className='font-bold text-accent'>
                          ₹{order.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Low Stock Items */}
              <motion.div
                className='bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className='flex items-center justify-between mb-6'>
                  <div className='flex items-center gap-2'>
                    <Package className='w-5 h-5 text-chart-2' />
                    <h3 className='text-xl font-bold text-foreground'>
                      Items Requiring Attention
                    </h3>
                  </div>
                </div>

                <div className='grid gap-4'>
                  {lowStockItems.slice(0, 4).map((item, index) => (
                    <motion.div
                      key={item.id}
                      className='flex items-center justify-between p-4 bg-background/50 rounded-xl'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    >
                      <div className='flex-1'>
                        <p className='font-medium text-foreground'>
                          {item.name}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p
                          className={`font-bold ${
                            item.quantity === 0
                              ? 'text-destructive'
                              : 'text-chart-2'
                          }`}
                        >
                          {item.quantity} / {item.threshold}
                        </p>
                        <div className='w-20 h-2 bg-muted/20 rounded-full mt-1'>
                          <div
                            className={`h-full rounded-full ${
                              item.quantity === 0
                                ? 'bg-destructive'
                                : 'bg-chart-2'
                            }`}
                            style={{
                              width: `${Math.max(
                                (item.quantity / item.threshold) * 100,
                                5
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Quick Actions & Summary */}
            <div className='space-y-8'>
              {/* Quick Actions */}
              <motion.div
                className='bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <h3 className='text-xl font-bold text-foreground mb-6'>
                  Quick Actions
                </h3>
                <div className='space-y-3'>
                  <QuickActionButton
                    icon={Plus}
                    label='Add New Item'
                    color='primary'
                  />
                  <QuickActionButton
                    icon={ShoppingCart}
                    label='Create Order'
                    color='accent'
                  />
                  <QuickActionButton
                    icon={Truck}
                    label='Add Vendor'
                    color='secondary'
                  />
                  <QuickActionButton
                    icon={Users}
                    label='Manage Staff'
                    color='chart-2'
                  />
                </div>
              </motion.div>

              {/* Top Vendors */}
              <motion.div
                className='bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className='flex items-center gap-2 mb-6'>
                  <Truck className='w-5 h-5 text-secondary' />
                  <h3 className='text-xl font-bold text-foreground'>
                    Top Vendors
                  </h3>
                </div>

                <div className='space-y-4'>
                  {dashboardData.vendors
                    .sort(
                      (a, b) => findAverage(b.rating) - findAverage(a.rating)
                    )
                    .slice(0, 3)
                    .map((vendor, index) => (
                      <motion.div
                        key={vendor.id}
                        className='flex items-center justify-between p-3 bg-background/50 rounded-lg'
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                      >
                        <div className='flex-1'>
                          <p className='font-medium text-foreground text-sm'>
                            {vendor.name}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {vendor.totalRestocks} orders
                          </p>
                        </div>
                        <div className='text-right'>
                          <div className='flex items-center gap-1'>
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  i < Math.floor(findAverage(vendor.rating))
                                    ? 'bg-accent'
                                    : 'bg-muted/30'
                                }`}
                              />
                            ))}
                          </div>
                          <p className='text-xs text-muted-foreground mt-1'>
                            {findAverage(vendor.rating)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>

              {/* Top Customers */}
              <motion.div
                className='bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <div className='flex items-center gap-2 mb-6'>
                  <UserCheck className='w-5 h-5 text-chart-2' />
                  <h3 className='text-xl font-bold text-foreground'>
                    Top Customers
                  </h3>
                </div>

                <div className='space-y-4'>
                  {dashboardData.customers
                    .sort((a, b) => totalSpent(b) - totalSpent(a)) // to be calculated
                    .slice(0, 3)
                    .map((customer, index) => (
                      <motion.div
                        key={customer.id}
                        className='flex items-center justify-between p-3 bg-background/50 rounded-lg'
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
                      >
                        <div className='flex-1'>
                          <div className='flex items-center gap-2'>
                            <p className='font-medium text-foreground text-sm'>
                              {customer.name}
                            </p>
                            {customer.status === 'active' && (
                              <span className='bg-accent/20 text-accent px-2 py-0.5 rounded-full text-xs font-medium'>
                                Premium
                              </span>
                            )}
                          </div>
                          <p className='text-xs text-muted-foreground'>
                            {customer.orders && customer.orders.length} orders
                          </p>
                        </div>
                        <div className='text-right'>
                          <p className='font-bold text-accent text-sm'>
                            {/* to be calculated */}₹
                            {totalSpent(customer).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  color,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: number;
  color: string;
}) => (
  <motion.div
    className='bg-card/30 backdrop-blur-sm border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group'
    whileHover={{ scale: 1.02, y: -2 }}
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div className='flex items-center justify-between'>
      <div className='flex-1'>
        <p className='text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1'>
          {title}
        </p>
        <p
          className={`text-2xl font-bold font-mono text-${color} neon-text mb-1`}
        >
          {value}
        </p>
        {trend && (
          <p
            className={`text-sm flex items-center gap-1 ${
              trend > 0 ? 'text-accent' : 'text-destructive'
            }`}
          >
            {trend > 0 ? (
              <TrendingUp className='w-4 h-4' />
            ) : (
              <TrendingDown className='w-4 h-4' />
            )}
            {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
      <div
        className={`p-3 bg-${color}/20 rounded-xl group-hover:neon-glow transition-all duration-300`}
      >
        <Icon className={`w-6 h-6 text-${color}`} />
      </div>
    </div>
  </motion.div>
);

const StatusBadge = ({
  status,
}: {
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}) => {
  const statusConfig = {
    PENDING: { color: 'chart-2', bg: 'chart-2/20' },
    PROCESSING: { color: 'primary', bg: 'primary/20' },
    SHIPPED: { color: 'accent', bg: 'accent/20' },
    DELIVERED: { color: 'secondary', bg: 'secondary/20' },
    CANCELLED: { color: 'destructive', bg: 'destructive/20' },
  };

  const config = statusConfig[status] || statusConfig['PENDING'];

  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded-full bg-${config.bg} text-${config.color} border border-${config.color}/30`}
    >
      {status}
    </span>
  );
};

const QuickActionButton = ({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) => (
  <motion.button
    className={`w-full flex items-center gap-2 px-4 py-3 bg-${color}/10 border border-${color}/30 rounded-xl text-${color} hover:bg-${color} hover:text-white hover:neon-glow transition-all duration-300`}
    whileHover={{ scale: 1.02, x: 5 }}
    whileTap={{ scale: 0.98 }}
  >
    <Icon className='w-5 h-5' />
    <span className='font-medium'>{label}</span>
  </motion.button>
);

export default InventoryDashboard;
