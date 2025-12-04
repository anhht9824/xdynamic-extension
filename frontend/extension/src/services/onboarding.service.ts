import { apiService } from "./api.service";
import { API_ENDPOINTS } from "../core/config/api";
import {
  OnboardingStatePayload,
  OnboardingStepId,
} from "../types/onboarding";

export class OnboardingService {
  async getState(): Promise<OnboardingStatePayload | null> {
    try {
      const response = await apiService.get<OnboardingStatePayload>(
        API_ENDPOINTS.ONBOARDING.STATE
      );

      if (response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      if (error instanceof Error && (error as any).statusCode === 404) {
        return null;
      }
      console.error("Failed to fetch onboarding state", error);
    }

    return null;
  }

  async saveState(
    state: Partial<OnboardingStatePayload>
  ): Promise<OnboardingStatePayload | null> {
    try {
      const response = await apiService.post<OnboardingStatePayload>(
        API_ENDPOINTS.ONBOARDING.STATE,
        state
      );

      if (response.success && response.data) {
        return response.data;
      }
    } catch (error) {
      if (error instanceof Error && (error as any).statusCode === 404) {
        return null;
      }
      console.error("Failed to persist onboarding state", error);
    }

    return null;
  }

  async markStep(
    step: OnboardingStepId,
    status: "pending" | "completed" | "skipped" = "completed",
    data?: unknown
  ): Promise<void> {
    try {
      await apiService.post(API_ENDPOINTS.ONBOARDING.PROGRESS, {
        step,
        status,
        data,
      });
    } catch (error) {
      if (error instanceof Error && (error as any).statusCode === 404) {
        return;
      }
      console.error("Failed to update onboarding progress", error);
    }
  }

  async complete(state?: OnboardingStatePayload): Promise<void> {
    try {
      await apiService.post(API_ENDPOINTS.ONBOARDING.COMPLETE, state);
    } catch (error) {
      if (error instanceof Error && (error as any).statusCode === 404) {
        return;
      }
      console.error("Failed to complete onboarding", error);
    }
  }
}

export const onboardingService = new OnboardingService();
