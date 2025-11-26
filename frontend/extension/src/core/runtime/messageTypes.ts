import type { DetectionRequest, DetectionResult } from "../../services/detection.service";
import type { ExtensionState } from "../../types";

export type RuntimeMessage =
  | { type: "DETECTION_RESULT"; data: DetectionResult }
  | { type: "SCAN_PAGE" }
  | { type: "TOGGLE_EXTENSION"; enabled: boolean }
  | { type: "UPDATE_CONFIG"; config: Partial<ScanConfig> }
  | { type: "UPDATE_STATE"; payload: ExtensionState }
  | { type: "STATE_UPDATED"; payload: ExtensionState }
  | { type: "ANALYZE_IMAGE"; url: string; context?: DetectionRequest["context"] }
  | {
      type: "STATS_UPDATED";
      data: { total: number; today: number; weekly: number };
    };

export interface RuntimeResponse {
  success: boolean;
  error?: string;
}

export interface ScanConfig {
  enabled: boolean;
  blockThreshold: number;
  warnThreshold: number;
  maxImagesPerScan: number;
  scanDelay: number;
}
