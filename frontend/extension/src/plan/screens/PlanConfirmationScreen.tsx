import React from "react";
import { Button } from "../../components/ui";
import { Plan } from "../../types/common";

interface PlanConfirmationScreenProps {
  plan: Plan;
  promoCode?: string;
  discount?: number;
  onBackToDashboard: () => void;
  onViewPlanDetails: () => void;
}

const PlanConfirmationScreen: React.FC<PlanConfirmationScreenProps> = ({
  plan,
  promoCode,
  discount = 0,
  onBackToDashboard,
  onViewPlanDetails,
}) => {
  const formatCurrency = (amount: number, currency: string) => {
    if (amount === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN").format(amount) + currency;
  };

  const calculateFinalPrice = () => {
    if (plan.price === 0) return 0;
    if (discount > 0) {
      return plan.price * (1 - discount / 100);
    }
    return plan.price;
  };

  const getActivationDate = () => {
    return new Date().toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getExpirationDate = () => {
    const now = new Date();
    const expiration = new Date(now);
    
    if (plan.period === "month") {
      expiration.setMonth(expiration.getMonth() + 1);
    } else {
      expiration.setFullYear(expiration.getFullYear() + 1);
    }
    
    return expiration.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case "free":
        return "from-gray-400 to-gray-600";
      case "plus":
        return "from-blue-500 to-blue-700";
      case "pro":
        return "from-purple-500 to-purple-700";
      default:
        return "from-blue-500 to-blue-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      {/* Success Modal */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Success Header with Animation */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center relative overflow-hidden">
          {/* Animated Background Circles */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full animate-pulse delay-75"></div>
          </div>

          {/* Success Icon */}
          <div className="relative mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h2 className="text-3xl font-bold mb-2 relative z-10">
            Nâng cấp thành công!
          </h2>
          <p className="text-green-100 text-lg relative z-10">
            Chào mừng bạn đến với {plan.nameVi}
          </p>
        </div>

        {/* Confirmation Details */}
        <div className="p-8">
          {/* Plan Summary Card */}
          <div className={`bg-gradient-to-r ${getPlanColor(plan.type)} rounded-xl p-6 text-white mb-6 shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm opacity-90 mb-1">Gói đã chọn</p>
                <h3 className="text-2xl font-bold">{plan.nameVi}</h3>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">
                  {formatCurrency(calculateFinalPrice(), plan.currency)}
                </p>
                <p className="text-sm opacity-90">
                  {plan.price === 0 ? "Mãi mãi" : `/ ${plan.period === "month" ? "tháng" : "năm"}`}
                </p>
              </div>
            </div>
            
            {discount > 0 && plan.price > 0 && (
              <div className="bg-white bg-opacity-20 rounded-lg p-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Đã áp dụng mã giảm giá: {promoCode}</p>
                  <p className="text-xs opacity-90">Tiết kiệm {discount}% ({formatCurrency(plan.price * discount / 100, plan.currency)})</p>
                </div>
              </div>
            )}
          </div>

          {/* Activation Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Thông tin kích hoạt
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Ngày kích hoạt:</span>
                <span className="font-semibold text-gray-900">{getActivationDate()}</span>
              </div>
              
              {plan.price > 0 && (
                <div className="flex items-center justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Ngày hết hạn:</span>
                  <span className="font-semibold text-gray-900">{getExpirationDate()}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  Đang hoạt động
                </span>
              </div>
              
              {plan.price > 0 && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Tự động gia hạn:</span>
                  <span className="font-semibold text-gray-900">Có</span>
                </div>
              )}
            </div>
          </div>

          {/* Features List */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tính năng đã mở khóa
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plan.features
                .filter((f) => f.included)
                .map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-2">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-900">{feature.text ?? feature.vi ?? feature.en ?? ""}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onBackToDashboard}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 text-lg font-semibold shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Quay về Dashboard
            </Button>
            
            <Button
              onClick={onViewPlanDetails}
              variant="outline"
              className="w-full py-3 border-2 border-gray-300 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Xem chi tiết gói
            </Button>
          </div>

          {/* Support Notice */}
          <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  🎉 Cảm ơn bạn đã nâng cấp!
                </p>
                <p className="text-sm text-gray-700">
                  Bảo vệ của bạn đã được nâng cấp và sẵn sàng hoạt động. 
                  Nếu cần hỗ trợ, vui lòng liên hệ hotline <span className="font-mono font-semibold">1900-1234</span> hoặc 
                  email <span className="font-mono font-semibold">support@xdynamic.com</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanConfirmationScreen;
