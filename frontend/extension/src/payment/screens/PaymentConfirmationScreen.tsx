import React from "react";
import { Button } from "../../components/ui";

interface PaymentConfirmationScreenProps {
  paymentData: {
    transactionId: string;
    method: string;
    amount: number;
    currency: string;
    timestamp: string;
    bill: {
      id: string;
      description: string;
      plan: string;
    };
  };
  onBackToDashboard: () => void;
  onDownloadReceipt: () => void;
  onShareReceipt: () => void;
}

const PaymentConfirmationScreen: React.FC<PaymentConfirmationScreenProps> = ({
  paymentData,
  onBackToDashboard,
  onDownloadReceipt,
  onShareReceipt,
}) => {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + currency;
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("vi-VN");
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case "credit-card":
        return "Thẻ tín dụng/ghi nợ";
      case "bank-transfer":
        return "Chuyển khoản ngân hàng";
      case "e-wallet":
        return "Ví điện tử";
      default:
        return method;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Success Modal */}
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Thanh toán thành công!
        </h2>
        <p className="text-gray-600 mb-8">
          Hóa đơn của bạn đã được thanh toán thành công. Dịch vụ sẽ được kích hoạt trong vài phút.
        </p>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-4">Chi tiết thanh toán</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã giao dịch:</span>
              <span className="font-mono font-medium">{paymentData.transactionId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Hóa đơn:</span>
              <span className="font-medium">{paymentData.bill.description}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Gói dịch vụ:</span>
              <span className="font-medium">{paymentData.bill.plan}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Phương thức:</span>
              <span className="font-medium">{getMethodText(paymentData.method)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian:</span>
              <span className="font-medium">{formatDateTime(paymentData.timestamp)}</span>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between font-semibold">
                <span>Tổng cộng:</span>
                <span className="text-green-600">
                  {formatCurrency(paymentData.amount, paymentData.currency)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={onBackToDashboard}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3"
          >
            Quay lại Dashboard
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onDownloadReceipt}
              variant="outline"
              className="py-2 text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Tải PDF
            </Button>
            
            <Button
              onClick={onShareReceipt}
              variant="outline"
              className="py-2 text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Chia sẻ
            </Button>
          </div>
        </div>

        {/* Support Notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Cần hỗ trợ?</strong><br />
            Liên hệ hotline: <span className="font-mono">1900-1234</span><br />
            hoặc email: <span className="font-mono">support@xdynamic.com</span>
          </p>
        </div>

        {/* Email Confirmation Notice */}
        <p className="text-xs text-gray-500 mt-4">
          📧 Email xác nhận đã được gửi đến địa chỉ email của bạn
        </p>
      </div>

      {/* Background Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 -z-10"></div>
    </div>
  );
};

export default PaymentConfirmationScreen;