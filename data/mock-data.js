/**
 * AsteraHR ERP - Mock Data (data/mock-data.js)
 * Single source of truth for all demo data.
 * Replace with real API calls in production.
 */

const ASTERAHR = {
  users: [
    {
      id: 'USR-001', role: 'hr_admin',
      name: 'John Mwangi', title: 'HR Administrator',
      email: 'j.mwangi@asterahr.co.ke', pwd: 'Admin@2025',
      dept: null, av: 'JM', col: '#1F3C88',
      mfa: true, mc: false,
    },
    {
      id: 'USR-002', role: 'hr_officer',
      name: 'Amina Odhiambo', title: 'HR Officer',
      email: 'a.odhiambo@asterahr.co.ke', pwd: 'Officer@2025',
      dept: null, av: 'AO', col: '#006B42',
      mfa: false, mc: false,
    },
    {
      id: 'USR-003', role: 'manager',
      name: 'Samuel Kariuki', title: 'Head of Engineering',
      email: 's.kariuki@asterahr.co.ke', pwd: 'Manager@2025',
      dept: 'Engineering', av: 'SK', col: '#8B5C00',
      mfa: false, mc: false,
    },
    {
      id: 'USR-004', role: 'employee',
      name: 'Grace Achieng', title: 'Senior Engineer',
      email: 'g.achieng@asterahr.co.ke', pwd: 'Employee@2025',
      dept: 'Engineering', av: 'GA', col: '#3D4CB5',
      mfa: false, mc: false,
    },
    {
      id: 'USR-005', role: 'it_admin',
      name: "Kevin Ndung'u", title: 'IT System Administrator',
      email: 'k.ndungu@asterahr.co.ke', pwd: 'ITAdmin@2025',
      dept: 'ICT', av: 'KN', col: '#9B1C1C',
      mfa: true, mc: false,
    },
  ],

  roles: {
    hr_admin: { label: 'HR Administrator', icon: '🛡', col: '#1F3C88', bg: 'rgba(31,60,136,.10)' },
    hr_officer: { label: 'HR Officer', icon: '👩‍💼', col: '#006B42', bg: 'rgba(0,107,66,.10)' },
    manager: { label: 'Dept. Manager', icon: '🏢', col: '#8B5C00', bg: 'rgba(139,92,0,.10)' },
    employee: { label: 'Employee', icon: '👤', col: '#3D4CB5', bg: 'rgba(61,76,181,.10)' },
    it_admin: { label: 'IT Administrator', icon: '⚙', col: '#9B1C1C', bg: 'rgba(155,28,28,.10)' },
  },

  dashboards: {
    hr_admin: 'dashboards/hr-admin.html',
    hr_officer: 'dashboards/hr-officer.html',
    manager: 'dashboards/manager.html',
    employee: 'dashboards/employee.html',
    it_admin: 'dashboards/it-admin.html',
  },

  permissions: {
    hr_admin: {
      employees: { view:1, create:1, edit:1, delete:1, approve:1 },
      payroll: { view:1, create:1, edit:1, delete:1, approve:1 },
      leave: { view:1, create:1, edit:1, delete:1, approve:1 },
      attendance: { view:1, create:1, edit:1, delete:1, approve:1 },
      performance: { view:1, create:1, edit:1, delete:1, approve:1 },
      training: { view:1, create:1, edit:1, delete:1, approve:1 },
      documents: { view:1, create:1, edit:1, delete:1, approve:1 },
      announcements: { view:1, create:1, edit:1, delete:1, approve:1 },
      ats: { view:1, create:1, edit:1, delete:0, approve:1 },
      reports: { view:1, create:1, edit:0, delete:0, approve:0 },
      settings: { view:1, create:1, edit:1, delete:0, approve:0 },
      rbac: { view:1, create:0, edit:0, delete:0, approve:0 },
      system_logs: { view:1, create:0, edit:0, delete:0, approve:0 },
    },
    hr_officer: {
      employees: { view:1, create:1, edit:1, delete:0, approve:0 },
      payroll: { view:1, create:1, edit:0, delete:0, approve:0 },
      leave: { view:1, create:1, edit:1, delete:0, approve:1 },
      attendance: { view:1, create:1, edit:1, delete:0, approve:1 },
      performance: { view:1, create:1, edit:1, delete:0, approve:0 },
      training: { view:1, create:1, edit:1, delete:0, approve:0 },
      documents: { view:1, create:1, edit:1, delete:0, approve:0 },
      announcements: { view:1, create:1, edit:1, delete:0, approve:0 },
      ats: { view:1, create:0, edit:0, delete:0, approve:0 },
      reports: { view:1, create:0, edit:0, delete:0, approve:0 },
      settings: { view:0, create:0, edit:0, delete:0, approve:0 },
      rbac: { view:0, create:0, edit:0, delete:0, approve:0 },
      system_logs: { view:0, create:0, edit:0, delete:0, approve:0 },
    },
    manager: {
      employees: { view:1, create:0, edit:0, delete:0, approve:0 },
      payroll: { view:0, create:0, edit:0, delete:0, approve:0 },
      leave: { view:1, create:0, edit:0, delete:0, approve:1 },
      attendance: { view:1, create:0, edit:1, delete:0, approve:1 },
      performance: { view:1, create:1, edit:1, delete:0, approve:1 },
      training: { view:1, create:0, edit:0, delete:0, approve:0 },
      documents: { view:1, create:0, edit:0, delete:0, approve:0 },
      announcements: { view:1, create:1, edit:0, delete:0, approve:0 },
      ats: { view:0, create:0, edit:0, delete:0, approve:0 },
      reports: { view:1, create:0, edit:0, delete:0, approve:0 },
      settings: { view:0, create:0, edit:0, delete:0, approve:0 },
      rbac: { view:0, create:0, edit:0, delete:0, approve:0 },
      system_logs: { view:0, create:0, edit:0, delete:0, approve:0 },
    },
    employee: {
      employees: { view:0, create:0, edit:0, delete:0, approve:0 },
      payroll: { view:1, create:0, edit:0, delete:0, approve:0 },
      leave: { view:1, create:1, edit:0, delete:0, approve:0 },
      attendance: { view:1, create:1, edit:0, delete:0, approve:0 },
      performance: { view:1, create:1, edit:0, delete:0, approve:0 },
      training: { view:1, create:1, edit:0, delete:0, approve:0 },
      documents: { view:1, create:0, edit:0, delete:0, approve:0 },
      announcements: { view:1, create:0, edit:0, delete:0, approve:0 },
      ats: { view:0, create:0, edit:0, delete:0, approve:0 },
      reports: { view:0, create:0, edit:0, delete:0, approve:0 },
      settings: { view:0, create:0, edit:0, delete:0, approve:0 },
      rbac: { view:0, create:0, edit:0, delete:0, approve:0 },
      system_logs: { view:0, create:0, edit:0, delete:0, approve:0 },
    },
    it_admin: {
      employees: { view:0, create:0, edit:0, delete:0, approve:0 },
      payroll: { view:0, create:0, edit:0, delete:0, approve:0 },
      leave: { view:0, create:0, edit:0, delete:0, approve:0 },
      attendance: { view:1, create:1, edit:0, delete:0, approve:0 },
      performance: { view:0, create:0, edit:0, delete:0, approve:0 },
      training: { view:0, create:0, edit:0, delete:0, approve:0 },
      documents: { view:0, create:0, edit:0, delete:0, approve:0 },
      announcements: { view:1, create:0, edit:0, delete:0, approve:0 },
      ats: { view:1, create:1, edit:1, delete:1, approve:1 },
      reports: { view:1, create:0, edit:0, delete:0, approve:0 },
      settings: { view:1, create:1, edit:1, delete:1, approve:1 },
      rbac: { view:1, create:1, edit:1, delete:1, approve:1 },
      system_logs: { view:1, create:0, edit:0, delete:0, approve:0 },
    },
  },

  moduleData: {
    announcements: [
      { title:'Policy Refresh', detail:'Revised remote work guidelines published to all staff.', audience:'All employees', status:'Delivered', context:'Company-wide', public:true },
      { title:'Engineering Sprint Demo', detail:'Department demo moved to Thursday at 2:00 PM.', audience:'Engineering', status:'Delivered', context:'Engineering', dept:'Engineering' },
      { title:'Benefits Reminder', detail:'Medical cover dependants window closes on Friday.', audience:'All employees', status:'Scheduled', context:'Company-wide', public:true },
      { title:'Finance Audit Prep', detail:'Finance document submissions due before month end.', audience:'Finance', status:'Draft', context:'Finance', dept:'Finance' },
      { title:'IT Maintenance Notice', detail:'VPN maintenance starts Saturday at 11:00 PM.', audience:'All employees', status:'Scheduled', context:'Company-wide', public:true },
    ],
    employees: [
      { name:'Grace Achieng', event:'Profile updated', status:'Completed', dept:'Engineering', detail:'Emergency contact updated' },
      { name:'James Otieno', event:'Probation review due', status:'Pending', dept:'Engineering', detail:'Manager check-in due this week' },
      { name:'Mercy Wanjiku', event:'New joiner setup', status:'Open', dept:'Engineering', detail:'Onboarding documents pending' },
      { name:'Peter Kamau', event:'Contract uploaded', status:'Completed', dept:'Finance', detail:'Renewal pack filed' },
      { name:'Lydia Njeri', event:'Record update', status:'Pending', dept:'Operations', detail:'National ID renewal needed' },
    ],
    profile: [
      { userId:'USR-004', title:'National ID upload', detail:'Submitted and awaiting verification.', status:'In review', context:'Today' },
      { userId:'USR-004', title:'Bank detail change', detail:'Approved successfully.', status:'Completed', context:'2 days ago' },
      { userId:'USR-004', title:'Address update', detail:'Saved but not yet submitted.', status:'Draft', context:'1 week ago' },
      { userId:'USR-003', title:'Emergency contact review', detail:'Needs confirmation for your own manager profile.', status:'Pending', context:'This week' },
      { userId:'USR-002', title:'Personal file refresh', detail:'KRA PIN scan uploaded.', status:'Completed', context:'Yesterday' },
      { userId:'USR-001', title:'Payroll profile check', detail:'No outstanding profile issues.', status:'Clear', context:'Current' },
      { userId:'USR-005', title:'Access contact details', detail:'Confirm secondary emergency contact.', status:'Pending', context:'Current' },
    ],
    attendance: [
      { userId:'USR-004', name:'Grace Achieng', event:'Check-in recorded', status:'Completed', context:'Head office', dept:'Engineering', issue:false, attendanceDate:'2026-05-04', checkIn:'08:01 AM', checkOut:'05:04 PM' },
      { userId:'USR-004', name:'Grace Achieng', event:'Correction submitted', status:'Pending', context:'Missing checkout', dept:'Engineering', issue:true, attendanceDate:'2026-05-03', checkIn:'08:03 AM', checkOut:'Missing' },
      { userId:'USR-003', name:'James Otieno', event:'Late arrival', status:'Open', context:'09:17 AM', dept:'Engineering', issue:true, attendanceDate:'2026-05-04', checkIn:'09:17 AM', checkOut:'05:11 PM' },
      { userId:'USR-003', name:'Mercy Wanjiku', event:'Remote check-in', status:'Completed', context:'07:48 AM', dept:'Engineering', issue:false, attendanceDate:'2026-05-04', checkIn:'07:48 AM', checkOut:'04:52 PM' },
      { userId:'USR-003', name:'Daniel Kariuki', event:'Missing checkout', status:'Pending', context:'Yesterday', dept:'Engineering', issue:true, attendanceDate:'2026-05-03', checkIn:'08:12 AM', checkOut:'Missing' },
      { userId:'USR-002', name:'Amina Odhiambo', event:'Remote check-in', status:'Completed', context:'HR Office', dept:'HR', issue:false, attendanceDate:'2026-05-04', checkIn:'07:46 AM', checkOut:'04:58 PM' },
      { userId:'USR-001', name:'John Mwangi', event:'On-site check-in', status:'Completed', context:'Head office', dept:'HR', issue:false, attendanceDate:'2026-05-04', checkIn:'07:39 AM', checkOut:'05:20 PM' },
      { userId:'USR-005', name:"Kevin Ndung'u", event:'Check-in recorded', status:'Completed', context:'ICT support desk', dept:'ICT', issue:false, attendanceDate:'2026-05-04', checkIn:'08:09 AM', checkOut:'05:13 PM' },
    ],
    leave: [
      { userId:'USR-004', name:'Grace Achieng', type:'Annual leave', days:'2 working days', status:'Pending', dept:'Engineering', detail:'Requested yesterday' },
      { userId:'USR-004', name:'Grace Achieng', type:'Sick leave', days:'1 day', status:'Approved', dept:'Engineering', detail:'Last month' },
      { userId:'USR-003', name:'James Otieno', type:'Annual leave', days:'3 working days', status:'Pending', dept:'Engineering', detail:'Awaiting manager review' },
      { userId:'USR-003', name:'Mercy Wanjiku', type:'Study leave', days:'2 working days', status:'Open', dept:'Engineering', detail:'Overlap check needed' },
      { userId:'USR-002', name:'Amina Odhiambo', type:'Annual leave', days:'4 working days', status:'Approved', dept:'HR', detail:'Approved this week' },
      { userId:'USR-001', name:'John Mwangi', type:'Annual leave', days:'5 working days', status:'Approved', dept:'HR', detail:'Future booking' },
    ],
    performance: [
      { userId:'USR-004', name:'Grace Achieng', item:'Self assessment', status:'Completed', context:'Today', dept:'Engineering', detail:'Submitted successfully' },
      { userId:'USR-004', name:'Grace Achieng', item:'Manager feedback', status:'Open', context:'Next step', dept:'Engineering', detail:'Awaiting manager response' },
      { userId:'USR-003', name:'James Otieno', item:'Manager review', status:'Open', context:'Engineering', dept:'Engineering', detail:'Pending completion' },
      { userId:'USR-003', name:'Mercy Wanjiku', item:'Growth plan', status:'Upcoming', context:'Engineering', dept:'Engineering', detail:'Coaching checkpoint scheduled' },
      { userId:'USR-002', name:'Amina Odhiambo', item:'Self review', status:'Completed', context:'HR', dept:'HR', detail:'Submitted this week' },
    ],
    training: [
      { userId:'USR-004', name:'Grace Achieng', courseId:'data-protection', course:'Data Protection & Privacy', status:'Completed', context:'Recorded', dept:'Engineering', required:true, progress:100 },
      { userId:'USR-004', name:'Grace Achieng', courseId:'leadership-essentials', course:'Leadership Essentials', status:'Scheduled', context:'Friday', dept:'Engineering', required:false, progress:25 },
      { userId:'USR-004', name:'Grace Achieng', course:'Coaching basics', status:'Bookmarked', context:'Not started', dept:'Engineering', required:false },
      { userId:'USR-003', name:'James Otieno', course:'Compliance refresh', status:'Open', context:'Engineering', dept:'Engineering', required:true },
      { userId:'USR-003', name:'Mercy Wanjiku', courseId:'leadership-essentials', course:'Leadership Essentials', status:'Scheduled', context:'Engineering', dept:'Engineering', required:false, progress:25 },
      { userId:'USR-002', name:'Amina Odhiambo', courseId:'compliance-refresh', course:'Labour Law & Compliance', status:'Completed', context:'HR', dept:'HR', required:true, progress:100 },
    ],
    documents: [
      { title:'Employee handbook', type:'Public policy', status:'Available', context:'All staff', public:true },
      { title:'Code of conduct', type:'Public policy', status:'Available', context:'All staff', public:true },
      { title:'Leave policy', type:'Public policy', status:'Available', context:'All staff', public:true },
      { title:'KRA PIN copy', type:'Personal record', status:'Requested', context:'My profile', userId:'USR-004', dept:'Engineering' },
      { title:'Signed contract', type:'Personal record', status:'Available', context:'My profile', userId:'USR-004', dept:'Engineering' },
      { title:'Manager handbook', type:'Shared document', status:'Available', context:'Engineering', dept:'Engineering' },
      { title:'Onboarding checklist', type:'Shared resource', status:'Available', context:'Engineering', dept:'Engineering' },
      { title:'Required ID copy', type:'Personal follow-up', status:'Pending', context:'Engineering', dept:'Engineering' },
    ],
    reports: [
      { title:'Attendance digest', audience:'Manager summary', status:'Scheduled', context:'Engineering', dept:'Engineering' },
      { title:'Leave overlap', audience:'Team planning', status:'Scheduled', context:'Engineering', dept:'Engineering' },
      { title:'Headcount snapshot', audience:'Monthly summary', status:'Ready', context:'Engineering', dept:'Engineering' },
      { title:'Payroll pack', audience:'HR leadership', status:'Scheduled', context:'All departments' },
      { title:'Training completion', audience:'HR dashboard', status:'Ready', context:'All departments' },
    ],
  },

  auditLog: [
    { a:'SYSTEM_START', d:'ERP platform initialised', s:'ok', u:'System', ts:new Date(Date.now() - 600000).toISOString() },
    { a:'PAGE_LOAD', d:'Login page loaded', s:'ok', u:'Anonymous', ts:new Date(Date.now() - 5000).toISOString() },
  ],
};

(() => {
  const STORAGE_KEY = 'asterahr_admin_data';

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function initials(name) {
    return String(name || 'User').split(' ').slice(0, 2).map(part => part[0] || '').join('').toUpperCase() || 'US';
  }

  function zeroPermissions() {
    return Object.fromEntries(Object.keys(ASTERAHR.permissions.hr_admin).map(module => [
      module,
      { view:0, create:0, edit:0, delete:0, approve:0 },
    ]));
  }

  function hydrate() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      ['users', 'roles', 'dashboards', 'permissions', 'moduleData'].forEach(key => {
        if (saved[key]) ASTERAHR[key] = saved[key];
      });
    } catch {
      /* ignore broken persisted data */
    }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        users: ASTERAHR.users,
        roles: ASTERAHR.roles,
        dashboards: ASTERAHR.dashboards,
        permissions: ASTERAHR.permissions,
        moduleData: ASTERAHR.moduleData,
      }));
    } catch {
      /* ignore storage failures in demo mode */
    }
  }

  function createEmployee(payload) {
    const roleMeta = ASTERAHR.roles[payload.role] || ASTERAHR.roles.employee;
    const id = `USR-${String(Date.now()).slice(-6)}`;
    const user = {
      id,
      role: payload.role,
      name: payload.name,
      title: payload.title,
      email: payload.email.toLowerCase(),
      pwd: payload.password || 'Welcome@2026',
      dept: payload.department || null,
      av: initials(payload.name),
      col: roleMeta.col || '#475569',
      mfa: false,
      mc: true,
    };

    ASTERAHR.users.push(user);
    ASTERAHR.moduleData.employees.push({
      name: user.name,
      event: 'New employee added',
      status: 'Open',
      dept: user.dept || 'General',
      detail: 'Profile created from admin form',
    });
    ASTERAHR.moduleData.profile.push({
      userId: user.id,
      title: 'Profile created',
      detail: 'Complete your personal and payroll details.',
      status: 'Pending',
      context: 'New account',
    });
    ASTERAHR.moduleData.documents.push({
      title: `${user.name} onboarding pack`,
      type: 'Personal record',
      status: 'Requested',
      context: 'My profile',
      userId: user.id,
      dept: user.dept || 'General',
    });
      ASTERAHR.moduleData.attendance.push({
        userId: user.id,
        name: user.name,
        event: 'Attendance profile created',
        status: 'Ready',
        context: 'Awaiting first check-in',
        dept: user.dept || 'General',
        issue: false,
        attendanceDate: new Date().toISOString().slice(0, 10),
        checkIn: 'Not recorded',
        checkOut: 'Not recorded',
      });
    ASTERAHR.moduleData.leave.push({
      userId: user.id,
      name: user.name,
      type: 'Leave balance profile',
      days: '0 booked days',
      status: 'Ready',
      dept: user.dept || 'General',
      detail: 'Leave record initialized',
    });
    ASTERAHR.moduleData.performance.push({
      userId: user.id,
      name: user.name,
      item: 'Performance profile created',
      status: 'Ready',
      context: 'Awaiting first cycle',
      dept: user.dept || 'General',
      detail: 'New profile seeded from admin form',
    });
    ASTERAHR.moduleData.training.push({
      userId: user.id,
      name: user.name,
      course: 'Orientation learning path',
      status: 'Open',
      context: 'Assigned automatically',
      dept: user.dept || 'General',
      required: true,
    });
    persist();
    return user;
  }

  function createRole(payload) {
    const key = String(payload.key || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
    if (!key) throw new Error('Role key is required.');
    if (ASTERAHR.roles[key]) throw new Error('Role already exists.');

    const basePerms = payload.copyFrom && ASTERAHR.permissions[payload.copyFrom]
      ? deepClone(ASTERAHR.permissions[payload.copyFrom])
      : zeroPermissions();

    ASTERAHR.roles[key] = {
      label: payload.label || key,
      icon: payload.icon || '👤',
      col: payload.color || '#475569',
      bg: payload.bg || 'rgba(71,85,105,.10)',
    };
    ASTERAHR.permissions[key] = basePerms;
    ASTERAHR.dashboards[key] = payload.dashboard || 'dashboards/employee.html';
    persist();
    return key;
  }

  function updateRolePermissions(roleKey, permissions) {
    ASTERAHR.permissions[roleKey] = deepClone(permissions);
    persist();
  }

  function updateRoleMeta(roleKey, meta) {
    ASTERAHR.roles[roleKey] = { ...(ASTERAHR.roles[roleKey] || {}), ...meta };
    persist();
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }

  hydrate();

  ASTERAHR.store = {
    persist,
    reset,
    createEmployee,
    createRole,
    updateRolePermissions,
    updateRoleMeta,
    zeroPermissions,
  };
})();

window.ASTERAHR = ASTERAHR;
