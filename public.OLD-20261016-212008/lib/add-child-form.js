/* ============================================
   نموذج إضافة طفل — احترافي وكامل
   ============================================ */
import { ChildManager } from './children.js';

let formState = {
  name: '',
  birthDate: '',
  gender: 'boy',
  weight: '',
  height: '',
  headCirc: '',
  bloodType: '',
  allergies: '',
  notes: '',
};

export function openAddChildForm() {
  /* إعادة تعيين */
  formState = {
    name: '',
    birthDate: '',
    gender: 'boy',
    weight: '',
    height: '',
    headCirc: '',
    bloodType: '',
    allergies: '',
    notes: '',
  };

  renderForm('إضافة طفل جديد', 'add');
}

export function openEditChildForm(id) {
  const child = ChildManager.all().find(k => k.id === id);
  if (!child) return;

  formState = {
    name: child.name || '',
    birthDate: child.birthDate || '',
    gender: child.gender || 'boy',
    weight: child.weight || '',
    height: child.height || '',
    headCirc: child.headCirc || '',
    bloodType: child.bloodType || '',
    allergies: (child.allergies || []).join('، '),
    notes: child.notes || '',
  };

  renderForm('✏️ تعديل ' + child.name, 'edit', id);
}

function renderForm(title, mode, editId = null) {
  const html = `
    <div style="text-align:start;max-height:70vh;overflow-y:auto;padding:4px">

      <!-- الاسم -->
      <label style="display:block;font-family:var(--font-heading);font-weight:900;font-size:0.8rem;color:var(--ink);margin-bottom:6px">
        👶 اسم الطفل <span style="color:var(--rose)">*</span>
      </label>
      <input type="text" id="acf-name" value="${formState.name}" placeholder="مثال: آدم"
        style="width:100%;padding:12px 14px;border:2px solid var(--line);border-radius:14px;
        background:var(--cream);font-family:var(--font-body);font-size:0.9rem;margin-bottom:14px;
        color:var(--ink)" />

      <!-- تاريخ الميلاد -->
      <label style="display:block;font-family:var(--font-heading);font-weight:900;font-size:0.8rem;color:var(--ink);margin-bottom:6px">
        📅 تاريخ الميلاد <span style="color:var(--rose)">*</span>
      </label>
      <input type="date" id="acf-birth" value="${formState.birthDate}"
        style="width:100%;padding:12px 14px;border:2px solid var(--line);border-radius:14px;
        background:var(--cream);font-family:var(--font-body);font-size:0.9rem;margin-bottom:14px;
        color:var(--ink)" />

      <!-- الجنس -->
      <label style="display:block;font-family:var(--font-heading);font-weight:900;font-size:0.8rem;color:var(--ink);margin-bottom:8px">
        ⚧ الجنس
      </label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px">
        <button type="button" id="acf-boy" onclick="ommyFormGender('boy')"
          style="padding:14px;border:2px solid ${formState.gender === 'boy' ? 'var(--blue)' : 'var(--line)'};
          border-radius:14px;background:${formState.gender === 'boy' ? 'linear-gradient(135deg,#dff3fa,#b8e4f2)' : 'var(--cream)'};
          cursor:pointer;font-family:var(--font-heading);font-weight:900;font-size:0.9rem;
          color:var(--ink);display:flex;align-items:center;justify-content:center;gap:8px">
          👶 ولد
        </button>
        <button type="button" id="acf-girl" onclick="ommyFormGender('girl')"
          style="padding:14px;border:2px solid ${formState.gender === 'girl' ? 'var(--rose)' : 'var(--line)'};
          border-radius:14px;background:${formState.gender === 'girl' ? 'linear-gradient(135deg,var(--rose-soft),#f7d5e0)' : 'var(--cream)'};
          cursor:pointer;font-family:var(--font-heading);font-weight:900;font-size:0.9rem;
          color:var(--ink);display:flex;align-items:center;justify-content:center;gap:8px">
          👧 بنت
        </button>
      </div>

      <!-- القياسات -->
      <div style="background:var(--rose-soft);padding:12px;border-radius:14px;margin-bottom:14px">
        <div style="font-family:var(--font-heading);font-weight:900;font-size:0.78rem;color:var(--clay-deep);margin-bottom:10px">📏 القياسات (اختياري)</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">
          <div>
            <label style="display:block;font-size:0.7rem;color:var(--ink-2);margin-bottom:4px">⚖️ الوزن (كجم)</label>
            <input type="number" step="0.1" id="acf-weight" value="${formState.weight}" placeholder="10.5"
              style="width:100%;padding:10px;border:1.5px solid var(--line);border-radius:10px;
              background:var(--cream);font-family:var(--font-body);font-size:0.85rem;color:var(--ink)" />
          </div>
          <div>
            <label style="display:block;font-size:0.7rem;color:var(--ink-2);margin-bottom:4px">📏 الطول (سم)</label>
            <input type="number" step="0.1" id="acf-height" value="${formState.height}" placeholder="78"
              style="width:100%;padding:10px;border:1.5px solid var(--line);border-radius:10px;
              background:var(--cream);font-family:var(--font-body);font-size:0.85rem;color:var(--ink)" />
          </div>
        </div>

        <div>
          <label style="display:block;font-size:0.7rem;color:var(--ink-2);margin-bottom:4px">🧠 محيط الرأس (سم)</label>
          <input type="number" step="0.1" id="acf-head" value="${formState.headCirc}" placeholder="46"
            style="width:100%;padding:10px;border:1.5px solid var(--line);border-radius:10px;
            background:var(--cream);font-family:var(--font-body);font-size:0.85rem;color:var(--ink)" />
        </div>
      </div>

      <!-- معلومات طبية -->
      <div style="background:var(--lavender-soft);padding:12px;border-radius:14px;margin-bottom:14px">
        <div style="font-family:var(--font-heading);font-weight:900;font-size:0.78rem;color:var(--ink);margin-bottom:10px">🏥 معلومات طبية (اختياري)</div>

        <label style="display:block;font-size:0.7rem;color:var(--ink-2);margin-bottom:4px">🩸 فصيلة الدم</label>
        <input type="text" id="acf-blood" value="${formState.bloodType}" placeholder="O+"
          style="width:100%;padding:10px;border:1.5px solid var(--line);border-radius:10px;
          background:var(--cream);font-family:var(--font-body);font-size:0.85rem;color:var(--ink);margin-bottom:8px" />

        <label style="display:block;font-size:0.7rem;color:var(--ink-2);margin-bottom:4px">⚠️ الحساسية</label>
        <input type="text" id="acf-allergies" value="${formState.allergies}" placeholder="حليب البقر، الفول..."
          style="width:100%;padding:10px;border:1.5px solid var(--line);border-radius:10px;
          background:var(--cream);font-family:var(--font-body);font-size:0.85rem;color:var(--ink)" />
      </div>

      <!-- ملاحظات -->
      <label style="display:block;font-family:var(--font-heading);font-weight:900;font-size:0.8rem;color:var(--ink);margin-bottom:6px">
        📝 ملاحظات
      </label>
      <textarea id="acf-notes" placeholder="أي شيء تودين تذكره..."
        style="width:100%;padding:12px 14px;border:2px solid var(--line);border-radius:14px;
        background:var(--cream);font-family:var(--font-body);font-size:0.85rem;min-height:70px;
        resize:vertical;color:var(--ink)">${formState.notes}</textarea>

    </div>
  `;

  if (window.showModal) {
    window.showModal({
      type: 'question',
      title: title,
      message: html,
      confirmText: mode === 'add' ? '➕ إضافة' : '💾 حفظ',
      cancelText: 'إلغاء',
      onConfirm: () => {
        const data = {
          name: document.getElementById('acf-name')?.value?.trim(),
          birthDate: document.getElementById('acf-birth')?.value,
          gender: formState.gender,
          weight: document.getElementById('acf-weight')?.value,
          height: document.getElementById('acf-height')?.value,
          headCirc: document.getElementById('acf-head')?.value,
          bloodType: document.getElementById('acf-blood')?.value?.trim(),
          allergies: (document.getElementById('acf-allergies')?.value || '')
            .split(/[،,]/).map(s => s.trim()).filter(Boolean),
          notes: document.getElementById('acf-notes')?.value?.trim(),
        };

        /* التحقق */
        if (!data.name) {
          if (window.toast) window.toast('⚠️ الاسم مطلوب', { type: 'warning' });
          return false;
        }
        if (!data.birthDate) {
          if (window.toast) window.toast('⚠️ تاريخ الميلاد مطلوب', { type: 'warning' });
          return false;
        }

        if (mode === 'add') {
          const res = ChildManager.add(data);
          if (res && res.id) {
            ChildManager.switchTo(res.id);
            if (window.haptic) window.haptic('success');
            if (window.ommySound?.celebrate) window.ommySound.celebrate();
            if (window.toast) window.toast('✅ تمت إضافة ' + data.name, { type: 'success', duration: 2500 });
            if (window.ommyRefresh) setTimeout(() => window.ommyRefresh(), 300);
          }
        } else {
          ChildManager.update(editId, data);
          if (window.haptic) window.haptic('success');
          if (window.toast) window.toast('✅ تم الحفظ', { type: 'success' });
          if (window.ommyRefresh) setTimeout(() => window.ommyRefresh(), 200);
        }
        return true;
      },
    });
  }
}

window.ommyFormGender = function(g) {
  formState.gender = g;

  const boyBtn = document.getElementById('acf-boy');
  const girlBtn = document.getElementById('acf-girl');

  if (boyBtn) {
    boyBtn.style.border = g === 'boy' ? '2px solid var(--blue)' : '2px solid var(--line)';
    boyBtn.style.background = g === 'boy' ? 'linear-gradient(135deg,#dff3fa,#b8e4f2)' : 'var(--cream)';
  }
  if (girlBtn) {
    girlBtn.style.border = g === 'girl' ? '2px solid var(--rose)' : '2px solid var(--line)';
    girlBtn.style.background = g === 'girl' ? 'linear-gradient(135deg,var(--rose-soft),#f7d5e0)' : 'var(--cream)';
  }

  if (window.haptic) window.haptic('light');
};

/* ربط عام */
window.ommyOpenAddChildForm = openAddChildForm;
window.ommyEditChild = openEditChildForm;
