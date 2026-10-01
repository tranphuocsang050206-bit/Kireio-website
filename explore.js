document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Kiểm tra đăng nhập
    const loggedInUser = localStorage.getItem('kireio_user');
    
    if (!loggedInUser) {
        alert("Vui lòng đăng nhập để xem trang này!");
        window.location.href = 'login.html';
        return;
    }

    const user = JSON.parse(loggedInUser);

    // Lấy 2 khung giao diện chính
    const businessDash = document.getElementById('businessDashboard');
    const cleanerDash = document.getElementById('cleanerDashboard');

    // ==========================================
    // 2. CHUẨN BỊ DỮ LIỆU MẪU (MOCK DATA)
    // ==========================================
    const cleanersData = [
        { name: "Nguyễn Văn Tuấn", desc: "Sinh viên năm 3, chăm chỉ, có phương tiện đi lại.", location: "Gò Vấp, TP.HCM", price: "60.000đ/giờ", rating: "⭐ 4.9", tags: ["Theo giờ", "Nhanh nhẹn"] },
        { name: "Trần Thị Mai", desc: "Có 2 năm kinh nghiệm vệ sinh căn hộ cao cấp.", location: "Quận 1, TP.HCM", price: "80.000đ/giờ", rating: "⭐ 5.0", tags: ["Cẩn thận", "Dụng cụ tự túc"] },
        { name: "Lê Hoàng Vũ", desc: "Đội trưởng nhóm sinh viên 5 người, nhận dọn sự kiện.", location: "Bình Thạnh, TP.HCM", price: "Thỏa thuận", rating: "⭐ 4.8", tags: ["Nhóm", "Sự kiện"] }
    ];

    const jobsData = [
        { name: "Công ty Vệ Sinh An Tín", desc: "Cần tuyển gấp 3 bạn dọn dẹp văn phòng sau xây dựng.", location: "Quận 3, TP.HCM", price: "400.000đ/ca", rating: "⭐ 4.7", tags: ["Ca ngày", "Bao cơm"] },
        { name: "Chuỗi cửa hàng Fresh", desc: "Tìm CTV dọn dẹp định kỳ 3 buổi/tuần vào buổi tối.", location: "Phú Nhuận, TP.HCM", price: "70.000đ/giờ", rating: "⭐ 4.9", tags: ["Định kỳ", "Lâu dài"] },
        { name: "Ban tổ chức Event X", desc: "Cần 10 sinh viên hỗ trợ dọn dẹp sau đêm nhạc hội.", location: "Quận 7, TP.HCM", price: "500.000đ/ca", rating: "Mới", tags: ["Dự án", "Thanh toán ngay"] }
    ];

    // ==========================================
    // 3. HÀM TẠO GIAO DIỆN THẺ (CARD)
    // ==========================================
    function createCard(item, btnText, btnColor) {
        return `
        <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-lg font-bold text-gray-900">${item.name}</h3>
                    <p class="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        📍 ${item.location}
                    </p>
                </div>
                <span class="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">${item.rating}</span>
            </div>
            
            <p class="text-gray-600 text-sm mb-4 flex-grow">${item.desc}</p>
            
            <div class="flex flex-wrap gap-2 mb-5">
                ${item.tags.map(tag => `<span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">${tag}</span>`).join('')}
            </div>
            
            <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div class="text-[#5a8231] font-bold">${item.price}</div>
                <button class="${btnColor} text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 transition">
                    ${btnText}
                </button>
            </div>
        </div>
        `;
    }

    // ==========================================
    // 4. KIỂM TRA ROLE VÀ ĐỔ DỮ LIỆU RA MÀN HÌNH
    // ==========================================
    
    // NẾU LÀ DOANH NGHIỆP
    if (user.role === "Doanh nghiệp" || user.role === "business") {
        businessDash.classList.remove('hidden');
        
        let htmlContent = '';
        cleanersData.forEach(cleaner => {
            htmlContent += createCard(cleaner, "Liên hệ ngay", "bg-[#456726]");
        });
        
        const grid = document.getElementById('cleanersGrid');
        if(grid) grid.innerHTML = htmlContent;

    // NẾU LÀ NGƯỜI DÙNG / SINH VIÊN DỌN DẸP
    } else if (user.role === "user" || user.role === "Người dùng" || user.role === "Người dọn dẹp") {
        cleanerDash.classList.remove('hidden');

        // Đổ dữ liệu vào MỤC A: Đề xuất người dọn dẹp
        let findCleanersHTML = '';
        cleanersData.forEach(cleaner => {
            findCleanersHTML += createCard(cleaner, "Thuê ngay", "bg-[#5a8231]");
        });
        
        const gridA = document.getElementById('userFindCleanersGrid');
        if(gridA) gridA.innerHTML = findCleanersHTML;

        // Đổ dữ liệu vào MỤC B: Công việc tuyển gấp
        let findJobsHTML = '';
        jobsData.forEach(job => {
            findJobsHTML += createCard(job, "Nhận việc", "bg-orange-500");
        });
        
        const gridB = document.getElementById('userFindJobsGrid');
        if(gridB) gridB.innerHTML = findJobsHTML;
    }
});