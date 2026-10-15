/* ============================================
   نظام الشارات والإنجازات
   ============================================ */
import { Storage } from './storage.js';

export const Badges = {
  /* قائمة كل الشارات الممكنة */
  all: [
    { id: 'start',      icon: '🌱', title: 'البداية',        desc: 'سجلتِ حملك لأول مرة' },
    { id: 'week10',     icon: '🌿', title: 'عشرة أسابيع',    desc: 'أكملتِ 10 أسابيع' },
    { id: 'week13',     icon: '🎉', title: 'الثلث الأول',     desc: 'أكملتِ الثلث الأول' },
    { id: 'week20',     icon: '🌟', title: 'منتصف الطريق',   desc: 'أكملتِ 20 أسبوعاً' },
    { id: 'week27',     icon: '🌸', title: 'الثلث الثالث',    desc: 'بدأتِ الثلث الأخير' },
    { id: 'week36',     icon: '💗', title: 'شهر أخير',        desc: 'بقي شهر واحد' },
    { id: 'week40',     icon: '🎀', title: 'الوقت حان',       desc: 'أكملتِ الحمل!' },
    { id: 'tracker',    icon: '📊', title: 'متابعة دقيقة',    desc: 'سجلتِ 7 أيام متتالية' },
    { id: 'meds',       icon: '💊', title: 'ملتزمة',          desc: 'سجلتِ 10 جرعات' },
    { id: 'reader',     icon: '📚', title: 'قارئة',           desc: 'قرأتِ 5 قصص' },
    { id: 'memory',     icon: '💝', title: 'حافظة الذكريات',  desc: 'أضفتِ 5 لحظات' },
    { id: 'night_owl',  icon: '🌙', title: 'أم صبورة',        desc: 'سجلتِ 5 مرات ليلاً' },
  ],

  /* الشارات المكتسبة */
  earned() {
    return Storage.get('badges', []);
  },

  /* منح شارة */
  grant(id) {
    const all = this.earned();
    if (all.includes(id)) return false;
    all.push(id);
    Storage.set('badges', all);

    const badge = this.all.find(b => b.id === id);
    if (badge && window.toast) {
      window.toast(`🏆 شارة جديدة: ${badge.title}`, {
        type: 'success',
        icon: badge.icon,
        duration: 3500,
      });
    }
    if (window.ommySound?.celebrate) window.ommySound.celebrate();
    if (window.haptic) window.haptic('success');
    return true;
  },

  /* فحص تلقائي للشارات */
  autoCheck() {
    const preg = Storage.get('pregnancy', null);
    if (preg && preg.lmp) {
      const lmp = new Date(preg.lmp);
      const weeks = Math.floor((new Date() - lmp) / (1000 * 60 * 60 * 24 * 7));

      this.grant('start');
      if (weeks >= 10) this.grant('week10');
      if (weeks >= 13) this.grant('week13');
      if (weeks >= 20) this.grant('week20');
      if (weeks >= 27) this.grant('week27');
      if (weeks >= 36) this.grant('week36');
      if (weeks >= 40) this.grant('week40');
    }

    /* المذكرة */
    const memories = Storage.get('memories', []);
    if (memories.length >= 5) this.grant('memory');

    /* الأدوية */
    const meds = Storage.get('medications', []);
    const totalDoses = meds.reduce((sum, m) => sum + (m.history?.length || 0), 0);
    if (totalDoses >= 10) this.grant('meds');
  },

  /* عدد الشارات */
  count() {
    return this.earned().length;
  },
};

window.ommyBadges = Badges;
window.ommyCheckBadges = () => Badges.autoCheck();

/* فحص تلقائي عند التشغيل */
setTimeout(() => Badges.autoCheck(), 2000);
