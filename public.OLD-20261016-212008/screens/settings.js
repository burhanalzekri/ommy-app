import { Settings, Children, Stats } from '../lib/settings.js';

export function SettingsScreen() {
  const cfg = Settings.all();
  const kids = Children.list();
  const active = Children.active();
  const totals = Stats.totals();

  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,#5A3E52 0%,#4A3042 60%,#352738 100%);border-radius:22px;padding:22px;color:#fff;position:relative;overflow:hidden;margin-bottom:20px;box-shadow:0 20px 40px rgba(30,41,59,.4)">
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

      ${sectionHeader('👨‍👩‍👧', 'المشاركة العائلية', '#EC4899')}
      ${renderFamilySection()}

      ${sectionHeader('☁️', 'المزامنة السحابية', '#8B5CF6')}
      ${renderSyncSection()}

      ${sectionHeader('📄', 'تقرير الطبيبة', '#8B5CF6')}
      ${renderReportSection()}

      ${sectionHeader('👶', 'الأطفال', '#8B7382')}
      ${kids.map(k => childCard(k, k.id === active?.id)).join('')}
      <button onclick="ommyAddChild()" type="button" style="width:100%;margin:12px 0 20px;padding:14px;border:2px dashed var(--line);border-radius:16px;background:var(--cream);color:var(--ink-2);font-family:var(--font-heading);font-weight:900;font-size:0.88rem;cursor:pointer">➕ إضافة طفل جديد</button>

      ${sectionHeader('📊', 'إحصائيات الأسبوع', '#8B7382')}
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">
        ${statCard(totals.feeds, 'رضعة', '#D9829A')}
        ${statCard(totals.sleeps, 'نوم', '#C9BFE5')}
        ${statCard(totals.diapers, 'حفاض', '#A8D5BA')}
      </div>

      ${sectionHeader('🎨', 'التفضيلات', '#8B7382')}
      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px;margin-bottom:20px">
        ${toggleRow('🔔', 'الإشعارات', 'notifications', cfg.notifications)}
      </div>

      ${sectionHeader('💾', 'البيانات والنسخ الاحتياطي', '#8B7382')}

      <div style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px;margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px dashed var(--line)">
          <span style="font-family:var(--font-heading);font-size:0.86rem;font-weight:800">📊 حجم البيانات</span>
          <span style="font-family:var(--font-heading);font-weight:900;color:#D9829A" id="dataSize">—</span>
        </div>
        <button onclick="ommyDownloadBackup()" type="button" style="width:100%;margin-top:14px;padding:14px;border:none;border-radius:14px;background:linear-gradient(145deg,#D9829A,#B94F70);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.85rem;cursor:pointer">📤 تنزيل نسخة احتياطية (JSON)</button>
        <button onclick="document.getElementById('restoreFile').click()" type="button" style="width:100%;margin-top:10px;padding:14px;border:1.5px solid #D9829A;border-radius:14px;background:var(--cream);color:#B94F70;font-family:var(--font-heading);font-weight:900;font-size:0.85rem;cursor:pointer">📥 استعادة من نسخة</button>
        <input type="file" id="restoreFile" accept=".json" style="display:none" onchange="ommyRestore(this.files[0])" />
        <button onclick="ommyShareSummary()" type="button" style="width:100%;margin-top:10px;padding:14px;border:1.5px solid var(--line);border-radius:14px;background:var(--cream);color:var(--ink-2);font-family:var(--font-heading);font-weight:900;font-size:0.85rem;cursor:pointer">📱 مشاركة الملخص</button>
      </div>

      ${sectionHeader('⚠️', 'منطقة الخطر', '#E57070')}
      <button onclick="ommyReset()" type="button" style="width:100%;padding:14px;border:1.5px solid #F5C8C8;border-radius:16px;background:var(--cream);color:#E57070;font-family:var(--font-heading);font-weight:900;font-size:0.85rem;cursor:pointer">🗑️ حذف كل البيانات</button>

      ${sectionHeader('🔔', 'الإشعارات', '#8B7382')}
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
    <div onclick="ommySelectChild('${k.id}')" style="display:flex;gap:14px;align-items:center;background:${isActive ? 'linear-gradient(135deg,#F2F9F4,#F8DFE6)' : 'var(--cream)'};border:1.5px solid ${isActive ? '#B8DFC7' : 'var(--line)'};border-radius:18px;padding:14px;margin-bottom:10px;cursor:pointer;transition:all .25s">
      <span style="width:52px;height:52px;border-radius:50%;background:linear-gradient(145deg,#D9829A,#B94F70);color:#fff;display:grid;place-items:center;font-size:1.5rem;flex-shrink:0">${k.gender === 'girl' ? '👧' : '👶'}</span>
      <div style="flex:1;min-width:0">
        <div style="font-family:var(--font-heading);font-size:0.92rem;font-weight:900;margin-bottom:3px">${k.name}</div>
        <div style="font-size:0.72rem;color:var(--ink-3)">${k.birthDate}</div>
      </div>
      ${isActive ? '<span style="font-size:0.7rem;font-weight:900;background:#D9829A;color:#fff;padding:4px 10px;border-radius:100px">نشط</span>' : ''}
    </div>
  `;
}

function statCard(value, label, color) {
  return `<div style="background:var(--cream);border:1.5px solid var(--line);border-radius:18px;padding:16px 8px;text-align:center"><div style="font-family:var(--font-heading);font-size:1.5rem;font-weight:900;color:${color};line-height:1">${value}</div><div style="font-size:0.68rem;color:var(--ink-3);margin-top:6px;font-weight:700">${label}</div></div>`;
}

function toggleRow(icon, label, key, on) {
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0"><div style="display:flex;align-items:center;gap:10px"><span style="font-size:1.2rem">${icon}</span><span style="font-family:var(--font-heading);font-size:0.86rem;font-weight:800">${label}</span></div><button onclick="ommyToggle('${key}', this)" type="button" style="width:52px;height:30px;border-radius:100px;border:none;background:${on ? 'linear-gradient(145deg,#D9829A,#B94F70)' : 'var(--beige-2)'};cursor:pointer;position:relative"><span style="position:absolute;top:3px;${on ? 'left:3px;' : 'right:3px;'}width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.15)"></span></button></div>`;
}

function notifyRow(icon, label, desc, key, on) {
  return `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px dashed var(--line)"><div style="display:flex;align-items:center;gap:10px;flex:1"><span style="font-size:1.2rem">${icon}</span><div><div style="font-family:var(--font-heading);font-size:0.86rem;font-weight:800">${label}</div><div style="font-size:0.7rem;color:var(--ink-3)">${desc}</div></div></div><button onclick="ommyNotify('${key}', this)" type="button" style="width:52px;height:30px;border-radius:100px;border:none;background:${on ? 'linear-gradient(145deg,#D9829A,#B94F70)' : 'var(--beige-2)'};cursor:pointer;position:relative"><span style="position:absolute;top:3px;${on ? 'left:3px;' : 'right:3px;'}width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.15)"></span></button></div>`;
}

/* ============ قسم التقرير ============ */
function renderReportSection() {
  return `
    <div style="background:linear-gradient(135deg,var(--lavender-soft),var(--rose-soft));border:1.5px solid var(--lavender);border-radius:20px;padding:16px;margin-bottom:20px">
      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:14px">
        <span style="width:52px;height:52px;border-radius:16px;background:#fff;display:grid;place-items:center;font-size:1.5rem;flex-shrink:0;box-shadow:0 4px 12px rgba(123,104,184,.15)">📄</span>
        <div style="flex:1;min-width:0">
          <div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem;color:var(--lavender-deep);margin-bottom:4px">تقرير صحي شامل</div>
          <div style="font-size:0.76rem;color:var(--ink-2);line-height:1.6">أنشئي تقريراً احترافياً لطبيبة الأطفال يشمل ملخص اليوم والأسبوع الماضي والمتوسطات</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <button onclick="ommyOpenReport()" type="button" style="padding:12px;border:none;border-radius:14px;background:linear-gradient(145deg,var(--lavender),var(--lavender-deep));color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.8rem;cursor:pointer;box-shadow:0 6px 16px rgba(123,104,184,.3)">📄 افتحي التقرير</button>
        <button onclick="ommyDownloadReport()" type="button" style="padding:12px;border:1.5px solid var(--lavender);border-radius:14px;background:var(--cream);color:var(--lavender-deep);font-family:var(--font-heading);font-weight:900;font-size:0.8rem;cursor:pointer">📥 نزّلي HTML</button>
      </div>
      <div style="font-size:0.68rem;color:var(--ink-3);margin-top:10px;text-align:center;line-height:1.6">
        💡 لتحويله PDF: من نافذة الطباعة اختر "حفظ كـ PDF"
      </div>
    </div>
  `;
}

/* ============ قسم المزامنة ============ */
function renderSyncSection() {
  const sync = window.ommySync;
  const configured = sync && sync.configured();
  const status = sync ? sync.status() : null;

  return `
    <div class="card" style="padding:16px;margin-bottom:20px">
      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:14px">
        <span style="width:52px;height:52px;border-radius:16px;background:var(--lavender-soft);display:grid;place-items:center;font-size:1.5rem;flex-shrink:0">☁️</span>
        <div style="flex:1;min-width:0">
          <div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem;color:var(--lavender-deep);margin-bottom:4px">المزامنة السحابية</div>
          <div style="font-size:0.74rem;color:var(--ink-2);line-height:1.6">
            ${configured
              ? 'ارفعي بياناتك للسحابة لتعود إليها من أي جهاز'
              : 'لتفعيل المزامنة، اربطي التطبيق بـ Supabase من الإعدادات المتقدمة'}
          </div>
        </div>
      </div>

      ${window.ommyAutoSync ? `
        <div style="background:var(--sand);border-radius:14px;padding:12px;margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-family:var(--font-heading);font-weight:800;font-size:0.82rem;color:var(--ink)">🔄 مزامنة تلقائية</div>
              <div style="font-size:0.68rem;color:var(--ink-3);margin-top:2px">آخر مزامنة: ${window.ommyAutoSync.status().lastSyncLabel}</div>
            </div>
            <button onclick="ommyAutoSyncToggle(${!window.ommyAutoSync.status().enabled})" type="button" style="width:48px;height:28px;border-radius:100px;border:none;background:${window.ommyAutoSync.status().enabled ? 'linear-gradient(145deg,#8B5CF6,#6D28D9)' : 'var(--beige-2)'};cursor:pointer;position:relative">
              <span style="position:absolute;top:3px;${window.ommyAutoSync.status().enabled ? 'left:3px;' : 'right:3px;'}width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.15)"></span>
            </button>
          </div>
          <button onclick="ommyAutoSyncNow()" type="button" style="width:100%;margin-top:10px;padding:10px;border:1px solid var(--line);border-radius:10px;background:var(--cream);color:var(--ink-2);font-family:var(--font-heading);font-weight:800;font-size:0.72rem;cursor:pointer">🔄 مزامنة الآن</button>
        </div>
      ` : ''}

      ${configured ? `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
          <button onclick="ommySync.push()" type="button" style="padding:12px;border:none;border-radius:12px;background:linear-gradient(145deg,var(--lavender),var(--lavender-deep));color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.78rem;cursor:pointer">☁️ رفع</button>
          <button onclick="ommySync.pull()" type="button" style="padding:12px;border:1.5px solid var(--lavender);border-radius:12px;background:var(--cream);color:var(--lavender-deep);font-family:var(--font-heading);font-weight:900;font-size:0.78rem;cursor:pointer">📥 سحب</button>
        </div>
        ${status ? `<div style="font-size:0.68rem;color:var(--ink-3);text-align:center;line-height:1.6">
          معرف المستخدم: <code style="font-family:monospace;font-size:0.62rem;background:var(--beige);padding:2px 6px;border-radius:6px">${status.userId.substring(0, 16)}...</code>
        </div>` : ''}
      ` : `
        <div style="text-align:center;padding:14px;background:var(--beige);border-radius:12px;font-size:0.72rem;color:var(--ink-2);line-height:1.7">
          📖 لتفعيل المزامنة، اتبعي الدليل في <code>lib/sync.js</code>
        </div>
      `}
    </div>
  `;
}

/* ============ قسم المشاركة العائلية ============ */
function renderFamilySection() {
  const fam = window.ommyFamily;
  if (!fam) return '';

  const info = fam.info();
  const myId = fam.myUserId();
  const members = info.members || [];

  return `
    <div class="card" style="padding:16px;margin-bottom:20px">
      <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:14px">
        <span style="width:52px;height:52px;border-radius:16px;background:#FCE7F3;display:grid;place-items:center;font-size:1.5rem;flex-shrink:0">👨‍👩‍👧</span>
        <div style="flex:1;min-width:0">
          <div style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem;color:#BE185D;margin-bottom:4px">المشاركة العائلية</div>
          <div style="font-size:0.74rem;color:var(--ink-2);line-height:1.6">
            شاركي بيانات الطفل مع الزوج/الشريكة
          </div>
        </div>
      </div>

      ${myId ? `
        <div style="margin-bottom:12px">
          <div style="font-size:0.68rem;font-weight:800;color:var(--ink-3);margin-bottom:6px">🆔 معرفك</div>
          <div style="display:flex;gap:8px;align-items:center">
            <code style="flex:1;font-family:monospace;font-size:0.68rem;background:var(--beige);padding:10px 12px;border-radius:12px;direction:ltr;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${myId}</code>
            <button onclick="ommyFamilyCopyId()" type="button" style="padding:10px 14px;border:none;border-radius:12px;background:linear-gradient(145deg,#EC4899,#BE185D);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.72rem;cursor:pointer">📋 نسخ</button>
          </div>
        </div>
      ` : ''}

      ${members.length > 0 ? `
        <div style="margin-bottom:12px;padding:12px;background:var(--rose-soft);border-radius:12px">
          <div style="font-size:0.68rem;font-weight:800;color:var(--clay-deep);margin-bottom:6px">👥 الأعضاء (${members.length})</div>
          ${members.map(m => `
            <div style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:0.72rem">
              <span style="width:8px;height:8px;border-radius:50%;background:var(--mint-deep);flex-shrink:0"></span>
              <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;direction:ltr;text-align:start">${m.userId}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <button onclick="ommyFamilyJoin()" type="button" style="padding:12px;border:none;border-radius:12px;background:linear-gradient(145deg,#EC4899,#BE185D);color:#fff;font-family:var(--font-heading);font-weight:900;font-size:0.78rem;cursor:pointer">🔗 انضمي</button>
        <button onclick="ommyFamilyGenerateCode()" type="button" style="padding:12px;border:1.5px solid #EC4899;border-radius:12px;background:var(--cream);color:#BE185D;font-family:var(--font-heading);font-weight:900;font-size:0.78rem;cursor:pointer">🎫 رمز الدعوة</button>
      </div>

      ${info.isSharing ? `
        <button onclick="ommyFamilyStop()" type="button" style="width:100%;margin-top:8px;padding:10px;border:1.5px solid var(--line);border-radius:12px;background:var(--cream);color:var(--red-deep);font-family:var(--font-heading);font-weight:800;font-size:0.72rem;cursor:pointer">إيقاف المشاركة</button>
      ` : ''}
    </div>
  `;
}

/* ============ قسم الأطفال (جديد) ============ */
function renderChildrenSection() {
  const manager = window.ommyChildManager;
  if (!manager) return '';

  const kids = manager.all();
  const active = manager.active();

  return `
    <div class="card" style="padding:16px;margin-bottom:20px">
      ${kids.map(k => {
        const age = k.birthDate ? manager.preciseAge(k.birthDate) : null;
        const isActive = k.id === active?.id;
        const genderIcon = k.gender === 'girl' ? '👧' : '👶';

        return `
          <div style="display:flex;gap:12px;align-items:center;padding:12px;border:2px solid ${isActive ? 'var(--rose)' : 'var(--line)'};border-radius:16px;margin-bottom:10px;background:${isActive ? 'linear-gradient(135deg,var(--rose-soft),var(--lavender-soft))' : 'var(--cream)'};transition:all .2s">
            <button onclick="ommySwitchChildFromSettings('${k.id}')" type="button" style="width:48px;height:48px;border-radius:14px;background:${isActive ? 'linear-gradient(145deg,var(--rose),var(--clay-deep))' : 'var(--rose-soft)'};color:${isActive ? '#fff' : 'var(--clay-deep)'};display:grid;place-items:center;font-size:1.5rem;flex-shrink:0;border:none;cursor:pointer">${genderIcon}</button>

            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                <b style="font-family:var(--font-heading);font-weight:900;font-size:0.9rem;color:var(--ink)">${k.name}</b>
                ${isActive ? '<span style="font-size:0.6rem;font-weight:900;color:#fff;background:var(--clay-deep);padding:2px 8px;border-radius:100px">نشط</span>' : ''}
              </div>
              <div style="font-size:0.7rem;color:var(--ink-3);line-height:1.5">
                📅 ${k.birthDate || 'تاريخ غير محدد'}
                ${age ? '<br>🎂 ' + age.label : ''}
                ${k.weight ? '<br>⚖️ ' + k.weight + ' كجم' : ''}
              </div>
            </div>

            <div style="display:flex;flex-direction:column;gap:4px">
              <button onclick="ommyEditChild('${k.id}')" type="button" style="width:34px;height:34px;border-radius:10px;background:var(--cream);border:1.5px solid var(--line);color:var(--ink-2);cursor:pointer;font-size:0.9rem;display:grid;place-items:center">✏️</button>
              ${kids.length > 1 ? `<button onclick="ommyDeleteChild('${k.id}')" type="button" style="width:34px;height:34px;border-radius:10px;background:var(--red-soft);border:1.5px solid var(--red);color:var(--red-deep);cursor:pointer;font-size:0.9rem;display:grid;place-items:center">🗑️</button>` : ''}
            </div>
          </div>
        `;
      }).join('')}

      <button onclick="ommyOpenAddChildForm()" type="button" style="width:100%;padding:14px;border:2px dashed var(--rose);background:transparent;border-radius:16px;cursor:pointer;font-family:var(--font-heading);font-weight:900;font-size:0.85rem;color:var(--clay-deep);margin-top:6px">➕ إضافة طفل جديد</button>
    </div>
  `;
}

window.ommySwitchChildFromSettings = function(id) {
  const res = window.ommyChildManager.switchTo(id);
  if (res.error) {
    if (window.toast) window.toast(res.error, { type: 'error' });
    return;
  }
  if (window.haptic) window.haptic('success');
  if (window.ommySound?.success) window.ommySound.success();
  if (window.toast) window.toast('✅ ' + res.child.name + ' نشط الآن', { type: 'success', duration: 1800 });
  if (window.ommyRefresh) setTimeout(() => window.ommyRefresh(), 200);
};

/* استخدم النموذج الجديد الكامل */
window.ommyEditChild = function(id) {
  if (window.ommyEditChildForm) {
    window.ommyEditChildForm(id);
  }
};

window.ommyDeleteChild = function(id) {
  const manager = window.ommyChildManager;
  const child = manager.all().find(k => k.id === id);
  if (!child) return;

  if (window.ommyConfirm) {
    window.ommyConfirm('حذف ' + child.name + '؟', 'سيتم حذف كل بيانات هذا الطفل', {
      danger: true, confirmText: 'احذفي', cancelText: 'إلغاء'
    }).then(ok => {
      if (!ok) return;
      const res = manager.remove(id);
      if (res.error) {
        if (window.toast) window.toast(res.error, { type: 'warning' });
        return;
      }
      if (window.toast) window.toast('🗑️ تم الحذف', { type: 'success' });
      if (window.ommyRefresh) window.ommyRefresh();
    });
  }
};
