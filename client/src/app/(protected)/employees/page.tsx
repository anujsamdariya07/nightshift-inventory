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
import { Loader } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { NewEmployeeModal } from '@/components/NewEmployeeModal';
import usePerformanceReviewStore, {
  PerformanceReview,
  Rating,
} from '@/store/usePerformanceReviewStore';

const statusColors = {
  ACTIVE: 'accent',
  INACTIVE: 'destructive',
  SUSPENDED: 'chart-2',
};

// Helper function to convert Rating enum to numeric value
const ratingToNumber = (rating: Rating | string | number): number => {
  if (typeof rating === 'number') return rating;
  const ratingMap: Record<string, number> = {
    [Rating.I]: 1,
    [Rating.II]: 2,
    [Rating.III]: 3,
    [Rating.IV]: 4,
    [Rating.V]: 5,
  };
  return ratingMap[rating as string] || 0;
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
    updateEmployee,
    deleteEmployee,
  } = useEmployeeStore();

  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
  const { authUser, checkAuth } = useAuthStore();
  const router = useRouter();
  // Inside EmployeesPage component
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [employeeToView, setEmployeeToView] = useState<Employee | null>(null);
  const [showPerformanceReviewModal, setShowPerformanceReviewModal] =
    useState(false);
  const [employeeForReview, setEmployeeForReview] =
    useState<Employee | null>(null);

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
    if (!authUser) router.push('/login');
    else if (authUser && authUser.mustChangePassword)
      router.push('/change-password');
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
          <Loader className='h-12 w-12 text-primary animate-spin mx-auto mb-4' />
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
                    <Loader className='h-5 w-5 animate-spin' />
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
                      className={`text-sm transition-all duration-300 hover-scale ${activeFilter === option.value
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
                      className={`text-sm transition-all duration-300 hover-scale ${departmentFilter === option.value
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
                authUser={authUser}
                employee={employee}
                index={index}
                isSelected={selectedEmployee === employee.id}
                onSelect={() =>
                  setSelectedEmployee(
                    selectedEmployee === employee.id ? null : employee.id
                  )
                }
                onDelete={() => handleDeleteClick(employee)}
                onViewDetails={() => {
                  setEmployeeToView(employee);
                  setShowViewDetailsModal(true);
                }}
                setEmployeeToEdit={setEmployeeToEdit}
                setShowEditEmployeeModal={setShowEditEmployeeModal}
                setEmployeeForReview={setEmployeeForReview}
                setShowPerformanceReviewModal={setShowPerformanceReviewModal}
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
          employees={employees}
          isOpen={showNewEmployeeModal}
          onClose={() => setShowNewEmployeeModal(false)}
          onSubmit={handleCreateEmployee}
          loading={loading}
        />
      )}

      {/* Edit Employee Modal */}
      {showEditEmployeeModal && employeeToEdit && (
        <EditEmployeeModal
          employee={employeeToEdit}
          loading={loading}
          onClose={() => {
            setShowEditEmployeeModal(false);
            setEmployeeToEdit(null);
          }}
          onSubmit={async (updatedEmployee) => {
            await updateEmployee(employeeToEdit.id, updatedEmployee);
            setShowEditEmployeeModal(false);
            setEmployeeToEdit(null);
          }}
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

      {/* View Employee Details Modal */}
      {showViewDetailsModal && employeeToView && (
        <ViewEmployeeDetailsModal
          employee={employeeToView}
          onClose={() => {
            setShowViewDetailsModal(false);
            setEmployeeToView(null);
          }}
        />
      )}

      {/* Performance Review Modal */}
      {showPerformanceReviewModal && employeeForReview && (
        <PerformanceReviewModal
          employee={employeeForReview}
          currentUser={authUser}
          onClose={() => {
            setShowPerformanceReviewModal(false);
            setEmployeeForReview(null);
          }}
          onReviewAdded={() => {
            fetchEmployees();
          }}
        />
      )}
    </div>
  );
}

function EmployeeCard({
  authUser,
  setEmployeeToEdit,
  setShowEditEmployeeModal,
  setEmployeeForReview,
  setShowPerformanceReviewModal,
  employee,
  index,
  isSelected,
  onSelect,
  onDelete,
  onViewDetails,
}: {
  authUser: Employee | null;
  employee: Employee;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
  setEmployeeToEdit: (employee: Employee) => void;
  setShowEditEmployeeModal: (show: boolean) => void;
  setEmployeeForReview: (employee: Employee) => void;
  setShowPerformanceReviewModal: (show: boolean) => void;
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
      ? employee.performance.reduce((sum, review) => sum + ratingToNumber(review.rating), 0) /
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
                      {employee.managerId || ''}: {employee.manager || 'N/A'}
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
                variant="outline"
                size="sm"
                className="hover:border-primary hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  setEmployeeToEdit(employee);
                  setShowEditEmployeeModal(true);
                }}
              >
                Edit Employee
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='hover:border-accent hover:text-accent'
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails();
                }}
              >
                View Details
              </Button>
              <Button
                variant='outline'
                size='sm'
                className='hover:border-chart-2 hover:text-chart-2'
                onClick={(e) => {
                  e.stopPropagation();
                  setEmployeeForReview(employee);
                  setShowPerformanceReviewModal(true);
                }}
              >
                Performance Review
              </Button>
              {
                authUser?.role !== employee.role && (
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
                )
              }
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
              ? emp.performance.reduce((s, r) => s + ratingToNumber(r.rating), 0) /
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

function EditEmployeeModal({
  employee,
  onClose,
  onSubmit,
  loading,
}: {
  employee: Employee;
  onClose: () => void;
  onSubmit: (data: Partial<Employee>) => Promise<void>;
  loading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    role: employee.role,
    department: employee.department,
    phone: employee.phone,
    location: employee.location,
    salary: employee.salary,
    status: employee.status,
    experience: employee.experience,
    skills: employee.skills.join(", "),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await onSubmit({
      ...formData,
      salary: Number(formData.salary),
      experience: Number(formData.experience),
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <Card
        className="w-full max-w-2xl p-6 bg-card border border-border animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-primary mb-6">
          Edit Employee
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
          <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />

          <SelectField
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            options={["ADMIN", "MANAGER", "WORKER"]}
          />

          <InputField label="Department" name="department" value={formData.department} onChange={handleChange} />
          <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <InputField label="Location" name="location" value={formData.location} onChange={handleChange} />

          <InputField label="Salary" name="salary" type="number" value={formData.salary} onChange={handleChange} />
          <InputField label="Experience (years)" name="experience" type="number" value={formData.experience} onChange={handleChange} />

          <SelectField
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={["ACTIVE", "INACTIVE", "SUSPENDED"]}
          />
        </div>

        <div className="mt-4">
          <label className="text-sm text-muted-foreground">Skills (comma separated)</label>
          <input
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-lg"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-primary text-primary-foreground"
          >
            {loading ? (
              <>
                <Loader className='h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
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
                <Loader className='h-4 w-4 animate-spin' />
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

function ViewEmployeeDetailsModal({
  employee,
  onClose,
}: {
  employee: Employee;
  onClose: () => void;
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
      ? employee.performance.reduce((sum, review) => sum + ratingToNumber(review.rating), 0) /
      employee.performance.length
      : 0;

  useEffect(() => {
    const handlePress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handlePress);

    return () => {
      document.removeEventListener('keydown', handlePress);
    };
  }, [onClose]);

  return (
    <div
      className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 hide-scrollbar'
      onClick={onClose}
    >
      <Card
        className='bg-card border border-border rounded-2xl p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-primary'>Employee Details</h2>
          <button
            onClick={onClose}
            className='text-muted-foreground hover:text-foreground transition-colors text-2xl'
          >
            ✕
          </button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
          {/* Left Column - Profile */}
          <div className='lg:col-span-1 space-y-6'>
            <div className='bg-background/30 rounded-lg p-6 text-center'>
              <Avatar className='h-24 w-24 border-4 border-primary/20 mx-auto mb-4'>
                <AvatarFallback className='text-2xl font-bold bg-primary/10 text-primary'>
                  {employee.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className='text-xl font-bold text-foreground mb-2'>
                {employee.name}
              </h3>
              <p className='text-sm text-muted-foreground mb-2'>
                {employee.role}
              </p>
              <Badge
                variant='outline'
                className={`bg-${statusColor}/20 text-${statusColor} border-${statusColor}/30`}
              >
                {employee.status}
              </Badge>
            </div>

            <div className='bg-background/30 rounded-lg p-6'>
              <h4 className='text-sm font-semibold text-foreground mb-4'>
                Quick Stats
              </h4>
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-xs text-muted-foreground'>
                    Employee ID
                  </span>
                  <span className='text-sm font-medium text-foreground'>
                    {employee.employeeId}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-xs text-muted-foreground'>
                    Years of Service
                  </span>
                  <span className='text-sm font-medium text-foreground'>
                    {yearsOfService} years
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-xs text-muted-foreground'>
                    Avg Rating
                  </span>
                  <span className='text-sm font-medium text-foreground'>
                    {avgRating > 0 ? `${avgRating.toFixed(1)} / 5` : 'N/A'}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-xs text-muted-foreground'>
                    Experience
                  </span>
                  <span className='text-sm font-medium text-foreground'>
                    {employee.experience} years
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className='lg:col-span-2 space-y-6'>
            <div className='bg-background/30 rounded-lg p-6'>
              <h4 className='text-sm font-semibold text-foreground mb-4'>
                Contact Information
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>Email</p>
                  <p className='text-sm text-foreground'>{employee.email}</p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>Phone</p>
                  <p className='text-sm text-foreground'>
                    {employee.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>
                    Location
                  </p>
                  <p className='text-sm text-foreground'>
                    {employee.location || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>
                    Department
                  </p>
                  <p className='text-sm text-foreground'>
                    {employee.department}
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-background/30 rounded-lg p-6'>
              <h4 className='text-sm font-semibold text-foreground mb-4'>
                Employment Details
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>
                    Hire Date
                  </p>
                  <p className='text-sm text-foreground'>
                    {new Date(employee.hireDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>Salary</p>
                  <p className='text-sm text-foreground'>
                    ₹{employee.salary.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>Manager</p>
                  <p className='text-sm text-foreground'>
                    {employee.manager || 'Not assigned'}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-muted-foreground mb-1'>
                    Manager ID
                  </p>
                  <p className='text-sm text-foreground'>
                    {employee.managerId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-background/30 rounded-lg p-6'>
              <h4 className='text-sm font-semibold text-foreground mb-4'>
                Skills & Expertise
              </h4>
              <div className='flex flex-wrap gap-2'>
                {employee.skills?.length > 0 ? (
                  employee.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant='secondary'
                      className='bg-secondary/20 text-secondary border border-secondary/30'
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
        </div>

        {/* Performance Reviews */}
        {employee.performance && employee.performance.length > 0 && (
          <div className='bg-background/30 rounded-lg p-6'>
            <h4 className='text-sm font-semibold text-foreground mb-4'>
              Performance History
            </h4>
            <div className='space-y-3 max-h-60 overflow-y-auto'>
              {employee.performance.map((review, idx) => (
                <div
                  key={idx}
                  className='bg-background/50 rounded-lg p-4 border border-border'
                >
                  <div className='flex justify-between items-start mb-2'>
                    <div>
                      <p className='text-sm font-medium text-foreground'>
                        Performance Review {idx + 1}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {new Date(review.reviewDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <Badge
                      variant='outline'
                      className={`${ratingToNumber(review.rating) >= 4
                          ? 'bg-green-500/20 text-green-500 border-green-500/30'
                          : ratingToNumber(review.rating) >= 3
                            ? 'bg-blue-500/20 text-blue-500 border-blue-500/30'
                            : 'bg-orange-500/20 text-orange-500 border-orange-500/30'
                        }`}
                    >
                      {review.rating} / 5
                    </Badge>
                  </div>
                  {review.comments && (
                    <p className='text-xs text-muted-foreground'>
                      {review.comments}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='flex justify-end mt-6'>
          <Button
            variant='outline'
            onClick={onClose}
            className='px-6 border-border hover:bg-muted'
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}

function InputField({ label, ...props }: any) {
  return (
    <div>
      <label className="text-sm text-muted-foreground">{label}</label>
      <input
        {...props}
        className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-lg"
      />
    </div>
  );
}

function SelectField({ label, options, ...props }: any) {
  return (
    <div>
      <label className="text-sm text-muted-foreground">{label}</label>
      <select
        {...props}
        className="w-full mt-1 px-3 py-2 bg-input border border-border rounded-lg"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function PerformanceReviewModal({
  employee,
  currentUser,
  onClose,
  onReviewAdded,
}: {
  employee: Employee;
  currentUser: Employee | null;
  onClose: () => void;
  onReviewAdded: () => void;
}) {
  const { addReview, updateReview, deleteReview, getReviewsReceived, loading } =
    usePerformanceReviewStore();
  const [reviews, setReviews] = useState<PerformanceReview[]>(
    (employee.performance as PerformanceReview[]) || []
  );
  const [showAddReview, setShowAddReview] = useState(false);
  const [editingReview, setEditingReview] = useState<PerformanceReview | null>(
    null
  );
  const [formData, setFormData] = useState<{
    rating: Rating;
    comments: string;
  }>({
    rating: Rating.III,
    comments: '',
  });

  // Check if current user can add/edit reviews for this employee
  const canManageReviews =
    currentUser &&
    (currentUser.role === 'ADMIN' ||
      currentUser.employeeId === employee.managerId);

  const canEditReview = (review: PerformanceReview) => {
    return currentUser && review.reviewerId === currentUser.employeeId;
  };

  useEffect(() => {
    const handlePress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showAddReview || editingReview) {
          setShowAddReview(false);
          setEditingReview(null);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handlePress);
    return () => document.removeEventListener('keydown', handlePress);
  }, [onClose, showAddReview, editingReview]);

  // Fetch latest reviews
  useEffect(() => {
    if (employee.employeeId) {
      getReviewsReceived(employee.employeeId).then((result) => {
        if (result.success) {
          setReviews(employee.performance || []);
        }
      });
    }
  }, [employee.employeeId, getReviewsReceived]);

  const handleAddReview = () => {
    setShowAddReview(true);
    setEditingReview(null);
    setFormData({ rating: Rating.III, comments: '' });
  };

  const handleEditReview = (review: PerformanceReview) => {
    setEditingReview(review);
    setShowAddReview(false);
    setFormData({ rating: review.rating, comments: review.comments });
  };

  const handleSubmit = async () => {
    if (!formData.comments.trim()) {
      return;
    }

    if (editingReview) {
      // Update existing review
      const result = await updateReview(editingReview.id, {
        employeeId: employee.employeeId,
        rating: formData.rating,
        comments: formData.comments,
      });

      if (result.success) {
        setEditingReview(null);
        onReviewAdded();
        // Refresh reviews
        const updatedReviews = reviews.map((r) =>
          r.id === editingReview.id
            ? { ...r, rating: formData.rating, comments: formData.comments }
            : r
        );
        setReviews(updatedReviews);
      }
    } else {
      // Add new review
      const result = await addReview({
        employeeId: employee.employeeId,
        rating: formData.rating,
        comments: formData.comments,
      });

      if (result.success) {
        setShowAddReview(false);
        onReviewAdded();
      }
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm('Are you sure you want to delete this review?')) {
      const result = await deleteReview(reviewId);
      if (result.success) {
        setReviews(reviews.filter((r) => r.id !== reviewId));
        onReviewAdded();
      }
    }
  };

  const getRatingLabel = (rating: Rating) => {
    const labels = {
      [Rating.I]: 'Poor',
      [Rating.II]: 'Below Average',
      [Rating.III]: 'Average',
      [Rating.IV]: 'Good',
      [Rating.V]: 'Excellent',
    };
    return labels[rating];
  };

  const getRatingColor = (rating: Rating) => {
    const colors = {
      [Rating.I]: 'text-destructive',
      [Rating.II]: 'text-orange-500',
      [Rating.III]: 'text-yellow-500',
      [Rating.IV]: 'text-chart-2',
      [Rating.V]: 'text-accent',
    };
    return colors[rating];
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <Card
        className="bg-card border border-border rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-primary">
              Performance Reviews
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {employee.name} ({employee.employeeId})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Add Review Button */}
        {canManageReviews && !showAddReview && !editingReview && (
          <div className="mb-6">
            <Button
              onClick={handleAddReview}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              Add New Review
            </Button>
          </div>
        )}

        {/* Add/Edit Review Form */}
        {(showAddReview || editingReview) && (
          <Card className="bg-background/50 p-6 mb-6 border border-primary/20 animate-fade-in">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {editingReview ? 'Edit Review' : 'Add New Review'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Rating
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value as Rating })
                  }
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg"
                >
                  {Object.values(Rating).map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} - {getRatingLabel(rating)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Comments
                </label>
                <textarea
                  value={formData.comments}
                  onChange={(e) =>
                    setFormData({ ...formData, comments: e.target.value })
                  }
                  placeholder="Enter your review comments..."
                  rows={4}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !formData.comments.trim()}
                  className="bg-primary text-primary-foreground"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      Saving...
                    </>
                  ) : editingReview ? (
                    'Update Review'
                  ) : (
                    'Submit Review'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddReview(false);
                    setEditingReview(null);
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Review History ({reviews.length})
          </h3>

          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-background/30 rounded-lg">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-muted-foreground">
                No performance reviews yet
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="bg-background/30 p-5 border border-border hover:border-primary/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`px-3 py-1 font-bold text-lg ${getRatingColor(
                          review.rating
                        )}`}
                        variant="outline"
                      >
                        {review.rating}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {getRatingLabel(review.rating)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Reviewed by: {review.reviewerId}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.reviewDate).toLocaleDateString()}
                      </span>
                      {canEditReview(review) && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditReview(review)}
                            disabled={loading}
                            className="hover:border-primary hover:text-primary"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteReview(review.id)}
                            disabled={loading}
                            className="hover:border-destructive hover:text-destructive"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.comments}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 border-border hover:bg-muted"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
}

