/* Observatory Access — fictional browser-only demonstration.
 * IMPORTANT: No backend, real authentication, export eligibility verification, or real security enforcement.
 * Never use this code to gate sensitive/controlled data in production.
 */
(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const date = () => new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const stations = [
    {id:'uw-rooftop',name:'UW Rooftop Observatory',kind:'Primary receiver',status:'Online',city:'Seattle, WA',sample:true},
    {id:'testbed-b',name:'Example Station B',kind:'Illustrative test environment',status:'Standby',city:'Example only',sample:true},
    {id:'research-c',name:'Example Station C',kind:'Illustrative remote station',status:'Offline',city:'Example only',sample:true}
  ];
  const people = {
    super:{name:'Morgan Chen',initials:'MC',role:'Super Admin',station:null,desc:'Global access across all example stations'},
    stationAdmin:{name:'Priya Shah',initials:'PS',role:'Station Admin',station:'uw-rooftop',desc:'UW Rooftop Observatory'},
    operator:{name:'Alex Rivera',initials:'AR',role:'Operator',station:'uw-rooftop',desc:'UW Rooftop Observatory'},
    viewer:{name:'Sam Taylor',initials:'ST',role:'Viewer',station:'uw-rooftop',desc:'UW Rooftop Observatory'},
    applicant:{name:'Demo Applicant',initials:'DA',role:'Prospective User',station:null,desc:'Not registered — no station or data access'}
  };
  const initialUsers = [
    {id:'u1',alias:'Morgan Chen',role:'Super Admin',station:null,access:'Approved',status:'Active'},
    {id:'u2',alias:'Priya Shah',role:'Station Admin',station:'uw-rooftop',access:'Approved',status:'Active'},
    {id:'u3',alias:'Alex Rivera',role:'Operator',station:'uw-rooftop',access:'Approved',status:'Active'},
    {id:'u4',alias:'Sam Taylor',role:'Viewer',station:'uw-rooftop',access:'Approved',status:'Active'},
    {id:'u5',alias:'Demo Researcher 021',role:'Viewer',station:'testbed-b',access:'Approved',status:'Active'},
    {id:'u6',alias:'Demo Engineer 018',role:'Operator',station:'research-c',access:'Review due',status:'Suspended'}
  ];
  const requestSeed = [
    {id:'REQ-1042',alias:'Demo Researcher 014',role:'Viewer',station:'uw-rooftop',reason:'Fictional research observation access',identity:true,compliance:false,admin:false,state:'Export review'},
    {id:'REQ-1043',alias:'Demo Engineer 021',role:'Operator',station:'testbed-b',reason:'Illustrative device operations',identity:true,compliance:true,admin:false,state:'Admin approval'},
    {id:'REQ-1044',alias:'Demo Analyst 008',role:'Viewer',station:'uw-rooftop',reason:'Fictional data review',identity:false,compliance:false,admin:false,state:'Identity review'},
    {id:'REQ-1040',alias:'Demo Applicant 011',role:'Operator',station:'uw-rooftop',reason:'Illustrative capture access',identity:false,compliance:false,admin:false,state:'Identity denied',closedReason:'Identity verification could not be completed using the approved process.',closedStage:'Identity verification'},
    {id:'REQ-1041',alias:'Demo Analyst 012',role:'Viewer',station:'testbed-b',reason:'Illustrative historical results access',identity:true,compliance:false,admin:false,state:'Export denied',closedReason:'Authorized compliance review did not approve access to the requested resource scope.',closedStage:'Export compliance'},
  ];
  const invitationSeed = [
    {id:'INV-0301',code:'DEMO-UW-VIEW-301',alias:'Demo Researcher 033',email:'researcher@university.test',role:'Viewer',station:'uw-rooftop',by:'Morgan Chen',expiresAt:new Date(Date.now()+7*86400000).toISOString(),status:'Pending'},
    {id:'INV-0300',code:'DEMO-EXPIRED-300',alias:'Demo Applicant 030',email:'expired@university.test',role:'Operator',station:'testbed-b',by:'Morgan Chen',expiresAt:new Date(Date.now()-86400000).toISOString(),status:'Pending'},
    {id:'INV-0299',code:'DEMO-REVOKED-299',alias:'Demo Applicant 029',email:'revoked@university.test',role:'Viewer',station:'uw-rooftop',by:'Morgan Chen',expiresAt:new Date(Date.now()+3*86400000).toISOString(),status:'Revoked'}
  ];
  const alertSeed = [
    {id:1,level:'High',title:'Cross-station access denied',detail:'Fictional operator attempted to read another station’s restricted results.',station:'uw-rooftop',type:'Access denied',time:'10:42 AM',ack:false},
    {id:2,level:'Medium',title:'Elevated sign-in failures',detail:'Demo rule triggered after consecutive failed sign-in attempts.',station:'uw-rooftop',type:'Authentication',time:'09:18 AM',ack:false},
    {id:3,level:'Medium',title:'Authorization review due',detail:'Synthetic authorization scope requires a periodic review.',station:'research-c',type:'Compliance',time:'Yesterday',ack:false}
  ];
  const state = {role:'super',page:'overview',currentDecision:null,decisionId:204,decisions:[{id:'DEC-0201',time:'10:42 AM',outcome:'Denied',title:'Cross-station request blocked',reason:'Requested station falls outside the fictional operator’s assignment.',next:'Use your assigned station or contact a station administrator.',station:'uw-rooftop'}, {id:'DEC-0202',time:'09:18 AM',outcome:'Review',title:'Repeated sign-in failures detected',reason:'Mock sign-in threshold exceeded.',next:'Security reviewer should inspect the fictional alert.',station:'uw-rooftop'}, {id:'DEC-0203',time:'Yesterday',outcome:'Approved',title:'Sample viewer access granted',reason:'All demonstration review stages were marked complete.',next:'The approved role and station scope are now visible in the user directory.',station:'testbed-b'}],station:'uw-rooftop',users:structuredClone(initialUsers),invitations:structuredClone(invitationSeed),nextInvite:302,requests:structuredClone(requestSeed),alerts:structuredClone(alertSeed),audit:[
    {time:'10:42 AM',user:'Demo operator',action:'BLOCKED: cross-station data request',station:'uw-rooftop',result:'Denied'},
    {time:'09:18 AM',user:'Policy simulator',action:'Login anomaly rule triggered',station:'uw-rooftop',result:'Alert'},
    {time:'Yesterday',user:'Demo administrator',action:'User station assignment reviewed',station:'testbed-b',result:'Recorded'}
  ],capture:{'uw-rooftop':true,'testbed-b':false,'research-c':false},demoMode:true,nextId:1045,alertId:4};
  const pageNames = {overview:'Overview',stations:'Stations',register:'Request Access',invites:'Invitations',users:'User Directory',requests:'Access Requests',compliance:'Compliance Status',testing:'Security & Access Testing',security:'Security Alerts',audit:'Audit Logs',policy:'Access Policy'};
  const navIcons = {overview:'◫',stations:'⌁',register:'＋',invites:'✉',users:'♙',requests:'▤',compliance:'▣',testing:'◉',security:'◇',audit:'≡',policy:'⊞'};
  const stationName = id => stations.find(s=>s.id===id)?.name || 'All stations';
  const actor = () => people[state.role];
  const global = () => state.role==='super';
  const isApplicant = () => state.role==='applicant';
  const assigned = id => global() || id===actor().station;
  const viewStations = () => global()?stations:stations.filter(s=>s.id===actor().station);
  const canManage = id => (global() || state.role==='stationAdmin'&&actor().station===id);
  const canOperate = id => assigned(id) && ['super','stationAdmin','operator'].includes(state.role);
  const canView = id => assigned(id);
  const isAdmin = () => ['super','stationAdmin'].includes(state.role);
  const currentStation = () => viewStations().find(s=>s.id===state.station) || viewStations()[0] || stations[0];
  const btn = (label, action, extra='', type='button') => `<button type="${type}" class="button ${extra}" data-action="${action}">${label}</button>`;
  const badge = (label,tone='') => `<span class="status-badge ${tone}">${esc(label)}</span>`;
  const tone = s => ({'Active':'green','Approved':'green','Online':'green','Acknowledged':'green','Allowed':'green','Open':'red','Suspended':'red','Denied':'red','Sponsor denied':'red','Expired':'red','Revoked':'red','Used':'blue','Pending':'orange','Sponsorship review':'orange','Identity denied':'red','Export denied':'red','Admin denied':'red','High':'red','Review due':'orange','Medium':'orange','Standby':'orange','Offline':'red','Admin approval':'blue','Export review':'orange','Identity review':'orange'}[s]||'');
  const panel = (title,description,body,side='') => `<section class="panel"><header class="panel-head"><div><h2>${title}</h2>${description?`<p class="panel-description">${description}</p>`:''}</div>${side}</header>${body}</section>`;
  const metric = (label,value,foot) => `<div class="metric"><div class="metric-label"><span class="metric-accent"></span>${label}</div><div class="metric-value">${value}</div><div class="metric-foot">${foot}</div></div>`;
  const top = (eyebrow,title,description,actions='') => `<div class="page-header"><div><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p class="subhead">${description}</p></div><div class="header-controls">${actions}</div></div>`;
  const selectStation = () => global()?`<select class="select-box" id="station-selector" aria-label="Choose station">${stations.map(s=>`<option value="${s.id}" ${state.station===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select>`:`<span class="status-badge blue">Assigned station only</span>`;
  const log = (action, station, result='Recorded') => {state.audit.unshift({time:date(),user:actor().name,action,station:station||'Global',result}); if(state.audit.length>70)state.audit.length=70;};
  const closed = r => ['Approved','Sponsor denied','Identity denied','Export denied','Admin denied','Denied'].includes(r.state);
  const inviteStatus = inv => inv.status==='Revoked'?'Revoked':inv.status==='Used'?'Used':new Date(inv.expiresAt).getTime()<=Date.now()?'Expired':'Pending';
  const availableInvitations = () => state.invitations.filter(i=>global()||i.station===actor().station);
  const fictionalEmail = v => /^[^@\s]+@[^@\s]+\.(test|example)$/i.test(v);
  // Persistent, accessible decision surface. This is simulated and never makes a real compliance determination.
  function report(outcome,title,reason,next='Review the event details below.',station=null){
    const entry={id:'DEC-'+String(state.decisionId++).padStart(4,'0'),time:date(),outcome,title,reason,next,station:station||actor().station||'Global'};
    state.decisions.unshift(entry);
    state.decisions=state.decisions.slice(0,80);
    state.currentDecision=entry;
    return entry;
  }
  const decisionNotice = () => {
    const d=state.currentDecision;
    if(!d)return '';
    const sev=d.outcome==='Denied'?'denied':d.outcome==='Approved'?'approved':d.outcome==='Review'?'review':'info';
    const symbol=sev==='denied'?'×':sev==='approved'?'✓':sev==='review'?'!':'i';
    return `<section class="decision-banner ${sev}" aria-label="Latest simulated decision" tabindex="-1" role="${sev==='denied'?'alert':'status'}" aria-live="${sev==='denied'?'assertive':'polite'}"><div class="decision-mark" aria-hidden="true">${symbol}</div><div class="decision-banner-body"><div class="decision-eyebrow">SIMULATED DECISION • ${esc(d.id)} • ${esc(d.time)}</div><h2>${esc(d.outcome.toUpperCase())}: ${esc(d.title)}</h2><p class="decision-reason"><strong>Reason:</strong> ${esc(d.reason)}</p><p class="decision-next"><strong>Next step:</strong> ${esc(d.next)}</p></div><div class="decision-banner-actions">${isAdmin()?'<button class="button" data-action="open-audit">View audit log</button>':''}<button class="decision-dismiss" data-action="dismiss-decision" aria-label="Dismiss latest decision">×</button></div></section>`;
  };
  const deny = (reason,station) => {
    const msg=reason||'Action blocked by demo authorization policy.';
    state.alerts.unshift({id:state.alertId++,level:'High',title:'Unauthorized operation blocked',detail:msg,station:station||actor().station||'Global',type:'Access denied',time:date(),ack:false});
    log('BLOCKED: '+msg,station,'Denied');
    report('Denied','Access request blocked',msg,'Contact a station administrator or compliance reviewer as appropriate.',station);
    render();
  };
  const navItems = () => isApplicant()?['register','requests','policy']:['overview','stations','register',...(isAdmin()?['users','invites']:[]),'requests',...(isAdmin()?['compliance','security','audit',...(state.demoMode?['testing']:[])]:[]),'policy'];
  const renderNav = () => {$('#main-nav').innerHTML=navItems().map(k=>`<button class="${state.page===k?'active':''}" data-page="${k}"><span class="nav-icon" aria-hidden="true">${navIcons[k]}</span><span class="nav-label">${k==='requests'&&!isAdmin()?'My Requests':pageNames[k]}</span>${k==='requests'&&state.requests.some(r=>!closed(r)&&assigned(r.station)&&(isAdmin()||r.requestedBy===state.role))?`<span class="nav-dot">${state.requests.filter(r=>!closed(r)&&assigned(r.station)&&(isAdmin()||r.requestedBy===state.role)).length}</span>`:''}</button>`).join('');};
  const updatePersona = () => {const p=actor();$('#persona').value=state.role;$('#persona-avatar').textContent=p.initials;$('#breadcrumb-page').textContent=state.page==='requests'&&!isAdmin()?'My Requests':pageNames[state.page];const toggle=$('#demo-toggle');if(toggle){toggle.hidden=!isAdmin();const box=$('#demo-mode');box.checked=state.demoMode;}};
  const drawChart = () => {
    const predicted=Array.from({length:49},(_,i)=>[40+i*11,50+((i/48)*117)+12*Math.sin(i/7)]);
    const observed=Array.from({length:49},(_,i)=>[40+i*11,54+((i/48)*115)+9*Math.sin(i/7)+2*Math.sin(i*1.7)]);
    const path=p=>'M'+p.map(([x,y])=>`${x.toFixed(1)},${y.toFixed(1)}`).join(' L');
    return `<div class="chart-area"><div class="chart-labels"><span>Doppler offset (kHz)</span><div class="chart-legend"><span><i class="legend-pred"></i>Predicted</span><span><i class="legend-obs"></i>Observed</span></div></div><svg role="img" aria-label="Illustrative predicted and observed Doppler curves" viewBox="0 0 600 235" preserveAspectRatio="none"><rect x="38" y="14" width="533" height="176" fill="#fbfdfe"/>${[14,58,102,146,190].map(y=>`<line x1="38" y1="${y}" x2="571" y2="${y}" stroke="#e6edf2" stroke-dasharray="3 4"/>`).join('')}<line x1="38" y1="14" x2="38" y2="190" stroke="#cbd6df"/><line x1="38" y1="190" x2="571" y2="190" stroke="#cbd6df"/><path d="${path(predicted)}" fill="none" stroke="#1d798a" stroke-width="3"/><path d="${path(observed)}" fill="none" stroke="#e6a15c" stroke-width="2.5" stroke-dasharray="6 5"/>${['+20','+10','0','−10','−20'].map((t,i)=>`<text x="3" y="${19+i*44}" font-size="10" fill="#8b9bac">${t}</text>`).join('')}${['0','1','2','3','4','5'].map((t,i)=>`<text x="${39+i*105}" y="211" font-size="10" fill="#8b9bac">${t}m</text>`).join('')}</svg></div><div class="chart-foot">Simulated measurement overlay · Not derived from any actual satellite or ground-station feed</div>`;
  };
  function overview(){
    const station=currentStation();
    const relevantAlerts=state.alerts.filter(a=>assigned(a.station)&&!a.ack);
    const active=global()?stations.filter(s=>s.status==='Online').length:station.status==='Online'?1:0;
    const openRequests=state.requests.filter(r=>assigned(r.station)&&!closed(r)).length;
    return top('CONTROL CENTER',global()?'Observatory overview':`${actor().role} dashboard`,global()?'A global view of users, stations, requests, and governance activity.':'Station-restricted workspace with fictional receiver data and simulated access checks.',selectStation())+
    `<div class="cards">${metric('Accessible stations',global()?stations.length:1,global()?'Global administrative scope':'Restricted to assigned station')}${metric('Stations online',active,'Illustrative status only')}${metric('Pending requests',isAdmin()?openRequests:'—',isAdmin()?'Require staged review':'Only administrators can approve')}${metric('Open security alerts',isAdmin()?relevantAlerts.length:'—',isAdmin()?'Mock monitoring signals':'Alerts not visible to this role')}</div>`+
    `<div class="columns">${panel('Satellite observations','Predicted versus observed Doppler • Placeholder data',drawChart(),'<span class="placeholder-badge">SIMULATED DATA</span>')}${panel('Station status',`Viewing: ${esc(station.name)}`,`<div class="panel-body"><div class="info-rows"><div class="info-row"><span>Monitoring node</span><strong>${esc(station.kind)}</strong></div><div class="info-row"><span>Connection</span>${badge(station.status,tone(station.status))}</div><div class="info-row"><span>Capture state</span>${badge(state.capture[station.id]?'Running':'Stopped',state.capture[station.id]?'green':'orange')}</div><div class="info-row"><span>Access scope</span><strong>${global()?'All stations':'Assigned station only'}</strong></div><div class="info-row"><span>Account role</span><strong>${esc(actor().role)}</strong></div></div><div style="margin-top:17px" class="inline-buttons">${canOperate(station.id)?btn(state.capture[station.id]?'Stop capture':'Start capture','toggle-capture','primary'):btn('Receiver controls unavailable','viewer-deny','','button')}${state.demoMode&&isAdmin()?btn('Test access rules','test-guardrail'):''}</div><p class="narrow-note">Capture controls change demo UI state only; no RF hardware is connected.</p></div>`)}</div>`+
    `<div class="columns">${panel('Permission snapshot','What this persona can do',`<div class="panel-body"><p class="subhead" style="margin-bottom:9px">${esc(actor().desc)}</p><div class="capabilities">${['View permitted results','Operate authorized station','Manage station users','Manage every station','Review global audit logs'].map((label,i)=>{const good=[true,canOperate(station.id),canManage(station.id),global(),global()][i];return `<span class="cap ${good?'allowed':'denied'}">${good?'✓':'×'} ${label}</span>`}).join('')}</div></div>`)}${panel('Governance checklist','Prerequisites for access',`<div class="panel-body"><div class="info-rows"><div class="info-row"><span>Identity</span>${badge('Mock verified','green')}</div><div class="info-row"><span>Export authorization</span>${badge('Fictional approval','green')}</div><div class="info-row"><span>Role permission</span>${badge(actor().role,'blue')}</div><div class="info-row"><span>Station assignment</span>${badge(global()?'Global':'Scoped','blue')}</div></div><p class="narrow-note">These labels are seeded test data, not verified facts or clearances.</p></div>`)}</div>`;
  }
  function stationsPage(){
    const rows=viewStations().map(s=>`<tr><td><div class="station-meta"><div class="station-icon">⌁</div><div><div class="row-name">${esc(s.name)}</div><div class="row-sub">${esc(s.kind)}</div></div></div></td><td>${badge(s.status,tone(s.status))}</td><td>${badge(state.capture[s.id]?'Running':'Stopped',state.capture[s.id]?'green':'orange')}</td><td>${global()?'Global access':esc(actor().role)}</td><td class="right-align"><button class="button small" data-action="focus-station" data-station="${s.id}">Open station →</button></td></tr>`).join('');
    return top('STATIONS','Station access',global()?'The Control Tower can navigate every station. All station names and RF signals here are illustrative.':'Only your assigned station is visible in the application.')+
    panel('Authorized station directory','Server-side scoping is required for the real application.',`<div class="table-wrap"><table class="table"><thead><tr><th>Station</th><th>Status</th><th>Capture</th><th>Your scope</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`)+
    `<div style="margin-top:17px" class="callout">The example contains three hypothetical stations to demonstrate access isolation. They do not represent three confirmed UW installations. Production API queries must filter by the authorized station IDs.</div>`;
  }
  function usersPage(){
    if(!isAdmin())return top('ACCESS DENIED','User management is restricted','This demo role cannot view or change user accounts.');
    const peopleInScope=state.users.filter(u=>global()||u.station===actor().station);
    const table=peopleInScope.map(u=>`<tr><td><span class="row-name">${esc(u.alias)}</span><div class="row-sub">${esc(u.id)}</div></td><td>${badge(u.role,'blue')}</td><td>${esc(stationName(u.station))}</td><td>${badge(u.access,tone(u.access))}</td><td>${badge(u.status,tone(u.status))}</td><td>${canManage(u.station)&&u.role!=='Super Admin'&&(global()||u.role!=='Station Admin')?`<button class="button small" data-action="manage-user" data-id="${u.id}">Manage</button>`:''}</td></tr>`).join('');
    return top('PEOPLE & PERMISSIONS','User directory','User accounts are fictional. Invite applicants, then grant station access only after approval.',btn('＋ Invite user','new-invite','primary'))+
    panel('Registered users',`${peopleInScope.length} fictional accounts visible to ${esc(actor().role)}`,`<div class="table-wrap"><table class="table"><thead><tr><th>User</th><th>Role</th><th>Station scope</th><th>Authorization</th><th>Account</th><th></th></tr></thead><tbody>${table}</tbody></table></div>`)+
    `<div class="callout" style="margin-top:17px">Role assignment alone never grants controlled-data access. The backend must require a valid, approved export authorization applicable to the requested resource, along with identity and station checks.</div>`;
  }
  function invitesPage(){
    if(!isAdmin())return top('ACCESS DENIED','Invitations restricted','Only station administrators and the Control Tower can create sample invitations.');
    const invitations=availableInvitations();
    const rows=invitations.map(i=>`<tr><td><strong>${esc(i.alias)}</strong><div class="row-sub">${esc(i.email)} · ${esc(i.id)}</div></td><td>${badge(i.role,'blue')}</td><td>${esc(stationName(i.station))}</td><td>${badge(inviteStatus(i),tone(inviteStatus(i)))}</td><td>${esc(new Date(i.expiresAt).toLocaleDateString())}</td><td class="right-align">${inviteStatus(i)==='Pending'?`<div class="inline-buttons"><button class="button small" data-action="copy-invite" data-id="${esc(i.id)}">Copy code</button><button class="button small danger" data-action="revoke-invite" data-id="${esc(i.id)}">Revoke</button></div>`:'—'}</td></tr>`).join('');
    return top('ONBOARDING ADMINISTRATION','Invitations','Issue station-scoped invitations. Delivery by email is not implemented; codes shown here are fake.',btn('＋ Invite user','new-invite','primary'))+
      `<div class="notice-card"><strong>Invitations are not access grants.</strong><p>They establish sponsorship and the requested role/station. The applicant must still pass identity verification, independent export-compliance review, and administrative approval.</p></div>`+
      panel('Invitation register',`${invitations.length} synthetic records visible in your station scope`, `<div class="table-wrap"><table class="table"><thead><tr><th>Applicant</th><th>Proposed role</th><th>Station</th><th>Status</th><th>Expires</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>`)+
      `<div class="callout" style="margin-top:17px">To demo the applicant experience, switch <b>View as</b> to <b>Prospective User</b> and enter an invitation code in <b>Request Access</b>. Invalid, expired, used, or revoked codes are rejected.</div>`;
  }
  function registerPage(){
    const choices=isApplicant()||global()?stations:viewStations();
    const applicantNotice=isApplicant()?`<div class="applicant-gate"><strong>No station access yet</strong><span>You're viewing the pre-access registration experience. You cannot open station results or operate receivers until a request is fully approved.</span></div>`:'';
    return top('ONBOARDING','Request access','Submit a fictional application. An invitation allows the application to skip sponsorship review — never identity or export-compliance checks.')+
      applicantNotice+
      `<div class="notice-card"><strong>Do not enter real personal or immigration information.</strong><p>Use only invented aliases and an email ending in <code>.test</code> or <code>.example</code>. This page does not request citizenship or residency documentation or perform identity verification.</p></div>`+
      `<div class="onboarding-layout"><section class="panel onboarding-form"><div class="panel-head"><div><h2>Registration form</h2><p class="panel-description">Invited or self-requested access • all fields are sample-only</p></div>${badge('No access granted','orange')}</div><div class="panel-body"><form id="request-form">
        <div class="field"><label for="request-invite">Invitation code <span class="field-optional">(optional)</span></label><input id="request-invite" name="invite" maxlength="48" placeholder="DEMO-UW-VIEW-301" autocomplete="off" aria-describedby="invite-explain"/><div class="field-hint" id="invite-explain">With a valid code, the requested role and station must match the invitation. Without a code, an admin must first approve sponsorship.</div></div>
        ${state.demoMode?`<div class="inline-buttons" style="margin-bottom:19px"><button class="button small" type="button" data-action="fill-sample-invite">Use sample invitation</button><button class="button small" type="button" data-action="fill-expired-invite">Try expired invitation</button></div>`:''}
        <div class="form-grid"><div class="field"><label for="request-alias">Fictional applicant alias</label><input id="request-alias" name="alias" minlength="5" maxlength="48" required placeholder="Demo Researcher 033" autocomplete="off"/></div><div class="field"><label for="request-email">Example email (.test / .example)</label><input id="request-email" name="email" type="email" maxlength="100" required placeholder="researcher@university.test" autocomplete="off"/></div></div>
        <div class="field"><label for="request-org">Institution / affiliation (demo)</label><select id="request-org" name="organization"><option value="UW (fictional demo)">UW (fictional demo)</option><option value="Daintree (fictional demo)">Daintree (fictional demo)</option><option value="Other example organization">Other example organization</option></select></div>
        <div class="form-grid"><div class="field"><label for="request-role">Requested role</label><select id="request-role" name="role"><option>Viewer</option><option>Operator</option><option>Station Admin</option></select><span class="field-hint">Station Admin requires a Super Admin invitation.</span></div><div class="field"><label for="request-station">Requested station</label><select id="request-station" name="station">${choices.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></div></div>
        <div class="field"><label for="request-reason">Business / research justification</label><textarea id="request-reason" name="reason" maxlength="220" rows="3" required placeholder="Example: Review simulated historical Doppler plots"></textarea></div>
        <div class="form-disclaimer"><strong>Registration ≠ authorization.</strong> This only creates a pending browser-demo request; no real account, legal decision, email, or password is created.</div>
        <div class="modal-actions"><button class="button primary" type="submit">Submit sample access request →</button></div>
      </form></div></section>
      <section class="panel onboarding-steps"><div class="panel-head"><div><h2>What happens next?</h2><p class="panel-description">Access is denied by default at every gate.</p></div></div><div class="panel-body"><div class="vertical-flow">
        <div class="vertical-step"><span>01</span><div><strong>Sponsorship / invitation</strong><p>Validate an admin-issued invitation or obtain station-admin sponsorship.</p></div></div>
        <div class="vertical-step"><span>02</span><div><strong>Identity review</strong><p>Handled by designated verification personnel outside this dashboard.</p></div></div>
        <div class="vertical-step"><span>03</span><div><strong>Export compliance decision</strong><p>Independently verify permitted technology/data scope. Approval may be denied.</p></div></div>
        <div class="vertical-step"><span>04</span><div><strong>Administrative approval</strong><p>Authorize the requested role and assigned station; activate only after all checks pass.</p></div></div>
      </div><div class="tip-card"><strong>For the live demo</strong><p>Switch to <b>Super Admin → Invitations</b> to issue a code, then <b>Prospective User → Request Access</b> to submit it. Return to <b>Access Requests</b> to walk through positive and negative decisions.</p></div></div></section></div>`;
  }
  function requestsPage(){
    const visible=state.requests.filter(r=>isAdmin()?assigned(r.station):r.requestedBy===state.role);
    const table=visible.length?visible.map(r=>requestCard(r)).join(''):`<div class="empty"><strong>No requests for this station</strong>Submitted sample requests will appear here.</div>`;
    return top('REGISTRATION & APPROVAL',isAdmin()?'Access requests':'My access requests',isAdmin()?'Review requests by stage: registration → sponsorship → identity → compliance → station approval. All approvals here are simulated.':'See only requests submitted by this fictional account. Administrators perform the staged reviews.',btn('＋ New request','create-request','primary'))+
    `<div class="notice-card"><strong>Compliance review is separate from admin privileges.</strong><p>A Station Admin or Super Admin cannot waive export restrictions. In this demo, identity and compliance decisions can be <em>simulated</em> by the Control Tower for illustration only; in production, they must come from a designated verification and export-compliance authority.</p></div>`+
    panel('Approval path','Every stage must complete before access becomes active.',`<div class="panel-body"><div class="request-flow"><div class="flow-step"><span class="flow-num">1</span><b>Registration</b><span>Request an authorized role and station.</span></div><div class="flow-step"><span class="flow-num">2</span><b>Sponsorship</b><span>Invitation or admin validates operational need.</span></div><div class="flow-step"><span class="flow-num">3</span><b>Identity verification</b><span>External, designated reviewer.</span></div><div class="flow-step"><span class="flow-num">4</span><b>Export compliance</b><span>Independent authorization decision.</span></div><div class="flow-step"><span class="flow-num">5</span><b>Admin approval</b><span>Grant role + station; audit the decision.</span></div></div></div>`)+
    `<div style="height:17px"></div>`+panel('Requests in your scope',`${visible.length} fictional request(s)`, `<div class="panel-body">${table}</div>`);
  }
  const requestState=r=>closed(r)?r.state:r.admin?'Approved':r.compliance?'Admin approval':r.identity?'Export review':r.sponsor===false?'Sponsorship review':'Identity review';
  function requestCard(r){
    const step=[r.sponsor!==false,r.identity,r.compliance,r.admin];
    const isDone=closed(r);
    let actions='';
    if(r.sponsor===false && !isDone && canManage(r.station))actions=`<button class="button primary small" data-action="approve-sponsor" data-id="${esc(r.id)}">Approve sponsorship</button><button class="button small danger" data-action="reject-stage" data-stage="sponsor" data-id="${esc(r.id)}">Deny sponsorship</button>`;
    if(r.sponsor!==false && global() && !isDone){
      if(!r.identity)actions=`<button class="button small" data-action="mock-identity" data-id="${esc(r.id)}">Verify identity (demo)</button><button class="button small danger" data-action="reject-stage" data-stage="identity" data-id="${esc(r.id)}">Reject identity</button>`;
      else if(!r.compliance)actions=`<button class="button small" data-action="mock-compliance" data-id="${esc(r.id)}">Authorize access (demo)</button><button class="button small danger" data-action="reject-stage" data-stage="compliance" data-id="${esc(r.id)}">Deny compliance</button>`;
    }
    if(r.compliance && !r.admin && canManage(r.station) && (global()||r.role!=='Station Admin') && !isDone)actions=`<button class="button primary small" data-action="approve-request" data-id="${esc(r.id)}">Approve station access</button><button class="button small danger" data-action="reject-stage" data-stage="admin" data-id="${esc(r.id)}">Deny admin approval</button>`;
    if(!isDone && isAdmin() && canManage(r.station))actions+=`<button class="button small" data-action="try-early-approval" data-id="${esc(r.id)}">Test early approval</button>`;
    const resolution=isDone&&r.state!=='Approved'&&r.closedReason?`<div class="request-denial"><strong>${esc(r.state)} — ${esc(r.closedStage||'Review')}</strong><p>${esc(r.closedReason)}</p><span>Access remains blocked. Submit a new request or follow the reviewer’s instructions.</span></div>`:'';
    return `<div class="req-row"><div class="req-row-main"><div class="req-title">${esc(r.alias)} <span class="muted" style="font-weight:400;font-size:11px">${esc(r.id)}</span></div><div class="req-meta">${esc(r.role)} role · ${esc(stationName(r.station))} · ${r.invitationId?'Invitation: '+esc(r.invitationId):'Self-request / sponsorship review'}<br>${esc(r.reason)}${r.organization?'<br>Affiliation: '+esc(r.organization):''}</div><div class="req-progress"><span class="progress-item done">✓ Requested</span>${['Sponsorship','Identity','Compliance','Admin approval'].map((txt,i)=>`<span class="progress-item ${step[i]?'done':!isDone&&i===step.findIndex(x=>!x)?'current':''}">${step[i]?'✓ ':''}${txt}</span>`).join('')}</div>${resolution}</div><div class="req-actions">${badge(r.state,tone(r.state))}${actions||'<span class="narrow-note">No further action in this stage</span>'}</div></div>`;
  }
  function testingPage(){
    const scenarios=[
      ['allow-view','Permitted results view','Approved user reads results from their assigned station.','Approved'],
      ['deny-viewer','Viewer receiver control','Viewer attempts to start a capture session.','Denied'],
      ['deny-cross','Cross-station access','Operator attempts to read another station.','Denied'],
      ['deny-unverified','Identity not verified','User requests controlled results before identity verification.','Denied'],
      ['deny-export','Export authorization denied','A compliance decision does not cover the requested data.','Denied'],
      ['deny-pending','Administrative approval pending','Request has identity and export review but no station approval.','Denied'],
      ['deny-expired','Authorization expired','Previously approved authorization is now outside its validity window.','Denied'],
      ['deny-suspended','Suspended account','A suspended account attempts to access the dashboard API.','Denied']
    ];
    const cards=scenarios.map(([id,title,desc,result])=>`<article class="scenario-card"><div class="scenario-title"><h3>${esc(title)}</h3>${badge(result,tone(result))}</div><p>${esc(desc)}</p><button class="button small" data-action="scenario" data-id="${id}">Run simulation <span aria-hidden="true">→</span></button></article>`).join('');
    const visible=state.decisions.filter(d=>global()||assigned(d.station));
    const history=visible.length?visible.map(d=>`<article class="history-record ${d.outcome==='Denied'?'denied':d.outcome==='Approved'?'approved':d.outcome==='Review'?'review':'info'}"><div class="history-top"><strong>${esc(d.title)}</strong>${badge(d.outcome,tone(d.outcome))}</div><div class="history-meta">${esc(d.id)} · ${esc(d.time)} · ${esc(stationName(d.station))}</div><p><b>Reason:</b> ${esc(d.reason)}</p><p><b>Next:</b> ${esc(d.next)}</p></article>`).join(''):'<p>No decisions in your assigned scope.</p>';
    if(!isAdmin()||!state.demoMode)return top('ACCESS DENIED','Testing tools unavailable','Enable Demo Mode as an administrator to use the fictional scenarios.');
    return top('DEMO MODE ONLY','Security & Access Testing','Run fictional allow/deny scenarios for stakeholder demonstrations. These controls are excluded from the proposed production dashboard.')+
      `<div class="notice-card"><strong>Scenario results are simulated.</strong><p>Real denial and approval decisions must be enforced by an authorized backend and export-compliance process, not browser JavaScript. All users and resource names here are fictional.</p></div>`+
      panel('Try an access decision','Select a scenario. The result is shown clearly at the top of the page and saved below.',`<div class="panel-body"><div class="scenario-grid">${cards}</div></div>`)+
      `<div style="height:20px"></div>`+panel('Decision history',`${visible.length} recorded mock decision(s) — newest first`,`<div class="panel-body"><div class="history-list">${history}</div></div>`);
  }
  function securityPage(){
    if(!isAdmin())return top('ACCESS DENIED','Security monitoring is restricted','Only assigned station administrators and global administrators may see security alerts.');
    const visible=state.alerts.filter(a=>assigned(a.station));
    return top('MONITORING','Security alerts','Monitor potential access violations and irregular activity. This queue uses simulated events and does not connect to real sign-in systems.')+
      panel('Alert queue',`${visible.filter(a=>!a.ack).length} awaiting acknowledgment`, `<div class="panel-body compact">${visible.length?visible.map(a=>`<div class="alert-row"><div class="alert-symbol ${a.level==='High'?'high':''}">!</div><div class="alert-desc"><strong>${esc(a.title)}</strong><p>${esc(a.detail)}</p><small>${esc(stationName(a.station))} · ${esc(a.time)} · ${esc(a.type)}</small></div><div class="req-actions">${badge(a.ack?'Acknowledged':a.level,a.ack?'green':tone(a.level))}${a.ack?'':`<button class="button small" data-action="ack-alert" data-id="${a.id}">Acknowledge</button>`}</div></div>`).join(''):`<div class="empty">No alerts in this scope.</div>`}</div>`)+
      `<div style="height:18px"></div>`+panel('Configured guardrails','Illustrative review policies',`<div class="panel-body"><div class="info-rows"><div class="info-row"><span>Cross-station access</span>${badge('Deny + alert','red')}</div><div class="info-row"><span>Unauthorized role actions</span>${badge('Deny + audit','red')}</div><div class="info-row"><span>Expired export approval</span>${badge('Block access','red')}</div><div class="info-row"><span>Unusual download patterns</span>${badge('Review','orange')}</div><div class="info-row"><span>Escalation</span>${badge('Scoped security review','blue')}</div></div><p class="narrow-note">To produce example alerts, turn on Demo Mode and visit Security & Access Testing. A real system needs reviewed thresholds, recipients, and retention rules.</p></div>`);
  }
  function compliancePage(){
    if(!isAdmin())return top('ACCESS DENIED','Compliance status restricted','Compliance review information is not available to this role.');
    const users=state.users.filter(u=>assigned(u.station));
    const outstanding=state.requests.filter(r=>assigned(r.station)&&!closed(r));
    const rows=users.map(u=>`<tr><td><strong>${esc(u.alias)}</strong><div class="row-sub">${esc(u.role)}</div></td><td>${esc(stationName(u.station))}</td><td>${badge(u.access,tone(u.access))}</td><td>${badge(u.status,tone(u.status))}</td><td>${u.access==='Approved'?'Demo decision on file':u.access==='Review due'?'Review required':'No approved scope'}</td></tr>`).join('');
    return top('GOVERNANCE','Compliance status','A restricted overview of fictional authorization decisions, valid scopes, and review needs. Not a compliance-verification tool.')+
      `<div class="notice-card"><strong>Administrators cannot certify export eligibility.</strong><p>Actual determinations and access to citizenship or residency evidence belong to designated UW or approved compliance personnel. This view shows only high-level authorization status and fictional references.</p></div>`+
      `<div class="cards">${metric('Users in scope',users.length,'Authorized station filter')}${metric('Approved sample records',users.filter(u=>u.access==='Approved').length,'Browser demo only')}${metric('Review required',users.filter(u=>u.access!=='Approved').length,'Not authorized until resolved')}${metric('Pending requests',outstanding.length,'Under staged review')}</div>`+
      panel('Authorization status','Scope-filtered demonstration records',`<div class="table-wrap"><table class="table"><thead><tr><th>User</th><th>Station</th><th>Authorization</th><th>Account</th><th>Evidence reference</th></tr></thead><tbody>${rows}</tbody></table></div>`)+
      `<div class="callout" style="margin-top:17px">Production: retrieve signed or verified authorization decisions from an institutional compliance source; store minimal decision references, applicable resource scope, review dates, and audit records. No compliance documents should be stored in this public demo.</div>`;
  }
  function auditPage(){
    if(!isAdmin())return top('ACCESS DENIED','Audit logs restricted','Only authorized administrators can review activity.');
    const visible=state.audit.filter(a=>global()||a.station===actor().station);
    return top('ACCOUNTABILITY','Audit trail','Immutable logs are required for production. The entries here are mock browser-session events and reset on refresh.')+
      panel('Recent activity',`${visible.length} recorded demonstration events`,`<div class="table-wrap"><table class="table"><thead><tr><th>Time</th><th>Actor</th><th>Event</th><th>Station</th><th>Outcome</th></tr></thead><tbody>${visible.map(a=>`<tr><td>${esc(a.time)}</td><td class="row-name">${esc(a.user)}</td><td>${esc(a.action)}</td><td>${esc(stationName(a.station))}</td><td>${badge(a.result,tone(a.result))}</td></tr>`).join('')}</tbody></table></div>`)+panel('Access decision records','Recent mock approvals, denials and review decisions',`<div class="panel-body"><div class="history-list">${state.decisions.filter(d=>global()||assigned(d.station)).map(d=>`<article class="history-record ${d.outcome==='Denied'?'denied':d.outcome==='Approved'?'approved':'review'}"><div class="history-top"><strong>${esc(d.title)}</strong>${badge(d.outcome,tone(d.outcome))}</div><div class="history-meta">${esc(d.id)} · ${esc(d.time)} · ${esc(stationName(d.station))}</div><p><b>Reason:</b> ${esc(d.reason)}</p><p><b>Next step:</b> ${esc(d.next)}</p></article>`).join('')}</div></div>`);
  }
  function policyPage(){
    const perms=[['View authorized results',[1,1,1,1]],['View other stations',[1,0,0,0]],['Start / stop acquisition',[1,1,1,0]],['Manage users at assigned station',[1,1,0,0]],['Manage all stations',[1,0,0,0]],['Approve administrative access',[1,1,0,0]],['Override export authorization',[0,0,0,0]],['Review all audit logs',[1,0,0,0]]];
    return top('GOVERNANCE','Access control policy','Permissions = approved identity + valid export authorization + role permission + authorized station scope.')+
    `<div class="columns">${panel('Access decision','A conceptual policy check performed by the backend.',`<div class="panel-body"><div class="codeblock">ALLOW(request) only when:\n  authenticated_identity == VERIFIED\n  AND export_authorization == APPROVED\n  AND authorization_covers(request.resource)\n  AND role_allows(request.action)\n  AND (role == SUPER_ADMIN\n       OR request.station_id == user.station_id)\n  AND account_status == ACTIVE\n  OTHERWISE: DENY + AUDIT</div><p class="narrow-note">Super Admin is still subject to export authorization. The actual legal determination is external to this demo.</p></div>`)}${panel('Sensitive information handling','Proposed production boundaries',`<div class="panel-body"><div class="info-rows"><div class="info-row"><span>Citizenship / residency documents</span><strong>Outside demo</strong></div><div class="info-row"><span>Eligibility determination</span><strong>Authorized reviewer</strong></div><div class="info-row"><span>Dashboard stores</span><strong>Decision reference only</strong></div><div class="info-row"><span>Public hosting</span><strong>Mock data only</strong></div><div class="info-row"><span>Real restricted data</span><strong>Approved environment only</strong></div></div></div>`)}</div>`+
    panel('Role permission matrix','Illustrative model to confirm with the UW project team.',`<div class="table-wrap"><table class="table permissions"><thead><tr><th>Capability</th><th>Super Admin</th><th>Station Admin</th><th>Operator</th><th>Viewer</th></tr></thead><tbody>${perms.map(([name,v])=>`<tr><td>${esc(name)}</td>${v.map(n=>`<td class="${n?'check-yes':'check-no'}">${n?'✓':'—'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`)+
    `<div class="callout" style="margin-top:17px">Important: “red certified” is not defined here as a formal certification program. UW must identify applicable export-control regulations, controlled resources, accreditation/security requirements, approved cloud regions, and the authority that can approve deployment before any real controlled information is uploaded.</div>`;
  }
  let lastFocusedDecisionId=null;
  const pages={overview,stations:stationsPage,register:registerPage,invites:invitesPage,users:usersPage,requests:requestsPage,compliance:compliancePage,testing:testingPage,security:securityPage,audit:auditPage,policy:policyPage};
  function render(){
    if(!navItems().includes(state.page))state.page='overview';
    if(!isApplicant()&&!viewStations().some(s=>s.id===state.station))state.station=viewStations()[0].id;
    renderNav();updatePersona();$('#main-content').innerHTML=decisionNotice()+pages[state.page]();
    if(state.currentDecision && lastFocusedDecisionId!==state.currentDecision.id){lastFocusedDecisionId=state.currentDecision.id;const region=document.querySelector('.decision-banner');if(region)region.focus({preventScroll:false});}
  }
  let previousFocus=null;
  const modal=(title,description,content,buttons='')=>{previousFocus=document.activeElement;$('#modal-root').innerHTML=`<div class="modal-backdrop" data-dismiss="modal"><section class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-header"><div><h2>${title}</h2><p class="subhead">${description}</p></div><button class="close-modal" data-action="close-modal" aria-label="Close dialog">×</button></div><div class="modal-body">${content}${buttons}</div></section></div>`;const initial=$('#modal-root input:not([disabled]), #modal-root select, #modal-root textarea, #modal-root button');if(initial)initial.focus();};
  const closeModal=()=>{if(!$('#modal-root').firstElementChild)return;$('#modal-root').innerHTML='';if(previousFocus?.isConnected)previousFocus.focus();previousFocus=null;};
  function inviteModal(){
    if(!isAdmin())return deny('Only authorized administrators may issue invitations.');
    modal('Invite a sample user','The invitation is only a sponsor-issued request token; no real email is sent.',`<form id="invite-form"><div class="notice-card"><strong>Use fictional information only.</strong><p>Invitations never establish export-control eligibility and do not bypass later identity, compliance, or administrative review.</p></div>
      <div class="form-grid"><div class="field"><label for="invite-alias">Demo applicant alias</label><input id="invite-alias" name="alias" minlength="5" maxlength="48" placeholder="Demo Researcher 045" required autocomplete="off"/></div><div class="field"><label for="invite-email">Example email (.test / .example)</label><input id="invite-email" name="email" type="email" maxlength="100" placeholder="researcher@university.test" required autocomplete="off"/></div></div>
      <div class="form-grid"><div class="field"><label for="invite-role">Proposed role</label><select id="invite-role" name="role">${(global()?['Station Admin','Operator','Viewer']:['Operator','Viewer']).map(role=>`<option>${role}</option>`).join('')}</select></div><div class="field"><label for="invite-station">Station assignment</label><select id="invite-station" name="station">${viewStations().map(st=>`<option value="${st.id}">${esc(st.name)}</option>`).join('')}</select></div></div>
      <div class="tip-card"><strong>Expires after 7 days.</strong><p>Only one use is permitted. The request will still require identity, independent export review, and administrative approval.</p></div><div class="modal-actions"><button class="button" type="button" data-action="close-modal">Cancel</button><button class="button primary" type="submit">Create demo invitation</button></div></form>`);
  }
  function manageUser(id){
    const u=state.users.find(u=>u.id===id);if(!u||!canManage(u.station)||u.role==='Super Admin'||(!global()&&u.role==='Station Admin')){deny('Cannot modify this user or station.',u?.station);return;}
    modal('Manage demo user','Roles and status can be changed only within your permitted station.',`<form id="user-form" data-id="${esc(u.id)}"><div class="field"><label>Fictional account</label><input value="${esc(u.alias)}" disabled /></div><div class="field"><label for="user-role">Role</label><select name="role" id="user-role">${(global()?['Station Admin','Operator','Viewer']:['Operator','Viewer']).map(r=>`<option ${u.role===r?'selected':''}>${r}</option>`).join('')}</select></div><div class="field"><label for="user-status">Account state</label><select name="status" id="user-status">${['Active','Suspended'].map(s=>`<option ${u.status===s?'selected':''}>${s}</option>`).join('')}</select></div><div class="callout">This changes fake browser-memory records only. Real role and station changes must require server authorization and leave tamper-resistant audit logs.</div><div class="modal-actions"><button type="button" class="button" data-action="close-modal">Cancel</button><button type="submit" class="button primary">Save simulated changes</button></div></form>`);
  }
  function rejectModal(id,stage){
    const r=state.requests.find(r=>r.id===id);
    if(!r || closed(r))return;
    const labels={sponsor:'Station sponsorship',identity:'Identity verification',compliance:'Export compliance',admin:'Station administration'};
    const options={
      sponsor:['No documented station sponsorship for this request.','Requested station or role does not match the project need.'],
      identity:['Unable to verify identity using the approved process.','Required verification is incomplete.'],
      compliance:['Access is not authorized for the requested controlled resource scope.','Independent compliance review did not approve the access request.'],
      admin:['Station-level operational need was not approved.','Requested role exceeds the approved need for access.']
    };
    modal('Simulate '+labels[stage]+' denial','Choose a fictional policy reason. Do not enter real personal or immigration details.',`<form id="reject-form" data-id="${esc(id)}" data-stage="${esc(stage)}"><div class="notice-card"><strong>This decision will close the sample request.</strong><p>This is a demonstration of a negative decision, not a real identity or legal eligibility determination.</p></div><div class="field"><label for="denial-reason">Mock denial reason</label><select required id="denial-reason" name="reason">${options[stage].map(o=>`<option value="${esc(o)}">${esc(o)}</option>`).join('')}</select></div><div class="modal-actions"><button class="button" type="button" data-action="close-modal">Cancel</button><button class="button danger" type="submit">Confirm simulated denial</button></div></form>`);
  }
  function applyRejection(r,stage,reason){
    const map={sponsor:'Sponsor denied',identity:'Identity denied',compliance:'Export denied',admin:'Admin denied'};
    const labels={sponsor:'Station sponsorship',identity:'Identity verification',compliance:'Export compliance',admin:'Station administration'};
    r.state=map[stage];r.closedStage=labels[stage];r.closedReason=reason;
    log('DENIED: '+r.id+' at '+labels[stage]+': '+reason,r.station,'Denied');
    report('Denied',r.state+' — '+r.id,reason,'The request is closed; access is not granted. A new request may be submitted after the issue is resolved.',r.station);
    render();
  }
  function createAlert(level,title,detail,station,type){state.alerts.unshift({id:state.alertId++,level,title,detail,station,type,time:date(),ack:false});log('ALERT: '+title,station,'Alert');report('Review',title,detail,'An authorized security reviewer should inspect the alert queue.',station);render();}
  function action(name,d){
    const s=d.station, id=d.id, station=currentStation();
    if(name==='close-modal'){closeModal();return;}
    if(name==='dismiss-decision'){state.currentDecision=null;render();return;}
    if(name==='open-audit'){state.page=isAdmin()?'audit':'requests';render();return;}
    if(name==='scenario'){if(!state.demoMode||!isAdmin())return deny('Security simulations are available only to administrators while Demo Mode is enabled.',station.id);
      const mock={
        'allow-view':['Approved','Authorized results view','A fictional active Viewer requested results from the assigned station. Identity, export authorization, role, and station checks all passed.','The simulated data response is available for viewing.'],
        'deny-viewer':['Denied','Viewer receiver control blocked','Role permission failed: Viewer cannot start or stop receiver capture.','Request Operator access through the documented approval workflow.'],
        'deny-cross':['Denied','Cross-station request blocked','Station scope failed: the fictional Operator requested a station outside their assignment.','Contact an administrator to request reassignment.'],
        'deny-unverified':['Denied','Identity verification required','Identity verification has not been approved through the designated process.','Complete verification with the authorized identity review team.'],
        'deny-export':['Denied','Export authorization does not permit access','The example compliance authorization does not cover this controlled data scope.','A designated compliance reviewer must approve a new authorization; a Super Admin cannot override this.'],
        'deny-pending':['Denied','Administrative approval still pending','Identity and compliance reviews passed, but a station administrator has not approved role and station access.','Wait for station administrator review.'],
        'deny-expired':['Denied','Export authorization expired','The fictional resource-scoped authorization is past its validity date.','Request revalidation from the designated compliance team.'],
        'deny-suspended':['Denied','Account suspended','This example account is suspended despite previous approvals.','Contact the account administrator for reactivation review.']
      }[id];
      if(!mock)return;
      report(...mock,actor().station||station.id);
      log(`SCENARIO: ${mock[1]}`,actor().station||station.id,mock[0]);
      if(mock[0]==='Denied'){state.alerts.unshift({id:state.alertId++,level:'High',title:mock[1],detail:mock[2],station:actor().station||station.id,type:'Scenario: access denied',time:date(),ack:false});}
      render();return;
    }
    if(name==='reject-stage'){const r=state.requests.find(r=>r.id===id);if(!r||closed(r))return;const stage=d.stage;if(!canManage(r.station) || (stage==='identity'||stage==='compliance')&&!global() || stage==='sponsor' && r.role==='Station Admin' && !global())return deny('You cannot issue this mock review decision.',r.station);if(stage==='sponsor'&&r.sponsor!==false || stage==='identity'&&r.sponsor===false || stage==='compliance'&&!r.identity||stage==='admin'&&!r.compliance)return deny('The required previous review has not completed.',r.station);rejectModal(id,stage);return;}
    if(name==='try-early-approval'){const r=state.requests.find(r=>r.id===id);if(!r)return;return deny('Cannot approve '+r.id+': identity verification, export review, and station approval must all be complete before access can be granted.',r.station);}

    if(name==='create-request'){state.page='register';render();return;}
    if(name==='new-invite'){inviteModal();return;}
    if(name==='copy-invite'){
      const inv=state.invitations.find(i=>i.id===id);
      if(!inv||!isAdmin()||!assigned(inv.station))return deny('Invitation is outside your station scope.');
      if(navigator.clipboard?.writeText){navigator.clipboard.writeText(inv.code).then(()=>{report('Info','Sample invitation code copied',`Code ${inv.code} is now in your clipboard. No email has been sent.`,'Switch to Prospective User and paste the code on Request Access.',inv.station);render();}).catch(()=>{report('Info','Sample invitation code',`Copy this fictional code manually: ${inv.code}`,'Open Prospective User → Request Access.',inv.station);render();});}
      else{report('Info','Sample invitation code',`Copy this fictional code manually: ${inv.code}`,'Open Prospective User → Request Access.',inv.station);render();}
      return;
    }
    if(name==='revoke-invite'){
      const inv=state.invitations.find(i=>i.id===id);
      if(!inv||!canManage(inv.station)||inviteStatus(inv)!=='Pending')return deny('Only unused invitations in your station scope can be revoked.',inv?.station);
      inv.status='Revoked';log('Revoked demo invitation '+inv.id,inv.station,'Recorded');report('Denied','Invitation revoked — '+inv.id,'The fictional invitation is no longer valid for registration.','Issue a new invitation if station sponsorship remains appropriate.',inv.station);render();return;
    }
    if(name==='fill-sample-invite'||name==='fill-expired-invite'){
      const inv=state.invitations.find(i=>i.code===(name==='fill-expired-invite'?'DEMO-EXPIRED-300':'DEMO-UW-VIEW-301'));
      if(!inv)return;[['#request-invite',inv.code],['#request-alias',inv.alias],['#request-email',inv.email],['#request-role',inv.role],['#request-station',inv.station],['#request-reason','Review synthetic historical Doppler measurements']].forEach(([selector,value])=>{const el=$(selector);if(el)el.value=value;});
      $('#request-invite')?.focus();return;
    }
    if(name==='approve-sponsor'){
      const r=state.requests.find(r=>r.id===id);if(!r||closed(r)||r.sponsor!==false||!canManage(r.station))return deny('Sponsorship approval is not permitted for this request.',r?.station);
      if(r.role==='Station Admin'&&!global())return deny('Only Super Admin may sponsor Station Admin access.',r.station);
      r.sponsor=true;r.state=requestState(r);log('Accepted synthetic sponsorship for '+r.id,r.station,'Recorded');report('Info','Sponsorship approved — '+r.id,'An authorized station administrator accepted the fictional business need.','Identity verification and independent export compliance must still be completed.',r.station);render();return;
    }
    if(name==='toggle-capture'){
      if(!canOperate(station.id))return deny('Your role cannot control this station.',station.id);
      state.capture[station.id]=!state.capture[station.id];log('Demo acquisition '+(state.capture[station.id]?'started':'stopped'),station.id,'Allowed');report('Approved','Demo receiver '+(state.capture[station.id]?'started':'stopped'),'Your fictional role and station scope permit receiver control.','No hardware was contacted; only browser demo state changed.',station.id);render();return;
    }
    if(name==='viewer-deny'){return deny('Viewer accounts cannot issue receiver commands.',station.id);}
    if(name==='test-guardrail'){if(!isAdmin()||!state.demoMode)return deny('Testing tools are restricted to Demo Mode administrators.',station.id);state.page='testing';render();return;}
    if(name==='focus-station'){if(!canView(s))return deny('Access to this station is not authorized.',s);state.station=s;state.page='overview';render();return;}
    if(name==='manage-user'){manageUser(id);return;}
    if(['mock-identity','mock-compliance','approve-request','deny-request'].includes(name)){
      const r=state.requests.find(r=>r.id===id);if(!r)return;
      if(name==='mock-identity'){if(closed(r)||!global()||r.sponsor===false||r.identity)return deny('Mock external verification requires Control Tower simulator.',r.station);r.identity=true;r.state=requestState(r);log('Received SIMULATED identity-verification result for '+r.id,r.station);report('Info','Mock identity verification passed — '+r.id,'An external identity-review decision was simulated for this example request.','Continue to the separate export-compliance review.',r.station);}
      if(name==='mock-compliance'){if(closed(r)||!global()||!r.identity||r.compliance)return deny('Export review cannot advance before verified identity or without simulation authority.',r.station);r.compliance=true;r.state=requestState(r);log('Received SIMULATED export-compliance approval for '+r.id,r.station);report('Info','Mock compliance review passed — '+r.id,'A fictional resource-scoped compliance authorization was recorded.','Station administration must still approve the requested role and station.',r.station);}
      if(name==='approve-request'){
        if(closed(r)||!canManage(r.station)||r.sponsor===false||!r.identity||!r.compliance)return deny('Approval blocked: station authority and all prerequisite verification stages are mandatory.',r.station);
        if(r.role==='Station Admin'&&!global())return deny('Only Super Admin can approve a Station Admin role.',r.station);
        r.admin=true;r.state='Approved';const uid='u'+(state.users.length+1);state.users.push({id:uid,alias:r.alias,role:r.role,station:r.station,access:'Approved',status:'Active'});log('Approved DEMO station access for '+r.id,r.station,'Allowed');report('Approved','Station access granted — '+r.id,'Identity verification, export review, and station administrator stages passed in the fictional workflow.','The account is active in the demo for its assigned station and role.',r.station);}
      if(name==='deny-request'){if(!canManage(r.station)||closed(r))return deny('Cannot deny this request in its current state.',r.station);applyRejection(r,'admin','Station administrator did not approve the request.');}
      render();return;
    }
    if(name==='ack-alert'){
      const a=state.alerts.find(a=>a.id===Number(id));if(!a||!isAdmin()||!assigned(a.station))return deny('Cannot acknowledge an alert outside your permitted scope.',a?.station);a.ack=true;log('Acknowledged simulated alert #'+id,a.station,'Recorded');report('Info','Alert acknowledged','An authorized demo administrator acknowledged alert #'+id+'.','The alert remains in the history for review.',a.station);render();return;
    }
    if(['simulate-cross','simulate-viewer','simulate-login','simulate-download'].includes(name) && (!isAdmin()||!state.demoMode))return deny('Testing tools are restricted to Demo Mode administrators.',station.id);
    if(name==='simulate-cross')return createAlert('High','Cross-station access blocked','A fictional station-scoped account attempted to query another station.',actor().station||station.id,'Access denied');
    if(name==='simulate-viewer')return createAlert('High','Viewer write operation denied','Synthetic Viewer POST /capture/start was denied by role policy.',station.id,'Role violation');
    if(name==='simulate-login')return createAlert('Medium','Irregular authentication attempts','Simulated repeated failed login attempts exceeded the review threshold.',station.id,'Authentication');
    if(name==='simulate-download')return createAlert('High','Unusual results export pattern','Mock threshold crossed for downloads of controlled data. No data was exported.',station.id,'Data access');
  }
  document.addEventListener('click',event=>{
    const nav=event.target.closest('[data-page]');if(nav){state.page=nav.dataset.page;render();return;}
    const button=event.target.closest('[data-action]');if(button){action(button.dataset.action,button.dataset);return;}
    if(event.target.matches('.modal-backdrop'))closeModal();
  });
  document.addEventListener('submit',event=>{
    if(event.target.id==='reject-form'){
      event.preventDefault();
      const f=event.target,r=state.requests.find(r=>r.id===f.dataset.id),stage=f.dataset.stage,reason=String(new FormData(f).get('reason')||'').trim();
      if(!r||closed(r)||!['sponsor','identity','compliance','admin'].includes(stage)||!reason)return;
      if(!canManage(r.station)||(['identity','compliance'].includes(stage)&&!global())||(stage==='sponsor'&&r.role==='Station Admin'&&!global()))return deny('You cannot make that review decision.',r.station);
      if((stage==='sponsor'&&r.sponsor!==false)||(stage==='identity'&&r.sponsor===false)||(stage==='compliance'&&!r.identity)||(stage==='admin'&&!r.compliance))return deny('The prerequisite review has not completed.',r.station);
      closeModal();applyRejection(r,stage,reason);return;
    }
    if(event.target.id==='request-form'){
      event.preventDefault();
      const data=new FormData(event.target);
      const alias=String(data.get('alias')||'').trim(),email=String(data.get('email')||'').trim(),reason=String(data.get('reason')||'').trim(),station=String(data.get('station')||''),role=String(data.get('role')||'Viewer'),org=String(data.get('organization')||''),code=String(data.get('invite')||'').trim();
      if(!/^Demo\b/i.test(alias)||!fictionalEmail(email)||reason.length<10)return deny('Use a fictional alias beginning with “Demo”, an email ending .test/.example, and a meaningful fictional justification.',station);
      if(!stations.some(st=>st.id===station)||( !isApplicant() && !canView(station) ))return deny('Requested station is outside your registration scope.',station);
      if(!['Viewer','Operator','Station Admin'].includes(role))return deny('Unsupported requested role.',station);
      let invitation=null;
      if(code){
        invitation=state.invitations.find(i=>i.code.toUpperCase()===code.toUpperCase());
        if(!invitation)return deny('Invitation code not found. Check the sample code or submit without a code for sponsorship review.',station);
        const status=inviteStatus(invitation);
        if(status!=='Pending')return deny(`Invitation ${status.toLowerCase()}: this invitation cannot be used. Ask an administrator for a new one.`,station);
        if(invitation.role!==role||invitation.station!==station||invitation.email.toLowerCase()!==email.toLowerCase()||invitation.alias.toLowerCase()!==alias.toLowerCase())return deny('Invitation details do not match. The alias, example email, role and station must match the invitation.',station);
        if(invitation.role==='Station Admin'&&!isApplicant()&&!global())return deny('A Station Admin invitation is only for an external applicant or global administrator.',station);
      } else if(role==='Station Admin')return deny('Station Admin registration requires a Super Admin invitation. Direct self-request is blocked.',station);
      const id='REQ-'+state.nextId++;
      const sponsored=!!invitation;
      state.requests.unshift({id,alias,email,organization:org,role,station,reason,requestedBy:state.role,invitationId:invitation?.id||null,sponsor:sponsored,identity:false,compliance:false,admin:false,state:sponsored?'Identity review':'Sponsorship review'});
      if(invitation)invitation.status='Used';
      log('Submitted sample registration '+id+(invitation?' via '+invitation.id:' (sponsorship pending)'),station,'Recorded');
      report('Review','Registration received — '+id,sponsored?'The mock invitation was accepted. This is not an active account; identity and compliance reviews are still required.':'No invitation was provided. A station administrator must first approve sponsorship before identity and compliance review.',sponsored?'Track the identity review under Access Requests.':'Track the sponsorship decision under Access Requests.',station);
      state.page='requests';render();return;
    }
    if(event.target.id==='invite-form'){
      event.preventDefault();
      if(!isAdmin())return deny('Only authorized admins can invite users.');
      const data=new FormData(event.target),alias=String(data.get('alias')||'').trim(),email=String(data.get('email')||'').trim(),role=String(data.get('role')||''),station=String(data.get('station')||'');
      if(!/^Demo\b/i.test(alias)||!fictionalEmail(email))return deny('Invitations must use fictional Demo aliases and .test / .example email addresses.',station);
      if(!canManage(station)||!['Viewer','Operator','Station Admin'].includes(role)||(role==='Station Admin'&&!global()))return deny('You cannot issue an invitation for this role or station.',station);
      const n=state.nextInvite++,id='INV-'+String(n).padStart(4,'0');
      const code='DEMO-'+station.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,9)+'-'+n;
      state.invitations.unshift({id,code,alias,email,role,station,by:actor().name,expiresAt:new Date(Date.now()+7*86400000).toISOString(),status:'Pending'});
      closeModal();log('Created sample invitation '+id,station,'Recorded');report('Info','Invitation created — '+id,`A fictional invitation code was generated: ${code}. No email was sent.`, 'Copy the code from Invitations and demonstrate registration as Prospective User.',station);state.page='invites';render();return;
    }
    if(event.target.id==='user-form'){
      event.preventDefault();const id=event.target.dataset.id,u=state.users.find(x=>x.id===id),d=new FormData(event.target);
      if(!u||!canManage(u.station)||u.role==='Super Admin'||(!global()&&u.role==='Station Admin'))return deny('Cannot change this account.',u?.station);
      const role=String(d.get('role')),status=String(d.get('status'));
      if(!['Station Admin','Operator','Viewer'].includes(role)||(!global()&&role==='Station Admin')||!['Active','Suspended'].includes(status))return deny('Invalid role/status selection.',u.station);
      u.role=role;u.status=status;log('Updated demo user '+u.alias+' to '+role+' / '+status,u.station,'Recorded');closeModal();report(status==='Suspended'?'Denied':'Info',status==='Suspended'?'Demo account suspended':'Demo account updated',status==='Suspended'?'The account is blocked from further access in the illustrated production policy.':'The fictional account role or status was updated.',status==='Suspended'?'A station administrator must review reactivation.':'Review the scoped user directory.',u.station);render();
    }
  });
  $('#persona').addEventListener('change',event=>{state.role=event.target.value;state.page=isApplicant()?'register':'overview';state.station=actor().station||'uw-rooftop';closeModal();state.currentDecision=null;render();});
  document.addEventListener('change',event=>{if(event.target.id==='demo-mode'){state.demoMode=event.target.checked;if(!state.demoMode&&state.page==='testing')state.page='overview';render();return;}if(event.target.id==='station-selector'){state.station=event.target.value;render();}});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){closeModal();return;}
    if(event.key==='Tab'&&$('#modal-root .modal')){
      const focusable=[...document.querySelectorAll('#modal-root button:not([disabled]),#modal-root input:not([disabled]),#modal-root select:not([disabled]),#modal-root textarea:not([disabled])')];
      if(!focusable.length)return;
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    }
  });
  render();
})();
