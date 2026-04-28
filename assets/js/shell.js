/**
 * AsteraHR ERP — App Shell  (assets/js/shell.js)
 *
 * Renders the sidebar + header into #app-shell and wires
 * up interactive behaviours (mobile menu, notifications,
 * user-card dropdown, logout confirm).
 *
 * Depends on: mock-data.js · session.js · rbac.js · utils.js
 *
 * Usage:
 *   Shell.init({ activeNav:'employees', pageTitle:'Employees', pageSub:'...' });
 */

const Shell = (() => {

  /* ── Init ────────────────────────────────────────────── */
  function init(opts = {}) {
    const {
      activeNav  = 'dashboard',
      allowedRoles = [],
      pageTitle  = 'Dashboard',
      pageSub    = '',
    } = opts;

    const session = Session.require(allowedRoles);
    if (!session) return null;

    _inject(session, pageTitle, pageSub);
    RBAC.buildNav(session, activeNav);
    RBAC.populateSidebar(session);
    RBAC.populateHeader(session, pageTitle, pageSub);
    RBAC.enforceUI(session);
    _bindMobileMenu();
    _bindNotifPanel(session);
    _bindUserCard(session);

    return session;
  }

  /* ── HTML skeleton ───────────────────────────────────── */
  function _inject(session, pageTitle = 'Dashboard', pageSub = '') {
    const shell = document.getElementById('app-shell');
    if (!shell) return;
    shell.innerHTML = `
      <!-- SIDEBAR -->
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-glow"></div>
        <div class="sidebar-shape-a"></div>
        <div class="sidebar-shape-b"></div>
        <div class="sidebar-shape-c"></div>
        <div class="sidebar-brand">
          <div class="brand-seal">A</div>
          <div class="brand-text">
            <strong>AsteraHR</strong>
            <span>People Operations ERP</span>
          </div>
        </div>
        <nav class="sidebar-nav" id="sidebar-nav"></nav>
        <div class="sidebar-footer">
          <div class="user-card" id="user-card">
            <div class="user-av" id="sidebar-av"></div>
            <div class="user-info">
              <strong id="sidebar-name"></strong>
              <span   id="sidebar-title"></span>
            </div>
            <span class="user-chevron">›</span>
          </div>
          <!-- User dropdown -->
          <div id="user-menu" style="
            display:none;position:absolute;bottom:calc(100% + 8px);
            left:12px;right:12px;background:var(--white);
            border:1px solid var(--bdr);border-radius:var(--r-lg);
            box-shadow:var(--sh-l);overflow:hidden;z-index:500;
          ">
            <div style="padding:13px 15px;border-bottom:1px solid var(--bdr-s)">
              <div style="font-size:13px;font-weight:600;color:var(--ink)">${session.name}</div>
              <div style="font-size:11.5px;color:var(--ink-mu)">${session.email}</div>
            </div>
            <a href="${RBAC.dashboardFor(session.role)}"
              style="display:flex;align-items:center;gap:9px;padding:10px 15px;font-size:13.5px;color:var(--ink-m);text-decoration:none;transition:background .12s"
              onmouseover="this.style.background='var(--parch)'"
              onmouseout="this.style.background=''">
              📊 My Dashboard
            </a>
            <a href="${RBAC.hrefFor('my-profile')}"
              style="display:flex;align-items:center;gap:9px;padding:10px 15px;font-size:13.5px;color:var(--ink-m);text-decoration:none;transition:background .12s"
              onmouseover="this.style.background='var(--parch)'"
              onmouseout="this.style.background=''">
              👤 My Profile
            </a>
            <div style="height:1px;background:var(--bdr-s);margin:4px 0"></div>
            <div onclick="Shell.confirmLogout()"
              style="display:flex;align-items:center;gap:9px;padding:10px 15px;font-size:13.5px;color:var(--red);cursor:pointer;transition:background .12s"
              onmouseover="this.style.background='var(--red-p)'"
              onmouseout="this.style.background=''">
              🚪 Sign Out
            </div>
          </div>
        </div>
      </aside>

      <!-- MAIN -->
      <div class="main">
        <!-- HEADER -->
        <header class="header">
          <button class="mobile-menu-btn" id="mobile-menu-btn">☰</button>
          <div class="header-title">
            <h1 id="page-title">${pageTitle}</h1>
            <p  id="page-sub"  class="h-sub">${pageSub}</p>
          </div>
          <div class="header-actions">
            <div class="search-bar">
              <span class="s-icon">🔍</span>
              <input type="text" placeholder="Search…" oninput="Shell.globalSearch(this.value)"/>
            </div>
            <div class="hdr-btn" id="notif-btn" title="Notifications" style="position:relative">
              🔔
              <span class="hdr-badge gold" id="notif-dot" style="display:none"></span>
            </div>
            <span id="role-pill" class="role-pill"></span>
            <div class="hdr-btn" title="Help" onclick="Toast.info('Help documentation coming soon.')">❓</div>
          </div>
        </header>

        <!-- Notification panel -->
        <div class="notif-panel" id="notif-panel">
          <div class="notif-head">
            <span style="font-size:14px;font-weight:600;color:var(--ink)">Notifications</span>
            <span style="font-size:12px;color:var(--navy-l);cursor:pointer;font-weight:500"
              onclick="Shell.markAllRead()">Mark all read</span>
          </div>
          <div id="notif-list"></div>
        </div>
      </div>

      <!-- Mobile backdrop -->
      <div class="mobile-backdrop" id="mobile-backdrop" onclick="document.getElementById('sidebar').classList.remove('open');this.style.display='none'"></div>

      <!-- Change password modal -->
      <div class="modal-overlay" id="change-pwd-modal">
        <div class="modal modal-sm">
          <div class="modal-head">
            <h2>Change Password</h2>
            <button class="modal-close" onclick="closeModal('change-pwd-modal')">✕</button>
          </div>
          <div class="modal-body">
            <div class="fg"><div class="fl"><label for="cp-cur">Current Password</label></div>
              <div class="input-wrap has-right"><span class="i-ico">🔒</span>
                <input type="password" id="cp-cur" placeholder="Current password"/>
                <button class="eye-btn" onclick="toggleEye('cp-cur',this)" tabindex="-1">👁</button>
              </div>
            </div>
            <div class="fg"><div class="fl"><label for="cp-new">New Password</label></div>
              <div class="input-wrap has-right"><span class="i-ico">🔒</span>
                <input type="password" id="cp-new" placeholder="Min. 8 characters"/>
                <button class="eye-btn" onclick="toggleEye('cp-new',this)" tabindex="-1">👁</button>
              </div>
            </div>
            <div class="fg"><div class="fl"><label for="cp-con">Confirm Password</label></div>
              <div class="input-wrap has-right"><span class="i-ico">🔒</span>
                <input type="password" id="cp-con" placeholder="Repeat new password"/>
                <button class="eye-btn" onclick="toggleEye('cp-con',this)" tabindex="-1">👁</button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost btn-sm" onclick="closeModal('change-pwd-modal')">Cancel</button>
            <button class="btn btn-navy btn-sm" id="cp-submit" onclick="Shell.submitChangePwd()">
              <div class="btn-spin anim-spin"></div>
              <span class="btn-text">Update Password</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Page templates define their content outside #app-shell.
    // Move that node into .main so the flex layout stays intact.
    const main = shell.querySelector('.main');
    const pageContent = document.getElementById('page-content');
    if (main && pageContent) main.appendChild(pageContent);
  }

  /* ── Mobile menu ─────────────────────────────────────── */
  function _bindMobileMenu() {
    const btn      = document.getElementById('mobile-menu-btn');
    const sidebar  = document.getElementById('sidebar');
    const backdrop = document.getElementById('mobile-backdrop');
    if (!btn || !sidebar) return;
    btn.addEventListener('click', () => {
      const open = sidebar.classList.toggle('open');
      if (backdrop) backdrop.style.display = open ? 'block' : 'none';
    });
  }

  /* ── Notification panel ──────────────────────────────── */
  function _bindNotifPanel(session) {
    const btn   = document.getElementById('notif-btn');
    const panel = document.getElementById('notif-panel');
    if (!btn || !panel) return;

    _renderNotifs(session);

    btn.addEventListener('click', e => {
      e.stopPropagation();
      panel.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!btn.contains(e.target) && !panel.contains(e.target)) {
        panel.classList.remove('open');
      }
    });
  }

  function _renderNotifs(session) {
    // Demo notifications per role
    const notifs = {
      hr_admin:   [
        { type:'leave',   msg:'Fatuma Kidogo submitted a leave request',  time:'2h ago', read:false },
        { type:'payroll', msg:'June payroll is due for processing',        time:'5h ago', read:false },
        { type:'ats',     msg:'3 new hires synced from ATS',               time:'1d ago', read:true  },
      ],
      hr_officer: [
        { type:'leave',    msg:"Oliver Odhiambo's leave needs approval",   time:'3h ago', read:false },
        { type:'document', msg:'2 contracts expiring this month',           time:'1d ago', read:false },
      ],
      manager: [
        { type:'leave',       msg:'Grace Achieng requested 2 days off',    time:'1h ago', read:false },
        { type:'performance', msg:"Your team's Q2 reviews are 40% done",   time:'3d ago', read:true  },
      ],
      employee: [
        { type:'payroll',  msg:'Your May payslip is ready',                 time:'5d ago', read:false },
        { type:'training', msg:'Leadership Training starts June 24',         time:'2d ago', read:true  },
      ],
      it_admin: [
        { type:'system', msg:'ATS webhook config needs attention',           time:'1h ago', read:false },
        { type:'system', msg:'Failed login attempt from unknown IP',         time:'3h ago', read:false },
      ],
    };

    const list = notifs[session.role] || [];
    const unread = list.filter(n => !n.read).length;
    const dot = document.getElementById('notif-dot');
    if (dot) dot.style.display = unread > 0 ? 'block' : 'none';

    const typeIcon = { leave:'🌴', payroll:'💰', ats:'🔗', document:'📄', performance:'⭐', training:'📚', system:'⚙', default:'🔔' };
    const typeBg   = { leave:'rgba(0,107,66,.10)', payroll:'rgba(200,150,12,.10)', ats:'rgba(31,60,136,.10)', system:'rgba(185,28,28,.08)', default:'var(--parch)' };

    const listEl = document.getElementById('notif-list');
    if (!listEl) return;
    listEl.innerHTML = list.length ? list.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}">
        <div class="notif-icon" style="background:${typeBg[n.type]||typeBg.default}">
          ${typeIcon[n.type]||typeIcon.default}
        </div>
        <div style="flex:1">
          <div class="notif-msg">${n.msg}</div>
          <div class="notif-time">${n.time}</div>
        </div>
        ${!n.read ? '<div class="notif-unread-dot"></div>' : ''}
      </div>
    `).join('') : `
      <div style="padding:28px 16px;text-align:center;color:var(--ink-g);font-size:13px">
        No new notifications
      </div>`;
  }

  /* ── User card / dropdown ────────────────────────────── */
  function _bindUserCard() {
    const card = document.getElementById('user-card');
    const menu = document.getElementById('user-menu');
    if (!card || !menu) return;
    card.addEventListener('click', e => {
      e.stopPropagation();
      menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', () => { if (menu) menu.style.display = 'none'; });
  }

  /* ── Public helpers ──────────────────────────────────── */
  function confirmLogout() {
    showConfirm(
      'Sign Out',
      'Are you sure you want to sign out of AsteraHR?',
      () => Session.destroy('User signed out manually'),
      'danger'
    );
  }

  function markAllRead() {
    document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
    document.querySelectorAll('.notif-unread-dot').forEach(el => el.remove());
    const dot = document.getElementById('notif-dot');
    if (dot) dot.style.display = 'none';
    Toast.success('All notifications marked as read');
  }

  async function submitChangePwd() {
    const cur = document.getElementById('cp-cur')?.value || '';
    const nw  = document.getElementById('cp-new')?.value || '';
    const con = document.getElementById('cp-con')?.value || '';
    if (!cur || !nw || !con) { Toast.warning('All fields are required'); return; }
    if (nw !== con)          { Toast.error('New passwords do not match'); return; }
    const pv = Validate.password(nw);
    if (pv.score < 4)        { Toast.error('Password is too weak'); return; }

    btnLoad('cp-submit', true);
    await new Promise(r => setTimeout(r, 600));
    btnLoad('cp-submit', false);

    const session = Session.get();
    const user    = window.ASTERAHR?.users?.find(u => u.id === session?.userId);
    if (user && user.pwd !== cur) { Toast.error('Current password is incorrect'); return; }
    if (user) user.pwd = nw;

    Session.audit('PASSWORD_CHANGED', 'Password changed by user');
    closeModal('change-pwd-modal');
    Toast.success('Password updated successfully');
  }

  function globalSearch(query) {
    // Placeholder — will route to global search results in a later module
    if (query.trim().length > 2) {
      console.log('[AsteraHR] Global search:', query);
    }
  }

  return { init, confirmLogout, markAllRead, submitChangePwd, globalSearch };

})();

window.Shell = Shell;
