import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { CheckCircle, XCircle, Download, Share2, ArrowLeft } from "lucide-react";
import { PaymentResult } from "../../services/payment.service";

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
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("vi-VN");
  };

  const isSuccess = paymentData.status === "success";
  const friendlyFailure = !isSuccess && paymentData.failureReason ? mapFailureReasonText(paymentData.failureReason) : null;
  const friendlyMessage =
    paymentData.message ||
    (isSuccess ? "Giao dich cua ban da duoc xu ly thanh cong." : friendlyFailure || "Thanh toan that bai. Vui long thu lai.");

	  return (
	    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
	      <Card className="w-full max-w-lg shadow-xl">
	        <CardHeader className="text-center space-y-3 pt-8">
	          <div className="flex justify-center">
	            {isSuccess ? (
	              <CheckCircle className="w-16 h-16 text-green-500" />
	            ) : (
	              <XCircle className="w-16 h-16 text-red-500" />
	            )}
	          </div>
	          <CardTitle className={`text-3xl font-bold ${isSuccess ? "text-green-600" : "text-red-600"}`}>
	            {isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"}
	          </CardTitle>
	          <p className="text-muted-foreground text-sm">{friendlyMessage}</p>
	        </CardHeader>
	
	        <CardContent className="space-y-6 pb-8">
	          <div className="grid grid-cols-2 gap-4 border-y py-4">
	            <div className="space-y-1">
	              <p className="text-xs uppercase tracking-wider text-muted-foreground">Số tiền</p>
	              <p className={`text-2xl font-bold ${isSuccess ? "text-green-600" : "text-red-600"}`}>
	                {formatCurrency(paymentData.amount)}
	              </p>
	            </div>
	            <div className="space-y-1">
	              <p className="text-xs uppercase tracking-wider text-muted-foreground">Trạng thái</p>
	              <p className={`text-2xl font-bold ${isSuccess ? "text-green-600" : "text-red-600"}`}>
	                {isSuccess ? "Hoàn tất" : "Thất bại"}
	              </p>
	            </div>
	          </div>
	
	          <Card className="shadow-none border">
	            <CardHeader className="p-4 border-b">
	              <CardTitle className="text-base">Chi tiết giao dịch</CardTitle>
	            </CardHeader>
	            <CardContent className="p-4 space-y-2 text-sm">
	              <DetailRow label="Mã giao dịch" value={paymentData.transactionId} valueClass="font-mono text-primary" />
	              <DetailRow label="Thời gian" value={formatDateTime(paymentData.timestamp)} />
	              {paymentData.currentPlan && <DetailRow label="Gói hiện tại" value={paymentData.currentPlan.toUpperCase()} />}
	              {!isSuccess && (
	                <DetailRow label="Lý do thất bại" value={friendlyFailure || "Không rõ lý do"} valueClass="text-red-500" />
	              )}
	            </CardContent>
	          </Card>
	
	          <div className="space-y-3">
	            <Button onClick={onBackToDashboard} className="w-full">
	              <ArrowLeft className="w-4 h-4 mr-2" />
	              Quay lại Dashboard
	            </Button>
	
	            {isSuccess && (
	              <div className="grid grid-cols-2 gap-3">
	                <Button onClick={onDownloadReceipt} variant="outline" className="py-2 text-sm">
	                  <Download className="w-4 h-4 mr-2" />
	                  Tải PDF
	                </Button>
	
	                <Button onClick={onShareReceipt} variant="outline" className="py-2 text-sm">
	                  <Share2 className="w-4 h-4 mr-2" />
	                  Chia sẻ
	                </Button>
	              </div>
	            )}
	
	            {!isSuccess && (
	              <Button onClick={onBackToDashboard} variant="outline" className="w-full">
	                Thử lại sau
	              </Button>
	            )}
	          </div>
	
	          <div className="text-center text-sm text-muted-foreground">
	            <p>
	              <span className="font-semibold text-foreground">Cần hỗ trợ?</span> Hotline <span className="font-mono">1900-1234</span> - Email{" "}
	              <span className="font-mono">support@xdynamic.com</span>
	            </p>
	          </div>
	        </CardContent>
	      </Card>
	    </div>
	  );
};

export default PaymentConfirmationScreen;

const DetailRow = ({
	  label,
	  value,
	  valueClass,
	}: {
	  label: string;
	  value: string;
	  valueClass?: string;
	}) => (
	  <div className="flex items-center justify-between">
	    <span className="text-muted-foreground">{label}</span>
	    <span className={`font-medium ${valueClass || "text-foreground"}`}>{value}</span>
	  </div>
	);

const mapFailureReasonText = (reason: NonNullable<PaymentResult["failureReason"]>) => {
  switch (reason) {
    case "insufficient_balance":
      return "Khong du so du de thanh toan";
    case "network_error":
      return "Khong ket noi duoc may chu";
    default:
      return "Thanh toan that bai";
  }
};
