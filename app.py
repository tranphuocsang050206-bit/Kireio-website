from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2 

app = Flask(__name__)
CORS(app) 

# Thay đường link URI của bạn vào đây
DB_URI = 'postgresql://postgres.uegjxwtzfyuiqtyfcfeq:S1a2n3g4%40Kireio@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?sslmode=require'

# ==========================================
# 1. API ĐĂNG KÝ
# ==========================================
@app.route('/api/register', methods=['POST'])
def register():
    try:
        email = request.form.get('email_dang_nhap')
        password = request.form.get('mat_khau')
        role = request.form.get('role_tai_khoan')
        name = request.form.get('ten_dang_ky') 

        if not email or not password or not name:
            return jsonify({"status": "error", "message": "Vui lòng nhập đủ thông tin!"}), 400

        conn = psycopg2.connect(DB_URI)
        cursor = conn.cursor()

        # Dùng %s thay vì ? cho PostgreSQL
        cursor.execute("SELECT * FROM Users WHERE Email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"status": "error", "message": "Tài khoản/Doanh nghiệp này đã tồn tại. Vui lòng đổi email khác hoặc đăng nhập!"}), 400

        sql_query = "INSERT INTO Users (Email, Password, Role, FullName) VALUES (%s, %s, %s, %s)"
        cursor.execute(sql_query, (email, password, role, name))
        
        conn.commit()
        cursor.close()
        conn.close()

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

        conn = psycopg2.connect(DB_URI)
        cursor = conn.cursor()

        cursor.execute("SELECT FullName, Role, Email FROM Users WHERE Email = %s AND Password = %s", (email, password))
        user = cursor.fetchone()
        
        cursor.close()
        conn.close()

        if user:
            return jsonify({
                "status": "success", 
                "message": "Đăng nhập thành công!", 
                "data": {"name": user[0], "role": user[1], "email": user[2]}
            }), 200
        else:
            return jsonify({"status": "error", "message": "Sai email hoặc mật khẩu!"}), 401

    except Exception as e:
        return jsonify({"status": "error", "message": f"Lỗi kết nối: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)