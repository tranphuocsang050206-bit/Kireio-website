from flask import Flask, request, jsonify
from flask_cors import CORS
import pyodbc

app = Flask(__name__)
CORS(app) 

# Đổi lại tên Server máy của bạn (LAPTOP-GFJ8G2B3)
DB_CONFIG = (
    r'DRIVER={ODBC Driver 17 for SQL Server};'
    r'SERVER=LAPTOP-GFJ8G2B3;'  
    r'DATABASE=Kireio;'
    r'Trusted_Connection=yes;'
)

# ==========================================
# 1. API ĐĂNG KÝ
# ==========================================
@app.route('/api/register', methods=['POST'])
def register():
    try:
        email = request.form.get('email_dang_nhap')
        password = request.form.get('mat_khau')
        role = request.form.get('role_tai_khoan')
        name = request.form.get('ten_dang_ky') # Lấy thêm tên

        if not email or not password or not name:
            return jsonify({"status": "error", "message": "Vui lòng nhập đủ thông tin!"}), 400

        conn = pyodbc.connect(DB_CONFIG)
        cursor = conn.cursor()

        # Kiểm tra xem Email hoặc Doanh nghiệp này đã tồn tại chưa
        cursor.execute("SELECT * FROM Users WHERE Email = ?", (email,))
        if cursor.fetchone():
            return jsonify({"status": "error", "message": "Tài khoản/Doanh nghiệp này đã tồn tại. Vui lòng đổi email khác hoặc đăng nhập!"}), 400

        # Nếu chưa tồn tại -> Lưu vào DB
        sql_query = "INSERT INTO Users (Email, Password, Role, FullName) VALUES (?, ?, ?, ?)"
        cursor.execute(sql_query, (email, password, role, name))
        
        conn.commit()
        cursor.close()
        conn.close()

        # Trả về data để Frontend lưu trạng thái đăng nhập luôn
        return jsonify({
            "status": "success", 
            "message": "Tạo tài khoản thành công!",
            "data": {"name": name, "role": role, "email": email}
        }), 200

    except Exception as e:
        return jsonify({"status": "error", "message": f"Lỗi hệ thống: {str(e)}"}), 500

# ==========================================
# 2. API ĐĂNG NHẬP
# ==========================================
@app.route('/api/login', methods=['POST'])
def login():
    try:
        email = request.form.get('email_dang_nhap')
        password = request.form.get('mat_khau')

        conn = pyodbc.connect(DB_CONFIG)
        cursor = conn.cursor()

        # Đối chiếu email và mật khẩu trong kho dữ liệu
        cursor.execute("SELECT FullName, Role, Email FROM Users WHERE Email = ? AND Password = ?", (email, password))
        user = cursor.fetchone()
        
        cursor.close()
        conn.close()

        if user:
            # Đăng nhập đúng
            return jsonify({
                "status": "success", 
                "message": "Đăng nhập thành công!", 
                "data": {"name": user[0], "role": user[1], "email": user[2]}
            }), 200
        else:
            # Đăng nhập sai
            return jsonify({"status": "error", "message": "Sai email hoặc mật khẩu!"}), 401

    except Exception as e:
        return jsonify({"status": "error", "message": f"Lỗi hệ thống: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)