"use client";
import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";

interface Option {
  label: string;
  value: string;
}

interface CommonComboBoxProps {
  lable?: string;
  endpoint: string;              // API endpoint
  labelField: string;            // field hiển thị text (VD: "tenDayDu")
  valueField: string;            // field làm value (VD: "maXaPhuong")
  value?: string | null;         // giá trị đang chọn
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;            // 🔴 có bắt buộc không
  showError?: boolean;           // 🔴 bật/tắt hiển thị lỗi
  length: number;
}

const CommonComboBox: React.FC<CommonComboBoxProps> = ({
  endpoint,
  labelField,
  valueField,
  value,
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
    if (!endpoint) {
      setOptions([]);
      return;
    }
    try {
      setLoading(true);
      const response: any = await apiService.get(endpoint);
      let arr: any[] = [];

      // Xử lý dữ liệu trả về
      if (Array.isArray(response)) {
        arr = response;
      } else if (Array.isArray(response.data)) {
        arr = response.data;
      } else if (Array.isArray(response.data?.data)) {
        arr = response.data.data;
      } else if (response.data) {
        arr = [response.data]; // Xử lý trường hợp trả về object đơn
      } else {
        arr = [response]; // Xử lý trường hợp response là object
      }

      const mapped = arr.map((item) => ({
        label: item[labelField] ?? "Không có tên",
        value: String(item[valueField] ?? ""),
      }));

      setOptions(mapped);
    } catch (err: any) {
      console.error("Lỗi fetch combobox:", err);
      toast.error(`Không thể tải dữ liệu cho ${lable}`);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const isInvalid = required && showError  && !value;

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
      value={options.find((o) => o.value === value) || null}
      onChange={(opt: SingleValue<Option>) => onChange(opt?.value || "")}
      placeholder={loading ? "Đang tải..." : placeholder}
      isLoading={loading}
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
        Vui lòng chọn giá trị
      </span>
    )}
  </div>
);

};

export default CommonComboBox;
