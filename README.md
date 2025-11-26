# XDynamic Extension

Hệ thống phát hiện nội dung NSFW toàn diện bao gồm:
- **Browser Extension** (Chrome/Firefox - Manifest V3) với React + TypeScript
- **Backend API** (FastAPI) với xác thực, thanh toán và ML inference
- **Admin Dashboard** (React + TypeScript) để quản trị và phân tích

## 📋 Yêu Cầu Hệ Thống

- **Python**: 3.9+ (khuyến nghị 3.11)
- **Node.js**: 18+ và npm/pnpm/yarn
- **Git**: Để clone repository
- **Browser**: Chrome hoặc Firefox Developer Edition/Nightly

## 🚀 Hướng Dẫn Khởi Chạy Local

### 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd xdynamic-extension
```

### 2️⃣ Thiết Lập Backend (FastAPI)

#### Bước 1: Di chuyển vào thư mục backend
```bash
cd backend
```

#### Bước 2: Tạo Python Virtual Environment
**Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Linux/MacOS:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

#### Bước 3: Cài đặt dependencies
```bash
pip install -r requirements.txt
```

#### Bước 4: Cấu hình môi trường
Tạo file `.env` từ template:
```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với các thông tin cần thiết:
```env
# App Config
APP_NAME=XDynamic
DEBUG=true

# Database (SQLite cho development)
DATABASE_URL=sqlite:///data/app.db

# JWT (Thay đổi secret key cho production!)
JWT_SECRET_KEY=your-super-secret-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=10080

# Google OAuth (Optional - để trống nếu không dùng)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback

# MoMo Payment (Optional - để trống nếu không dùng)
MOMO_PARTNER_CODE=
MOMO_ACCESS_KEY=
MOMO_SECRET_KEY=
MOMO_REDIRECT_URL=http://localhost:8000/api/payment/success
MOMO_IPN_URL=http://localhost:8000/api/payment/momo/ipn

# ML Model
MODEL_PATH=mobilenetv2_dangerous_objects.pth
MODEL_IMG_SIZE=224

# Subscription Plans
PLAN_FREE_MONTHLY_QUOTA=100
PLAN_PLUS_MONTHLY_QUOTA=5000
PLAN_PRO_MONTHLY_QUOTA=999999
PLAN_PLUS_PRICE=50000
PLAN_PRO_PRICE=100000
```

#### Bước 5: Khởi chạy Backend Server
```bash
python run.py --reload
```

Hoặc với options:
```bash
python run.py --host 0.0.0.0 --port 8000 --reload
```

Backend sẽ chạy tại: **http://localhost:8000**

- API Docs (Swagger): http://localhost:8000/docs
- Health Check: http://localhost:8000/health
- API Endpoints: http://localhost:8000/api/*

### 3️⃣ Thiết Lập Extension (Chrome/Firefox)

#### Bước 1: Di chuyển vào thư mục extension
```bash
cd frontend/extension
```

#### Bước 2: Cài đặt dependencies
```bash
npm install
# hoặc
pnpm install
# hoặc
yarn install
```

#### Bước 3: Cấu hình môi trường
Tạo file `.env` trong `frontend/extension/`:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

#### Bước 4: Build Extension

**Development mode (với hot reload):**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
```

Thư mục build sẽ được tạo tại: `frontend/extension/dist`

#### Bước 5: Load Extension vào Browser

**Chrome:**
1. Mở `chrome://extensions/`
2. Bật "Developer mode" (góc trên bên phải)
3. Click "Load unpacked"
4. Chọn thư mục `frontend/extension/dist`

**Firefox Developer/Nightly:**
1. Mở `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Chọn file `manifest.json` trong `frontend/extension/dist`

### 4️⃣ Thiết Lập Admin Dashboard (Optional)

#### Bước 1: Di chuyển vào thư mục admin dashboard
```bash
cd frontend/admin-dashboard
```

#### Bước 2: Cài đặt dependencies
```bash
npm install
```

#### Bước 3: Cấu hình môi trường
Tạo file `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000
```

#### Bước 4: Khởi chạy Development Server
```bash
npm run dev
```

Admin Dashboard sẽ chạy tại: **http://localhost:5173** (hoặc port khác)

---

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
├── backend/                          # FastAPI Backend
│   ├── app/
│   │   ├── api.py                    # Main API router
│   │   ├── config/                   # App settings
│   │   ├── controllers/              # Request handlers
│   │   ├── services/                 # Business logic
│   │   ├── repositories/             # Database operations
│   │   ├── models/                   # SQLAlchemy models
│   │   ├── schemas/                  # Pydantic schemas
│   │   └── middleware/               # Auth & other middleware
│   ├── requirements.txt
│   ├── run.py                        # Server entry point
│   ├── mobilenetv2_dangerous_objects.pth  # ML model weights
│   └── .env                          # Environment config
│
├── frontend/
│   ├── extension/                    # Browser Extension (MV3)
│   │   ├── src/
│   │   │   ├── background/           # Service worker
│   │   │   ├── content/              # Content scripts
│   │   │   ├── popup/                # Extension popup UI
│   │   │   ├── dashboard/            # User dashboard
│   │   │   ├── settings/             # Settings page
│   │   │   ├── services/             # API calls
│   │   │   ├── core/                 # Config & messaging
│   │   │   └── components/           # Reusable UI components
│   │   ├── manifest.ts               # Extension manifest
│   │   └── package.json
│   │
│   └── admin-dashboard/              # Admin Dashboard (React)
│       ├── src/
│       │   ├── pages/                # Dashboard pages
│       │   ├── components/           # UI components
│       │   └── hooks/                # Custom hooks
│       └── package.json
│
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
