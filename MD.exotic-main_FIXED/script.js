
// Image lightbox
document.addEventListener('click', (e) => {
  const img = e.target.closest('.gallery img');
  if(!img || img.closest('.video-thumb')) return;
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.addEventListener('click', () => { document.documentElement.style.overflow=''; document.body.style.overflow=''; overlay.remove(); });
  const el = document.createElement('img');
  el.src = img.src; el.alt = img.alt;
  overlay.appendChild(el); document.body.appendChild(overlay);
  document.documentElement.style.overflow='hidden'; document.body.style.overflow='hidden';
});
// Video lightbox (muted)
document.addEventListener('click', (e) => {
  const box = e.target.closest('.video-thumb');
  if(!box) return;
  const src = box.getAttribute('data-video');
  const overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.addEventListener('click', () => { document.documentElement.style.overflow=''; document.body.style.overflow=''; overlay.remove(); });
  const vid = document.createElement('video');
  vid.src = src; vid.controls = true; vid.autoplay = true; vid.muted = true; vid.setAttribute('muted',''); vid.playsInline = true; vid.setAttribute('playsinline','');
  overlay.appendChild(vid); document.body.appendChild(overlay);
  document.documentElement.style.overflow='hidden'; document.body.style.overflow='hidden';
});
