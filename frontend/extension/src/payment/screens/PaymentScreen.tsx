import React, { useState } from "react";
import { logger } from "../../utils";
import { Button } from "../../components/ui";
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
          <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M0 0h24v24H0z" fill="none" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 104 0 2 2 0 00-4 0zm6-2a2 2 0 11-4 0 2 2 0 014 0z"
              clipRule="evenodd"
            />
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
                <h1 className="text-2xl font-bold text-gray-900">Nap tien vao tai khoan</h1>
                <p className="text-sm text-gray-600">Thanh toan an toan qua MoMo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Amount Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">So tien nap</h3>

          <div className="grid grid-cols-3 gap-4 mb-4">
            {[50000, 100000, 200000, 500000, 1000000, 2000000].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(val)}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-colors ${
                  amount === val ? "bg-blue-50 border-blue-500 text-blue-700" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {new Intl.NumberFormat("vi-VN").format(val)}
              </button>
            ))}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">So tien khac</label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md py-3"
                placeholder="0"
                min="10000"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">VND</span>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Toi thieu 10.000 VND</p>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Phuong thuc thanh toan</h3>

          <div className="space-y-3">
            <label
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedMethod === "momo" ? "border-pink-500 bg-pink-50" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="momo"
                checked={selectedMethod === "momo"}
                onChange={() => setSelectedMethod("momo")}
                className="sr-only"
              />
              <div className="flex-shrink-0 mr-3">{getMethodIcon("momo")}</div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">Vi MoMo</div>
                <div className="text-sm text-gray-500">Quet ma QR de thanh toan</div>
              </div>
              <div
                className={`w-4 h-4 rounded-full border-2 ${
                  selectedMethod === "momo" ? "border-pink-500 bg-pink-500" : "border-gray-300"
                }`}
              >
                {selectedMethod === "momo" && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
              </div>
            </label>

            {/* Disabled methods */}
            <div className="opacity-50 pointer-events-none">
              <label className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="flex-shrink-0 mr-3">{getMethodIcon("bank-transfer")}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Chuyen khoan ngan hang</div>
                  <div className="text-sm text-gray-500">Sap ra mat</div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <Button
          onClick={handlePayment}
          disabled={isProcessing || amount < 10000}
          className={`w-full py-4 text-lg font-semibold text-white ${
            isProcessing ? "bg-gray-400 cursor-not-allowed" : "bg-pink-600 hover:bg-pink-700"
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Dang xu ly...</span>
            </div>
          ) : (
            `Thanh toan ${formatCurrency(amount)}`
          )}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Bang cach thanh toan, ban dong y voi{" "}
          <a href="https://xdynamic.app/terms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Dieu khoan dich vu
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentScreen;
