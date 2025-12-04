import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../../components/ui";
import { Plan, PlanType, PlanFeature } from "../../types/common";
import { useToast } from "../../hooks/useToast";
import { subscriptionService } from "../../services/subscription.service";
import { useLanguageContext } from "../../providers/LanguageProvider";

interface UpgradeScreenProps {
  onSelectPlan: (plan: Plan, promoCode?: string) => void;
  onBack: () => void;
}

type FeatureCopy = PlanFeature & { vi: string; en: string };

const UpgradeScreen: React.FC<UpgradeScreenProps> = ({ onSelectPlan, onBack }) => {
  const { language } = useLanguageContext();
  const tr = useCallback((vi: string, en: string) => (language === "vi" ? vi : en), [language]);

  const [selectedPlan, setSelectedPlan] = useState<PlanType>("plus");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [useTrialPeriod, setUseTrialPeriod] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PlanType | null>(null);
  const { error: showErrorToast, success: showSuccessToast } = useToast();

  const plans: Array<
    Plan & {
      nameVi: string;
      name: string;
      features: FeatureCopy[];
      badge?: string;
      trialDays?: number;
    }
  > = [
    {
      id: "plan-free",
      type: "free",
      name: tr("Basic Free", "Basic Free"),
      nameVi: tr("Miễn phí", "Free"),
      price: 0,
      currency: "đ",
      period: "month",
      features: [
        { id: "f1", text: "Basic content blocking", included: true, vi: "Chặn nội dung cơ bản", en: "Basic content blocking" },
        { id: "f2", text: "Monthly reports", included: true, vi: "Báo cáo hàng tháng", en: "Monthly reports" },
        { id: "f3", text: "Email support", included: true, vi: "Hỗ trợ email", en: "Email support" },
        { id: "f4", text: "Advanced detection", included: false, vi: "Phát hiện nâng cao", en: "Advanced detection" },
        { id: "f5", text: "Video streaming protection", included: false, vi: "Bảo vệ streaming video", en: "Video streaming protection" },
        { id: "f6", text: "Priority support 24/7", included: false, vi: "Hỗ trợ ưu tiên 24/7", en: "Priority support 24/7" },
        { id: "f7", text: "Real-time detailed reports", included: false, vi: "Báo cáo chi tiết thời gian thực", en: "Real-time detailed reports" },
        { id: "f8", text: "Advanced filter customization", included: false, vi: "Tùy chỉnh bộ lọc nâng cao", en: "Advanced filter customization" },
      ] as FeatureCopy[],
    },
    {
      id: "plan-plus",
      type: "plus",
      name: tr("Dynamic Plus", "Dynamic Plus"),
      nameVi: tr("Plus", "Plus"),
      price: 50000,
      currency: "đ",
      period: "month",
      isPopular: true,
      badge: tr("Phổ biến nhất", "Most popular"),
      trialDays: 7,
      features: [
        { id: "f1", text: "Basic content blocking", included: true, vi: "Chặn nội dung cơ bản", en: "Basic content blocking" },
        { id: "f2", text: "Monthly reports", included: true, vi: "Báo cáo hàng tháng", en: "Monthly reports" },
        { id: "f3", text: "Email support", included: true, vi: "Hỗ trợ email", en: "Email support" },
        { id: "f4", text: "Advanced detection", included: true, vi: "Phát hiện nâng cao", en: "Advanced detection" },
        { id: "f5", text: "Video streaming protection", included: true, vi: "Bảo vệ streaming video", en: "Video streaming protection" },
        { id: "f6", text: "Priority support 24/7", included: false, vi: "Hỗ trợ ưu tiên 24/7", en: "Priority support 24/7" },
        { id: "f7", text: "Real-time detailed reports", included: false, vi: "Báo cáo chi tiết thời gian thực", en: "Real-time detailed reports" },
        { id: "f8", text: "Advanced filter customization", included: false, vi: "Tùy chỉnh bộ lọc nâng cao", en: "Advanced filter customization" },
      ] as FeatureCopy[],
    },
    {
      id: "plan-pro",
      type: "pro",
      name: tr("Dynamic Pro", "Dynamic Pro"),
      nameVi: tr("Pro", "Pro"),
      price: 100000,
      currency: "đ",
      period: "month",
      trialDays: 14,
      features: [
        { id: "f1", text: "Basic content blocking", included: true, vi: "Chặn nội dung cơ bản", en: "Basic content blocking" },
        { id: "f2", text: "Monthly reports", included: true, vi: "Báo cáo hàng tháng", en: "Monthly reports" },
        { id: "f3", text: "Email support", included: true, vi: "Hỗ trợ email", en: "Email support" },
        { id: "f4", text: "Advanced detection", included: true, vi: "Phát hiện nâng cao", en: "Advanced detection" },
        { id: "f5", text: "Video streaming protection", included: true, vi: "Bảo vệ streaming video", en: "Video streaming protection" },
        { id: "f6", text: "Priority support 24/7", included: true, vi: "Hỗ trợ ưu tiên 24/7", en: "Priority support 24/7" },
        { id: "f7", text: "Real-time detailed reports", included: true, vi: "Báo cáo chi tiết thời gian thực", en: "Real-time detailed reports" },
        { id: "f8", text: "Advanced filter customization", included: true, vi: "Tùy chỉnh bộ lọc nâng cao", en: "Advanced filter customization" },
      ] as FeatureCopy[],
    },
  ];

  useEffect(() => {
    const loadCurrentPlan = async () => {
      try {
        const sub = await subscriptionService.getCurrentSubscription();
        if (sub?.plan) {
          setCurrentPlan(sub.plan);
          setSelectedPlan(sub.plan);
        }
      } catch (error) {
        showErrorToast(tr("Không tải được gói hiện tại", "Unable to load current plan"));
      }
    };

    void loadCurrentPlan();
  }, [showErrorToast, language]);

  const handleApplyPromo = () => {
    setIsLoading(true);
    setTimeout(() => {
      const code = promoCode.trim().toUpperCase();
      const apply = (percent: number) => {
        setPromoApplied(true);
        setDiscount(percent);
        showSuccessToast(tr("Mã giảm giá đã áp dụng", "Promo applied"), tr(`Bạn được giảm ${percent}%`, `You got ${percent}% off`));
      };

      if (code === "SAVE20") {
        apply(20);
      } else if (code === "FIRST50") {
        apply(50);
      } else {
        setPromoApplied(false);
        setDiscount(0);
        showErrorToast(tr("Mã giảm giá không hợp lệ", "Invalid promo code"), tr("Vui lòng kiểm tra lại mã", "Please check your code"));
      }
      setIsLoading(false);
    }, 500);
  };

  const calculatePrice = (plan: Plan) => {
    if (plan.price === 0) return 0;
    if (promoApplied && discount > 0) {
      return Math.max(0, Math.round(plan.price * (1 - discount / 100)));
    }
    return plan.price;
  };

  const formatCurrency = (amount: number, currency: string) => {
    if (amount === 0) return tr("Miễn phí", "Free");
    return new Intl.NumberFormat(language === "vi" ? "vi-VN" : "en-US").format(amount) + currency;
  };

  const getPlanColor = (planType: PlanType) => {
    switch (planType) {
      case "free":
        return {
          border: "border-border/80",
          glow: "shadow-[0_12px_32px_-14px_rgba(148,163,184,0.25)]",
          button: "bg-muted text-foreground hover:bg-muted/80",
          badge: "bg-muted text-foreground",
        };
      case "plus":
        return {
          border: "border-primary/60",
          glow: "shadow-[0_12px_32px_-14px_rgba(93,168,255,0.35)]",
          button: "bg-primary text-primary-foreground hover:bg-primary/90",
          badge: "bg-primary/15 text-primary",
        };
      case "pro":
        return {
          border: "border-secondary/60",
          glow: "shadow-[0_12px_32px_-14px_rgba(70,201,248,0.32)]",
          button: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
          badge: "bg-secondary/15 text-secondary-foreground",
        };
    }
  };

  const handleSubscribe = () => {
    const plan = plans.find((p) => p.type === selectedPlan);
    if (plan) {
      if (currentPlan && selectedPlan === currentPlan) {
        showErrorToast(tr("Bạn đang ở gói này", "You are already on this plan"), tr("Vui lòng chọn gói khác để nâng cấp", "Pick another plan to upgrade"));
        return;
      }
      onSelectPlan(plan, promoApplied ? promoCode : undefined);
    }
  };

  const selectedPlanObj = plans.find((p) => p.type === selectedPlan);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-card/95 backdrop-blur rounded-2xl border border-border shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/80 px-4 sm:px-6 py-4 bg-muted/30">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="p-2 rounded-full bg-muted hover:bg-accent transition-colors text-foreground"
                aria-label={tr("Quay lại", "Go back")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">{tr("Nâng cấp gói cước", "Upgrade your plan")}</h1>
                <p className="text-sm text-muted-foreground">{tr("Chọn gói phù hợp với nhu cầu của bạn", "Pick the plan that fits you best")}</p>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 py-6 space-y-8 bg-background/40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const colors = getPlanColor(plan.type);
                const isSelected = selectedPlan === plan.type;
                const finalPrice = calculatePrice(plan);
                const isCurrent = plan.type === currentPlan;

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-2xl border ${colors.border} bg-card p-5 transition-all cursor-pointer ${
                      isSelected ? `${colors.glow} ring-2 ring-offset-2 ring-primary/40 ring-offset-background` : "hover:shadow-lg hover:border-primary/40"
                    }`}
                    onClick={() => setSelectedPlan(plan.type)}
                  >
                    {plan.isPopular && (
                      <span className="absolute -top-3 right-4 rounded-full bg-primary/15 text-primary text-xs font-semibold px-3 py-1 shadow-sm">
                        {plan.badge}
                      </span>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">{plan.name}</p>
                        <p className="text-lg font-bold text-foreground">{plan.nameVi}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-baseline space-x-2">
                        {discount > 0 && plan.price > 0 && isSelected ? (
                          <>
                            <span className="text-3xl font-bold text-foreground">{formatCurrency(finalPrice, plan.currency)}</span>
                            <span className="text-lg text-muted-foreground line-through">{formatCurrency(plan.price, plan.currency)}</span>
                          </>
                        ) : (
                          <span className="text-3xl font-bold text-foreground">{formatCurrency(plan.price, plan.currency)}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.price === 0 ? tr("Mãi mãi", "Forever") : `/ ${plan.period === "month" ? tr("tháng", "month") : "year"}`}</p>
                      {plan.trialDays && isSelected && useTrialPeriod && (
                        <div className="mt-2">
                          <span className="inline-block bg-green-500/15 text-green-200 text-xs font-semibold px-3 py-1 rounded-full border border-green-500/30">
                            {tr("Dùng thử", "Trial")} {plan.trialDays} {tr("ngày miễn phí", "days free")}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <div key={feature.id} className="flex items-start space-x-2">
                          {feature.included ? (
                            <div className="flex-shrink-0 w-5 h-5 bg-green-500/15 rounded-full flex items-center justify-center mt-0.5 border border-green-500/40">
                              <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-5 h-5 bg-muted rounded-full flex items-center justify-center mt-0.5 border border-border/60">
                              <svg className="w-3 h-3 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                          <span className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground"}`}>{tr((feature as FeatureCopy).vi, (feature as FeatureCopy).en)}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlan(plan.type);
                      }}
                      disabled={isCurrent}
                      className={`w-full py-3 font-semibold transition-colors ${
                        isCurrent
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : isSelected
                            ? colors.button
                            : "bg-accent text-foreground hover:bg-accent/80"
                      }`}
                    >
                      {isCurrent ? tr("Bạn đang ở gói này", "Current plan") : isSelected ? tr("Đã chọn", "Selected") : tr("Chọn gói này", "Choose this plan")}
                    </Button>
                  </div>
                );
              })}
            </div>

            {selectedPlanObj && selectedPlanObj.trialDays && (
              <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500/15 border border-green-500/30 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{tr("Dùng thử miễn phí", "Free trial")}</h3>
                      <p className="text-sm text-muted-foreground">
                        {tr("Dùng thử", "Try for")} {selectedPlanObj.trialDays} {tr("ngày hoàn toàn miễn phí, không cần thanh toán trước", "days free, no upfront payment")}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={useTrialPeriod} onChange={(e) => setUseTrialPeriod(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/40 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-background"></div>
                  </label>
                </div>
              </div>
            )}

            <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-3">
              <h3 className="font-semibold text-foreground">{tr("Mã khuyến mãi", "Promo code")}</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoApplied(false);
                    setDiscount(0);
                  }}
                  placeholder={tr("Nhập mã khuyến mãi", "Enter promo code")}
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent bg-background text-foreground placeholder:text-muted-foreground"
                />
                <Button onClick={handleApplyPromo} disabled={!promoCode || isLoading} className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground disabled:bg-muted disabled:text-muted-foreground">
                  {isLoading ? tr("Đang kiểm tra...", "Checking...") : tr("Áp dụng", "Apply")}
                </Button>
              </div>
              {promoApplied && (
                <div className="flex items-center text-sm text-green-400">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {tr("Mã đã áp dụng thành công! Giảm", "Promo applied! Discount")} {discount}%
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                {tr("Gợi ý", "Hint")}: <span className="font-mono font-semibold">SAVE20</span> {tr("hoặc", "or")}{" "}
                <span className="font-mono font-semibold">FIRST50</span>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{tr("Tổng thanh toán", "Total due")}</p>
                  <div className="flex items-baseline space-x-2">
                    {selectedPlanObj && (
                      <>
                        <p className="text-3xl font-bold text-foreground">{formatCurrency(calculatePrice(selectedPlanObj), selectedPlanObj.currency)}</p>
                        {discount > 0 && selectedPlanObj.price > 0 && (
                          <p className="text-lg text-muted-foreground line-through">{formatCurrency(selectedPlanObj.price, selectedPlanObj.currency)}</p>
                        )}
                      </>
                    )}
                  </div>
                  {useTrialPeriod && selectedPlanObj?.trialDays && (
                    <p className="text-sm text-green-400 mt-1">
                      {tr("Miễn phí", "Free")} {selectedPlanObj.trialDays} {tr("ngày đầu tiên", "first days")}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleSubscribe}
                  className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold shadow-md shadow-primary/25"
                >
                  {tr("Đăng ký ngay", "Subscribe now")}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">
                {tr("Bằng việc đăng ký, bạn đồng ý với", "By subscribing you agree to")}{" "}
                <a href="https://xdynamic.app/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {tr("Điều khoản dịch vụ", "Terms of Service")}
                </a>{" "}
                {tr("và", "and")}{" "}
                <a href="https://xdynamic.app/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {tr("Chính sách bảo mật", "Privacy Policy")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeScreen;
