import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import type { Employee } from '@shared/types';
import { DEPARTMENTS, EMPLOYEE_ROLES, STATUSES } from '@shared/types';
import { api, ApiError } from '@/lib/api';
import { formatDate, toIsoDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, EmptyState, Skeleton } from '@/components/ui/Card';
import { Input, Select } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { SearchInput } from '@/components/ui/SearchInput';
import { useNotify } from '@/components/ui/Toast';
import { OutputPanel, PracticeGrid } from './PracticeGrid';

type SortBy = 'id' | 'name' | 'email' | 'department' | 'role' | 'salary' | 'status' | 'joined';

interface FormState {
  name: string;
  email: string;
  department: string;
  role: string;
  salary: string;
  status: Employee['status'];
  joined: string;
}

const emptyForm = (): FormState => ({
  name: '',
  email: '',
  department: 'Engineering',
  role: 'SDET',
  salary: '65000',
  status: 'Active',
  joined: toIsoDate(new Date()),
});

const statusTone = (status: Employee['status']) =>
  status === 'Active' ? 'success' : status === 'On leave' ? 'warning' : 'danger';

export function WebTableModule() {
  const notify = useNotify();
  const [rows, setRows] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Employee | null>(null);
  const [lastAction, setLastAction] = useState<string>('No action performed yet.');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.employees.list({ search, page, pageSize, sortBy, sortDir });
      setRows(response.data.items);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
      if (response.data.page !== page) setPage(response.data.page);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load employees');
    } finally {
      setLoading(false);
    }
  }, [search, page, pageSize, sortBy, sortDir]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  // Debounced search so the table does not refetch on every keystroke.
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const sort = (column: SortBy) => {
    if (sortBy === column) setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    else {
      setSortBy(column);
      setSortDir('asc');
    }
    setPage(1);
    setLastAction(`Sorted by ${column} ${sortBy === column && sortDir === 'asc' ? 'descending' : 'ascending'}.`);
  };

  const toggleRow = (id: number) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const allOnPageSelected = rows.length > 0 && rows.every((row) => selected.includes(row.id));

  const toggleAll = () => {
    if (allOnPageSelected) setSelected((current) => current.filter((id) => !rows.some((row) => row.id === id)));
    else setSelected((current) => [...new Set([...current, ...rows.map((row) => row.id)])]);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setFormErrors({});
    setModalOpen(true);
    setLastAction('Opened the add employee dialog.');
  };

  const openEdit = (employee: Employee) => {
    setEditing(employee);
    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      role: employee.role,
      salary: String(employee.salary),
      status: employee.status,
      joined: employee.joined,
    });
    setFormErrors({});
    setModalOpen(true);
    setLastAction(`Editing ${employee.name}.`);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (form.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(form.email.trim())) errors.email = 'Enter a valid email address';
    if (form.role.trim().length < 2) errors.role = 'Role is required';
    const salary = Number(form.salary);
    if (!Number.isFinite(salary) || salary < 0 || salary > 1000000) errors.salary = 'Salary must be between 0 and 1,000,000';
    if (!form.joined) errors.joined = 'Join date is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      department: form.department,
      role: form.role.trim(),
      salary: Number(form.salary),
      status: form.status,
      joined: form.joined,
    };
    try {
      if (editing) {
        const response = await api.employees.update(editing.id, payload);
        setLastAction(`Updated employee #${response.data.id} (${response.data.name}).`);
        notify.success('Employee updated', response.data.name);
      } else {
        const response = await api.employees.create(payload);
        setLastAction(`Created employee #${response.data.id} (${response.data.name}).`);
        notify.success('Employee created', response.data.name);
      }
      setModalOpen(false);
      setRefreshKey((key) => key + 1);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not save the employee';
      if (err instanceof ApiError && err.details?.length) {
        setFormErrors(Object.fromEntries(err.details.map((detail, index) => [`${index}-${detail}`, detail])));
      }
      setLastAction(`Save failed: ${message}`);
      notify.error('Save failed', message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await api.employees.remove(deleting.id);
      setLastAction(`Deleted employee #${deleting.id} (${deleting.name}).`);
      notify.success('Employee deleted', deleting.name);
      setSelected((current) => current.filter((id) => id !== deleting.id));
      setDeleting(null);
      setRefreshKey((key) => key + 1);
    } catch (err) {
      notify.error('Delete failed', err instanceof ApiError ? err.message : 'Unknown error');
    }
  };

  const header = (column: SortBy, label: string) => {
    const active = sortBy === column;
    const Icon = active ? (sortDir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
    return (
      <th scope="col" className="whitespace-nowrap px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <button
          type="button"
          onClick={() => sort(column)}
          className="inline-flex items-center gap-1 transition hover:text-brand-700 dark:hover:text-white"
          data-testid={`table-sort-${column}`}
          aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
        >
          {label}
          <Icon className={`h-3 w-3 ${active ? 'text-brand-600 dark:text-brand-300' : 'text-slate-400'}`} aria-hidden />
        </button>
      </th>
    );
  };

  const selectedNames = useMemo(
    () => rows.filter((row) => selected.includes(row.id)).map((row) => row.name),
    [rows, selected],
  );

  return (
    <PracticeGrid
      aside={
        <>
          <Card testId="table-selection">
            <CardHeader icon={<Users className="h-4 w-4" aria-hidden />} title="Selection" description="Rows selected across this page." />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100" data-testid="table-selected-count">
              {selected.length} selected
            </p>
            <p className="mt-1 min-h-8 text-xs text-slate-500 dark:text-slate-400" data-testid="table-selected-names">
              {selectedNames.length ? selectedNames.join(', ') : 'No rows selected'}
            </p>
            <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => setSelected([])} disabled={selected.length === 0} data-testid="table-clear-selection">
              Clear selection
            </Button>
          </Card>
          <OutputPanel title="Last action" tone="info" testId="table-last-action">
            <p className="text-xs" data-testid="table-last-action-text">
              {lastAction}
            </p>
          </OutputPanel>
        </>
      }
    >
      <Card testId="web-table">
        <CardHeader
          icon={<Users className="h-4 w-4" aria-hidden />}
          title="Employee management"
          description="Backed by a real Express + SQLite API: search, sort, paginate and run full CRUD."
          actions={
            <>
              <Button size="sm" variant="outline" leftIcon={<RefreshCw className="h-3.5 w-3.5" aria-hidden />} onClick={() => setRefreshKey((k) => k + 1)} data-testid="table-refresh">
                Refresh
              </Button>
              <Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" aria-hidden />} onClick={openAdd} data-testid="table-add">
                Add Employee
              </Button>
            </>
          }
        />

        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search name, email, department, role or status…"
              aria-label="Search employees"
              className="field pl-9"
              data-testid="table-search"
            />
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            Rows
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              className="field h-9 w-20 py-1 text-xs"
              data-testid="table-page-size"
              aria-label="Rows per page"
            >
              {[5, 10, 20].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300" role="alert" data-testid="table-error">
            {error} — check that the API server is running (<code className="font-mono">npm run dev:api</code>).
          </div>
        ) : null}

        <div className="scrollbar-thin w-full max-w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800" data-testid="table-employees" aria-label="Employees">
            <caption className="sr-only">Employee management table</caption>
            <thead className="bg-slate-50 dark:bg-slate-900/80">
              <tr>
                <th scope="col" className="w-10 px-3 py-2">
                  <input
                    type="checkbox"
                    aria-label="Select all rows on this page"
                    checked={allOnPageSelected}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-slate-300 accent-brand-700"
                    data-testid="table-select-all"
                  />
                </th>
                {header('name', 'Name')}
                {header('email', 'Email')}
                {header('department', 'Department')}
                {header('role', 'Role')}
                {header('salary', 'Salary')}
                {header('status', 'Status')}
                {header('joined', 'Joined')}
                <th scope="col" className="px-3 py-2 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-900" data-testid="table-body">
              {loading
                ? Array.from({ length: pageSize }).map((_, index) => (
                    <tr key={`skeleton-${index}`}>
                      <td colSpan={9} className="px-3 py-2">
                        <Skeleton className="h-6 w-full" />
                      </td>
                    </tr>
                  ))
                : rows.map((employee) => (
                    <tr
                      key={employee.id}
                      data-testid={`table-row-${employee.id}`}
                      className={
                        selected.includes(employee.id)
                          ? 'bg-brand-50/70 dark:bg-brand-950/30'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }
                    >
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          aria-label={`Select ${employee.name}`}
                          checked={selected.includes(employee.id)}
                          onChange={() => toggleRow(employee.id)}
                          className="h-4 w-4 rounded border-slate-300 accent-brand-700"
                          data-testid={`table-select-row-${employee.id}`}
                        />
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 font-semibold text-slate-800 dark:text-slate-100" data-testid="table-cell-name">
                        {employee.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-600 dark:text-slate-300" data-testid="table-cell-email">
                        {employee.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-600 dark:text-slate-300">{employee.department}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-600 dark:text-slate-300">{employee.role}</td>
                      <td className="whitespace-nowrap px-3 py-2 tabular-nums text-slate-600 dark:text-slate-300" data-testid="table-cell-salary">
                        ${employee.salary.toLocaleString('en-US')}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <Badge tone={statusTone(employee.status)}>{employee.status}</Badge>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-slate-600 dark:text-slate-300">{formatDate(employee.joined)}</td>
                      <td className="whitespace-nowrap px-3 py-2 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(employee)}
                            aria-label={`Edit ${employee.name}`}
                            className="rounded-md p-1.5 text-slate-500 transition hover:bg-accent-50 hover:text-accent-700 dark:hover:bg-accent-950/40 dark:hover:text-accent-300"
                            data-testid={`table-edit-${employee.id}`}
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleting(employee)}
                            aria-label={`Delete ${employee.name}`}
                            className="rounded-md p-1.5 text-slate-500 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-300"
                            data-testid={`table-delete-${employee.id}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              {!loading && rows.length === 0 && !error ? (
                <tr>
                  <td colSpan={9} className="px-3 py-8">
                    <EmptyState
                      icon={<Search className="h-6 w-6" aria-hidden />}
                      title="No employees found"
                      description={search ? `No records match “${search}”. Try a different search.` : 'Add your first employee to get started.'}
                    />
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-slate-500 dark:text-slate-400" data-testid="table-summary">
            {loading ? <Loader2 className="inline h-3 w-3 animate-spin" aria-hidden /> : null} Showing{' '}
            <strong>{rows.length}</strong> of <strong>{total}</strong> employees · page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1 || loading}
              aria-label="Previous page"
              data-testid="table-prev-page"
              leftIcon={<ChevronLeft className="h-3.5 w-3.5" aria-hidden />}
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter((value) => Math.abs(value - page) <= 1 || value === 1 || value === totalPages)
              .map((value, index, list) => (
                <span key={value} className="flex items-center gap-1">
                  {index > 0 && value - list[index - 1] > 1 ? <span className="px-1 text-xs text-slate-400">…</span> : null}
                  <button
                    type="button"
                    onClick={() => setPage(value)}
                    aria-current={value === page ? 'page' : undefined}
                    data-testid={`table-page-${value}`}
                    className={
                      value === page
                        ? 'h-8 min-w-8 rounded-md bg-brand-700 px-2 text-xs font-bold text-white'
                        : 'h-8 min-w-8 rounded-md px-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }
                  >
                    {value}
                  </button>
                </span>
              ))}
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages || loading}
              aria-label="Next page"
              data-testid="table-next-page"
              rightIcon={<ChevronRight className="h-3.5 w-3.5" aria-hidden />}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit ${editing.name}` : 'Add employee'}
        testId="employee-modal"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="employee-form" loading={saving} data-testid="employee-save">
              {editing ? 'Save changes' : 'Create employee'}
            </Button>
          </>
        }
      >
        <form id="employee-form" onSubmit={save} className="grid gap-3 sm:grid-cols-2" noValidate>
          <Input
            label="Full name"
            name="employee-name"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            error={formErrors.name}
            errorTestId="employee-error-name"
            required
            data-testid="employee-name"
            wrapperClassName="sm:col-span-2"
          />
          <Input
            label="Email"
            name="employee-email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            error={formErrors.email}
            errorTestId="employee-error-email"
            required
            data-testid="employee-email"
            wrapperClassName="sm:col-span-2"
          />
          <Select
            label="Department"
            name="employee-department"
            value={form.department}
            onChange={(event) => setForm((current) => ({ ...current, department: event.target.value }))}
            options={DEPARTMENTS.map((department) => ({ value: department, label: department }))}
            data-testid="employee-department"
          />
          <Input
            label="Role"
            name="employee-role"
            list="employee-role-options"
            value={form.role}
            onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
            error={formErrors.role}
            errorTestId="employee-error-role"
            required
            data-testid="employee-role"
          />
          <datalist id="employee-role-options">
            {EMPLOYEE_ROLES.map((role) => (
              <option key={role} value={role} />
            ))}
          </datalist>
          <Input
            label="Salary"
            name="employee-salary"
            type="number"
            min={0}
            step={500}
            value={form.salary}
            onChange={(event) => setForm((current) => ({ ...current, salary: event.target.value }))}
            error={formErrors.salary}
            errorTestId="employee-error-salary"
            required
            data-testid="employee-salary"
          />
          <Select
            label="Status"
            name="employee-status"
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as Employee['status'] }))}
            options={STATUSES.map((status) => ({ value: status, label: status }))}
            data-testid="employee-status"
          />
          <Input
            label="Joined"
            name="employee-joined"
            type="date"
            value={form.joined}
            onChange={(event) => setForm((current) => ({ ...current, joined: event.target.value }))}
            error={formErrors.joined}
            errorTestId="employee-error-joined"
            required
            data-testid="employee-joined"
          />
          {Object.keys(formErrors).some((key) => key.includes('-')) ? (
            <ul className="sm:col-span-2 list-disc rounded-lg bg-red-50 px-5 py-2 text-xs text-red-700 dark:bg-red-950/40 dark:text-red-300">
              {Object.entries(formErrors)
                .filter(([key]) => key.includes('-'))
                .map(([key, message]) => (
                  <li key={key}>{message}</li>
                ))}
            </ul>
          ) : null}
        </form>
      </Modal>

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete employee"
        testId="delete-modal"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => void confirmDelete()} data-testid="delete-confirm">
              <Trash2 className="h-4 w-4" aria-hidden /> Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Are you sure you want to delete <strong>{deleting?.name}</strong>? This removes the record from the database and
          cannot be undone.
        </p>
      </Modal>

      <div className="mt-2">
        <SearchInput value="" onChange={() => undefined} className="hidden" />
      </div>
    </PracticeGrid>
  );
}
