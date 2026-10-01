/* ===== Có bật "giảm hiệu ứng chuyển động" không (dùng chung cho cả file) ===== */
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== Menu mobile ===== */
const burger=document.getElementById('burger'),nav=document.getElementById('nav');
if(burger&&nav){
 burger.addEventListener('click',()=>{
  const o=nav.classList.toggle('open');
  burger.setAttribute('aria-expanded',o);
  burger.textContent=o?'✕':'☰';
 });
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('open');
  burger.textContent='☰';
 }));
}

/* ===== Đánh dấu mục menu đang active (hỗ trợ nhiều trang) =====
   - Link dạng "#id"            -> cuộn trong cùng 1 trang, active theo vị trí cuộn
   - Link dạng "trang.html"
     hoặc "trang.html#id"       -> active khi đang ở đúng file trang đó            */
const allLinks=nav?[...nav.querySelectorAll('a')]:[];
const currentFile=location.pathname.split('/').pop()||'index.html';
const hashLinks=[];
allLinks.forEach(a=>{
 const href=a.getAttribute('href')||'';
 if(href.startsWith('#')){
  hashLinks.push(a);
 }else{
  const file=href.split('#')[0]||'index.html';
  a.classList.toggle('active',file===currentFile);
 }
});
if(hashLinks.length){
 const targets=hashLinks.map(a=>document.querySelector(a.getAttribute('href')));
 addEventListener('scroll',()=>{
  const y=scrollY+120;let cur=-1;
  targets.forEach((t,i)=>{if(t&&t.offsetTop<=y)cur=i});
  hashLinks.forEach((a,i)=>a.classList.toggle('active',i===cur));
 },{passive:true});
}

/* ===== Năm bản quyền ===== */
const yearEl=document.getElementById('year');
if(yearEl) yearEl.textContent=new Date().getFullYear();

/* ===== Hiệu ứng chuyển trang mượt (fade) khi bấm link sang trang khác =====
   Bỏ qua: neo trong cùng trang (#id), mailto/tel, link mở tab mới, link ngoài site. */
const PAGE_FADE_MS=260;
const isSamePageAnchor=(href)=>href.startsWith('#');
const isSkippableLink=(href)=>!href||href.startsWith('mailto:')||href.startsWith('tel:')||/^https?:\/\//i.test(href)||href.startsWith('javascript:');

if(!reduceMotion){
 document.addEventListener('click',(e)=>{
  const a=e.target.closest('a[href]');
  if(!a||a.target==='_blank') return;
  const href=a.getAttribute('href');
  if(isSamePageAnchor(href)||isSkippableLink(href)) return;
  e.preventDefault();
  document.body.classList.add('leaving');
  setTimeout(()=>{ location.href=href; },PAGE_FADE_MS);
 });
}
// Đảm bảo trang hiện lại bình thường khi quay lại bằng nút back (bfcache)
addEventListener('pageshow',()=>document.body.classList.remove('leaving'));

/* ===== Hiệu ứng motion mượt khi cuộn (fade + trượt lên) ===== */
const revealEls=document.querySelectorAll('.reveal');
if(revealEls.length){
 if(reduceMotion||!('IntersectionObserver' in window)){
  revealEls.forEach(el=>el.classList.add('in'));
 }else{
  const io=new IntersectionObserver((entries)=>{
   entries.forEach(entry=>{
    if(entry.isIntersecting){
     entry.target.classList.add('in');
     io.unobserve(entry.target);
    }
   });
  },{threshold:0.18,rootMargin:'0px 0px -40px 0px'});
  revealEls.forEach(el=>io.observe(el));
 }
}

/* ===== Đếm số chạy cho phần thống kê (data-target) ===== */
const counters=document.querySelectorAll('[data-target]');
if(counters.length){
 const animateCount=(el)=>{
  const target=parseFloat(el.dataset.target);
  const suffix=el.dataset.suffix||'';
  const decimals=el.dataset.target.includes('.')?1:0;
  const dur=1200;
  const start=performance.now();
  const step=(now)=>{
   const p=Math.min((now-start)/dur,1);
   const eased=1-Math.pow(1-p,3);
   const val=(target*eased).toFixed(decimals);
   el.textContent=val+suffix;
   if(p<1) requestAnimationFrame(step);
  };
  if(reduceMotion){
   el.textContent=target.toFixed(decimals)+suffix;
  }else{
   requestAnimationFrame(step);
  }
 };
 if('IntersectionObserver' in window){
  const io2=new IntersectionObserver((entries)=>{
   entries.forEach(entry=>{
    if(entry.isIntersecting){
     animateCount(entry.target);
     io2.unobserve(entry.target);
    }
   });
  },{threshold:0.6});
  counters.forEach(el=>io2.observe(el));
 }else{
  counters.forEach(animateCount);
 }
}
