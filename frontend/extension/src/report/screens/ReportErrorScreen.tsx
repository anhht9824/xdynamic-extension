import React, { useState, useRef } from "react";
import { logger, FILE_LIMITS } from "../../utils";
import { Button, FormInput } from "../../components/ui";

interface ReportErrorScreenProps {
  onSubmit: (reportData: ReportData) => void;
  onCancel: () => void;
}

interface ReportData {
  title: string;
  description: string;
  category: string;
  attachments: File[];
}

const ReportErrorScreen: React.FC<ReportErrorScreenProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { value: "connection", label: "Kết nối" },
    { value: "speed", label: "Tốc độ" },
    { value: "filtering", label: "Bộ lọc" },
    { value: "interface", label: "Giao diện" },
    { value: "other", label: "Khác" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề là bắt buộc";
    } else if (formData.title.length > 100) {
      newErrors.title = "Tiêu đề không được vượt quá 100 ký tự";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả là bắt buộc";
    } else if (formData.description.length < 10) {
      newErrors.description = "Mô tả phải có ít nhất 10 ký tự";
    }

    if (!formData.category) {
      newErrors.category = "Vui lòng chọn danh mục";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const reportData: ReportData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        attachments,
      };
      
      await onSubmit(reportData);
    } catch (error) {
      logger.error("Failed to submit report", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      // Limit file size using constant
      const maxSize = FILE_LIMITS.MAX_SIZE_MB * 1024 * 1024;
      return file.size <= maxSize;
    });

    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 text-lg transition-colors"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Báo cáo lỗi</h1>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8 max-w-2xl mx-auto w-full">
        {/* Form */}
        <div className="space-y-6 flex-1">
          {/* Category */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              Danh mục
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full p-4 border rounded-lg bg-gray-50 text-gray-900 transition-colors ${
                errors.category ? "border-red-500" : "border-gray-200"
              } focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            >
              <option value="">Chọn danh mục lỗi</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-2">{errors.category}</p>}
          </div>

          {/* Title */}
          <div>
            <FormInput
              type="text"
              label="Tiêu đề"
              placeholder="Nhập tiêu đề"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={errors.title}
              helperText={`${formData.title.length}/100 ký tự`}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-base font-medium text-gray-700 mb-3">
              Mô tả
            </label>
            <textarea
              placeholder="Mô tả chi tiết về lỗi bạn gặp phải..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className={`w-full p-4 border rounded-lg bg-gray-50 placeholder-gray-400 resize-none transition-colors ${
                errors.description ? "border-red-500" : "border-gray-200"
              } focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
            <p className="text-gray-500 text-sm mt-2">{formData.description.length} ký tự</p>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-base font-medium text-gray-900 mb-2">
                Tải lên tệp liên quan
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Kéo và thả hoặc nhấp để tải lên
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="mb-4"
              >
                Tải lên
              </Button>
              
              <p className="text-xs text-gray-500">
                Hỗ trợ: JPG, PNG, PDF, DOC, TXT (tối đa 10MB mỗi tệp)
              </p>
            </div>

            {/* Uploaded Files */}
            {attachments.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-medium text-gray-900">Tệp đã tải lên:</h4>
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-medium">
                          {file.name.split('.').pop()?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 mt-8">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 h-12 text-base"
            size="lg"
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white h-12 text-base"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang gửi..." : "Nộp báo cáo"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportErrorScreen;