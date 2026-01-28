'use client';

import { Employee, EmployeeCreateData } from '@/store/useEmployeeStore';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { useState } from 'react';

export function NewEmployeeModal({
  isOpen,
  onClose,
  onSubmit,
  employees,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: EmployeeCreateData) => void;
  employees: Employee[];
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
    skills: [] as string[],
    role: 'WORKER',
    manager: '',
    managerId: '',
  });
  const [skillsInput, setSkillsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onSubmit({ ...formData, skills });
    // Reset form after submit
    setFormData({
      name: '',
      email: '',
      department: '',
      phone: '',
      salary: 0,
      location: '',
      experience: 0,
      status: 'ACTIVE',
      skills: [],
      role: 'WORKER',
      manager: '',
      managerId: '',
    });
    setSkillsInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className='bg-card border border-border rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto'
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-2xl font-bold text-primary'>
                Add New Employee
              </h2>
              <button
                onClick={onClose}
                className='text-muted-foreground hover:text-foreground transition-colors'
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Personal Information */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Personal Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-foreground mb-2'>
                      Full Name *
                    </label>
                    <input
                      type='text'
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className='w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20'
                      placeholder='John Doe'
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
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className='w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20'
                      placeholder='employee@company.com'
                    />
                  </div>
                </div>
              </div>

              {/* Job Information */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Job Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-foreground mb-2'>
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value })
                      }
                      className='w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20'
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
                        setFormData({
                          ...formData,
                          status: e.target.value as
                            | 'ACTIVE'
                            | 'INACTIVE'
                            | 'SUSPENDED',
                        })
                      }
                      className='w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20'
                    >
                      <option value='ACTIVE'>Active</option>
                      <option value='INACTIVE'>Inactive</option>
                      <option value='SUSPENDED'>Suspended</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact & Location */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Contact & Location
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-foreground mb-2'>
                      Phone
                    </label>
                    <input
                      type='tel'
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className='w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20'
                      placeholder='+91-9898989898'
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
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className='w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20'
                      placeholder='City, State'
                    />
                  </div>
                </div>
              </div>

              {/* Role & Manager */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Role & Manager Information
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-foreground mb-2'>
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as 'MANAGER' | 'WORKER',
                        })
                      }
                      className='w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20'
                    >
                      <option value='' disabled>
                        Select Role
                      </option>
                      <option value='MANAGER'>Manager</option>
                      <option value='WORKER'>Worker</option>
                    </select>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-foreground mb-2'>
                      Manager
                    </label>
                    <select
                      value={formData.managerId}
                      onChange={(e) => {
                        const selectedManager = employees.find(
                          (emp) => emp.employeeId === e.target.value
                        );
                        if (selectedManager) {
                          setFormData({
                            ...formData,
                            manager: selectedManager.name,
                            managerId: selectedManager.employeeId,
                          });
                        } else {
                          setFormData({
                            ...formData,
                            manager: '',
                            managerId: '',
                          });
                        }
                      }}
                      className='w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20'
                      disabled={formData.role !== 'WORKER'}
                    >
                      <option value=''>Select Manager</option>
                      {employees
                        .filter((emp) => emp.role === 'MANAGER')
                        .map((manager) => (
                          <option
                            key={manager.employeeId}
                            value={manager.employeeId}
                          >
                            {manager.employeeId}: {manager.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Compensation */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Compensation & Experience
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-foreground mb-2'>
                      Salary (₹)
                    </label>
                    <input
                      type='number'
                      min='0'
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          salary: parseInt(e.target.value) || 0,
                        })
                      }
                      className='w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20'
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
                        setFormData({
                          ...formData,
                          experience: parseInt(e.target.value) || 0,
                        })
                      }
                      className='w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20'
                      placeholder='5'
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-foreground'>
                  Skills
                </h3>
                <div>
                  <label className='block text-sm font-medium text-foreground mb-2'>
                    Skills (comma separated)
                  </label>
                  <input
                    type='text'
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className='w-full px-4 py-3 bg-input border border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20'
                    placeholder='Type your skills here seperated by commas'
                  />
                  <p className='text-xs text-muted-foreground mt-1'>
                    Enter skills separated by commas
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className='bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border border-primary/20'>
                <h4 className='text-lg font-semibold text-foreground mb-2'>
                  Employee Summary
                </h4>
                <p className='text-muted-foreground text-sm'>
                  Name:{' '}
                  <span className='font-medium'>{formData.name || '—'}</span>
                </p>
                <p className='text-muted-foreground text-sm'>
                  Department:{' '}
                  <span className='font-medium'>
                    {formData.department || '—'}
                  </span>
                </p>
                <p className='text-muted-foreground text-sm'>
                  Salary:{' '}
                  <span className='font-medium'>₹{formData.salary}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-4 pt-4'>
                <button
                  type='button'
                  onClick={onClose}
                  className='flex-1 py-3 px-6 border border-border text-muted-foreground rounded-lg hover:bg-muted hover:text-foreground transition-all duration-300'
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-300 disabled:opacity-50'
                  disabled={loading}
                >
                  {loading ? (
                    <div className='flex items-center justify-center space-x-2'>
                      <Loader className='animate-spin text-white' size={20} />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Add Employee'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
