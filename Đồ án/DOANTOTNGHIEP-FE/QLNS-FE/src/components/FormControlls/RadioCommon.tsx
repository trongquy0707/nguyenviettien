import React from "react";

interface Option {
  label: string;
  value: string | number | boolean;
}

interface RadioGroupCommonProps {
  label?: string;
  value?: string | number | boolean;
  options: Option[];
  onChange?: (value: string | number | boolean) => void;
  editable?: boolean;
  required?: boolean;
  showError?: boolean;
}

const RadioGroupCommon: React.FC<RadioGroupCommonProps> = ({
  label = "",
  value,
  options,
  onChange,
  editable = true,
  required = false,
  showError = false,
}) => {
  const isInvalid =
    required && showError && (value === undefined || value === null);

  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", marginBottom: 6 }}>
        {label}
        {required && label && (
          <span style={{ color: "red", fontSize: 12 }}> *</span>
        )}
      </label>

      <div style={{ display: "flex", gap: 12 }}>
        {options.map((opt) => (
          <label
            key={String(opt.value)}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <input
              type="radio"
              name={label} // để group cùng nhau
              checked={value === opt.value}
              onChange={() => onChange && onChange(opt.value)}
              disabled={!editable}
            />
            {opt.label}
          </label>
        ))}
      </div>

      {isInvalid && (
        <span style={{ display: "block", color: "red", fontSize: 12 }}>
          Vui lòng chọn {label.toLowerCase()}
        </span>
      )}
    </div>
  );
};

export default RadioGroupCommon;
