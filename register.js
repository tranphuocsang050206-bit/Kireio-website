document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. Chức năng chuyển đổi Role (Loại tài khoản)
    // ==========================================
    const roleUser = document.getElementById('roleUser');
    const roleBusiness = document.getElementById('roleBusiness');
    const roleOptions = document.querySelectorAll('.role-option');
    
    const nameLabel = document.getElementById('nameFieldLabel');
    const nameInput = document.getElementById('nameInput');

    function updateRoleUI() {
        // Xóa class 'is-active' ở tất cả các thẻ label
        roleOptions.forEach(label => label.classList.remove('is-active'));

        if (roleUser.checked) {
            // Cập nhật UI cho Người dùng
            roleUser.closest('.role-option').classList.add('is-active');
            nameLabel.textContent = 'Họ và tên';
            nameInput.placeholder = 'Nguyễn Văn A';
        } else if (roleBusiness.checked) {
            // Cập nhật UI cho Doanh nghiệp
            roleBusiness.closest('.role-option').classList.add('is-active');
            nameLabel.textContent = 'Tên doanh nghiệp';
            nameInput.placeholder = 'Công ty TNHH Vệ sinh ABC';
        }
    }

    // Lắng nghe sự kiện khi người dùng click đổi radio button
    if (roleUser && roleBusiness) {
        roleUser.addEventListener('change', updateRoleUI);
        roleBusiness.addEventListener('change', updateRoleUI);
    }

    // ==========================================
    // 2. Chức năng Ẩn / Hiện mật khẩu
    // ==========================================
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('passwordInput');

    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                passwordToggle.textContent = 'Ẩn';
                passwordToggle.setAttribute('aria-label', 'Ẩn mật khẩu');
            } else {
                passwordInput.type = 'password';
                passwordToggle.textContent = 'Hiện';
                passwordToggle.setAttribute('aria-label', 'Hiện mật khẩu');
            }
        });
    }

});
// ==========================================
    // 3. Xử lý gửi Form (Submit) bằng Fetch API
    // ==========================================
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Chặn hành vi tải lại trang (chuyển trang) mặc định

            // Lấy dữ liệu từ các ô input
            const formData = new FormData(registerForm);

            try {
                // Gửi dữ liệu qua Backend Python (Nhớ chạy file app.py)
                const response = await fetch('http://127.0.0.1:5000/api/register', {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                // Xử lý phản hồi từ Backend
                if (response.ok && result.status === 'success') {
                    registerMessage.textContent = 'Tạo tài khoản thành công! Đang chuyển hướng...';
                    registerMessage.className = 'register-message success';
                    
                    // Lưu dữ liệu vào LocalStorage để tính là đã đăng nhập luôn
                    localStorage.setItem('kireio_user', JSON.stringify(result.data));
                    
                    // Chuyển về trang chủ sau 1.5 giây
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else{}
            } catch (error) {
                registerMessage.textContent = 'Lỗi kết nối! Hãy chắc chắn bạn đã bật máy chủ Python.';
                registerMessage.className = 'register-message error';
                console.error(error);
            }
        });
    }