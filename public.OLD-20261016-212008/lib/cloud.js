/* النسخ الاحتياطي المحلي — تصدير واستعادة جميع بيانات أُمّي */
const PREFIX = 'ommi_';

function readOmmiStorage() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(PREFIX)) continue;
    try { data[key] = JSON.parse(localStorage.getItem(key)); }
    catch (_) { /* ignore malformed legacy values instead of failing the whole export */ }
  }
  return data;
}

export const Backup = {
  create() {
    const storage = readOmmiStorage();
    return {
      app: 'ommi',
      version: 2,
      created: new Date().toISOString(),
      storage,
      // Readable summary for users and older tools; the storage map is authoritative.
      children: storage[`${PREFIX}children`] || [],
      baby: storage[`${PREFIX}baby`] || null,
      favorites: storage[`${PREFIX}favorites`] || [],
      settings: Object.fromEntries(Object.entries(storage)
        .filter(([key]) => key.startsWith(`${PREFIX}set_`))
        .map(([key, value]) => [key.slice(`${PREFIX}set_`.length), value])),
      logs: Object.fromEntries(Object.entries(storage)
        .filter(([key]) => key.startsWith(`${PREFIX}log_`))
        .map(([key, value]) => [key.slice(`${PREFIX}log_`.length), value])),
    };
  },

  download() {
    const data = this.create();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ommi-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  },

  async restore(file) {
    try {
      if (!file || typeof file.text !== 'function') throw new Error('اختاري ملف نسخة احتياطية صالحًا');
      const data = JSON.parse(await file.text());
      if (!data || data.app !== 'ommi' || typeof data !== 'object') throw new Error('ملف غير معروف');

      // Validate the full replacement before touching current data.
      let entries;
      if (data.storage && typeof data.storage === 'object' && !Array.isArray(data.storage)) {
        entries = Object.entries(data.storage);
        if (entries.some(([key]) => !key.startsWith(PREFIX))) throw new Error('يحتوي الملف على مفاتيح غير مسموح بها');
        for (const [, value] of entries) JSON.stringify(value);
      } else {
        // Backward compatibility with version 1 backups.
        const legacy = {};
        if (data.children !== undefined) legacy[`${PREFIX}children`] = data.children;
        if (data.baby !== undefined && data.baby !== null) legacy[`${PREFIX}baby`] = data.baby;
        if (data.favorites !== undefined) legacy[`${PREFIX}favorites`] = data.favorites;
        for (const [key, value] of Object.entries(data.settings || {})) legacy[`${PREFIX}set_${key}`] = value;
        for (const [date, value] of Object.entries(data.logs || {})) legacy[`${PREFIX}log_${date}`] = value;
        entries = Object.entries(legacy);
        for (const [, value] of entries) JSON.stringify(value);
      }

      // Replace only Ommi's own keys; preserve unrelated applications' local storage.
      const remove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(PREFIX)) remove.push(key);
      }
      remove.forEach(key => localStorage.removeItem(key));
      for (const [key, value] of entries) localStorage.setItem(key, JSON.stringify(value));
      return { success: true, data, restoredKeys: entries.length };
    } catch (e) {
      return { success: false, error: e?.message || 'تعذرت استعادة النسخة' };
    }
  },

  shareText() {
    const data = this.create();
    const summary = `📊 ملخص أُمّي - ${new Date().toLocaleDateString('ar')}\n\n👶 الأطفال: ${data.children.length}\n📝 أيام مسجلة: ${Object.keys(data.logs).length}\n⭐ المفضلة: ${data.favorites.length}\n\n🌸 أُمّي - رفيق الأم العربية`.trim();
    if (navigator.share) {
      navigator.share({ title: 'ملخص أُمّي', text: summary }).catch(() => {});
    } else if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(summary)
        .then(() => window.toast?.('📋 تم نسخ الملخص', { type: 'success' }))
        .catch(() => window.toast?.('تعذّر النسخ على هذا المتصفح', { type: 'error' }));
    } else {
      window.toast?.('المشاركة غير مدعومة على هذا الجهاز', { type: 'error' });
    }
  },

  size() {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(PREFIX)) total += (localStorage.getItem(key) || '').length;
    }
    return total;
  },
};

window.ommyBackup = Backup;
window.ommyDownloadBackup = () => {
  Backup.download();
  window.toast?.('📤 تم تجهيز النسخة الاحتياطية', { type: 'success' });
};
window.ommyShareSummary = () => Backup.shareText();
