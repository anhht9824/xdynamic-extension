import React from "react";
import { useExtensionContext } from "../../providers/ExtensionProvider";
import { useLanguageContext } from "../../providers/LanguageProvider";
import { useAuth } from "../../hooks/useAuth";
import ContentTypeButton from "./ContentTypeButton";
import ImageIcon from "../../components/icons/ImageLogo";
import VideoIcon from "../../components/icons/CameraLogo";
import { Tooltip } from "../../components/ui";

interface ContentTypeState {
  image: boolean;
  video: boolean;
}

interface ContentTypeGridProps {
  contentTypes: ContentTypeState;
  onContentTypeChange: (contentType: keyof ContentTypeState) => void;
}

const ContentTypeGrid: React.FC<ContentTypeGridProps> = ({
  contentTypes,
  onContentTypeChange,
}) => {
  const { isEnabled } = useExtensionContext();
  const { t } = useLanguageContext();
  const { isSignedIn } = useAuth();

  const contentTypeConfig = [
    {
      key: "image" as const,
      label: t("content.image", "Ảnh"),
      IconComponent: ImageIcon,
      disabled: false, // Image luôn available
    },
    {
      key: "video" as const,
      label: t("content.video", "Video"),
      IconComponent: VideoIcon,
      disabled: !isSignedIn, // Video chỉ available khi đã login
    },
  ];

  return (
    <div className="relative w-full h-full">
      {/* Image Button */}
      <div className="absolute w-[140px] h-[100px] top-0 left-0">
        <ContentTypeButton
          label={contentTypeConfig[0].label}
          IconComponent={contentTypeConfig[0].IconComponent}
          isActive={contentTypes[contentTypeConfig[0].key] && isEnabled}
          isEnabled={isEnabled}
          disabled={contentTypeConfig[0].disabled}
          onClick={() => onContentTypeChange(contentTypeConfig[0].key)}
        />
      </div>
      
      {/* Video Button - with tooltip when disabled */}
      <div className="absolute w-[140px] h-[100px] top-0 left-[143px]">
        {contentTypeConfig[1].disabled ? (
          <Tooltip 
            content="Bộ lọc Video chỉ dành cho người dùng đã đăng nhập"
            position="top"
          >
            <ContentTypeButton
              label={contentTypeConfig[1].label}
              IconComponent={contentTypeConfig[1].IconComponent}
              isActive={contentTypes[contentTypeConfig[1].key] && isEnabled}
              isEnabled={isEnabled}
              disabled={contentTypeConfig[1].disabled}
              onClick={() => onContentTypeChange(contentTypeConfig[1].key)}
            />
          </Tooltip>
        ) : (
          <ContentTypeButton
            label={contentTypeConfig[1].label}
            IconComponent={contentTypeConfig[1].IconComponent}
            isActive={contentTypes[contentTypeConfig[1].key] && isEnabled}
            isEnabled={isEnabled}
            disabled={contentTypeConfig[1].disabled}
            onClick={() => onContentTypeChange(contentTypeConfig[1].key)}
          />
        )}
      </div>
    </div>
  );
};

export default ContentTypeGrid;