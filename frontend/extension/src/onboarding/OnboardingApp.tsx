import React, { useState } from "react";
import { useAuth } from "../hooks";
import type { User } from "../types/auth";
import { safeCloseWindow, redirectToPage } from "../utils";
import {
  WelcomeScreen,
  AccountSetupScreen,
  VerificationScreen,
  SecurityConfirmationScreen,
  ExperienceTipsScreen,
} from "./screens";

type OnboardingStep = "welcome" | "account-setup" | "verification" | "security" | "tips";

const OnboardingApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [userData, setUserData] = useState<Partial<User>>({});
  const { signIn, completeOnboarding } = useAuth();

  const handleWelcomeStart = () => {
    setCurrentStep("account-setup");
  };

  const handleWelcomeSkip = () => {
    // Skip to main application
    completeOnboarding();
    safeCloseWindow();
  };

  const handleLogin = () => {
    // Redirect to login flow
    redirectToPage('LOGIN');
  };

  const handleAccountSetup = (data: Partial<User>) => {
    setUserData(data);
    setCurrentStep("verification");
  };

  const handleVerification = () => {
    // Create user account with the collected data
    if (userData.email && userData.fullName) {
      const user: User = {
        email: userData.email,
        fullName: userData.fullName,
        phone: userData.phone,
        gender: userData.gender,
        hasCompletedOnboarding: false,
      };
      signIn(user);
    }
    setCurrentStep("security");
  };

  const handleSecurity = () => {
    setCurrentStep("tips");
  };

  const handleTipsComplete = () => {
    completeOnboarding();
    // Redirect to dashboard after onboarding completion
    redirectToPage('DASHBOARD');
  };

  const handleBack = () => {
    const stepFlow: OnboardingStep[] = ["welcome", "account-setup", "verification", "security", "tips"];
    const currentIndex = stepFlow.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepFlow[currentIndex - 1]);
    }
  };

  switch (currentStep) {
    case "welcome":
      return (
        <WelcomeScreen
          onStart={handleWelcomeStart}
          onSkip={handleWelcomeSkip}
          onLogin={handleLogin}
        />
      );

    case "account-setup":
      return (
        <AccountSetupScreen
          onNext={handleAccountSetup}
          onBack={handleBack}
        />
      );

    case "verification":
      return (
        <VerificationScreen
          onNext={handleVerification}
          onBack={handleBack}
          email={userData.email || ""}
        />
      );

    case "security":
      return (
        <SecurityConfirmationScreen
          onNext={handleSecurity}
          onBack={handleBack}
        />
      );

    case "tips":
      return (
        <ExperienceTipsScreen
          onComplete={handleTipsComplete}
          onBack={handleBack}
        />
      );

    default:
      return null;
  }
};

export default OnboardingApp;