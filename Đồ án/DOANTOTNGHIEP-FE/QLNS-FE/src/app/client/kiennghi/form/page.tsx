"use client";
import React, { useState, useEffect } from "react";
import CommonModal from "@/src/components/FormControlls/ModalCommon";
import TextInputCommon, {
  TextAreaCommon,
} from "@/src/components/FormControlls/TextInputCommon";
import DateCommon from "@/src/components/FormControlls/DateCommon";
import RadioGroupCommon from "@/src/components/FormControlls/RadioCommon";
import CommonComboBox from "@/src/components/FormControlls/ComboBoxCommon";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import { it } from "node:test";
import Cookies from "js-cookie";

interface FormState {
  id: string;
  userId: string;
  noiDung: string;
  ngayTao: Date | null;
}

const initialForm: FormState = {
  id: "",
  ngayTao: null,
  noiDung: "",
  userId: "",
};

interface FormKienNghiProps {
  open: boolean;
  action: "add" | "edit";
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const FormKienNghi: React.FC<FormKienNghiProps> = ({
  open,
  action,
  item,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [showError, setShowError] = useState(false);

  const userStr = Cookies.get("user");
  const [idUser, SetidUser] = useState();
  useEffect(() => {
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        SetidUser(user.id);
      } catch {
        SetidUser;
      }
    }
  }, []);

  // load dữ liệu khi edit
  useEffect(() => {
    if (action === "edit" && item) {
      setForm({
        id: item.id,
        noiDung: item.noiDung,
        ngayTao: item.ngayTao ? new Date(item.ngayTao) : null,
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
        noiDung: form.noiDung,
        userID: form.userId,
        ngayTao: form.ngayTao || null,
      };
      let res;
      if (action === "edit") {
        res = await apiService.post(`/KienNghi/UpdateKienNghi`, payload);
      } else {
        const { id, ...createPayload } = payload;
        res = await apiService.post(`/KienNghi/CreateKienNghi`, createPayload);
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
    if (!form.userId || !form.noiDung || !form.ngayTao) {
      setShowError(true);
      return;
    }
    handleSubmit();
    onClose();
  };
  const handleSubmitNews = () => {
    if (!form.userId || !form.noiDung || !form.ngayTao) {
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
      title={action === "edit" ? "Sửa kiến nghị" : "Thêm mới kiến nghị"}
      onClose={onClose}
      onSubmitClose={handleSubmitClose}
      onSubmitNew={handleSubmitNews}
    >
      <CommonComboBox
        lable="Người làm kiến nghị"
        endpoint={`/User/GetByIdUserDangNhap?id=${idUser}`}
        labelField="hoTen"
        valueField="id"
        value={form.userId}
        onChange={(val) => setForm({ ...form, userId: val })}
        placeholder="-- Chọn nhân viên --"
        required
        showError={showError}
        length={100}
      />

      <TextAreaCommon
        length={500}
        lable="Nội dung"
        value={form.noiDung}
        onChangeText={(text) => setForm({ ...form, noiDung: text })}
        placeholder="Nhập nội dung"
        required
        showError={showError}
      />

      <DateCommon
        label="Ngày tạo kiến nghị"
        value={form.ngayTao}
        onChange={(date) => setForm({ ...form, ngayTao: date })}
        required
        showError={showError}
      />
    </CommonModal>
  );
};

export default FormKienNghi;
