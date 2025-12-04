import { useCallback, useEffect, useMemo, useState } from "react";
import { readFromStorage, writeToStorage } from "../core/storage";
import { STORAGE_KEYS, logger } from "../utils";
import { useAuth } from "./useAuth";
import {
  OnboardingPreferences,
  OnboardingProfile,
  OnboardingStatePayload,
  OnboardingStepId,
  OnboardingStepStatus,
} from "../types/onboarding";
import { authService, onboardingService, userService } from "../services";
import type { User } from "../types/auth";

const ALLOW_ONBOARDING_FALLBACK =
  import.meta?.env?.VITE_ENABLE_ONBOARDING_FALLBACK !== "false";
const ALLOW_VERIFY_FALLBACK =
  import.meta?.env?.VITE_ENABLE_VERIFY_FALLBACK !== "false";

type ActionName =
  | "idle"
  | "hydrate"
  | "register"
  | "verify"
  | "preferences"
  | "resend"
  | "complete";

interface ActionState {
  name: ActionName;
  loading: boolean;
  error?: string;
}

const createInitialState = (
  firstStep: OnboardingStepId
): OnboardingStatePayload => ({
  currentStep: firstStep,
  profile: {
    email: "",
    fullName: "",
  },
  verification: {
    verified: false,
  },
  preferences: {
    protectionLevel: "balanced",
    notifications: true,
    insights: false,
  },
});

const normalizeError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "Đã có lỗi xảy ra, vui lòng thử lại.";
};

const isNotFoundError = (error: unknown): boolean =>
  error instanceof Error &&
  ("status" in error ? (error as any).status === 404 : /404/.test(error.message));

export const useOnboardingFlow = (steps: OnboardingStepId[]) => {
  const firstStep = steps[0];
  const [state, setState] = useState<OnboardingStatePayload>(
    createInitialState(firstStep)
  );
  const [isHydrating, setIsHydrating] = useState<boolean>(true);
  const [action, setAction] = useState<ActionState>({
    name: "idle",
    loading: false,
  });
  const { signIn, updateUser, completeOnboarding } = useAuth();

  const currentStepIndex = useMemo(
    () => steps.findIndex((step) => step === state.currentStep),
    [steps, state.currentStep]
  );

  const stepStatuses: { id: OnboardingStepId; status: OnboardingStepStatus }[] =
    useMemo(
      () =>
        steps.map((step, index) => {
          if (index < currentStepIndex) {
            return { id: step, status: "completed" as OnboardingStepStatus };
          }
          if (index === currentStepIndex) {
            return { id: step, status: "active" as OnboardingStepStatus };
          }
          return { id: step, status: "pending" as OnboardingStepStatus };
        }),
      [steps, currentStepIndex]
    );

  const persistState = useCallback(
    async (nextState: OnboardingStatePayload) => {
      setState(nextState);
      await writeToStorage(STORAGE_KEYS.ONBOARDING_STATE, nextState);
      onboardingService.saveState(nextState).catch((error) => {
        logger.error("Failed to sync onboarding state", error);
      });
    },
    []
  );

  const hydrateState = useCallback(async () => {
    setIsHydrating(true);
    setAction({ name: "hydrate", loading: true });
    try {
      const [localState, remoteState] = await Promise.all([
        readFromStorage<OnboardingStatePayload>(
          STORAGE_KEYS.ONBOARDING_STATE,
          "local"
        ),
        onboardingService.getState(),
      ]);

      const baseState = localState ?? createInitialState(firstStep);
      const merged: OnboardingStatePayload = {
        ...baseState,
        ...(remoteState ?? {}),
        currentStep: remoteState?.currentStep ?? baseState.currentStep,
      };

      setState(merged);
    } catch (error) {
      logger.error("Failed to hydrate onboarding state", error);
      setState(createInitialState(firstStep));
    } finally {
      setIsHydrating(false);
      setAction({ name: "idle", loading: false });
    }
  }, [firstStep]);

  useEffect(() => {
    hydrateState();
  }, [hydrateState]);

  const goToStep = useCallback(
    async (step: OnboardingStepId) => {
      const nextState = { ...state, currentStep: step };
      await persistState(nextState);
    },
    [persistState, state]
  );

  const goToNext = useCallback(async () => {
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) {
      await goToStep(nextStep);
    }
  }, [steps, currentStepIndex, goToStep]);

  const goToPrevious = useCallback(async () => {
    const prevStep = steps[currentStepIndex - 1];
    if (prevStep) {
      await goToStep(prevStep);
    }
  }, [steps, currentStepIndex, goToStep]);

  const registerAccount = useCallback(
    async (payload: OnboardingProfile & { password: string }) => {
      setAction({ name: "register", loading: true });
    try {
      await authService.register({
        email: payload.email,
        password: payload.password,
      });

        const updatedProfile = await userService.updateProfile({
          email: payload.email,
          fullName: payload.fullName,
          phone: payload.phone,
        });

        const user: User = {
          id: updatedProfile.id,
          email: updatedProfile.email || payload.email,
          fullName: updatedProfile.fullName || payload.fullName || payload.email,
          phone: payload.phone,
          hasCompletedOnboarding: false,
        };

        signIn(user);
        updateUser(user);

        const nextState: OnboardingStatePayload = {
          ...state,
          profile: {
            email: payload.email,
            fullName: payload.fullName,
            phone: payload.phone,
          },
          currentStep: "verification",
        };

        await onboardingService.markStep("account", "completed", {
          email: payload.email,
        });
        await persistState(nextState);
        setAction({ name: "register", loading: false });
        return true;
      } catch (error) {
        const message = normalizeError(error);
        setAction({ name: "register", loading: false, error: message });
        return false;
      }
    },
    [persistState, signIn, state, updateUser]
  );

  const verifyCode = useCallback(
    async (code: string) => {
      if (!state.profile?.email) {
        setAction({
          name: "verify",
          loading: false,
          error: "Thiếu email để xác thực.",
        });
        return false;
      }

      setAction({ name: "verify", loading: true, error: undefined });
      try {
        await authService.verifyAccount({
          email: state.profile.email,
          code,
        });

        const nextState: OnboardingStatePayload = {
          ...state,
          verification: { verified: true },
          currentStep: "security",
        };

        await onboardingService.markStep("verification", "completed");
        await persistState(nextState);
        setAction({ name: "verify", loading: false });
        return true;
      } catch (error) {
        if (ALLOW_VERIFY_FALLBACK && isNotFoundError(error)) {
          const nextState: OnboardingStatePayload = {
            ...state,
            verification: { verified: true },
            currentStep: "security",
          };
          await persistState(nextState);
          setAction({ name: "verify", loading: false });
          return true;
        }
        const message = normalizeError(error);
        setAction({ name: "verify", loading: false, error: message });
        return false;
      }
    },
    [persistState, state]
  );

  const resendCode = useCallback(async () => {
    if (!state.profile?.email) {
      setAction({
        name: "resend",
        loading: false,
        error: "Thiếu email để gửi lại mã.",
      });
      return false;
    }

    setAction({ name: "resend", loading: true });
    try {
      await authService.requestVerificationCode(state.profile.email);
      setAction({ name: "resend", loading: false });
      return true;
    } catch (error) {
      if (ALLOW_VERIFY_FALLBACK && isNotFoundError(error)) {
        setAction({ name: "resend", loading: false });
        return true;
      }
      const message = normalizeError(error);
      setAction({ name: "resend", loading: false, error: message });
      return false;
    }
  }, [state.profile?.email]);

  const savePreferences = useCallback(
    async (preferences: OnboardingPreferences) => {
      setAction({ name: "preferences", loading: true });
      try {
        await userService.updateSettings({
          notifications: preferences.notifications,
          security: {
            realTimeProtection: preferences.protectionLevel !== "custom",
            autoUpdate: true,
            speedLimit: 0,
            customFilters: [],
          },
          privacy: {
            dataSharing: preferences.insights,
            analytics: preferences.insights,
            crashReports: true,
            personalizedAds: false,
          },
        });

        const nextState: OnboardingStatePayload = {
          ...state,
          preferences,
          currentStep: "permissions",
        };

        await onboardingService.markStep("security", "completed", preferences as unknown as Record<string, unknown>);
        await persistState(nextState);
        setAction({ name: "preferences", loading: false });
        return true;
      } catch (error) {
        if (ALLOW_ONBOARDING_FALLBACK && isNotFoundError(error)) {
          const nextState: OnboardingStatePayload = {
            ...state,
            preferences,
            currentStep: "permissions",
          };
          await persistState(nextState);
          setAction({ name: "preferences", loading: false });
          return true;
        }
        const message = normalizeError(error);
        setAction({ name: "preferences", loading: false, error: message });
        return false;
      }
    },
    [persistState, state]
  );

  const completeFlow = useCallback(async () => {
    setAction({ name: "complete", loading: true });
    try {
      const finalState: OnboardingStatePayload = {
        ...state,
        currentStep: state.currentStep,
        verification: { verified: true },
      };

      await onboardingService.markStep("permissions", "completed");
      await onboardingService.complete(finalState);
      await persistState(finalState);
      completeOnboarding();
      setAction({ name: "complete", loading: false });
      return true;
    } catch (error) {
      if (ALLOW_ONBOARDING_FALLBACK && isNotFoundError(error)) {
        const finalState: OnboardingStatePayload = {
          ...state,
          currentStep: state.currentStep,
          verification: { verified: true },
        };
        await persistState(finalState);
        completeOnboarding();
        setAction({ name: "complete", loading: false });
        return true;
      }
      const message = normalizeError(error);
      setAction({ name: "complete", loading: false, error: message });
      return false;
    }
  }, [completeOnboarding, persistState, state]);

  return {
    state,
    isHydrating,
    action,
    currentStepIndex,
    stepStatuses,
    goToStep,
    goToNext,
    goToPrevious,
    registerAccount,
    verifyCode,
    resendCode,
    savePreferences,
    completeFlow,
  };
};
