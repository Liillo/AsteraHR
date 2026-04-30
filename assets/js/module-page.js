const ModulePage = (() => {
  const DEFAULT_TABLE = ['Item', 'Detail', 'Status', 'Context'];
  let _rbacRole = '';

  const PAGES = {
    announcements: {
      title: 'Announcements',
      sub: 'Broadcast updates, policy notices, and company milestones from one place.',
      activeNav: 'announcements',
      allowedRoles: ['hr_admin', 'hr_officer', 'manager', 'employee', 'it_admin'],
      layout: 'bulletin',
      theme: 'rose',
      hero: { icon: '📢', eyebrow: 'Communication Hub', title: 'Company voice, clearly framed', text: 'Draft, schedule, and prioritize updates so people instantly know what matters right now.' },
      spotlight: ['This week\'s pulse', '3 unread notices across HR updates, office operations, and culture.'],
      stats: [
        ['12', 'Active posts', '4 scheduled this month', 'rose', '📣'],
        ['87%', 'Read rate', 'Higher than last week', 'blue', '✓'],
        ['3', 'Urgent alerts', 'Require acknowledgement', 'gold', '⚡'],
      ],
      rows: [
        ['Policy Refresh', 'Revised remote work guidelines published to all staff.', '📄'],
        ['Benefits Reminder', 'Medical cover dependants window closes on Friday.', '🩺'],
        ['Town Hall', 'Quarterly leadership town hall starts at 3:00 PM.', '🎤'],
      ],
      actions: [
        ['Create announcement', 'action:create-announcement'],
        ['View delivery analytics', 'modules/reports/analytics.html'],
        ['Open employee directory', 'modules/employees/list.html'],
      ],
      roleContent: {
        employee: {
          hero: { icon: '📢', eyebrow: 'Company Updates', title: 'What the organisation needs you to know', text: 'Employees only see shared announcements here, without admin publishing or reporting shortcuts.' },
          spotlight: ['Your unread updates', 'Keep up with policy notices, event reminders, and broad company communications.'],
          actions: [
            ['Open my profile', 'modules/employees/profile.html'],
            ['View public documents', 'modules/documents/repository.html'],
          ],
        },
        manager: {
          hero: { icon: '📢', eyebrow: 'Team Updates', title: 'Announcements that matter to {department}', text: 'Managers should see broad company notices plus communication that affects their own department and team rhythms.' },
          spotlight: ['Department communication view', 'Track notices your {department} team may need to acknowledge or act on.'],
        },
      },
      chips: ['Target by department', 'Track acknowledgements', 'Pin urgent updates'],
      tableTitle: 'Delivery queue',
      tableSub: 'Upcoming and recent send-outs',
      tableRows: [
        ['Benefits reminder', 'All employees', 'Scheduled', 'Today, 4:30 PM'],
        ['IT maintenance notice', 'ICT + HR', 'Draft', 'Awaiting approval'],
        ['Wellness Friday', 'Nairobi office', 'Delivered', 'Today, 9:10 AM'],
      ],
    },
    employees: {
      title: 'Employees',
      sub: 'Manage workforce records, headcount, and onboarding readiness.',
      activeNav: 'employees',
      allowedRoles: ['hr_admin', 'hr_officer', 'manager'],
      layout: 'operations',
      theme: 'navy',
      hero: { icon: '👥', eyebrow: 'People Operations', title: 'Your workforce command floor', text: 'A practical operations view for headcount, hiring flow, and record quality.' },
      spotlight: ['Workforce snapshot', '1,284 active employees with 18 pending record updates.'],
      stats: [
        ['1,284', 'Active employees', 'Across 7 departments', 'blue', '👤'],
        ['42', 'New hires', 'This quarter', 'green', '+'],
        ['18', 'Pending updates', 'Bio-data and contracts', 'red', '📝'],
      ],
      rows: [
        ['New employee setup', 'Capture 6 pending joiners before Monday induction.', '🧾'],
        ['Contract renewals', '4 fixed-term contracts expire within 30 days.', '📆'],
        ['Missing documents', '8 profiles still need signed offer letters.', '📎'],
      ],
      actions: [
        ['Add employee', 'action:add-employee'],
        ['View org chart', 'modules/employees/org-chart.html'],
        ['Open reports', 'modules/reports/analytics.html'],
      ],
      chips: ['Employee master data', 'Onboarding checklist', 'Department visibility'],
      tableTitle: 'Recent changes',
      tableSub: 'Latest employee record activity',
      tableRows: [
        ['Mary Njeri', 'Profile updated', 'Completed', 'Engineering'],
        ['Peter Kamau', 'Probation review due', 'Pending', 'Finance'],
        ['Diana Atieno', 'Contract uploaded', 'Completed', 'Operations'],
      ],
      roleContent: {
        manager: {
          sub: 'View employees and staffing context for your own department.',
          hero: { icon: '👥', eyebrow: 'Department People Ops', title: 'Your {department} team at a glance', text: 'Managers should be scoped to their own team and department staffing picture, not the full organisation.' },
          spotlight: ['Department workforce snapshot', 'Review headcount, staffing changes, and record quality for {department}.'],
          stats: [
            ['28', 'Team members', 'Within {department}', 'blue', '👤'],
            ['3', 'Open staffing items', 'Joiners or record updates', 'gold', '📝'],
            ['2', 'Probation reviews', 'Coming up soon', 'green', '📆'],
          ],
          rows: [
            ['New joiner readiness', 'Two new team members are joining {department} this month.', '🧾'],
            ['Probation tracking', 'Two probation checkpoints are due for your direct reports.', '📌'],
            ['Record accuracy', 'One employee profile in {department} needs an updated contract.', '📎'],
          ],
          actions: [
            ['View org chart', 'modules/employees/org-chart.html'],
            ['Open team reports', 'modules/reports/analytics.html'],
          ],
          chips: ['My department', 'Team staffing', 'Record follow-up'],
          tableTitle: 'Department changes',
          tableSub: 'Latest employee activity in {department}',
          tableRows: [
            ['New team member', 'Profile created', 'Completed', '{department}'],
            ['Probation review', 'Due this week', 'Pending', '{department}'],
            ['Contract update', 'Awaiting upload', 'Open', '{department}'],
          ],
        },
      },
    },
    'my-profile': {
      title: 'My Profile',
      sub: 'Review your personal, employment, and contact details.',
      activeNav: 'my-profile',
      allowedRoles: ['hr_admin', 'hr_officer', 'manager', 'employee', 'it_admin'],
      layout: 'profile',
      theme: 'indigo',
      hero: { icon: '🧾', eyebrow: 'Self Service', title: 'Your record, in one personal view', text: 'Designed like a personal workspace instead of a generic admin page.' },
      spotlight: ['Personal record', 'Use this page to verify details before payroll, leave, or compliance updates.'],
      stats: [
        ['94%', 'Profile completion', '2 details still missing', 'indigo', '👤'],
        ['2', 'Open tasks', 'Emergency contact and ID expiry', 'gold', '⚠'],
        ['1', 'Active document request', 'Awaiting upload', 'green', '📎'],
      ],
      rows: [
        ['Emergency contact', 'Confirm the latest phone number and relationship.', '📞'],
        ['KRA PIN copy', 'Upload a clear scan for tax compliance checks.', '🪪'],
        ['Bank account', 'Verify salary account details before payroll lock.', '🏦'],
      ],
      actions: [
        ['Update profile details', 'action:update-profile'],
        ['View payslips', 'modules/payroll/payslips.html'],
        ['Open documents', 'modules/documents/repository.html'],
      ],
      chips: ['Personal details', 'Employment details', 'Emergency contacts'],
      tableTitle: 'My recent requests',
      tableSub: 'Recent profile-related activity',
      tableRows: [
        ['National ID upload', 'Submitted', 'In review', 'Today'],
        ['Bank detail change', 'Approved', 'Completed', '2 days ago'],
        ['Address update', 'Saved', 'Draft', '1 week ago'],
      ],
      roleContent: {
        employee: {
          hero: { icon: '🧾', eyebrow: 'My Details', title: 'Only your own profile details live here', text: 'This view is intentionally scoped to your personal, payroll, and contact information only.' },
          spotlight: ['Personal record', 'Review the details connected to your leave, pay, and documents without exposing any colleague records.'],
        },
      },
    },
    'org-chart': {
      title: 'Org Chart',
      sub: 'Explore reporting lines, teams, and departmental structure.',
      activeNav: 'org-chart',
      allowedRoles: ['hr_admin', 'hr_officer', 'manager'],
      layout: 'atlas',
      theme: 'teal',
      hero: { icon: '🗂', eyebrow: 'Structure Map', title: 'See the company as a living network', text: 'A map-like presentation makes this page feel different from list-heavy modules.' },
      spotlight: ['Organisation view', 'Department heads, span of control, and team breakdown are available here.'],
      stats: [
        ['7', 'Departments', 'Including shared services', 'teal', '🏢'],
        ['46', 'Managers', 'Across all units', 'gold', '🧭'],
        ['8.4', 'Avg team size', 'Direct reports per lead', 'green', '📏'],
      ],
      rows: [
        ['Engineering', 'Largest department with four delivery squads.', '💻'],
        ['Finance', 'Two reporting layers from CFO to analysts.', '💼'],
        ['Operations', 'One supervisor role remains unfilled.', '📍'],
      ],
      actions: [
        ['Open employees', 'modules/employees/list.html'],
        ['Review reports', 'modules/reports/analytics.html'],
        ['See announcements', 'modules/announcements/board.html'],
      ],
      chips: ['Reporting lines', 'Department spans', 'Vacancy visibility'],
      tableTitle: 'Leadership nodes',
      tableSub: 'Selected reporting units',
      tableRows: [
        ['Head of Engineering', '12 direct reports', 'Filled', 'Samuel Kariuki'],
        ['Finance Manager', '8 direct reports', 'Filled', 'Anne Wambui'],
        ['Operations Supervisor', '6 direct reports', 'Vacant', 'Recruiting'],
      ],
      roleContent: {
        manager: {
          sub: 'Explore reporting lines and structure around your own department.',
          hero: { icon: '🗂', eyebrow: 'Department Structure', title: 'How {department} fits into the wider org', text: 'Managers should see the structure around their own reporting lines and adjacent teams, not a global unrestricted map.' },
          spotlight: ['Your organisational view', 'Review reporting lines, spans, and vacancies connected to {department}.'],
          stats: [
            ['1', 'Department focus', '{department}', 'teal', '🏢'],
            ['4', 'Reporting layers', 'Within your chain', 'gold', '🧭'],
            ['1', 'Open role', 'Affects your structure', 'green', '📍'],
          ],
          rows: [
            ['Department headcount', '{department} currently has a stable team structure.', '👥'],
            ['Reporting span', 'Your direct reporting layer remains manageable this quarter.', '📏'],
            ['Adjacent teams', 'Cross-functional collaboration is highest with operations and finance.', '🔗'],
          ],
          actions: [
            ['Open employees', 'modules/employees/list.html'],
            ['Open team reports', 'modules/reports/analytics.html'],
          ],
          chips: ['My reporting lines', 'My department', 'Adjacent teams'],
          tableTitle: 'Department structure notes',
          tableSub: 'Current structure markers for {department}',
          tableRows: [
            ['Department head', 'Reporting line active', 'Filled', '{department}'],
            ['Supervisor layer', 'Span under review', 'Stable', '{department}'],
            ['Open position', 'Recruitment underway', 'Vacant', '{department}'],
          ],
        },
      },
    },
    ats: {
      title: 'ATS Bridge',
      sub: 'Monitor candidate sync health, conversion readiness, and integration status.',
      activeNav: 'ats',
      allowedRoles: ['hr_admin', 'it_admin'],
      layout: 'console',
      theme: 'red',
      hero: { icon: '🔗', eyebrow: 'Integration Console', title: 'A more technical surface for bridge health', text: 'The visual treatment leans operational and system-focused rather than people-admin focused.' },
      spotlight: ['Integration health', '3 new candidate records are ready for downstream conversion.'],
      stats: [
        ['99.2%', 'Sync uptime', 'Last 30 days', 'green', '✓'],
        ['3', 'Ready candidates', 'Awaiting HR review', 'blue', '👤'],
        ['1', 'Warning', 'Webhook retry in queue', 'red', '⚙'],
      ],
      rows: [
        ['Candidate synced', 'Mercy Nyambura passed to pre-onboarding.', '📥'],
        ['Webhook retry', 'Offer accepted event retried after timeout.', '🔁'],
        ['Schema check', 'Payroll mapping validation completed successfully.', '🧪'],
      ],
      actions: [
        ['Run manual sync', 'action:run-manual-sync'],
        ['View system logs', 'modules/settings/system-logs.html'],
        ['Open settings', 'modules/settings/organisation.html'],
      ],
      chips: ['Webhook visibility', 'Candidate conversion', 'Integration audit'],
      tableTitle: 'Bridge queue',
      tableSub: 'Current sync pipeline items',
      tableRows: [
        ['Offer accepted', 'Preboarding sync', 'Queued', '1 min ago'],
        ['Candidate hired', 'Employee stub creation', 'Completed', '13 min ago'],
        ['Job closed', 'Archive mirror', 'Completed', '42 min ago'],
      ],
    },
    attendance: {
      title: 'Attendance',
      sub: 'Track clock-ins, presence trends, and attendance exceptions.',
      activeNav: 'attendance',
      allowedRoles: ['hr_admin', 'hr_officer', 'manager', 'employee'],
      layout: 'operations',
      theme: 'teal',
      hero: { icon: '🕐', eyebrow: 'Presence Tracking', title: 'Built around daily rhythm and movement', text: 'The design shifts toward pulse monitoring and operational tempo.' },
      spotlight: ['Today\'s attendance', '1,217 staff marked present, with 9 exceptions needing review.'],
      stats: [
        ['94.7%', 'Attendance rate', 'Across all tracked staff', 'green', '✓'],
        ['58', 'Remote staff', 'Logged in by 9:00 AM', 'teal', '🏠'],
        ['9', 'Exceptions', 'Late or missing clock-ins', 'gold', '⏱'],
      ],
      rows: [
        ['Late arrival spike', 'Engineering recorded 7 late clock-ins before noon.', '📈'],
        ['Missing checkout', '3 employees missed yesterday\'s checkout.', '🚪'],
        ['Device issue', 'Westlands biometric terminal back online.', '🧰'],
      ],
      actions: [
        ['Submit correction', 'action:submit-correction'],
        ['Open leave requests', 'modules/leave/requests.html'],
        ['Review shifts', 'modules/attendance/shifts.html'],
      ],
      chips: ['Clock-in records', 'Corrections workflow', 'Presence summary'],
      tableTitle: 'Recent attendance entries',
      tableSub: 'Latest logged events',
      tableRows: [
        ['Grace Achieng', 'Checked in', '08:01 AM', 'Engineering'],
        ['Peter Kamau', 'Late arrival', '09:18 AM', 'Finance'],
        ['Amina Odhiambo', 'Remote check-in', '07:46 AM', 'HR'],
      ],
      roleContent: {
        employee: {
          sub: 'Track only your own clock-ins, attendance corrections, and presence history.',
          hero: { icon: '🕐', eyebrow: 'My Attendance', title: 'Your personal attendance timeline', text: 'Employees should only see their own check-in history, correction status, and attendance summaries.' },
          spotlight: ['Your attendance today', 'Checked in at 08:01 AM with no unresolved attendance issues.'],
          stats: [
            ['08:01', 'Today\'s check-in', 'Right on schedule', 'teal', '🕐'],
            ['1', 'Correction open', 'Awaiting HR review', 'gold', '📝'],
            ['96%', 'Monthly attendance', 'Your current rate', 'green', '✓'],
          ],
          rows: [
            ['Today\'s check-in', 'Your recorded arrival time is 08:01 AM.', '📍'],
            ['Correction request', 'One missing checkout from last week is under review.', '🧾'],
            ['Work pattern', '3 remote workdays logged this month.', '🏠'],
          ],
          actions: [
            ['Request correction', 'action:request-correction'],
            ['Open leave requests', 'modules/leave/requests.html'],
            ['Open my profile', 'modules/employees/profile.html'],
          ],
          chips: ['My check-ins', 'My corrections', 'My attendance summary'],
          tableTitle: 'My recent attendance',
          tableSub: 'Only your own latest entries',
          tableRows: [
            ['Today', 'Check-in recorded', '08:01 AM', 'Head office'],
            ['Yesterday', 'Checked out', '05:34 PM', 'Head office'],
            ['Last Friday', 'Correction submitted', 'Pending', 'Missing checkout'],
          ],
        },
        manager: {
          sub: 'Review attendance trends and exceptions for your own department.',
          hero: { icon: '🕐', eyebrow: 'Team Attendance', title: '{department} attendance in one manager view', text: 'Managers should only monitor attendance patterns, corrections, and issues for their own team.' },
          spotlight: ['Department attendance today', '{department} is largely on time, with a few exceptions needing your review.'],
          stats: [
            ['93%', 'Team attendance', 'For {department}', 'teal', '✓'],
            ['4', 'Exceptions', 'Need follow-up', 'gold', '⏱'],
            ['2', 'Correction requests', 'Awaiting approval', 'blue', '📝'],
          ],
          rows: [
            ['Late arrivals', 'Two team members in {department} clocked in late today.', '📈'],
            ['Missing checkout', 'One unresolved checkout from your team needs review.', '🚪'],
            ['Remote attendance', 'Three team members are marked remote today.', '🏠'],
          ],
          actions: [
            ['Open leave requests', 'modules/leave/requests.html'],
            ['Review shifts', 'modules/attendance/shifts.html'],
          ],
          chips: ['My team', 'Attendance exceptions', 'Corrections'],
          tableTitle: 'Department attendance activity',
          tableSub: 'Recent attendance events for {department}',
          tableRows: [
            ['Late arrival', 'Team member clocked in after 9:00 AM', 'Open', '{department}'],
            ['Remote check-in', 'Recorded successfully', 'Completed', '{department}'],
            ['Missing checkout', 'Correction submitted', 'Pending', '{department}'],
          ],
        },
      },
    },
    leave: {
      title: 'Leave',
      sub: 'Manage balances, requests, approvals, and upcoming absences.',
      activeNav: 'leave',
      allowedRoles: ['hr_admin', 'hr_officer', 'manager', 'employee'],
      layout: 'bulletin',
      theme: 'green',
      hero: { icon: '🌴', eyebrow: 'Time Away', title: 'A lighter, calendar-like leave space', text: 'The softer layout helps this page feel separate from heavier admin workflows.' },
      spotlight: ['Leave overview', '18 open requests and 7 approvals currently need attention.'],
      stats: [
        ['18', 'Open requests', 'Across annual, sick, and study leave', 'green', '🗓'],
        ['7', 'Awaiting approval', 'Manager or HR action needed', 'gold', '✓'],
        ['142', 'Days booked', 'For the next 30 days', 'teal', '📆'],
      ],
      rows: [
        ['Annual leave peak', 'Operations has the highest overlap next Friday.', '🌤'],
        ['Medical leave', '2 documents were uploaded for verification.', '🩺'],
        ['Study leave', 'One request exceeds current policy limit.', '📚'],
      ],
      actions: [
        ['Create leave request', 'action:create-leave-request'],
        ['Check attendance', 'modules/attendance/register.html'],
        ['Open reports', 'modules/reports/analytics.html'],
      ],
      chips: ['Balances', 'Approval queue', 'Calendar overlap'],
      tableTitle: 'Latest leave requests',
      tableSub: 'Newest submissions in the queue',
      tableRows: [
        ['Fatuma Kidogo', 'Annual leave', 'Pending', '3 days'],
        ['Oliver Odhiambo', 'Overtime recovery', 'Pending', '1 day'],
        ['Mary Njeri', 'Study leave', 'Approved', '5 days'],
      ],
      roleContent: {
        employee: {
          sub: 'Manage only your own leave balances, requests, and approvals.',
          hero: { icon: '🌴', eyebrow: 'My Leave', title: 'Your leave balance and request history', text: 'Employees can review only their own time away, balance, and request outcomes.' },
          spotlight: ['Your leave overview', 'You have 14 annual leave days remaining and one request in progress.'],
          stats: [
            ['14 days', 'Annual balance', 'Remaining this year', 'green', '🌴'],
            ['1', 'Pending request', 'Awaiting approval', 'gold', '📝'],
            ['3', 'Approved this year', 'Requests completed', 'teal', '✓'],
          ],
          rows: [
            ['Annual leave balance', 'You currently have 14 approved days remaining.', '📆'],
            ['Pending request', 'A 2-day leave request is awaiting manager approval.', '⏳'],
            ['Upcoming time off', 'No other future bookings overlap your pending request.', '🌤'],
          ],
          actions: [
            ['Create leave request', 'action:create-leave-request'],
            ['Check my attendance', 'modules/attendance/register.html'],
            ['Open my profile', 'modules/employees/profile.html'],
          ],
          chips: ['My balances', 'My requests', 'My leave calendar'],
          tableTitle: 'My leave requests',
          tableSub: 'Your latest leave activity',
          tableRows: [
            ['Annual leave', '2 working days', 'Pending', 'Requested yesterday'],
            ['Sick leave', '1 day', 'Approved', 'Last month'],
            ['Annual leave', '3 working days', 'Approved', 'January'],
          ],
        },
        manager: {
          sub: 'Review leave requests and upcoming absences for your own department.',
          hero: { icon: '🌴', eyebrow: 'Team Leave', title: '{department} leave planning', text: 'Managers should focus on their team’s balances, upcoming absences, and approval queue only.' },
          spotlight: ['Department leave overview', 'A few leave requests in {department} need approval and overlap checks.'],
          stats: [
            ['3', 'Pending approvals', 'Within {department}', 'green', '🗓'],
            ['2', 'Upcoming absences', 'Next 14 days', 'gold', '📆'],
            ['1', 'Coverage risk', 'Needs planning', 'teal', '⚠'],
          ],
          rows: [
            ['Approval queue', 'Three leave requests from {department} need your attention.', '⏳'],
            ['Overlap watch', 'One future absence overlaps with a key sprint period.', '🌤'],
            ['Coverage check', 'You may need temporary handover planning for one request.', '🔄'],
          ],
          actions: [
            ['Check attendance', 'modules/attendance/register.html'],
            ['Open team reports', 'modules/reports/analytics.html'],
          ],
          chips: ['My approvals', 'My team leave', 'Coverage planning'],
          tableTitle: 'Department leave activity',
          tableSub: 'Latest leave requests in {department}',
          tableRows: [
            ['Annual leave', '3 working days', 'Pending', '{department}'],
            ['Sick leave', '1 day', 'Approved', '{department}'],
            ['Study leave', 'Awaiting review', 'Open', '{department}'],
          ],
        },
      },
    },
    shifts: {
      title: 'Shifts',
      sub: 'Coordinate rosters, coverage, and attendance planning for teams.',
      activeNav: 'shifts',
      allowedRoles: ['hr_admin', 'hr_officer', 'manager'],
      layout: 'operations',
      theme: 'gold',
      hero: { icon: '🔄', eyebrow: 'Rota Control', title: 'Shift planning with more grid and motion', text: 'This page leans into scheduling energy instead of standard admin cards.' },
      spotlight: ['Roster planning', '32 shift assignments were updated this week.'],
      stats: [
        ['32', 'Shift changes', 'In the last 7 days', 'gold', '🔁'],
        ['6', 'Coverage gaps', 'Need reassignment', 'red', '⚠'],
        ['91%', 'Rota filled', 'For next week', 'green', '✓'],
      ],
      rows: [
        ['Weekend support', 'Customer care needs two more weekend allocations.', '📞'],
        ['Night shift balance', 'ICT workload is evenly distributed this cycle.', '🌙'],
        ['Swap pending', 'One swap request awaits manager approval.', '🔁'],
      ],
      actions: [
        ['Publish roster', 'action:publish-roster'],
        ['Open attendance', 'modules/attendance/register.html'],
        ['View employees', 'modules/employees/list.html'],
      ],
      chips: ['Coverage planning', 'Shift swaps', 'Overtime prevention'],
      tableTitle: 'Upcoming coverage',
      tableSub: 'Selected roster items',
      tableRows: [
        ['Customer Care AM', '08:00 - 16:00', 'Filled', '4 staff'],
        ['ICT Night Support', '22:00 - 06:00', 'Filled', '2 staff'],
        ['Warehouse Weekend', '09:00 - 17:00', 'Gap', '1 staff short'],
      ],
      roleContent: {
        manager: {
          sub: 'Coordinate rosters and coverage for your own department.',
          hero: { icon: '🔄', eyebrow: 'Team Rota', title: '{department} shift planning', text: 'Managers should only plan and review coverage for their own team schedules.' },
          spotlight: ['Department roster planning', 'Recent rota changes and coverage gaps are shown only for {department}.'],
          stats: [
            ['9', 'Shift updates', 'This week in {department}', 'gold', '🔁'],
            ['2', 'Coverage gaps', 'Need reassignment', 'red', '⚠'],
            ['95%', 'Roster filled', 'For next week', 'green', '✓'],
          ],
          rows: [
            ['Weekend support', '{department} needs one more weekend allocation.', '📞'],
            ['Shift swap', 'One swap request from your team awaits action.', '🔁'],
            ['Coverage outlook', 'Most core shifts are fully staffed next week.', '📊'],
          ],
          actions: [
            ['Open attendance', 'modules/attendance/register.html'],
            ['View team employees', 'modules/employees/list.html'],
          ],
          chips: ['My rota', 'My coverage gaps', 'My swap requests'],
          tableTitle: 'Department coverage',
          tableSub: 'Selected roster items for {department}',
          tableRows: [
            ['Morning shift', '08:00 - 16:00', 'Filled', '{department}'],
            ['Weekend cover', '09:00 - 17:00', 'Gap', '{department}'],
            ['Swap request', 'Pending approval', 'Open', '{department}'],
          ],
        },
      },
    },
    payroll: {
      title: 'Payroll',
      sub: 'Prepare runs, review changes, and monitor payroll readiness.',
      activeNav: 'payroll',
      allowedRoles: ['hr_admin', 'hr_officer'],
      layout: 'finance',
      theme: 'gold',
      hero: { icon: '💰', eyebrow: 'Payroll Control', title: 'Designed like a finance workspace', text: 'Warmer tones, denser figures, and stronger hierarchy make payroll feel separate from HR record pages.' },
      spotlight: ['Payroll readiness', 'June payroll is 82% prepared with two blockers left.'],
      stats: [
        ['KSh 42M', 'Projected gross', 'Current monthly run', 'gold', '💵'],
        ['82%', 'Run readiness', 'Validated employees and inputs', 'blue', '📊'],
        ['2', 'Blocking issues', 'Missing bank or tax data', 'red', '⚠'],
      ],
      rows: [
        ['Bank validation', '2 employees still have invalid account details.', '🏦'],
        ['Allowances import', 'Transport allowances synced successfully.', '📥'],
        ['Approval window', 'Run approval opens tomorrow at 10:00 AM.', '🧾'],
      ],
      actions: [
        ['Start payroll run', 'action:start-payroll-run'],
        ['Review payslips', 'modules/payroll/payslips.html'],
        ['Open reports', 'modules/reports/analytics.html'],
      ],
      chips: ['Run status', 'Variance review', 'Approval readiness'],
      tableTitle: 'Latest payroll events',
      tableSub: 'Recent changes affecting payroll',
      tableRows: [
        ['June draft generated', 'Payroll engine', 'Completed', 'Today'],
        ['Bank detail mismatch', 'Employee profile', 'Open', '2 cases'],
        ['PAYE rate sync', 'Compliance', 'Completed', 'Yesterday'],
      ],
    },
    payslips: {
      title: 'My Payslips',
      sub: 'Access salary statements, deductions, and net pay history.',
      activeNav: 'payslips',
      allowedRoles: ['employee'],
      layout: 'profile',
      theme: 'gold',
      hero: { icon: '💳', eyebrow: 'Employee Pay', title: 'A cleaner self-service money view', text: 'This page feels personal and focused instead of looking like the payroll admin workspace.' },
      spotlight: ['Payslip centre', 'Your latest payslip is ready and available for download.'],
      stats: [
        ['May 2025', 'Latest payslip', 'Net pay published', 'green', '✓'],
        ['12', 'Payslips available', 'Rolling 12 months', 'gold', '📄'],
        ['0', 'Payment issues', 'No flagged exceptions', 'blue', '🏦'],
      ],
      rows: [
        ['Gross vs net pay', 'Compare earnings and deductions month by month.', '📊'],
        ['Tax deductions', 'Track PAYE, NSSF, and NHIF entries.', '🧮'],
        ['Download history', 'Keep official PDF copies for your records.', '↓'],
      ],
      actions: [
        ['Download latest payslip', 'action:download-latest-payslip'],
        ['Open my profile', 'modules/employees/profile.html'],
        ['View documents', 'modules/documents/repository.html'],
      ],
      chips: ['Net pay', 'Deductions', 'Download archive'],
      tableTitle: 'Recent statements',
      tableSub: 'Latest salary records',
      tableRows: [
        ['May 2025', 'Processed', 'Available', 'Net KSh 184,000'],
        ['April 2025', 'Processed', 'Available', 'Net KSh 181,500'],
        ['March 2025', 'Processed', 'Available', 'Net KSh 181,500'],
      ],
    },
    performance: {
      title: 'Performance',
      sub: 'Track appraisal cycles, review completion, and coaching follow-up.',
      activeNav: 'performance',
      allowedRoles: ['hr_admin', 'hr_officer', 'manager', 'employee'],
      layout: 'atlas',
      theme: 'indigo',
      hero: { icon: '⭐', eyebrow: 'Growth & Reviews', title: 'A sharper, progress-led performance screen', text: 'The composition centers review motion and coaching signals instead of generic lists.' },
      spotlight: ['Review cycle status', 'Q2 performance reviews are 66% complete across the organisation.'],
      stats: [
        ['66%', 'Cycle completion', '847 of 1,284 reviews done', 'indigo', '⭐'],
        ['113', 'Manager actions', 'Outstanding review submissions', 'gold', '🧭'],
        ['24', 'Calibration items', 'Flagged for discussion', 'teal', '🗂'],
      ],
      rows: [
        ['Late reviews', 'Engineering has 12 overdue peer review submissions.', '⏰'],
        ['Calibration prep', 'Finance shortlisted 6 reviews for moderation.', '📋'],
        ['Development plans', '34 growth actions were created this week.', '📚'],
      ],
      actions: [
        ['Open current cycle', 'action:open-current-cycle'],
        ['Review training', 'modules/training/catalogue.html'],
        ['See reports', 'modules/reports/analytics.html'],
      ],
      chips: ['Review cycle', 'Manager follow-up', 'Development plans'],
      tableTitle: 'Recent review activity',
      tableSub: 'Latest performance updates',
      tableRows: [
        ['Grace Achieng', 'Self review submitted', 'Completed', 'Today'],
        ['Samuel Kariuki', 'Manager review pending', 'Open', '3 reports'],
        ['Finance calibration', 'Session scheduled', 'Upcoming', 'Friday'],
      ],
      roleContent: {
        employee: {
          sub: 'Track your own review progress, feedback, and development actions.',
          hero: { icon: '⭐', eyebrow: 'My Performance', title: 'Your review cycle, not everyone else\'s', text: 'This employee view is scoped to your goals, review status, and development notes only.' },
          spotlight: ['Your review status', 'Your self review is submitted and waiting for manager comments.'],
          stats: [
            ['Submitted', 'Self review', 'Sent this week', 'indigo', '⭐'],
            ['2', 'Goals on track', 'Current quarter', 'green', '🎯'],
            ['1', 'Manager step left', 'Awaiting feedback', 'gold', '🧭'],
          ],
          rows: [
            ['Self review complete', 'Your self assessment was submitted successfully.', '✅'],
            ['Goal progress', 'Two of your active goals are currently on track.', '📈'],
            ['Development focus', 'One coaching action remains open for this quarter.', '📚'],
          ],
          actions: [
            ['Open current cycle', 'action:open-current-cycle'],
            ['Open my learning plan', 'modules/training/catalogue.html'],
            ['View my profile', 'modules/employees/profile.html'],
          ],
          tableTitle: 'My recent review activity',
          tableSub: 'Only your own latest performance updates',
          tableRows: [
            ['Self assessment', 'Submitted', 'Completed', 'Today'],
            ['Manager feedback', 'Awaiting response', 'Open', 'Next step'],
            ['Growth action', 'Coaching session', 'Planned', 'This month'],
          ],
        },
        manager: {
          sub: 'Track review progress and coaching follow-up for your own team.',
          hero: { icon: '⭐', eyebrow: 'Team Performance', title: '{department} review progress', text: 'Managers should only see the performance cycle, coaching items, and review actions tied to their team.' },
          spotlight: ['Department review status', 'A few reviews in {department} still need manager action or coaching follow-up.'],
          stats: [
            ['72%', 'Team completion', 'For {department}', 'indigo', '⭐'],
            ['4', 'Reviews pending', 'Manager action needed', 'gold', '🧭'],
            ['3', 'Growth actions', 'Tracked this month', 'teal', '📚'],
          ],
          rows: [
            ['Pending manager reviews', 'Four reviews in {department} still need completion.', '⏰'],
            ['Coaching actions', 'Three active growth plans are attached to your team.', '📘'],
            ['Calibration prep', 'One review may need calibration discussion.', '📋'],
          ],
          actions: [
            ['Open current cycle', 'action:open-current-cycle'],
            ['Review training', 'modules/training/catalogue.html'],
            ['Open team reports', 'modules/reports/analytics.html'],
          ],
          tableTitle: 'Department review activity',
          tableSub: 'Latest performance updates for {department}',
          tableRows: [
            ['Manager review', 'Awaiting completion', 'Open', '{department}'],
            ['Self assessment', 'Submitted', 'Completed', '{department}'],
            ['Growth plan', 'Coaching checkpoint set', 'Upcoming', '{department}'],
          ],
        },
      },
    },
    training: {
      title: 'Training',
      sub: 'Organise learning programmes, enrolments, and completion tracking.',
      activeNav: 'training',
      allowedRoles: ['hr_admin', 'hr_officer', 'manager', 'employee'],
      layout: 'bulletin',
      theme: 'teal',
      hero: { icon: '📚', eyebrow: 'Learning Studio', title: 'A brighter learning-focused destination', text: 'This page borrows more of a catalogue and programme-board feel.' },
      spotlight: ['Learning overview', '78.2% of mandatory learning modules are complete this quarter.'],
      stats: [
        ['78.2%', 'Completion rate', 'Across required learning', 'green', '✓'],
        ['9', 'Active programmes', 'Running this month', 'teal', '🎓'],
        ['36', 'Pending enrolments', 'Awaiting manager action', 'gold', '📝'],
      ],
      rows: [
        ['Leadership cohort', 'Starts next week with 24 confirmed participants.', '🧠'],
        ['Compliance refresh', '11 employees are overdue on policy training.', '📘'],
        ['Manager nominations', '8 seats remain open for coaching skills.', '🙋'],
      ],
      actions: [
        ['Browse catalogue', 'action:browse-my-training'],
        ['Create programme', 'action:create-programme'],
        ['Open performance', 'modules/performance/appraisals.html'],
        ['View reports', 'modules/reports/analytics.html'],
      ],
      chips: ['Course catalogue', 'Mandatory learning', 'Programme intake'],
      tableTitle: 'Upcoming learning sessions',
      tableSub: 'Next sessions on the calendar',
      tableRows: [
        ['Leadership essentials', '24 enrolled', 'Scheduled', 'Monday'],
        ['Data privacy refresh', 'All employees', 'Open', 'Wednesday'],
        ['Coaching for managers', '8 enrolled', 'Scheduled', 'Friday'],
      ],
      roleContent: {
        employee: {
          sub: 'See your own learning assignments, enrolments, and upcoming sessions.',
          hero: { icon: '📚', eyebrow: 'My Learning', title: 'Your training journey at a glance', text: 'Employees should only see their own enrolments, assigned learning, and upcoming sessions.' },
          spotlight: ['Your learning overview', 'Two required modules are complete and one live session is upcoming.'],
          stats: [
            ['2', 'Modules complete', 'This quarter', 'teal', '✓'],
            ['1', 'Session upcoming', 'Next learning event', 'gold', '📅'],
            ['91%', 'Personal completion', 'Assigned coursework done', 'green', '🎓'],
          ],
          rows: [
            ['Compliance refresh', 'Completed and recorded in your profile.', '📘'],
            ['Leadership webinar', 'Your next enrolled session starts on Friday.', '🧠'],
            ['Optional course', 'One optional catalogue course was bookmarked.', '🔖'],
          ],
          actions: [
            ['Browse my training', 'action:browse-my-training'],
            ['Open my performance', 'modules/performance/appraisals.html'],
          ],
          chips: ['My enrolments', 'My required learning', 'My upcoming sessions'],
          tableTitle: 'My upcoming learning',
          tableSub: 'Only your scheduled or assigned items',
          tableRows: [
            ['Data privacy refresh', 'Assigned module', 'Completed', 'Recorded'],
            ['Leadership webinar', 'Live session', 'Scheduled', 'Friday'],
            ['Coaching basics', 'Optional course', 'Bookmarked', 'Not started'],
          ],
        },
        manager: {
          sub: 'Track learning progress and training demand for your own department.',
          hero: { icon: '📚', eyebrow: 'Team Learning', title: '{department} learning and capability view', text: 'Managers should only see their team’s learning assignments, enrolments, and overdue training.' },
          spotlight: ['Department learning overview', 'Required learning progress and enrolment demand are scoped to {department}.'],
          stats: [
            ['81%', 'Completion rate', 'For {department}', 'teal', '🎓'],
            ['5', 'Pending learners', 'Still need action', 'gold', '📝'],
            ['2', 'Upcoming sessions', 'Booked by your team', 'green', '📅'],
          ],
          rows: [
            ['Required learning', 'A few people in {department} still need to finish compliance refresh.', '📘'],
            ['Upcoming sessions', 'Two team members are enrolled in next week\'s sessions.', '🧠'],
            ['Nomination need', 'One optional development seat is still open for your team.', '🙋'],
          ],
          actions: [
            ['Browse catalogue', 'action:browse-my-training'],
            ['Open performance', 'modules/performance/appraisals.html'],
            ['View team reports', 'modules/reports/analytics.html'],
          ],
          chips: ['My team learning', 'Required modules', 'Upcoming sessions'],
          tableTitle: 'Department learning activity',
          tableSub: 'Recent training items for {department}',
          tableRows: [
            ['Compliance refresh', 'Assigned module', 'Open', '{department}'],
            ['Leadership session', 'Enrolled', 'Scheduled', '{department}'],
            ['Coaching skills', 'Nomination pending', 'Open', '{department}'],
          ],
        },
      },
    },
    documents: {
      title: 'Documents',
      sub: 'Store, review, and retrieve employee and compliance files.',
      activeNav: 'documents',
      allowedRoles: ['hr_admin', 'hr_officer', 'manager', 'employee'],
      layout: 'operations',
      theme: 'slate',
      hero: { icon: '📄', eyebrow: 'Repository', title: 'A calmer archive-style interface', text: 'Documents should feel orderly and durable, so this page uses a quieter, repository-like presentation.' },
      spotlight: ['Document repository', '8 items need follow-up due to expiry or missing uploads.'],
      stats: [
        ['3,482', 'Files indexed', 'Employee and policy records', 'slate', '📁'],
        ['8', 'Needs attention', 'Expiry or upload gaps', 'gold', '⚠'],
        ['99%', 'Repository uptime', 'Access remains stable', 'green', '✓'],
      ],
      rows: [
        ['Offer letters', '3 signed copies are still missing from onboarding packs.', '📎'],
        ['ID expiry', '2 identification documents expire within 45 days.', '🪪'],
        ['Policy archive', 'Latest handbook version was published successfully.', '📚'],
      ],
      actions: [
        ['Upload document', 'action:upload-document'],
        ['Open my profile', 'modules/employees/profile.html'],
        ['View system logs', 'modules/settings/system-logs.html'],
      ],
      roleContent: {
        employee: {
          title: 'Public & My Documents',
          sub: 'Access public company documents and files that belong to your own record.',
          hero: { icon: '📄', eyebrow: 'Document Access', title: 'Only public files and your own records', text: 'Employees can access shared company documents and personal files attached to their own profile, not the full repository.' },
          spotlight: ['Your document view', 'Public policies are available alongside your own uploaded or assigned files.'],
          stats: [
            ['6', 'Public documents', 'Policies and handbooks', 'slate', '📘'],
            ['3', 'My files', 'Attached to your profile', 'indigo', '🧾'],
            ['1', 'Upload needed', 'Outstanding personal file', 'gold', '📎'],
          ],
          rows: [
            ['Employee handbook', 'Shared company document available to all staff.', '📚'],
            ['Code of conduct', 'Public policy currently active for all employees.', '📄'],
            ['KRA PIN copy', 'Personal document requested for your profile only.', '🪪'],
          ],
          actions: [
            ['Open my profile', 'modules/employees/profile.html'],
            ['View announcements', 'modules/announcements/board.html'],
          ],
          chips: ['Public documents', 'My documents', 'Personal upload requests'],
          tableTitle: 'Accessible documents',
          tableSub: 'Public files and items linked to your record',
          tableRows: [
            ['Employee handbook', 'Public policy', 'Available', 'All staff'],
            ['Code of conduct', 'Public policy', 'Available', 'All staff'],
            ['KRA PIN copy', 'Personal record', 'Requested', 'My profile'],
          ],
        },
        manager: {
          hero: { icon: '📄', eyebrow: 'Team Documents', title: 'Department-relevant documents and manager essentials', text: 'Managers should stay focused on shared team resources and relevant records, not the full HR repository.' },
          spotlight: ['Scoped document access', 'This view should prioritise department-facing files and manager-level records.'],
          sub: 'Access shared department documents and records relevant to your team.',
          stats: [
            ['8', 'Shared files', 'Relevant to {department}', 'slate', '📁'],
            ['2', 'Pending requests', 'Need follow-up', 'gold', '📎'],
            ['1', 'Expiry watch', 'Affects your team', 'green', '🪪'],
          ],
          rows: [
            ['Team templates', 'Shared onboarding and policy templates for {department}.', '📄'],
            ['Expiring file', 'One required document for your team is nearing expiry.', '🪪'],
            ['Manager pack', 'Shared guidance docs are available for team operations.', '📚'],
          ],
          actions: [
            ['Open team employees', 'modules/employees/list.html'],
            ['View announcements', 'modules/announcements/board.html'],
          ],
          chips: ['Department files', 'Shared resources', 'Expiry follow-up'],
          tableTitle: 'Department document activity',
          tableSub: 'Records relevant to {department}',
          tableRows: [
            ['Policy template', 'Shared resource', 'Available', '{department}'],
            ['Required ID copy', 'Needs renewal', 'Pending', '{department}'],
            ['Manager handbook', 'Shared document', 'Available', '{department}'],
          ],
        },
      },
      chips: ['Repository', 'Expiry tracking', 'Upload workflow'],
      tableTitle: 'Recent document activity',
      tableSub: 'Latest repository events',
      tableRows: [
        ['Contract upload', 'Employee file', 'Completed', 'Today'],
        ['KRA PIN request', 'Profile checklist', 'Open', '2 employees'],
        ['Policy handbook', 'Versioned archive', 'Published', 'Yesterday'],
      ],
    },
    reports: {
      title: 'Reports',
      sub: 'Review workforce, payroll, attendance, and HR operational analytics.',
      activeNav: 'reports',
      allowedRoles: ['hr_admin', 'hr_officer', 'manager'],
      layout: 'analytics',
      theme: 'navy',
      hero: { icon: '📈', eyebrow: 'Analytics', title: 'A dashboard-first reporting surface', text: 'Reports deserves a more visual, signal-heavy layout instead of another stacked content page.' },
      spotlight: ['Analytics workspace', 'Fresh workforce and payroll summaries are available for export.'],
      stats: [
        ['26', 'Saved reports', 'Across HR domains', 'blue', '📊'],
        ['4', 'Scheduled exports', 'Next run in 2 hours', 'green', '↗'],
        ['2', 'Failed exports', 'Need parameter review', 'red', '⚠'],
      ],
      rows: [
        ['Headcount trend', 'Tracks joins, exits, and net growth by month.', '👥'],
        ['Leave heatmap', 'Shows upcoming absence overlap by department.', '🌴'],
        ['Payroll variance', 'Flags unusual gross-to-net movement.', '💰'],
      ],
      actions: [
        ['Generate report', 'action:generate-report'],
        ['Open payroll', 'modules/payroll/run-payroll.html'],
        ['Review attendance', 'modules/attendance/register.html'],
      ],
      chips: ['Dashboards', 'Exports', 'Trend analysis'],
      tableTitle: 'Scheduled analytics',
      tableSub: 'Configured report runs',
      tableRows: [
        ['Monthly payroll pack', 'HR leadership', 'Scheduled', 'Today, 5:00 PM'],
        ['Attendance digest', 'Managers', 'Scheduled', 'Tomorrow, 7:00 AM'],
        ['Leave overlap summary', 'Operations', 'Failed', 'Parameter error'],
      ],
      roleContent: {
        manager: {
          sub: 'Review workforce and operational analytics for your own department.',
          hero: { icon: '📈', eyebrow: 'Department Analytics', title: '{department} trends and manager insights', text: 'Managers should only see reports and analytics tied to their team and department, not enterprise-wide data.' },
          spotlight: ['Department analytics workspace', 'The charts and exports here should reflect only {department} operations.'],
          stats: [
            ['6', 'Saved reports', 'For {department}', 'blue', '📊'],
            ['2', 'Scheduled exports', 'Team reporting cadence', 'green', '↗'],
            ['1', 'Attention item', 'Needs follow-up', 'gold', '⚠'],
          ],
          rows: [
            ['Headcount trend', 'Tracks movement within {department} only.', '👥'],
            ['Leave overlap', 'Shows upcoming absence risk for your team.', '🌴'],
            ['Attendance variance', 'Flags deviations inside {department}.', '🕐'],
          ],
          actions: [
            ['Open attendance', 'modules/attendance/register.html'],
            ['Open leave', 'modules/leave/requests.html'],
          ],
          chips: ['Department trends', 'Team exports', 'Manager insights'],
          tableTitle: 'Scheduled department analytics',
          tableSub: 'Configured report runs for {department}',
          tableRows: [
            ['Attendance digest', 'Manager summary', 'Scheduled', '{department}'],
            ['Leave overlap', 'Team planning', 'Scheduled', '{department}'],
            ['Headcount snapshot', 'Monthly summary', 'Ready', '{department}'],
          ],
        },
      },
    },
    rbac: {
      title: 'Roles & Permissions',
      sub: 'Review access boundaries and keep role assignments controlled.',
      activeNav: 'rbac',
      allowedRoles: ['it_admin'],
      layout: 'console',
      theme: 'red',
      hero: { icon: '🔑', eyebrow: 'Security Controls', title: 'Access governance with a stricter system tone', text: 'RBAC should feel more security-oriented than general admin pages, so it gets its own console style.' },
      spotlight: ['Access control', 'Permission sets are active for 5 system roles.'],
      stats: [
        ['5', 'Defined roles', 'Core system roles', 'red', '🔐'],
        ['12', 'Modules covered', 'By permission matrix', 'blue', '🧩'],
        ['1', 'Pending access review', 'Requires admin sign-off', 'gold', '👁'],
      ],
      rows: [
        ['HR admin scope', 'Full workforce and payroll permissions remain enabled.', '🛡'],
        ['IT admin scope', 'System and integration controls are isolated.', '⚙'],
        ['Manager scope', 'People visibility is constrained by department.', '🏢'],
      ],
      actions: [
        ['Review audit logs', 'modules/settings/system-logs.html'],
        ['Open settings', 'modules/settings/organisation.html'],
        ['View ATS bridge', 'modules/ats-middleware/sync-dashboard.html'],
      ],
      chips: ['Permission matrix', 'Role reviews', 'Separation of duties'],
      tableTitle: 'Role coverage',
      tableSub: 'Current role definitions',
      tableRows: [
        ['HR Administrator', '12 modules', 'Active', 'High privilege'],
        ['Manager', '7 modules', 'Active', 'Department scoped'],
        ['Employee', '6 modules', 'Active', 'Self-service only'],
      ],
    },
    'system-logs': {
      title: 'System Logs',
      sub: 'Inspect security, access, and operational events across the platform.',
      activeNav: 'system-logs',
      allowedRoles: ['hr_admin', 'it_admin'],
      layout: 'console',
      theme: 'slate',
      hero: { icon: '📋', eyebrow: 'Audit Stream', title: 'A log page should feel like a log page', text: 'This version is denser, darker, and more chronological so it reads like operations telemetry.' },
      spotlight: ['Operational log stream', 'Latest activity is available from session audits and mock system events.'],
      stats: [
        ['500', 'Max retained', 'In the current demo store', 'slate', '🗂'],
        ['2', 'Unread incidents', 'Need triage', 'red', '⚠'],
        ['24h', 'Primary review window', 'For admin monitoring', 'blue', '⏱'],
      ],
      rows: [
        ['Failed login attempt', 'Unknown IP triggered an auth failure alert.', '🚨'],
        ['ATS webhook retry', 'Integration event retried after upstream timeout.', '🔁'],
        ['Password changed', 'A user password update was recorded successfully.', '🔒'],
      ],
      actions: [
        ['Refresh log stream', 'action:refresh-log-stream'],
        ['Open RBAC', 'modules/settings/rbac.html'],
        ['Go to ATS bridge', 'modules/ats-middleware/sync-dashboard.html'],
      ],
      chips: ['Audit events', 'Security signals', 'Operational trace'],
      tableTitle: 'Recent audit trail',
      tableSub: 'Session and system events',
      dynamicAudit: true,
    },
    settings: {
      title: 'Settings',
      sub: 'Configure organisation preferences, workflow defaults, and system options.',
      activeNav: 'settings',
      allowedRoles: ['hr_admin', 'it_admin'],
      layout: 'studio',
      theme: 'indigo',
      hero: { icon: '⚙', eyebrow: 'Configuration Studio', title: 'More like a control studio than a report page', text: 'Settings should feel like a place to shape the product, not just review data.' },
      spotlight: ['Organisation settings', 'Core preferences drive how workflows, notifications, and approvals behave.'],
      stats: [
        ['14', 'Config groups', 'Available for review', 'indigo', '⚙'],
        ['3', 'Pending changes', 'Awaiting publication', 'gold', '📝'],
        ['100%', 'Backup status', 'Current config snapshots saved', 'green', '✓'],
      ],
      rows: [
        ['Approval routing', 'Leave and document workflows can be escalated by role.', '🧭'],
        ['Notification defaults', 'Email and in-app rules are grouped by module.', '🔔'],
        ['Integration settings', 'ATS and identity settings live under admin control.', '🔗'],
      ],
      actions: [
        ['Publish changes', 'action:publish-changes'],
        ['Open system logs', 'modules/settings/system-logs.html'],
        ['Review RBAC', 'modules/settings/rbac.html'],
      ],
      chips: ['Workflow defaults', 'Branding', 'Integration options'],
      tableTitle: 'Configuration areas',
      tableSub: 'Current editable groups',
      tableRows: [
        ['Organisation profile', 'Brand + contacts', 'Active', 'Updated this month'],
        ['Approval routing', 'Leave + documents', 'Draft changes', '3 pending'],
        ['Notifications', 'In-app + email', 'Active', 'Last updated yesterday'],
      ],
    },
  };

  let _workflowAction = null;

  function actionHref(path) {
    if (!path || path === '#') return '#';
    return RBAC.appPath(path);
  }

  function actionConfig(actionId) {
    const session = Session.get();
    const defaults = {
      name: session?.name || 'Current user',
      department: session?.department || 'General',
    };

    return {
      'create-announcement': {
        tone: 'rose',
        badge: 'Communications',
        title: 'Publish a new announcement',
        description: 'Draft an update and seed it into the announcements feed.',
        buttonLabel: 'Create Announcement',
        noteTitle: 'Adds a visible announcement record',
        noteText: 'The item is saved into the mock dataset and will appear in announcement summaries immediately.',
        fields: [
          { name: 'title', label: 'Announcement title', placeholder: 'Benefits enrolment reminder', full: true, required: true },
          { name: 'detail', label: 'Message', type: 'textarea', placeholder: 'Share the key update for staff.', full: true, required: true },
          { name: 'audience', label: 'Audience', type: 'select', options: ['All employees', defaults.department, 'Leadership'], required: true },
          { name: 'status', label: 'Status', type: 'select', options: ['Draft', 'Scheduled', 'Delivered'], required: true },
        ],
        submit(data) {
          appendModuleRecord('announcements', {
            title: data.title,
            detail: data.detail,
            audience: data.audience,
            status: data.status,
            context: data.audience === 'All employees' ? 'Company-wide' : defaults.department,
            public: data.audience === 'All employees',
            dept: data.audience === 'All employees' ? undefined : defaults.department,
          });
          Session.audit('ANNOUNCEMENT_CREATE', `${data.title} created for ${data.audience}`);
          if (data.status === 'Delivered' || data.status === 'Scheduled') {
            _notifyUsers(_announcementRecipients(data.audience, defaults.department), {
              type: 'announcement',
              title: data.title,
              msg: data.detail,
              href: 'modules/announcements/board.html',
              actor: session?.name || 'System',
            });
          }
          return { message: 'Announcement created.', refresh: true };
        },
      },
      'add-employee': {
        invoke() {
          openEmployeeModal();
        },
      },
      'update-profile': {
        tone: 'indigo',
        badge: 'Profile',
        title: 'Update your profile details',
        description: 'Record a new profile change request or self-service update.',
        buttonLabel: 'Save Profile Update',
        noteTitle: 'Creates a new profile task',
        noteText: 'This adds a scoped item to your profile timeline so the page reflects the latest update.',
        fields: [
          { name: 'title', label: 'Update type', placeholder: 'Emergency contact change', required: true },
          { name: 'detail', label: 'Details', type: 'textarea', placeholder: 'Summarise what changed.', full: true, required: true },
          { name: 'status', label: 'Status', type: 'select', options: ['Draft', 'Pending', 'Completed'], required: true },
        ],
        submit(data) {
          appendModuleRecord('profile', {
            userId: session.userId,
            title: data.title,
            detail: data.detail,
            status: data.status,
            context: 'Just now',
          });
          Session.audit('PROFILE_UPDATE', `${data.title} submitted`);
          return { message: 'Profile update saved.', refresh: true };
        },
      },
      'run-manual-sync': {
        invoke() {
          Session.audit('ATS_SYNC', 'Manual sync triggered from ATS page');
          Toast.success('Manual ATS sync started.');
          init();
        },
      },
      'submit-correction': {
        tone: 'teal',
        badge: 'Attendance',
        title: 'Submit an attendance correction',
        description: 'Log a correction request so it shows up in attendance exceptions.',
        buttonLabel: 'Submit Correction',
        noteTitle: 'Creates an exception record',
        noteText: 'The correction is saved as a pending attendance item and will surface in the page table.',
        fields: [
          { name: 'event', label: 'Issue type', type: 'select', options: ['Missing checkout', 'Late arrival', 'Remote check-in', 'Missed check-in'], required: true },
          { name: 'context', label: 'When / context', placeholder: 'Yesterday 5:30 PM', required: true },
          { name: 'detail', label: 'What happened', type: 'textarea', placeholder: 'Briefly explain the correction.', full: true, required: true },
        ],
        submit(data) {
          appendModuleRecord('attendance', {
            userId: session.userId,
            name: session.name,
            event: data.event,
            status: 'Pending',
            context: data.context,
            dept: session.department || 'General',
            issue: true,
            detail: data.detail,
          });
          Session.audit('ATTENDANCE_CORRECTION', `${data.event} correction submitted`);
          return { message: 'Attendance correction submitted.', refresh: true };
        },
      },
      'request-correction': {
        tone: 'teal',
        badge: 'Attendance',
        title: 'Request an attendance correction',
        description: 'Capture a missing or incorrect attendance event for follow-up.',
        buttonLabel: 'Request Correction',
        noteTitle: 'Flags an attendance issue',
        noteText: 'This request is added to attendance exceptions so managers or HR can act on it.',
        fields: [
          { name: 'event', label: 'Issue type', type: 'select', options: ['Missing checkout', 'Missed check-in', 'Remote check-in', 'Shift mismatch'], required: true },
          { name: 'context', label: 'Date / context', placeholder: '2026-04-22 morning shift', required: true },
          { name: 'detail', label: 'Notes', type: 'textarea', placeholder: 'Add any context that will help with review.', full: true, required: true },
        ],
        submit(data) {
          appendModuleRecord('attendance', {
            userId: session.userId,
            name: session.name,
            event: data.event,
            status: 'Pending',
            context: data.context,
            dept: session.department || 'General',
            issue: true,
            detail: data.detail,
          });
          Session.audit('ATTENDANCE_REQUEST', `${data.event} requested`);
          return { message: 'Correction request created.', refresh: true };
        },
      },
      'create-leave-request': {
        tone: 'green',
        badge: 'Leave',
        title: 'Create a leave request',
        description: 'Capture a new leave request and send it into the visible leave queue.',
        buttonLabel: 'Create Leave Request',
        noteTitle: 'Adds a new leave item',
        noteText: 'The request is saved with pending status and will appear in leave summaries immediately.',
        fields: [
          { name: 'type', label: 'Leave type', type: 'select', options: ['Annual leave', 'Sick leave', 'Study leave', 'Compassionate leave'], required: true },
          { name: 'days', label: 'Duration (days)', type: 'number', placeholder: '3', required: true },
          { name: 'start', label: 'Start date', type: 'date', required: true },
          { name: 'end', label: 'End date', type: 'date', required: true },
          { name: 'reason', label: 'Reason', type: 'textarea', placeholder: 'Optional context for approvers.', full: true, required: true },
        ],
        submit(data) {
          appendModuleRecord('leave', {
            userId: session.userId,
            name: session.name,
            type: data.type,
            days: formatDays(data.days),
            status: 'Pending',
            dept: session.department || 'General',
            startDate: data.start,
            endDate: data.end,
            detail: `${data.start} to ${data.end}`,
            reason: data.reason,
          });
          Session.audit('LEAVE_REQUEST_CREATE', `${data.type} requested from ${data.start} to ${data.end}`);
          return { message: 'Leave request created.', refresh: true };
        },
      },
      'publish-roster': {
        tone: 'blue',
        badge: 'Shifts',
        title: 'Publish a shift roster',
        description: 'Plan a rota window and record the publication event for the schedule team.',
        buttonLabel: 'Publish Roster',
        noteTitle: 'Logs a roster publication',
        noteText: 'This creates a scheduling audit entry so the workflow feels connected instead of dead-ending.',
        fields: [
          { name: 'window', label: 'Planning window', placeholder: 'Week of 2026-04-27', required: true },
          { name: 'team', label: 'Team / department', placeholder: defaults.department, required: true },
          { name: 'notes', label: 'Planner notes', type: 'textarea', placeholder: 'Any shift coverage notes for the roster.', full: true, required: true },
        ],
        submit(data) {
          Session.audit('SHIFT_ROSTER_PUBLISH', `${data.window} roster published for ${data.team}`);
          return { message: 'Shift roster published.', refresh: false };
        },
      },
      'start-payroll-run': {
        invoke() {
          Session.audit('PAYROLL_RUN_START', 'Payroll run started from payroll page');
          Toast.success('Payroll run started.');
          init();
        },
      },
      'download-latest-payslip': {
        invoke() {
          downloadTextFile(
            `payslip-${slugify(session.name || 'employee')}.txt`,
            [
              'AsteraHR Mock Payslip',
              `Employee: ${session.name || 'Current user'}`,
              `Department: ${session.department || 'General'}`,
              'Period: Current month',
              'Status: Ready for download',
            ].join('\n')
          );
          Session.audit('PAYSLIP_DOWNLOAD', 'Latest mock payslip downloaded');
          Toast.success('Latest payslip downloaded.');
        },
      },
      'open-current-cycle': {
        invoke() {
          const session = Session.get();
          Session.audit('PERFORMANCE_CYCLE_OPEN', 'Current performance cycle opened');
          if (session?.role === 'employee') {
            ModulePage.openSelfReview();
          } else if (session?.role === 'manager') {
            ModulePage.openManagerReview();
          } else {
            ModulePage.openCycleOverview();
          }
        },
      },
      'create-programme': {
        tone: 'teal',
        badge: 'Learning',
        title: 'Create a training programme',
        description: 'Add a new learning programme so it appears in the visible training pipeline.',
        buttonLabel: 'Create Programme',
        noteTitle: 'Adds a training record',
        noteText: 'The programme is saved to training data and will show up on the module page immediately.',
        fields: [
          { name: 'course', label: 'Programme name', placeholder: 'Leadership essentials', required: true },
          { name: 'audience', label: 'Assigned to', placeholder: defaults.department, required: true },
          { name: 'status', label: 'Status', type: 'select', options: ['Open', 'Scheduled', 'Completed'], required: true },
          { name: 'required', label: 'Required learning', type: 'checkbox' },
        ],
        submit(data) {
          appendModuleRecord('training', {
            userId: session.userId,
            name: data.audience,
            course: data.course,
            status: data.status,
            context: data.status === 'Scheduled' ? 'Scheduled now' : 'Added from workflow',
            dept: session.department || 'General',
            required: !!data.required,
          });
          Session.audit('TRAINING_CREATE', `${data.course} created`);
          return { message: 'Training programme created.', refresh: true };
        },
      },
      'browse-my-training': {
        invoke() {
          Session.audit('TRAINING_BROWSE', 'Training catalogue opened');
          ModulePage.openTrainingCatalogue();
        },
      },
      'upload-document': {
        tone: 'slate',
        badge: 'Documents',
        title: 'Upload a document',
        description: 'Create a new document record so it appears in the document center.',
        buttonLabel: 'Save Document',
        noteTitle: 'Creates a document entry',
        noteText: 'This demo stores document metadata only, so the page can reflect the new upload immediately.',
        fields: [
          { name: 'title', label: 'Document title', placeholder: 'Signed contract', required: true },
          { name: 'type', label: 'Document type', type: 'select', options: ['Public policy', 'Personal record', 'Shared resource', 'Department guide'], required: true },
          { name: 'status', label: 'Status', type: 'select', options: ['Available', 'Requested', 'Pending'], required: true },
          { name: 'public', label: 'Visible to all staff', type: 'checkbox' },
        ],
        submit(data) {
          appendModuleRecord('documents', {
            title: data.title,
            type: data.type,
            status: data.status,
            context: data.public ? 'All staff' : 'My profile',
            public: !!data.public,
            userId: data.public ? undefined : session.userId,
            dept: data.public ? undefined : (session.department || 'General'),
          });
          Session.audit('DOCUMENT_UPLOAD', `${data.title} added to documents`);
          return { message: 'Document record created.', refresh: true };
        },
      },
      'generate-report': {
        tone: 'blue',
        badge: 'Reports',
        title: 'Generate a report',
        description: 'Queue a fresh report export and download a quick mock summary file.',
        buttonLabel: 'Generate Report',
        noteTitle: 'Creates a report job',
        noteText: 'The report is saved into the reports dataset and a lightweight export is downloaded immediately.',
        fields: [
          { name: 'title', label: 'Report name', placeholder: 'Leave utilisation snapshot', required: true },
          { name: 'audience', label: 'Audience', placeholder: 'HR leadership', required: true },
        ],
        submit(data) {
          appendModuleRecord('reports', {
            title: data.title,
            audience: data.audience,
            status: 'Ready',
            context: session.department || 'All departments',
            dept: session.department || undefined,
          });
          downloadTextFile(
            `${slugify(data.title)}.txt`,
            [`Report: ${data.title}`, `Audience: ${data.audience}`, `Generated by: ${session.name}`].join('\n')
          );
          Session.audit('REPORT_GENERATE', `${data.title} generated`);
          return { message: 'Report generated.', refresh: true };
        },
      },
      'refresh-log-stream': {
        invoke() {
          Session.audit('LOG_STREAM_REFRESH', 'System log stream refreshed');
          Toast.success('Log stream refreshed.');
          init();
        },
      },
      'publish-changes': {
        invoke() {
          Session.audit('SETTINGS_PUBLISH', 'Settings changes published');
          Toast.success('Settings changes published.');
          init();
        },
      },
    }[actionId];
  }

  function slugify(value) {
    return String(value || 'file')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'file';
  }

  function formatDays(value) {
    const amount = Math.max(1, Number(value) || 1);
    return `${amount} working day${amount === 1 ? '' : 's'}`;
  }

  function appendModuleRecord(key, record) {
    const list = window.ASTERAHR?.moduleData?.[key];
    if (!Array.isArray(list)) return;
    list.unshift(record);
    window.ASTERAHR.store.persist();
  }

  function _users() {
    return window.ASTERAHR?.users || [];
  }

  function _usersByRole(role) {
    return _users().filter(user => user.role === role);
  }

  function _resolveDepartmentManagers(department) {
    const matches = _users().filter(user => user.role === 'manager' && user.dept === department);
    return matches.length ? matches : _usersByRole('manager');
  }

  function _notifyUser(userId, payload = {}) {
    if (!userId) return;
    Notify.push({ ...payload, userIds: [userId] });
  }

  function _notifyUsers(userIds, payload = {}) {
    const targets = [...new Set((userIds || []).filter(Boolean))];
    if (!targets.length) return;
    Notify.push({ ...payload, userIds: targets });
  }

  function _notifyRole(role, payload = {}) {
    _notifyUsers(_usersByRole(role).map(user => user.id), payload);
  }

  function _notifyHR(payload = {}) {
    _notifyUsers(
      _users().filter(user => user.role === 'hr_admin' || user.role === 'hr_officer').map(user => user.id),
      payload
    );
  }

  function _notifyManagersForDepartment(department, payload = {}) {
    _notifyUsers(_resolveDepartmentManagers(department).map(user => user.id), payload);
  }

  function _announcementRecipients(audience, department) {
    if (audience === 'All employees') return _users().map(user => user.id);
    if (audience === 'Leadership') {
      return _users()
        .filter(user => user.role === 'manager' || user.role === 'hr_admin' || user.role === 'hr_officer')
        .map(user => user.id);
    }
    return _users()
      .filter(user => user.dept === department || user.role === 'manager' && user.dept === department)
      .map(user => user.id);
  }

  function downloadTextFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function mergePageContent(base, override = {}) {
    return {
      ...base,
      ...override,
      hero: override.hero ? { ...(base.hero || {}), ...override.hero } : base.hero,
      roleContent: base.roleContent,
    };
  }

  function applySessionTokens(value, session) {
    if (typeof value === 'string') {
      return value
        .replaceAll('{department}', session?.department || 'your department')
        .replaceAll('{name}', session?.name || 'you');
    }
    if (Array.isArray(value)) return value.map(item => applySessionTokens(item, session));
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, applySessionTokens(entry, session)]));
    }
    return value;
  }

  function resolvePageForSession(page, session) {
    const scoped = page.roleContent?.[session.role];
    const merged = scoped ? mergePageContent(page, scoped) : page;
    return applyDataScope(applySessionTokens(merged, session), session);
  }

  function recordsFor(key) {
    return window.ASTERAHR?.moduleData?.[key] || [];
  }

  function scopeRecords(records, session) {
    return records.filter(record => {
      if (record.roles && !record.roles.includes(session.role)) return false;
      if (session.role === 'hr_admin' || session.role === 'hr_officer') return true;
      if (session.role === 'manager') {
        return !!record.public || record.userId === session.userId || record.dept === session.department || !record.dept;
      }
      if (session.role === 'employee') {
        return !!record.public || record.userId === session.userId;
      }
      if (session.role === 'it_admin') {
        return !!record.public || record.userId === session.userId || record.roles?.includes('it_admin');
      }
      return false;
    });
  }

  function stat(value, label, meta, tone, icon) {
    return [String(value), label, meta, tone, icon];
  }

  function profileData(page, session) {
    const records = scopeRecords(recordsFor('profile'), session);
    if (!records.length) return page;
    return {
      ...page,
      stats: [
        stat(records.length, 'Profile items', 'Visible to you', 'indigo', '🧾'),
        stat(records.filter(r => r.status === 'Pending' || r.status === 'In review').length, 'Open actions', 'Need attention', 'gold', '⚠'),
        stat(records.filter(r => r.status === 'Completed' || r.status === 'Clear').length, 'Completed', 'Already handled', 'green', '✓'),
      ],
      rows: records.slice(0, 3).map(r => [r.title, r.detail, '🧾']),
      tableRows: records.slice(0, 3).map(r => [r.title, r.detail, r.status, r.context]),
    };
  }

  function announcementsData(page, session) {
    const records = scopeRecords(recordsFor('announcements'), session);
    if (!records.length) return page;
    return {
      ...page,
      stats: [
        stat(records.length, 'Visible announcements', 'Filtered by access', 'rose', '📢'),
        stat(records.filter(r => r.status === 'Delivered').length, 'Delivered', 'Already published', 'blue', '✓'),
        stat(records.filter(r => r.status !== 'Delivered').length, 'Upcoming items', 'Draft or scheduled', 'gold', '📌'),
      ],
      rows: records.slice(0, 3).map(r => [r.title, r.detail, '📣']),
      tableRows: records.slice(0, 3).map(r => [r.title, r.audience, r.status, r.context]),
    };
  }

  function employeesData(page, session) {
    const records = scopeRecords(recordsFor('employees'), session);
    if (!records.length) return page;
    return {
      ...page,
      stats: [
        stat(records.length, session.role === 'manager' ? 'Team records' : 'Visible employee records', 'From mock workforce data', 'blue', '👥'),
        stat(records.filter(r => r.status === 'Pending' || r.status === 'Open').length, 'Open items', 'Need follow-up', 'gold', '📝'),
        stat(new Set(records.map(r => r.dept)).size, 'Departments', 'Represented in this view', 'green', '🏢'),
      ],
      rows: records.slice(0, 3).map(r => [r.name, r.detail, '👤']),
      tableRows: records.slice(0, 3).map(r => [r.name, r.event, r.status, r.dept || 'General']),
    };
  }

  function attendanceData(page, session) {
    const records = scopeRecords(recordsFor('attendance'), session);
    if (!records.length) return page;
    return {
      ...page,
      stats: [
        stat(records.length, session.role === 'employee' ? 'My attendance items' : 'Visible attendance events', 'Filtered from mock records', 'teal', '🕐'),
        stat(records.filter(r => r.issue).length, 'Exceptions', 'Need attention', 'gold', '⚠'),
        stat(records.filter(r => !r.issue).length, 'Clean entries', 'No issue flagged', 'green', '✓'),
      ],
      rows: records.slice(0, 3).map(r => [r.event, `${r.name} · ${r.context}`, r.issue ? '⚠' : '📍']),
      tableRows: records.slice(0, 3).map(r => [r.name, r.event, r.status, r.context]),
      _attendanceRecords: records,
      _attendanceApprover: ['hr_admin', 'hr_officer', 'manager'].includes(session.role),
    };
  }

  function leaveData(page, session) {
    const records = scopeRecords(recordsFor('leave'), session);
    if (!records.length) return page;
    return {
      ...page,
      stats: [
        stat(records.length, session.role === 'employee' ? 'My leave items' : 'Visible leave items', 'Filtered from mock records', 'green', '🌴'),
        stat(records.filter(r => r.status === 'Pending' || r.status === 'Open').length, 'Open requests', 'Awaiting action', 'gold', '📝'),
        stat(records.filter(r => r.status === 'Approved').length, 'Approved', 'Already confirmed', 'teal', '✓'),
      ],
      rows: records.slice(0, 3).map(r => [r.type, `${r.name} · ${r.detail}`, '📆']),
      tableRows: records.slice(0, 3).map(r => [r.type, r.days, r.status, r.detail]),
      _leaveRecords: records,
      _leaveApprover: ['hr_admin', 'hr_officer', 'manager'].includes(session.role),
    };
  }

  /* ── Org Chart ───────────────────────────────────────── */

  // Static org structure — enriched from mock users and employee records
  const ORG_TREE = {
    id: 'ceo',
    name: 'Wanjiku Kamau',
    title: 'Chief Executive Officer',
    dept: 'Executive',
    avatar: 'WK',
    color: '#0F2249',
    children: [
      {
        id: 'hr',
        name: 'John Mwangi',
        title: 'HR Administrator',
        dept: 'Human Resources',
        avatar: 'JM',
        color: '#1F3C88',
        headcount: 8,
        open: 0,
        members: [
          { name: 'Amina Odhiambo', title: 'HR Officer', status: 'Active' },
          { name: 'Faith Njoki',     title: 'HR Assistant', status: 'Active' },
          { name: 'Kevin Ouma',      title: 'Recruiter', status: 'Active' },
          { name: 'Brenda Atieno',   title: 'L&D Coordinator', status: 'Active' },
          { name: 'Moses Waweru',    title: 'Payroll Officer', status: 'Active' },
          { name: 'Jane Wambui',     title: 'HR Business Partner', status: 'Active' },
          { name: 'Patrick Njoroge', title: 'HR Assistant', status: 'On leave' },
          { name: 'Alice Mutua',     title: 'Recruitment Coordinator', status: 'Active' },
        ],
        children: [],
      },
      {
        id: 'eng',
        name: 'Samuel Kariuki',
        title: 'Head of Engineering',
        dept: 'Engineering',
        avatar: 'SK',
        color: '#3D4CB5',
        headcount: 28,
        open: 2,
        members: [
          { name: 'Grace Achieng',   title: 'Senior Engineer', status: 'Active' },
          { name: 'James Otieno',    title: 'Software Engineer', status: 'Active' },
          { name: 'Mercy Wanjiku',   title: 'QA Engineer', status: 'Onboarding' },
          { name: 'David Kimani',    title: 'Backend Engineer', status: 'Active' },
          { name: 'Lydia Chebet',    title: 'Frontend Engineer', status: 'Active' },
          { name: 'Brian Mutua',     title: 'DevOps Engineer', status: 'Active' },
          { name: 'Esther Wairimu',  title: 'Product Designer', status: 'Active' },
          { name: 'Paul Kamau',      title: 'Data Engineer', status: 'Active' },
        ],
        children: [],
      },
      {
        id: 'finance',
        name: 'Anne Wambui',
        title: 'Finance Manager',
        dept: 'Finance',
        avatar: 'AW',
        color: '#006B42',
        headcount: 12,
        open: 0,
        members: [
          { name: 'Peter Kamau',     title: 'Senior Accountant', status: 'Active' },
          { name: 'Rose Njeri',      title: 'Accountant', status: 'Active' },
          { name: 'Daniel Mwiti',    title: 'Accounts Assistant', status: 'Active' },
          { name: 'Irene Adhiambo',  title: 'Financial Analyst', status: 'Active' },
          { name: 'Felix Omondi',    title: 'Treasury Officer', status: 'Active' },
          { name: 'Carol Mugo',      title: 'Accounts Payable', status: 'Active' },
        ],
        children: [],
      },
      {
        id: 'ops',
        name: 'Tom Otieno',
        title: 'Operations Manager',
        dept: 'Operations',
        avatar: 'TO',
        color: '#8B5C00',
        headcount: 18,
        open: 1,
        members: [
          { name: 'Lydia Njeri',     title: 'Operations Analyst', status: 'Active' },
          { name: 'George Mwangi',   title: 'Logistics Coordinator', status: 'Active' },
          { name: 'Stella Nyambura', title: 'Procurement Officer', status: 'Active' },
          { name: 'Victor Ouma',     title: 'Supply Chain Analyst', status: 'Active' },
          { name: 'Hannah Achieng',  title: 'Office Manager', status: 'Active' },
          { name: '[Open role]',     title: 'Supervisor', status: 'Vacant' },
        ],
        children: [],
      },
      {
        id: 'ict',
        name: "Kevin Ndung'u",
        title: 'IT System Administrator',
        dept: 'ICT',
        avatar: 'KN',
        color: '#9B1C1C',
        headcount: 6,
        open: 0,
        members: [
          { name: 'Dennis Kariuki',  title: 'Systems Engineer', status: 'Active' },
          { name: 'Sandra Otieno',   title: 'Network Administrator', status: 'Active' },
          { name: 'Mark Waweru',     title: 'IT Support Analyst', status: 'Active' },
          { name: 'Purity Njeru',    title: 'IT Support Analyst', status: 'Active' },
          { name: 'Moses Kamau',     title: 'Cybersecurity Analyst', status: 'Active' },
        ],
        children: [],
      },
    ],
  };

  function orgChartData(page, session) {
    // For managers, note their dept for highlighting
    return {
      ...page,
      _orgChart: true,
      _orgFocusDept: session.role === 'manager' ? session.department : null,
    };
  }

  function buildOrgChartSVG(focusDept) {
    const depts = ORG_TREE.children;
    const cardW = 204;
    const cardH = 132;
    const cardGap = 26;
    const marginX = 36;
    const rowWidth = (depts.length * cardW) + ((depts.length - 1) * cardGap);
    const W = Math.max(1120, rowWidth + (marginX * 2));
    const H = 448;
    const rootX = (W - cardW) / 2;
    const rootY = 18;
    const deptY = 266;
    const busY = 220;
    const rootCenterX = rootX + (cardW / 2);
    const deptStartX = (W - rowWidth) / 2;
    const deptCenters = depts.map((_, i) => deptStartX + (i * (cardW + cardGap)) + (cardW / 2));
    const connectorLeft = deptCenters[0];
    const connectorRight = deptCenters[deptCenters.length - 1];

    const lines = `
      <line x1="${rootCenterX}" y1="${rootY + cardH}" x2="${rootCenterX}" y2="${busY}"
            class="org-chart-line org-chart-line-trunk"/>
      <line x1="${connectorLeft}" y1="${busY}" x2="${connectorRight}" y2="${busY}"
            class="org-chart-line"/>
      ${deptCenters.map(cx => `
        <line x1="${cx}" y1="${busY}" x2="${cx}" y2="${deptY}" class="org-chart-line"/>
      `).join('')}
    `;

    const renderCard = (node, x, y, options = {}) => {
      const focused = !!options.focused;
      const dimmed = !!options.dimmed;
      const clickable = !!options.clickable;
      const statusLabel = options.statusLabel || (node.open > 0 ? 'Open' : 'Filled');
      const statusTone = node.open > 0 ? 'open' : 'filled';
      const footerRight = options.footerRight || (node.open > 0 ? `${node.open} open` : 'Head Office');
      const titleColor = dimmed ? '#7C8CA5' : '#243147';
      const metaColor = dimmed ? '#82abe4' : '#6C7D96';
      const cardClass = [
        'org-dept-node',
        focused ? 'is-focused' : '',
        dimmed ? 'is-dimmed' : '',
        clickable ? 'is-clickable' : ''
      ].filter(Boolean).join(' ');

      return `
        <g class="${cardClass}" data-id="${node.id || ''}" transform="translate(${x},${y})"
           ${clickable ? `onclick="ModulePage.selectOrgDept('${node.id}')"` : ''}>
          <rect class="org-node-shell" width="${cardW}" height="${cardH}" rx="18" ry="18"
                fill="rgba(255,255,255,.96)" stroke="${node.color}" stroke-opacity="${focused ? '.34' : '.18'}"
                filter="url(#org-card-shadow)"/>
          <rect x="20" y="20" width="40" height="40" rx="14" ry="14"
                fill="${node.color}" fill-opacity=".12"/>
          <text x="40" y="46" text-anchor="middle" fill="#1e293b" font-size="13" font-weight="800"
                font-family="Outfit,system-ui,sans-serif">${node.avatar}</text>
          <rect x="${cardW - 62}" y="28" width="44" height="24" rx="12" ry="12"
                class="org-node-badge ${statusTone}"/>
          <text x="${cardW - 40}" y="44" text-anchor="middle" class="org-node-badge-text"
                font-family="Outfit,system-ui,sans-serif">${statusLabel}</text>
          <text x="20" y="86" fill="#1f2a44" font-size="12.2" font-weight="800"
                font-family="Outfit,system-ui,sans-serif">${node.name}</text>
          <text x="20" y="104" fill="${titleColor}" font-size="10.8"
                font-family="Outfit,system-ui,sans-serif">${node.title}</text>
          <text x="20" y="${cardH - 16}" fill="${metaColor}" font-size="10.4" letter-spacing="1"
                font-family="Outfit,system-ui,sans-serif">${node.dept.toUpperCase()}</text>
          <text x="${cardW - 20}" y="${cardH - 16}" text-anchor="end" fill="${metaColor}" font-size="10.4" letter-spacing="1"
                font-family="Outfit,system-ui,sans-serif">${footerRight.toUpperCase()}</text>
          ${focused ? `<rect class="org-node-focus" x="1.5" y="1.5" width="${cardW - 3}" height="${cardH - 3}" rx="16.5" ry="16.5"/>` : ''}
        </g>`;
    };

    const ceoNode = renderCard(ORG_TREE, rootX, rootY, {
      statusLabel: 'Filled',
      footerRight: 'Executive'
    });

    const deptNodes = depts.map((d, i) => {
      const x = deptStartX + (i * (cardW + cardGap));
      const focused = focusDept && d.dept.toLowerCase().includes(focusDept.toLowerCase());
      return renderCard(d, x, deptY, {
        focused,
        dimmed: !!focusDept && !focused,
        clickable: true,
        footerRight: d.open > 0 ? 'Hybrid' : 'Head Office'
      });
    }).join('');

    return `
      <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"
           style="width:100%;height:auto;display:block">
        <defs>
          <filter id="org-card-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="rgba(15,23,42,.12)"/>
          </filter>
        </defs>
        ${lines}
        ${ceoNode}
        ${deptNodes}
      </svg>`;
  }


  function renderOrgChartSection(page) {
    const focusDept = page._orgFocusDept;
    return `
      <section class="card org-chart-card">
        <div class="card-head org-chart-head">
          <div class="org-chart-head-copy">
            <h3>Organisation Structure</h3>
            <div class="card-sub">Click a department node to see the team</div>
          </div>
          <div class="org-chart-head-tools">
            ${focusDept ? `<span class="org-chart-focus-chip">${focusDept} view</span>` : ''}
          </div>
        </div>
        <div class="card-body org-chart-body">
          <div id="org-chart-canvas" class="org-chart-canvas">
            ${buildOrgChartSVG(focusDept)}
          </div>
        </div>
      </section>
      <section class="module-layout-grid">
        <div id="org-dept-panel" class="card" style="min-height:200px">
          <div class="card-head">
            <div>
              <h3 id="dept-panel-title">Select a department</h3>
              <div class="card-sub" id="dept-panel-sub">Click a node above to view team details</div>
            </div>
          </div>
          <div class="card-body" id="dept-panel-body">
            <div class="org-chart-empty">Click any department circle to explore the team</div>


          </div>
        </div>
        <div class="module-side compact-side">
          <div class="card">
            <div class="card-head"><h3>Paths</h3></div>
            <div class="card-body">
              <div class="module-actions">${renderActions(page.actions)}</div>
            </div>
          </div>
          <div class="card" style="margin-top:12px">
            <div class="card-head"><h3>Page Scope</h3></div>
            <div class="card-body">
              <div class="module-chip-row">
                ${page.chips.map(chip => `<span class="module-chip">${chip}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </section>`;
  }

  function selectOrgDept(deptId) {
    const dept = ORG_TREE.children.find(d => d.id === deptId);
    if (!dept) return;

    document.querySelectorAll('.org-dept-node').forEach(el => {
      const isSelected = el.getAttribute('data-id') === deptId;
      el.classList.toggle('is-focused', isSelected);
      el.classList.toggle('is-dimmed', !isSelected);
    });


    // Render team panel
    const titleEl  = document.getElementById('dept-panel-title');
    const subEl    = document.getElementById('dept-panel-sub');
    const bodyEl   = document.getElementById('dept-panel-body');
    if (!titleEl || !bodyEl) return;

    titleEl.textContent = dept.dept;
    subEl.textContent = `${dept.name} � ${dept.title} � ${dept.headcount} people`;

    const statusColor = { Active: '#006B42', Onboarding: '#3D4CB5', 'On leave': '#8B5C00', Vacant: '#B91C1C' };
    const statusBg    = { Active: 'rgba(0,107,66,.08)', Onboarding: 'rgba(61,76,181,.08)', 'On leave': 'rgba(139,92,0,.08)', Vacant: 'rgba(185,28,28,.08)' };

    bodyEl.innerHTML = `
      <div class="org-team-grid">
        ${dept.members.map(m => `
          <div class="org-team-member">
            <div class="org-team-avatar" style="background:${dept.color}">
              ${m.name === '[Open role]' ? '?' : m.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
            </div>
            <div class="org-team-copy">
              <div class="org-team-name">${m.name}</div>
              <div class="org-team-title">${m.title}</div>
              <span class="org-team-status" style="background:${statusBg[m.status] || 'var(--bdr-s)'};color:${statusColor[m.status] || 'var(--ink-s)'}">
                ${m.status}
              </span>
            </div>
          </div>
        `).join('')}
        ${dept.open > 0 ? `
          <div class="org-team-open-role">
            <div class="org-team-avatar open-role">+</div>
            <div class="org-team-copy">
              <div class="org-open-role-name">${dept.open} Open Role${dept.open > 1 ? 's' : ''}</div>
              <div class="org-open-role-copy">Recruitment underway</div>
            </div>
          </div>` : ''}
      </div>`;
  }

  function performanceData(page, session) {
    const records = scopeRecords(recordsFor('performance'), session);
    if (!records.length) return page;
    return {
      ...page,
      stats: [
        stat(records.length, session.role === 'employee' ? 'My review items' : 'Visible review items', 'Filtered from mock records', 'indigo', '⭐'),
        stat(records.filter(r => r.status === 'Open' || r.status === 'Upcoming').length, 'Open actions', 'Still in progress', 'gold', '🧭'),
        stat(records.filter(r => r.status === 'Completed').length, 'Completed', 'Already submitted', 'teal', '✓'),
      ],
      rows: records.slice(0, 3).map(r => [r.item, `${r.name} · ${r.detail}`, '⭐']),
      tableRows: records.slice(0, 3).map(r => [r.name, r.item, r.status, r.context]),
      _perfRecords: records,
      _perfRole: session.role,
      _perfSession: session,
    };
  }

  function trainingData(page, session) {
    const records = scopeRecords(recordsFor('training'), session);
    if (!records.length) return page;
    return {
      ...page,
      stats: [
        stat(records.length, session.role === 'employee' ? 'My learning items' : 'Visible learning items', 'Filtered from mock records', 'teal', '📚'),
        stat(records.filter(r => r.required).length, 'Required items', 'Mandatory learning', 'gold', '📘'),
        stat(records.filter(r => r.status === 'Completed').length, 'Completed', 'Already done', 'green', '✓'),
      ],
      rows: records.slice(0, 3).map(r => [r.course, `${r.name} · ${r.context}`, '🎓']),
      tableRows: records.slice(0, 3).map(r => [r.course, r.name, r.status, r.context]),
      _trainingRecords: records,
      _trainingRole: session.role,
      _trainingSession: session,
    };
  }

  /* ── Training Catalogue ─────────────────────────────── */

  const COURSE_CATALOGUE = [
    {
      id: 'data-protection',
      title: 'Data Protection & Privacy',
      category: 'Compliance',
      format: 'Online',
      duration: '2 hrs',
      required: true,
      audience: 'all',
      icon: '??',
      color: '#1F3C88',
      description: 'Annual mandatory refresh covering data handling, GDPR obligations, and breach reporting procedures.',
      seats: null,
    },
    {
      id: 'leadership-essentials',
      title: 'Leadership Essentials',
      category: 'Leadership',
      format: 'Workshop',
      duration: '2 days',
      required: false,
      audience: 'manager',
      icon: '🧠',
      color: '#8B5C00',
      description: 'Structured leadership programme covering coaching, delegation, feedback, and difficult conversations.',
      seats: 8,
    },
    {
      id: 'compliance-refresh',
      title: 'Labour Law & Compliance',
      category: 'Compliance',
      format: 'Online',
      duration: '3 hrs',
      required: true,
      audience: 'all',
      icon: '📘',
      color: '#006B42',
      description: 'Covers Kenyan labour law basics, employment rights, termination procedures, and OSHA requirements.',
      seats: null,
    },
    {
      id: 'coaching-skills',
      title: 'Coaching Skills for Managers',
      category: 'Leadership',
      format: 'Workshop',
      duration: '1 day',
      required: false,
      audience: 'manager',
      icon: '🎯',
      color: '#3D4CB5',
      description: 'Practical coaching models — GROW, active listening, and structured one-to-one techniques.',
      seats: 12,
    },
    {
      id: 'excel-advanced',
      title: 'Advanced Excel & Data Analysis',
      category: 'Technical',
      format: 'Online',
      duration: '4 hrs',
      required: false,
      audience: 'all',
      icon: '📊',
      color: '#006B42',
      description: 'PivotTables, VLOOKUP, data validation, and dashboard building for operational reporting.',
      seats: null,
    },
    {
      id: 'presentation-skills',
      title: 'Presentation & Communication',
      category: 'Soft Skills',
      format: 'Workshop',
      duration: '1 day',
      required: false,
      audience: 'all',
      icon: '🎤',
      color: '#9B1C1C',
      description: 'Structured storytelling, slide design principles, and managing Q&A for internal and external audiences.',
      seats: 16,
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity Awareness',
      category: 'Compliance',
      format: 'Online',
      duration: '1.5 hrs',
      required: true,
      audience: 'all',
      icon: '🛡',
      color: '#9B1C1C',
      description: 'Phishing awareness, password hygiene, social engineering, and incident reporting procedures.',
      seats: null,
    },
    {
      id: 'project-management',
      title: 'Project Management Fundamentals',
      category: 'Technical',
      format: 'Online',
      duration: '5 hrs',
      required: false,
      audience: 'all',
      icon: '📋',
      color: '#1F3C88',
      description: 'Planning, scheduling, risk management, and stakeholder communication using agile and waterfall methods.',
      seats: null,
    },
  ];

  function _enrolmentStatus(courseId, session) {
    const records = window.ASTERAHR?.moduleData?.training || [];
    const match = records.find(r => r.courseId === courseId && r.userId === session.userId);
    return match ? match.status : null;
  }

  function _trainingStatusChip(status) {
    const map = {
      'Completed':  { bg: 'rgba(0,107,66,.12)',  color: '#006B42', label: '✓ Completed' },
      'Scheduled':  { bg: 'rgba(31,60,136,.10)', color: '#1F3C88', label: '📅 Enrolled' },
      'Bookmarked': { bg: 'rgba(244,180,0,.12)', color: '#8B5C00', label: '🔖 Bookmarked' },
      'In progress':{ bg: 'rgba(61,76,181,.10)', color: '#3D4CB5', label: '▶ In progress' },
      'Open':       { bg: 'rgba(244,180,0,.12)', color: '#8B5C00', label: '⏳ Assigned' },
    };
    if (!status) return '';
    const s = map[status] || { bg: 'var(--bdr-s)', color: 'var(--ink-s)', label: status };
    return `<span style="padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;background:${s.bg};color:${s.color}">${s.label}</span>`;
  }

  function _courseActionButtons(course, session) {
    const status = _enrolmentStatus(course.id, session);
    if (status === 'Completed') {
      return `<button class="btn btn-ghost btn-sm" style="width:100%;margin-top:10px" disabled>✓ Completed</button>`;
    }
    if (status === 'Scheduled' || status === 'In progress') {
      return `
        <div style="display:flex;gap:6px;margin-top:10px">
          <button class="btn btn-green btn-sm" style="flex:1" onclick="ModulePage.markCourseComplete('${course.id}')">Mark complete</button>
          <button class="btn btn-ghost btn-sm" onclick="ModulePage.withdrawCourse('${course.id}')">Withdraw</button>
        </div>`;
    }
    if (status === 'Bookmarked') {
      return `
        <div style="display:flex;gap:6px;margin-top:10px">
          <button class="btn btn-navy btn-sm" style="flex:1" onclick="ModulePage.enrolCourse('${course.id}')">Enrol now</button>
          <button class="btn btn-ghost btn-sm" onclick="ModulePage.withdrawCourse('${course.id}')">Remove</button>
        </div>`;
    }
    // Not enrolled
    return `
      <div style="display:flex;gap:6px;margin-top:10px">
        <button class="btn btn-navy btn-sm" style="flex:1" onclick="ModulePage.enrolCourse('${course.id}')">Enrol</button>
        <button class="btn btn-ghost btn-sm" onclick="ModulePage.bookmarkCourse('${course.id}')">🔖</button>
      </div>`;
  }

  function _renderMandatoryProgress(session) {
    const records = window.ASTERAHR?.moduleData?.training || [];
    const myRecords = records.filter(r => r.userId === session.userId);
    const mandatoryCourses = COURSE_CATALOGUE.filter(c => c.required);
    const completed = mandatoryCourses.filter(c => {
      const r = myRecords.find(m => m.courseId === c.id);
      return r?.status === 'Completed';
    }).length;
    const pct = mandatoryCourses.length ? Math.round((completed / mandatoryCourses.length) * 100) : 0;
    const color = pct === 100 ? '#006B42' : pct >= 50 ? '#8B5C00' : '#B91C1C';

    return `
      <div class="training-progress-card" style="border-radius:var(--r-lg);padding:16px 18px;margin-bottom:20px;border:1px solid var(--bdr-s)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <div>
            <strong style="font-size:13.5px;color:var(--ink)">Mandatory Learning Progress</strong>
            <div style="font-size:12px;color:var(--ink-s);margin-top:2px">${completed} of ${mandatoryCourses.length} required courses completed</div>
          </div>
          <span style="font-size:20px;font-weight:700;color:${color}">${pct}%</span>
        </div>
        <div style="background:var(--bdr);border-radius:20px;height:8px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${color};border-radius:20px;transition:width .4s"></div>
        </div>
        ${pct === 100 ? '<div style="font-size:12px;color:#006B42;margin-top:8px;font-weight:600">✓ All mandatory learning complete for this period</div>' : ''}
      </div>`;
  }

  function _renderCatalogueGrid(session, filterFn) {
    const courses = COURSE_CATALOGUE.filter(filterFn || (() => true));
    return courses.map(course => {
      const status = _enrolmentStatus(course.id, session);
      const isRequired = course.required;
      return `
        <div class="training-course-card" onmouseover="this.style.boxShadow='var(--sh-l)'" onmouseout="this.style.boxShadow=''">
          <div class="training-course-head" style="background:linear-gradient(135deg, ${course.color}26, rgba(255,255,255,.94));border-bottom:1px solid ${course.color}33">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
              <span style="display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:14px;background:${course.color}22;border:1px solid ${course.color}30;font-size:22px">${course.icon}</span>
              <div style="display:flex;gap:5px;flex-wrap:wrap;justify-content:flex-end">
                ${isRequired ? `<span style="padding:2px 8px;border-radius:20px;font-size:10.5px;font-weight:700;background:rgba(185,28,28,.1);color:#B91C1C">Required</span>` : '<span style="padding:2px 8px;border-radius:20px;font-size:10.5px;font-weight:600;background:var(--bdr-s);color:var(--ink-s)">Optional</span>'}
                ${status ? _trainingStatusChip(status) : ''}
              </div>
            </div>
             <div style="font-size:14.5px;font-weight:800;color:var(--ink);margin-top:10px;line-height:1.35">${course.title}</div>
          </div>
          <div class="training-course-body">
            <div style="font-size:12px;color:var(--ink-s);line-height:1.6;flex:1">${course.description}</div>
            <div class="training-course-meta">
              <span style="font-size:11.5px;color:var(--ink-mu)">📂 ${course.category}</span>
              <span style="font-size:11.5px;color:var(--ink-mu)">⏱ ${course.duration}</span>
              <span style="font-size:11.5px;color:var(--ink-mu)">${course.format === 'Online' ? '💻' : '🏛'} ${course.format}</span>
              ${course.seats !== null ? `<span style="font-size:11.5px;color:var(--ink-mu)">💺 ${course.seats} seats</span>` : ''}
            </div>
            ${_courseActionButtons(course, session)}
          </div>
        </div>`;
    }).join('');
  }

  function renderTrainingCatalogueModal(session) {
    const isEmployee = session.role === 'employee';
    const isManager  = session.role === 'manager';
    const isHR       = ['hr_admin', 'hr_officer'].includes(session.role);

    const tabs = isHR
      ? [['all', 'All Courses'], ['required', 'Mandatory'], ['optional', 'Optional']]
      : [['all', 'All Courses'], ['required', 'Mandatory'], ['enrolled', 'My Enrolments']];

    return `
      <div class="modal-overlay" id="training-catalogue-modal">
        <div class="modal admin-modal training-catalogue-modal">
          <div class="admin-modal-hero training-catalogue-hero">
            <div>
              <div class="module-eyebrow" style="color:rgba(255,255,255,.7)">Learning Studio</div>
              <h2 style="color:#fff">${isEmployee ? 'My Training Catalogue' : isManager ? 'Team Learning Catalogue' : 'Course Catalogue'}</h2>
              <p style="color:rgba(255,255,255,.88);font-size:13.5px">${isEmployee ? 'Browse curated courses, complete required learning, and keep your development moving.' : isManager ? 'Guide your team through learning paths, required modules, and development opportunities.' : 'Oversee the company learning library, required compliance tracks, and enrolment demand.'}</p>
            </div>
            <div class="admin-modal-hero-badge"><span>${COURSE_CATALOGUE.length}</span><strong>Learning paths live</strong><div style="margin-top:8px;font-size:11px;color:rgba(255,255,255,.78)">Courses, pathways, and completion tracking</div></div>
          </div>
          <div class="modal-head admin-modal-head">
            <button class="modal-close" onclick="closeModal('training-catalogue-modal')">✕</button>
          </div>
          <div class="training-tabs">
            ${tabs.map(([key, label], i) => `
              <button id="tab-${key}" class="training-tab-btn" onclick="ModulePage.switchTrainingTab('${key}')"
                style="color:${i === 0 ? 'var(--navy-l)' : 'var(--ink-s)'};background:${i === 0 ? 'rgba(15,118,110,.08)' : 'transparent'};border-bottom:${i === 0 ? '2.5px solid var(--navy-l)' : '2.5px solid transparent'};margin-bottom:-1px">
                 ${label}
               </button>`).join('')}
          </div>
          <div class="modal-body admin-modal-body training-catalogue-body">
            ${(isEmployee || isManager || isHR) ? _renderMandatoryProgress(session) : ''}
            <div id="training-tab-content">
               <div class="training-grid">
                ${_renderCatalogueGrid(session)}
              </div>
            </div>
          </div>
          <div class="modal-footer admin-modal-footer">
            <div class="admin-modal-foot-copy">
              <strong>Changes take effect immediately</strong>
              <span>Enrolments and completions are saved to your training record.</span>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="closeModal('training-catalogue-modal')">Close</button>
          </div>
        </div>
      </div>`;
  }

  let _trainingSession = null;

  function openTrainingCatalogue() {
    _trainingSession = Session.get();
    let modal = document.getElementById('training-catalogue-modal');
    if (modal) modal.remove();
    document.body.insertAdjacentHTML('beforeend', renderTrainingCatalogueModal(_trainingSession));
    openModal('training-catalogue-modal');
  }

  function switchTrainingTab(key) {
    const session = _trainingSession || Session.get();
    // Update tab styles
    ['all','required','optional','enrolled'].forEach(k => {
      const btn = document.getElementById(`tab-${k}`);
      if (!btn) return;
      const active = k === key;
      btn.style.color = active ? 'var(--navy-l)' : 'var(--ink-s)';
      btn.style.background = active ? 'rgba(15,118,110,.08)' : 'transparent';
    });
    // Re-render grid with filter
    const filterFns = {
      all:      () => true,
      required: c => c.required,
      optional: c => !c.required,
      enrolled: c => !!_enrolmentStatus(c.id, session),
    };
    const content = document.getElementById('training-tab-content');
    if (content) {
      content.innerHTML = `
        <div class="training-grid">
          ${_renderCatalogueGrid(session, filterFns[key] || (() => true))}
        </div>`;
    }
    // Refresh mandatory progress bar
    const modal = document.getElementById('training-catalogue-modal');
    const progBar = modal?.querySelector('[style*="Mandatory Learning"]')?.closest('[style*="parch"]');
    if (progBar) progBar.outerHTML = _renderMandatoryProgress(session);
  }

  function _mutateCourseRecord(courseId, session, mutate) {
    const records = window.ASTERAHR?.moduleData?.training;
    if (!records) return;
    const existing = records.find(r => r.courseId === courseId && r.userId === session.userId);
    if (existing) {
      mutate(existing);
    } else {
      const course = COURSE_CATALOGUE.find(c => c.id === courseId);
      const newRecord = {
        userId: session.userId,
        name: session.name,
        courseId,
        course: course?.title || courseId,
        status: 'Scheduled',
        context: 'Just enrolled',
        dept: session.department || 'General',
        required: course?.required || false,
      };
      mutate(newRecord);
      records.unshift(newRecord);
    }
    window.ASTERAHR.store.persist();
  }

  function _refreshCatalogueModal() {
    const session = _trainingSession || Session.get();
    // Refresh just the progress bar and active tab
    const activeTab = document.querySelector('[id^="tab-"][style*="navy-l"]');
    const tabKey = activeTab?.id?.replace('tab-', '') || 'all';
    switchTrainingTab(tabKey);
    // Refresh mandatory bar
    const modalBody = document.querySelector('#training-catalogue-modal .modal-body');
    if (modalBody) {
      const oldBar = modalBody.querySelector('[style*="Mandatory Learning"]')?.closest('div[style*="parch"]');
      if (oldBar) oldBar.outerHTML = _renderMandatoryProgress(session);
    }
  }

  function enrolCourse(courseId) {
    const session = _trainingSession || Session.get();
    _mutateCourseRecord(courseId, session, r => {
      r.status = 'Scheduled';
      r.context = 'Just enrolled';
    });
    const course = COURSE_CATALOGUE.find(c => c.id === courseId);
    Session.audit('TRAINING_ENROL', `Enrolled in ${course?.title || courseId}`);
    _notifyUser(session?.userId, {
      type: 'training',
      title: 'Training enrolment confirmed',
      msg: `You are enrolled in ${course?.title || 'the selected course'}.`,
      href: 'modules/training/catalogue.html',
      actor: session?.name,
    });
    if (course?.required) {
      _notifyHR({
        type: 'training',
        title: 'Mandatory training enrolment',
        msg: `${session?.name || 'An employee'} enrolled in required learning: ${course.title}.`,
        href: 'modules/training/catalogue.html',
        actor: session?.name,
      });
    }
    Toast.success(`Enrolled in ${course?.title || 'course'}.`);
    _refreshCatalogueModal();
    init();
  }

  function bookmarkCourse(courseId) {
    const session = _trainingSession || Session.get();
    _mutateCourseRecord(courseId, session, r => {
      r.status = 'Bookmarked';
      r.context = 'Bookmarked for later';
    });
    const course = COURSE_CATALOGUE.find(c => c.id === courseId);
    Session.audit('TRAINING_BOOKMARK', `Bookmarked ${course?.title || courseId}`);
    Toast.info(`${course?.title || 'Course'} bookmarked.`);
    _refreshCatalogueModal();
    init();
  }

  function withdrawCourse(courseId) {
    const session = _trainingSession || Session.get();
    const records = window.ASTERAHR?.moduleData?.training;
    if (!records) return;
    const idx = records.findIndex(r => r.courseId === courseId && r.userId === session.userId);
    if (idx !== -1) records.splice(idx, 1);
    window.ASTERAHR.store.persist();
    const course = COURSE_CATALOGUE.find(c => c.id === courseId);
    Session.audit('TRAINING_WITHDRAW', `Withdrew from ${course?.title || courseId}`);
    Toast.warning(`Withdrawn from ${course?.title || 'course'}.`);
    _refreshCatalogueModal();
    init();
  }

  function markCourseComplete(courseId) {
    const session = _trainingSession || Session.get();
    _mutateCourseRecord(courseId, session, r => {
      r.status = 'Completed';
      r.context = 'Completed just now';
      r.completedAt = new Date().toISOString();
    });
    const course = COURSE_CATALOGUE.find(c => c.id === courseId);
    Session.audit('TRAINING_COMPLETE', `Completed ${course?.title || courseId}`);
    _notifyUser(session?.userId, {
      type: 'training',
      title: 'Training completed',
      msg: `You marked ${course?.title || 'your course'} as complete.`,
      href: 'modules/training/catalogue.html',
      actor: session?.name,
    });
    if (course?.required) {
      _notifyHR({
        type: 'training',
        title: 'Mandatory training completed',
        msg: `${session?.name || 'An employee'} completed required learning: ${course.title}.`,
        href: 'modules/training/catalogue.html',
        actor: session?.name,
      });
    }
    Toast.success(`${course?.title || 'Course'} marked as complete. 🎉`);
    _refreshCatalogueModal();
    init();
  }

  function documentsData(page, session) {
    const records = scopeRecords(recordsFor('documents'), session);
    if (!records.length) return page;
    const availableCount = records.filter(r => r.status === 'Available' || r.status === 'Uploaded').length;
    const uploadCount = records.filter(r => r.status === 'Requested' || r.status === 'Pending').length;
    const scopedCount = records.filter(r => !r.public).length;
    return {
      ...page,
      stats: [
        stat(records.length, 'Accessible documents', 'Filtered by your current role', 'slate', '📄'),
        stat(availableCount, 'Ready to download', 'Available or already uploaded', 'indigo', '📘'),
        stat(uploadCount, 'Need submission', scopedCount ? `${scopedCount} scoped document${scopedCount === 1 ? '' : 's'}` : 'No restricted files', 'gold', '📎'),
      ],
      rows: records.slice(0, 3).map(r => [r.title, `${r.type} · ${r.context}`, _docMeta(r).icon]),
      tableRows: records.map(r => [r.title, r.type, r.status, r.context]),
      _docRecords: records,
      _docSession: session,
    };
  }

  /* ── Document Downloads ─────────────────────────────── */

  const DOC_ICONS = {
    'Public policy':      { icon: '📘', color: '#1F3C88' },
    'Personal record':    { icon: '🧾', color: '#006B42' },
    'Shared document':    { icon: '📄', color: '#8B5C00' },
    'Shared resource':    { icon: '📂', color: '#3D4CB5' },
    'Department guide':   { icon: '📋', color: '#9B1C1C' },
    'Personal follow-up': { icon: '🪪', color: '#B91C1C' },
  };

  function _docMeta(doc) {
    return DOC_ICONS[doc.type] || { icon: '📄', color: '#5A6B85' };
  }

  function _docTitleKey(title) {
    return String(title || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ');
  }

  function _docScopeLabel(doc, session) {
    if (doc.public) return 'All staff';
    if (doc.userId && doc.userId === session?.userId) return 'My record';
    if (doc.dept) return `${doc.dept} department`;
    return 'Restricted';
  }

  function _ensureDocReference(doc) {
    if (doc.docRef) return doc.docRef;
    const seed = `${slugify(doc.title)}-${slugify(doc.type)}-${slugify(doc.userId || doc.dept || doc.context || 'global')}`;
    doc.docRef = `DOC-${seed.slice(0, 18).toUpperCase()}`;
    return doc.docRef;
  }

  function _docStatusBadge(status) {
    const map = {
      'Available': { bg: 'rgba(0,107,66,.10)',  color: '#006B42' },
      'Requested': { bg: 'rgba(244,180,0,.12)', color: '#8B5C00' },
      'Pending':   { bg: 'rgba(185,28,28,.10)', color: '#B91C1C' },
      'Uploaded':  { bg: 'rgba(61,76,181,.10)', color: '#3D4CB5' },
    };
    const s = map[status] || { bg: 'var(--bdr-s)', color: 'var(--ink-s)' };
    return `<span style="display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;
                         font-size:11.5px;font-weight:600;background:${s.bg};color:${s.color}">${status}</span>`;
  }

  function _generateDocContent(doc, session) {
    const now = new Date().toLocaleString('en-KE', { dateStyle: 'long', timeStyle: 'short' });
    const org  = 'AsteraHR Ltd';
    const titleKey = _docTitleKey(doc.title);
    const reference = _ensureDocReference(doc);

    const templates = {
      'employee handbook': `${org} — Employee Handbook\n${'═'.repeat(56)}\nReference: ${reference}\nEffective: January 2025\nReview cycle: Annual\n\n1. Employment Foundations\n   This handbook outlines employment standards, governance expectations, and day-to-day workplace principles for all AsteraHR employees.\n\n2. Workplace Conduct\n   Every employee is expected to act professionally, protect confidential information, and support a respectful, inclusive working environment.\n\n3. Hours, Attendance, and Flexibility\n   Standard working hours are 08:00 to 17:00, Monday to Friday. Flexible schedules, remote days, and overtime require prior approval through the ERP workflow.\n\n4. Leave and Time Away\n   Staff should use the leave module for annual, sick, family, and special leave requests. Managers are expected to respond within two working days.\n\n5. Performance and Growth\n   Performance conversations run through mid-year and end-year cycles, supported by goal tracking, self-assessments, and manager feedback.\n\n6. Safety, Grievance, and Escalation\n   Employees should report workplace concerns early. Issues may be raised with a line manager, HR officer, or HR administrator depending on sensitivity.\n\n${'─'.repeat(56)}\nDownloaded by: ${session.name}\nDownloaded on: ${now}\nDocument ID: ${reference}`,

      'code of conduct': `${org} — Code of Conduct\n${'═'.repeat(56)}\nReference: ${reference}\n\n1. Act with integrity in all business, employee, and system interactions.\n2. Treat colleagues, clients, and partners with respect and professionalism.\n3. Protect confidential, personal, and proprietary information at all times.\n4. Disclose conflicts of interest before they affect decisions or approvals.\n5. Use company funds, systems, and records only for authorized work purposes.\n6. Report misconduct, fraud, harassment, or unsafe behavior through approved channels.\n\n${'─'.repeat(56)}\nDownloaded by: ${session.name}\nDownloaded on: ${now}\nDocument ID: ${reference}`,

      'leave policy': `${org} — Leave Policy\n${'═'.repeat(56)}\nReference: ${reference}\n\nANNUAL LEAVE\n   Entitlement: 21 working days per calendar year.\n   Accrual: 1.75 days per completed month of service.\n   Notice: Submit at least 5 working days before the intended start date unless exceptional circumstances apply.\n\nSICK LEAVE\n   Entitlement: 14 days per year.\n   Pay treatment: First 7 days at full pay, next 7 days at half pay.\n   Supporting records: A medical note is required for absences above 3 consecutive working days.\n\nMATERNITY LEAVE\n   Entitlement: 90 calendar days at full pay, in line with company policy and local employment obligations.\n\nPATERNITY LEAVE\n   Entitlement: 14 calendar days at full pay for birth or legal adoption placement.\n\nBEREAVEMENT LEAVE\n   Immediate family: 5 working days.\n   Extended family: 3 working days.\n   Approval route: Manager review with HR visibility for record keeping.\n\n${'─'.repeat(56)}\nDownloaded by: ${session.name}\nDownloaded on: ${now}\nDocument ID: ${reference}`,

      'manager handbook': `${org} — Manager Handbook\n${'═'.repeat(56)}\nReference: ${reference}\n\nCORE RESPONSIBILITIES\n   Managers are responsible for team planning, attendance oversight, timely leave decisions, documentation follow-up, and performance coaching.\n\nAPPROVAL AUTHORITIES\n   Managers may approve routine leave, attendance corrections, and team scheduling actions within their delegated departmental scope.\n\nPEOPLE OVERSIGHT\n   Maintain accurate team records, confirm onboarding readiness, and escalate missing employee documentation before payroll cut-off.\n\nPERFORMANCE EXPECTATIONS\n   Complete manager reviews promptly, document feedback clearly, and support measurable growth plans for direct reports.\n\nRISK AND COMPLIANCE\n   Flag policy breaches, safeguarding concerns, or sensitive conduct matters to HR immediately when they exceed normal line-management handling.\n\nESCALATION PATH\n   Team issue -> Line manager -> HR Officer / HR Administrator -> Executive or compliance owner where needed.\n\n${'─'.repeat(56)}\nDownloaded by: ${session.name}\nDownloaded on: ${now}\nDocument ID: ${reference}`,

      'signed contract': `${org} — Signed Contract Copy\n${'═'.repeat(56)}\nReference: ${reference}\n\nEmployee Name: ${session.name}\nDepartment: ${session.department || 'General'}\nJob Title: ${session.title || 'Staff'}\nEmployment Type: Permanent, full time\nRecord Status: Employee copy generated from the document repository\n\nTERMS SUMMARY\n   Compensation, benefits, confidentiality, conduct expectations, and notice obligations follow the signed employment agreement retained by HR.\n\nPOSITION AND REPORTING\n   The employee serves in the role of ${session.title || 'Staff'} within the ${session.department || 'General'} department and reports according to the current organisational structure.\n\nNOTICE PERIOD\n   Either party must provide written notice in accordance with the executed agreement and prevailing policy requirements.\n\nCONFIDENTIALITY\n   The employee remains bound by confidentiality, data protection, and acceptable-use obligations during and after employment.\n\nACKNOWLEDGEMENT\n   This repository copy is issued for ${session.name}. The signed original remains on the official personnel file.\n\n${'─'.repeat(56)}\nDownloaded by: ${session.name}\nDownloaded on: ${now}\nDocument ID: ${reference}`,
    };

    return templates[titleKey] ||
      `${org} — ${doc.title}\n${'═'.repeat(56)}\nReference: ${reference}\n\nDocument type: ${doc.type}\nStatus: ${doc.status}\nAccess scope: ${_docScopeLabel(doc, session)}\nContext: ${doc.context || 'Repository record'}\nSubmitted reference: ${doc.ref || 'Not provided'}\nSubmitted note: ${doc.note || 'None'}\nSubmitted at: ${doc.submittedAt ? Fmt.dateTime(doc.submittedAt) : 'Not recorded'}\n\nThis file was generated from the document repository as a coherent fallback export.\nIt captures the metadata currently stored for this accessible record.\n\n${'─'.repeat(56)}\nDownloaded by: ${session.name}\nDownloaded on: ${now}\nDocument ID: ${reference}`;
  }

  let _currentDocRecords = null;
  let _currentDocSession = null;
  let _pendingFulfilIdx  = null;

  function _refreshDocTable() {
    const tbody = document.getElementById('doc-table-body');
    if (tbody && _currentDocRecords) {
      tbody.innerHTML = renderDocTableRows(_currentDocRecords, _currentDocSession);
    }
  }

  function renderDocTableRows(records, session) {
    return records.map((doc, idx) => {
      const meta  = _docMeta(doc);
      const canDownload = doc.status === 'Available' || doc.status === 'Uploaded';
      const needsFulfil = doc.status === 'Requested' || doc.status === 'Pending';
      const scopeLabel = _docScopeLabel(doc, session);
      const typeLabel = doc.type || 'Document';
      const contextLabel = doc.context || 'Repository record';

      const actionBtn = canDownload
        ? `<button class="btn btn-navy btn-sm" onclick="ModulePage.downloadDoc(${idx})" style="white-space:nowrap">
             ↓ Download
           </button>`
        : needsFulfil
          ? `<button class="btn btn-ghost btn-sm" onclick="ModulePage.openFulfilDoc(${idx})" style="white-space:nowrap">
               ↑ Submit file
             </button>`
          : `<span style="font-size:12px;color:var(--ink-mu)">—</span>`;

        return `
        <tr>
          <td>
            <div style="display:flex;align-items:center;gap:10px">
              <span style="width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;background:${meta.color}18;color:${meta.color};font-size:18px">${meta.icon}</span>
              <div style="min-width:0">
                <div style="font-size:13px;font-weight:600;color:var(--ink)">${doc.title}</div>
                <div style="font-size:11.5px;color:var(--ink-mu);margin-top:1px">${contextLabel}</div>
              </div>
            </div>
          </td>
          <td><span style="font-size:12.5px;color:var(--ink-s);font-weight:500">${typeLabel}</span></td>
          <td>${_docStatusBadge(doc.status)}</td>
          <td><span style="font-size:11.5px;color:var(--ink-mu)">${doc.public ? '🌐' : '🔒'} ${scopeLabel}</span></td>
          <td style="text-align:right">${actionBtn}</td>
        </tr>`;
    }).join('');
  }

  function renderFulfilDocModal() {
    return `
      <div class="modal-overlay" id="fulfil-doc-modal">
        <div class="modal modal-sm">
          <div class="modal-body" style="padding:28px 26px">
            <div style="font-size:32px;margin-bottom:10px">📎</div>
            <h2 id="fulfil-doc-title" style="font-family:var(--f-serif);font-size:20px;margin-bottom:6px;color:var(--ink)">Submit Document</h2>
            <p id="fulfil-doc-sub" style="font-size:13.5px;color:var(--ink-s);line-height:1.6;margin-bottom:18px">
              Upload or confirm the requested document to clear it from your checklist.
            </p>
            <label style="display:block;margin-bottom:14px">
              <span style="font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--ink-m);display:block;margin-bottom:6px">Reference / note <span style="color:var(--red)">*</span></span>
              <input id="fulfil-doc-ref" type="text" placeholder="e.g. KRA PIN: A123456789Z or 'Uploaded to HR portal'"
                style="width:100%;padding:10px 12px;border:1.5px solid var(--bdr);border-radius:var(--r);
                       font-family:var(--f-ui);font-size:13.5px;box-sizing:border-box;color:var(--ink);outline:none"
                onfocus="this.style.borderColor='var(--navy-l)'" onblur="this.style.borderColor='var(--bdr)'"/>
            </label>
            <label style="display:block">
              <span style="font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--ink-m);display:block;margin-bottom:6px">Notes (optional)</span>
              <textarea id="fulfil-doc-notes" rows="2" placeholder="Any additional context for HR…"
                style="width:100%;padding:10px 12px;border:1.5px solid var(--bdr);border-radius:var(--r);
                       font-family:var(--f-ui);font-size:13.5px;resize:vertical;box-sizing:border-box;color:var(--ink);outline:none"
                onfocus="this.style.borderColor='var(--navy-l)'" onblur="this.style.borderColor='var(--bdr)'"></textarea>
            </label>
          </div>
          <div class="modal-footer" style="padding:14px 26px;border-top:1px solid var(--bdr-s);display:flex;justify-content:flex-end;gap:10px">
            <button class="btn btn-ghost btn-sm" onclick="closeModal('fulfil-doc-modal')">Cancel</button>
            <button class="btn btn-navy btn-sm" onclick="ModulePage.confirmFulfilDoc()">Submit Document</button>
          </div>
        </div>
      </div>`;
  }

  function downloadDoc(idx) {
    const session = _currentDocSession || Session.get();
    const records = _currentDocRecords;
    if (!records) return;
    const doc = records[idx];
    if (!doc) return;

    if (doc.status !== 'Available' && doc.status !== 'Uploaded') {
      Toast.warning('This document is not yet available for download.');
      return;
    }

    const content  = _generateDocContent(doc, session);
    const filename = doc.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.txt';
    downloadTextFile(filename, content);

    Session.audit('DOCUMENT_DOWNLOAD', `${doc.title} downloaded by ${session.name}`);
    Toast.success(`"${doc.title}" downloaded.`);
  }

  function openFulfilDoc(idx) {
    _pendingFulfilIdx = idx;
    const doc = _currentDocRecords?.[idx];
    if (!doc) return;

    document.getElementById('fulfil-doc-title').textContent = `Submit: ${doc.title}`;
    document.getElementById('fulfil-doc-sub').textContent   =
      `Fulfil the request for "${doc.title}" by providing a reference or confirmation.`;
    document.getElementById('fulfil-doc-ref').value   = '';
    document.getElementById('fulfil-doc-notes').value = '';
    openModal('fulfil-doc-modal');
  }

  function confirmFulfilDoc() {
    const ref = document.getElementById('fulfil-doc-ref')?.value?.trim();
    const note = document.getElementById('fulfil-doc-notes')?.value?.trim() || '';
    if (!ref) { Toast.error('Please enter a reference or note.'); return; }

    const session = _currentDocSession || Session.get();
    const pendingIdx = _pendingFulfilIdx;
    const doc     = _currentDocRecords?.[pendingIdx];
    if (!doc) return;

    // Mark the record as uploaded/available in the live dataset
    const allDocs = window.ASTERAHR?.moduleData?.documents;
    if (allDocs) {
      const liveDoc = allDocs.find(d =>
        d.title === doc.title &&
        d.type === doc.type &&
        d.context === doc.context &&
        d.userId === doc.userId &&
        d.public === doc.public &&
        d.dept === doc.dept
      );
      if (liveDoc) {
        liveDoc.status  = 'Uploaded';
        liveDoc.context = note ? `Submitted by ${session.name} · ${note}` : `Submitted by ${session.name}`;
        liveDoc.ref     = ref;
        liveDoc.note    = note;
        liveDoc.submittedAt = new Date().toISOString();
        _ensureDocReference(liveDoc);
      }
      window.ASTERAHR.store.persist();
    }

    Session.audit('DOCUMENT_UPLOAD', `${doc.title} uploaded by ${session.name} — ref: ${ref}`);
    _notifyHR({
      type: 'document',
      title: 'Document submitted',
      msg: `${session.name} submitted ${doc.title} (${ref}).`,
      href: 'modules/documents/repository.html',
      actor: session.name,
    });
    closeModal('fulfil-doc-modal');
    Toast.success(`"${doc.title}" submitted successfully.`);

    // Refresh the in-memory records and table
    if (_currentDocRecords) {
      const rec = _currentDocRecords[pendingIdx];
      if (rec) {
        rec.status = 'Uploaded';
        rec.context = note ? `Submitted by ${session.name} · ${note}` : `Submitted by ${session.name}`;
        rec.ref = ref;
        rec.note = note;
        rec.submittedAt = new Date().toISOString();
        _ensureDocReference(rec);
      }
    }
    _pendingFulfilIdx = null;
    init();
  }

  function reportsData(page, session) {
    const records = scopeRecords(recordsFor('reports'), session);
    if (!records.length) return page;
    return {
      ...page,
      stats: [
        stat(records.length, 'Visible reports', 'Filtered from mock records', 'blue', '📈'),
        stat(records.filter(r => r.status === 'Scheduled').length, 'Scheduled', 'Queued exports', 'green', '↗'),
        stat(records.filter(r => r.status === 'Ready').length, 'Ready', 'Available now', 'gold', '✓'),
      ],
      rows: records.slice(0, 3).map(r => [r.title, `${r.audience} · ${r.context}`, '📊']),
      tableRows: records.slice(0, 3).map(r => [r.title, r.audience, r.status, r.context]),
    };
  }

  function applyDataScope(page, session) {
    const resolvers = {
      announcements: announcementsData,
      employees: employeesData,
      'my-profile': profileData,
      'org-chart': orgChartData,
      attendance: attendanceData,
      leave: leaveData,
      performance: performanceData,
      training: trainingData,
      documents: documentsData,
      reports: reportsData,
    };
    return (resolvers[page.activeNav] || ((value) => value))(page, session);
  }

  function toneClass(tone) {
    return `tone-${tone || 'blue'}`;
  }

  function tableColumns(page) {
    return page.tableColumns || DEFAULT_TABLE;
  }

  function renderStats(stats) {
    return stats.map(([value, label, meta, tone, icon]) => `
      <div class="module-stat ${toneClass(tone)}">
        <div class="module-stat-top">
          <span class="module-stat-icon">${icon}</span>
          <span class="module-stat-meta">${meta}</span>
        </div>
        <strong class="module-stat-value">${value}</strong>
        <span class="module-stat-label">${label}</span>
      </div>
    `).join('');
  }

  function renderRows(rows) {
    return rows.map(([title, meta, icon]) => `
      <div class="module-item">
        <div class="module-item-icon">${icon}</div>
        <div class="module-item-copy">
          <strong>${title}</strong>
          <span>${meta}</span>
        </div>
      </div>
    `).join('');
  }

  function renderWorkflowField(field) {
    if (field.type === 'checkbox') {
      return `
        <label class="admin-field admin-field-checkbox ${field.full ? 'admin-field-lg' : ''}">
          <span class="admin-field-label">${field.label}</span>
          <span class="admin-field-toggle">
            <input type="checkbox" name="${field.name}" ${field.checked ? 'checked' : ''}/>
            <span>${field.help || 'Enable this option'}</span>
          </span>
        </label>
      `;
    }

    if (field.type === 'textarea') {
      return `
        <label class="admin-field ${field.full ? 'admin-field-lg' : ''}">
          <span class="admin-field-label">${field.label}</span>
          <textarea name="${field.name}" placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>
        </label>
      `;
    }

    if (field.type === 'select') {
      return `
        <label class="admin-field ${field.full ? 'admin-field-lg' : ''}">
          <span class="admin-field-label">${field.label}</span>
          <select name="${field.name}" ${field.required ? 'required' : ''}>
            ${(field.options || []).map(option => `<option value="${option}">${option}</option>`).join('')}
          </select>
        </label>
      `;
    }

    return `
      <label class="admin-field ${field.full ? 'admin-field-lg' : ''}">
        <span class="admin-field-label">${field.label}</span>
        <input
          name="${field.name}"
          type="${field.type || 'text'}"
          placeholder="${field.placeholder || ''}"
          value="${field.value || ''}"
          ${field.required ? 'required' : ''}
        />
      </label>
    `;
  }

  function renderWorkflowModal() {
    return `
      <div class="modal-overlay" id="workflow-modal">
        <div class="modal admin-modal admin-modal-workflow">
          <div class="admin-modal-hero">
            <div>
              <div class="module-eyebrow" id="workflow-eyebrow">Workflow</div>
              <h2 id="workflow-title">Action</h2>
              <p id="workflow-description">Complete this workflow.</p>
            </div>
            <div class="admin-modal-hero-badge">
              <span id="workflow-badge">Module</span>
              <strong id="workflow-badge-title">Action flow</strong>
            </div>
          </div>
          <div class="modal-head admin-modal-head">
            <button class="modal-close" onclick="closeModal('workflow-modal')">x</button>
          </div>
          <div class="modal-body admin-modal-body">
            <form id="workflow-form" class="admin-form-grid"></form>
          </div>
          <div class="modal-footer admin-modal-footer">
            <div class="admin-modal-foot-copy">
              <strong id="workflow-note-title">Workflow action</strong>
              <span id="workflow-note-text">This action will update the demo state.</span>
            </div>
            <div style="display:flex;gap:10px">
              <button class="btn btn-ghost btn-sm" onclick="closeModal('workflow-modal')">Cancel</button>
              <button class="btn btn-navy btn-sm" id="workflow-submit" onclick="ModulePage.submitWorkflow()">Continue</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderActions(actions) {
    const session = Session.get();
    return actions.filter(([, path]) => {
      if (!path || path === '#') return true;
      if (path.startsWith('action:')) return true;
      const key = RBAC.keyForPath(path);
      return !key || RBAC.canAccessNav(session, key);
    }).map(([label, path]) => `
      <a class="module-link" href="${path.startsWith('action:') ? '#' : actionHref(path)}" ${path === '#' ? 'onclick="ModulePage.placeholder(event, this.textContent.trim())"' : ''} ${path.startsWith('action:') ? `onclick="ModulePage.handleAction(event, '${path.slice(7)}')"` : ''}>
        <span>${label}</span>
        <span>→</span>
      </a>
    `).join('');
  }

  function renderTableRows(page) {
    if (page.dynamicAudit) {
      return Session.getAuditLog().slice(0, 6).map(entry => `
        <tr>
          <td>${entry.a || 'EVENT'}</td>
          <td>${entry.d || 'Activity recorded'}</td>
          <td>${entry.u || 'System'}</td>
          <td>${Fmt.timeAgo(entry.ts)}</td>
        </tr>
      `).join('');
    }

    if (page._leaveRecords) {
      return renderLeaveTableRows(page._leaveRecords, page._leaveApprover);
    }

    if (page._attendanceRecords) {
      return renderAttendanceTableRows(page._attendanceRecords, page._attendanceApprover);
    }

    if (page._docRecords) {
      return renderDocTableRows(page._docRecords, page._docSession);
    }

    return (page.tableRows || []).map(cols => `
      <tr>
        ${cols.map(col => `<td>${col}</td>`).join('')}
      </tr>
    `).join('');
  }

  function _leaveStatusBadge(status) {
    const map = {
      'Pending':  { bg: 'rgba(244,180,0,.12)',  color: '#8B5C00', label: 'Pending' },
      'Open':     { bg: 'rgba(244,180,0,.12)',  color: '#8B5C00', label: 'Open' },
      'Approved': { bg: 'rgba(0,135,83,.10)',   color: '#006B42', label: 'Approved' },
      'Rejected': { bg: 'rgba(185,28,28,.10)',  color: '#B91C1C', label: 'Rejected' },
    };
    const s = map[status] || { bg: 'var(--bdr-s)', color: 'var(--ink-s)', label: status };
    return `<span style="display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:600;background:${s.bg};color:${s.color}">${s.label}</span>`;
  }

  function renderLeaveTableRows(records, canApprove) {
    return records.map((r, idx) => {
      const isPending = r.status === 'Pending' || r.status === 'Open';
      const detailId = `leave-detail-${idx}`;
      const approverRow = (canApprove && isPending) ? `
        <tr id="${detailId}" style="display:none;background:var(--parch)">
          <td colspan="5" style="padding:0">
            <div style="padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:16px;border-top:1px solid var(--bdr-s)">
              <div style="font-size:13px;color:var(--ink-s);line-height:1.6">
                <strong style="color:var(--ink);display:block;margin-bottom:2px">${r.name} · ${r.type}</strong>
                ${r.days} · ${r.detail || ''}
                ${r.reason ? `<span style="display:block;margin-top:4px;color:var(--ink-mu)">Reason: ${r.reason}</span>` : ''}
              </div>
              <div style="display:flex;gap:8px;flex-shrink:0">
                <button class="btn btn-green btn-sm" onclick="ModulePage.approveLeave(${idx})">✓ Approve</button>
                <button class="btn btn-danger btn-sm" onclick="ModulePage.rejectLeave(${idx})">✕ Reject</button>
              </div>
            </div>
          </td>
        </tr>
      ` : '';

      const clickAttr = (canApprove && isPending)
        ? `onclick="ModulePage.toggleLeaveRow('${detailId}')" style="cursor:pointer"`
        : '';

      return `
        <tr ${clickAttr}>
          <td>${r.name || '—'}</td>
          <td>${r.type || '—'}</td>
          <td>${r.days || '—'}</td>
          <td>${_leaveStatusBadge(r.status)}</td>
          <td>${r.detail || '—'}${(canApprove && isPending) ? ' <span style="font-size:11px;color:var(--ink-mu)">▾</span>' : ''}</td>
        </tr>
        ${approverRow}
      `;
    }).join('');
  }

  function renderTable(page) {
    const isLeave = !!page._leaveRecords;
    const isAtt   = !!page._attendanceRecords;
    const isDoc   = !!page._docRecords;

    const columns = isLeave ? ['Employee', 'Type', 'Duration', 'Status', 'Context']
                  : isAtt   ? ['Employee', 'Event', 'Status', 'Context', 'Department']
                  : isDoc   ? ['Document', 'Type', 'Status', 'Access Scope', '']
                  : tableColumns(page);

    const approverNote = (isLeave && page._leaveApprover) || (isAtt && page._attendanceApprover)
      ? `<span style="font-size:12px;color:var(--ink-mu);font-weight:400">Click a pending row to review</span>`
      : '';

    const tbodyId = isLeave ? 'leave-table-body'
                  : isAtt   ? 'att-table-body'
                  : isDoc   ? 'doc-table-body'
                  : '';

    return `
      <div class="card module-table-card">
        <div class="card-head">
          <div>
            <h3>${page.tableTitle} ${approverNote}</h3>
            <div class="card-sub">${page.tableSub}</div>
          </div>
        </div>
        <div class="card-body">
          <div class="table-wrap">
            <table>
              <thead>
                <tr>${columns.map(col => `<th>${col}</th>`).join('')}</tr>
              </thead>
              <tbody ${tbodyId ? `id="${tbodyId}"` : ''}>${renderTableRows(page)}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }

  function renderCommonSide(page) {
    return `
      <div class="module-side">
        <div class="card">
          <div class="card-head"><h3>Quick Links</h3></div>
          <div class="card-body">
            <div class="module-actions">${renderActions(page.actions)}</div>
          </div>
        </div>
        <div class="card">
          <div class="card-head"><h3>Page Scope</h3></div>
          <div class="card-body">
            <div class="module-chip-row">
              ${page.chips.map(chip => `<span class="module-chip">${chip}</span>`).join('')}
            </div>
            <div class="module-table-note">Visible to: ${page.allowedRoles.join(', ').replaceAll('_', ' ')}</div>
          </div>
        </div>
      </div>
    `;
  }

  function renderBulletin(page) {
    return `
      <section class="module-hero bulletin-hero">
        <div class="module-hero-main">
          <div class="module-eyebrow">${page.hero.eyebrow}</div>
          <h2>${page.hero.title}</h2>
          <p>${page.hero.text}</p>
        </div>
        <div class="module-hero-badge">
          <span class="module-hero-icon">${page.hero.icon}</span>
          <strong>${page.spotlight[0]}</strong>
          <span>${page.spotlight[1]}</span>
        </div>
      </section>
      <section class="module-stat-grid three-up">${renderStats(page.stats)}</section>
      <section class="module-layout-grid">
        <div class="card bulletin-card">
          <div class="card-head">
            <div>
              <h3>Highlights</h3>
              <div class="card-sub">${page.sub}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="module-list">${renderRows(page.rows)}</div>
          </div>
        </div>
        ${renderCommonSide(page)}
      </section>
      ${renderTable(page)}
    `;
  }

  function renderOperations(page) {
    return `
      <section class="module-hero operations-hero">
        <div class="module-hero-main">
          <div class="module-eyebrow">${page.hero.eyebrow}</div>
          <h2>${page.hero.title}</h2>
          <p>${page.hero.text}</p>
        </div>
        <div class="module-hero-stack">${renderStats(page.stats)}</div>
      </section>
      <section class="module-layout-grid wide-left">
        <div class="card module-feature-card">
          <div class="card-head">
            <div>
              <h3>${page.spotlight[0]}</h3>
              <div class="card-sub">${page.spotlight[1]}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="module-list">${renderRows(page.rows)}</div>
          </div>
        </div>
        ${renderCommonSide(page)}
      </section>
      ${renderTable(page)}
    `;
  }

  function renderProfile(page) {
    return `
      <section class="module-hero profile-hero">
        <div class="profile-card">
          <div class="profile-avatar">${page.hero.icon}</div>
          <div>
            <div class="module-eyebrow">${page.hero.eyebrow}</div>
            <h2>${page.hero.title}</h2>
            <p>${page.hero.text}</p>
          </div>
        </div>
        <div class="profile-stat-strip">${renderStats(page.stats)}</div>
      </section>
      <section class="module-layout-grid">
        <div class="card profile-detail-card">
          <div class="card-head">
            <div>
              <h3>${page.spotlight[0]}</h3>
              <div class="card-sub">${page.spotlight[1]}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="module-list">${renderRows(page.rows)}</div>
          </div>
        </div>
        ${renderCommonSide(page)}
      </section>
      ${renderTable(page)}
    `;
  }

  function renderAtlas(page) {
    // Org chart gets its own specialised layout
    if (page._orgChart) {
      return `
        <section class="module-hero atlas-hero">
          <div class="module-hero-main">
            <div class="module-eyebrow">${page.hero.eyebrow}</div>
            <h2>${page.hero.title}</h2>
            <p>${page.hero.text}</p>
            <div class="module-chip-row">
              ${page.chips.map(chip => `<span class="module-chip">${chip}</span>`).join('')}
            </div>
          </div>
          <div class="atlas-stats">${renderStats(page.stats)}</div>
        </section>
        ${renderOrgChartSection(page)}
      `;
    }

    return `
      <section class="module-hero atlas-hero">
        <div class="module-hero-main">
          <div class="module-eyebrow">${page.hero.eyebrow}</div>
          <h2>${page.hero.title}</h2>
          <p>${page.hero.text}</p>
          <div class="module-chip-row">
            ${page.chips.map(chip => `<span class="module-chip">${chip}</span>`).join('')}
          </div>
        </div>
        <div class="atlas-stats">${renderStats(page.stats)}</div>
      </section>
      <section class="card atlas-card">
        <div class="card-head">
          <div>
            <h3>${page.spotlight[0]}</h3>
            <div class="card-sub">${page.spotlight[1]}</div>
          </div>
        </div>
        <div class="card-body">
          <div class="module-rows-grid">${renderRows(page.rows)}</div>
        </div>
      </section>
      <section class="module-layout-grid">
        ${renderTable(page)}
        <div class="module-side compact-side">
          <div class="card">
            <div class="card-head"><h3>Paths</h3></div>
            <div class="card-body">
              <div class="module-actions">${renderActions(page.actions)}</div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderConsole(page) {
    return `
      <section class="module-hero console-hero">
        <div class="module-hero-main">
          <div class="module-eyebrow">${page.hero.eyebrow}</div>
          <h2>${page.hero.title}</h2>
          <p>${page.hero.text}</p>
        </div>
        <div class="console-panel">
          <div class="console-row"><span>status</span><strong>stable</strong></div>
          <div class="console-row"><span>module</span><strong>${page.title.toLowerCase()}</strong></div>
          <div class="console-row"><span>focus</span><strong>${page.spotlight[0].toLowerCase()}</strong></div>
        </div>
      </section>
      <section class="module-stat-grid three-up">${renderStats(page.stats)}</section>
      <section class="module-layout-grid">
        <div class="card console-card">
          <div class="card-head">
            <div>
              <h3>${page.spotlight[0]}</h3>
              <div class="card-sub">${page.spotlight[1]}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="module-list">${renderRows(page.rows)}</div>
          </div>
        </div>
        ${renderCommonSide(page)}
      </section>
      ${renderTable(page)}
    `;
  }

  function renderFinance(page) {
    return `
      <section class="module-hero finance-hero">
        <div class="module-hero-main">
          <div class="module-eyebrow">${page.hero.eyebrow}</div>
          <h2>${page.hero.title}</h2>
          <p>${page.hero.text}</p>
        </div>
        <div class="finance-totals">
          ${page.stats.slice(0, 2).map(([value, label]) => `
            <div class="finance-total">
              <strong>${value}</strong>
              <span>${label}</span>
            </div>
          `).join('')}
        </div>
      </section>
      <section class="module-stat-grid">${renderStats(page.stats)}</section>
      <section class="module-layout-grid">
        <div class="card finance-card">
          <div class="card-head">
            <div>
              <h3>${page.spotlight[0]}</h3>
              <div class="card-sub">${page.spotlight[1]}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="module-list">${renderRows(page.rows)}</div>
          </div>
        </div>
        ${renderCommonSide(page)}
      </section>
      ${renderTable(page)}
    `;
  }

  function renderAnalytics(page) {
    return `
      <section class="module-hero analytics-hero">
        <div class="module-hero-main">
          <div class="module-eyebrow">${page.hero.eyebrow}</div>
          <h2>${page.hero.title}</h2>
          <p>${page.hero.text}</p>
        </div>
        <div class="analytics-mini-board">
          ${page.stats.map(([value, label]) => `
            <div class="analytics-tile">
              <strong>${value}</strong>
              <span>${label}</span>
            </div>
          `).join('')}
        </div>
      </section>
      <section class="module-layout-grid wide-left">
        <div class="card analytics-card">
          <div class="card-head">
            <div>
              <h3>${page.spotlight[0]}</h3>
              <div class="card-sub">${page.spotlight[1]}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="module-rows-grid">${renderRows(page.rows)}</div>
          </div>
        </div>
        ${renderCommonSide(page)}
      </section>
      ${renderTable(page)}
    `;
  }

  function renderStudio(page) {
    return `
      <section class="module-hero studio-hero">
        <div class="module-hero-main">
          <div class="module-eyebrow">${page.hero.eyebrow}</div>
          <h2>${page.hero.title}</h2>
          <p>${page.hero.text}</p>
        </div>
        <div class="studio-canvas">
          <div class="studio-chip">Brand</div>
          <div class="studio-chip">Workflow</div>
          <div class="studio-chip">Notifications</div>
          <div class="studio-chip">Integrations</div>
        </div>
      </section>
      <section class="module-stat-grid three-up">${renderStats(page.stats)}</section>
      <section class="module-layout-grid">
        <div class="card studio-card">
          <div class="card-head">
            <div>
              <h3>${page.spotlight[0]}</h3>
              <div class="card-sub">${page.spotlight[1]}</div>
            </div>
          </div>
          <div class="card-body">
            <div class="module-list">${renderRows(page.rows)}</div>
          </div>
        </div>
        ${renderCommonSide(page)}
      </section>
      ${renderTable(page)}
    `;
  }

  function renderLayout(page) {
    const layouts = {
      bulletin: renderBulletin,
      operations: renderOperations,
      profile: renderProfile,
      atlas: renderAtlas,
      console: renderConsole,
      finance: renderFinance,
      analytics: renderAnalytics,
      studio: renderStudio,
    };

    return (layouts[page.layout] || renderOperations)(page);
  }

  function renderRoleModal() {
    return `
      <div class="modal-overlay" id="role-modal">
        <div class="modal admin-modal admin-modal-role">
          <div class="admin-modal-hero">
            <div>
              <div class="module-eyebrow">Access Design</div>
              <h2>Create a New Role</h2>
              <p>Define a role shell, inherit a starting permission set, and then tune the access matrix below.</p>
            </div>
            <div class="admin-modal-hero-badge">
              <span>RBAC</span>
              <strong>Permission Template</strong>
            </div>
          </div>
          <div class="modal-head admin-modal-head">
            <button class="modal-close" onclick="closeModal('role-modal')">✕</button>
          </div>
          <div class="modal-body admin-modal-body">
            <form id="role-form" class="admin-form-grid">
              <div class="admin-form-section">
                <div class="admin-section-head">
                  <strong>Role Identity</strong>
                  <span>How the role appears across the product.</span>
                </div>
                <div class="admin-field-grid">
                  <label class="admin-field" for="role-key">
                    <span class="admin-field-label">Role Key</span>
                    <input id="role-key" name="key" placeholder="project_manager"/>
                  </label>
                  <label class="admin-field admin-field-lg" for="role-label">
                    <span class="admin-field-label">Role Label</span>
                    <input id="role-label" name="label" placeholder="Project Manager"/>
                  </label>
                  <label class="admin-field" for="role-icon">
                    <span class="admin-field-label">Icon</span>
                    <input id="role-icon" name="icon" placeholder="📌"/>
                  </label>
                  <label class="admin-field" for="role-color">
                    <span class="admin-field-label">Accent Color</span>
                    <input id="role-color" name="color" placeholder="#475569"/>
                  </label>
                </div>
              </div>
              <div class="admin-form-section">
                <div class="admin-section-head">
                  <strong>Starting Access</strong>
                  <span>Choose what this role should inherit first.</span>
                </div>
                <div class="admin-field-grid">
                  <label class="admin-field" for="role-copy">
                    <span class="admin-field-label">Copy Permissions From</span>
                    <select id="role-copy" name="copyFrom">${Object.entries(window.ASTERAHR.roles).map(([key, meta]) => `<option value="${key}">${meta.label}</option>`).join('')}</select>
                  </label>
                  <label class="admin-field" for="role-dashboard">
                    <span class="admin-field-label">Dashboard</span>
                    <select id="role-dashboard" name="dashboard">${Object.entries(window.ASTERAHR.dashboards).map(([key, path]) => `<option value="${path}">${key}</option>`).join('')}</select>
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer admin-modal-footer">
            <div class="admin-modal-foot-copy">
              <strong>Creates role shell only</strong>
              <span>Use the matrix below after creation to refine the permission details.</span>
            </div>
            <div style="display:flex;gap:10px">
              <button class="btn btn-ghost btn-sm" onclick="closeModal('role-modal')">Cancel</button>
              <button class="btn btn-navy btn-sm" onclick="ModulePage.submitRole()">Create Role</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderEmployeesAdminPanel(session) {
    if (!['hr_admin', 'hr_officer'].includes(session.role)) return '';
    return `
      <section class="card">
        <div class="card-head">
          <div>
            <h3>Employee Admin</h3>
            <div class="card-sub">Create new employee accounts without editing source files.</div>
          </div>
          <button class="btn btn-navy btn-sm" onclick="ModulePage.openEmployeeModal()">Add Employee</button>
        </div>
        <div class="card-body">
          <div class="module-chip-row">
            <span class="module-chip">Creates login account</span>
            <span class="module-chip">Seeds scoped mock records</span>
            <span class="module-chip">Persists in localStorage</span>
          </div>
        </div>
      </section>
      ${renderEmployeeModal()}
    `;
  }

  function renderEmployeeModal() {
    return `
      <div class="modal-overlay" id="employee-modal">
        <div class="modal admin-modal admin-modal-employee">
          <div class="admin-modal-hero">
            <div>
              <div class="module-eyebrow">People Operations</div>
              <h2>Add a New Employee</h2>
              <p>Create the account, assign the role, and seed the employee's self-service records in one step.</p>
            </div>
            <div class="admin-modal-hero-badge">
              <span>HR</span>
              <strong>Onboarding Flow</strong>
            </div>
          </div>
          <div class="modal-head admin-modal-head">
            <button class="modal-close" onclick="closeModal('employee-modal')">✕</button>
          </div>
          <div class="modal-body admin-modal-body">
            <form id="employee-form" class="admin-form-grid">
              <div class="admin-form-section">
                <div class="admin-section-head">
                  <strong>Identity</strong>
                  <span>Who the employee is in the system.</span>
                </div>
                <div class="admin-field-grid">
                  <label class="admin-field admin-field-lg" for="emp-name">
                    <span class="admin-field-label">Full Name</span>
                    <input id="emp-name" name="name" placeholder="Grace Achieng"/>
                  </label>
                  <label class="admin-field" for="emp-email">
                    <span class="admin-field-label">Work Email</span>
                    <input id="emp-email" name="email" type="email" placeholder="user@asterahr.co.ke"/>
                  </label>
                  <label class="admin-field" for="emp-title">
                    <span class="admin-field-label">Job Title</span>
                    <input id="emp-title" name="title" placeholder="Senior Analyst"/>
                  </label>
                </div>
              </div>
              <div class="admin-form-section">
                <div class="admin-section-head">
                  <strong>Assignment</strong>
                  <span>Where they belong and what access they start with.</span>
                </div>
                <div class="admin-field-grid">
                  <label class="admin-field" for="emp-dept">
                    <span class="admin-field-label">Department</span>
                    <input id="emp-dept" name="department" placeholder="Engineering"/>
                  </label>
                  <label class="admin-field" for="emp-role">
                    <span class="admin-field-label">Role</span>
                    <select id="emp-role" name="role">${Object.entries(window.ASTERAHR.roles).map(([key, meta]) => `<option value="${key}">${meta.label}</option>`).join('')}</select>
                  </label>
                  <label class="admin-field" for="emp-password">
                    <span class="admin-field-label">Temporary Password</span>
                    <input id="emp-password" name="password" placeholder="Welcome@2026"/>
                  </label>
                </div>
              </div>
            </form>
            <div class="admin-form-note">
              <span class="admin-form-note-icon">i</span>
              <span>The employee will be added to the mock dataset and prompted to update their password on first use.</span>
            </div>
          </div>
          <div class="modal-footer admin-modal-footer">
            <div class="admin-modal-foot-copy">
              <strong>Creates account + seeded records</strong>
              <span>Profile, attendance, leave, performance, training, and document placeholders.</span>
            </div>
            <div style="display:flex;gap:10px">
              <button class="btn btn-ghost btn-sm" onclick="closeModal('employee-modal')">Cancel</button>
              <button class="btn btn-navy btn-sm" onclick="ModulePage.submitEmployee()">Create Employee</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderRbacAdminPanel(session) {
    if (session.role !== 'it_admin') return '';
    return `
      <section class="card">
        <div class="card-head">
          <div>
            <h3>Role Administration</h3>
            <div class="card-sub">Create roles and edit permissions with client-side persistence.</div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-ghost btn-sm" onclick="ModulePage.resetAdminData()">Reset Persisted Data</button>
            <button class="btn btn-navy btn-sm" onclick="ModulePage.openRoleModal()">Add Role</button>
          </div>
        </div>
        <div class="card-body">
          <div id="rbac-admin-root"></div>
        </div>
      </section>
      ${renderRoleModal()}
    `;
  }

  function renderPageExtras(page, session) {
    const extras = [renderWorkflowModal()];
    if (page.activeNav === 'employees') extras.push(renderEmployeesAdminPanel(session));
    if (page.activeNav === 'rbac') extras.push(renderRbacAdminPanel(session));
    if (page._leaveRecords && page._leaveApprover) extras.push(renderLeaveRejectModal());
    if (page._attendanceRecords && page._attendanceApprover) extras.push(renderAttendanceRejectModal());
    if (page._perfRecords) {
      if (session.role === 'employee') extras.push(renderSelfReviewModal(session));
      else if (session.role === 'manager') extras.push(renderManagerReviewModal(page._perfRecords, session));
      else extras.push(renderCycleOverviewModal(page._perfRecords));
    }
    if (page._docRecords) extras.push(renderFulfilDocModal());
    return extras.join('');
  }

  function renderRbacMatrix() {
    const roles = Object.entries(window.ASTERAHR.roles);
    if (!roles.length) return;
    if (!_rbacRole || !window.ASTERAHR.roles[_rbacRole]) _rbacRole = roles[0][0];
    const perms = window.ASTERAHR.permissions[_rbacRole] || {};
    const modules = Object.keys(window.ASTERAHR.store.zeroPermissions());
    const root = document.getElementById('rbac-admin-root');
    if (!root) return;

    root.innerHTML = `
      <div class="module-chip-row" style="margin-bottom:14px">
        ${roles.map(([key, meta]) => `
          <button class="btn ${key === _rbacRole ? 'btn-navy' : 'btn-ghost'} btn-sm" onclick="ModulePage.selectRbacRole('${key}')">${meta.label}</button>
        `).join('')}
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Module</th><th>View</th><th>Create</th><th>Edit</th><th>Delete</th><th>Approve</th></tr>
          </thead>
          <tbody>
            ${modules.map(module => `
              <tr>
                <td>${module}</td>
                ${['view', 'create', 'edit', 'delete', 'approve'].map(action => `
                  <td><input type="checkbox" data-role="${_rbacRole}" data-module="${module}" data-action="${action}" ${perms[module]?.[action] ? 'checked' : ''}/></td>
                `).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div style="display:flex;justify-content:flex-end;margin-top:14px">
        <button class="btn btn-navy btn-sm" onclick="ModulePage.saveRolePerms()">Save Permissions</button>
      </div>
    `;
  }

  function bindPageEnhancements(page, session) {
    if (page.activeNav === 'rbac' && session.role === 'it_admin') renderRbacMatrix();
    if (page._orgChart && page._orgFocusDept) {
      // Auto-open manager's own department
      const match = ORG_TREE.children.find(d =>
        d.dept.toLowerCase().includes(page._orgFocusDept.toLowerCase())
      );
      if (match) setTimeout(() => selectOrgDept(match.id), 80);
    }
  }

  function handleAction(event, actionId) {
    if (event) event.preventDefault();
    const config = actionConfig(actionId);
    if (!config) {
      placeholder(event, actionId);
      return;
    }
    if (config.invoke) {
      config.invoke();
      return;
    }
    _workflowAction = actionId;
    openWorkflow(actionId);
  }

  function openWorkflow(actionId) {
    const config = actionConfig(actionId);
    const modal = document.getElementById('workflow-modal');
    const form = document.getElementById('workflow-form');
    if (!config || !modal || !form) return;

    const tone = config.tone || 'navy';
    modal.querySelector('.admin-modal').className = `modal admin-modal admin-modal-workflow workflow-tone-${tone}`;
    document.getElementById('workflow-eyebrow').textContent = config.badge || 'Workflow';
    document.getElementById('workflow-title').textContent = config.title || 'Workflow action';
    document.getElementById('workflow-description').textContent = config.description || 'Complete this action.';
    document.getElementById('workflow-badge').textContent = config.badge || 'Workflow';
    document.getElementById('workflow-badge-title').textContent = config.buttonLabel || 'Continue';
    document.getElementById('workflow-note-title').textContent = config.noteTitle || 'Workflow action';
    document.getElementById('workflow-note-text').textContent = config.noteText || 'This action will update the demo state.';
    document.getElementById('workflow-submit').textContent = config.buttonLabel || 'Continue';
    form.innerHTML = `
      <div class="admin-form-section">
        <div class="admin-section-head">
          <strong>${config.title || 'Workflow action'}</strong>
          <span>${config.description || 'Complete this workflow.'}</span>
        </div>
        <div class="admin-field-grid">
          ${(config.fields || []).map(renderWorkflowField).join('')}
        </div>
      </div>
    `;
    openModal('workflow-modal');
  }

  function submitWorkflow() {
    const config = actionConfig(_workflowAction);
    const form = document.getElementById('workflow-form');
    if (!config || !form) return;

    const data = collectForm(form);
    const missing = (config.fields || [])
      .filter(field => field.required && !String(data[field.name] || '').trim())
      .map(field => field.label);

    if (missing.length) {
      Toast.error(`${missing[0]} is required.`);
      return;
    }

    try {
      const result = config.submit ? config.submit(data, Session.get()) : null;
      closeModal('workflow-modal');
      _workflowAction = null;
      if (result?.message) Toast.success(result.message);
      if (result?.refresh !== false) init();
    } catch (error) {
      Toast.error(error.message || 'Could not complete this workflow.');
    }
  }

  function init() {
    const pageKey = document.body.dataset.page;
    const page = PAGES[pageKey];
    if (!page) return;

    const session = Shell.init({
      activeNav: page.activeNav,
      allowedRoles: page.allowedRoles,
      pageTitle: page.title,
      pageSub: page.sub,
    });
    if (!session) return;

    const resolvedPage = resolvePageForSession(page, session);

    // Cache leave, attendance, and performance records for partial re-renders
    _currentLeaveRecords = resolvedPage._leaveRecords || null;
    _currentLeaveApprover = resolvedPage._leaveApprover || false;
    _currentAttRecords = resolvedPage._attendanceRecords || null;
    _currentAttApprover = resolvedPage._attendanceApprover || false;
    _currentPerfRecords = resolvedPage._perfRecords || null;
    _currentPerfRole = resolvedPage._perfRole || '';
    _currentPerfSession = resolvedPage._perfSession || null;
    _currentDocRecords = resolvedPage._docRecords || null;
    _currentDocSession = resolvedPage._docSession || null;

    const root = document.getElementById('module-root');
    if (!root) return;

    root.className = `module-page theme-${resolvedPage.theme || 'navy'} layout-${resolvedPage.layout || 'operations'}`;
    root.innerHTML = renderLayout(resolvedPage) + renderPageExtras(resolvedPage, session);
    RBAC.populateHeader(session, resolvedPage.title, resolvedPage.sub);
    bindPageEnhancements(resolvedPage, session);
    document.getElementById('page-content').style.display = 'block';
  }

  function openEmployeeModal() {
    openModal('employee-modal');
  }

  function submitEmployee() {
    const form = document.getElementById('employee-form');
    if (!form) return;
    const data = collectForm(form);
    if (!data.name || !data.email || !data.title || !data.role) {
      Toast.error('Name, email, title, and role are required.');
      return;
    }
    try {
      const user = window.ASTERAHR.store.createEmployee(data);
      closeModal('employee-modal');
      Toast.success(`${user.name} added successfully.`);
      init();
    } catch (error) {
      Toast.error(error.message || 'Could not create employee.');
    }
  }

  function openRoleModal() {
    openModal('role-modal');
  }

  function submitRole() {
    const form = document.getElementById('role-form');
    if (!form) return;
    const data = collectForm(form);
    if (!data.key || !data.label) {
      Toast.error('Role key and label are required.');
      return;
    }
    try {
      const key = window.ASTERAHR.store.createRole(data);
      _rbacRole = key;
      closeModal('role-modal');
      Toast.success(`${data.label} created successfully.`);
      renderRbacMatrix();
    } catch (error) {
      Toast.error(error.message || 'Could not create role.');
    }
  }

  function selectRbacRole(roleKey) {
    _rbacRole = roleKey;
    renderRbacMatrix();
  }

  function saveRolePerms() {
    if (!_rbacRole) return;
    const next = window.ASTERAHR.store.zeroPermissions();
    document.querySelectorAll(`#rbac-admin-root input[type="checkbox"][data-role="${_rbacRole}"]`).forEach(input => {
      const module = input.getAttribute('data-module');
      const action = input.getAttribute('data-action');
      if (next[module]) next[module][action] = input.checked ? 1 : 0;
    });
    window.ASTERAHR.store.updateRolePermissions(_rbacRole, next);
    Toast.success('Permissions saved.');
    renderRbacMatrix();
  }

  function resetAdminData() {
    showConfirm(
      'Reset Persisted Data',
      'This will remove added employees, roles, and edited permissions stored in your browser.',
      () => window.ASTERAHR.store.reset(),
      'danger'
    );
  }

  /* ── Attendance approval ─────────────────────────────── */

  function _attendanceStatusBadge(status, isIssue) {
    if (!isIssue) {
      return `<span style="display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:600;background:rgba(0,135,83,.10);color:#006B42">${status}</span>`;
    }
    const map = {
      'Pending':   { bg: 'rgba(244,180,0,.12)',  color: '#8B5C00' },
      'Open':      { bg: 'rgba(244,180,0,.12)',  color: '#8B5C00' },
      'Approved':  { bg: 'rgba(0,135,83,.10)',   color: '#006B42' },
      'Resolved':  { bg: 'rgba(0,135,83,.10)',   color: '#006B42' },
      'Rejected':  { bg: 'rgba(185,28,28,.10)',  color: '#B91C1C' },
    };
    const s = map[status] || { bg: 'var(--bdr-s)', color: 'var(--ink-s)' };
    return `<span style="display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:600;background:${s.bg};color:${s.color}">${status}</span>`;
  }

  function renderAttendanceTableRows(records, canApprove) {
    return records.map((r, idx) => {
      const isPending = r.issue && (r.status === 'Pending' || r.status === 'Open');
      const detailId = `att-detail-${idx}`;

      const approverRow = (canApprove && isPending) ? `
        <tr id="${detailId}" style="display:none;background:var(--parch)">
          <td colspan="5" style="padding:0">
            <div style="padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:16px;border-top:1px solid var(--bdr-s)">
              <div style="font-size:13px;color:var(--ink-s);line-height:1.6">
                <strong style="color:var(--ink);display:block;margin-bottom:2px">${r.name} · ${r.event}</strong>
                ${r.context}${r.detail ? ` — ${r.detail}` : ''}
              </div>
              <div style="display:flex;gap:8px;flex-shrink:0">
                <button class="btn btn-green btn-sm" onclick="ModulePage.approveAttendance(${idx})">✓ Resolve</button>
                <button class="btn btn-danger btn-sm" onclick="ModulePage.rejectAttendance(${idx})">✕ Reject</button>
              </div>
            </div>
          </td>
        </tr>
      ` : '';

      const clickAttr = (canApprove && isPending)
        ? `onclick="ModulePage.toggleAttendanceRow('${detailId}')" style="cursor:pointer"`
        : '';

      const issueIcon = r.issue ? '⚠' : '✓';
      const rowStyle = r.issue && (r.status === 'Rejected') ? 'opacity:.6' : '';

      return `
        <tr ${clickAttr} style="${rowStyle}">
          <td>${r.name || '—'}</td>
          <td>${issueIcon} ${r.event || '—'}</td>
          <td>${_attendanceStatusBadge(r.status, r.issue)}</td>
          <td>${r.context || '—'}</td>
          <td>${r.dept || 'General'}${(canApprove && isPending) ? ' <span style="font-size:11px;color:var(--ink-mu)">▾</span>' : ''}</td>
        </tr>
        ${approverRow}
      `;
    }).join('');
  }

  function renderAttendanceRejectModal() {
    return `
      <div class="modal-overlay" id="att-reject-modal">
        <div class="modal modal-sm">
          <div class="modal-body" style="padding:28px 26px">
            <div style="font-size:32px;margin-bottom:10px">✕</div>
            <h2 style="font-family:var(--f-serif);font-size:20px;margin-bottom:6px;color:var(--ink)">Reject Correction Request</h2>
            <p style="font-size:13.5px;color:var(--ink-s);line-height:1.6;margin-bottom:18px">
              Provide a reason. This will be saved to the audit log.
            </p>
            <label style="display:block">
              <span style="font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--ink-m);display:block;margin-bottom:6px">Reason for rejection</span>
              <textarea id="att-reject-reason" rows="3" placeholder="e.g. Clock-in data matches biometric records for that period…"
                style="width:100%;padding:10px 12px;border:1.5px solid var(--bdr);border-radius:var(--r);font-family:var(--f-ui);font-size:13.5px;resize:vertical;box-sizing:border-box;color:var(--ink);outline:none"
                onfocus="this.style.borderColor='var(--navy-l)'" onblur="this.style.borderColor='var(--bdr)'"></textarea>
            </label>
          </div>
          <div class="modal-footer" style="padding:14px 26px;border-top:1px solid var(--bdr-s);display:flex;justify-content:flex-end;gap:10px">
            <button class="btn btn-ghost btn-sm" onclick="closeModal('att-reject-modal')">Cancel</button>
            <button class="btn btn-danger btn-sm" onclick="ModulePage.confirmRejectAttendance()">Confirm Rejection</button>
          </div>
        </div>
      </div>
    `;
  }

  let _pendingAttRejectIdx = null;
  let _currentAttRecords = null;
  let _currentAttApprover = false;

  function _refreshAttendanceTable() {
    if (!_currentAttRecords) return;
    const tbody = document.getElementById('att-table-body');
    if (tbody) tbody.innerHTML = renderAttendanceTableRows(_currentAttRecords, _currentAttApprover);
  }

  function toggleAttendanceRow(detailId) {
    const row = document.getElementById(detailId);
    if (!row) return;
    const isOpen = row.style.display !== 'none';
    document.querySelectorAll('[id^="att-detail-"]').forEach(r => { r.style.display = 'none'; });
    if (!isOpen) row.style.display = 'table-row';
  }

  function approveAttendance(idx) {
    const records = window.ASTERAHR?.moduleData?.attendance;
    const session = Session.get();
    if (!records) return;
    const visible = scopeRecords(records, session);
    const record = visible[idx];
    if (!record) return;
    record.status = 'Resolved';
    record.issue = false;
    record.context = `Resolved by ${session.name}`;
    record.resolvedBy = session.name;
    record.resolvedAt = new Date().toISOString();
    window.ASTERAHR.store.persist();
    Session.audit('ATTENDANCE_RESOLVED', `${record.event} for ${record.name} resolved`);
    _notifyUser(record.userId, {
      type: 'attendance',
      title: 'Attendance correction resolved',
      msg: `${record.event} was resolved by ${session.name}.`,
      href: 'modules/attendance/register.html',
      actor: session.name,
    });
    Toast.success(`Correction resolved for ${record.name}.`);
    _refreshAttendanceTable();
  }

  function rejectAttendance(idx) {
    _pendingAttRejectIdx = idx;
    const reasonEl = document.getElementById('att-reject-reason');
    if (reasonEl) reasonEl.value = '';
    openModal('att-reject-modal');
  }

  function confirmRejectAttendance() {
    const reason = document.getElementById('att-reject-reason')?.value?.trim();
    if (!reason) {
      Toast.error('Please enter a reason for the rejection.');
      return;
    }
    const records = window.ASTERAHR?.moduleData?.attendance;
    const session = Session.get();
    if (!records || _pendingAttRejectIdx === null) return;
    const visible = scopeRecords(records, session);
    const record = visible[_pendingAttRejectIdx];
    if (!record) return;
    record.status = 'Rejected';
    record.context = `Rejected: ${reason}`;
    record.rejectedBy = session.name;
    record.rejectedAt = new Date().toISOString();
    record.rejectReason = reason;
    window.ASTERAHR.store.persist();
    Session.audit('ATTENDANCE_REJECTED', `${record.event} for ${record.name} rejected — ${reason}`);
    _notifyUser(record.userId, {
      type: 'attendance',
      title: 'Attendance correction rejected',
      msg: `${record.event} was rejected by ${session.name}: ${reason}`,
      href: 'modules/attendance/register.html',
      actor: session.name,
    });
    closeModal('att-reject-modal');
    Toast.warning(`Correction rejected for ${record.name}.`);
    _pendingAttRejectIdx = null;
    _refreshAttendanceTable();
  }

  /* ── Performance review forms ───────────────────────── */

  let _currentPerfRecords = null;
  let _currentPerfRole = '';
  let _currentPerfSession = null;
  let _pendingManagerReviewIdx = null;

  const RATING_LABELS = ['', 'Needs improvement', 'Developing', 'Meeting expectations', 'Exceeding expectations', 'Outstanding'];

  function _perfStatusBadge(status) {
    const map = {
      'Completed':  { bg: 'rgba(0,135,83,.10)',  color: '#006B42' },
      'Open':       { bg: 'rgba(244,180,0,.12)', color: '#8B5C00' },
      'Upcoming':   { bg: 'rgba(61,76,181,.10)', color: '#3D4CB5' },
      'Submitted':  { bg: 'rgba(0,135,83,.10)',  color: '#006B42' },
      'In review':  { bg: 'rgba(244,180,0,.12)', color: '#8B5C00' },
    };
    const s = map[status] || { bg: 'var(--bdr-s)', color: 'var(--ink-s)' };
    return `<span style="display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:11.5px;font-weight:600;background:${s.bg};color:${s.color}">${status}</span>`;
  }

  function _starRating(name, required = true) {
    return `
      <div class="perf-star-group" style="display:grid;grid-template-columns:repeat(5,minmax(84px,1fr));gap:14px;align-items:start;width:100%">
        ${[1,2,3,4,5].map(n => `
          <label style="cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;min-width:0">
            <input type="radio" name="${name}" value="${n}" ${required ? 'required' : ''} style="position:absolute;opacity:0;width:0;height:0"/>
            <span class="star-btn" data-val="${n}" data-group="${name}"
              onclick="ModulePage._selectStar('${name}',${n})"
              style="font-size:28px;cursor:pointer;transition:transform .1s,color .14s,opacity .14s;user-select:none;filter:grayscale(1);opacity:.4;color:#9aa4b2"
              title="${RATING_LABELS[n]}">★</span>
            <span style="font-size:10px;color:var(--ink-mu);text-align:center;max-width:84px;line-height:1.25">${RATING_LABELS[n]}</span>
          </label>
        `).join('')}
      </div>
    `;
  }

  function _selectStar(groupName, val) {
    document.querySelectorAll(`.star-btn[data-group="${groupName}"]`).forEach(el => {
      const n = parseInt(el.dataset.val);
      el.style.filter = n <= val ? 'grayscale(0)' : 'grayscale(1)';
      el.style.opacity = n <= val ? '1' : '.38';
      el.style.transform = n <= val ? 'scale(1.1)' : 'scale(1)';
      el.style.color = n <= val ? '#f5b301' : '#9aa4b2';
    });
    // Write value into a hidden input for form collection
    let hidden = document.querySelector(`input[name="${groupName}"]`);
    if (!hidden) {
      hidden = document.createElement('input');
      hidden.type = 'hidden';
      hidden.name = groupName;
      document.getElementById('self-review-form')?.appendChild(hidden) ||
      document.getElementById('manager-review-form')?.appendChild(hidden);
    }
    hidden.value = val;
  }

  /* Self-review modal */
  function renderSelfReviewModal(session) {
    return `
      <div class="modal-overlay" id="self-review-modal">
        <div class="modal admin-modal" style="max-width:780px">
          <div class="admin-modal-hero" style="background:linear-gradient(135deg,#1F3C88 0%,#3D4CB5 100%)">
            <div>
              <div class="module-eyebrow" style="color:rgba(255,255,255,.7)">Q2 Review Cycle</div>
              <h2 style="color:#fff">Self Assessment</h2>
              <p style="color:rgba(255,255,255,.8);font-size:13.5px;line-height:1.6">Rate your performance on each goal, then add a summary and development note.</p>
            </div>
            <div class="admin-modal-hero-badge">
              <span>Employee</span>
              <strong>${session?.name || 'You'}</strong>
            </div>
          </div>
          <div class="modal-head admin-modal-head">
            <button class="modal-close" onclick="closeModal('self-review-modal')">✕</button>
          </div>
          <div class="modal-body admin-modal-body" style="max-height:62vh;overflow-y:auto">
            <form id="self-review-form" class="admin-form-grid">
              <div class="admin-form-section">
                <div class="admin-section-head">
                  <strong>Goal 1 — Delivery & Output</strong>
                  <span>How well did you meet your delivery commitments this quarter?</span>
                </div>
                <div style="margin:10px 0 6px">${_starRating('rating_delivery')}</div>
                <label class="admin-field admin-field-lg">
                  <span class="admin-field-label">Evidence / comments</span>
                  <textarea name="comment_delivery" rows="2" placeholder="What did you deliver? Any blockers or highlights?" style="resize:vertical"></textarea>
                </label>
              </div>
              <div class="admin-form-section">
                <div class="admin-section-head">
                  <strong>Goal 2 — Collaboration & Communication</strong>
                  <span>How effectively did you work with your team and stakeholders?</span>
                </div>
                <div style="margin:10px 0 6px">${_starRating('rating_collab')}</div>
                <label class="admin-field admin-field-lg">
                  <span class="admin-field-label">Evidence / comments</span>
                  <textarea name="comment_collab" rows="2" placeholder="How did you contribute to team success?" style="resize:vertical"></textarea>
                </label>
              </div>
              <div class="admin-form-section">
                <div class="admin-section-head">
                  <strong>Goal 3 — Growth & Learning</strong>
                  <span>What did you learn or develop this quarter?</span>
                </div>
                <div style="margin:10px 0 6px">${_starRating('rating_growth')}</div>
                <label class="admin-field admin-field-lg">
                  <span class="admin-field-label">Evidence / comments</span>
                  <textarea name="comment_growth" rows="2" placeholder="New skills, courses, or stretch moments." style="resize:vertical"></textarea>
                </label>
              </div>
              <div class="admin-form-section">
                <div class="admin-section-head">
                  <strong>Overall Summary</strong>
                  <span>Summarise your quarter in your own words.</span>
                </div>
                <label class="admin-field admin-field-lg">
                  <span class="admin-field-label">Summary <span style="color:var(--red)">*</span></span>
                  <textarea name="summary" rows="3" placeholder="What were your biggest wins and your main area to improve?" required style="resize:vertical"></textarea>
                </label>
                <label class="admin-field admin-field-lg" style="margin-top:10px">
                  <span class="admin-field-label">Development focus for next quarter</span>
                  <textarea name="development" rows="2" placeholder="What skill or goal will you focus on next?" style="resize:vertical"></textarea>
                </label>
              </div>
            </form>
          </div>
          <div class="modal-footer admin-modal-footer">
            <div class="admin-modal-foot-copy">
              <strong>Submits your self assessment</strong>
              <span>Recorded in your performance record and shared with your manager.</span>
            </div>
            <div style="display:flex;gap:10px">
              <button class="btn btn-ghost btn-sm" onclick="closeModal('self-review-modal')">Cancel</button>
              <button class="btn btn-navy btn-sm" onclick="ModulePage.submitSelfReview()">Submit Assessment</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* Manager review modal — picks a team member */
  function renderManagerReviewModal(records, session) {
    const pending = records.filter(r => r.status === 'Open' || r.status === 'Upcoming');
    const listHtml = pending.length ? pending.map((r, idx) => `
      <div onclick="ModulePage.openManagerReviewForm(${idx})"
        style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;
               border:1.5px solid var(--bdr);border-radius:var(--r);cursor:pointer;transition:all .14s;margin-bottom:8px"
        onmouseover="this.style.borderColor='var(--navy-l)';this.style.background='rgba(31,60,136,.04)'"
        onmouseout="this.style.borderColor='var(--bdr)';this.style.background=''">
        <div>
          <div style="font-size:13.5px;font-weight:600;color:var(--ink)">${r.name}</div>
          <div style="font-size:12px;color:var(--ink-s);margin-top:2px">${r.item} · ${r.detail || r.context}</div>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          ${_perfStatusBadge(r.status)}
          <span style="color:var(--ink-mu);font-size:13px">→</span>
        </div>
      </div>
    `).join('') : `<p style="color:var(--ink-s);font-size:13.5px;text-align:center;padding:24px 0">No pending reviews for your team right now. ✓</p>`;

    return `
      <div class="modal-overlay" id="manager-review-modal">
        <div class="modal admin-modal" style="max-width:760px">
          <div class="admin-modal-hero" style="background:linear-gradient(135deg,#8B5C00 0%,#C2820A 100%)">
            <div>
              <div class="module-eyebrow" style="color:rgba(255,255,255,.7)">Q2 Review Cycle</div>
              <h2 style="color:#fff">Team Reviews</h2>
              <p style="color:rgba(255,255,255,.8);font-size:13.5px">Select a team member to write their manager review.</p>
            </div>
            <div class="admin-modal-hero-badge">
              <span>Manager</span>
              <strong>${session?.department || 'Your team'}</strong>
            </div>
          </div>
          <div class="modal-head admin-modal-head">
            <button class="modal-close" onclick="closeModal('manager-review-modal')">✕</button>
          </div>
          <div class="modal-body admin-modal-body">
            <p style="font-size:12.5px;color:var(--ink-mu);margin-bottom:14px">${pending.length} pending review${pending.length !== 1 ? 's' : ''} need your input</p>
            ${listHtml}
          </div>
          <div class="modal-footer admin-modal-footer">
            <div class="admin-modal-foot-copy">
              <strong>Manager review</strong>
              <span>Your feedback is shared with the employee after submission.</span>
            </div>
            <button class="btn btn-ghost btn-sm" onclick="closeModal('manager-review-modal')">Close</button>
          </div>
        </div>
      <div class="modal-overlay" id="manager-review-form-modal">
        <div class="modal admin-modal" style="max-width:760px">
          <div class="admin-modal-hero" style="background:linear-gradient(135deg,#8B5C00 0%,#C2820A 100%)">
            <div>
              <div class="module-eyebrow" style="color:rgba(255,255,255,.7)">Manager Review</div>
              <h2 id="mgr-review-name" style="color:#fff">Team Member</h2>
              <p id="mgr-review-role" style="color:rgba(255,255,255,.8);font-size:13px"></p>
            </div>
            <div class="admin-modal-hero-badge"><span>Manager</span><strong>Feedback</strong></div>
          </div>
          <div class="modal-head admin-modal-head">
            <button class="modal-close" onclick="closeModal('manager-review-form-modal')">✕</button>
          </div>
          <div class="modal-body admin-modal-body" style="max-height:60vh;overflow-y:auto">
            <form id="manager-review-form" class="admin-form-grid">
              <div class="admin-form-section">
                <div class="admin-section-head">
                  <strong>Delivery & Output</strong>
                  <span>Your assessment of their delivery this quarter.</span>
                </div>
                <div style="margin:10px 0 6px">${_starRating('mgr_rating_delivery')}</div>
                <label class="admin-field admin-field-lg">
                  <span class="admin-field-label">Manager comments</span>
                  <textarea name="mgr_comment_delivery" rows="2" placeholder="What did they deliver well? Where did they fall short?" style="resize:vertical"></textarea>
                </label>
              </div>
              <div class="admin-form-section">
                <div class="admin-section-head">
                  <strong>Collaboration & Communication</strong>
                  <span>How they work with the team and stakeholders.</span>
                </div>
                <div style="margin:10px 0 6px">${_starRating('mgr_rating_collab')}</div>
                <label class="admin-field admin-field-lg">
                  <span class="admin-field-label">Manager comments</span>
                  <textarea name="mgr_comment_collab" rows="2" placeholder="Team contribution, communication style, reliability." style="resize:vertical"></textarea>
                </label>
              </div>
              <div class="admin-form-section">
                <div class="admin-section-head">
                  <strong>Overall Manager Assessment</strong>
                  <span>Your overall rating and forward-looking feedback.</span>
                </div>
                <div style="margin:10px 0 6px">${_starRating('mgr_rating_overall')}</div>
                <label class="admin-field admin-field-lg">
                  <span class="admin-field-label">Overall feedback <span style="color:var(--red)">*</span></span>
                  <textarea name="mgr_summary" rows="3" placeholder="Summarise their quarter, key strengths, and the main area to develop." required style="resize:vertical"></textarea>
                </label>
                <label class="admin-field admin-field-lg" style="margin-top:10px">
                  <span class="admin-field-label">Recommended development action</span>
                  <textarea name="mgr_development" rows="2" placeholder="What should they focus on next quarter?" style="resize:vertical"></textarea>
                </label>
              </div>
            </form>
          </div>
          <div class="modal-footer admin-modal-footer">
            <div class="admin-modal-foot-copy">
              <strong>Submits your manager review</strong>
              <span>Saved to the employee's performance record.</span>
            </div>
            <div style="display:flex;gap:10px">
              <button class="btn btn-ghost btn-sm" onclick="closeModal('manager-review-form-modal')">Back</button>
              <button class="btn btn-navy btn-sm" onclick="ModulePage.submitManagerReview()">Submit Review</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* HR cycle overview modal */
  function renderCycleOverviewModal(records) {
    const total   = records.length;
    const done    = records.filter(r => r.status === 'Completed' || r.status === 'Submitted').length;
    const open    = records.filter(r => r.status === 'Open').length;
    const pct     = total ? Math.round((done / total) * 100) : 0;
    return `
      <div class="modal-overlay" id="cycle-overview-modal">
        <div class="modal admin-modal" style="max-width:780px">
          <div class="modal-body" style="padding:32px 28px">
            <div style="font-size:36px;margin-bottom:10px">📊</div>
            <h2 style="font-family:var(--f-serif);font-size:22px;margin-bottom:6px;color:var(--ink)">Q2 Cycle Overview</h2>
            <p style="font-size:13.5px;color:var(--ink-s);line-height:1.6;margin-bottom:22px">Live completion status from the performance dataset.</p>
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:20px">
              ${[
                [total, 'Total items', 'var(--ink)'],
                [done,  'Completed',   '#006B42'],
                [open,  'Open',        '#8B5C00'],
              ].map(([v, l, c]) => `
                <div style="text-align:center;padding:14px 10px;background:var(--parch);border-radius:var(--r)">
                  <strong style="display:block;font-size:24px;color:${c}">${v}</strong>
                  <span style="font-size:12px;color:var(--ink-s)">${l}</span>
                </div>
              `).join('')}
            </div>
            <div style="background:var(--bdr-s);border-radius:20px;height:10px;margin-bottom:8px;overflow:hidden">
              <div style="height:100%;width:${pct}%;background:var(--green-l);border-radius:20px;transition:width .4s"></div>
            </div>
            <div style="text-align:center;font-size:13px;color:var(--ink-s)">${pct}% of visible reviews completed</div>
          </div>
          <div class="modal-footer" style="padding:14px 28px;border-top:1px solid var(--bdr-s);display:flex;justify-content:flex-end">
            <button class="btn btn-navy btn-sm" onclick="closeModal('cycle-overview-modal')">Close</button>
          </div>
        </div>
      </div>
    `;
  }

  /* Openers */
  function openSelfReview() {
    const session = Session.get();
    let modal = document.getElementById('self-review-modal');
    if (!modal) {
      document.body.insertAdjacentHTML('beforeend', renderSelfReviewModal(session));
    }
    openModal('self-review-modal');
  }

  function openManagerReview() {
    const session = Session.get();
    const records = scopeRecords(recordsFor('performance'), session);
    let modal = document.getElementById('manager-review-modal');
    if (!modal) {
      document.body.insertAdjacentHTML('beforeend', renderManagerReviewModal(records, session));
    }
    // Refresh the pending list each time
    const pending = records.filter(r => r.status === 'Open' || r.status === 'Upcoming');
    const listEl = document.querySelector('#manager-review-modal .modal-body');
    if (listEl) {
      listEl.innerHTML = `<p style="font-size:12.5px;color:var(--ink-mu);margin-bottom:14px">${pending.length} pending review${pending.length !== 1 ? 's' : ''} need your input</p>` +
        (pending.length ? pending.map((r, idx) => `
          <div onclick="ModulePage.openManagerReviewForm(${idx})"
            style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;
                   border:1.5px solid var(--bdr);border-radius:var(--r);cursor:pointer;transition:all .14s;margin-bottom:8px"
            onmouseover="this.style.borderColor='var(--navy-l)';this.style.background='rgba(31,60,136,.04)'"
            onmouseout="this.style.borderColor='var(--bdr)';this.style.background=''">
            <div>
              <div style="font-size:13.5px;font-weight:600;color:var(--ink)">${r.name}</div>
              <div style="font-size:12px;color:var(--ink-s);margin-top:2px">${r.item} · ${r.detail || r.context}</div>
            </div>
            <div style="display:flex;align-items:center;gap:10px">
              ${_perfStatusBadge(r.status)}
              <span style="color:var(--ink-mu);font-size:13px">→</span>
            </div>
          </div>`).join('') : `<p style="color:var(--ink-s);font-size:13.5px;text-align:center;padding:24px 0">No pending reviews. ✓</p>`);
    }
    openModal('manager-review-modal');
  }

  function openManagerReviewForm(idx) {
    const session = Session.get();
    const records = scopeRecords(recordsFor('performance'), session);
    const pending = records.filter(r => r.status === 'Open' || r.status === 'Upcoming');
    const record = pending[idx];
    if (!record) return;
    _pendingManagerReviewIdx = records.indexOf(record);
    document.getElementById('mgr-review-name').textContent = record.name;
    document.getElementById('mgr-review-role').textContent = `${record.item} · ${record.dept || ''}`;
    // Reset stars
    ['mgr_rating_delivery','mgr_rating_collab','mgr_rating_overall'].forEach(g => {
      document.querySelectorAll(`.star-btn[data-group="${g}"]`).forEach(el => {
        el.style.filter = 'grayscale(1)'; el.style.opacity = '.4'; el.style.transform = 'scale(1)';
      });
    });
    document.getElementById('manager-review-form')?.reset();
    openModal('manager-review-form-modal');
  }

  function openCycleOverview() {
    const session = Session.get();
    const records = scopeRecords(recordsFor('performance'), session);
    let modal = document.getElementById('cycle-overview-modal');
    if (modal) modal.remove(); // always re-render for fresh stats
    document.body.insertAdjacentHTML('beforeend', renderCycleOverviewModal(records));
    openModal('cycle-overview-modal');
  }

  /* Submitters */
  function submitSelfReview() {
    const form = document.getElementById('self-review-form');
    const session = Session.get();
    if (!form || !session) return;

    const data = collectForm(form);
    if (!data.summary?.trim()) {
      Toast.error('Overall summary is required.');
      return;
    }

    const avgRating = Math.round(
      ([+data.rating_delivery, +data.rating_collab, +data.rating_growth].filter(Boolean)
        .reduce((a, b) => a + b, 0)) /
      ([data.rating_delivery, data.rating_collab, data.rating_growth].filter(Boolean).length || 1)
    );

    // Update existing self-assessment record if present, otherwise create
    const all = window.ASTERAHR?.moduleData?.performance;
    if (all) {
      const existing = all.find(r => r.userId === session.userId && r.item === 'Self assessment');
      if (existing) {
        existing.status = 'Completed';
        existing.context = 'Just now';
        existing.detail = 'Submitted successfully';
        existing.selfRatingDelivery = +data.rating_delivery || 0;
        existing.selfRatingCollab = +data.rating_collab || 0;
        existing.selfRatingGrowth = +data.rating_growth || 0;
        existing.selfCommentDelivery = data.comment_delivery || '';
        existing.selfCommentCollab = data.comment_collab || '';
        existing.selfCommentGrowth = data.comment_growth || '';
        existing.selfRating = avgRating;
        existing.selfSummary = data.summary;
        existing.selfDevelopment = data.development;
        existing.submittedAt = new Date().toISOString();
      } else {
        all.unshift({
          userId: session.userId,
          name: session.name,
          item: 'Self assessment',
          status: 'Completed',
          context: 'Just now',
          dept: session.department || 'General',
          selfRatingDelivery: +data.rating_delivery || 0,
          selfRatingCollab: +data.rating_collab || 0,
          selfRatingGrowth: +data.rating_growth || 0,
          selfCommentDelivery: data.comment_delivery || '',
          selfCommentCollab: data.comment_collab || '',
          selfCommentGrowth: data.comment_growth || '',
          detail: 'Submitted successfully',
          selfRating: avgRating,
          selfSummary: data.summary,
          selfDevelopment: data.development,
          submittedAt: new Date().toISOString(),
        });
      }
      // Add a manager step record if not already present
      const mgrStep = all.find(r => r.userId === session.userId && r.item === 'Manager feedback');
      if (!mgrStep) {
        all.push({
          userId: session.userId,
          name: session.name,
          item: 'Manager feedback',
          status: 'Open',
          context: 'Awaiting manager',
          dept: session.department || 'General',
          detail: 'Self review submitted — awaiting manager input',
        });
      }
      window.ASTERAHR.store.persist();
    }

    Session.audit('SELF_REVIEW_SUBMIT', `Q2 self assessment submitted${avgRating ? ` (avg ${avgRating}/5)` : ''}`);
    _notifyManagersForDepartment(session.department, {
      type: 'performance',
      title: 'Self review submitted',
      msg: `${session.name} submitted a self assessment and is awaiting manager feedback.`,
      href: 'modules/performance/appraisals.html',
      actor: session.name,
    });
    closeModal('self-review-modal');
    Toast.success('Self assessment submitted. Your manager has been notified.');
    init();
  }

  function submitManagerReview() {
    const form = document.getElementById('manager-review-form');
    const session = Session.get();
    if (!form || !session) return;

    const data = collectForm(form);
    if (!data.mgr_summary?.trim()) {
      Toast.error('Overall feedback is required.');
      return;
    }

    const all = window.ASTERAHR?.moduleData?.performance;
    if (all && _pendingManagerReviewIdx !== null) {
      const record = all[_pendingManagerReviewIdx];
      if (record) {
        record.status = 'Completed';
        record.context = 'Reviewed just now';
        record.detail = 'Manager review submitted';
        record.mgrRatingDelivery = +data.mgr_rating_delivery || 0;
        record.mgrRatingCollab   = +data.mgr_rating_collab   || 0;
        record.mgrCommentDelivery = data.mgr_comment_delivery || '';
        record.mgrCommentCollab   = data.mgr_comment_collab || '';
        record.mgrRatingOverall  = +data.mgr_rating_overall  || 0;
        record.mgrSummary        = data.mgr_summary;
        record.mgrDevelopment    = data.mgr_development;
        record.mgrReviewedBy     = session.name;
        record.mgrReviewedAt     = new Date().toISOString();
        window.ASTERAHR.store.persist();
      }
    }

    Session.audit('MANAGER_REVIEW_SUBMIT', `Manager review submitted by ${session.name}`);
    if (all && _pendingManagerReviewIdx !== null) {
      const record = all[_pendingManagerReviewIdx];
      _notifyUser(record?.userId, {
        type: 'performance',
        title: 'Manager review submitted',
        msg: `${session.name} completed your performance review feedback.`,
        href: 'modules/performance/appraisals.html',
        actor: session.name,
      });
    }
    closeModal('manager-review-form-modal');
    closeModal('manager-review-modal');
    Toast.success('Manager review submitted successfully.');
    _pendingManagerReviewIdx = null;
    init();
  }

  function renderLeaveRejectModal() {
    return `
      <div class="modal-overlay" id="leave-reject-modal">
        <div class="modal modal-sm">
          <div class="modal-body" style="padding:28px 26px">
            <div style="font-size:32px;margin-bottom:10px">✕</div>
            <h2 style="font-family:var(--f-serif);font-size:20px;margin-bottom:6px;color:var(--ink)">Reject Leave Request</h2>
            <p style="font-size:13.5px;color:var(--ink-s);line-height:1.6;margin-bottom:18px">
              Please give a reason. This will be recorded in the audit log.
            </p>
            <label style="display:block">
              <span style="font-size:11.5px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--ink-m);display:block;margin-bottom:6px">Reason for rejection</span>
              <textarea id="leave-reject-reason" rows="3" placeholder="e.g. Insufficient notice, coverage gap during requested period…"
                style="width:100%;padding:10px 12px;border:1.5px solid var(--bdr);border-radius:var(--r);font-family:var(--f-ui);font-size:13.5px;resize:vertical;box-sizing:border-box;color:var(--ink);outline:none"
                onfocus="this.style.borderColor='var(--navy-l)'" onblur="this.style.borderColor='var(--bdr)'"></textarea>
            </label>
          </div>
          <div class="modal-footer" style="padding:14px 26px;border-top:1px solid var(--bdr-s);display:flex;justify-content:flex-end;gap:10px">
            <button class="btn btn-ghost btn-sm" onclick="closeModal('leave-reject-modal')">Cancel</button>
            <button class="btn btn-danger btn-sm" onclick="ModulePage.confirmRejectLeave()">Confirm Rejection</button>
          </div>
        </div>
      </div>
    `;
  }

  let _pendingRejectIdx = null;
  let _currentLeaveRecords = null;
  let _currentLeaveApprover = false;

  function _refreshLeaveTable() {
    if (!_currentLeaveRecords) return;
    const tbody = document.getElementById('leave-table-body');
    if (tbody) tbody.innerHTML = renderLeaveTableRows(_currentLeaveRecords, _currentLeaveApprover);
  }

  function toggleLeaveRow(detailId) {
    const row = document.getElementById(detailId);
    if (!row) return;
    const isOpen = row.style.display !== 'none';
    // Close all open detail rows first
    document.querySelectorAll('[id^="leave-detail-"]').forEach(r => { r.style.display = 'none'; });
    if (!isOpen) row.style.display = 'table-row';
  }

  function approveLeave(idx) {
    const records = window.ASTERAHR?.moduleData?.leave;
    const session = Session.get();
    if (!records) return;
    const visible = scopeRecords(records, session);
    const record = visible[idx];
    if (!record) return;
    record.status = 'Approved';
    record.detail = `Approved by ${session.name}`;
    record.approvedBy = session.name;
    record.approvedAt = new Date().toISOString();
    window.ASTERAHR.store.persist();
    Session.audit('LEAVE_APPROVED', `${record.type} for ${record.name} approved`);
    _notifyUser(record.userId, {
      type: 'leave',
      title: 'Leave request approved',
      msg: `${record.type} was approved by ${session.name}.`,
      href: 'modules/leave/requests.html',
      actor: session.name,
    });
    Toast.success(`Leave approved for ${record.name}.`);
    _refreshLeaveTable();
  }

  function rejectLeave(idx) {
    _pendingRejectIdx = idx;
    const reasonEl = document.getElementById('leave-reject-reason');
    if (reasonEl) reasonEl.value = '';
    openModal('leave-reject-modal');
  }

  function confirmRejectLeave() {
    const reason = document.getElementById('leave-reject-reason')?.value?.trim();
    if (!reason) {
      Toast.error('Please enter a reason for the rejection.');
      return;
    }
    const records = window.ASTERAHR?.moduleData?.leave;
    const session = Session.get();
    if (!records || _pendingRejectIdx === null) return;
    const visible = scopeRecords(records, session);
    const record = visible[_pendingRejectIdx];
    if (!record) return;
    record.status = 'Rejected';
    record.detail = `Rejected: ${reason}`;
    record.rejectedBy = session.name;
    record.rejectedAt = new Date().toISOString();
    record.rejectReason = reason;
    window.ASTERAHR.store.persist();
    Session.audit('LEAVE_REJECTED', `${record.type} for ${record.name} rejected — ${reason}`);
    _notifyUser(record.userId, {
      type: 'leave',
      title: 'Leave request rejected',
      msg: `${record.type} was rejected by ${session.name}: ${reason}`,
      href: 'modules/leave/requests.html',
      actor: session.name,
    });
    closeModal('leave-reject-modal');
    Toast.warning(`Leave rejected for ${record.name}.`);
    _pendingRejectIdx = null;
    _refreshLeaveTable();
  }

  function placeholder(event, label) {
    if (event) event.preventDefault();
    Toast.info(`${label} will be connected to live workflows next.`);
  }

  return {
    init,
    placeholder,
    handleAction,
    submitWorkflow,
    openEmployeeModal,
    submitEmployee,
    openRoleModal,
    submitRole,
    selectRbacRole,
    saveRolePerms,
    resetAdminData,
    toggleLeaveRow,
    approveLeave,
    rejectLeave,
    confirmRejectLeave,
    toggleAttendanceRow,
    approveAttendance,
    rejectAttendance,
    confirmRejectAttendance,
    openSelfReview,
    openManagerReview,
    openManagerReviewForm,
    openCycleOverview,
    submitSelfReview,
    submitManagerReview,
    _selectStar,
    selectOrgDept,
    openTrainingCatalogue,
    switchTrainingTab,
    enrolCourse,
    bookmarkCourse,
    withdrawCourse,
    markCourseComplete,
    downloadDoc,
    openFulfilDoc,
    confirmFulfilDoc,
  };
})();

window.ModulePage = ModulePage;
