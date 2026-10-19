"use client";
import React, { useState, useEffect } from "react";
import CommonModal from "@/src/components/FormControlls/ModalCommon";
import TextInputCommon, {
  TextAreaCommon,
} from "@/src/components/FormControlls/TextInputCommon";
import DateCommon from "@/src/components/FormControlls/DateCommon";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import { heIL } from "@mui/material/locale";

interface FormState {
  id: string;
  ten: string;
  heSo: string;
  ngayQuyetDinh: Date | null;
  maHeSo: string;
}

const initialForm: FormState = {
  id: "",
  ten: "",
  heSo: "",
  ngayQuyetDinh: null,
  maHeSo: "",
};

interface FormHSLTProps {
  open: boolean;
  action: "add" | "edit";
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const FormHSLT: React.FC<FormHSLTProps> = ({
  open,
  action,
  item,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [showError, setShowError] = useState(false);

  // load dữ liệu khi edit
  useEffect(() => {
    if (action === "edit" && item) {
      setForm({
        id: item.id,
        ten: item.ten,
        heSo: item.heSo,
        ngayQuyetDinh: item.ngayQuyetDinh ? new Date(item.ngayQuyetDinh) : null,
        maHeSo: item.maHeSo,
      });
    } else {
      setForm(initialForm);
    }
  }, [action, item, open]);

  const handleSubmit = async () => {
    try {
      const payload = {
        id: form.id || undefined,
        ten: form.ten,
        heSo: form.heSo ? parseFloat(form.heSo) : null,
        ngayQuyetDinh: form.ngayQuyetDinh || null,
        maHeSo: form.maHeSo ? parseInt(form.maHeSo, 10) : null,
      };
      let res;
      if (action === "edit") {
        res = await apiService.post(`/HeSoLT/UpdateHSLT`, payload);
      } else {
        const { id, ...createPayload } = payload;
        res = await apiService.post(`/HeSoLT/CreateHSLT`, createPayload);
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
    if (!form.ten || !form.heSo || !form.maHeSo) {
      setShowError(true);
      return;
    }
    handleSubmit();
    onClose();
  };
  const handleSubmitNews = () => {
    if (!form.ten || !form.heSo || !form.maHeSo) {
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
      title={action === "edit" ? "Sửa hệ số làm thêm" : "Thêm hệ số làm thêm"}
      onClose={onClose}
      onSubmitClose={handleSubmitClose}
      onSubmitNew={handleSubmitNews}
    >
      {/* <TextInputCommon
        length={100}
        lable="Mã hệ số"
        value={form.maHeSo}
        onChangeText={(text) => setForm({ ...form, maHeSo: text })}
        required
        placeholder="Nhập mã hệ số"
        showError={showError}
      /> */}

      <TextInputCommon
        length={100}
        lable="Tên hệ số"
        value={form.ten}
        onChangeText={(text) => setForm({ ...form, ten: text })}
        required
        placeholder="Nhập tên hệ số"
        showError={showError}
      />

      <TextInputCommon
        length={100}
        lable="Hệ số"
        value={form.heSo}
        onChangeText={(text) => setForm({ ...form, heSo: text })}
        required
        placeholder="Nhập hệ số"
        showError={showError}
      />

      <DateCommon
        label="Ngày quyết định"
        value={form.ngayQuyetDinh}
        onChange={(date) => setForm({ ...form, ngayQuyetDinh: date })}
      />
    </CommonModal>
  );
};

export default FormHSLT;
