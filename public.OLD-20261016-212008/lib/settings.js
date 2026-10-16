/* ============================================
   الإعدادات + الأطفال + المفضلة + الإحصائيات
   ============================================ */
import { Storage, localDateKey } from './storage.js';

export const Settings = {
  get(key, fallback = null) { return Storage.get('set_' + key, fallback); },
  set(key, value) { return Storage.set('set_' + key, value); },
  all() {
    return {
      language: this.get('language', 'ar'),
      notifications: this.get('notifications', true),
      activeChild: this.get('activeChild', 'child_1'),
    };
  }
};

export const Children = {
  list() {
    return Storage.get('children', [
      { id: 'child_1', name: 'آدم', birthDate: '2024-08-01', gender: 'boy', allergies: ['peanut'] },
    ]);
  },
  add(child) {
    const all = this.list();
    child.id = 'child_' + Date.now();
    all.push(child);
    Storage.set('children', all);
    return child;
  },
  remove(id) {
    const all = this.list().filter(c => c.id !== id);
    Storage.set('children', all);
  },
  active() {
    const id = Settings.get('activeChild', 'child_1');
    return this.list().find(c => c.id === id) || this.list()[0];
  },
  setActive(id) { Settings.set('activeChild', id); }
};

export const Favorites = {
  list() { return Storage.get('favorites', []); },
  has(id) { return this.list().includes(id); },
  toggle(id) {
    const all = this.list();
    const i = all.indexOf(id);
    if (i >= 0) all.splice(i, 1); else all.push(id);
    Storage.set('favorites', all);
    return this.has(id);
  }
};

export const Stats = {
  week() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = localDateKey(d);
      const log = Storage.get('log_' + key, []);
      days.push({
        date: key,
        label: ['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'][d.getDay()],
        feeds: log.filter(e => e.type === 'feed').length,
        sleeps: log.filter(e => e.type === 'sleep').length,
        diapers: log.filter(e => e.type === 'diaper').length,
        total: log.length,
      });
    }
    return days;
  },
  totals() {
    const all = this.week();
    return {
      feeds: all.reduce((s, d) => s + d.feeds, 0),
      sleeps: all.reduce((s, d) => s + d.sleeps, 0),
      diapers: all.reduce((s, d) => s + d.diapers, 0),
    };
  }
};
