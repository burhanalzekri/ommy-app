/* ============================================
   شاشة البحث الشامل
   ============================================ */
import { Search } from '../lib/search.js';

window.ommyLiveSearch = function(query) {
  const results = document.getElementById('searchResults');
  if (!results) return;

  if (!query || query.length < 2) {
    results.innerHTML = renderEmpty();
    return;
  }

  const found = Search.query(query);

  if (found.length === 0) {
    results.innerHTML = `
      <div style="text-align:center;padding:40px 20px">
        <div style="font-size:3rem;margin-bottom:12px">🔍</div>
        <div style="font-family:var(--font-heading);font-weight:900;font-size:1rem;color:var(--ink-2);margin-bottom:4px">لا توجد نتائج</div>
        <div style="font-size:0.78rem;color:var(--ink-3)">جرّبي كلمات أخرى</div>
      </div>
    `;
    return;
  }

  results.innerHTML = found.map(r => `
    <button onclick="ommyNavigateFromSearch('${r.route}')" type="button" style="width:100%;display:flex;gap:12px;align-items:center;background:var(--cream);border:1.5px solid var(--line);border-radius:14px;padding:12px;margin-bottom:8px;cursor:pointer;text-align:start;font-family:var(--font-body)">
      <span style="width:42px;height:42px;border-radius:12px;background:var(--rose-soft);display:grid;place-items:center;font-size:1.2rem;flex-shrink:0">${r.icon}</span>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px">
          <span style="font-family:var(--font-heading);font-weight:900;font-size:0.82rem;color:var(--ink)">${r.title}</span>
          <span style="font-size:0.6rem;font-weight:800;background:var(--beige);color:var(--ink-2);padding:2px 7px;border-radius:100px">${r.typeLabel}</span>
        </div>
        <div style="font-size:0.68rem;color:var(--ink-3);line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${r.desc}</div>
      </div>
    </button>
  `).join('');
};

window.ommyNavigateFromSearch = function(route) {
  if (window.navigate) window.navigate(route);
};

function renderEmpty() {
  return `
    <div style="text-align:center;padding:40px 20px">
      <div style="font-size:3rem;margin-bottom:12px">🔍</div>
      <div style="font-family:var(--font-heading);font-weight:900;font-size:1rem;color:var(--ink-2);margin-bottom:4px">ابحثي في كل المحتوى</div>
      <div style="font-size:0.78rem;color:var(--ink-3)">الأطعمة، الوصفات، التطعيمات، القصص، الأدعية...</div>
    </div>
  `;
}

export function SearchScreen() {
  return `
    <div style="grid-column:1/-1;width:100%">
      <div style="background:linear-gradient(135deg,var(--rose),var(--clay-deep));border-radius:24px;padding:20px;color:#fff;margin-bottom:20px;box-shadow:0 20px 45px rgba(198,93,123,.35);text-align:center">
        <div style="font-size:2.5rem;margin-bottom:8px">🔍</div>
        <div style="font-family:var(--font-heading);font-size:1.15rem;font-weight:900;margin-bottom:4px">البحث الشامل</div>
        <div style="font-size:0.78rem;opacity:.9">ابحثي في كل شيء داخل التطبيق</div>
      </div>

      <div style="position:relative;margin-bottom:16px">
        <input
          type="search"
          id="searchInput"
          placeholder="🔍 اكتبي كلمة..."
          oninput="ommyLiveSearch(this.value)"
          style="width:100%;padding:14px 16px;border:2px solid var(--rose);border-radius:16px;background:var(--cream);font-family:var(--font-body);font-size:0.9rem;color:var(--ink);outline:none;box-sizing:border-box;box-shadow:0 4px 12px rgba(198,93,123,.1)"
        />
      </div>

      <div id="searchResults">
        ${renderEmpty()}
      </div>

      <div style="margin-top:24px">
        <div style="font-family:var(--font-heading);font-size:0.8rem;font-weight:900;color:var(--ink-3);margin-bottom:12px">🔎 بحث سريع</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${['حرارة', 'نوم', 'فطام', 'تطعيم', 'عسل', 'رضاعة', 'دعاء'].map(q => `
            <button onclick="document.getElementById('searchInput').value='${q}';ommyLiveSearch('${q}')" type="button" style="padding:8px 14px;background:var(--rose-soft);color:var(--clay-deep);border:1px solid var(--rose);border-radius:100px;font-family:var(--font-heading);font-weight:800;font-size:0.72rem;cursor:pointer">${q}</button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}
