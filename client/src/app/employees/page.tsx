'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import useEmployeeStore, {
  Employee,
  EmployeeCreateData,
} from '@/store/useEmployeeStore';
import { Navbar } from '@/components/navbar';
import { Loader2 } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

const statusColors = {
  ACTIVE: 'accent',
  INACTIVE: 'destructive',
  SUSPENDED: 'chart-2',
};

const filterOptions = [
  { label: 'All Employees', value: 'all' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Suspended', value: 'SUSPENDED' },
  { label: 'Inactive', value: 'INACTIVE' },
];

const departmentOptions = [
  { label: 'All Departments', value: 'all' },
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Product', value: 'Product' },
  { label: 'Design', value: 'Design' },
  { label: 'Analytics', value: 'Analytics' },
  { label: 'Sales', value: 'Sales' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'HR', value: 'HR' },
];

export default function EmployeesPage() {
  const {
    employees,
    loading,
    error,
    fetchEmployees,
    createEmployee,
    deleteEmployee,
  } = useEmployeeStore();

  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
  const { authUser } = useAuthStore();
  const router = useRouter();
  // Inside EmployeesPage component
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDeleteEmployee = async () => {
    if (employeeToDelete) {
      await deleteEmployee(employeeToDelete.id);
    }
    setEmployeeToDelete(null);
    setShowDeleteModal(false);
  };

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);
  useEffect(() => {
    if (!authUser) router.push('/');
  }, []);
  // Update filtered employees when filters or search term changes
  useEffect(() => {
    let filtered = employees;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(
        (employee) => employee.status === activeFilter
      );
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(
        (employee) => employee.department === departmentFilter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.department
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          employee.employeeId
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredEmployees(filtered);
  }, [activeFilter, departmentFilter, searchTerm, employees]);

  const handleCreateEmployee = async (employeeData: EmployeeCreateData) => {
    const result = await createEmployee(employeeData);
    if (result.success) {
      setShowNewEmployeeModal(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      await deleteEmployee(id);
    }
  };

  if (loading && employees.length === 0) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='h-12 w-12 text-primary animate-spin mx-auto mb-4' />
          <p className='text-muted-foreground'>Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <main className='pt-24 pb-16'>
        {/* Header Section */}
        <section className='container mx-auto px-4 mb-8'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in'>
            <div>
              <h1 className='text-4xl md:text-5xl font-bold font-mono text-primary neon-text mb-2'>
                Employee Management
              </h1>
              <p className='text-lg text-muted-foreground'>
                Manage your team members, track performance, and organize
                departments
              </p>
              {error && (
                <p className='text-destructive text-sm mt-2'>{error}</p>
              )}
            </div>

            <div className='flex items-center gap-4'>
              <Button
                className='px-6 py-3 bg-primary text-primary-foreground hover:neon-glow transition-all duration-300 flex items-center justify-center gap-2'
                onClick={() => setShowNewEmployeeModal(true)}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className='h-5 w-5 animate-spin' />
                    Loading...
                  </>
                ) : (
                  'Add Employee'
                )}
              </Button>
              <Button
                variant='outline'
                className='px-6 py-3 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300'
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
            </div>
          </div>
        </section>

        {/* Search and Filters */}
        <section className='container mx-auto px-4 mb-8'>
          <div className='flex flex-col gap-4 animate-slide-up'>
            {/* Search Bar */}
            <div className='flex-1'>
              <input
                type='text'
                placeholder='Search employees by name, department, ID, or email...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
              />
            </div>

            {/* Filter Buttons */}
            {showFilters && (
              <div className='flex flex-col sm:flex-row gap-4 animate-fade-in'>
                <div className='flex flex-wrap gap-2'>
                  <span className='text-sm text-muted-foreground self-center'>
                    Status:
                  </span>
                  {filterOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        activeFilter === option.value ? 'default' : 'outline'
                      }
                      size='sm'
                      className={`text-sm transition-all duration-300 hover-scale ${
                        activeFilter === option.value
                          ? 'neon-glow'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setActiveFilter(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                <div className='flex flex-wrap gap-2'>
                  <span className='text-sm text-muted-foreground self-center'>
                    Department:
                  </span>
                  {departmentOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        departmentFilter === option.value
                          ? 'default'
                          : 'outline'
                      }
                      size='sm'
                      className={`text-sm transition-all duration-300 hover-scale ${
                        departmentFilter === option.value
                          ? 'neon-glow'
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setDepartmentFilter(option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Employees List */}
        <section className='container mx-auto px-4'>
          <div className='space-y-4 animate-fade-in'>
            {filteredEmployees.map((employee, index) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                index={index}
                isSelected={selectedEmployee === employee.id}
                onSelect={() =>
                  setSelectedEmployee(
                    selectedEmployee === employee.id ? null : employee.id
                  )
                }
                onDelete={() => handleDeleteClick(employee)}
              />
            ))}
          </div>

          {filteredEmployees.length === 0 && !loading && (
            <div className='text-center py-16 animate-fade-in'>
              <div className='text-6xl mb-4'>👥</div>
              <h3 className='text-xl font-semibold text-foreground mb-2'>
                No employees found
              </h3>
              <p className='text-muted-foreground'>
                {searchTerm ||
                activeFilter !== 'all' ||
                departmentFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start by adding your first employee'}
              </p>
            </div>
          )}
        </section>

        {/* Employee Stats */}
        <section className='container mx-auto px-4 mt-16'>
          <EmployeeStats employees={filteredEmployees} />
        </section>
      </main>

      {/* New Employee Modal */}
      {showNewEmployeeModal && (
        <NewEmployeeModal
          onClose={() => setShowNewEmployeeModal(false)}
          onSubmit={handleCreateEmployee}
          loading={loading}
        />
      )}

      {/* Delete modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDeleteEmployee}
          employee={employeeToDelete}
          loading={loading}
        />
      )}
    </div>
  );
}

function EmployeeCard({
  employee,
  index,
  isSelected,
  onSelect,
  onDelete,
}: {
  employee: Employee;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const statusColor =
    statusColors[employee.status as keyof typeof statusColors] || 'muted';

  const yearsOfService =
    employee.yearsOfService ||
    Math.floor(
      (new Date().getTime() - new Date(employee.hireDate).getTime()) /
        (1000 * 3600 * 24 * 365)
    );

  const avgRating =
    employee.performance?.length > 0
      ? employee.performance.reduce((sum, review) => sum + review.rating, 0) /
        employee.performance.length
      : 0;

  return (
    <Card
      className='bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer animate-slide-up hover-scale p-6'
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={onSelect}
    >
      {/* Neon glow effect on hover */}
      <div className='absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl' />

      <div className='relative z-10'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4 flex-1'>
            <Avatar className='h-16 w-16 border-2 border-primary/20'>
              <AvatarFallback className='bg-primary/20 text-primary font-bold'>
                {employee.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>

            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-1'>
                <h3 className='text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300'>
                  {employee.name}
                </h3>
                <Badge
                  className={`px-2 py-1 text-xs font-medium rounded-full bg-${statusColor}/20 text-${statusColor} border border-${statusColor}/30`}
                >
                  {employee.status.replace('-', ' ')}
                </Badge>
              </div>
              <p className='text-primary font-medium mb-1'>{employee.role}</p>
              <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                <span>{employee.department}</span>
                <span>•</span>
                <span>ID: {employee.employeeId}</span>
                <span>•</span>
                <span>{employee.location}</span>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-6'>
            <div className='text-right'>
              <p className='text-sm text-muted-foreground'>Performance</p>
              <div className='flex items-center gap-1'>
                <span className='text-lg font-bold text-accent'>
                  {avgRating ? avgRating.toFixed(1) : 'N/A'}
                </span>
                {avgRating > 0 && (
                  <span className='text-sm text-muted-foreground'>/5.0</span>
                )}
              </div>
            </div>

            <div className='text-right'>
              <p className='text-sm text-muted-foreground'>Experience</p>
              <p className='text-lg font-bold text-chart-2'>
                {employee.experience || yearsOfService}y
              </p>
            </div>

            <div className='text-right'>
              <p className='text-sm text-muted-foreground'>Salary</p>
              <p className='text-lg font-bold text-secondary'>
                ₹{(employee.salary / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isSelected && (
          <div className='border-t border-border pt-4 mt-4 animate-fade-in'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div>
                <h4 className='text-sm font-semibold text-foreground mb-3'>
                  Contact Information
                </h4>
                <div className='space-y-2 text-sm'>
                  <p>
                    <span className='text-muted-foreground'>Email:</span>{' '}
                    <span className='text-foreground'>{employee.email}</span>
                  </p>
                  <p>
                    <span className='text-muted-foreground'>Phone:</span>{' '}
                    <span className='text-foreground'>
                      {employee.phone || 'N/A'}
                    </span>
                  </p>
                  <p>
                    <span className='text-muted-foreground'>Location:</span>{' '}
                    <span className='text-foreground'>
                      {employee.location || 'N/A'}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className='text-sm font-semibold text-foreground mb-3'>
                  Employment Details
                </h4>
                <div className='space-y-2 text-sm'>
                  <p>
                    <span className='text-muted-foreground'>Hire Date:</span>{' '}
                    <span className='text-foreground'>
                      {new Date(employee.hireDate).toLocaleDateString()}
                    </span>
                  </p>
                  <p>
                    <span className='text-muted-foreground'>Manager:</span>{' '}
                    <span className='text-foreground'>
                      {employee.manager?.name || 'N/A'}
                    </span>
                  </p>
                  <p>
                    <span className='text-muted-foreground'>
                      Years of Service:
                    </span>{' '}
                    <span className='text-foreground'>
                      {yearsOfService} years
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h4 className='text-sm font-semibold text-foreground mb-3'>
                  Skills & Expertise
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {employee.skills?.length > 0 ? (
                    employee.skills.map((skill, idx) => (
                      <Badge
                        key={idx}
                        variant='secondary'
                        className='text-xs bg-secondary/20 text-secondary border border-secondary/30'
                      >
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <span className='text-sm text-muted-foreground'>
                      No skills listed
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className='flex gap-4 mt-6'>
              <Button
                variant='outline'
                size='sm'
                className='hover:border-primary hover:text-primary'
              >
                Edit Employee
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='hover:border-accent hover:text-accent'
              >
                View Profile
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='hover:border-chart-2 hover:text-chart-2'
              >
                Performance Review
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='hover:border-destructive hover:text-destructive'
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function EmployeeStats({ employees }: { employees: Employee[] }) {
  const stats = {
    total: employees.length,
    active: employees.filter((emp) => emp.status === 'ACTIVE').length,
    suspended: employees.filter((emp) => emp.status === 'SUSPENDED').length,
    inactive: employees.filter((emp) => emp.status === 'INACTIVE').length,
    avgSalary:
      employees.length > 0
        ? employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length
        : 0,
    avgPerformance:
      employees.length > 0
        ? employees.reduce((sum, emp) => {
            const empAvg =
              emp.performance?.length > 0
                ? emp.performance.reduce((s, r) => s + r.rating, 0) /
                  emp.performance.length
                : 0;
            return sum + empAvg;
          }, 0) / employees.length
        : 0,
  };

  const departmentCounts: Record<string, number> = employees.reduce(
    (acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <Card className='bg-card/30 backdrop-blur-sm border border-border p-8 animate-fade-in'>
      <h3 className='text-2xl font-bold text-foreground mb-6 text-center'>
        Employee Analytics
      </h3>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8'>
        <StatCard label='Total Employees' value={stats.total} color='primary' />
        <StatCard label='Active' value={stats.active} color='accent' />
        <StatCard label='Suspended' value={stats.suspended} color='chart-2' />
        <StatCard label='Inactive' value={stats.inactive} color='destructive' />
        <StatCard
          label='Avg Salary'
          value={`₹${(stats.avgSalary / 1000).toFixed(0)}K`}
          color='secondary'
        />
        <StatCard
          label='Avg Performance'
          value={stats.avgPerformance.toFixed(1)}
          color='chart-3'
        />
      </div>

      <div>
        <h4 className='text-lg font-semibold text-foreground mb-4'>
          Department Distribution
        </h4>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
          {Object.entries(departmentCounts).map(([dept, count]) => (
            <div
              key={dept}
              className='text-center p-3 rounded-lg bg-background/50'
            >
              <div className='text-lg font-bold text-primary'>{count}</div>
              <div className='text-xs text-muted-foreground'>{dept}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className='text-center p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-all duration-300 hover-scale'>
      <div
        className={`text-2xl font-bold font-mono text-${color} neon-text mb-1`}
      >
        {value}
      </div>
      <div className='text-xs text-muted-foreground'>{label}</div>
    </div>
  );
}

function NewEmployeeModal({
  onClose,
  onSubmit,
  loading,
}: {
  onClose: () => void;
  onSubmit: (employee: EmployeeCreateData) => void;
  loading: boolean;
}) {
  const [formData, setFormData] = useState<EmployeeCreateData>({
    name: '',
    email: '',
    department: '',
    phone: '',
    salary: 0,
    location: '',
    experience: 0,
    status: 'ACTIVE',
    skills: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in'
      onClick={onClose}
    >
      <Card
        className='bg-card border border-border p-8 w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-primary'>Add New Employee</h2>
          <button
            onClick={onClose}
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Full Name *
            </label>
            <input
              type='text'
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
              placeholder='Enter full name'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Email *
            </label>
            <input
              type='email'
              required
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
              placeholder='employee@company.com'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Department
              </label>
              <select
                value={formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
              >
                <option value=''>Select Department</option>
                <option value='Engineering'>Engineering</option>
                <option value='Product'>Product</option>
                <option value='Design'>Design</option>
                <option value='Analytics'>Analytics</option>
                <option value='Sales'>Sales</option>
                <option value='Marketing'>Marketing</option>
                <option value='HR'>HR</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as
                      | 'ACTIVE'
                      | 'INACTIVE'
                      | 'SUSPENDED',
                  }))
                }
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
              >
                <option value='ACTIVE'>Active</option>
                <option value='INACTIVE'>Inactive</option>
                <option value='SUSPENDED'>Suspended</option>
              </select>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Phone
            </label>
            <input
              type='tel'
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
              placeholder='+1 (555) 123-4567'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-foreground mb-2'>
              Location
            </label>
            <input
              type='text'
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
              placeholder='City, State'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Salary (₹)
              </label>
              <input
                type='number'
                min='0'
                value={formData.salary}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    salary: parseInt(e.target.value) || 0,
                  }))
                }
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
                placeholder='80000'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>
                Experience (years)
              </label>
              <input
                type='number'
                min='0'
                value={formData.experience}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    experience: parseInt(e.target.value) || 0,
                  }))
                }
                className='w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300'
                placeholder='5'
              />
            </div>
          </div>

          <div className='flex gap-4 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='flex-1'
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='flex-1 bg-primary text-primary-foreground hover:neon-glow transition-all duration-300 flex items-center justify-center gap-2'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className='h-5 w-5 animate-spin' />
                  Creating...
                </>
              ) : (
                'Add Employee'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function DeleteConfirmModal({
  onClose,
  onConfirm,
  employee,
  loading,
}: {
  onClose: () => void;
  onConfirm: () => void;
  employee: Employee | null;
  loading: boolean;
}) {
  if (!employee) return null;

  return (
    <div
      className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in'
      onClick={onClose}
    >
      <Card
        className='bg-card border border-border p-6 w-full max-w-md animate-slide-up'
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className='text-xl font-bold text-destructive mb-4'>
          Confirm Deletion
        </h2>
        <p className='text-muted-foreground mb-6'>
          Are you sure you want to delete{' '}
          <span className='font-semibold text-foreground'>{employee.name}</span>
          ? This action cannot be undone.
        </p>

        <div className='flex gap-4'>
          <Button
            variant='outline'
            onClick={onClose}
            className='flex-1'
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className='flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/80 flex items-center justify-center gap-2'
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
