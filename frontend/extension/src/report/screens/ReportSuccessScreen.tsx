import React from "react";
import { Button } from "../../components/ui";

interface ReportSuccessScreenProps {
  onClose: () => void;
  onNewReport: () => void;
  reportId?: string;
}

const ReportSuccessScreen: React.FC<ReportSuccessScreenProps> = ({ 
  onClose, 
  onNewReport, 
  reportId 
}) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-lg transition-colors"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Báo cáo đã gửi</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-md mx-auto">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
          <svg
            className="w-12 h-12 text-green-500"
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

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Báo cáo đã được gửi thành công!
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-center text-base leading-relaxed mb-8">
          Cảm ơn bạn đã gửi báo cáo. Đội ngũ hỗ trợ của chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.
        </p>

        {/* Report ID */}
        {reportId && (
          <div className="w-full bg-gray-50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-600 mb-1">Mã báo cáo:</p>
            <p className="text-lg font-mono font-semibold text-gray-900 break-all">
              {reportId}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Vui lòng lưu mã này để theo dõi tiến trình xử lý
            </p>
          </div>
        )}

        {/* Additional Info */}
        <div className="w-full space-y-4 mb-8">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">
              Bạn sẽ nhận được email xác nhận trong vài phút tới
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">
              Thời gian phản hồi thường là 24-48 giờ làm việc
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-gray-600">
              Bạn có thể kiểm tra trạng thái trong phần "Lịch sử báo cáo"
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-4">
          <Button
            onClick={onClose}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white h-12 text-base"
            size="lg"
          >
            Quay về trang chính
          </Button>

          <Button
            onClick={onNewReport}
            variant="outline"
            className="w-full h-12 text-base"
            size="lg"
          >
            Gửi báo cáo khác
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportSuccessScreen;