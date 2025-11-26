import React, { useState } from "react";
import { logger } from "../../utils";
import { Button, FormInput } from "../../components/ui";

interface Bill {
  id: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: "paid" | "unpaid" | "overdue";
  description: string;
  plan: string;
}

interface PaymentScreenProps {
  bill: Bill;
  onPaymentSuccess: (paymentData: any) => void;
  onBack: () => void;
}

type PaymentMethod = "credit-card" | "bank-transfer" | "e-wallet";

interface PaymentData {
  method: PaymentMethod;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  saveCard?: boolean;
  bankAccount?: string;
  walletType?: string;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({
  bill,
  onPaymentSuccess,
  onBack,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("credit-card");
  const [paymentData, setPaymentData] = useState<PaymentData>({
    method: "credit-card",
    saveCard: false,
  });
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + currency;
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    // Add slash after 2 digits
    if (digits.length >= 2) {
      return digits.slice(0, 2) + "/" + digits.slice(2, 4);
    }
    return digits;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (selectedMethod === "credit-card") {
      if (!paymentData.cardNumber) {
        newErrors.cardNumber = "Vui lòng nhập số thẻ";
      } else if (paymentData.cardNumber.replace(/\s/g, "").length < 16) {
        newErrors.cardNumber = "Số thẻ phải có 16 chữ số";
      }

      if (!paymentData.expiryDate) {
        newErrors.expiryDate = "Vui lòng nhập ngày hết hạn";
      } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
        newErrors.expiryDate = "Định dạng: MM/YY";
      }

      if (!paymentData.cvv) {
        newErrors.cvv = "Vui lòng nhập mã CVV";
      } else if (paymentData.cvv.length < 3) {
        newErrors.cvv = "CVV phải có 3-4 chữ số";
      }

      if (!paymentData.cardholderName) {
        newErrors.cardholderName = "Vui lòng nhập tên chủ thẻ";
      }
    }

    if (selectedMethod === "bank-transfer" && !paymentData.bankAccount) {
      newErrors.bankAccount = "Vui lòng chọn tài khoản ngân hàng";
    }

    if (selectedMethod === "e-wallet" && !paymentData.walletType) {
      newErrors.walletType = "Vui lòng chọn ví điện tử";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simulate 3D Secure for credit cards
      if (selectedMethod === "credit-card") {
        // In real app, this would redirect to 3D Secure page
        const confirm3DS = window.confirm(
          "Xác thực 3D Secure\n\nBạn sẽ được chuyển đến trang xác thực của ngân hàng. Tiếp tục?"
        );
        
        if (!confirm3DS) {
          setIsProcessing(false);
          return;
        }

        // Simulate 3D Secure processing
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Success
      const paymentResult = {
        transactionId: "TXN" + Date.now(),
        method: selectedMethod,
        amount: bill.amount,
        currency: bill.currency,
        timestamp: new Date().toISOString(),
        bill: bill,
        paymentData: paymentData,
      };

      onPaymentSuccess(paymentResult);
    } catch (error) {
      logger.error("Payment failed", error);
      alert("Thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case "credit-card":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
        );
      case "bank-transfer":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6-2a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
          </svg>
        );
      case "e-wallet":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-2xl font-bold text-gray-900">Thanh toán hóa đơn</h1>
                <p className="text-sm text-gray-600">Hoàn tất thanh toán an toàn</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bill Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Chi tiết hóa đơn</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Gói dịch vụ:</span>
              <span className="font-medium">{bill.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mô tả:</span>
              <span className="font-medium">{bill.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hạn thanh toán:</span>
              <span className="font-medium">
                {new Date(bill.dueDate).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">
                  {formatCurrency(bill.amount, bill.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Phương thức thanh toán</h3>
          
          <div className="space-y-3">
            {[
              { id: "credit-card", label: "Thẻ tín dụng/ghi nợ", desc: "Visa, Mastercard, JCB" },
              { id: "bank-transfer", label: "Chuyển khoản ngân hàng", desc: "Internet Banking, QR Code" },
              { id: "e-wallet", label: "Ví điện tử", desc: "MoMo, ZaloPay, VNPay" },
            ].map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedMethod === method.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
                  className="sr-only"
                />
                <div className="flex-shrink-0 mr-3">
                  {getMethodIcon(method.id as PaymentMethod)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{method.label}</div>
                  <div className="text-sm text-gray-500">{method.desc}</div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedMethod === method.id
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Payment Details Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin thanh toán</h3>
          
          {selectedMethod === "credit-card" && (
            <div className="space-y-4">
              <FormInput
                label="Số thẻ"
                type={showCardNumber ? "text" : "password"}
                value={paymentData.cardNumber || ""}
                onChange={(e) => {
                  const formatted = formatCardNumber(e.target.value);
                  setPaymentData({ ...paymentData, cardNumber: formatted });
                }}
                placeholder="1234 5678 9012 3456"
                error={errors.cardNumber}
                maxLength={19}
              />
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={() => setShowCardNumber(!showCardNumber)}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  {showCardNumber ? "Ẩn số thẻ" : "Hiện số thẻ"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Ngày hết hạn"
                  type="text"
                  value={paymentData.expiryDate || ""}
                  onChange={(e) => {
                    const formatted = formatExpiryDate(e.target.value);
                    setPaymentData({ ...paymentData, expiryDate: formatted });
                  }}
                  placeholder="MM/YY"
                  error={errors.expiryDate}
                  maxLength={5}
                />

                <FormInput
                  label="Mã CVV"
                  type="password"
                  value={paymentData.cvv || ""}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setPaymentData({ ...paymentData, cvv: value });
                  }}
                  placeholder="123"
                  error={errors.cvv}
                  maxLength={4}
                />
              </div>

              <FormInput
                label="Tên chủ thẻ"
                type="text"
                value={paymentData.cardholderName || ""}
                onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
                placeholder="NGUYEN VAN A"
                error={errors.cardholderName}
                style={{ textTransform: 'uppercase' }}
              />

              <div className="flex items-center">
                <input
                  id="save-card"
                  type="checkbox"
                  checked={paymentData.saveCard}
                  onChange={(e) => setPaymentData({ ...paymentData, saveCard: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="save-card" className="ml-2 text-sm text-gray-700">
                  Lưu thông tin thẻ cho lần thanh toán sau (An toàn & Bảo mật)
                </label>
              </div>
            </div>
          )}

          {selectedMethod === "bank-transfer" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn ngân hàng
                </label>
                <select
                  value={paymentData.bankAccount || ""}
                  onChange={(e) => setPaymentData({ ...paymentData, bankAccount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn ngân hàng...</option>
                  <option value="vietcombank">Vietcombank</option>
                  <option value="techcombank">Techcombank</option>
                  <option value="vcb">VCB</option>
                  <option value="bidv">BIDV</option>
                  <option value="mb">MB Bank</option>
                </select>
                {errors.bankAccount && (
                  <p className="text-red-500 text-sm mt-1">{errors.bankAccount}</p>
                )}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Bạn sẽ được chuyển đến trang Internet Banking của ngân hàng để hoàn tất thanh toán.
                </p>
              </div>
            </div>
          )}

          {selectedMethod === "e-wallet" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn ví điện tử
                </label>
                <select
                  value={paymentData.walletType || ""}
                  onChange={(e) => setPaymentData({ ...paymentData, walletType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn ví điện tử...</option>
                  <option value="momo">MoMo</option>
                  <option value="zalopay">ZaloPay</option>
                  <option value="vnpay">VNPay</option>
                  <option value="shopeepay">ShopeePay</option>
                </select>
                {errors.walletType && (
                  <p className="text-red-500 text-sm mt-1">{errors.walletType}</p>
                )}
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  📱 Bạn sẽ được chuyển đến ứng dụng ví điện tử để xác nhận thanh toán.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Security Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Thanh toán được bảo mật bằng SSL 256-bit và tuân thủ chuẩn PCI DSS
            </span>
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-semibold"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Đang xử lý...</span>
            </div>
          ) : (
            `Thanh toán ngay ${formatCurrency(bill.amount, bill.currency)}`
          )}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Bằng cách thanh toán, bạn đồng ý với{" "}
          <a 
            href="https://xdynamic.app/terms" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Điều khoản dịch vụ
          </a>{" "}
          và{" "}
          <a 
            href="https://xdynamic.app/privacy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Chính sách bảo mật
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default PaymentScreen;