/* =====================================================================
   blog.js — hiệu ứng & tương tác riêng cho trang "Bài viết"
   Không đụng tới script.js. Dùng chung biến `reduceMotion` khai báo ở
   script.js khi có (các thẻ <script> thường chia sẻ chung phạm vi toàn
   cục), có kiểm tra typeof để vẫn chạy an toàn nếu dùng file này riêng lẻ.
   ===================================================================== */
const blogReduceMotion = (typeof reduceMotion !== 'undefined')
 ? reduceMotion
 : matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Lọc bài viết theo chuyên mục ---------- */
(function initCategoryFilter(){
 const pills = document.querySelectorAll('.blog-pill');
 const cards = document.querySelectorAll('.article-card');
 if(!pills.length || !cards.length) return;

 const FADE_MS = 200;

 const applyFilter = (filter)=>{
  cards.forEach(card=>{
   const match = filter === 'all' || card.dataset.category === filter;
   if(match){
    card.style.display = '';
    // buộc reflow rồi mới bỏ class fade-out để hiệu ứng mờ dần chạy đúng
    void card.offsetWidth;
    card.classList.remove('fade-out');
   }else{
    card.classList.add('fade-out');
    if(blogReduceMotion){
     card.style.display = 'none';
    }else{
     setTimeout(()=>{
      if(card.classList.contains('fade-out')) card.style.display = 'none';
     }, FADE_MS);
    }
   }
  });
 };

 pills.forEach(pill=>{
  pill.addEventListener('click', ()=>{
   pills.forEach(p=>{ p.classList.remove('active'); p.setAttribute('aria-pressed','false'); });
   pill.classList.add('active');
   pill.setAttribute('aria-pressed','true');
   applyFilter(pill.dataset.filter);
  });
 });
})();

/* ---------- Phân trang (giao diện, nhóm sẽ nối API thật sau) ---------- */
(function initPagination(){
 const nav = document.querySelector('.blog-pagination');
 if(!nav) return;
 const buttons = [...nav.querySelectorAll('.blog-page-btn[data-page]')];
 const numberBtns = buttons.filter(b=>/^\d+$/.test(b.dataset.page));

 nav.addEventListener('click', (e)=>{
  const btn = e.target.closest('.blog-page-btn');
  if(!btn || btn.disabled) return;

  if(btn.dataset.page === 'prev' || btn.dataset.page === 'next'){
   const currentIndex = numberBtns.findIndex(b=>b.classList.contains('active'));
   const nextIndex = btn.dataset.page === 'prev' ? currentIndex - 1 : currentIndex + 1;
   if(nextIndex >= 0 && nextIndex < numberBtns.length){
    numberBtns[currentIndex]?.classList.remove('active');
    numberBtns[nextIndex].classList.add('active');
    numberBtns[nextIndex].setAttribute('aria-current','page');
    numberBtns[currentIndex]?.removeAttribute('aria-current');
   }
  }else{
   numberBtns.forEach(b=>{ b.classList.remove('active'); b.removeAttribute('aria-current'); });
   btn.classList.add('active');
   btn.setAttribute('aria-current','page');
  }

  // Cuộn nhẹ về đầu lưới bài viết khi đổi trang, cho cảm giác chuyển trang rõ ràng
  const grid = document.getElementById('blogGrid');
  if(grid) grid.scrollIntoView({behavior: blogReduceMotion ? 'auto' : 'smooth', block:'start'});
 });
})();

/* ---------- Form đăng ký nhận tin ---------- */
(function initNewsletterForm(){
 const form = document.getElementById('newsletterForm');
 const msg = document.getElementById('newsletterMsg');
 if(!form || !msg) return;

 form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const input = form.querySelector('input[type="email"]');
  const value = input.value.trim();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  msg.classList.remove('ok','err');
  if(!isValid){
   msg.textContent = 'Vui lòng nhập một địa chỉ email hợp lệ.';
   msg.classList.add('err');
   input.focus();
   return;
  }
  // Chưa nối API thật — chỉ hiển thị phản hồi tạm thời cho người dùng
  msg.textContent = 'Cảm ơn bạn đã đăng ký! Kireio sẽ gửi bài viết mới nhất tới email của bạn.';
  msg.classList.add('ok');
  form.reset();
 });
})();
