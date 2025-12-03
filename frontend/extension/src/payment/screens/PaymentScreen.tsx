import React, { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { logger } from "../../utils";
import { paymentService, PaymentResult } from "../../services/payment.service";
import { useLanguageContext } from "../../providers/LanguageProvider";

interface PaymentScreenProps {
  initialAmount?: number;
  onBack: () => void;
  onPaymentResult: (result: PaymentResult) => void;
}

type PaymentMethod = "momo" | "credit-card" | "bank-transfer";

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  initialAmount = 50000,
  onBack,
  onPaymentResult,
}) => {
  const { language } = useLanguageContext();
  const tr = (vi: string, en: string) => (language === "vi" ? vi : en);

  const [amount, setAmount] = useState<number>(initialAmount);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("momo");
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat(language === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  const copy = {
    title: tr("Nạp tiền vào tài khoản", "Add funds to account"),
    subtitle: tr("Thanh toán an toàn và bảo mật", "Secure and protected payment"),
    pickAmount: tr("Chọn số tiền nạp", "Choose top-up amount"),
    customAmount: tr("Số tiền khác", "Custom amount"),
    minAmountNotice: tr("Tối thiểu 10.000 VND", "Minimum 10,000 VND"),
    methodTitle: tr("Phương thức thanh toán", "Payment method"),
    momoTitle: "Ví MoMo",
    momoDesc: tr("Quét mã QR để thanh toán", "Scan QR code to pay"),
    bankTitle: tr("Chuyển khoản ngân hàng", "Bank transfer"),
    bankDesc: tr("Sắp ra mắt", "Coming soon"),
    orderSummary: tr("Tóm tắt đơn hàng", "Order summary"),
    topupAmount: tr("Số tiền nạp", "Top-up amount"),
    fee: tr("Phí giao dịch", "Processing fee"),
    total: tr("Tổng cộng", "Total"),
    payCta: tr("Thanh toán", "Pay"),
    processing: tr("Đang xử lý...", "Processing..."),
    termsPrefix: tr("Bằng cách thanh toán, bạn đồng ý với", "By paying, you agree to our"),
    termsLink: tr("Điều khoản dịch vụ", "Terms of Service"),
    errors: {
      minAmount: tr("Số tiền tối thiểu là 10.000 VND", "Minimum amount is 10,000 VND"),
      noRedirect: tr("Không nhận được đường dẫn thanh toán", "Payment link is unavailable"),
      generic: tr("Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.", "Could not create payment. Please try again."),
    },
  };

  const handlePayment = async () => {
    if (amount < 10000) {
      onPaymentResult({
        transactionId: `LOCAL-${Date.now()}`,
        status: "failed",
        message: copy.errors.minAmount,
        timestamp: new Date().toISOString(),
        amount,
        failureReason: "insufficient_balance",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const returnUrl = window.location.href.split("?")[0];
      const response = await paymentService.createTopup(amount, returnUrl);

      if (response.pay_url) {
        window.location.href = response.pay_url;
      } else {
        throw new Error(copy.errors.noRedirect);
      }
    } catch (error: any) {
      logger.error("Payment initiation failed", error);
      onPaymentResult({
        transactionId: `LOCAL-${Date.now()}`,
        status: "failed",
        message: error?.message || copy.errors.generic,
        timestamp: new Date().toISOString(),
        amount,
        failureReason: "network_error",
      });
      setIsProcessing(false);
    }
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "momo":
        return (
          <svg
            className="w-6 h-6 text-pink-600"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#D82D8B" />
            <path
              d="M12 16.5c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"
              fill="#FFFFFF"
            />
            <path
              d="M12 5.5c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5zm0 11c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5z"
              fill="#FFFFFF"
            />
          </svg>
        );
      case "bank-transfer":
        return (
          <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v8m0-8H9m3 0h3m-3 4H9m3 0h3m-3 4H9m3 0h3" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6">
      <Card className="max-w-5xl mx-auto shadow-2xl border border-border/70 bg-card">
        <CardHeader className="border-b border-border/70 bg-muted/30 p-4 sm:p-6 flex flex-row items-center justify-between gap-4 space-y-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">{copy.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{copy.subtitle}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-none border border-border/70 bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-foreground">{copy.pickAmount}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[50000, 100000, 200000, 500000, 1000000, 2000000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className={`py-3 px-2 rounded-lg border text-sm font-medium transition-colors text-center focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                        amount === val
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card border-border text-foreground hover:bg-accent"
                      }`}
                    >
                      {formatCurrency(val)}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-amount">{copy.customAmount}</Label>
                  <div className="relative">
                    <Input
                      id="custom-amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="0"
                      min="10000"
                      className="pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-sm text-muted-foreground">VND</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{copy.minAmountNotice}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none border border-border/70 bg-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-foreground">{copy.methodTitle}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  defaultValue={selectedMethod}
                  onValueChange={(value: PaymentMethod) => setSelectedMethod(value)}
                  className="space-y-3"
                >
                  <Label
                    htmlFor="momo"
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors bg-card ${
                      selectedMethod === "momo"
                        ? "border-primary bg-primary/10 ring-2 ring-primary/50 shadow-sm"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {getMethodIcon("momo")}
                      <div>
                        <p className="font-medium text-foreground">{copy.momoTitle}</p>
                        <p className="text-sm text-muted-foreground">{copy.momoDesc}</p>
                      </div>
                    </div>
                    <RadioGroupItem value="momo" id="momo" className="h-5 w-5" />
                  </Label>

                  <Label
                    htmlFor="bank-transfer"
                    className="flex items-center justify-between p-4 border rounded-lg bg-muted text-muted-foreground opacity-70 cursor-not-allowed border-border/60"
                  >
                    <div className="flex items-center space-x-3">
                      {getMethodIcon("bank-transfer")}
                      <div>
                        <p className="font-medium">{copy.bankTitle}</p>
                        <p className="text-sm">{copy.bankDesc}</p>
                      </div>
                    </div>
                    <RadioGroupItem value="bank-transfer" id="bank-transfer" disabled className="h-5 w-5" />
                  </Label>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-none border border-border/70 bg-card sticky top-4">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-foreground">{copy.orderSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{copy.topupAmount}</span>
                  <span className="font-semibold text-foreground">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{copy.fee}</span>
                  <span className="font-semibold text-foreground">0 VND</span>
                </div>
                <div className="border-t border-border/70 pt-4 flex justify-between text-lg font-bold">
                  <span>{copy.total}</span>
                  <span className="text-primary">{formatCurrency(amount)}</span>
                </div>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || amount < 10000}
                  className="w-full py-3 text-base font-semibold shadow-md shadow-primary/25"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {copy.processing}
                    </>
                  ) : (
                    `${copy.payCta} ${formatCurrency(amount)}`
                  )}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  {copy.termsPrefix}{" "}
                  <a href="https://xdynamic.app/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    {copy.termsLink}
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentScreen;
