import React, { useMemo } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useOnboardingFlow } from "../hooks";
import type {
  OnboardingStepId,
  OnboardingStepStatus,
} from "../types/onboarding";
import { safeCloseWindow, redirectToPage } from "../utils";
import {
  WelcomeScreen,
  AccountSetupScreen,
  VerificationScreen,
  SecurityConfirmationScreen,
  ExperienceTipsScreen,
} from "./screens";

const STEP_CONFIG: {
  id: OnboardingStepId;
  title: string;
  description: string;
}[] = [
  {
    id: "welcome",
    title: "Chào mừng",
    description: "Bắt đầu bảo vệ an toàn cho bạn và gia đình.",
  },
  {
    id: "account",
    title: "Tạo tài khoản",
    description: "Thiết lập thông tin đăng nhập và hồ sơ cơ bản.",
  },
  {
    id: "verification",
    title: "Xác thực email",
    description: "Nhập mã xác thực để bảo vệ tài khoản.",
  },
  {
    id: "security",
    title: "Thiết lập bảo vệ",
    description: "Chọn mức lọc nội dung và nhận thông báo.",
  },
  {
    id: "permissions",
    title: "Hoàn tất & quyền",
    description: "Cấp quyền cần thiết và hoàn tất.",
  },
];

const STEP_ORDER = STEP_CONFIG.map((step) => step.id);

const StepProgressCard: React.FC<{
  progress: number;
  steps: typeof STEP_CONFIG;
  statusMap: Record<OnboardingStepId, OnboardingStepStatus>;
}> = ({ progress, steps, statusMap }) => {
  const getStatusClasses = (status: OnboardingStepStatus) => {
    switch (status) {
      case "completed":
        return "bg-blue-600 text-white border-blue-600";
      case "active":
        return "bg-cyan-500/10 text-cyan-700 border-cyan-500";
      default:
        return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="space-y-3">
        <CardTitle className="text-lg">Tiến trình onboarding</CardTitle>
        <CardDescription>
          Hoàn thành các bước để kích hoạt đầy đủ tính năng.
        </CardDescription>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Tiến độ</span>
            <span className="font-medium text-gray-900">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => {
          const status = statusMap[step.id];
          return (
            <div
              key={step.id}
              className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${getStatusClasses(
                  status
                )}`}
              >
                {status === "completed" ? "✓" : index + 1}
              </div>
              <div className="space-y-1">
                <div className="text-sm font-semibold text-gray-900">
                  {step.title}
                </div>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

const OnboardingApp: React.FC = () => {
  const {
    state,
    isHydrating,
    action,
    currentStepIndex,
    stepStatuses,
    goToNext,
    goToPrevious,
    registerAccount,
    verifyCode,
    resendCode,
    savePreferences,
    completeFlow,
  } = useOnboardingFlow(STEP_ORDER);

  const activeStep =
    STEP_CONFIG.find((step) => step.id === state.currentStep) ??
    STEP_CONFIG[0];

  const statusMap = useMemo(
    () =>
      stepStatuses.reduce(
        (acc, step) => ({ ...acc, [step.id]: step.status }),
        {} as Record<OnboardingStepId, OnboardingStepStatus>
      ),
    [stepStatuses]
  );

  const progress = useMemo(() => {
    if (currentStepIndex < 0) return 0;
    return Math.round(((currentStepIndex + 1) / STEP_ORDER.length) * 100);
  }, [currentStepIndex]);

  const handleSkip = async () => {
    await completeFlow();
    redirectToPage("DASHBOARD");
    safeCloseWindow();
  };

  const handleLogin = () => {
    redirectToPage("LOGIN");
  };

  const renderStepContent = () => {
    if (isHydrating) {
      return (
        <Card className="shadow-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl">Đang tải onboarding</CardTitle>
            <CardDescription>
              Chuẩn bị giao diện mới, vui lòng chờ trong giây lát.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" className="text-blue-700" />
          </CardContent>
        </Card>
      );
    }

    switch (state.currentStep) {
      case "welcome":
        return (
          <WelcomeScreen
            onStart={goToNext}
            onSkip={handleSkip}
            onLogin={handleLogin}
          />
        );
      case "account":
        return (
          <AccountSetupScreen
            defaultValues={{
              email: state.profile?.email ?? "",
              fullName: state.profile?.fullName ?? "",
              phone: state.profile?.phone ?? "",
            }}
            onSubmit={registerAccount}
            onBack={goToPrevious}
            isLoading={action.name === "register" && action.loading}
            errorMessage={action.name === "register" ? action.error : undefined}
          />
        );
      case "verification":
        return (
          <VerificationScreen
            email={state.profile?.email ?? ""}
            onVerify={verifyCode}
            onResend={resendCode}
            onBack={goToPrevious}
            isLoading={action.name === "verify" && action.loading}
            errorMessage={action.name === "verify" ? action.error : undefined}
          />
        );
      case "security":
        return (
          <SecurityConfirmationScreen
            preferences={
              state.preferences ?? {
                protectionLevel: "balanced",
                notifications: true,
                insights: false,
              }
            }
            onSubmit={savePreferences}
            onBack={goToPrevious}
            isLoading={action.name === "preferences" && action.loading}
            errorMessage={
              action.name === "preferences" ? action.error : undefined
            }
          />
        );
      case "permissions":
        return (
          <ExperienceTipsScreen
            onComplete={async () => {
              const success = await completeFlow();
              if (success) {
                redirectToPage("DASHBOARD");
                safeCloseWindow();
              }
            }}
            onBack={goToPrevious}
            isLoading={action.name === "complete" && action.loading}
            errorMessage={action.name === "complete" ? action.error : undefined}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-700">
              Onboarding XDynamic
            </p>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeStep.title}
            </h1>
            <p className="text-sm text-gray-600">{activeStep.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Bước {currentStepIndex + 1} / {STEP_ORDER.length}
            </span>
            <Button variant="ghost" className="text-sm" onClick={handleSkip}>
              Bỏ qua
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
          <div>{renderStepContent()}</div>
          <div className="space-y-4">
            <StepProgressCard
              progress={progress}
              steps={STEP_CONFIG}
              statusMap={statusMap}
            />
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">
                  Cần hỗ trợ nhanh?
                </CardTitle>
                <CardDescription>
                  Đội ngũ hỗ trợ có thể giúp bạn hoàn tất thiết lập.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                  Ưu tiên: bảo vệ thời gian thực, cảnh báo tức thời, và tùy chỉnh
                  mức lọc theo nhu cầu.
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => redirectToPage("DASHBOARD")}
                >
                  Xem hướng dẫn nhanh
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingApp;
