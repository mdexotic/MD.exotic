// cms-apply.js — зарежда съдържанието от content/*.json
async function applyCMSData(){
  const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
  const $ = sel => document.querySelector(sel);

  try{
    const [site, prices, process, reviews, faq] = await Promise.all([
      fetch('/content/site.json').then(r=>r.json()),
      fetch('/content/prices.json').then(r=>r.json()),
      fetch('/content/process.json').then(r=>r.json()).catch(()=>({steps:[]})),
      fetch('/content/reviews.json').then(r=>r.json()).catch(()=>({items:[]})),
      fetch('/content/faq.json').then(r=>r.json()).catch(()=>({items:[]}))
    ]);

    // Hero & Contacts
    set('hero-title', site.hero_title);
    set('hero-subtitle', site.hero_subtitle);
    set('phone-1', site.phone1);
    set('phone-2', site.phone2);
    set('email-text', site.email);
    set('address-text', site.address);
    set('hours-text', site.hours);
    if (typeof site.promo_percent !== 'undefined') set('promo-discount', `-${site.promo_percent}% за нов клиент`);

    // Prices
    if (prices?.exterior_one_step) set('price-one-step', `Екстериор 1 стъпка — Кола ${prices.exterior_one_step.car} лв · Джип ${prices.exterior_one_step.suv} лв`);
    if (prices?.exterior_two_step) set('price-two-step', `Екстериор 2 стъпки — Кола ${prices.exterior_two_step.car} лв · Джип ${prices.exterior_two_step.suv} лв`);
    if (prices?.ceramic) set('price-ceramic-from', `Керамика — от ${prices.ceramic.from} лв (${(prices.ceramic.years_options||[]).join('/')} г.)`);
    if (typeof prices?.wax_from !== 'undefined') set('price-wax-from', `Вакса — от ${prices.wax_from} лв`);
    if (prices?.headlights_combo) set('price-headlights', `${prices.headlights_combo.label} — ${prices.headlights_combo.range} лв`);
    if (typeof prices?.promo_discount_percent !== 'undefined') set('promo-discount', `-${prices.promo_discount_percent}% за нов клиент`);

    // Process
    const ps = $('#process-steps');
    if (ps && process?.steps?.length){
      ps.innerHTML = process.steps.map(s => `<div class="step"><strong>${s.title}</strong><div>${s.text}</div></div>`).join('');
    }

    // Reviews
    const rl = $('#reviews-list');
    if (rl && reviews?.items?.length){
      rl.innerHTML = reviews.items.map(r => `<div class="review"><strong>${r.name}</strong> — ${'★'.repeat(r.rating||5)}<div>${r.text}</div></div>`).join('');
    }

    // FAQ
    const fl = $('#faq-list');
    if (fl && faq?.items?.length){
      fl.innerHTML = faq.items.map(q => `<details class="q"><summary>${q.q}</summary><div>${q.a}</div></details>`).join('');
    }

  }catch(e){
    console.warn('CMS data load error:', e);
  }
}
document.addEventListener('DOMContentLoaded', applyCMSData);
