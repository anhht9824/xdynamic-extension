import React, { useState, useRef } from "react";
import { logger, FILE_LIMITS } from "../../utils";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { ArrowLeft, Upload, X, Loader2, FileText } from "lucide-react";

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
	    <div className="min-h-screen w-full flex flex-col bg-gray-50 p-4 sm:p-8">
	      <Card className="max-w-2xl w-full mx-auto shadow-lg">
	        <CardHeader className="border-b flex flex-row items-center justify-between p-4 sm:p-6">
	          <div className="flex items-center space-x-3">
	            <Button variant="ghost" size="icon" onClick={onCancel}>
	              <ArrowLeft className="h-5 w-5" />
	            </Button>
	            <CardTitle className="text-xl font-bold">Báo cáo lỗi</CardTitle>
	          </div>
	        </CardHeader>
	
	        <CardContent className="p-4 sm:p-6">
	          <div className="space-y-6">
	            {/* Category */}
	            <div className="space-y-2">
	              <Label htmlFor="category">Danh mục</Label>
	              <Select
	                value={formData.category}
	                onValueChange={(value) => setFormData({ ...formData, category: value })}
	              >
	                <SelectTrigger id="category" className={errors.category ? "border-red-500" : ""}>
	                  <SelectValue placeholder="Chọn danh mục lỗi" />
	                </SelectTrigger>
	                <SelectContent>
	                  {categories.map((category) => (
	                    <SelectItem key={category.value} value={category.value}>
	                      {category.label}
	                    </SelectItem>
	                  ))}
	                </SelectContent>
	              </Select>
	              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
	            </div>
	
	            {/* Title */}
	            <div className="space-y-2">
	              <Label htmlFor="title">Tiêu đề</Label>
	              <Input
	                id="title"
	                type="text"
	                placeholder="Nhập tiêu đề"
	                value={formData.title}
	                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
	                maxLength={100}
	                className={errors.title ? "border-red-500" : ""}
	              />
	              <div className="flex justify-between text-xs text-muted-foreground">
	                <span>{errors.title}</span>
	                <span>{formData.title.length}/100 ký tự</span>
	              </div>
	            </div>
	
	            {/* Description */}
	            <div className="space-y-2">
	              <Label htmlFor="description">Mô tả</Label>
	              <Textarea
	                id="description"
	                placeholder="Mô tả chi tiết về lỗi bạn gặp phải..."
	                value={formData.description}
	                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
	                rows={6}
	                className={errors.description ? "border-red-500" : ""}
	              />
	              <div className="flex justify-between text-xs text-muted-foreground">
	                <span>{errors.description}</span>
	                <span>{formData.description.length} ký tự (Tối thiểu 10)</span>
	              </div>
	            </div>
	
	            {/* File Upload */}
	            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
	              <div className="text-center">
	                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
	                <h3 className="text-base font-medium text-foreground mb-1">
	                  Tải lên tệp liên quan
	                </h3>
	                <p className="text-sm text-muted-foreground mb-4">
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
	                  <Upload className="h-4 w-4 mr-2" />
	                  Chọn tệp
	                </Button>
	
	                <p className="text-xs text-muted-foreground">
	                  Hỗ trợ: JPG, PNG, PDF, DOC, TXT (tối đa {FILE_LIMITS.MAX_SIZE_MB}MB mỗi tệp)
	                </p>
	              </div>
	
	              {/* Uploaded Files */}
	              {attachments.length > 0 && (
	                <div className="mt-6 space-y-3">
	                  <h4 className="text-sm font-medium text-foreground">Tệp đã tải lên:</h4>
	                  {attachments.map((file, index) => (
	                    <div key={index} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
	                      <div className="flex items-center space-x-3">
	                        <FileText className="w-5 h-5 text-primary" />
	                        <div>
	                          <p className="text-sm font-medium text-foreground truncate max-w-xs">
	                            {file.name}
	                          </p>
	                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
	                        </div>
	                      </div>
	                      <Button
	                        onClick={() => removeAttachment(index)}
	                        variant="ghost"
	                        size="icon"
	                        className="text-muted-foreground hover:text-destructive"
	                      >
	                        <X className="h-4 w-4" />
	                      </Button>
	                    </div>
	                  ))}
	                </div>
	              )}
	            </div>
	          </div>
	        </CardContent>
	
	        {/* Buttons */}
	        <div className="flex space-x-4 p-4 sm:p-6 border-t">
	          <Button
	            onClick={onCancel}
	            variant="outline"
	            className="flex-1 h-12 text-base"
	            disabled={isSubmitting}
	          >
	            Hủy
	          </Button>
	          <Button
	            onClick={handleSubmit}
	            className="flex-1 h-12 text-base"
	            disabled={isSubmitting}
	          >
	            {isSubmitting ? (
	              <>
	                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
	                Đang gửi...
	              </>
	            ) : (
	              "Nộp báo cáo"
	            )}
	          </Button>
	        </div>
	      </Card>
	    </div>
	  );
};

export default ReportErrorScreen;