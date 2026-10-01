/* =====================================================================
   article.js — hiệu ứng dùng CHUNG cho mọi trang bài viết chi tiết
   Dùng chung biến `reduceMotion` từ script.js khi có (các thẻ <script>
   chia sẻ chung phạm vi toàn cục), có kiểm tra typeof để an toàn nếu
   chạy độc lập. Không đụng tới script.js / blog.js.
   ===================================================================== */
const artReduceMotion = (typeof reduceMotion !== 'undefined')
 ? reduceMotion
 : matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Thanh tiến trình đọc bài ---------- */
(function initProgress(){
 const bar = document.querySelector('.article-progress');
 const prose = document.querySelector('.article-prose');
 if(!bar || !prose) return;

 const update = ()=>{
  const start = prose.offsetTop;
  const total = prose.offsetHeight - innerHeight * 0.5;
  const scrolled = scrollY - start + 160;
  const pct = total > 0 ? Math.max(0, Math.min(100, (scrolled / total) * 100)) : 0;
  bar.style.width = pct + '%';
 };
 addEventListener('scroll', update, {passive:true});
 addEventListener('resize', update);
 update();
})();

/* ---------- Mục lục: cuộn mượt tới từng mục + tô đậm mục đang đọc ---------- */
(function initToc(){
 const links = [...document.querySelectorAll('.article-toc a[href^="#"]')];
 if(!links.length) return;
 const targets = links.map(a => document.querySelector(a.getAttribute('href')));

 links.forEach(a=>{
  a.addEventListener('click', (e)=>{
   const target = document.querySelector(a.getAttribute('href'));
   if(!target) return;
   e.preventDefault();
   target.scrollIntoView({behavior: artReduceMotion ? 'auto' : 'smooth', block:'start'});
  });
 });

 addEventListener('scroll', ()=>{
  const y = scrollY + 140;
  let cur = 0;
  targets.forEach((t,i)=>{ if(t && t.offsetTop <= y) cur = i; });
  links.forEach((a,i)=>a.classList.toggle('active', i===cur));
 }, {passive:true});
})();

/* ---------- Nút sao chép liên kết chia sẻ ---------- */
(function initCopyLink(){
 const btn = document.querySelector('[data-copy-link]');
 if(!btn) return;
 const originalLabel = btn.getAttribute('aria-label') || 'Sao chép liên kết';

 btn.addEventListener('click', async ()=>{
  try{
   await navigator.clipboard.writeText(location.href);
  }catch(err){
   // Trình duyệt/môi trường không hỗ trợ clipboard API (ví dụ mở file trực tiếp)
   window.prompt('Sao chép liên kết bài viết:', location.href);
  }
  btn.classList.add('copied');
  btn.setAttribute('aria-label','Đã sao chép liên kết');
  setTimeout(()=>{
   btn.classList.remove('copied');
   btn.setAttribute('aria-label', originalLabel);
  }, 1800);
 });
})();
