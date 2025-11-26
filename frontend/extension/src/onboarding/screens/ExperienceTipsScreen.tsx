import React, { useState } from "react";
import { Button } from "../../components/ui";

interface ExperienceTipsScreenProps {
  onComplete: () => void;
  onBack: () => void;
}

const ExperienceTipsScreen: React.FC<ExperienceTipsScreenProps> = ({ onComplete, onBack }) => {
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  const tips = [
    {
      icon: "🌐",
      title: "Truy cập nội dung trang web",
      description: "Giúp tiện ích tương tác thông minh với nội dung bạn đang truy cập.",
      details: "XDynamic sẽ phân tích và lọc nội dung độc hại trong thời gian thực khi bạn duyệt web."
    },
    {
      icon: "💾",
      title: "Bộ nhớ",
      description: "Cho phép lưu trữ dữ liệu cục bộ nhớ cài đặt và tùy chọn cá nhân.",
      details: "Lưu trữ cài đặt bộ lọc, danh sách trắng và các tùy chọn cá nhân hóa của bạn."
    },
    {
      icon: "🔔",
      title: "Thông báo",
      description: "Gửi thông báo kịp thời khi có cập nhật hoặc sự kiện quan trọng.",
      details: "Nhận cảnh báo khi phát hiện nội dung độc hại hoặc cập nhật bảo mật quan trọng."
    }
  ];

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
        <span className="text-sm text-gray-500 font-medium">4/4</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8 max-w-2xl mx-auto w-full">
        {/* Image placeholder */}
        <div className="w-full h-48 bg-blue-100 rounded-lg mb-8 flex items-center justify-center">
          <div className="text-blue-500 text-base">Family Using Device</div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-4">
          Tăng trải nghiệm lướt web cùng tiện ích của chúng tôi
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-center text-base mb-8 leading-relaxed">
          Để bảo vệ bạn và mang đến trải nghiệm tối ưu,
          <br />
          tiện ích cần quyền truy cập các tính năng sau:
        </p>

        {/* Tips List */}
        <div className="space-y-4 flex-1 mb-8">
          {tips.map((tip, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedTip(expandedTip === index ? null : index)}
                className="w-full p-6 text-left flex items-start space-x-4 hover:bg-gray-50 transition-colors"
              >
                <div className="text-3xl flex-shrink-0">{tip.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base">{tip.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed">{tip.description}</p>
                </div>
                <div className="text-gray-400 text-xl flex-shrink-0">
                  {expandedTip === index ? "−" : "+"}
                </div>
              </button>
              
              {expandedTip === index && (
                <div className="px-6 pb-6">
                  <div className="ml-16 p-4 bg-blue-50 rounded-lg">
                    <p className="text-base text-blue-800 leading-relaxed">{tip.details}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 mt-auto">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 h-12 text-base"
            size="lg"
          >
            Hủy
          </Button>
          <Button
            onClick={onComplete}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white h-12 text-base"
            size="lg"
          >
            Cho phép truy cập
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceTipsScreen;