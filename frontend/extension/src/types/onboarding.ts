export type OnboardingStepId =
  | "welcome"
  | "account"
  | "verification"
  | "security"
  | "permissions"
  | "summary";

export type OnboardingStepStatus = "pending" | "active" | "completed";

export interface OnboardingPreferences {
  protectionLevel: "strict" | "balanced" | "custom";
  notifications: boolean;
  insights: boolean;
}

export interface OnboardingProfile {
  email: string;
  fullName?: string;
  phone?: string;
}

export interface OnboardingStatePayload {
  currentStep: OnboardingStepId;
  profile?: OnboardingProfile;
  verification?: {
    verified: boolean;
  };
  preferences?: OnboardingPreferences;
  metadata?: Record<string, unknown>;
}
