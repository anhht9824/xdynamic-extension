import React, { useState } from "react";
import { logger, safeCloseWindow } from "../utils";
import { useAuth } from "../hooks";
import { ReportErrorScreen, ReportSuccessScreen } from "./screens";

type ReportStep = "form" | "success";

interface ReportData {
  title: string;
  description: string;
  category: string;
  attachments: File[];
}

const ReportApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<ReportStep>("form");
  const [reportId, setReportId] = useState<string>("");
  const { user } = useAuth();

  const handleSubmitReport = async (reportData: ReportData) => {
    try {
      // Simulate API call
      const formData = new FormData();
      formData.append("title", reportData.title);
      formData.append("description", reportData.description);
      formData.append("category", reportData.category);
      formData.append("userId", user?.email || "anonymous");
      
      // Add attachments
      reportData.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });

      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock report ID
      const mockReportId = `RPT-${Date.now().toString().slice(-6)}`;
      setReportId(mockReportId);
      
      // Show success screen
      setCurrentStep("success");
      
      // Save to local storage for history
      const savedReports = JSON.parse(localStorage.getItem("xdynamic_reports") || "[]");
      savedReports.push({
        id: mockReportId,
        title: reportData.title,
        category: reportData.category,
        status: "submitted",
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem("xdynamic_reports", JSON.stringify(savedReports));
      
    } catch (error) {
      logger.error("Failed to submit report", error);
      // Handle error (could show error toast or stay on form with error message)
    }
  };

  const handleCancel = () => {
    // Close the report tab with safe fallback
    safeCloseWindow();
  };

  const handleClose = () => {
    // Close the report tab with safe fallback
    safeCloseWindow();
  };

  const handleNewReport = () => {
    // Reset to form for new report
    setCurrentStep("form");
    setReportId("");
  };

  switch (currentStep) {
    case "form":
      return (
        <ReportErrorScreen
          onSubmit={handleSubmitReport}
          onCancel={handleCancel}
        />
      );

    case "success":
      return (
        <ReportSuccessScreen
          onClose={handleClose}
          onNewReport={handleNewReport}
          reportId={reportId}
        />
      );

    default:
      return null;
  }
};

export default ReportApp;