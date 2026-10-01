/* =====================================================================
   contact.js — xử lý form liên hệ (kiểm tra dữ liệu + phản hồi tạm thời)
   Không đụng tới script.js. Dùng chung biến `reduceMotion` khai báo ở
   script.js khi có, có kiểm tra typeof để vẫn chạy an toàn nếu dùng
   file này riêng lẻ.
   ===================================================================== */
const contactReduceMotion = (typeof reduceMotion !== 'undefined')
 ? reduceMotion
 : matchMedia('(prefers-reduced-motion: reduce)').matches;

(function initContactForm(){
 const form = document.getElementById('contactForm');
 const msg = document.getElementById('contactFormMsg');
 if(!form || !msg) return;

 const submitBtn = form.querySelector('.contact-submit');
 const emailInput = form.querySelector('#contactEmail');
 const phoneInput = form.querySelector('#contactPhone');
 const messageInput = form.querySelector('#contactMessage');

 const isValidEmail = (v)=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
 // Chấp nhận số điện thoại VN: 9–11 chữ số, có thể có dấu cách/gạch ngang/dấu +
 const isValidPhone = (v)=>/^[0-9+\-\s]{9,14}$/.test(v.trim());

 form.addEventListener('submit', (e)=>{
  e.preventDefault();
  msg.classList.remove('ok','err');

  const email = emailInput.value;
  const phone = phoneInput.value;
  const message = messageInput.value.trim();

  if(!isValidEmail(email)){
   msg.textContent = 'Vui lòng nhập một địa chỉ email hợp lệ.';
   msg.classList.add('err');
   emailInput.focus();
   return;
  }
  if(!isValidPhone(phone)){
   msg.textContent = 'Vui lòng nhập số điện thoại hợp lệ (9–14 số).';
   msg.classList.add('err');
   phoneInput.focus();
   return;
  }
  if(!message){
   msg.textContent = 'Vui lòng để lại lời nhắn để chúng tôi hỗ trợ tốt hơn.';
   msg.classList.add('err');
   messageInput.focus();
   return;
  }

  // Chưa nối API thật — chỉ giả lập trạng thái gửi để hoàn thiện trải nghiệm
  submitBtn.disabled = true;
  submitBtn.textContent = 'Đang gửi...';

  setTimeout(()=>{
   msg.textContent = 'Cảm ơn bạn đã liên hệ! Đội ngũ Kireio sẽ phản hồi trong thời gian sớm nhất.';
   msg.classList.add('ok');
   submitBtn.disabled = false;
   submitBtn.textContent = 'Gửi thông tin';
   form.reset();
  }, contactReduceMotion ? 0 : 700);
 });
})();
