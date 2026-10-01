import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  ChevronRight,
  Phone,
  LayoutGrid,
  List,
  ChevronLeft,
  X,
  Mail,
  User,
} from 'lucide-react';
import { employees as initialEmployees, departments } from '../data/employees';
import { toast } from 'react-hot-toast';
import Badge from '../components/ui/badge/Badge';
import Button from '../components/ui/button/Button';
import PageBreadcrumb from '../components/common/PageBreadcrumb';
import ComponentCard from '../components/common/ComponentCard';

const shiftColorMap = {
  Morning: 'warning',
  Evening: 'info',
  Night: 'purple',
  General: 'success',
};

const statusColorMap = {
  Active: 'success',
  'On Leave': 'warning',
  Inactive: 'error',
  Probation: 'primary',
};

function AddEmployeeModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '',
    designation: '',
    department: departments[0]?.name || '',
    shift: 'General',
    phone: '',
    email: '',
    status: 'Active',
    joinDate: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.designation || !form.phone) {
      toast.error('Please fill required fields (Name, Designation, Phone)');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    onAdd({
      ...form,
      id: `KD-EMP-${String(initialEmployees.length + 1).padStart(4, '0')}`,
      avatar: form.name.charAt(0),
    });
    toast.success(`${form.name} enrolled into workforce!`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              Enroll New Employee
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Register new hospital personnel into K-DuraCare
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Full Name *
              </label>
              <input
                className="tail-input text-xs"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Dr. Ravi Shankar"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Designation *
              </label>
              <input
                className="tail-input text-xs"
                value={form.designation}
                onChange={(e) => setForm((p) => ({ ...p, designation: e.target.value }))}
                placeholder="Senior Consultant"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Department *
              </label>
              <select
                className="tail-input text-xs"
                value={form.department}
                onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Assigned Shift
              </label>
              <select
                className="tail-input text-xs"
                value={form.shift}
                onChange={(e) => setForm((p) => ({ ...p, shift: e.target.value }))}
              >
                {['Morning', 'Evening', 'Night', 'General'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Contact Phone *
              </label>
              <input
                className="tail-input text-xs"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={saving}>
              {saving ? 'Enrolling...' : 'Save & Issue ID'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Employees() {
  const navigate = useNavigate();
  const [empList, setEmpList] = useState(initialEmployees);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [shiftFilter, setShiftFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'
  const [showAddModal, setShowAddModal] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = empList.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'ALL' || e.department === deptFilter;
    const matchShift = shiftFilter === 'ALL' || e.shift === shiftFilter;
    return matchSearch && matchDept && matchShift;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-6">
      <PageBreadcrumb
        pageTitle="Staff & Workforce Directory"
        items={[{ label: 'Workforce', path: '/employees' }, { label: 'All Employees' }]}
      />

      {/* Filters and Controls Card */}
      <ComponentCard className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, ID or role..."
              className="tail-input pl-10 text-xs h-10"
            />
          </div>

          {/* Department, Shift filters, View toggle & Add button */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <select
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setPage(1);
              }}
              className="tail-input text-xs h-10 w-auto py-1 px-3"
            >
              <option value="ALL">All Departments ({departments.length})</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>

            <select
              value={shiftFilter}
              onChange={(e) => {
                setShiftFilter(e.target.value);
                setPage(1);
              }}
              className="tail-input text-xs h-10 w-auto py-1 px-3"
            >
              <option value="ALL">All Shifts</option>
              <option value="Morning">Morning Shift</option>
              <option value="Evening">Evening Shift</option>
              <option value="Night">Night Shift</option>
              <option value="General">General Shift</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 p-0.5 bg-gray-50 dark:bg-gray-800">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-700 text-brand-500 shadow-theme-xs'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-700 text-brand-500 shadow-theme-xs'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            <Button
              variant="primary"
              size="sm"
              startIcon={<Plus className="h-4 w-4" />}
              onClick={() => setShowAddModal(true)}
            >
              Add Staff
            </Button>
          </div>
        </div>
      </ComponentCard>

      {/* Directory Content (Table or Grid) */}
      {viewMode === 'list' ? (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-800/40 text-gray-500 dark:text-gray-400 uppercase font-semibold tracking-wider border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Staff Member</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Shift</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Attendance</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {paginated.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => navigate(`/employees/${emp.id}`)}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 font-bold text-white text-xs">
                          {emp.avatar || emp.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white">
                            {emp.name}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            {emp.id} · {emp.designation}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-gray-700 dark:text-gray-300">
                      {emp.department}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge color={shiftColorMap[emp.shift] || 'light'} size="sm">
                        {emp.shift}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge color={statusColorMap[emp.status] || 'light'} size="sm">
                        {emp.status}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${emp.attendancePercent}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-gray-600 dark:text-gray-400">
                          {emp.attendancePercent}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/employees/${emp.id}`);
                        }}
                        className="p-1 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 px-4 py-3 sm:px-6">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Showing {(page - 1) * perPage + 1} to{' '}
              {Math.min(page * perPage, filtered.length)} of {filtered.length} staff
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 px-2.5 py-1 text-xs text-gray-600 dark:text-gray-300 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Previous
              </button>
              <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                {page} / {totalPages || 1}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 px-2.5 py-1 text-xs text-gray-600 dark:text-gray-300 disabled:opacity-40"
              >
                Next <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {paginated.map((emp) => (
            <div
              key={emp.id}
              onClick={() => navigate(`/employees/${emp.id}`)}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] shadow-theme-xs hover:border-brand-400 dark:hover:border-brand-500/40 cursor-pointer transition-all hover:shadow-theme-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white font-bold text-sm shadow-theme-xs">
                  {emp.avatar || emp.name.charAt(0)}
                </div>
                <Badge color={statusColorMap[emp.status] || 'light'} size="sm">
                  {emp.status}
                </Badge>
              </div>

              <h4 className="text-sm font-bold text-gray-800 dark:text-white truncate">
                {emp.name}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {emp.designation}
              </p>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">{emp.department}</span>
                <Badge color={shiftColorMap[emp.shift] || 'light'} size="sm">
                  {emp.shift}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newEmp) => setEmpList((prev) => [newEmp, ...prev])}
        />
      )}
    </div>
  );
}
