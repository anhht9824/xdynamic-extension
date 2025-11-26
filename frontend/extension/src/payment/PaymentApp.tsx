import React, { useState } from "react";
import { logger, redirectToPage } from "../utils";
import BillOverviewScreen from "./screens/BillOverviewScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PaymentConfirmationScreen from "./screens/PaymentConfirmationScreen";

type PaymentStep = "overview" | "payment" | "confirmation";

interface Bill {
  id: string;
  amount: number;
  currency: string;
  dueDate: string;
  status: "paid" | "unpaid" | "overdue";
  description: string;
  plan: string;
}

interface PaymentData {
  transactionId: string;
  method: string;
  amount: number;
  currency: string;
  timestamp: string;
  bill: Bill;
  paymentData: any;
}

const PaymentApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>("overview");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentResult, setPaymentResult] = useState<PaymentData | null>(null);

  // Check URL parameters for direct navigation
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    
    if (mode === "upgrade") {
      // Create a mock upgrade bill
      const upgradeBill: Bill = {
        id: "upgrade-001",
        amount: 150000,
        currency: "đ",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        status: "unpaid",
        description: "Nâng cấp lên Dynamic Premium",
        plan: "Dynamic Premium",
      };
      
      setSelectedBill(upgradeBill);
      setCurrentStep("payment");
    }
  }, []);

  const handleSelectBill = (bill: Bill) => {
    setSelectedBill(bill);
    setCurrentStep("payment");
  };

  const handlePaymentSuccess = (paymentData: PaymentData) => {
    setPaymentResult(paymentData);
    setCurrentStep("confirmation");
    
    // Update bill status (in real app, this would be handled by backend)
    if (selectedBill) {
      selectedBill.status = "paid";
    }
  };

  const handleBackToOverview = () => {
    setCurrentStep("overview");
    setSelectedBill(null);
  };

  const handleBackToDashboard = () => {
    // Redirect to dashboard
    redirectToPage('DASHBOARD');
  };

  const handleDownloadReceipt = () => {
    if (!paymentResult) return;

    // Generate PDF receipt content
    const receiptContent = `
      XDynamic - Hóa đơn thanh toán
      
      Mã giao dịch: ${paymentResult.transactionId}
      Ngày thanh toán: ${new Date(paymentResult.timestamp).toLocaleDateString("vi-VN")}
      
      Chi tiết:
      - Hóa đơn: ${paymentResult.bill.description}
      - Gói dịch vụ: ${paymentResult.bill.plan}
      - Phương thức: ${paymentResult.method}
      - Số tiền: ${new Intl.NumberFormat("vi-VN").format(paymentResult.amount)}${paymentResult.currency}
      
      Cảm ơn bạn đã sử dụng dịch vụ XDynamic!
    `;

    // Create and download file
    const blob = new Blob([receiptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${paymentResult.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareReceipt = () => {
    if (!paymentResult) return;

    const shareText = `🎉 Đã thanh toán thành công hóa đơn XDynamic!
    
📄 ${paymentResult.bill.description}
💰 ${new Intl.NumberFormat("vi-VN").format(paymentResult.amount)}${paymentResult.currency}
🆔 Mã GD: ${paymentResult.transactionId}

#XDynamic #ThanhToanThanhCong`;

    if (navigator.share) {
      navigator.share({
        title: "Hóa đơn XDynamic",
        text: shareText,
      }).catch((error) => logger.error("Failed to share receipt", error));
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText).then(() => {
        alert("Đã sao chép thông tin hóa đơn vào clipboard!");
      }).catch(() => {
        alert("Không thể chia sẻ. Vui lòng thử lại.");
      });
    }
  };

  switch (currentStep) {
    case "overview":
      return (
        <BillOverviewScreen
          onSelectBill={handleSelectBill}
          onBack={handleBackToDashboard}
        />
      );

    case "payment":
      if (!selectedBill) {
        setCurrentStep("overview");
        return null;
      }
      return (
        <PaymentScreen
          bill={selectedBill}
          onPaymentSuccess={handlePaymentSuccess}
          onBack={handleBackToOverview}
        />
      );

    case "confirmation":
      if (!paymentResult) {
        setCurrentStep("overview");
        return null;
      }
      return (
        <PaymentConfirmationScreen
          paymentData={paymentResult}
          onBackToDashboard={handleBackToDashboard}
          onDownloadReceipt={handleDownloadReceipt}
          onShareReceipt={handleShareReceipt}
        />
      );

    default:
      return null;
  }
};

export default PaymentApp;