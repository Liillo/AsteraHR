/**
 * DashboardTools
 * Adds shortcut behavior to KPI cards and lightweight local editing for today's schedule panels.
 */
const DashboardTools = (() => {
  const MODAL_ID = 'dashboard-schedule-modal';
  const STYLE_ID = 'dashboard-tools-style';

  function esc(value = '') {
    return String(value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[ch]));
  }

  function styles() {
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement('style');
    el.id = STYLE_ID;
    el.textContent = `
      .stat-card[data-shortcut-href] { cursor:pointer; }
      .stat-card[data-shortcut-href]:focus-visible {
        outline:2px solid var(--navy-l); outline-offset:3px;
      }
      .stat-card[data-shortcut-href] .dashboard-shortcut-cue {
        position:absolute; right:16px; bottom:14px; font-size:11px; font-weight:700;
        color:var(--navy-l); opacity:.72;
      }
      .stat-card[data-shortcut-href]:hover .dashboard-shortcut-cue { opacity:1; }
      .dashboard-schedule-actions { display:flex; gap:8px; align-items:center; }
      .dashboard-punch-strip {
        display:flex; align-items:center; justify-content:space-between; gap:14px;
        margin:-4px 0 20px; padding:16px 18px; border:1px solid rgba(0,107,66,.22);
        border-left:5px solid var(--green-l); border-radius:var(--r);
        background:linear-gradient(180deg, rgba(255,255,255,.98), rgba(240,253,244,.88));
        box-shadow:0 16px 34px rgba(15,23,42,.10);
      }
      .dashboard-punch-copy { display:flex; align-items:center; gap:12px; min-width:0; }
      .dashboard-punch-icon {
        width:46px; height:46px; border-radius:14px; display:flex; align-items:center; justify-content:center;
        background:rgba(0,107,66,.14); color:var(--green-l); font-size:20px; flex-shrink:0;
      }
      .dashboard-punch-copy strong { display:block; color:var(--ink); font-size:15px; }
      .dashboard-punch-copy span { display:block; color:var(--ink-mu); font-size:12px; margin-top:3px; }
      .dashboard-punch-status {
        display:inline-flex; align-items:center; margin-top:7px; padding:4px 9px;
        border-radius:999px; background:rgba(0,107,66,.10); color:var(--green-l);
        font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.04em;
      }
      .dashboard-punch-actions { display:flex; align-items:center; gap:8px; flex-shrink:0; }
      .dashboard-punch-actions .btn {
        min-width:132px; min-height:42px; justify-content:center;
        border-width:0; border-radius:12px; font-size:13px; font-weight:800;
        box-shadow:0 12px 24px rgba(0,107,66,.22);
      }
      .dashboard-punch-actions [data-punch-in] {
        background:#006B42; color:#fff;
      }
      .dashboard-punch-actions [data-punch-in]:hover {
        background:#008753; transform:translateY(-1px);
      }
      .dashboard-punch-actions [data-punch-out] {
        background:#0F2249; color:#fff;
        box-shadow:0 12px 24px rgba(15,34,73,.24);
      }
      .dashboard-punch-actions [data-punch-out]:hover {
        background:#1F3C88; transform:translateY(-1px);
      }
      .dashboard-punch-actions [hidden] { display:none !important; }
      .dashboard-schedule-edit-row {
        display:grid; grid-template-columns:88px 1fr 1fr auto; gap:10px; align-items:start;
        padding:10px 0; border-bottom:1px solid var(--bdr-s);
      }
      .dashboard-schedule-edit-row:last-child { border-bottom:none; }
      .dashboard-schedule-edit-row input {
        width:100%; border:1px solid var(--bdr-s); border-radius:var(--r);
        padding:9px 10px; font-family:var(--f-ui); font-size:12.5px; color:var(--ink);
      }
      .dashboard-empty-schedule {
        border:1px dashed var(--bdr); border-radius:var(--r); padding:14px;
        color:var(--ink-mu); font-size:12.5px; text-align:center; background:var(--white);
      }
      @media (max-width:720px) {
        .dashboard-punch-strip { align-items:stretch; flex-direction:column; }
        .dashboard-punch-actions .btn { flex:1; }
        .dashboard-schedule-edit-row { grid-template-columns:1fr; }
        .dashboard-schedule-edit-row .btn { width:100%; }
      }
    `;
    document.head.appendChild(el);
  }

  function init(options = {}) {
    styles();
    applyAttendancePunch(options.attendancePunch !== false);
    applyShortcuts(options.shortcuts || []);
    applyScheduleEditors(options.storageKey || location.pathname);
  }

  function todayKey() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function shortClockTime(date = new Date()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function hasOpenPunch(record) {
    return !!record?.checkIn
      && !['Not recorded', 'Missing'].includes(record.checkIn)
      && (!record.checkOut || ['Not recorded', 'Pending review'].includes(record.checkOut));
  }

  function attendanceDayLabel(record) {
    if (!record?.attendanceDate) return 'Today';
    if (record.attendanceDate === todayKey()) return 'Today';
    return record.attendanceDate;
  }

  function attendanceRecord(session) {
    const records = window.ASTERAHR?.moduleData?.attendance;
    if (!session || !Array.isArray(records)) return null;
    const userRecords = records.filter(item => item.userId === session.userId && !item.issue);
    const openOvertime = userRecords.find(item => item.attendanceDate !== todayKey() && hasOpenPunch(item));
    return openOvertime || userRecords.find(item => item.attendanceDate === todayKey()) || null;
  }

  function attendanceSummary(session) {
    const record = attendanceRecord(session);
    const checkIn = record?.checkIn && record.checkIn !== 'Not recorded' ? record.checkIn : 'Not checked in';
    const checkOut = record?.checkOut && record.checkOut !== 'Not recorded' ? record.checkOut : 'Not checked out';
    return `${attendanceDayLabel(record)} · In: ${checkIn} · Out: ${checkOut}`;
  }

  function attendancePunchState(session) {
    const record = attendanceRecord(session);
    const hasCheckIn = !!record?.checkIn && !['Not recorded', 'Missing'].includes(record.checkIn);
    const hasCheckOut = !!record?.checkOut && !['Not recorded', 'Pending review'].includes(record.checkOut);
    if (hasCheckIn && !hasCheckOut) return 'checked-in';
    if (hasCheckOut) return 'checked-out';
    return 'not-checked-in';
  }

  function attendanceStatusLabel(session) {
    const state = attendancePunchState(session);
    const record = attendanceRecord(session);
    if (state === 'checked-in' && record?.attendanceDate && record.attendanceDate !== todayKey()) return 'Overtime - check out needed';
    if (state === 'checked-in') return 'Checked in';
    if (state === 'checked-out') return 'Checked out';
    return 'Ready to check in';
  }

  function recordAttendancePunch(direction) {
    const session = Session.get();
    const records = window.ASTERAHR?.moduleData?.attendance;
    if (!session || !Array.isArray(records)) return;

    const day = todayKey();
    const now = shortClockTime();
    let record = direction === 'out'
      ? attendanceRecord(session)
      : records.find(item => item.userId === session.userId && item.attendanceDate === day && !item.issue);
    if (!record) {
      record = {
        userId: session.userId,
        name: session.name,
        event: 'Daily attendance',
        status: 'Checked in',
        context: 'Today',
        dept: session.department || 'General',
        issue: false,
        attendanceDate: day,
        checkIn: 'Not recorded',
        checkOut: 'Not recorded',
      };
      records.unshift(record);
    }

    if (direction === 'in') {
      record.checkIn = now;
      record.event = 'Check-in recorded';
      record.status = record.checkOut && record.checkOut !== 'Not recorded' ? 'Completed' : 'Checked in';
      Toast.success(`Checked in at ${now}.`);
      Session.audit('ATTENDANCE_CHECK_IN', `${session.name} checked in at ${now}`);
    } else {
      if (!record.checkIn || record.checkIn === 'Not recorded') record.checkIn = 'Missing';
      record.checkOut = now;
      record.event = 'Check-out recorded';
      record.status = 'Completed';
      Toast.success(`Checked out at ${now}.`);
      Session.audit('ATTENDANCE_CHECK_OUT', `${session.name} checked out at ${now}`);
    }

    record.context = `${attendanceDayLabel(record)} - In: ${record.checkIn}; Out: ${record.checkOut}`;
    window.ASTERAHR.store.persist();
    updateAttendancePunch();
  }

  function updateAttendancePunch() {
    const session = Session.get();
    const strip = document.querySelector('[data-dashboard-punch]');
    if (!strip || !session) return;
    const summary = strip.querySelector('[data-dashboard-punch-summary]');
    const status = strip.querySelector('[data-dashboard-punch-status]');
    const punchIn = strip.querySelector('[data-punch-in]');
    const punchOut = strip.querySelector('[data-punch-out]');
    const state = attendancePunchState(session);
    if (summary) summary.textContent = attendanceSummary(session);
    if (status) status.textContent = attendanceStatusLabel(session);
    if (punchIn) punchIn.hidden = state === 'checked-in';
    if (punchOut) punchOut.hidden = state !== 'checked-in';
  }

  function applyAttendancePunch(enabled) {
    if (!enabled || document.querySelector('[data-dashboard-punch]')) return;
    const session = Session.get();
    const container = document.querySelector('.page-container');
    const banner = container?.querySelector('.page-banner');
    if (!session || !container) return;

    const strip = document.createElement('div');
    strip.className = 'dashboard-punch-strip';
    strip.dataset.dashboardPunch = 'true';
    strip.innerHTML = `
      <div class="dashboard-punch-copy">
        <div class="dashboard-punch-icon">&#128338;</div>
        <div>
          <strong>Attendance punch</strong>
          <span data-dashboard-punch-summary>${esc(attendanceSummary(session))}</span>
          <div class="dashboard-punch-status" data-dashboard-punch-status>${esc(attendanceStatusLabel(session))}</div>
        </div>
      </div>
      <div class="dashboard-punch-actions">
        <button class="btn btn-green btn-sm" type="button" data-punch-in>Check in</button>
        <button class="btn btn-outline btn-sm" type="button" data-punch-out>Check out</button>
      </div>
    `;
    (banner || container.firstElementChild)?.insertAdjacentElement('afterend', strip);
    strip.querySelector('[data-punch-in]').addEventListener('click', () => recordAttendancePunch('in'));
    strip.querySelector('[data-punch-out]').addEventListener('click', () => recordAttendancePunch('out'));
    updateAttendancePunch();
  }

  function applyShortcuts(shortcuts) {
    document.querySelectorAll('.stats-grid .stat-card').forEach((card, index) => {
      const href = shortcuts[index];
      if (!href) return;
      card.dataset.shortcutHref = href;
      card.tabIndex = 0;
      card.setAttribute('role', 'link');
      card.setAttribute('aria-label', `${card.querySelector('.stat-lbl')?.textContent || 'KPI'} shortcut`);
      if (!card.querySelector('.dashboard-shortcut-cue')) {
        card.insertAdjacentHTML('beforeend', '<span class="dashboard-shortcut-cue">Open</span>');
      }
      card.addEventListener('click', event => {
        if (event.target.closest('a,button,input,select,textarea')) return;
        window.location.href = href;
      });
      card.addEventListener('keydown', event => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        window.location.href = href;
      });
    });
  }

  function applyScheduleEditors(storageKey) {
    document.querySelectorAll('.card').forEach((card, index) => {
      const title = card.querySelector('.card-head h3')?.textContent.trim().toLowerCase() || '';
      const list = card.querySelector('.schedule-list, .day-list, .timeline');
      if (!list || !/(schedule|today|plan)/.test(title)) return;

      const id = `${storageKey}:schedule:${index}`;
      card.dataset.scheduleStore = id;
      card.dataset.scheduleListClass = list.classList.contains('schedule-list') ? 'schedule'
        : list.classList.contains('day-list') ? 'day'
        : 'timeline';

      const saved = readSchedule(id);
      if (saved.length) renderSchedule(card, saved);
      attachEditButton(card);
    });
  }

  function attachEditButton(card) {
    const head = card.querySelector('.card-head');
    if (!head || head.querySelector('[data-schedule-edit]')) return;
    const actionWrap = document.createElement('div');
    actionWrap.className = 'dashboard-schedule-actions';
    actionWrap.innerHTML = '<button class="card-action" type="button" data-schedule-edit>Edit</button>';
    actionWrap.querySelector('button').addEventListener('click', () => openScheduleModal(card));
    head.appendChild(actionWrap);
  }

  function readSchedule(key) {
    try {
      const items = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(items) ? items.filter(item => item && item.time && item.title) : [];
    } catch {
      return [];
    }
  }

  function writeSchedule(key, items) {
    localStorage.setItem(key, JSON.stringify(items));
  }

  function getScheduleItems(card) {
    const rows = [...card.querySelectorAll('.schedule-row, .day-row, .timeline-row')];
    return rows.map(row => ({
      time: row.querySelector('.schedule-time, .day-time, .timeline-time')?.textContent.trim() || '',
      title: row.querySelector('.schedule-card strong, .day-card strong, .timeline-card strong')?.textContent.trim() || '',
      note: row.querySelector('.schedule-card span, .day-card span, .timeline-card span')?.textContent.trim() || '',
    })).filter(item => item.time && item.title);
  }

  function renderSchedule(card, items) {
    const list = card.querySelector('.schedule-list, .day-list, .timeline');
    const type = card.dataset.scheduleListClass || 'schedule';
    if (!list) return;
    if (!items.length) {
      list.innerHTML = '<div class="dashboard-empty-schedule">No items scheduled yet.</div>';
      return;
    }

    const rowClass = type === 'day' ? 'day-row' : type === 'timeline' ? 'timeline-row' : 'schedule-row';
    const timeClass = type === 'day' ? 'day-time' : type === 'timeline' ? 'timeline-time' : 'schedule-time';
    const cardClass = type === 'day' ? 'day-card' : type === 'timeline' ? 'timeline-card' : 'schedule-card';
    list.innerHTML = items.map(item => `
      <div class="${rowClass}">
        <div class="${timeClass}">${esc(item.time)}</div>
        <div class="${cardClass}">
          <strong>${esc(item.title)}</strong>
          <span>${esc(item.note)}</span>
        </div>
      </div>
    `).join('');
  }

  function ensureModal() {
    let modal = document.getElementById(MODAL_ID);
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal" style="max-width:720px">
        <div class="modal-head">
          <div>
            <h2 style="font-family:var(--f-serif);font-size:22px">Edit Today's Schedule</h2>
            <div class="card-sub">Changes are saved in this browser for the current dashboard.</div>
          </div>
          <button class="modal-x" type="button" onclick="closeModal('${MODAL_ID}')">&times;</button>
        </div>
        <div class="modal-body">
          <div id="dashboard-schedule-fields"></div>
          <button class="btn btn-outline btn-sm" type="button" id="dashboard-schedule-add" style="margin-top:12px">Add Item</button>
        </div>
        <div class="modal-footer" style="display:flex;justify-content:flex-end;gap:10px">
          <button class="btn btn-ghost btn-sm" type="button" onclick="closeModal('${MODAL_ID}')">Cancel</button>
          <button class="btn btn-navy btn-sm" type="button" id="dashboard-schedule-save">Save Schedule</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  function scheduleRow(item = {}) {
    return `
      <div class="dashboard-schedule-edit-row">
        <input name="time" value="${esc(item.time)}" placeholder="09:00" aria-label="Time">
        <input name="title" value="${esc(item.title)}" placeholder="Schedule title" aria-label="Title">
        <input name="note" value="${esc(item.note)}" placeholder="Notes or location" aria-label="Notes">
        <button class="btn btn-danger btn-sm" type="button" data-remove-row>Remove</button>
      </div>
    `;
  }

  function openScheduleModal(card) {
    const modal = ensureModal();
    const fields = modal.querySelector('#dashboard-schedule-fields');
    const items = getScheduleItems(card);
    fields.innerHTML = (items.length ? items : [{ time: '', title: '', note: '' }]).map(scheduleRow).join('');

    modal.querySelector('#dashboard-schedule-add').onclick = () => {
      fields.insertAdjacentHTML('beforeend', scheduleRow());
    };
    fields.onclick = event => {
      if (!event.target.matches('[data-remove-row]')) return;
      event.target.closest('.dashboard-schedule-edit-row')?.remove();
      if (!fields.children.length) fields.insertAdjacentHTML('beforeend', scheduleRow());
    };
    modal.querySelector('#dashboard-schedule-save').onclick = () => {
      const rows = [...fields.querySelectorAll('.dashboard-schedule-edit-row')];
      const next = rows.map(row => ({
        time: row.querySelector('[name="time"]').value.trim(),
        title: row.querySelector('[name="title"]').value.trim(),
        note: row.querySelector('[name="note"]').value.trim(),
      })).filter(item => item.time && item.title);

      if (!next.length) {
        Toast.warning('Add at least one schedule item with a time and title.');
        return;
      }
      renderSchedule(card, next);
      writeSchedule(card.dataset.scheduleStore, next);
      Session.audit('DASHBOARD_SCHEDULE_UPDATED', 'Dashboard schedule updated');
      closeModal(MODAL_ID);
      Toast.success('Schedule updated.');
    };
    openModal(MODAL_ID);
  }

  return { init, recordAttendancePunch };
})();

window.DashboardTools = DashboardTools;
