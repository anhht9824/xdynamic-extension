import React, { useState } from "react";
import { Button } from "../../components/ui";

interface SecurityConfirmationScreenProps {
  onNext: () => void;
  onBack: () => void;
}

const SecurityConfirmationScreen: React.FC<SecurityConfirmationScreenProps> = ({ onNext, onBack }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 text-lg transition-colors"
        >
          ←
        </button>
        <span className="text-sm text-gray-500 font-medium">3/4</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto">
        {/* Shield Icon */}
        <div className="w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Hoàn tất cài đặt!
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center text-base leading-relaxed mb-12 px-4">
          XDynamic đã sẵn sàng bảo vệ bạn khỏi các nội dung độc hại.
          <br />
          Giờ đây, bạn có thể lướt web an toàn hoặc tùy chỉnh cài đặt theo nhu cầu.
        </p>

        {/* Buttons */}
        <div className="w-full space-y-4">
          <Button
            onClick={onNext}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-base"
            size="lg"
          >
            Bắt đầu sử dụng
          </Button>

          <Button
            onClick={() => setShowDetailsModal(true)}
            variant="outline"
            className="w-full h-12 text-base"
            size="lg"
          >
            Đọc tới cài đặt
          </Button>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-6">Chi tiết bảo mật</h3>
            <div className="space-y-6 text-base text-gray-600">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Bảo vệ chuyên sâu:</strong> Lọc nội dung độc hại theo thời gian thực
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Hệ thống cảnh báo:</strong> Thông minh với khi phát hiện nội dung không phù hợp
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Tùy chỉnh linh hoạt:</strong> Có thể chuyển sản chuyển sâu nội dung lọc theo nhu cầu cá nhân
                </div>
              </div>
            </div>
            <div className="flex space-x-4 mt-8">
              <Button
                onClick={() => setShowDetailsModal(false)}
                variant="outline"
                className="flex-1 h-12"
                size="lg"
              >
                Đóng
              </Button>
              <Button
                onClick={() => {
                  setShowDetailsModal(false);
                  onNext();
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white h-12"
                size="lg"
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityConfirmationScreen;