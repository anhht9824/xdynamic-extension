import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

interface VerificationScreenProps {
  email: string;
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => Promise<boolean>;
  onBack: () => void;
  isLoading?: boolean;
  errorMessage?: string;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({
  email,
  onVerify,
  onResend,
  onBack,
  isLoading,
  errorMessage,
}) => {
  const [code, setCode] = useState("");
  const [localError, setLocalError] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (code.trim().length !== 6) {
      setLocalError("Mã xác thực gồm 6 số.");
      return;
    }
    setLocalError("");
    await onVerify(code.trim());
  };

  const handleResend = async () => {
    setLocalError("");
    await onResend();
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-md">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-blue-700">Bước 3/5</p>
          <h3 className="text-lg font-bold text-gray-900">Xác thực email</h3>
        </div>
        <Button
          variant="ghost"
          className="text-sm text-gray-600 hover:text-gray-800"
          onClick={onBack}
          type="button"
        >
          ← Quay lại
        </Button>
      </div>

      <form className="space-y-6 p-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label>Email của bạn</Label>
          <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
            <span>{email || "Chưa có email"}</span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              Đã gửi mã
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="verificationCode">Mã xác thực 6 số</Label>
          <Input
            id="verificationCode"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="••••••"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="text-center text-lg tracking-[0.4em]"
          />
          <p className="text-sm text-gray-500">
            Kiểm tra hộp thư (hoặc spam) để lấy mã. Mã có hiệu lực trong 10 phút.
          </p>
          {(localError || errorMessage) && (
            <p className="text-sm text-red-600">
              {localError || errorMessage}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-800">
          <span>Không nhận được mã?</span>
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold hover:underline"
            disabled={isLoading}
          >
            Gửi lại
          </button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-11 sm:w-32"
            onClick={onBack}
          >
            Quay lại
          </Button>
          <Button
            type="submit"
            className="h-11 bg-blue-700 text-white hover:bg-blue-800 sm:w-40"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" className="text-white" />
                Đang xác thực...
              </span>
            ) : (
              "Xác thực"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VerificationScreen;
