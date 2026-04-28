/**
 * AsteraHR ERP — Session Manager  (assets/js/session.js)
 *
 * Handles: save · get · require (page guard) · refresh ·
 *          destroy (logout) · inactivity timer · audit log
 *
 * Depends on: data/mock-data.js  (for ASTERAHR.auditLog)
 *
 * Usage on every protected page:
 *   const session = Session.require(['hr_admin', 'hr_officer']);
 *   if (!session) return;   // already redirected
 */

const Session = (() => {

  const KEY       = 'asterahr_session';
  const TIMEOUT   = 30 * 60 * 1000;   // 30 minutes
  let   _timer    = null;

  /* ── Path helpers ──────────────────────────────────── */
  // Works from any subdirectory depth
  function _rootPath(file) {
    const path = window.location.pathname.replace(/\\/g, '/');
    let prefix = './';
    if (path.includes('/modules/')) prefix = '../../';
    else if (path.includes('/dashboards/')) prefix = '../';
    return prefix + file;
  }

  /* ── Storage ───────────────────────────────────────── */
  function _read() {
    try   { return JSON.parse(sessionStorage.getItem(KEY)); }
    catch { return null; }
  }
  function _write(data) { sessionStorage.setItem(KEY, JSON.stringify(data)); }
  function _clear()     { sessionStorage.removeItem(KEY); }

  /* ── Public: get() ─────────────────────────────────── */
  function get() {
    const s = _read();
    if (!s) return null;
    if (new Date(s.expiresAt) < new Date()) { _clear(); return null; }
    return s;
  }

  /* ── Public: save(user) ────────────────────────────── */
  function save(user) {
    const now = Date.now();
    const s = {
      userId:     user.id,
      role:       user.role,
      name:       user.name,
      email:      user.email,
      title:      user.title,
      department: user.dept  || null,
      avatar:     user.av,
      color:      user.col,
      mfaEnabled: !!user.mfa,
      loginTime:  new Date(now).toISOString(),
      expiresAt:  new Date(now + TIMEOUT).toISOString(),
    };
    _write(s);
    audit('LOGIN', `Signed in successfully${user.mfa ? ' (MFA verified)' : ''}`);
    _startTimer();
    return s;
  }

  /* ── Public: refresh() ─────────────────────────────── */
  function refresh() {
    const s = _read();
    if (!s) return;
    s.expiresAt = new Date(Date.now() + TIMEOUT).toISOString();
    _write(s);
    _resetTimer();
  }

  /* ── Public: destroy(reason) ───────────────────────── */
  function destroy(reason = 'User logged out') {
    audit('LOGOUT', reason);
    _clear();
    _stopTimer();
    _unbindActivity();
    window.location.href = _rootPath('login.html');
  }

  /* ── Public: require(allowedRoles) ─────────────────── */
  function require(allowedRoles = []) {
    const s = get();
    if (!s) {
      window.location.href = _rootPath('login.html');
      return null;
    }
    if (allowedRoles.length && !allowedRoles.includes(s.role)) {
      window.location.href = _rootPath('unauthorized.html');
      return null;
    }
    _startTimer();
    _bindActivity();
    return s;
  }

  /* ── Public: audit(action, detail, status) ─────────── */
  function audit(action, detail = '', status = 'ok') {
    const s = _read();
    const entry = {
      a: action,
      d: detail,
      s: status,
      u: s ? s.name : 'Anonymous',
      r: s ? s.role : '—',
      ts: new Date().toISOString(),
    };
    // Append to mock DB if available
    if (window.ASTERAHR?.auditLog) {
      window.ASTERAHR.auditLog.unshift(entry);
      if (window.ASTERAHR.auditLog.length > 500) window.ASTERAHR.auditLog.pop();
    }
    // Also keep a separate sessionStorage copy for the logs page
    try {
      const log = JSON.parse(sessionStorage.getItem('asterahr_audit') || '[]');
      log.unshift(entry);
      sessionStorage.setItem('asterahr_audit', JSON.stringify(log.slice(0, 500)));
    } catch { /* storage full */ }
    return entry;
  }

  /* ── Public: getAuditLog() ─────────────────────────── */
  function getAuditLog() {
    if (window.ASTERAHR?.auditLog) return window.ASTERAHR.auditLog;
    try { return JSON.parse(sessionStorage.getItem('asterahr_audit') || '[]'); }
    catch { return []; }
  }

  /* ── Inactivity timer (private) ────────────────────── */
  function _startTimer() {
    _stopTimer();
    _timer = setTimeout(_onTimeout, TIMEOUT);
  }
  function _resetTimer() {
    _stopTimer();
    _timer = setTimeout(_onTimeout, TIMEOUT);
  }
  function _stopTimer() {
    if (_timer) { clearTimeout(_timer); _timer = null; }
  }
  function _onTimeout() {
    _clear();
    _unbindActivity();
    _showTimeoutModal();
  }

  /* ── Activity binding (private) ────────────────────── */
  let _lastActivity = 0;
  function _throttledRefresh() {
    const now = Date.now();
    if (now - _lastActivity > 30_000) { _lastActivity = now; refresh(); }
  }
  function _bindActivity() {
    ['mousemove','keydown','click','scroll','touchstart'].forEach(e =>
      document.addEventListener(e, _throttledRefresh, { passive: true })
    );
  }
  function _unbindActivity() {
    ['mousemove','keydown','click','scroll','touchstart'].forEach(e =>
      document.removeEventListener(e, _throttledRefresh)
    );
  }

  /* ── Timeout modal (private) ────────────────────────── */
  function _showTimeoutModal() {
    document.getElementById('_timeout_modal')?.remove();
    const el = document.createElement('div');
    el.id = '_timeout_modal';
    el.style.cssText =
      'position:fixed;inset:0;background:rgba(9,24,48,.6);z-index:9999;' +
      'display:flex;align-items:center;justify-content:center;backdrop-filter:blur(5px);' +
      'font-family:Outfit,system-ui,sans-serif;';
    el.innerHTML = `
      <div style="background:#fff;border-radius:18px;padding:40px 36px;max-width:380px;
                  width:90%;text-align:center;box-shadow:0 32px 80px rgba(9,24,48,.28)">
        <div style="font-size:46px;margin-bottom:12px">⏰</div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:600;
                   color:#0A1628;margin-bottom:8px">Session Expired</h2>
        <p style="font-size:13.5px;color:#5A6B85;line-height:1.65;margin-bottom:28px">
          You've been signed out due to 30 minutes of inactivity.<br>
          Please sign in again to continue.
        </p>
        <button onclick="window.location.href='${_rootPath('login.html')}'"
          style="width:100%;padding:12px;background:#0F2249;color:#fff;border:none;
                 border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;
                 font-family:Outfit,system-ui,sans-serif;">
          Return to Login
        </button>
      </div>`;
    document.body.appendChild(el);
  }

  /* ── Public API ─────────────────────────────────────── */
  return { get, save, require, destroy, refresh, audit, getAuditLog };

})();

window.Session = Session;
