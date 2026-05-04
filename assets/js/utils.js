/**
 * AsteraHR ERP — Utilities  (assets/js/utils.js)
 * Toast · Modal helpers · Formatters · Validators · Misc
 *
 * No dependencies. Safe to load first.
 */

/* ════════════════════════════════════
   TOAST
════════════════════════════════════ */
const Toast = (() => {
  function _shelf() {
    let el = document.getElementById('toast-shelf');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast-shelf';
      el.className = 'toast-shelf';
      document.body.appendChild(el);
    }
    return el;
  }

  function show(msg, type = 'success', duration = 3800) {
    const icons = { success:'✓', error:'⚠', warning:'!', info:'i' };
    const shelf = _shelf();
    const t = document.createElement('div');
    t.className = `toast ${type !== 'success' ? 'toast-' + type : ''}`;
    t.innerHTML = `
      <span class="toast-icon">${icons[type] || '✓'}</span>
      <span class="toast-msg">${msg}</span>
      <button style="background:none;border:none;cursor:pointer;color:var(--ink-g);font-size:15px;padding:0 0 0 8px;flex-shrink:0"
        onclick="this.parentElement.remove()">✕</button>
    `;
    shelf.appendChild(t);
    if (duration > 0) {
      setTimeout(() => {
        t.style.transition = 'opacity .28s, transform .28s';
        t.style.opacity = '0';
        t.style.transform = 'translateX(16px)';
        setTimeout(() => t.remove(), 300);
      }, duration);
    }
  }

  return {
    success: (msg, dur) => show(msg, 'success', dur),
    error:   (msg, dur) => show(msg, 'error',   dur),
    warning: (msg, dur) => show(msg, 'warning', dur),
    info:    (msg, dur) => show(msg, 'info',    dur),
    show,
  };
})();

/* ====================================
   NOTIFICATIONS
==================================== */
const Notify = (() => {
  const KEY = 'asterahr_notifications';

  function _read() {
    try {
      const list = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  }

  function _write(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      /* ignore storage failures in demo mode */
    }
  }

  function _id() {
    return `NTF-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function push(payload = {}) {
    const userIds = [...new Set((payload.userIds || []).filter(Boolean))];
    if (!userIds.length) return [];

    const now = new Date().toISOString();
    const list = _read();
    const created = userIds.map(userId => ({
      id: _id(),
      userId,
      type: payload.type || 'default',
      title: payload.title || 'Notification',
      msg: payload.msg || '',
      href: payload.href || '',
      read: false,
      dismissed: false,
      createdAt: now,
      actor: payload.actor || null,
    }));

    _write([...created, ...list]);
    return created;
  }

  function get(userId) {
    return _read()
      .filter(item => item.userId === userId && !item.dismissed)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  function unreadCount(userId) {
    return get(userId).filter(item => !item.read).length;
  }

  function markRead(id, userId) {
    const list = _read();
    const match = list.find(item => item.id === id && item.userId === userId);
    if (!match) return false;
    match.read = true;
    _write(list);
    return true;
  }

  function dismiss(id, userId) {
    const list = _read();
    const match = list.find(item => item.id === id && item.userId === userId);
    if (!match) return false;
    match.dismissed = true;
    _write(list);
    return true;
  }

  function markAllRead(userId) {
    const list = _read();
    let changed = false;
    list.forEach(item => {
      if (item.userId === userId && !item.dismissed && !item.read) {
        item.read = true;
        changed = true;
      }
    });
    if (changed) _write(list);
    return changed;
  }

  return { push, get, unreadCount, markRead, dismiss, markAllRead };
})();

/* ════════════════════════════════════
   MODAL HELPERS
════════════════════════════════════ */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('open'); document.body.style.overflow = ''; }
}

// Close on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) closeModal(e.target.id);
});
// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => closeModal(m.id));
  }
});

/* ════════════════════════════════════
   CONFIRM DIALOG
════════════════════════════════════ */
function showConfirm(title, message, onConfirm, type = 'danger') {
  let overlay = document.getElementById('_confirm_modal');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = '_confirm_modal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal modal-sm">
        <div class="modal-body" style="padding:30px 26px;text-align:center">
          <div id="_cm_icon" style="font-size:40px;margin-bottom:12px"></div>
          <h2 id="_cm_title" style="font-family:var(--f-serif);font-size:20px;margin-bottom:8px"></h2>
          <p  id="_cm_msg"   style="font-size:13.5px;color:var(--ink-s);line-height:1.6;margin-bottom:24px"></p>
          <div style="display:flex;gap:10px;justify-content:center">
            <button class="btn btn-ghost btn-sm" onclick="closeModal('_confirm_modal')">Cancel</button>
            <button id="_cm_ok" class="btn btn-sm"></button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }
  const icons = { danger:'⚠', success:'✅', info:'ℹ' };
  document.getElementById('_cm_icon').textContent  = icons[type] || '❓';
  document.getElementById('_cm_title').textContent = title;
  document.getElementById('_cm_msg').textContent   = message;
  const ok = document.getElementById('_cm_ok');
  ok.className = `btn btn-sm ${type === 'danger' ? 'btn-danger' : 'btn-navy'}`;
  ok.textContent = type === 'danger' ? 'Confirm' : 'OK';
  ok.onclick = () => { closeModal('_confirm_modal'); onConfirm(); };
  openModal('_confirm_modal');
}

/* ════════════════════════════════════
   FORMATTERS
════════════════════════════════════ */
const Fmt = {
  currency(n, cur = 'KES') {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency', currency: cur,
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(n);
  },
  number(n) { return new Intl.NumberFormat('en-KE').format(n); },
  date(s, style = 'medium') {
    if (!s) return '—';
    return new Date(s).toLocaleDateString('en-KE', {
      year: 'numeric', month: style === 'short' ? 'short' : 'long', day: 'numeric',
    });
  },
  dateTime(s) {
    if (!s) return '—';
    return new Date(s).toLocaleString('en-KE', {
      year:'numeric', month:'short', day:'numeric',
      hour:'2-digit', minute:'2-digit',
    });
  },
  time(s) {
    if (!s) return '—';
    return new Date(s).toLocaleTimeString('en-KE', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  },
  timeAgo(s) {
    const diff = Date.now() - new Date(s).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)    return 'Just now';
    if (m < 60)   return `${m}m ago`;
    if (m < 1440) return `${Math.floor(m/60)}h ago`;
    return `${Math.floor(m/1440)}d ago`;
  },
  initials(name) { return name.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase(); },
  percent(val, total) { return total ? ((val/total)*100).toFixed(1)+'%' : '0%'; },
};

/* ════════════════════════════════════
   VALIDATORS
════════════════════════════════════ */
const Validate = {
  email(v)    { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
  required(v) { return v !== null && v !== undefined && String(v).trim() !== ''; },
  minLen(v,n) { return String(v).trim().length >= n; },
  numeric(v)  { return !isNaN(parseFloat(v)) && isFinite(v); },
  phone(v)    { return /^[\+]?[0-9\s\-]{9,15}$/.test(v.replace(/\s/g,'')); },
  password(v) {
    const p = String(v);
    const checks = {
      len:     p.length >= 8,
      upper:   /[A-Z]/.test(p),
      lower:   /[a-z]/.test(p),
      number:  /\d/.test(p),
      special: /[!@#$%^&*]/.test(p),
    };
    const score = Object.values(checks).filter(Boolean).length;
    const labels = [
      { text:'Very weak',   color:'#B91C1C' },
      { text:'Weak',        color:'#C2410C' },
      { text:'Fair',        color:'#B45309' },
      { text:'Strong',      color:'#15803D' },
      { text:'Very strong', color:'#065F46' },
    ];
    return { ...checks, score, label: labels[Math.min(score,4)] };
  },
};

/* ════════════════════════════════════
   EYE TOGGLE (password visibility)
════════════════════════════════════ */
function toggleEye(inputId, btn) {
  const inp = document.getElementById(inputId);
  if (!inp) return;
  inp.type = inp.type === 'password' ? 'text' : 'password';
  btn.textContent = inp.type === 'password' ? '👁' : '🙈';
}

/* ════════════════════════════════════
   BUTTON LOADING STATE
════════════════════════════════════ */
function btnLoad(id, on) {
  const b = document.getElementById(id);
  if (!b) return;
  b.classList.toggle('loading', on);
  b.disabled = on;
}

/* ════════════════════════════════════
   FORM HELPERS
════════════════════════════════════ */
function setFgError(fgId, on) {
  const fg = document.getElementById(fgId);
  if (fg) fg.classList.toggle('has-err', on);
}

function collectForm(formEl) {
  const data = {};
  formEl.querySelectorAll('[name]').forEach(el => {
    if (el.type === 'checkbox') data[el.name] = el.checked;
    else if (el.tagName === 'SELECT' && el.multiple) data[el.name] = [...el.selectedOptions].map(option => option.value);
    else data[el.name] = el.value;
  });
  return data;
}

/* ════════════════════════════════════
   ALERT HELPERS
════════════════════════════════════ */
function showAlert(id, msg) {
  const el  = document.getElementById(id);
  const msg_el = document.getElementById(id + '-msg');
  if (el)     el.style.display = 'flex';
  if (msg_el) msg_el.textContent = msg;
}
function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

/* ════════════════════════════════════
   DATE UTILITIES
════════════════════════════════════ */
const DateUtil = {
  today()       { return new Date().toISOString().split('T')[0]; },
  addDays(d, n) {
    const dt = new Date(d); dt.setDate(dt.getDate() + n);
    return dt.toISOString().split('T')[0];
  },
  diffDays(a, b){ return Math.round((new Date(b) - new Date(a)) / 86400000); },
  isWeekend(d)  { const day = new Date(d).getDay(); return day === 0 || day === 6; },
};

/* ════════════════════════════════════
   COPY TO CLIPBOARD
════════════════════════════════════ */
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    Toast.success('Copied to clipboard');
  } catch {
    Toast.error('Copy failed');
  }
}

/* ════════════════════════════════════
   EXPOSE GLOBALS
════════════════════════════════════ */
window.Toast       = Toast;
window.Notify      = Notify;
window.Fmt         = Fmt;
window.Validate    = Validate;
window.DateUtil    = DateUtil;
window.openModal   = openModal;
window.closeModal  = closeModal;
window.showConfirm = showConfirm;
window.toggleEye   = toggleEye;
window.btnLoad     = btnLoad;
window.setFgError  = setFgError;
window.collectForm = collectForm;
window.showAlert   = showAlert;
window.hideAlert   = hideAlert;
window.copyText    = copyText;
