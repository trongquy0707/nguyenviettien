"use client";
import React, { useState, useEffect } from "react";
import CommonModal from "@/src/components/FormControlls/ModalCommon";
import DateCommon from "@/src/components/FormControlls/DateCommon";
import CommonComboBox from "@/src/components/FormControlls/ComboBoxCommon";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import { it } from "node:test";
import Cookies from "js-cookie";

interface FormState {
  id: string;
  ngayDong: Date | null;
  userId: string;
}

const initialForm: FormState = {
  id: "",
  ngayDong: null,
  userId: "",
};

interface FormBHNVProps {
  open: boolean;
  action: "add" | "edit";
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const FormBHNV: React.FC<FormBHNVProps> = ({
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
        ngayDong: item.ngayDong ? new Date(item.ngayDong) : null,
        userId: item.userID ? String(item.userID) : "",
      });
    } else {
      setForm(initialForm);
    }
  }, [action, item, open]);

  const handleSubmit = async () => {
    try {
      const payload = {
        id: form.id || undefined,
        ngayDong: form.ngayDong || null,
        userId: form.userId,
      };
      let res;
      if (action === "edit") {
        res = await apiService.post(
          `/BaoHiemNhanVien/UpdateBaoHiemNhanVien`,
          payload
        );
      } else {
        const { id, ...createPayload } = payload;
        res = await apiService.post(
          `/BaoHiemNhanVien/CreateBaoHiemNhanVien`,
          createPayload
        );
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
    if (!form.userId || !form.ngayDong) {
      setShowError(true);
      return;
    }
    handleSubmit();
    onClose();
  };
  const handleSubmitNews = () => {
    if (!form.userId || !form.ngayDong) {
      setShowError(true);
      return;
    }
    handleSubmit();
    setForm(initialForm);
    setShowError(false);
  };

  return (
    <CommonModal
      open={open}
      title={
        action === "edit" ? "Sửa bảo hiểm nhân viên" : "Thêm bảo hiểm nhân viên"
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

      <DateCommon
        label="Ngày đóng"
        value={form.ngayDong}
        onChange={(date) => setForm({ ...form, ngayDong: date })}
        required
        showError={showError}
      />
    </CommonModal>
  );
};

export default FormBHNV;
