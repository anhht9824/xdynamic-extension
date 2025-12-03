# Đề xuất Bảng màu (Color Scheme) và Giao diện người dùng (UI) Mới

**Tác giả:** Manus AI
**Ngày:** 04/12/2025
**Dự án:** `nekloyh/xdynamic-extension`
**Công nghệ nền tảng:** React, TypeScript, Tailwind CSS

## 1. Giới thiệu

Đề xuất này tập trung vào việc xác định **Bảng màu (Color Palette)** và các nguyên tắc **Giao diện người dùng (UI)** để đảm bảo tính thẩm mỹ, chuyên nghiệp và nhất quán cho toàn bộ ứng dụng, phù hợp với phong cách **Minimalist Card-based** đã được thống nhất trong đề xuất Bố cục.

## 2. Bảng màu (Color Palette)

Bảng màu được thiết kế dựa trên nguyên tắc **3 màu chính** (Primary, Secondary, Neutral) để tạo ra sự phân cấp rõ ràng và truyền tải thông điệp thương hiệu một cách hiệu quả.

| Tên Màu | Mã Hex | Tên Tailwind CSS | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **Primary** (Xanh Lam Sâu) | `#1D4ED8` | `blue-700` | **Hành động chính (CTA)**, Branding, các yếu tố tương tác (nút, liên kết, thanh tiến trình). Truyền tải sự tin cậy và chuyên nghiệp. |
| **Secondary** (Xanh Cyan) | `#06B6D4` | `cyan-500` | **Chỉ báo trạng thái quan trọng** (ví dụ: "Protection ON", các điểm nhấn trong biểu đồ). Tạo sự tương phản nhẹ nhàng với màu Primary. |
| **Neutral - Nền Sáng** | `#F9FAFB` | `gray-50` | **Nền tổng thể** của ứng dụng (Main Content Area). Tối đa hóa không gian trắng (Whitespace). |
| **Neutral - Nền Card** | `#FFFFFF` | `white` | **Nền của các Card** và các thành phần nổi bật. |
| **Neutral - Văn bản Chính** | `#1F2937` | `gray-900` | **Văn bản chính** (tiêu đề, nội dung). Đảm bảo tính dễ đọc (Readability). |
| **Success** (Thành công) | `#10B981` | `green-500` | Thông báo thành công, trạng thái tích cực. |
| **Warning** (Cảnh báo) | `#F59E0B` | `amber-500` | Thông báo cần chú ý, trạng thái trung lập/cảnh báo nhẹ. |
| **Danger** (Nguy hiểm) | `#EF4444` | `red-500` | Hành động không thể hoàn tác (ví dụ: Xóa tài khoản, nút Reset), thông báo lỗi. |

**Nguyên tắc áp dụng:**

*   **Tỷ lệ:** Màu Neutral sẽ chiếm phần lớn (khoảng 80-90%) diện tích, Primary và Secondary được sử dụng có chọn lọc để hướng sự chú ý của người dùng.
*   **Biểu đồ:** Các biểu đồ (ví dụ: `UsageChart` trên Admin Dashboard) sẽ sử dụng màu Primary và Secondary để đảm bảo tính nhất quán.

## 3. Nguyên tắc Giao diện người dùng (UI)

Giao diện người dùng sẽ tuân thủ phong cách **Minimalist** và **Card-based** để tạo ra trải nghiệm trực quan và hiệu quả.

### 3.1. Thành phần Card (Card Components)

Card là thành phần cốt lõi của UI mới.

*   **Thiết kế:** Sử dụng `bg-white`, `rounded-lg`, và `shadow-sm` hoặc `shadow-md`.
*   **Ứng dụng:**
    *   **Metrics:** Các chỉ số quan trọng (ví dụ: "blocked today") sẽ được đặt trong các Card lớn, sử dụng màu Primary/Secondary cho viền hoặc icon để nhấn mạnh trạng thái.
    *   **Nhóm Cài đặt:** Các cài đặt liên quan (ví dụ: "Core Protection" trong `OverviewTab.tsx`) sẽ được nhóm lại trong một Card duy nhất.

### 3.2. Thành phần Tương tác (Interactive Components)

Các thành phần như nút, trường nhập liệu, và thanh trượt sẽ được thiết kế lại để đồng bộ với Style Guide.

| Thành phần | Đề xuất UI | Lớp Tailwind CSS/Thư viện đề xuất |
| :--- | :--- | :--- |
| **Nút (Button)** | Tối giản, góc bo tròn nhẹ, sử dụng màu Primary (`blue-700`) cho nền của nút chính. | `bg-blue-700`, `hover:bg-blue-800`, `text-white`, `rounded-md` |
| **Trường nhập liệu (Input)** | Viền mỏng, góc bo tròn nhẹ, sử dụng màu Primary cho viền khi được focus. | `border-gray-300`, `focus:border-blue-700`, `rounded-md` |
| **Toggle Switch** | Sử dụng màu Secondary (`cyan-500`) cho trạng thái BẬT. | Sử dụng thư viện UI Component (ví dụ: Radix UI Switch hoặc Shadcn/ui Switch) để đảm bảo tính truy cập (Accessibility). |
| **Khu vực Nguy hiểm** | Sử dụng màu nền/viền đỏ nhạt để cảnh báo người dùng trước các hành động không thể hoàn tác (ví dụ: Xóa tài khoản). | `bg-red-50`, `border-red-200`, `text-red-700` |

### 3.3. Tối ưu hóa Trang Báo cáo (ReportsPage.tsx)

*   **Bộ lọc (Filters):** Thiết kế lại thành các thành phần nhỏ gọn (ví dụ: Dropdown, Date Picker) được sắp xếp theo chiều ngang trong thanh công cụ cố định.
*   **Bảng Dữ liệu (Table):** Sử dụng thiết kế bảng tối giản, không có đường viền thừa. Chỉ sử dụng đường kẻ ngang mỏng để phân tách các hàng.
*   **Trực quan hóa Trạng thái:** Sử dụng các `Badge` (ví dụ: `bg-green-100 text-green-800` cho trạng thái `Approved`) để phân biệt trạng thái báo cáo, giúp quản trị viên quét thông tin nhanh chóng.

## 4. Kết luận UI/Color

Việc áp dụng bảng màu Primary/Secondary rõ ràng cùng với nguyên tắc thiết kế Card-based sẽ giúp dự án có một giao diện hiện đại, chuyên nghiệp và dễ sử dụng. Các thành phần UI sẽ được triển khai thông qua Tailwind CSS và một thư viện UI Component (ví dụ: Shadcn/ui) để đảm bảo tính nhất quán và chất lượng mã.

---
**Tham khảo:**
[1] https://tailwindcss.com/docs/customizing-colors - Tài liệu tùy chỉnh màu sắc của Tailwind CSS.
[2] https://material.io/design/color/the-color-system.html - Nguyên tắc hệ thống màu sắc trong thiết kế UI.
[3] https://www.radix-ui.com/ - Thư viện UI Component không kiểu dáng (headless) cho React.
