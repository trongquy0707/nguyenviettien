import React from "react";

interface TextInputCommonProps {
  lable?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  editable?: boolean;
  length?: number;
  secureTextEntry?: boolean;
  type?: "text" | "password";
  required?: boolean;
  showError?: boolean;
   width?: string;
}

const TextInputCommon: React.FC<TextInputCommonProps> = ({
  lable = "",
  value = "",
  onChangeText,
  placeholder = "Nhập dữ liệu...",
  editable = true,
  length,
  secureTextEntry = false,
  type,
  required = false,
  showError = false,
}) => {
  const isInvalid = required && showError && !(value || "").trim();
  const inputType = type || (secureTextEntry ? "password" : "text");

  return (
    <div className="form-group">
      <label className="form-label">
        {lable}
        {required && lable && <span className="text-danger"> *</span>}
      </label>
      <input
        type={inputType}
        className={`form-control ${isInvalid ? "is-invalid" : ""}`}
        value={value ?? ""}
        onChange={(e) => onChangeText && onChangeText(e.target.value)}
        placeholder={placeholder}
        disabled={!editable}
        maxLength={length}
      />
      {isInvalid && (
        <div className="invalid-feedback">
          Vui lòng {placeholder.toLowerCase()}
        </div>
      )}
    </div>
  );
};

export default TextInputCommon;

const TextAreaCommon: React.FC<TextInputCommonProps> = ({
  lable = "",
  value = "",
  onChangeText,
  placeholder = "Nhập dữ liệu...",
  editable = true,
  length,
  required = false,
  showError = false,
  width = "100%", 
}) => {
  const isInvalidInputArea = required && showError && !value;
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block" }}>
        {lable}
        {required && lable && (
          <span style={{ color: "red", fontSize: 12 }}> *</span> 
        )}
      </label>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChangeText && onChangeText(e.target.value)}
        placeholder={placeholder}
        disabled={!editable}
        maxLength={length}
        style={{
          width,
          height: 70,
          padding: "0 8px",
          borderRadius: 6,
          border: `1px solid ${isInvalidInputArea ? "red" : "#ccccccff"}`,
          resize: "vertical",
        }}
      />
      {isInvalidInputArea && (
        <span style={{ display: "block", color: "red", fontSize: 12 }}>
          Vui lòng {placeholder.toLowerCase()}
        </span>
      )}
    </div>
  );
};



const RequiredLabelCommon = ({ label }: { label: string }) => (
  <div className="font-bold mt-2">
    {label}
    <span className="text-red-500" style={{}}>
      {" "}
      (*)
    </span>
  </div>
);
export { TextAreaCommon };
export { TextInputCommon };
export { RequiredLabelCommon };
