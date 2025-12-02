import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui";
import { Plan, PlanType } from "../../types/common";
import { useToast } from "../../hooks/useToast";
import { subscriptionService } from "../../services/subscription.service";

interface UpgradeScreenProps {
  onSelectPlan: (plan: Plan, promoCode?: string) => void;
  onBack: () => void;
}

const UpgradeScreen: React.FC<UpgradeScreenProps> = ({
  onSelectPlan,
  onBack,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("plus");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [useTrialPeriod, setUseTrialPeriod] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanType | null>(null);
  const { error: showErrorToast, success: showSuccessToast } = useToast();

  // Available plans
  const plans: Plan[] = [
    {
      id: "plan-free",
      type: "free",
      name: "Basic Free",
      nameVi: "Miễn phí",
      price: 0,
      currency: "đ",
      period: "month",
      features: [
        { id: "f1", text: "Chặn nội dung cơ bản", included: true },
        { id: "f2", text: "Báo cáo hàng tháng", included: true },
        { id: "f3", text: "Hỗ trợ email", included: true },
        { id: "f4", text: "Phát hiện nâng cao", included: false },
        { id: "f5", text: "Video streaming protection", included: false },
        { id: "f6", text: "Hỗ trợ ưu tiên 24/7", included: false },
        { id: "f7", text: "Báo cáo chi tiết theo thời gian thực", included: false },
        { id: "f8", text: "Tùy chỉnh bộ lọc nâng cao", included: false },
      ],
    },
    {
      id: "plan-plus",
      type: "plus",
      name: "Dynamic Plus",
      nameVi: "Plus",
      price: 50000,
      currency: "đ",
      period: "month",
      isPopular: true,
      trialDays: 7,
      features: [
        { id: "f1", text: "Chặn nội dung cơ bản", included: true },
        { id: "f2", text: "Báo cáo hàng tháng", included: true },
        { id: "f3", text: "Hỗ trợ email", included: true },
        { id: "f4", text: "Phát hiện nâng cao", included: true },
        { id: "f5", text: "Video streaming protection", included: true },
        { id: "f6", text: "Hỗ trợ ưu tiên 24/7", included: false },
        { id: "f7", text: "Báo cáo chi tiết theo thời gian thực", included: false },
        { id: "f8", text: "Tùy chỉnh bộ lọc nâng cao", included: false },
      ],
    },
    {
      id: "plan-pro",
      type: "pro",
      name: "Dynamic Pro",
      nameVi: "Pro",
      price: 100000,
      currency: "đ",
      period: "month",
      trialDays: 14,
      features: [
        { id: "f1", text: "Chặn nội dung cơ bản", included: true },
        { id: "f2", text: "Báo cáo hàng tháng", included: true },
        { id: "f3", text: "Hỗ trợ email", included: true },
        { id: "f4", text: "Phát hiện nâng cao", included: true },
        { id: "f5", text: "Video streaming protection", included: true },
        { id: "f6", text: "Hỗ trợ ưu tiên 24/7", included: true },
        { id: "f7", text: "Báo cáo chi tiết theo thời gian thực", included: true },
        { id: "f8", text: "Tùy chỉnh bộ lọc nâng cao", included: true },
      ],
    },
  ];

  // Load current subscription to show active plan
  useEffect(() => {
    const loadCurrentPlan = async () => {
      try {
        const sub = await subscriptionService.getCurrentSubscription();
        if (sub?.plan) {
          setCurrentPlan(sub.plan);
          setSelectedPlan(sub.plan);
        }
      } catch (error) {
        showErrorToast("Khong tai duoc goi hien tai");
      }
    };

    void loadCurrentPlan();
  }, [showErrorToast]);

  const handleApplyPromo = () => {
    setIsLoading(true);
    // Simulate API call to validate promo code
    setTimeout(() => {
      if (promoCode.toUpperCase() === "SAVE20") {
        setPromoApplied(true);
        setDiscount(20);
        showSuccessToast("Mã giảm giá đã áp dụng", `Bạn được giảm ${20}%`);
      } else if (promoCode.toUpperCase() === "FIRST50") {
        setPromoApplied(true);
        setDiscount(50);
        showSuccessToast("Mã giảm giá đã áp dụng", `Bạn được giảm ${50}%`);
      } else {
        setPromoApplied(false);
        setDiscount(0);
        showErrorToast("Mã giảm giá không hợp lệ", "Vui lòng kiểm tra lại mã giảm giá");
      }
      setIsLoading(false);
    }, 800);
  };

  const calculatePrice = (plan: Plan) => {
    if (plan.price === 0) return 0;
    if (promoApplied && discount > 0) {
      return plan.price * (1 - discount / 100);
    }
    return plan.price;
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (amount === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN").format(amount) + currency;
  };

  const getPlanColor = (planType: PlanType) => {
    switch (planType) {
      case "free":
        return {
          gradient: "from-gray-400 to-gray-600",
          border: "border-gray-300",
          button: "bg-gray-500 hover:bg-gray-600",
          badge: "bg-gray-100 text-gray-800",
        };
      case "plus":
        return {
          gradient: "from-blue-500 to-blue-700",
          border: "border-blue-400",
          button: "bg-blue-500 hover:bg-blue-600",
          badge: "bg-blue-100 text-blue-800",
        };
      case "pro":
        return {
          gradient: "from-purple-500 to-purple-700",
          border: "border-purple-400",
          button: "bg-purple-500 hover:bg-purple-600",
          badge: "bg-purple-100 text-purple-800",
        };
    }
  };

  const handleSubscribe = () => {
    const plan = plans.find((p) => p.type === selectedPlan);
    if (plan) {
      if (currentPlan && selectedPlan === currentPlan) {
        showErrorToast("Ban dang o goi nay", "Vui long chon goi khac de nang cap");
        return;
      }
      onSelectPlan(plan, promoApplied ? promoCode : undefined);
    }
  };

  const selectedPlanObj = plans.find((p) => p.type === selectedPlan);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Nâng cấp gói cước</h1>
                <p className="text-sm text-gray-600">Chọn gói phù hợp với nhu cầu của bạn</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPlan && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <div className="flex items-center space-x-3">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="text-sm font-semibold text-blue-800">Goi hien tai: {currentPlan.toUpperCase()}</span>
            </div>
            <span className="text-xs text-blue-700">Chon goi khac de doi hoac nang cap</span>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const colors = getPlanColor(plan.type);
            const isSelected = selectedPlan === plan.type;
            const finalPrice = calculatePrice(plan);

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.type)}
                className={`relative bg-white rounded-2xl shadow-lg cursor-pointer transition-all transform hover:scale-105 ${
                  isSelected ? `ring-4 ${colors.border}` : "border border-gray-200"
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      PHỔ BIẾN NHẤT
                    </span>
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                      {plan.nameVi}
                    </h3>
                    <div className="mb-2">
                      {discount > 0 && plan.price > 0 && isSelected ? (
                        <>
                          <span className="text-3xl font-bold text-gray-900">
                            {formatCurrency(finalPrice, plan.currency)}
                          </span>
                          <span className="text-lg text-gray-400 line-through ml-2">
                            {formatCurrency(plan.price, plan.currency)}
                          </span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold text-gray-900">
                          {formatCurrency(plan.price, plan.currency)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {plan.price === 0 ? "Mãi mãi" : `/ ${plan.period === "month" ? "tháng" : "năm"}`}
                    </p>
                    {plan.trialDays && isSelected && useTrialPeriod && (
                      <div className="mt-2">
                        <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                          Dùng thử {plan.trialDays} ngày miễn phí
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <div key={feature.id} className="flex items-start space-x-2">
                        {feature.included ? (
                          <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <div className="flex-shrink-0 w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mt-0.5">
                            <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <span className={`text-sm ${feature.included ? "text-gray-900" : "text-gray-400"}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Select Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan.type);
                    }}
                    disabled={plan.type === currentPlan}
                    className={`w-full py-3 text-white font-semibold transition-colors ${
                      plan.type === currentPlan
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : isSelected
                          ? colors.button
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {plan.type === currentPlan ? "Bạn đã ở plan này" : isSelected ? "Đã chọn" : "Chọn gói này"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trial Period Toggle */}
        {selectedPlanObj && selectedPlanObj.trialDays && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Dùng thử miễn phí</h3>
                  <p className="text-sm text-gray-600">
                    Dùng thử {selectedPlanObj.trialDays} ngày hoàn toàn miễn phí, không cần thanh toán trước
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useTrialPeriod}
                  onChange={(e) => setUseTrialPeriod(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}

        {/* Promo Code Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Mã khuyến mãi</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value.toUpperCase());
                setPromoApplied(false);
                setDiscount(0);
              }}
              placeholder="Nhập mã khuyến mãi"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              onClick={handleApplyPromo}
              disabled={!promoCode || isLoading}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-300"
            >
              {isLoading ? "Đang kiểm tra..." : "Áp dụng"}
            </Button>
          </div>
          {promoApplied && (
            <div className="mt-3 flex items-center text-sm text-green-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Mã khuyến mãi được áp dụng thành công! Giảm {discount}%
            </div>
          )}
          <div className="mt-3 text-xs text-gray-500">
            💡 Thử: <span className="font-mono font-semibold">SAVE20</span> hoặc <span className="font-mono font-semibold">FIRST50</span>
          </div>
        </div>

        {/* Subscribe Button */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Tổng thanh toán</p>
              <div className="flex items-baseline space-x-2">
                {selectedPlanObj && (
                  <>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatCurrency(calculatePrice(selectedPlanObj), selectedPlanObj.currency)}
                    </p>
                    {discount > 0 && selectedPlanObj.price > 0 && (
                      <p className="text-lg text-gray-400 line-through">
                        {formatCurrency(selectedPlanObj.price, selectedPlanObj.currency)}
                      </p>
                    )}
                  </>
                )}
              </div>
              {useTrialPeriod && selectedPlanObj?.trialDays && (
                <p className="text-sm text-green-600 mt-1">
                  Miễn phí {selectedPlanObj.trialDays} ngày đầu tiên
                </p>
              )}
            </div>
            <Button
              onClick={handleSubscribe}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg font-semibold"
            >
              Đăng ký ngay
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Bằng việc đăng ký, bạn đồng ý với{" "}
            <a 
              href="https://xdynamic.app/terms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Điều khoản dịch vụ
            </a>
            {" "}và{" "}
            <a 
              href="https://xdynamic.app/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Chính sách bảo mật
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeScreen;
