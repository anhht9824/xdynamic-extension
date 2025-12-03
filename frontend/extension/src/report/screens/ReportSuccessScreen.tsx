import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { CheckCircle, X, FileText, ArrowLeft } from "lucide-react";

interface ReportSuccessScreenProps {
  onClose: () => void;
  onNewReport: () => void;
  reportId?: string;
}

const ReportSuccessScreen: React.FC<ReportSuccessScreenProps> = ({ 
  onClose, 
  onNewReport, 
  reportId 
}) => {
	  return (
	    <div className="min-h-screen w-full flex flex-col bg-gray-50 p-4 sm:p-8">
	      <Card className="max-w-md w-full mx-auto shadow-lg text-center">
	        <CardHeader className="pt-8">
	          <div className="flex justify-center mb-4">
	            <CheckCircle className="w-16 h-16 text-green-500" />
	          </div>
	          <CardTitle className="text-2xl font-bold text-foreground">
	            Báo cáo đã được gửi thành công!
	          </CardTitle>
	          <p className="text-sm text-muted-foreground">
	            Cảm ơn bạn đã gửi báo cáo. Đội ngũ hỗ trợ của chúng tôi sẽ xem xét và phản hồi trong thời gian sớm nhất.
	          </p>
	        </CardHeader>
	
	        <CardContent className="space-y-6 pb-8">
	          {/* Report ID */}
	          {reportId && (
	            <div className="w-full bg-secondary/50 rounded-lg p-4">
	              <p className="text-sm text-muted-foreground mb-1">Mã báo cáo:</p>
	              <p className="text-xl font-mono font-semibold text-primary break-all">
	                {reportId}
	              </p>
	              <p className="text-xs text-muted-foreground mt-2">
	                Vui lòng lưu mã này để theo dõi tiến trình xử lý
	              </p>
	            </div>
	          )}
	
	          {/* Additional Info */}
	          <div className="w-full space-y-3 text-left">
	            <div className="flex items-start space-x-3">
	              <FileText className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
	              <p className="text-sm text-muted-foreground">
	                Bạn sẽ nhận được email xác nhận trong vài phút tới.
	              </p>
	            </div>
	            <div className="flex items-start space-x-3">
	              <FileText className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
	              <p className="text-sm text-muted-foreground">
	                Thời gian phản hồi thường là 24-48 giờ làm việc.
	              </p>
	            </div>
	            <div className="flex items-start space-x-3">
	              <FileText className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />
	              <p className="text-sm text-muted-foreground">
	                Bạn có thể kiểm tra trạng thái trong phần "Lịch sử báo cáo".
	              </p>
	            </div>
	          </div>
	
	          {/* Buttons */}
	          <div className="w-full space-y-3">
	            <Button
	              onClick={onClose}
	              className="w-full h-12 text-base"
	            >
	              <X className="w-4 h-4 mr-2" />
	              Đóng
	            </Button>
	
	            <Button
	              onClick={onNewReport}
	              variant="outline"
	              className="w-full h-12 text-base"
	            >
	              Gửi báo cáo khác
	            </Button>
	          </div>
	        </CardContent>
	      </Card>
	    </div>
	  );
};

export default ReportSuccessScreen;