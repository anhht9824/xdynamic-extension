import React, { useState } from "react";
import { logger } from "../../utils";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import { paymentService, PaymentResult } from "../../services/payment.service";

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
  const [amount, setAmount] = useState<number>(initialAmount);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("momo");
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN").format(val) + " VND";
  };

  const handlePayment = async () => {
    if (amount < 10000) {
      onPaymentResult({
        transactionId: `LOCAL-${Date.now()}`,
        status: "failed",
        message: "So tien toi thieu la 10.000 VND",
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
        throw new Error("Khong nhan duoc duong dan thanh toan");
      }
    } catch (error: any) {
      logger.error("Payment initiation failed", error);
      onPaymentResult({
        transactionId: `LOCAL-${Date.now()}`,
        status: "failed",
        message: error?.message || "Co loi xay ra khi tao thanh toan. Vui long thu lai.",
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
	          <svg className="w-6 h-6 text-pink-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
	            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" fill="#D82D8B"/>
	            <path d="M12 16.5c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" fill="#FFFFFF"/>
	            <path d="M12 5.5c-3.59 0-6.5 2.91-6.5 6.5s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5zm0 11c-2.485 0-4.5-2.015-4.5-4.5s2.015-4.5 4.5-4.5 4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5z" fill="#FFFFFF"/>
	          </svg>
	        );
	      case "bank-transfer":
	        return <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
	      default:
	        return <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v8m0-8H9m3 0h3m-3 4H9m3 0h3m-3 4H9m3 0h3" /></svg>;
	    }
	  };

	  return (
	    <div className="min-h-screen bg-gray-50 py-8">
	      <Card className="max-w-2xl mx-auto shadow-lg">
	        <CardHeader className="border-b p-4 sm:p-6 flex flex-row items-center justify-between">
	          <div className="flex items-center space-x-3">
	            <Button variant="ghost" size="icon" onClick={onBack}>
	              <ArrowLeft className="h-5 w-5" />
	            </Button>
	            <div>
	              <CardTitle className="text-xl font-bold">Nạp tiền vào tài khoản</CardTitle>
	              <p className="text-sm text-muted-foreground">Thanh toán an toàn và bảo mật</p>
	            </div>
	          </div>
	        </CardHeader>
	        <CardContent className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
	          {/* Cột 1: Chọn gói/số tiền */}
	          <div className="lg:col-span-2 space-y-6">
	            {/* Amount Selection */}
	            <Card className="shadow-none border">
	              <CardHeader>
	                <CardTitle className="text-lg">Chọn số tiền nạp</CardTitle>
	              </CardHeader>
	              <CardContent>
	                <div className="grid grid-cols-3 gap-3 mb-4">
	                  {[50000, 100000, 200000, 500000, 1000000, 2000000].map((val) => (
	                    <button
	                      key={val}
	                      onClick={() => setAmount(val)}
	                      className={`py-3 px-2 rounded-lg border text-sm font-medium transition-colors text-center ${
	                        amount === val
	                          ? "bg-primary/10 border-primary text-primary font-semibold"
	                          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
	                      }`}
	                    >
	                      {formatCurrency(val)}
	                    </button>
	                  ))}
	                </div>
	                <div className="space-y-2">
	                  <Label htmlFor="custom-amount">Số tiền khác</Label>
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
	                  <p className="text-xs text-muted-foreground">Tối thiểu 10.000 VND</p>
	                </div>
	              </CardContent>
	            </Card>
	
	            {/* Payment Method Selection */}
	            <Card className="shadow-none border">
	              <CardHeader>
	                <CardTitle className="text-lg">Phương thức thanh toán</CardTitle>
	              </CardHeader>
	              <CardContent>
	                <RadioGroup
	                  defaultValue={selectedMethod}
	                  onValueChange={(value: PaymentMethod) => setSelectedMethod(value)}
	                  className="space-y-3"
	                >
	                  <Label
	                    htmlFor="momo"
	                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
	                      selectedMethod === "momo"
	                        ? "border-primary ring-2 ring-primary/50"
	                        : "border-gray-200 hover:bg-gray-50"
	                    }`}
	                  >
	                    <div className="flex items-center space-x-3">
	                      {getMethodIcon("momo")}
	                      <div>
	                        <p className="font-medium text-gray-900">Ví MoMo</p>
	                        <p className="text-sm text-muted-foreground">Quét mã QR để thanh toán</p>
	                      </div>
	                    </div>
	                    <RadioGroupItem value="momo" id="momo" className="h-5 w-5" />
	                  </Label>
	
	                  <Label
	                    htmlFor="bank-transfer"
	                    className="flex items-center justify-between p-4 border rounded-lg opacity-50 cursor-not-allowed"
	                  >
	                    <div className="flex items-center space-x-3">
	                      {getMethodIcon("bank-transfer")}
	                      <div>
	                        <p className="font-medium text-gray-900">Chuyển khoản ngân hàng</p>
	                        <p className="text-sm text-muted-foreground">Sắp ra mắt</p>
	                      </div>
	                    </div>
	                    <RadioGroupItem value="bank-transfer" id="bank-transfer" disabled className="h-5 w-5" />
	                  </Label>
	                </RadioGroup>
	              </CardContent>
	            </Card>
	          </div>
	
	          {/* Cột 2: Tóm tắt đơn hàng và nút thanh toán */}
	          <div className="lg:col-span-1 space-y-6">
	            <Card className="shadow-none border sticky top-4">
	              <CardHeader>
	                <CardTitle className="text-lg">Tóm tắt đơn hàng</CardTitle>
	              </CardHeader>
	              <CardContent className="space-y-4">
	                <div className="flex justify-between text-sm">
	                  <span className="text-muted-foreground">Số tiền nạp</span>
	                  <span className="font-medium">{formatCurrency(amount)}</span>
	                </div>
	                <div className="flex justify-between text-sm">
	                  <span className="text-muted-foreground">Phí giao dịch</span>
	                  <span className="font-medium">0 VND</span>
	                </div>
	                <div className="border-t pt-4 flex justify-between text-lg font-bold">
	                  <span>Tổng cộng</span>
	                  <span className="text-primary">{formatCurrency(amount)}</span>
	                </div>
	                <Button
	                  onClick={handlePayment}
	                  disabled={isProcessing || amount < 10000}
	                  className="w-full py-3 text-base font-semibold"
	                >
	                  {isProcessing ? (
	                    <>
	                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
	                      Đang xử lý...
	                    </>
	                  ) : (
	                    `Thanh toán ${formatCurrency(amount)}`
	                  )}
	                </Button>
	                <p className="text-center text-xs text-muted-foreground">
	                  Bằng cách thanh toán, bạn đồng ý với{" "}
	                  <a
	                    href="https://xdynamic.app/terms"
	                    target="_blank"
	                    rel="noopener noreferrer"
	                    className="text-primary hover:underline"
	                  >
	                    Điều khoản dịch vụ
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
