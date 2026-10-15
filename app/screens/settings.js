import { Settings, Children, Stats } from '../lib/settings.js';

export function SettingsScreen() {
  const cfg = Settings.all();
  const kids = Children.list();
  const active = Children.active();
  const totals = Stats.totals();

  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#334155 0%,#1E293B 60%,#0F172A 100%);border-radius:22px;padding:22px;color:#fff;position:relative;overflow:hidden;margin-bottom:20px;box-shadow:0 20px 40px rgba(30,41,59,.4)">
        <div style="position:absolute;inset-inline-end:-70px;top:-70px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(148,163,184,.25),transparent 70%)"></div>
        <div style="position:relative;z-index:1">
          <div style="display:flex;align-items:center;gap:14px">
            <span style="width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(255,255,255,.3),rgba(255,255,255,.15));display:grid;place-items:center;font-size:1.7rem;flex-shrink:0;border:1px solid rgba(255,255,255,.25)">⚙️</span>
            <div>
              <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;line-height:1.25">الإعدادات</div>
              <div style="font-size:0.78rem;opacity:.9;margin-top:3px">خصّصي تجربتك</div>
            </div>
          </div>
        </div>
      </div>

      ${sectionHeader('👶', 'الأطفال', '#64748B')}
      ${kids.map(k => childCard(k, k.id === active?.id)).join('')}
      <button onclick="ommyAddChild()" type="button" style="width:100%;margin:12px 0 20px;padding:14px;border:2px dashed var(--line);border-radius:16px;background:var(--cream);color:var(--ink-2);font-family:var(--font-heading);font-weight:900;font-size:0.88rem;cursor:pointer">➕ إضافة طفل جديد</button>

      ${sectionHeader('📊', 'إحصائيات الأسبوع', '#64748B')}
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">
        ${statCard(totals.feeds, 'رضعة', '#10B981')}
        ${statCard(totals.sleeps, 'نوم', '#5B7C99')}
        ${statCard(totals.diapers, 'حفاض', '#14B8A6')}
      </div>

      ${sectionHeader('🎨', 'التفضيلات', '#64748B')}
      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px;margin-bottom:20px">
        ${toggleRow('🔔', 'الإشعارات', 'notifications', cfg.notifications)}
      </div>

      ${sectionHeader('💾', 'البيانات والنسخ الاحتياطي', '#64748B')}

      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px;margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px dashed var(--line)">
          <span style="font-family:var(--font-heading);font-size:0.86rem;font-weight:800">📊 حجم البيانات</span>
          <span style="font-family:var(--font-heading);font-weight:900;color:#10B981" id="dataSize">—</span>
        </div>
        <button onclick="ommyDownloadBackup()" type="button" style="width:100%;margin-top:14px;padding:14px;border:none;border-radius:14px;background:linear-gradient(145deg,#10B981,#047857);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.85rem;cursor:pointer">📤 تنزيل نسخة احتياطية (JSON)</button>
        <button onclick="document.getElementById('restoreFile').click()" type="button" style="width:100%;margin-top:10px;padding:14px;border:1.5px solid #10B981;border-radius:14px;background:var(--cream);color:#047857;font-family:var(--font-heading);font-weight:900;font-size:0.85rem;cursor:pointer">📥 استعادة من نسخة</button>
        <input type="file" id="restoreFile" accept=".json" style="display:none" onchange="ommyRestore(this.files[0])" />
        <button onclick="ommyShareSummary()" type="button" style="width:100%;margin-top:10px;padding:14px;border:1.5px solid var(--line);border-radius:14px;background:var(--cream);color:var(--ink-2);font-family:var(--font-heading);font-weight:900;font-size:0.85rem;cursor:pointer">📱 مشاركة الملخص</button>
      </div>

      ${sectionHeader('⚠️', 'منطقة الخطر', '#DC2626')}
      <button onclick="ommyReset()" type="button" style="width:100%;padding:14px;border:1.5px solid #FCA5A5;border-radius:16px;background:var(--cream);color:#DC2626;font-family:var(--font-heading);font-weight:900;font-size:0.85rem;cursor:pointer">🗑️ حذف كل البيانات</button>

      ${sectionHeader('🔔', 'الإشعارات', '#64748B')}
      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px;margin-bottom:20px">
        ${notifyRow('🍼', 'تذكير الرضعة', 'كل 3 ساعات أثناء فتح التطبيق', 'feed_reminder', Settings.get('feed_reminder', false))}
        ${notifyRow('💊', 'تذكير الدواء', 'حسب الجدول الذي تسجلينه', 'med_reminder', Settings.get('med_reminder', false))}
        ${notifyRow('💉', 'تذكير التطعيمات', 'تذكير داخل التطبيق؛ يلزم إعداد موعد', 'vac_reminder', Settings.get('vac_reminder', false))}
      </div>

      <div style="text-align:center;padding:20px;color:var(--ink-3);font-size:0.75rem">
        <div style="font-family:var(--font-heading);font-weight:900;color:var(--ink-2)">أُمّي · الإصدار 1.0</div>
        <div style="margin-top:4px">صُنع بحب 🌸 للأمهات العربيات</div>
      </div>
    </div>
  `;
}

function sectionHeader(icon, title, color) {
  return `<div style="display:flex;align-items:center;gap:10px;margin:22px 0 14px"><span style="font-size:1.1rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.9rem;font-weight:900;color:var(--ink)">${title}</span><span style="flex:1;height:2px;background:linear-gradient(90deg,${color},transparent);border-radius:2px"></span></div>`;
}

function childCard(k, isActive) {
  return `
    <div onclick="ommySelectChild('${k.id}')" style="display:flex;gap:14px;align-items:center;background:${isActive ? 'linear-gradient(135deg,#ECFDF5,#D1FAE5)' : 'var(--cream)'};border:1.5px solid ${isActive ? '#6EE7B7' : 'var(--line)'};border-radius:18px;padding:14px;margin-bottom:10px;cursor:pointer;transition:all .25s">
      <span style="width:52px;height:52px;border-radius:50%;background:linear-gradient(145deg,#10B981,#047857);color:#fff;display:grid;place-items:center;font-size:1.5rem;flex-shrink:0">${k.gender === 'girl' ? '👧' : '👶'}</span>
      <div style="flex:1;min-width:0">
        <div style="font-family:var(--font-heading);font-size:0.92rem;font-weight:900;margin-bottom:3px">${k.name}</div>
        <div style="font-size:0.72rem;color:var(--ink-3)">${k.birthDate}</div>
      </div>
      ${isActive ? '<span style="font-size:0.7rem;font-weight:900;background:#10B981;color:#fff;padding:4px 10px;border-radius:100px">نشط</span>' : ''}
    </div>
  `;
}

function statCard(value, label, color) {
  return `<div style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px 8px;text-align:center"><div style="font-family:var(--font-heading);font-size:1.5rem;font-weight:900;color:${color};line-height:1">${value}</div><div style="font-size:0.68rem;color:var(--ink-3);margin-top:6px;font-weight:700">${label}</div></div>`;
}

function toggleRow(icon, label, key, on) {
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:1.2rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.86rem;font-weight:800">${label}</span></div><button onclick="ommyToggle('${key}', this)" type="button" style="width:52px;height:30px;border-radius:100px;border:none;background:${on ? 'linear-gradient(145deg,#10B981,#047857)' : 'var(--beige-2)'};cursor:pointer;position:relative"><span style="position:absolute;top:3px;${on ? 'left:3px;' : 'right:3px;'}width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.15)"></span></button></div>`;
}

function notifyRow(icon, label, desc, key, on) {
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px dashed var(--line)"><div style="display:flex;align-items:center;gap:10px;flex:1"><span style="font-size:1.2rem">${icon}</span><div><div style="font-family:var(--font-heading);font-size:0.86rem;font-weight:800">${label}</div><div style="font-size:0.7rem;color:var(--ink-3)">${desc}</div></div></div><button onclick="ommyNotify('${key}', this)" type="button" style="width:52px;height:30px;border-radius:100px;border:none;background:${on ? 'linear-gradient(145deg,#10B981,#047857)' : 'var(--beige-2)'};cursor:pointer;position:relative"><span style="position:absolute;top:3px;${on ? 'left:3px;' : 'right:3px;'}width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.15)"></span></button></div>`;
}
