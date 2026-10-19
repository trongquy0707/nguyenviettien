"use client";
import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import apiService from "@/src/service/apiService";

interface Option {
  label: string;
  value: string;
}

interface CommonMultiComboBoxProps {
  lable?: string;
  endpoint: string;              // API endpoint
  labelField: string;            // field hiển thị text (VD: "tenDayDu")
  valueField: string;            // field làm value (VD: "maXaPhuong")
  value?: string[];              // Giá trị là mảng string cho multi-select
  onChange: (vals: string[]) => void; // Trả về mảng giá trị
  placeholder?: string;
  required?: boolean;            // Có bắt buộc không
  showError?: boolean;           // Bật/tắt hiển thị lỗi
  length: number;
}

const CommonMultiComboBox: React.FC<CommonMultiComboBoxProps> = ({
  endpoint,
  labelField,
  valueField,
  value = [],
  onChange,
  placeholder = "-- Chọn --",
  required = false,
  showError = true,
  length,
  lable = "",
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response: any = await apiService.get(endpoint);
      let arr: any[] = [];

      if (Array.isArray(response)) arr = response;
      else if (Array.isArray(response.data)) arr = response.data;
      else if (Array.isArray(response.data?.data)) arr = response.data.data;

      const mapped = arr.map((item) => ({
        label: item[labelField] ?? "No name",
        value: String(item[valueField]),
      }));

      setOptions(mapped);
    } catch (err) {
      console.error("Lỗi fetch combobox:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const isInvalid = required && showError && (!value || value.length === 0);

  return (
    <div style={{ width: `${length}%` }}>
      <label style={{ display: "block" }}>
        {lable}
        {required && lable && (
          <span style={{ color: "red", fontSize: 12 }}> *</span>
        )}
      </label>
      <Select
        options={options}
        value={options.filter((o) => value.includes(o.value))} // Lọc các option đã chọn
        onChange={(opts: MultiValue<Option>) =>
          onChange(opts.map((opt) => opt.value))
        }
        placeholder={loading ? "Đang tải..." : placeholder}
        isLoading={loading}
        isMulti // Bật multi-select
        isClearable
        isSearchable
        styles={{
          control: (base) => ({
            ...base,
            height: 40,
            minHeight: 40,
            borderRadius: 6,
            borderColor: isInvalid ? "red" : base.borderColor,
            "&:hover": {
              borderColor: isInvalid ? "red" : base.borderColor,
            },
          }),
        }}
      />

      {isInvalid && (
        <span style={{ color: "red", fontSize: 12 }}>
          Vui lòng chọn ít nhất một giá trị
        </span>
      )}
    </div>
  );
};

export default CommonMultiComboBox;