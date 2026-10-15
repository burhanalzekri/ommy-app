/* ============================================
   مكون الإحصائية — رقم + وصف
   ============================================ */

export function Stat({ value, label, color = 'clay', icon = '' }) {
  return `
    <div class="stat" style="--stat-color: var(--${color})">
      ${icon ? `<div class="stat__icon">${icon}</div>` : ''}
      <div class="stat__value">${value}</div>
      <div class="stat__label">${label}</div>
    </div>
  `;
}

export function StatRow(stats = []) {
  return `
    <div class="stat-row" style="grid-template-columns: repeat(${stats.length}, 1fr)">
      ${stats.map(Stat).join('')}
    </div>
  `;
}
