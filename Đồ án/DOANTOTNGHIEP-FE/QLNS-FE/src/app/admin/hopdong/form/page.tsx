"use client";
import React, { useState, useEffect } from "react";
import CommonModal from "@/src/components/FormControlls/ModalCommon";
import TextInputCommon, {
  TextAreaCommon,
} from "@/src/components/FormControlls/TextInputCommon";
import DateCommon from "@/src/components/FormControlls/DateCommon";
import CommonComboBox from "@/src/components/FormControlls/ComboBoxCommon";
import RadioGroupCommon from "@/src/components/FormControlls/RadioCommon";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import { it } from "node:test";
import Cookies from "js-cookie";

interface FormState {
  id: string;
  userId: string;
  isLoaiHD: boolean;
  mucLuong: string;
  ngayBatDau: Date | null;
  ngayKetThuc: Date | null;
  ngayKy: Date | null;
}

const initialForm: FormState = {
  id: "",
  userId: "",
  isLoaiHD: true,
  mucLuong: "",
  ngayBatDau: null,
  ngayKetThuc: null,
  ngayKy: null,
};

interface FormHopDongProps {
  open: boolean;
  action: "add" | "edit";
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const FormHopDong: React.FC<FormHopDongProps> = ({
  open,
  action,
  item,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [showError, setShowError] = useState(false);
  const userStr = Cookies.get("user");
  const [idPhongBan, SetidPhongBan] = useState();
  useEffect(() => {
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        SetidPhongBan(user.idPhongBan);
      } catch {
        SetidPhongBan;
      }
    }
  }, []);

  // load dữ liệu khi edit
  useEffect(() => {
    if (action === "edit" && item) {
      setForm({
        id: item.id,
        userId: item.userID ? String(item.userID) : "",
        isLoaiHD: item.isLoaiHD,
        mucLuong: item.mucLuong,
        ngayBatDau: item.ngayBatDau ? new Date(item.ngayBatDau) : null,
        ngayKetThuc: item.ngayKetThuc ? new Date(item.ngayKetThuc) : null,
        ngayKy: item.ngayKy ? new Date(item.ngayKy) : null,
      });
    } else {
      setForm(initialForm);
    }
  }, [action, item, open]);

  const handleSubmit = async () => {
    try {
      const payload = {
        id: form.id || undefined,
        userID: form.userId,
        isLoaiHD: form.isLoaiHD,
        mucLuong: form.mucLuong ? parseFloat(form.mucLuong) : null,
        ngayBatDau: form.ngayBatDau || null,
        ngayKetThuc: form.ngayKetThuc || null,
        ngayKy: form.ngayKy || null,
      };
      let res;
      if (action === "edit") {
        res = await apiService.post(`/HopDong/UpdateHopDong`, payload);
      } else {
        const { id, ...createPayload } = payload;
        res = await apiService.post(`/HopDong/CreateHopDong`, createPayload);
      }
      if (!res.error) {
        toast.success(
          `${action === "edit" ? "Cập nhật" : "Thêm mới"} thành công`
        );
        onSuccess();
      } else {
        toast.error(`${action === "edit" ? "Cập nhật" : "Thêm mới"} thất bại`);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSubmitClose = () => {
    if (
      !form.userId ||
      !form.mucLuong ||
      !form.ngayBatDau ||
      !form.ngayKy ||
      !form.ngayKetThuc
    ) {
      setShowError(true);
      return;
    }
    handleSubmit();
    onClose();
  };
  const handleSubmitNews = () => {
    if (
      !form.userId ||
      !form.mucLuong ||
      !form.ngayBatDau ||
      !form.ngayKy ||
      !form.ngayKetThuc
    ) {
      setShowError(true);
      return;
    }
    handleSubmit();
    setForm(initialForm);
    setShowError(false);
  };

    // Tự động tính số ngày nghỉ
    useEffect(() => {
    if (form.ngayBatDau && form.ngayKetThuc) {
      const start = new Date(form.ngayBatDau);
      const end = new Date(form.ngayKetThuc);
      // Kiểm tra ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu
      if (end >= start) {
        let workDays = 0;
        let currentDate = new Date(start);
        // Lặp qua từng ngày từ start đến end
        while (currentDate <= end) {
          // getDay() trả về 0 (Chủ nhật), 1 (thứ Hai), ..., 6 (thứ Bảy)
          if (currentDate.getDay() !== 0) {
            workDays += 1;
          }
          // Tăng ngày lên 1
          currentDate.setDate(currentDate.getDate() + 1);
        }
        setForm((prev) => ({ ...prev, soNgayNghi: String(workDays) }));
      } else {
        setForm((prev) => ({ ...prev, soNgayNghi: "" }));
        toast.error("Ngày kết thúc phải sau hoặc bằng ngày bắt đầu");
      }
    } else {
      setForm((prev) => ({ ...prev, soNgayNghi: "" }));
    }
  }, [form.ngayBatDau, form.ngayKetThuc]);

  return (
    <CommonModal
      open={open}
      title={
        action === "edit" ? "Sửa hợp đồng nhân viên" : "Thêm hợp đồng nhân viên"
      }
      onClose={onClose}
      onSubmitClose={handleSubmitClose}
      onSubmitNew={handleSubmitNews}
    >
      <CommonComboBox
        lable="Nhân viên"
        endpoint={`/User/GetByIdPhongBan?idPhongban=${idPhongBan || ""}`}
        labelField="hoTen"
        valueField="id"
        value={form.userId}
        onChange={(val) => setForm({ ...form, userId: val })}
        placeholder="-- Chọn nhân viên --"
        required
        showError={showError}
        length={100}
      />

        <RadioGroupCommon
        label="Loại hợp đồng"
        options={[
          { label: "Thử việc", value: true },
          { label: "Chính thức", value: false },
        ]}
        value={form.isLoaiHD}
        onChange={(val) => setForm({ ...form, isLoaiHD: val as boolean })}
      />

      <TextInputCommon
        length={100}
        lable="Mức lương"
        value={form.mucLuong}
        onChangeText={(text) => setForm({ ...form, mucLuong: text })}
        placeholder="Nhập mức lương"
        required
        showError={showError}
      />

      <DateCommon
        label="Ngày bắt đầu"
        value={form.ngayBatDau}
        onChange={(date) => setForm({ ...form, ngayBatDau: date })}
        required
        showError={showError}
      />

      <DateCommon
        label="Ngày kết thúc"
        value={form.ngayKetThuc}
        onChange={(date) => setForm({ ...form, ngayKetThuc: date })}
        required
        showError={showError}
      />

      <DateCommon
        label="Ngày ký"
        value={form.ngayKy}
        onChange={(date) => setForm({ ...form, ngayKy: date })}
        required
        showError={showError}
      />
    </CommonModal>
  );
};

export default FormHopDong;
