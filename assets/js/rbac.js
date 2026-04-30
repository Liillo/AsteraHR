/**
 * AsteraHR ERP - RBAC Engine (assets/js/rbac.js)
 *
 * Reads the permission matrix from window.ASTERAHR (mock-data.js).
 * Exposes: can, meta, allPermissions, appPath, dashboardFor, hrefFor,
 * inDeptScope, isOwnRecord, enforceUI, buildNav, populateSidebar, populateHeader
 */

const RBAC = (() => {
  function _perms(role) { return window.ASTERAHR?.permissions?.[role] || {}; }
  function _roles() { return window.ASTERAHR?.roles || {}; }

  const NAV = [
    {
      group: 'Overview',
      items: [
        { key: 'dashboard', icon: '📊', label: 'Dashboard', roles: ['hr_admin', 'hr_officer', 'manager', 'employee', 'it_admin'] },
        { key: 'announcements', icon: '📢', label: 'Announcements', perm: ['announcements', 'view'], badge: 'announcements' },
      ],
    },
    {
      group: 'Workforce',
      items: [
        { key: 'employees', icon: '👥', label: 'Employees', perm: ['employees', 'view'], roles: ['hr_admin', 'hr_officer', 'manager'] },
        { key: 'my-profile', icon: '🧾', label: 'My Profile', roles: ['hr_admin', 'hr_officer', 'manager', 'employee', 'it_admin'] },
        { key: 'org-chart', icon: '🗂', label: 'Org Chart', perm: ['employees', 'view'], roles: ['hr_admin', 'hr_officer', 'manager'] },
        { key: 'ats', icon: '🔗', label: 'ATS Bridge', perm: ['ats', 'view'], roles: ['hr_admin', 'it_admin'] },
      ],
    },
    {
      group: 'Time & Attendance',
      items: [
        { key: 'attendance', icon: '🕐', label: 'Attendance', perm: ['attendance', 'view'] },
        { key: 'leave', icon: '🌴', label: 'Leave', perm: ['leave', 'view'], badge: 'leave' },
        { key: 'calendar', icon: '🗓', label: 'Calendar', roles: ['hr_admin', 'hr_officer', 'manager', 'employee'] },
        { key: 'shifts', icon: '🔄', label: 'Shifts', perm: ['attendance', 'view'], roles: ['hr_admin', 'hr_officer', 'manager'] },
      ],
    },
    {
      group: 'Finance',
      items: [
        { key: 'payroll', icon: '💰', label: 'Payroll', perm: ['payroll', 'view'], roles: ['hr_admin', 'hr_officer'] },
        { key: 'payslips', icon: '💳', label: 'My Payslips', perm: ['payroll', 'view'], roles: ['employee'] },
      ],
    },
    {
      group: 'Performance',
      items: [
        { key: 'performance', icon: '⭐', label: 'Performance', perm: ['performance', 'view'] },
        { key: 'training', icon: '📚', label: 'Training', perm: ['training', 'view'] },
      ],
    },
    {
      group: 'Records',
      items: [
        { key: 'documents', icon: '📄', label: 'Documents', perm: ['documents', 'view'] },
        { key: 'reports', icon: '📈', label: 'Reports', perm: ['reports', 'view'], roles: ['hr_admin', 'hr_officer', 'manager'] },
      ],
    },
    {
      group: 'System',
      items: [
        { key: 'rbac', icon: '🔑', label: 'Roles & Permissions', perm: ['rbac', 'view'], roles: ['it_admin'] },
        { key: 'system-logs', icon: '📋', label: 'System Logs', perm: ['system_logs', 'view'], roles: ['it_admin', 'hr_admin'] },
        { key: 'settings', icon: '⚙', label: 'Settings', perm: ['settings', 'view'] },
      ],
    },
  ];

  const HREF = {
    dashboard: '',
    announcements: 'modules/announcements/board.html',
    employees: 'modules/employees/list.html',
    'my-profile': 'modules/employees/profile.html',
    'org-chart': 'modules/employees/org-chart.html',
    ats: 'modules/ats-middleware/sync-dashboard.html',
    attendance: 'modules/attendance/register.html',
    leave: 'modules/leave/requests.html',
    calendar: 'modules/calendar/view.html',
    shifts: 'modules/attendance/shifts.html',
    payroll: 'modules/payroll/run-payroll.html',
    payslips: 'modules/payroll/payslips.html',
    performance: 'modules/performance/appraisals.html',
    training: 'modules/training/catalogue.html',
    documents: 'modules/documents/repository.html',
    reports: 'modules/reports/analytics.html',
    rbac: 'modules/settings/rbac.html',
    'system-logs': 'modules/settings/system-logs.html',
    settings: 'modules/settings/organisation.html',
  };

  const BADGES = {
    leave: { hr_admin: 7, hr_officer: 5, manager: 2, employee: 0, it_admin: 0 },
    announcements: { hr_admin: 1, hr_officer: 1, manager: 2, employee: 3, it_admin: 1 },
  };

  function can(role, module, action) {
    return !!(_perms(role)?.[module]?.[action]);
  }

  function meta(role) {
    return _roles()[role] || { label: role, icon: '👤', col: '#888', bg: '#eee' };
  }

  function allPermissions(role) {
    return _perms(role);
  }

  function appPath(file) {
    if (!file || file === '#') return file || '#';
    if (/^(?:[a-z]+:)?\/\//i.test(file) || file.startsWith('#')) return file;
    const path = window.location.pathname.replace(/\\/g, '/');
    let prefix = './';
    if (path.includes('/modules/')) prefix = '../../';
    else if (path.includes('/dashboards/')) prefix = '../';
    return prefix + file.replace(/^\.\//, '');
  }

  function dashboardFor(role) {
    return appPath(window.ASTERAHR?.dashboards?.[role] || 'login.html');
  }

  function hrefFor(key) {
    return appPath(HREF[key] || '#');
  }

  function keyForPath(path) {
    if (!path || path === '#') return '';
    const clean = String(path).replace(/^\.\//, '').replace(/^\/+/, '');
    return Object.entries(HREF).find(([, href]) => href === clean)?.[0] || '';
  }

  function canAccessNav(session, key) {
    if (!session || !key) return false;
    if (key === 'dashboard') return true;

    for (const group of NAV) {
      const item = group.items.find(entry => entry.key === key);
      if (item) return _itemVisible(item, session);
    }
    return false;
  }

  function inDeptScope(session, targetDept) {
    if (['hr_admin', 'hr_officer'].includes(session.role)) return true;
    if (session.role === 'manager') return session.department === targetDept;
    return false;
  }

  function isOwnRecord(session, targetUserId) {
    return session.userId === targetUserId;
  }

  function enforceUI(session) {
    function hide(el) {
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('[data-perm]').forEach(el => {
      const [mod, act] = el.getAttribute('data-perm').split('.');
      if (!can(session.role, mod, act)) hide(el);
    });

    document.querySelectorAll('[data-roles]').forEach(el => {
      const allowed = el.getAttribute('data-roles').split(',').map(r => r.trim());
      if (!allowed.includes(session.role)) hide(el);
    });

    document.querySelectorAll('[data-hide-roles]').forEach(el => {
      const blocked = el.getAttribute('data-hide-roles').split(',').map(r => r.trim());
      if (blocked.includes(session.role)) hide(el);
    });
  }

  function buildNav(session, activeKey = '') {
    const nav = document.getElementById('sidebar-nav');
    if (!nav) return;
    nav.innerHTML = '';

    NAV.forEach(group => {
      const visible = group.items.filter(item => _itemVisible(item, session));
      if (!visible.length) return;

      const lbl = document.createElement('div');
      lbl.className = 'nav-group-label';
      lbl.textContent = group.group;
      nav.appendChild(lbl);

      visible.forEach(item => {
        const a = document.createElement('a');
        a.className = 'nav-item' + (item.key === activeKey ? ' active' : '');
        a.setAttribute('data-key', item.key);
        a.href = item.key === 'dashboard' ? dashboardFor(session.role) : hrefFor(item.key);

        const count = item.badge ? (BADGES[item.badge]?.[session.role] ?? 0) : 0;
        const badgeHtml = count > 0 ? `<span class="nav-badge">${count}</span>` : '';

        a.innerHTML = `
          <span class="nav-icon">${item.icon}</span>
          <span class="nav-label">${item.label}</span>
          ${badgeHtml}
        `;
        nav.appendChild(a);
      });
    });
  }

  function _itemVisible(item, session) {
    if (item.roles && !item.roles.includes(session.role)) return false;
    if (item.perm) {
      const [mod, act] = item.perm;
      if (!can(session.role, mod, act)) return false;
    }
    return true;
  }

  function populateSidebar(session) {
    const av = document.getElementById('sidebar-av');
    const name = document.getElementById('sidebar-name');
    const title = document.getElementById('sidebar-title');
    if (av) {
      av.textContent = session.avatar;
      av.style.background = `linear-gradient(135deg, ${session.color}, ${session.color}bb)`;
    }
    if (name) name.textContent = session.name;
    if (title) title.textContent = session.title;
  }

  function populateHeader(session, pageTitle = '', pageSub = '') {
    const roleMeta = meta(session.role);

    if (pageTitle) {
      const h1 = document.getElementById('page-title');
      if (h1) h1.textContent = pageTitle;
    }
    if (pageSub) {
      const sub = document.getElementById('page-sub');
      if (sub) sub.textContent = pageSub;
    }

    const pill = document.getElementById('role-pill');
    if (pill) {
      pill.textContent = `${roleMeta.icon}  ${roleMeta.label}`;
      pill.style.cssText = `
        display:inline-flex;align-items:center;gap:5px;
        padding:4px 11px;border-radius:999px;
        font-size:11.5px;font-weight:600;letter-spacing:.2px;
        background:${roleMeta.bg};color:${roleMeta.col};
        border:1px solid ${roleMeta.col}30;
      `;
    }
  }

  return {
    can,
    meta,
    allPermissions,
    appPath,
    dashboardFor,
    hrefFor,
    keyForPath,
    canAccessNav,
    inDeptScope,
    isOwnRecord,
    enforceUI,
    buildNav,
    populateSidebar,
    populateHeader,
  };
})();

window.RBAC = RBAC;
