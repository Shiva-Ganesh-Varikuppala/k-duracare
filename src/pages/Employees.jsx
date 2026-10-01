import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ChevronRight, Phone, LayoutGrid, List, UserCheck, ChevronLeft, X, Save, User } from 'lucide-react';
import { employees, departments } from '../data/employees';
import { toast } from 'react-hot-toast';

const shiftColors = {
  'Morning': { color: '#FBBF24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  'Evening': { color: '#38BDF8', bg: 'rgba(14,165,233,0.12)', border: 'rgba(14,165,233,0.25)' },
  'Night':   { color: '#C084FC', bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.25)' },
  'General': { color: '#34D399', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
};

const statusColors = {
  'Active':    { color: '#34D399', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)' },
  'On Leave':  { color: '#FBBF24', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' },
  'Inactive':  { color: '#F87171', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)' },
  'Probation': { color: '#FB923C', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)' },
};

function StatusBadge({ status }) {
  const c = statusColors[status] || statusColors['Active'];
  return (
    <span style={{ background: c.bg, border: `1px solid ${c.border}`, color: c.color, fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 100 }}>
      {status}
    </span>
  );
}

function AddEmployeeModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: '', designation: '', department: departments[0]?.name || '', shift: 'General', phone: '', email: '', status: 'Active', joinDate: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.designation || !form.phone) {
      toast.error('Please fill required fields (Name, Designation, Phone)');
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    onAdd({ ...form, id: `KD-EMP-${String(employees.length + 1).padStart(4, '0')}` });
    toast.success(`${form.name} added to the workforce!`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-glass" style={{ width: '100%', maxWidth: 540 }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>Add New Employee</h3>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>Enroll a new staff member to K-DuraCare</p>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px' }}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="input-label">Full Name *</label>
                <input className="input-field" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Dr. Ravi Shankar" required />
              </div>
              <div>
                <label className="input-label">Designation *</label>
                <input className="input-field" value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))} placeholder="Senior Nurse" required />
              </div>
              <div>
                <label className="input-label">Department *</label>
                <select className="input-field" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Shift</label>
                <select className="input-field" value={form.shift} onChange={e => setForm(p => ({ ...p, shift: e.target.value }))}>
                  {['Morning', 'Evening', 'Night', 'General'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Status</label>
                <select className="input-field" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                  {['Active', 'Probation'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Phone *</label>
                <input className="input-field" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="98765 43210" required />
              </div>
              <div>
                <label className="input-label">Join Date</label>
                <input type="date" className="input-field" value={form.joinDate} onChange={e => setForm(p => ({ ...p, joinDate: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <label className="input-label">Email</label>
                <input type="email" className="input-field" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="employee@kduracare.in" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              {saving ? 'Adding...' : <><Save style={{ width: 14, height: 14 }} /> Add Employee</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Employees() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [empList, setEmpList] = useState(employees);
  const PER_PAGE = 18;

  const filtered = empList.filter(e =>
    (deptFilter === 'All' || e.department === deptFilter) &&
    (statusFilter === 'All' || e.status === statusFilter) &&
    (e.name.toLowerCase().includes(search.toLowerCase()) ||
     e.id.toLowerCase().includes(search.toLowerCase()) ||
     e.designation.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAdd = (newEmp) => {
    setEmpList(prev => [newEmp, ...prev]);
  };

  // Avatar gradient per letter
  const getAvatarGrad = (name) => {
    const gradients = [
      'linear-gradient(135deg, #0EA5E9, #6366F1)',
      'linear-gradient(135deg, #8B5CF6, #EC4899)',
      'linear-gradient(135deg, #10B981, #06B6D4)',
      'linear-gradient(135deg, #F59E0B, #EF4444)',
      'linear-gradient(135deg, #6366F1, #0EA5E9)',
    ];
    return gradients[name.charCodeAt(0) % gradients.length];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>
            Workforce Directory
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>
            {filtered.length} clinical, administrative & support personnel
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          <Plus style={{ width: 15, height: 15 }} /> Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card flex flex-wrap items-center gap-3" style={{ padding: '14px 18px' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(255,255,255,0.3)' }} />
          <input
            type="text"
            placeholder="Search by name, ID or designation..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="input-field"
            style={{ paddingLeft: 36, fontSize: 12 }}
          />
        </div>
        <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1); }} className="input-field" style={{ width: 'auto', fontSize: 12 }}>
          <option value="All">All Departments</option>
          {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field" style={{ width: 'auto', fontSize: 12 }}>
          <option value="All">All Statuses</option>
          {['Active', 'On Leave', 'Inactive', 'Probation'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        {/* View switcher */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 3, marginLeft: 'auto' }}>
          {[
            { id: 'grid', Icon: LayoutGrid },
            { id: 'table', Icon: List },
          ].map(({ id, Icon }) => (
            <button
              key={id}
              onClick={() => setViewMode(id)}
              style={{
                padding: '6px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: viewMode === id ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: viewMode === id ? '#fff' : 'rgba(255,255,255,0.4)',
              }}
            >
              <Icon style={{ width: 15, height: 15 }} />
            </button>
          ))}
        </div>
      </div>

      {/* CARD GRID */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {paged.map(emp => {
            const sc = statusColors[emp.status] || statusColors['Active'];
            const shiftC = shiftColors[emp.shift] || shiftColors['General'];
            return (
              <div
                key={emp.id}
                className="glass-card-hover"
                style={{ padding: 20 }}
                onClick={() => navigate(`/employees/${emp.id}`)}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div style={{
                      width: 46, height: 46, borderRadius: 14,
                      background: getAvatarGrad(emp.name),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 15, fontWeight: 800, color: '#fff',
                      flexShrink: 0,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                      transition: 'transform 0.3s ease',
                    }}>
                      {emp.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {emp.name}
                      </p>
                      <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                        {emp.id}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={emp.status} />
                </div>

                {/* Details */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Role</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)', textAlign: 'right', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.designation}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Department</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#38BDF8', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 6, padding: '2px 8px' }}>{emp.department}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Shift</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: shiftC.color, background: shiftC.bg, border: `1px solid ${shiftC.border}`, borderRadius: 6, padding: '2px 8px' }}>
                      {emp.shift || 'General'}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12, marginTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="flex items-center gap-1.5">
                    <Phone style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.3)' }} />
                    <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.4)' }}>{emp.phone}</span>
                  </div>
                  <div className="flex items-center gap-1" style={{ color: '#38BDF8', fontSize: 11, fontWeight: 700 }}>
                    View 360° <ChevronRight style={{ width: 12, height: 12 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="glass-card animate-fade-in" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                  {['Employee', 'Department', 'Designation', 'Shift', 'Status', 'Phone', ''].map(h => (
                    <th key={h} className="table-header" style={{ textAlign: h === '' ? 'center' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map(emp => (
                  <tr key={emp.id} className="table-row" style={{ cursor: 'pointer' }} onClick={() => navigate(`/employees/${emp.id}`)}>
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: getAvatarGrad(emp.name), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{emp.name}</p>
                          <p style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.3)' }}>{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell" style={{ fontSize: 12 }}>
                      <span style={{ color: '#38BDF8', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>{emp.department}</span>
                    </td>
                    <td className="table-cell" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{emp.designation}</td>
                    <td className="table-cell">
                      {(() => {
                        const sc = shiftColors[emp.shift] || shiftColors['General'];
                        return <span style={{ fontSize: 11, fontWeight: 600, color: sc.color, background: sc.bg, border: `1px solid ${sc.border}`, borderRadius: 6, padding: '2px 8px' }}>{emp.shift || 'General'}</span>;
                      })()}
                    </td>
                    <td className="table-cell"><StatusBadge status={emp.status} /></td>
                    <td className="table-cell" style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: 'rgba(255,255,255,0.4)' }}>{emp.phone}</td>
                    <td className="table-cell" style={{ textAlign: 'center' }}>
                      <button className="btn-icon" style={{ padding: 6 }} onClick={e => { e.stopPropagation(); navigate(`/employees/${emp.id}`); }}>
                        <ChevronRight style={{ width: 14, height: 14 }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="glass-card flex items-center justify-between flex-wrap gap-3" style={{ padding: '14px 20px' }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          Showing <strong style={{ color: '#fff' }}>{(page - 1) * PER_PAGE + 1}</strong>–<strong style={{ color: '#fff' }}>{Math.min(page * PER_PAGE, filtered.length)}</strong> of <span style={{ color: '#38BDF8', fontWeight: 700 }}>{filtered.length}</span> staff
        </p>
        <div className="flex items-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary" style={{ fontSize: 12, padding: '7px 14px' }}>
            <ChevronLeft style={{ width: 13, height: 13 }} /> Prev
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + Math.max(1, page - 2)).filter(n => n <= totalPages).map(n => (
            <button key={n} onClick={() => setPage(n)} style={{
              width: 32, height: 32, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: n === page ? 'linear-gradient(135deg, #0EA5E9, #6366F1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${n === page ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
              color: n === page ? '#fff' : 'rgba(255,255,255,0.5)',
              transition: 'all 0.2s ease',
            }}>{n}</button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="btn-secondary" style={{ fontSize: 12, padding: '7px 14px' }}>
            Next <ChevronRight style={{ width: 13, height: 13 }} />
          </button>
        </div>
      </div>

      {showAdd && <AddEmployeeModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
    </div>
  );
}
