const AsteraCalendar = (() => {
  const CATEGORY_META = {
    leave: { label: 'Leave', color: '#006B42', bg: 'rgba(0,107,66,.12)' },
    training: { label: 'Training', color: '#1F3C88', bg: 'rgba(31,60,136,.12)' },
    payroll: { label: 'Payroll', color: '#8B5C00', bg: 'rgba(139,92,0,.12)' },
    performance: { label: 'Performance', color: '#7C3AED', bg: 'rgba(124,58,237,.12)' },
    holiday: { label: 'Holiday', color: '#B91C1C', bg: 'rgba(185,28,28,.12)' },
  };

  const HOLIDAYS = [
    { month: 0, day: 1, title: "New Year's Day" },
    { month: 3, day: 3, title: 'Good Friday' },
    { month: 3, day: 6, title: 'Easter Monday' },
    { month: 4, day: 1, title: 'Labour Day' },
    { month: 5, day: 1, title: 'Madaraka Day' },
    { month: 10, day: 20, title: 'Mashujaa Day' },
    { month: 11, day: 12, title: 'Jamhuri Day' },
    { month: 11, day: 25, title: 'Christmas Day' },
    { month: 11, day: 26, title: 'Boxing Day' },
  ];

  const OVERRIDE_KEY = 'asterahr_calendar_overrides';

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function toDate(value) {
    if (value instanceof Date) {
      const copy = new Date(value.getTime());
      return Number.isNaN(copy.getTime()) ? null : copy;
    }
    const raw = String(value || '').trim();
    if (!raw) return null;
    const parsedIso = parseIsoDate(raw);
    if (parsedIso) return parsedIso;
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function startOfDay(value) {
    const date = toDate(value);
    if (!date) return null;
    date.setHours(0, 0, 0, 0);
    return date;
  }

  function addDays(value, days) {
    const date = startOfDay(value);
    if (!date) return null;
    date.setDate(date.getDate() + days);
    return date;
  }

  function isoDate(value) {
    const date = startOfDay(value);
    if (!date) return '';
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function parseIsoDate(value) {
    const match = String(value || '').trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const date = new Date(year, month, day);
    return Number.isNaN(date.getTime()) ? null : startOfDay(date);
  }

  function monthLabel(value) {
    return new Intl.DateTimeFormat('en-KE', { month: 'long', year: 'numeric' }).format(value);
  }

  function dayLabel(value) {
    return new Intl.DateTimeFormat('en-KE', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(value);
  }

  function nextWeekday(base, weekday) {
    const date = startOfDay(base);
    if (!date) return null;
    const diff = (weekday - date.getDay() + 7) % 7;
    return addDays(date, diff === 0 ? 7 : diff);
  }

  function parseDayCount(value) {
    const match = String(value || '').match(/(\d+)/);
    return match ? Math.max(1, Number(match[1])) : 1;
  }

  function sameMonth(a, b) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  }

  function monthGrid(viewDate) {
    const first = startOfDay(new Date(viewDate.getFullYear(), viewDate.getMonth(), 1));
    const start = addDays(first, -first.getDay());
    return Array.from({ length: 42 }, (_, index) => addDays(start, index));
  }

  function stableId(parts) {
    return parts
      .map(part => String(part || '').trim().toLowerCase().replace(/\s+/g, '-'))
      .join('|');
  }

  function scopedRecords(records, session) {
    return (records || []).filter(record => {
      if (record.roles && !record.roles.includes(session.role)) return false;
      if (session.role === 'hr_admin' || session.role === 'hr_officer') return true;
      if (session.role === 'manager') {
        return !!record.public || record.userId === session.userId || record.dept === session.department || !record.dept;
      }
      if (session.role === 'employee') {
        return !!record.public || record.userId === session.userId;
      }
      return false;
    });
  }

  function canEditEvents(session) {
    return ['hr_admin', 'hr_officer', 'manager'].includes(session.role);
  }

  function readOverrides() {
    try {
      const raw = JSON.parse(localStorage.getItem(OVERRIDE_KEY) || '{}');
      return raw && typeof raw === 'object' ? raw : {};
    } catch {
      return {};
    }
  }

  function writeOverrides(overrides) {
    try {
      localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
    } catch {
      /* ignore storage errors in demo mode */
    }
  }

  function applyOverrides(events) {
    const overrides = readOverrides();
    return events.map(event => {
      const patch = overrides[event.id];
      if (!patch) return event;
      return {
        ...event,
        title: patch.title || event.title,
        detail: patch.detail || event.detail,
        start: patch.start || event.start,
        end: patch.end || event.end,
        scope: patch.scope || event.scope,
      };
    });
  }

  function saveOverride(eventId, payload) {
    const overrides = readOverrides();
    overrides[eventId] = payload;
    writeOverrides(overrides);
  }

  function resolveLeaveRange(record, index, today) {
    const explicitStart = record.startDate || record.start || record.fromDate;
    const explicitEnd = record.endDate || record.end || record.toDate;
    if (parseIsoDate(explicitStart) && parseIsoDate(explicitEnd)) {
      return { start: explicitStart, end: explicitEnd };
    }

    const inlineRange = String(record.detail || '').match(/(\d{4}-\d{2}-\d{2})\s+to\s+(\d{4}-\d{2}-\d{2})/);
    if (inlineRange) {
      return { start: inlineRange[1], end: inlineRange[2] };
    }

    const length = parseDayCount(record.days);
    let start = today;
    const detail = String(record.detail || '').toLowerCase();
    if (detail.includes('last month')) {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 18 + index);
    } else if (detail.includes('this week')) {
      start = addDays(today, 2 + index);
    } else if (detail.includes('future')) {
      start = new Date(today.getFullYear(), today.getMonth() + 1, 10 + index * 2);
    } else if (record.approvedAt) {
      start = addDays(record.approvedAt, 5 + index);
    } else {
      start = addDays(today, index * 3);
    }
    return { start: isoDate(start), end: isoDate(addDays(start, length - 1)) };
  }

  function resolveTrainingDate(record, index, today) {
    const explicit = parseIsoDate(record.sessionDate || record.date || record.context);
    if (explicit) return isoDate(explicit);

    const context = String(record.context || '').toLowerCase();
    if (context.includes('friday')) return isoDate(nextWeekday(today, 5));
    if (context.includes('monday')) return isoDate(nextWeekday(today, 1));
    if (context.includes('tuesday')) return isoDate(nextWeekday(today, 2));
    if (context.includes('wednesday')) return isoDate(nextWeekday(today, 3));
    if (context.includes('thursday')) return isoDate(nextWeekday(today, 4));
    if (context.includes('scheduled')) return isoDate(addDays(today, 7 + index * 2));
    if (context.includes('recorded')) return isoDate(addDays(today, -7 - index));
    return isoDate(addDays(today, 10 + index * 3));
  }

  function quarterDeadline(today) {
    const month = today.getMonth();
    const quarterEndMonth = Math.floor(month / 3) * 3 + 2;
    return isoDate(new Date(today.getFullYear(), quarterEndMonth + 1, 0));
  }

  function publicHolidayEvents(today) {
    const years = [today.getFullYear(), today.getFullYear() + 1];
    return years.flatMap(year => HOLIDAYS.map((holiday, index) => ({
      id: stableId(['holiday', year, holiday.month, holiday.day, index, holiday.title]),
      category: 'holiday',
      title: holiday.title,
      detail: 'Recognized public holiday.',
      start: isoDate(new Date(year, holiday.month, holiday.day)),
      end: isoDate(new Date(year, holiday.month, holiday.day)),
      scope: 'All staff',
      source: 'Holiday calendar',
      editable: false,
    })));
  }

  function buildEvents(session) {
    const data = window.ASTERAHR?.moduleData || {};
    const today = startOfDay(new Date());

    const leaveEvents = scopedRecords(data.leave, session)
      .filter(record => record.status === 'Approved')
      .map((record, index) => {
        const range = resolveLeaveRange(record, index, today);
        return {
          id: stableId(['leave', record.userId, record.name, record.type, range.start, range.end]),
          category: 'leave',
          title: `${record.name} - ${record.type}`,
          detail: `${record.days} approved${record.detail ? ` - ${record.detail}` : ''}`,
          start: range.start,
          end: range.end,
          scope: record.dept || 'General',
          source: 'Leave module',
          editable: true,
        };
      });

    const trainingEvents = scopedRecords(data.training, session)
      .filter(record => ['Scheduled', 'Open', 'Completed'].includes(record.status))
      .map((record, index) => {
        const when = resolveTrainingDate(record, index, today);
        return {
          id: stableId(['training', record.userId, record.name, record.course, when, record.status]),
          category: 'training',
          title: record.course,
          detail: `${record.name} - ${record.status}${record.context ? ` - ${record.context}` : ''}`,
          start: when,
          end: when,
          scope: record.dept || 'General',
          source: 'Training module',
          editable: true,
        };
      });

    const payrollTemplate = (data.reports || []).find(record => /payroll/i.test(record.title));
    const payrollEvents = payrollTemplate ? [0, 1].map(offset => {
      const date = new Date(today.getFullYear(), today.getMonth() + offset, 25);
      return {
        id: stableId(['payroll', offset, isoDate(date)]),
        category: 'payroll',
        title: 'Payroll run date',
        detail: `${payrollTemplate.title} - ${payrollTemplate.status}`,
        start: isoDate(date),
        end: isoDate(date),
        scope: payrollTemplate.context || 'All departments',
        source: 'Reports module',
        editable: true,
      };
    }) : [];

    const performanceOpen = scopedRecords(data.performance, session)
      .filter(record => record.status === 'Open' || record.status === 'Upcoming');
    const performanceEvents = performanceOpen.length ? [{
      id: stableId(['performance', today.getFullYear(), today.getMonth(), performanceOpen.length]),
      category: 'performance',
      title: 'Performance review deadline',
      detail: `${performanceOpen.length} open review item${performanceOpen.length === 1 ? '' : 's'} still need attention.`,
      start: quarterDeadline(today),
      end: quarterDeadline(today),
      scope: session.department || 'All departments',
      source: 'Performance module',
      editable: true,
    }] : [];

    return applyOverrides([...leaveEvents, ...trainingEvents, ...payrollEvents, ...performanceEvents, ...publicHolidayEvents(today)])
      .sort((a, b) => a.start.localeCompare(b.start) || a.title.localeCompare(b.title));
  }

  function eventsForDate(events, dateIso) {
    return events.filter(event => event.start <= dateIso && event.end >= dateIso);
  }

  function legendHtml() {
    return Object.entries(CATEGORY_META).map(([, meta]) => `
      <span style="display:inline-flex;align-items:center;gap:8px;font-size:12px;color:var(--ink-m)">
        <span style="width:10px;height:10px;border-radius:50%;background:${meta.color}"></span>
        ${meta.label}
      </span>
    `).join('');
  }

  function renderEventList(events, canEdit) {
    if (!events.length) {
      return `<div style="padding:18px 0;color:var(--ink-g);font-size:13px">No HR events are scheduled for this date.</div>`;
    }

    return events.map(event => {
      const meta = CATEGORY_META[event.category] || CATEGORY_META.training;
      const dateLine = event.start === event.end
        ? Fmt.date(event.start, 'short')
        : `${Fmt.date(event.start, 'short')} to ${Fmt.date(event.end, 'short')}`;
      const showEdit = canEdit && event.editable;
      return `
        <div style="padding:14px 0;border-bottom:1px solid var(--bdr-s)">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
            <div>
              <div style="font-size:13px;font-weight:700;color:var(--ink)">${event.title}</div>
              <div style="font-size:12px;color:var(--ink-mu);margin-top:4px;line-height:1.55">${event.detail}</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end">
              <span style="padding:4px 10px;border-radius:999px;background:${meta.bg};color:${meta.color};font-size:11px;font-weight:700;white-space:nowrap">${meta.label}</span>
              ${showEdit ? `<button type="button" class="btn btn-ghost btn-sm" data-cal-edit="${event.id}">Edit</button>` : ''}
            </div>
          </div>
          <div style="display:flex;gap:14px;flex-wrap:wrap;margin-top:8px;font-size:11.5px;color:var(--ink-g)">
            <span>${dateLine}</span>
            <span>${event.scope}</span>
            <span>${event.source}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function pageShell() {
    return `
      <div class="calendar-shell">
        <section class="calendar-hero">
          <div>
            <div class="calendar-eyebrow">Planning Calendar</div>
            <h2>Month-by-month HR visibility</h2>
            <p>Review approved leave, learning sessions, payroll runs, performance deadlines, and public holidays in one dynamic calendar.</p>
          </div>
          <div class="calendar-legend">${legendHtml()}</div>
        </section>
        <section class="calendar-workspace">
          <div class="calendar-board">
            <div class="calendar-toolbar">
              <div style="display:flex;align-items:center;gap:8px">
                <button class="btn btn-ghost btn-sm" type="button" data-cal-nav="-1">Prev</button>
                <button class="btn btn-ghost btn-sm" type="button" data-cal-today="1">Today</button>
                <button class="btn btn-ghost btn-sm" type="button" data-cal-nav="1">Next</button>
              </div>
              <strong id="calendar-month-label" class="calendar-month-label"></strong>
            </div>
            <div class="calendar-weekdays">
              ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `<span>${day}</span>`).join('')}
            </div>
            <div id="calendar-grid" class="calendar-grid"></div>
          </div>
          <aside class="calendar-side">
            <div class="calendar-side-head">
              <strong id="calendar-selected-label"></strong>
              <span id="calendar-selected-meta"></span>
            </div>
            <div id="calendar-day-events"></div>
          </aside>
        </section>
      </div>

      <div class="modal-overlay" id="calendar-edit-modal">
        <div class="modal" style="max-width:560px">
          <div class="modal-head">
            <div>
              <div class="module-eyebrow">Calendar Event</div>
              <h2>Edit Event</h2>
            </div>
            <button class="modal-x" type="button" onclick="closeModal('calendar-edit-modal')">&times;</button>
          </div>
          <div class="modal-body">
            <div style="display:grid;gap:14px">
              <label style="display:grid;gap:6px">
                <span style="font-size:12px;font-weight:600;color:var(--ink)">Title</span>
                <input id="calendar-edit-title" class="input" type="text" />
              </label>
              <label style="display:grid;gap:6px">
                <span style="font-size:12px;font-weight:600;color:var(--ink)">Detail</span>
                <textarea id="calendar-edit-detail" class="input" rows="4"></textarea>
              </label>
              <div style="display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:14px">
                <label style="display:grid;gap:6px">
                  <span style="font-size:12px;font-weight:600;color:var(--ink)">Start date</span>
                  <input id="calendar-edit-start" class="input" type="date" />
                </label>
                <label style="display:grid;gap:6px">
                  <span style="font-size:12px;font-weight:600;color:var(--ink)">End date</span>
                  <input id="calendar-edit-end" class="input" type="date" />
                </label>
              </div>
              <label style="display:grid;gap:6px">
                <span style="font-size:12px;font-weight:600;color:var(--ink)">Scope</span>
                <input id="calendar-edit-scope" class="input" type="text" />
              </label>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px">
              <button class="btn btn-ghost btn-sm" type="button" onclick="closeModal('calendar-edit-modal')">Cancel</button>
              <button class="btn btn-sm btn-navy" type="button" id="calendar-edit-save">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderPage(root, session, selectedDate) {
    const state = {
      session,
      events: buildEvents(session),
      viewDate: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1),
      selectedDate: startOfDay(selectedDate),
      editingId: '',
    };

    root.innerHTML = pageShell();

    function refreshEvents() {
      state.events = buildEvents(state.session);
    }

    function eventById(eventId) {
      return state.events.find(event => event.id === eventId) || null;
    }

    function openEditor(eventId) {
      const event = eventById(eventId);
      if (!event) return;
      state.editingId = eventId;
      const title = root.querySelector('#calendar-edit-title');
      const detail = root.querySelector('#calendar-edit-detail');
      const start = root.querySelector('#calendar-edit-start');
      const end = root.querySelector('#calendar-edit-end');
      const scope = root.querySelector('#calendar-edit-scope');
      if (!title || !detail || !start || !end || !scope) return;
      title.value = event.title;
      detail.value = event.detail;
      start.value = event.start;
      end.value = event.end;
      scope.value = event.scope;
      openModal('calendar-edit-modal');
    }

    function bindEditButtons() {
      root.querySelectorAll('[data-cal-edit]').forEach(button => {
        button.addEventListener('click', () => openEditor(button.dataset.calEdit));
      });
    }

    function draw() {
      const grid = root.querySelector('#calendar-grid');
      const monthEl = root.querySelector('#calendar-month-label');
      const labelEl = root.querySelector('#calendar-selected-label');
      const metaEl = root.querySelector('#calendar-selected-meta');
      const listEl = root.querySelector('#calendar-day-events');
      if (!grid || !monthEl || !labelEl || !metaEl || !listEl) return;

      const cells = monthGrid(state.viewDate);
      const todayIso = isoDate(new Date());
      monthEl.textContent = monthLabel(state.viewDate);

      grid.innerHTML = cells.map(date => {
        const dateIso = isoDate(date);
        const items = eventsForDate(state.events, dateIso);
        const preview = items.slice(0, 2).map(event => {
          const meta = CATEGORY_META[event.category] || CATEGORY_META.training;
          const multiDay = event.start !== event.end ? ' is-span' : '';
          return `<span class="calendar-pill${multiDay}" style="--pill-bg:${meta.bg};--pill-fg:${meta.color}">${event.title}</span>`;
        }).join('');
        const today = todayIso === dateIso ? ' is-today' : '';
        const otherMonth = sameMonth(date, state.viewDate) ? '' : ' is-dim';
        const selected = isoDate(state.selectedDate) === dateIso ? ' is-selected' : '';
        const ranged = items.some(event => event.start !== event.end) ? ' is-ranged' : '';
        return `
          <button type="button" class="calendar-cell${today}${otherMonth}${selected}${ranged}" data-cal-date="${dateIso}">
            <span class="calendar-cell-num">${date.getDate()}</span>
            <span class="calendar-cell-events">${preview || '<span class="calendar-cell-empty"></span>'}</span>
            ${items.length > 2 ? `<span class="calendar-cell-more">+${items.length - 2} more</span>` : '<span class="calendar-cell-more">&nbsp;</span>'}
          </button>
        `;
      }).join('');

      const selectedIso = isoDate(state.selectedDate);
      const dayEvents = eventsForDate(state.events, selectedIso);
      labelEl.textContent = dayLabel(state.selectedDate);
      metaEl.textContent = dayEvents.length ? `${dayEvents.length} event${dayEvents.length === 1 ? '' : 's'} scheduled` : 'No events scheduled';
      listEl.innerHTML = renderEventList(dayEvents, canEditEvents(state.session));

      grid.querySelectorAll('[data-cal-date]').forEach(button => {
        button.addEventListener('click', () => {
          state.selectedDate = parseIsoDate(button.dataset.calDate);
          if (state.selectedDate) {
            state.viewDate = new Date(state.selectedDate.getFullYear(), state.selectedDate.getMonth(), 1);
            draw();
          }
        });
      });

      bindEditButtons();
    }

    root.querySelectorAll('[data-cal-nav]').forEach(button => {
      button.addEventListener('click', () => {
        state.viewDate = new Date(state.viewDate.getFullYear(), state.viewDate.getMonth() + Number(button.dataset.calNav), 1);
        draw();
      });
    });

    root.querySelector('[data-cal-today]')?.addEventListener('click', () => {
      const today = startOfDay(new Date());
      state.selectedDate = today;
      state.viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
      draw();
    });

    root.querySelector('#calendar-edit-save')?.addEventListener('click', () => {
      const current = eventById(state.editingId);
      if (!current) return;

      const title = root.querySelector('#calendar-edit-title')?.value?.trim();
      const detail = root.querySelector('#calendar-edit-detail')?.value?.trim();
      const start = root.querySelector('#calendar-edit-start')?.value?.trim();
      const end = root.querySelector('#calendar-edit-end')?.value?.trim();
      const scope = root.querySelector('#calendar-edit-scope')?.value?.trim();

      if (!title || !detail || !parseIsoDate(start) || !parseIsoDate(end)) {
        Toast.error('Please complete the event form with valid dates.');
        return;
      }
      if (start > end) {
        Toast.error('End date must be on or after the start date.');
        return;
      }

      saveOverride(current.id, { title, detail, start, end, scope: scope || current.scope });
      refreshEvents();
      state.selectedDate = parseIsoDate(start) || state.selectedDate;
      state.viewDate = new Date(state.selectedDate.getFullYear(), state.selectedDate.getMonth(), 1);
      closeModal('calendar-edit-modal');
      Toast.success('Calendar event updated.');
      draw();
    });

    draw();
  }

  function miniShell(fullHref) {
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <button type="button" data-mini-nav="-1" style="background:none;border:none;color:var(--ink-mu);cursor:pointer;font-size:14px;padding:4px">&#8249;</button>
        <span data-mini-month style="font-size:13px;font-weight:600;color:var(--ink)"></span>
        <div style="display:flex;align-items:center;gap:8px">
          <a href="${fullHref}" data-mini-full style="font-size:12px;color:var(--navy-l);font-weight:600;text-decoration:none">Full view</a>
          <button type="button" data-mini-nav="1" style="background:none;border:none;color:var(--ink-mu);cursor:pointer;font-size:14px;padding:4px">&#8250;</button>
        </div>
      </div>
      <div class="cal-grid" data-mini-grid></div>
    `;
  }

  function renderMiniCalendar(root, session) {
    const today = startOfDay(new Date());
    const state = {
      events: buildEvents(session),
      viewDate: new Date(today.getFullYear(), today.getMonth(), 1),
    };

    root.innerHTML = miniShell(RBAC.appPath('modules/calendar/view.html'));

    function draw() {
      state.events = buildEvents(session);
      const label = root.querySelector('[data-mini-month]');
      const grid = root.querySelector('[data-mini-grid]');
      const fullLink = root.querySelector('[data-mini-full]');
      if (!label || !grid || !fullLink) return;

      label.textContent = monthLabel(state.viewDate);
      fullLink.href = `${RBAC.appPath('modules/calendar/view.html')}?date=${isoDate(state.viewDate)}`;

      const cells = monthGrid(state.viewDate);
      grid.innerHTML = [
        ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => `<div class="cal-dh">${day}</div>`).join(''),
        cells.map(date => {
          const dateIso = isoDate(date);
          const items = eventsForDate(state.events, dateIso);
          const classes = [
            'cal-d',
            sameMonth(date, state.viewDate) ? '' : 'dim',
            dateIso === isoDate(today) ? 'today' : '',
            items.length ? 'has-ev' : '',
          ].filter(Boolean).join(' ');
          return `<a class="${classes}" href="${RBAC.appPath('modules/calendar/view.html')}?date=${dateIso}" title="${dayLabel(date)}">${date.getDate()}</a>`;
        }).join(''),
      ].join('');
    }

    root.querySelectorAll('[data-mini-nav]').forEach(button => {
      button.addEventListener('click', () => {
        state.viewDate = new Date(state.viewDate.getFullYear(), state.viewDate.getMonth() + Number(button.dataset.miniNav), 1);
        draw();
      });
    });

    draw();
  }

  function initialDateFromLocation() {
    try {
      const params = new URLSearchParams(window.location.search);
      const requested = parseIsoDate(params.get('date'));
      return requested || startOfDay(new Date());
    } catch {
      return startOfDay(new Date());
    }
  }

  return {
    meta: CATEGORY_META,
    buildEvents,
    renderPage,
    renderMiniCalendar,
    initialDateFromLocation,
  };
})();

window.AsteraCalendar = AsteraCalendar;
