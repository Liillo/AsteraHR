/**
 * AsteraHR ERP — Login Controller  (assets/js/login-ctrl.js)
 *
 * All interactive logic for login.html.
 * Depends on: mock-data.js · utils.js · session.js
 */

const LoginCtrl = (() => {

  /* ── State ── */
  let _mfaPending  = null;  // { userId, otp }
  let _resendTimer = null;

  /* ── Boot ────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    // Already logged in? Redirect immediately
    const session = Session.get();
    if (session) {
      window.location.href = RBAC.dashboardFor(session.role);
      return;
    }
    _buildDemoPills();
    _buildOTPCells();
  });

  /* ── Step navigation ─────────────────────────────────── */
  function goStep(id) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  /* ── Demo pills ──────────────────────────────────────── */
  const DEMOS = [
    { label: '🛡 HR Admin',   idx: 0 },
    { label: '👩‍💼 HR Officer', idx: 1 },
    { label: '🏢 Manager',    idx: 2 },
    { label: '👤 Employee',   idx: 3 },
    { label: '⚙ IT Admin',   idx: 4 },
  ];
  function _buildDemoPills() {
    const wrap = document.getElementById('demo-pills');
    if (!wrap) return;
    DEMOS.forEach(d => {
      const u = window.ASTERAHR?.users?.[d.idx];
      if (!u) return;
      const btn = document.createElement('button');
      btn.className = 'demo-pill';
      btn.textContent = d.label;
      btn.onclick = () => {
        document.getElementById('inp-email').value = u.email;
        document.getElementById('inp-pwd').value   = u.pwd;
      };
      wrap.appendChild(btn);
    });
  }

  /* ── LOGIN ───────────────────────────────────────────── */
  async function doLogin() {
    const email = document.getElementById('inp-email')?.value.trim() || '';
    const pwd   = document.getElementById('inp-pwd')?.value           || '';
    hideAlert('login-alert');

    let valid = true;
    if (!Validate.email(email)) { setFgError('fg-email', true);  valid = false; }
    else                          setFgError('fg-email', false);
    if (!pwd)                   { setFgError('fg-pwd',   true);  valid = false; }
    else                          setFgError('fg-pwd',   false);
    if (!valid) return;

    btnLoad('btn-signin', true);
    await _delay(720);

    const user = window.ASTERAHR?.users?.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.pwd === pwd
    );

    btnLoad('btn-signin', false);

    if (!user) {
      showAlert('login-alert', 'Incorrect email address or password. Please try again.');
      Session.audit('LOGIN_FAIL', `Failed attempt for ${email}`, 'fail');
      return;
    }

    // MFA required?
    if (user.mfa) {
      const otp = _genOTP();
      _mfaPending = { userId: user.id, otp };
      console.log(
        `%c[AsteraHR] MFA OTP for ${user.email}: ${otp}`,
        'color:#1F3C88;font-weight:700;font-size:13px;background:#EEF2FB;padding:3px 8px;border-radius:4px'
      );
      document.getElementById('mfa-hint').textContent = _maskEmail(email);
      goStep('s-mfa');
      _startResend(60);
      _resetOTPCells();
      return;
    }

    // Force password change?
    if (user.mc) {
      Session.save(user);
      goStep('s-changepwd');
      return;
    }

    Session.save(user);
    window.location.href = RBAC.dashboardFor(user.role);
  }

  /* ── MFA ─────────────────────────────────────────────── */
  function _buildOTPCells() {
    const row = document.getElementById('otp-row');
    if (!row) return;
    for (let i = 0; i < 6; i++) {
      const inp = document.createElement('input');
      inp.type = 'text'; inp.maxLength = 1; inp.inputMode = 'numeric';
      inp.className = 'otp-cell';
      inp.dataset.i = i;
      inp.addEventListener('input',   _onOTPInput);
      inp.addEventListener('keydown', _onOTPKey);
      inp.addEventListener('paste',   _onOTPPaste);
      row.appendChild(inp);
    }
  }

  function _cells()     { return Array.from(document.querySelectorAll('.otp-cell')); }
  function _getOTPVal() { return _cells().map(c => c.value).join(''); }
  function _resetOTPCells() {
    _cells().forEach(c => { c.value = ''; c.classList.remove('filled'); });
    setTimeout(() => _cells()[0]?.focus(), 60);
  }

  function _onOTPInput(e) {
    const c = e.target;
    c.value = c.value.replace(/\D/g, '').slice(-1);
    c.classList.toggle('filled', !!c.value);
    if (c.value) {
      const nx = document.querySelector(`.otp-cell[data-i="${+c.dataset.i + 1}"]`);
      nx ? nx.focus() : document.getElementById('btn-mfa')?.focus();
    }
  }
  function _onOTPKey(e) {
    if (e.key === 'Backspace' && !e.target.value) {
      const pv = document.querySelector(`.otp-cell[data-i="${+e.target.dataset.i - 1}"]`);
      if (pv) { pv.value = ''; pv.classList.remove('filled'); pv.focus(); }
    }
    if (e.key === 'Enter') doMFA();
  }
  function _onOTPPaste(e) {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    _cells().forEach((c, i) => { c.value = digits[i] || ''; c.classList.toggle('filled', !!c.value); });
  }

  async function doMFA() {
    hideAlert('mfa-alert');
    const otp = _getOTPVal();
    if (otp.length < 6) { showAlert('mfa-alert', 'Please enter all 6 digits.');   return; }
    if (!_mfaPending)   { showAlert('mfa-alert', 'Session expired. Sign in again.'); return; }

    btnLoad('btn-mfa', true);
    await _delay(480);
    btnLoad('btn-mfa', false);

    if (otp !== _mfaPending.otp) {
      showAlert('mfa-alert', 'Incorrect code. Please try again.');
      _resetOTPCells();
      return;
    }

    const user = window.ASTERAHR?.users?.find(u => u.id === _mfaPending.userId);
    _mfaPending = null;

    if (user?.mc) { Session.save(user); goStep('s-changepwd'); return; }
    Session.save(user);
    window.location.href = RBAC.dashboardFor(user.role);
  }

  function _startResend(secs) {
    if (_resendTimer) clearInterval(_resendTimer);
    const link = document.getElementById('resend-link');
    const tmr  = document.getElementById('resend-timer');
    if (!link || !tmr) return;
    link.style.display = 'none'; tmr.style.display = 'inline';
    let s = secs;
    _resendTimer = setInterval(() => {
      tmr.textContent = `Resend in ${s}s`;
      if (--s < 0) { clearInterval(_resendTimer); link.style.display = 'inline'; tmr.style.display = 'none'; }
    }, 1000);
  }

  function resendOTP() {
    if (!_mfaPending) return;
    const otp  = _genOTP();
    _mfaPending.otp = otp;
    const user = window.ASTERAHR?.users?.find(u => u.id === _mfaPending.userId);
    console.log(
      `%c[AsteraHR] New OTP for ${user?.email}: ${otp}`,
      'color:#006B42;font-weight:700;font-size:13px;background:#EFF9F5;padding:3px 8px;border-radius:4px'
    );
    _startResend(60);
    _resetOTPCells();
    Toast.info('New code sent — check console (F12)');
  }

  /* ── FORGOT PASSWORD ─────────────────────────────────── */
  async function doForgot() {
    const email = document.getElementById('inp-reset')?.value.trim() || '';
    hideAlert('forgot-alert');
    if (!Validate.email(email)) { setFgError('fg-reset', true); return; }
    setFgError('fg-reset', false);

    btnLoad('btn-forgot', true);
    await _delay(850);
    // Always succeed to prevent enumeration
    const user = window.ASTERAHR?.users?.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      const token = Math.random().toString(36).slice(2, 18);
      console.log(`%c[AsteraHR] Reset token for ${email}: ${token}`, 'color:#8B5C00;font-weight:700;font-size:13px');
      Session.audit('RESET_REQUEST', `Password reset requested for ${email}`);
    }
    btnLoad('btn-forgot', false);
    goStep('s-reset-sent');
  }

  /* ── CHANGE PASSWORD ─────────────────────────────────── */
  function updateStrength(v) {
    const pv = Validate.password(v);
    const bar = document.getElementById('str-bar');
    const lbl = document.getElementById('str-label');
    if (bar) { bar.style.width = pv.score * 20 + '%'; bar.style.background = v ? pv.label.color : 'transparent'; }
    if (lbl) { lbl.textContent = v ? pv.label.text : 'Enter a password'; lbl.style.color = v ? pv.label.color : ''; }
    const map = { 'r-len': pv.len, 'r-up': pv.upper, 'r-lo': pv.lower, 'r-num': pv.number, 'r-sp': pv.special };
    Object.entries(map).forEach(([id, ok]) => document.getElementById(id)?.classList.toggle('ok', ok));
  }

  async function doChangePwd() {
    const np = document.getElementById('inp-newpwd')?.value  || '';
    const cp = document.getElementById('inp-confirm')?.value || '';
    hideAlert('cp-alert');
    const pv = Validate.password(np);
    if (pv.score < 4) { showAlert('cp-alert', 'Password is too weak. Please meet all requirements.'); return; }
    if (np !== cp)    { setFgError('fg-confirm', true); showAlert('cp-alert', 'Passwords do not match.'); return; }
    setFgError('fg-confirm', false);

    btnLoad('btn-cp', true);
    await _delay(600);
    btnLoad('btn-cp', false);

    const session = Session.get();
    const user    = window.ASTERAHR?.users?.find(u => u.id === session?.userId);
    if (user) { user.pwd = np; user.mc = false; }
    Session.audit('PASSWORD_CHANGED', 'Password set on first login');
    window.location.href = RBAC.dashboardFor(session?.role || 'employee');
  }

  /* ── Helpers ─────────────────────────────────────────── */
  function _delay(ms)       { return new Promise(r => setTimeout(r, ms)); }
  function _genOTP()        { return String(Math.floor(100000 + Math.random() * 900000)); }
  function _maskEmail(e)    { const [l, d] = e.split('@'); return l.slice(0,2) + '••••@' + d; }

  /* ── Public API ─────────────────────────────────────── */
  return { goStep, doLogin, doMFA, resendOTP, doForgot, updateStrength, doChangePwd };

})();

window.LoginCtrl = LoginCtrl;
