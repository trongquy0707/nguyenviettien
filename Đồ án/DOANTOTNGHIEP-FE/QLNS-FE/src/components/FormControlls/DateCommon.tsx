import React from "react";

interface DateCommonProps {
  label?: string;
  value?: Date | null; 
  onChange?: (date: Date | null) => void;
  editable?: boolean;
  required?: boolean;
  showError?: boolean;
}

const formatDate = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DateCommon: React.FC<DateCommonProps> = ({
  label = "",
  value = null,
  onChange,
  editable = true,
  required = false,
  showError = false,
}) => {
  const isInvalid = required && showError && !value;

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block" }}>
        {label}
        {required && label && (
          <span style={{ color: "red", fontSize: 12 }}> *</span>
        )}
      </label>
      <input
        type="date"
        value={formatDate(value)} 
        onChange={(e) =>
          onChange && onChange(e.target.value ? new Date(e.target.value) : null)
        }
        disabled={!editable}
        style={{
          width: 200,
          height: 40,
          padding: "0 8px",
          borderRadius: 6,
          border: `1px solid ${isInvalid ? "red" : "#ccccccff"}`,
        }}
      />
      {isInvalid && (
        <span style={{ display: "block", color: "red", fontSize: 12 }}>
          Vui lòng chọn {label.toLowerCase()}
        </span>
      )}
    </div>
  );
};

export default DateCommon;
