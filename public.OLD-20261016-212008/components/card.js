/* ============================================
   مكون البطاقة — يُستخدم في كل الشاشات
   ============================================ */

export function Card({
  title = '',
  subtitle = '',
  icon = '',
  color = 'clay',
  body = '',
  className = '',
} = {}) {
  const isHero = className.includes('hero');

  return `
    <article class="card ${className}" style="${isHero ? `--card-color: var(--${color})` : ''}">
      ${icon || title ? `
        <header class="card__head">
          ${icon ? `<span class="card__icon" style="background: var(--${color}-soft)">${icon}</span>` : ''}
          <div class="card__titles">
            ${title ? `<h3 class="card__title">${title}</h3>` : ''}
            ${subtitle ? `<p class="card__subtitle">${subtitle}</p>` : ''}
          </div>
        </header>
      ` : ''}
      ${body ? `<div class="card__body">${body}</div>` : ''}
    </article>
  `;
}
