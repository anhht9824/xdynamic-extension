# Đề xuất Phông chữ (Typography) Mới

**Tác giả:** Manus AI
**Ngày:** 04/12/2025
**Dự án:** `nekloyh/xdynamic-extension`
**Công nghệ nền tảng:** React, TypeScript, Tailwind CSS

## 1. Giới thiệu

Phông chữ (Typography) đóng vai trò quan trọng trong việc truyền tải thông tin và tạo ra trải nghiệm người dùng chuyên nghiệp. Đề xuất này nhằm thiết lập một hệ thống phông chữ rõ ràng, dễ đọc và nhất quán cho toàn bộ ứng dụng, tuân thủ nguyên tắc **Minimalist** và **chú trọng vào tính dễ đọc (Readability)**.

## 2. Lựa chọn Phông chữ

Theo kế hoạch thiết kế, phông chữ được đề xuất là **Inter** hoặc một phông chữ hệ thống tương đương.

| Thuộc tính | Chi tiết | Lý do |
| :--- | :--- | :--- |
| **Phông chữ Chính** | **Inter** | Inter là một phông chữ Sans-serif được thiết kế đặc biệt cho giao diện người dùng (UI), có độ rõ ràng cao ở nhiều kích cỡ và độ đậm khác nhau. Nó được sử dụng rộng rãi trong các ứng dụng hiện đại. |
| **Font Stack** | `Inter`, `ui-sans-serif`, `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `"Helvetica Neue"`, `Arial`, `"Noto Sans"`, `sans-serif` | Đảm bảo phông chữ hiển thị nhất quán và nhanh chóng trên mọi hệ điều hành và trình duyệt, ưu tiên phông chữ hệ thống nếu Inter không khả dụng. |
| **Kiểu chữ** | Sans-serif | Phù hợp với phong cách thiết kế tối giản, hiện đại và chuyên nghiệp. |

## 3. Hệ thống Phân cấp Phông chữ (Type Scale)

Việc sử dụng kích thước và độ đậm (weight) nhất quán là chìa khóa để thiết lập hệ thống phân cấp rõ ràng, giúp người dùng dễ dàng nhận biết đâu là tiêu đề, tiêu đề phụ và nội dung chính.

| Cấp độ | Kích thước (Tailwind Class) | Độ đậm (Tailwind Class) | Ứng dụng |
| :--- | :--- | :--- | :--- |
| **Display/H1** | `text-3xl` | `font-bold` | Tiêu đề chính của trang (ví dụ: "Admin Dashboard", "Settings"). |
| **H2** | `text-xl` | `font-semibold` | Tiêu đề của các Card lớn hoặc các phần chính (ví dụ: "Overview Stats", "Core Protection"). |
| **H3** | `text-lg` | `font-medium` | Tiêu đề phụ, tiêu đề của các mục trong Sidebar. |
| **Body/Nội dung** | `text-base` (16px) | `font-normal` | Nội dung chính, mô tả, văn bản trong Card. |
| **Small/Chú thích** | `text-sm` | `font-normal` | Chú thích, nhãn (label) nhỏ, văn bản trong Sidebar. |

## 4. Màu sắc Phông chữ

Màu sắc phông chữ sẽ tuân thủ bảng màu Neutral đã đề xuất để tối đa hóa độ tương phản và tính dễ đọc.

| Mục đích | Màu sắc (Tailwind Class) | Mã Hex | Ứng dụng |
| :--- | :--- | :--- | :--- |
| **Văn bản Chính** | `text-gray-900` | `#1F2937` | Tiêu đề, nội dung chính. |
| **Văn bản Phụ** | `text-gray-500` | `#6B7280` | Mô tả, chú thích, văn bản mờ (placeholder), văn bản trong Sidebar. |
| **Văn bản Tương tác** | `text-blue-700` | `#1D4ED8` | Liên kết, văn bản trên nút Primary. |
| **Văn bản Cảnh báo** | `text-red-700` | `#B91C1C` | Văn bản trong Khu vực Nguy hiểm. |

## 5. Triển khai Kỹ thuật

Vì dự án sử dụng **Tailwind CSS**, việc triển khai sẽ được thực hiện bằng cách cấu hình phông chữ Inter trong file `tailwind.config.js` và sử dụng các lớp tiện ích (utility classes) đã được định nghĩa.

1.  **Cài đặt Inter:** Đảm bảo phông chữ Inter được tải vào ứng dụng (ví dụ: thông qua Google Fonts hoặc tự lưu trữ).
2.  **Cấu hình Tailwind:** Cập nhật `tailwind.config.js` để thêm Inter vào `fontFamily.sans`.

```javascript
// tailwind.config.js
module.exports = {
  // ...
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', ...],
      },
    },
  },
  // ...
}
```

Việc áp dụng hệ thống phông chữ này sẽ hoàn thiện Style Guide, mang lại sự rõ ràng, chuyên nghiệp và nhất quán cho toàn bộ giao diện người dùng.

---
**Tham khảo:**
[1] https://fonts.google.com/specimen/Inter - Phông chữ Inter.
[2] https://tailwindcss.com/docs/font-family - Tài liệu về phông chữ trong Tailwind CSS.
[3] https://type-scale.com/ - Công cụ thiết lập hệ thống phân cấp phông chữ.
