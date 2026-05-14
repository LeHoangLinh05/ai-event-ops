# AI Event Operation Assistant

## 💡 Ý tưởng (Idea)
**AI Event Operation Assistant** là một công cụ hỗ trợ các Game Operator (Vận hành Game) tạo sự kiện (event) nhanh chóng bằng trí tuệ nhân tạo (AI).

**Quy trình hoạt động:**
1. **Operator nhập thông tin đầu vào:**
   - Loại sự kiện (Event type), Chủ đề (Theme), Khách hàng mục tiêu (Target player), Phần thưởng (Reward), Thời gian diễn ra (Duration).
2. **AI tự động sinh nội dung (Generate):**
   - Tên sự kiện (Event title), Mô tả sự kiện (Event description), Thông báo đẩy (Push notification), Luật lệ sự kiện (Event rules), Gợi ý phần thưởng chi tiết (Reward suggestion).
3. **Thao tác của Operator:**
   - Xem trước (Preview) và yêu cầu AI tạo lại từng phần nếu cần (Regenerate).
   - Chỉnh sửa thủ công (Edit).
   - Lưu sự kiện (Save event) và quản lý trên Dashboard.

---

## 🌍 Demo & Deploy
Dự án đã được deploy và có thể truy cập trực tiếp tại:
**Link:** [https://ai-event-ops-web.onrender.com/](https://ai-event-ops-web.onrender.com/)

---

## 🚀 Cách chạy dự án Local (How to run)

### Yêu cầu hệ thống:
- **Node.js**
- **MongoDB**
- **Gemini API Key** (Lấy từ Google AI Studio)

### 1. Cài đặt biến môi trường
Tạo file `.env` ở thư mục gốc (root directory):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-event-ops
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Cài đặt thư viện
```bash
# Cài đặt cho Backend (ở thư mục gốc)
npm install

# Cài đặt cho Frontend
cd frontend
npm install
cd ..
```

### 3. Khởi chạy
Chạy lệnh sau ở **thư mục gốc**:
```bash
npm run dev
```
- **Frontend:** `http://localhost:3000`
- **Backend API:** `http://localhost:5000`

---

## 👥 Phân chia công việc (Task Division)

Dự án được phân chia theo 3 mảng chính:

| Mảng | Nhiệm vụ chính |
| :--- | :--- |
| **Frontend** | - Xây dựng các trang giao diện (Dashboard, Event Generator, Event List, Event Detail).<br>- Tích hợp gọi API để hiển thị dữ liệu và kết nối với AI.<br>- Xử lý các tương tác người dùng như nhập form, edit nội dung, hiển thị trạng thái loading. |
| **Backend** | - Xây dựng các RESTful API (Event Module, Dashboard Module).<br>- Thiết kế và quản lý dữ liệu với MongoDB (CRUD sự kiện).<br>- Tiếp nhận request từ Frontend, chuyển tiếp và xử lý dữ liệu để giao tiếp với hệ thống AI. |
| **AI Integration** | - Thiết lập System Prompt tối ưu để Google Gemini trả về nội dung theo đúng chuẩn cấu trúc JSON yêu cầu.<br>- Xây dựng logic để tạo mới toàn bộ (Generate full) hoặc tạo lại từng phần (Regenerate).<br>- Kiểm tra (Validate) và xử lý dữ liệu JSON mà AI trả về để đảm bảo tính chính xác (check required fields, fallback errors). |