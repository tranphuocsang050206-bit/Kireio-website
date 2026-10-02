document.addEventListener('DOMContentLoaded', function() {
    // Chức năng Ẩn/Hiện mật khẩu
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('passwordInput');
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordToggle.textContent = 'Ẩn';
            } else {
                passwordInput.type = 'password';
                passwordToggle.textContent = 'Hiện';
            }
        });
    }

    // Xử lý gửi Form Đăng nhập
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(loginForm);

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();

                if (response.ok && result.status === 'success') {
                    loginMessage.textContent = 'Đang chuyển hướng...';
                    loginMessage.className = 'register-message success';
                    
                    // LƯU TRẠNG THÁI VÀO TRÌNH DUYỆT (LocalStorage)
                    localStorage.setItem('kireio_user', JSON.stringify(result.data));
                    
                    // Điều hướng về trang chủ sau 1 giây
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    loginMessage.textContent = result.message;
                    loginMessage.className = 'register-message error';
                }
            } catch (error) {
                loginMessage.textContent = 'Lỗi kết nối máy chủ!';
                loginMessage.className = 'register-message error';
            }
        });
    }
});