/**
 * Role-based navigation access map.
 *
 * Key   = route path (matches the `route` field in sidebar NavItem)
 * Value = array of roles allowed to see that nav item.
 *
 * Rules:
 *  - 'Admin' is handled separately — always sees everything.
 *  - An empty array `[]` means visible to every authenticated user.
 *  - Any route NOT listed here is hidden from all non-admin users.
 */
export const ROLE_NAV_ACCESS: Record<string, string[]> = {
  // ── Core ────────────────────────────────────────────
  '/dashboard': [], // all roles

  // ── Patient Care ────────────────────────────────────
  '/patients':     ['Reception', 'Nurse', 'Doctor', 'Lab Technician', 'Pharmacist', 'Accountant'],
  '/appointments': ['Reception', 'Doctor'],

  // ── Clinical ────────────────────────────────────────
  '/reception':    ['Reception'],
  '/nursing':      ['Nurse', 'Doctor'],
  '/doctor':       ['Doctor'],
  '/laboratory':   ['Nurse', 'Doctor', 'Lab Technician'],
  '/radiology':    ['Doctor'],
  '/pharmacy':     ['Doctor', 'Pharmacist'],
  '/billing':      ['Reception', 'Accountant'],

  // ── Hospital ────────────────────────────────────────
  '/operations':   ['Doctor'],
  '/admissions':   ['Reception', 'Nurse', 'Doctor'],
  '/rooms':        ['Reception', 'Nurse'],
  '/housekeeping': [], // visible only if explicitly listed; blank = none except admin via override

  // ── Specialties ─────────────────────────────────────
  '/ophthalmology':['Doctor'],
  '/dental':       ['Doctor'],

  // ── Administration ──────────────────────────────────
  '/audit':           ['Accountant'],
  '/reports':         ['Accountant'],
  '/settings':        [], // none – admin only (handled by admin bypass)
  '/user-management': [], // none – admin only
};

/** Admin role identifier — always bypasses access checks. */
export const ADMIN_ROLE = 'Admin';
