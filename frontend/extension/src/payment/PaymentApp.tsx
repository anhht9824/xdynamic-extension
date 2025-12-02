import React, { useEffect, useState } from "react";
import { logger, redirectToPage } from "../utils";
import PaymentConfirmationScreen from "./screens/PaymentConfirmationScreen";
import PaymentScreen from "./screens/PaymentScreen";
import { PaymentResult } from "../services/payment.service";
import { subscriptionService } from "../services/subscription.service";

type PaymentStep = "payment" | "confirmation";

const PaymentApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<PaymentStep>("payment");
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [defaultAmount, setDefaultAmount] = useState<number>(50000);
  const [currentPlan, setCurrentPlan] = useState<"free" | "plus" | "pro" | null>(null);

  useEffect(() => {
    const init = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      let activePlan: "free" | "plus" | "pro" | null = null;

      try {
        const subscription = await subscriptionService.getCurrentSubscription();
        activePlan = subscription.plan;
        setCurrentPlan(subscription.plan);
      } catch (error) {
        logger.warn("Unable to fetch current plan for payment screen", error);
      }

      const resultCode = urlParams.get("resultCode");
      const orderId = urlParams.get("orderId");
      const reasonParam = urlParams.get("reason");

      if (resultCode !== null) {
        const isSuccess = resultCode === "0";
        const amount = parseInt(urlParams.get("amount") || "0", 10);
        const message = urlParams.get("message") || (isSuccess ? "Thanh toan thanh cong" : "Thanh toan that bai");
        const failureReason = !isSuccess ? mapFailureReason(reasonParam || resultCode || message) : undefined;

        setPaymentResult({
          transactionId: orderId || `TXN-${Date.now()}`,
          status: isSuccess ? "success" : "failed",
          message,
          timestamp: new Date().toISOString(),
          amount,
          failureReason,
          currentPlan: activePlan || undefined,
        });
        setCurrentStep("confirmation");
        return;
      }

      const mode = urlParams.get("mode");
      if (mode === "upgrade") {
        setDefaultAmount(200000);
      }
    };

    void init();
  }, []);

  const handleBackToDashboard = () => {
    redirectToPage("DASHBOARD");
  };

  const handleDownloadReceipt = () => {
    if (!paymentResult) return;

    const receiptContent = `
      XDynamic - Hoa don thanh toan
      
      Ma giao dich: ${paymentResult.transactionId}
      Ngay thanh toan: ${new Date(paymentResult.timestamp).toLocaleDateString("vi-VN")}
      Trang thai: ${paymentResult.status === "success" ? "Thanh cong" : "That bai"}
      
      Chi tiet:
      - So tien: ${new Intl.NumberFormat("vi-VN").format(paymentResult.amount)} VND
      - Noi dung: ${paymentResult.message}
      
      Cam on ban da su dung dich vu XDynamic!
    `;

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

    const shareText = `Thanh toan XDynamic: ${paymentResult.status === "success" ? "Thanh cong" : "That bai"}
    
So tien: ${new Intl.NumberFormat("vi-VN").format(paymentResult.amount)} VND
Ma GD: ${paymentResult.transactionId}
${paymentResult.message}

#XDynamic`;

    if (navigator.share) {
      navigator
        .share({
          title: "Hoa don XDynamic",
          text: shareText,
        })
        .catch((error) => logger.error("Failed to share receipt", error));
    } else {
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          alert("Da sao chep thong tin vao clipboard!");
        })
        .catch(() => {
          alert("Khong the chia se. Vui long thu lai.");
        });
    }
  };

  const handleLocalPaymentResult = (result: PaymentResult) => {
    setPaymentResult(result);
    setCurrentStep("confirmation");
  };

  switch (currentStep) {
    case "payment":
      return (
        <PaymentScreen
          initialAmount={defaultAmount}
          onBack={handleBackToDashboard}
          onPaymentResult={handleLocalPaymentResult}
        />
      );

    case "confirmation":
      if (!paymentResult) {
        setCurrentStep("payment");
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

const mapFailureReason = (reasonLike?: string): PaymentResult["failureReason"] => {
  if (!reasonLike) return "unknown";
  const normalized = reasonLike.toLowerCase();

  if (
    normalized.includes("insufficient") ||
    normalized.includes("not enough") ||
    normalized.includes("khong du") ||
    normalized.includes("het tien")
  ) {
    return "insufficient_balance";
  }

  if (normalized.includes("network") || normalized.includes("timeout") || normalized.includes("server") || normalized.includes("ket noi")) {
    return "network_error";
  }

  return "unknown";
};
