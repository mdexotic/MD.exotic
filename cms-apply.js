// cms-apply.js — зарежда content/*.json и пълни ID-тата в страницата
(async function () {
  const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text ?? ""; };
  const $  = (sel) => document.querySelector(sel);

  // помощник за tel: линкове дори ако има текст "Мартин: 0988..."
  const setTel = (id, value) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value || "";
    const digits = (value || "").replace(/\D/g, "");
    const a = el.closest("a");
    if (a && digits) a.setAttribute("href", "tel:" + digits);
  };

  // fetch без кеш
  const j = async (url) => (await fetch(url + "?v=" + Date.now(), { cache: "no-store" })).json();

  try {
    const site    = await j("/content/site.json");
    const prices  = await j("/content/prices.json");
    const process = await j("/content/process.json").catch(() => ({ steps: [] }));
    const reviews = await j("/content/reviews.json").catch(() => ({ items: [] }));
    const faq     = await j("/content/faq.json").catch(() => ({ items: [] }));

    // === HERO === (snake_case според config.yml)
    set("hero-title",    site.hero_title);
    set("hero-subtitle", site.hero_subtitle);

    // промо – показваме като “-10% за нов клиент”
    if (typeof site.promo_percent !== "undefined") {
      set("promo-discount", `-${site.promo_percent}% за нов клиент`);
      const el = document.getElementById("hero-promo");
      if (el) el.textContent = `-${site.promo_percent}% за нов клиент`;
    }

    // === КОНТАКТИ ===
    setTel("phone-1", site.phone1);
    setTel("phone-2", site.phone2);

    const emailEl = document.getElementById("email-text");
    if (emailEl) {
      emailEl.textContent = site.email || "";
      if (site.email) emailEl.setAttribute("href", "mailto:" + site.email);
    }
    set("address-text", site.address);
    set("hours-text",   site.hours);

    // === ЦЕНИ ===
    if (prices?.exterior_one_step) {
      set("price-one-step",
        `Екстериор 1 стъпка — Кола ${prices.exterior_one_step.car} лв · Джип ${prices.exterior_one_step.suv} лв`
      );
    }
    if (prices?.exterior_two_step) {
      set("price-two-step",
        `Екстериор 2 стъпки — Кола ${prices.exterior_two_step.car} лв · Джип ${prices.exterior_two_step.suv} лв`
      );
    }
    if (prices?.ceramic) {
      const years = (prices.ceramic.years_options || []).join("/");
      set("price-ceramic-from", `Керамика — от ${prices.ceramic.from} лв (${years} г.)`);
    }
    if (typeof prices?.wax_from !== "undefined") {
      set("price-wax-from", `Вакса — от ${prices.wax_from} лв`);
    }
    if (prices?.headlights_combo) {
      set("price-headlights", `${prices.headlights_combo.label} — ${prices.headlights_combo.range} лв`);
    }
    // ако имаме глобална промо-стойност в prices.json – предпочитаме нея
    if (typeof prices?.promo_discount_percent !== "undefined") {
      set("promo-discount", `-${prices.promo_discount_percent}% за нов клиент`);
      const el = document.getElementById("hero-promo");
      if (el) el.textContent = `-${prices.promo_discount_percent}% за нов клиент`;
    }

    // === ПРОЦЕС ===
    const ps = $("#process-steps");
    if (ps && process?.steps?.length) {
      ps.innerHTML = process.steps
        .map(s => `<div class="step"><strong>${s.title}</strong><div>${s.text}</div></div>`)
        .join("");
    }

    // === ОТЗИВИ ===
    const rl = $("#reviews-list");
    if (rl && reviews?.items?.length) {
      rl.innerHTML = reviews.items
        .map(r => `<div class="review"><strong>${r.name}</strong> — ${"★".repeat(r.rating || 5)}<div>${r.text}</div></div>`)
        .join("");
    }

    // === FAQ ===
    const fl = $("#faq-list");
    if (fl && faq?.items?.length) {
      fl.innerHTML = faq.items
        .map(q => `<details class="q"><summary>${q.q}</summary><div>${q.a}</div></details>`)
        .join("");
    }
  } catch (e) {
    console.warn("CMS data load error:", e);
  }
})();
