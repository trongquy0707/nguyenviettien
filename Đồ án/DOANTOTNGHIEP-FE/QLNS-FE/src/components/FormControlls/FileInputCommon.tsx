import React from "react";

interface FileInputCommonProps {
  lable?: string;
  value?: File | string | null; 
  onChangeFile?: (file: File) => void;
  placeholder?: string;
  required?: boolean;
  showError?: boolean;
}

const FileInputCommon: React.FC<FileInputCommonProps> = ({
  lable = "",
  value = null,
  onChangeFile,
  placeholder = "Chọn ảnh...",
  required = false,
  showError = false,
}) => {
  const isInvalid = required && showError && !value;

  // Tạo preview URL cho cả File và string
  const getPreviewUrl = () => {
    if (!value) return null;
    if (value instanceof File) return URL.createObjectURL(value);
    if (typeof value === "string" && value) return value.startsWith("http") ? value : `${window.location.origin}${value}`; // Thêm domain nếu cần
    return null;
  };

  const previewUrl = getPreviewUrl();

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block" }}>
        {lable}
        {required && lable && <span style={{ color: "red", fontSize: 12 }}> *</span>}
      </label>

      <input
        type="file"
        accept="image/*"
        placeholder={placeholder}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onChangeFile && onChangeFile(e.target.files[0]);
          }
        }}
        style={{
          width: "100%",
          height: 40,
          padding: "6px 8px",
          borderRadius: 6,
          border: `1px solid ${isInvalid ? "red" : "#ccccccff"}`,
        }}
      />

      {isInvalid && (
        <span style={{ display: "block", color: "red", fontSize: 12 }}>
          Vui lòng {placeholder.toLowerCase()}
        </span>
      )}

      {/* ✅ Preview ảnh nếu có */}
      {previewUrl && (
        <div style={{ marginTop: 8 }}>
          <img
            src={previewUrl}
            alt="preview"
            style={{ maxHeight: 100, borderRadius: 6 }}
            onError={(e) => {
              console.error("Failed to load image:", previewUrl);
              (e.target as HTMLImageElement).style.display = "none"; 
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FileInputCommon;
