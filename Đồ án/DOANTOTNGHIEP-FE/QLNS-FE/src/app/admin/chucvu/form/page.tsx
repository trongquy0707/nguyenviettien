"use client";
import React, { useState, useEffect } from "react";
import CommonModal from "@/src/components/FormControlls/ModalCommon";
import TextInputCommon, { TextAreaCommon } from "@/src/components/FormControlls/TextInputCommon";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import { withPermission } from "@/src/utils/withPermission";
//import { withPermission } from "@/src/utils/withPermission";

interface FormState {
  id: string;
  tenChucVu: string;
  moTa: string;
}

const initialForm: FormState = {
  id: "",
  tenChucVu: "",
  moTa: "",
};

interface FormChucVuProps {
  open: boolean;
  action: "add" | "edit";
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const FormChucVu: React.FC<FormChucVuProps> = ({ open, action, item, onClose, onSuccess }) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [showError, setShowError] = useState(false);

  // load dữ liệu khi edit
  useEffect(() => {
    if (action === "edit" && item) {
      setForm({
        id: item.id,
        tenChucVu: item.tenChucVu,
        moTa: item.moTa,
      });
    } else {
      setForm(initialForm);
    }
  }, [action, item, open]);

  const handleSubmit = async () => {
    try {
      let res;
      if (action === "edit") {
        res = await apiService.post(`/ChucVu/UpdateChucVu`, form);
      } else {
        const { id, ...payload } = form;
        res = await apiService.post(`/ChucVu/CreateChucVu`, payload);
      }
      if (!res.error) {
        toast.success(`${action === "edit" ? "Cập nhật" : "Thêm mới"} thành công`);
        onSuccess();
      } else {
        toast.error(`${action === "edit" ? "Cập nhật" : "Thêm mới"} thất bại`);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

const handleSubmitClose = () => {
    if (!form.tenChucVu) {
      setShowError(true);
      return;
    }
    handleSubmit();
    onClose();
  };
 const handleSubmitNews = () => {
    if (!form.tenChucVu) {
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
      title={action === "edit" ? "Sửa chức vụ" : "Thêm chức vụ"}
      onClose={onClose}
      onSubmitClose={handleSubmitClose}
      onSubmitNew={handleSubmitNews}
    >
      <TextInputCommon
        length={100}
        lable="Tên chức vụ"
        value={form.tenChucVu}
        onChangeText={(text) => setForm({ ...form, tenChucVu: text })}
        required
        placeholder="Nhập tên chức vụ"
        showError={showError}
      />

      <TextAreaCommon
        length={300}
        lable="Mô tả"
        value={form.moTa}
        onChangeText={(text) => setForm({ ...form, moTa: text })}
        placeholder="Nhập mô tả"
      />
    </CommonModal>
  );
};
export default FormChucVu;
// export default withPermission(FormChucVu, ["chucvu.GetChucVuById", "chucvu.CreateChucVu"]);
