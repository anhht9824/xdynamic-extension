import React from "react";
import { Button } from "../../components/ui";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.15),transparent_35%),radial-gradient(circle_at_90%_10%,rgba(34,197,94,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(239,68,68,0.12),transparent_30%)]" />
        <div className="relative p-8 space-y-6">
          <div className="flex items-start space-x-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                isSuccess ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
              } border border-white/10 shadow-inner`}
            >
              {isSuccess ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/10 text-slate-100">
                {isSuccess ? "Payment success" : "Payment failed"}
              </div>
              <h2 className="text-2xl font-bold leading-snug">
                {isSuccess ? "Thanh toan thanh cong" : "Thanh toan that bai"}
              </h2>
              <p className="text-slate-300">{friendlyMessage}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">So tien</p>
              <p className={`text-xl font-semibold ${isSuccess ? "text-emerald-300" : "text-rose-300"}`}>
                {formatCurrency(paymentData.amount)}
              </p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Trang thai</p>
              <p className="text-xl font-semibold">{isSuccess ? "Hoan tat" : "That bai"}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Chi tiet giao dich</h3>
              <span className="text-xs font-mono text-slate-400">{paymentData.transactionId}</span>
            </div>
            <div className="space-y-3 text-sm text-slate-200">
              <DetailRow label="Thoi gian" value={formatDateTime(paymentData.timestamp)} />
              {paymentData.currentPlan && <DetailRow label="Goi hien tai" value={paymentData.currentPlan.toUpperCase()} />}
              {!isSuccess && (
                <DetailRow label="Ly do that bai" value={friendlyFailure || "Khong ro ly do"} valueClass="text-rose-300" />
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={onBackToDashboard} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3">
              Quay lai Dashboard
            </Button>

            {isSuccess ? (
              <div className="grid grid-cols-2 gap-3">
                <Button onClick={onDownloadReceipt} variant="outline" className="py-2 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Tai PDF
                </Button>

                <Button onClick={onShareReceipt} variant="outline" className="py-2 text-sm">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                  Chia se
                </Button>
              </div>
            ) : (
              <Button onClick={onBackToDashboard} variant="outline" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800">
                Thu lai sau
              </Button>
            )}
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-white">Can ho tro?</span> Hotline <span className="font-mono">1900-1234</span> - Email{" "}
              <span className="font-mono">support@xdynamic.com</span>
            </p>
          </div>
        </div>
      </div>
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
    <span className="text-slate-400">{label}</span>
    <span className={`font-medium ${valueClass || "text-white"}`}>{value}</span>
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
