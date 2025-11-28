import React from "react";
import { useExtensionContext } from "../../providers/ExtensionProvider";
import { useLanguageContext } from "../../providers/LanguageProvider";
import ContentTypeButton from "./ContentTypeButton";
import ImageIcon from "../../components/icons/ImageLogo";
import VideoIcon from "../../components/icons/CameraLogo";

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

  const contentTypeConfig = [
    {
      key: "image" as const,
      label: t("content.image", "Ảnh"),
      IconComponent: ImageIcon,
    },
    {
      key: "video" as const,
      label: t("content.video", "Video"),
      IconComponent: VideoIcon,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 w-full">
      {contentTypeConfig.map(({ key, label, IconComponent }) => (
        <ContentTypeButton
          key={key}
          label={label}
          IconComponent={IconComponent}
          isActive={contentTypes[key] && isEnabled}
          isEnabled={isEnabled}
          disabled={false}
          onClick={() => onContentTypeChange(key)}
        />
      ))}
    </div>
  );
};

export default ContentTypeGrid;
