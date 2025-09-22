async function applyCMSData(){
  try{
    const site = await fetch('/content/site.json').then(r=>r.json());
    const prices = await fetch('/content/prices.json').then(r=>r.json());
    const set = (id, text) => { const el = document.getElementById(id); if(el) el.textContent = text; };
    set('hero-title', site.hero_title);
    set('hero-subtitle', site.hero_subtitle);
    set('phone-1', site.phone1);
    set('phone-2', site.phone2);
    set('email-text', site.email);
    set('address-text', site.address);
    set('hours-text', site.hours);
    set('price-one-step', `Кола ${prices.one_step.car} · Джип ${prices.one_step.suv}`);
    set('price-two-step', `Кола ${prices.two_step.car} · Джип ${prices.two_step.suv}`);
    set('price-ceramic-from', `От ${prices.ceramic_from} лв (1/3/5 г.)`);
    set('price-wax-from', `От ${prices.wax_from} лв`);
    set('price-headlights', `${prices.headlights} лв`);
  }catch(e){ console.warn('CMS data not applied:', e); }
}
document.addEventListener('DOMContentLoaded', applyCMSData);
