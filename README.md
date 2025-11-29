<!-- markdownlint-disable -->
# XDynamic Extension

Hệ thống phát hiện nội dung NSFW toàn diện bao gồm:
- **Browser Extension** (Chrome/Firefox - Manifest V3) với React + TypeScript
- **Backend API** (FastAPI) với xác thực, thanh toán và ML inference
- **Admin Dashboard** (React + TypeScript) để quản trị và phân tích
Tổng quan kiến trúc & phân tách thư mục: `docs/ARCHITECTURE.md`

## 📋 Yêu Cầu Hệ Thống

- **Python**: 3.9+ (khuyến nghị 3.11)
- **Node.js**: 18+ và npm/pnpm/yarn
- **Git**: Để clone repository
- **Browser**: Chrome hoặc Firefox Developer Edition/Nightly

## 🚀 Hướng Dẫn Khởi Chạy Local

### 1) Clone Repository
```bash
git clone <repository-url>
cd xdynamic-extension
```

### 2) Thiết Lập Backend (FastAPI)
- `cd backend`
- Tạo venv: `python -m venv .venv` và kích hoạt (`.venv/Script/Activate.ps1` hoặc `source .venv/bin/activate`).
- Cài đặt: `pip install -r requirements.txt`
- Sao chép `.env.example` -> `.env`, cập nhật JWT/OAuth/payment, `APP_URL` (callback host) và `DATABASE_URL` nếu cần.
- Chạy dev: `python run.py --reload`.
  - Swagger: http://localhost:8000/docs
  - Health: http://localhost:8000/health

### 3) Thiết Lập Extension (Chrome/Firefox)
- `cd frontend/extension`
- `npm install`
- Sao chép `.env.example` -> `.env`, điền `VITE_API_BASE_URL` (backend) và `VITE_GOOGLE_CLIENT_ID` (nếu dùng).
- Dev: `npm run dev`; Build: `npm run build` (ra `dist/`).
- Load unpacked extension từ `dist/` trong Chrome/Firefox.

### 4) Thiết Lập Admin Dashboard (Optional)
- `cd frontend/admin-dashboard`
- `npm install`
- Sao chép `.env.example` -> `.env`, điền `VITE_API_BASE_URL`.
- Dev: `npm run dev` (mặc định http://localhost:5173); Build: `npm run build`.

### 5) Callback Pages (dev)
- Nằm tại `frontend/callback-pages/` (không cần build).
- Khi `DEBUG=true`, backend serve tại `http://localhost:8000/fe`.
- Nếu host riêng, cập nhật `APP_URL` trong `backend/.env` trỏ tới host mới.

## 🔗 Liên Kết Backend - Frontend
- `VITE_API_BASE_URL` (FE) -> backend base URL (VD: http://localhost:8000).
- `APP_URL` (BE) -> base URL nhận redirect OAuth/Payment (mặc định trỏ về `/fe`).
- CORS backend cho: `*`, `chrome-extension://*`, `http://localhost:5173`, `http://localhost:3000` (dev).
- OAuth: backend redirect `/api/auth/google/callback` -> `APP_URL/auth/callback`; FE gọi `/api/auth/google`.
- Payment: backend redirect `/api/payment/success` -> `APP_URL/payment/success`.


## 🐳 Khởi Chạy Với Docker (Alternative)

### Backend với Docker Compose
```bash
cd backend
docker-compose up -d
```

Backend sẽ chạy tại: **http://localhost:8001**

---

## 📁 Cấu Trúc Thư Mục

```
xdynamic-extension/
├── backend/                  # FastAPI backend (API, services)
│   ├── app/                  # Routers, services, repositories, models, schemas, middleware
│   ├── data/                 # Local sqlite data dir (auto-created)
│   ├── mobilenetv2_dangerous_objects.pth  # ML model weights
│   ├── requirements.txt
│   └── run.py                # Server entry point
├── frontend/
│   ├── callback-pages/       # Static OAuth/payment redirect pages served at /fe in debug
│   ├── extension/            # Browser extension (React + Vite)
│   └── admin-dashboard/      # Admin dashboard (React)
├── docs/                     # Architecture and other docs
└── README.md
```

---

## 🧪 Testing & Development

### Test Backend API
```bash
# Health check
curl http://localhost:8000/health

# API docs
open http://localhost:8000/docs
```

### Test Extension
1. Mở extension popup
2. Đăng nhập (hoặc dùng chế độ free)
3. Vào một trang web bất kỳ
4. Click "Scan This Page" trong popup
5. Kiểm tra console logs (F12 > Console)

### Development Tips
- Backend có hot reload với `--reload` flag
- Extension dev mode (`npm run dev`) tự động rebuild khi có thay đổi
- Sử dụng Chrome DevTools để debug extension: `chrome://extensions/` > Details > Inspect views

---

## 🔑 Các Tính Năng Chính

### Backend API
- ✅ JWT Authentication
- ✅ Google OAuth Login
- ✅ MoMo Payment Integration
- ✅ Subscription Management (Free/Plus/Pro)
- ✅ ML Image Classification (NSFW Detection)
- ✅ Usage Tracking & Quotas
- ✅ RESTful API với FastAPI

### Browser Extension
- ✅ Real-time NSFW content detection
- ✅ Auto-blur/hide inappropriate images
- ✅ User authentication & profiles
- ✅ Subscription management
- ✅ Settings & preferences
- ✅ Usage statistics dashboard

### Admin Dashboard
- ✅ Content analytics
- ✅ User management
- ✅ System monitoring
- ✅ Reports & statistics

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/google` - Google OAuth
- `POST /api/auth/refresh` - Refresh token

### Prediction
- `POST /api/v1/predict` - Phân tích hình ảnh NSFW

### Subscription
- `GET /api/subscription/plans` - Lấy danh sách gói
- `POST /api/subscription/subscribe` - Đăng ký gói

### Payment
- `POST /api/payment/momo/create` - Tạo thanh toán MoMo
- `POST /api/payment/momo/ipn` - MoMo IPN callback

---

## 🛠️ Troubleshooting

### Backend không khởi động được
- Kiểm tra Python version: `python --version` (cần 3.9+)
- Kiểm tra virtual environment đã được activate chưa
- Kiểm tra file `.env` đã được tạo chưa
- Kiểm tra port 8000 có bị chiếm dụng không

### Extension không load được
- Kiểm tra đã build xong chưa: `npm run build`
- Kiểm tra thư mục `dist` đã được tạo chưa
- Reload extension trong browser
- Kiểm tra console errors trong extension popup (right-click > Inspect)

### CORS errors
- Đảm bảo backend đang chạy
- Kiểm tra `VITE_API_BASE_URL` trong `.env` của extension
- Backend cần cấu hình CORS cho frontend domain

---

## 📄 License

[Thêm license của bạn ở đây]

## 👥 Contributors

[Thêm thông tin contributors ở đây]
