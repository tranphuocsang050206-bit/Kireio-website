/* =====================================================================
   services.js — hiệu ứng riêng cho trang "Dịch vụ"
   File này KHÔNG đụng tới script.js. Nó dùng chung biến `reduceMotion`
   đã được khai báo ở script.js (các thẻ <script> thường trên cùng một
   trang chia sẻ chung phạm vi toàn cục, nên biến const/let khai báo ở
   file trước vẫn dùng được ở file sau). Có kiểm tra `typeof` phòng khi
   file này được dùng độc lập, không có script.js đi kèm.
   ===================================================================== */
const svcReduceMotion = (typeof reduceMotion !== 'undefined')
 ? reduceMotion
 : matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Vẽ dần đường nối trong "Quy trình hoạt động" ---------- */
(function initStepsLine(){
 const fill = document.querySelector('.svc-steps-line-fill');
 const row = document.querySelector('.svc-steps-row');
 if(!fill || !row) return;

 if(svcReduceMotion || !('IntersectionObserver' in window)){
  fill.classList.add('in');
  return;
 }
 const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
   if(entry.isIntersecting){
    fill.classList.add('in');
    io.unobserve(entry.target);
   }
  });
 },{threshold:0.4});
 io.observe(row);
})();

/* ---------- Đếm số cho phần Thống kê, có dấu phẩy ngăn hàng nghìn ---------- */
(function initStatsCounters(){
 const counters = document.querySelectorAll('.svc-stat-num[data-count]');
 if(!counters.length) return;

 const format = (n)=> Math.round(n).toLocaleString('en-US'); // 10000 -> "10,000"

 const animate = (el)=>{
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';

  if(svcReduceMotion){
   el.textContent = format(target) + suffix;
   return;
  }
  const duration = 1400;
  const start = performance.now();
  const step = (now)=>{
   const p = Math.min((now - start) / duration, 1);
   const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic, giống hệ thống đếm ở script.js
   el.textContent = format(target * eased) + suffix;
   if(p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
 };

 if('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries)=>{
   entries.forEach(entry=>{
    if(entry.isIntersecting){
     animate(entry.target);
     io.unobserve(entry.target);
    }
   });
  },{threshold:0.6});
  counters.forEach(el=>io.observe(el));
 }else{
  counters.forEach(animate);
 }
})();
