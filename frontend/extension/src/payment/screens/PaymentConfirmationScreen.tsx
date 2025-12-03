import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { CheckCircle, XCircle, Download, Share2, ArrowLeft } from "lucide-react";
import { PaymentResult } from "../../services/payment.service";
import { useLanguageContext } from "../../providers/LanguageProvider";

interface PaymentConfirmationScreenProps {
  paymentData: PaymentResult;
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
  const { language } = useLanguageContext();
  const tr = (vi: string, en: string) => (language === "vi" ? vi : en);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(language === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDateTime = (timestamp: string) => new Date(timestamp).toLocaleString(language === "vi" ? "vi-VN" : "en-US");

  const mapFailureReasonText = (reason: NonNullable<PaymentResult["failureReason"]>) => {
    switch (reason) {
      case "insufficient_balance":
        return tr("Không đủ số dư để thanh toán", "Insufficient balance to pay");
      case "network_error":
        return tr("Không kết nối được máy chủ", "Could not reach the payment server");
      default:
        return tr("Thanh toán thất bại", "Payment failed");
    }
  };

  const copy = {
    statusSuccess: tr("Thanh toán thành công", "Payment successful"),
    statusFail: tr("Thanh toán thất bại", "Payment failed"),
    successMessage: tr("Giao dịch của bạn đã được xử lý thành công.", "Your payment has been processed successfully."),
    failureMessage: tr("Thanh toán thất bại. Vui lòng thử lại.", "Payment failed. Please try again."),
    amount: tr("Số tiền", "Amount"),
    state: tr("Trạng thái", "Status"),
    stateSuccess: tr("Hoàn tất", "Completed"),
    stateFail: tr("Thất bại", "Failed"),
    details: tr("Chi tiết giao dịch", "Transaction details"),
    transactionId: tr("Mã giao dịch", "Transaction ID"),
    time: tr("Thời gian", "Time"),
    currentPlan: tr("Gói hiện tại", "Current plan"),
    failureReason: tr("Lý do thất bại", "Failure reason"),
    unknownReason: tr("Không rõ lý do", "Unknown reason"),
    back: tr("Quay lại Dashboard", "Back to Dashboard"),
    download: tr("Tải PDF", "Download PDF"),
    share: tr("Chia sẻ", "Share"),
    retry: tr("Thử lại sau", "Try again later"),
    support: tr("Cần hỗ trợ?", "Need help?"),
    hotline: tr("Hotline", "Hotline"),
    email: "support@xdynamic.com",
  };

  const isSuccess = paymentData.status === "success";
  const friendlyFailure = !isSuccess && paymentData.failureReason ? mapFailureReasonText(paymentData.failureReason) : null;
  const friendlyMessage = paymentData.message || (isSuccess ? copy.successMessage : friendlyFailure || copy.failureMessage);

  const badgeColor = isSuccess ? "bg-green-500/15 text-green-200 border-green-500/30" : "bg-red-500/15 text-red-200 border-red-500/30";
  const accentColor = isSuccess ? "text-green-400" : "text-red-400";

  return (
    <div className="w-full bg-card text-foreground p-6 sm:p-8 space-y-6 rounded-2xl border border-border shadow-2xl">
      <div className="flex flex-col items-center text-center gap-3">
        <div
          className={`h-16 w-16 rounded-full border-4 ${isSuccess ? "border-green-500/30" : "border-red-500/30"} bg-background shadow-md flex items-center justify-center`}
        >
          {isSuccess ? <CheckCircle className="w-10 h-10 text-green-400" /> : <XCircle className="w-10 h-10 text-red-400" />}
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${badgeColor}`}>
          {isSuccess ? copy.stateSuccess : copy.stateFail}
        </span>
        <h2 className={`text-3xl font-extrabold ${accentColor}`}>{isSuccess ? copy.statusSuccess : copy.statusFail}</h2>
        <p className="text-sm text-muted-foreground max-w-md">{friendlyMessage}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-xl border border-border bg-card shadow-sm p-4">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{copy.amount}</p>
          <p className={`text-2xl font-bold ${accentColor}`}>{formatCurrency(paymentData.amount)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{copy.state}</p>
          <p className={`text-2xl font-bold ${accentColor}`}>{isSuccess ? copy.stateSuccess : copy.stateFail}</p>
        </div>
      </div>

      <Card className="shadow-sm border border-border bg-card">
        <CardHeader className="p-4 border-b border-border/80 bg-muted/20">
          <CardTitle className="text-base">{copy.details}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-3 text-sm">
          <DetailRow label={copy.transactionId} value={paymentData.transactionId} valueClass="font-mono text-primary" />
          <DetailRow label={copy.time} value={formatDateTime(paymentData.timestamp)} />
          {paymentData.currentPlan && <DetailRow label={copy.currentPlan} value={paymentData.currentPlan.toUpperCase()} />}
          {!isSuccess && <DetailRow label={copy.failureReason} value={friendlyFailure || copy.unknownReason} valueClass="text-red-400 font-semibold" />}
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Button onClick={onBackToDashboard} className="w-full text-base">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {copy.back}
        </Button>

        {isSuccess ? (
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={onDownloadReceipt} variant="outline" className="py-2 text-sm">
              <Download className="w-4 h-4 mr-2" />
              {copy.download}
            </Button>

            <Button onClick={onShareReceipt} variant="outline" className="py-2 text-sm">
              <Share2 className="w-4 h-4 mr-2" />
              {copy.share}
            </Button>
          </div>
        ) : (
          <Button onClick={onBackToDashboard} variant="outline" className="w-full text-base">
            {copy.retry}
          </Button>
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          <span className="font-semibold text-foreground">{copy.support}</span> {copy.hotline} <span className="font-mono">1900-1234</span> - Email{" "}
          <span className="font-mono">{copy.email}</span>
        </p>
      </div>
    </div>
  );
};

export default PaymentConfirmationScreen;

const DetailRow = ({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className={`font-medium ${valueClass || "text-foreground"}`}>{value}</span>
  </div>
);
