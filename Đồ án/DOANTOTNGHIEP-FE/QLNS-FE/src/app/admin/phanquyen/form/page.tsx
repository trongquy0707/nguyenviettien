"use client";
import React, { useState, useEffect } from "react";
import CommonModal from "@/src/components/FormControlls/ModalCommon";
import TextInputCommon, {
  TextAreaCommon,
} from "@/src/components/FormControlls/TextInputCommon";
import CommonComboBox from "@/src/components/FormControlls/ComboBoxCommon";
import CommonMultiComboBox from "@/src/components/FormControlls/MultiComboBoxCommon";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";

interface FormState {
  id: string;
  chucVuId: string;
  permissionId: string[];
}

const initialForm: FormState = {
  id: "",
  chucVuId: "",
  permissionId: [],
};

interface FormPhanQuyenProps {
  open: boolean;
  action: "add" | "edit";
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const FormPhanQuyen: React.FC<FormPhanQuyenProps> = ({
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
        chucVuId: item.chucVuId,
        permissionId: Array.isArray(item.permissionIds) ? item.permissionIds : [],
      });
    } else {
      setForm(initialForm);
    }
  }, [action, item, open]);

  const handleSubmit = async () => {
    try {
      let res;
    const payload = form.permissionId.map((permissionId) => ({
      ChuVuID: form.chucVuId,
      PermissionID: permissionId,
    }));

    if (action === "edit") {
      res = await apiService.post(`/ChucVuPermission/UpdateChucVuPermission`, payload);
    } else {
      res = await apiService.post(`/ChucVuPermission/CreateChucVuPermission`, payload);
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
    if (!form.chucVuId || !form.permissionId) {
      setShowError(true);
      return;
    }
    handleSubmit();
    onClose();
  };
  const handleSubmitNews = () => {
    if (!form.chucVuId || !form.permissionId) {
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
      title={action === "edit" ? "Sửa phân quyền" : "Thêm phân quyền"}
      onClose={onClose}
      onSubmitClose={handleSubmitClose}
      onSubmitNew={handleSubmitNews}
      size="lg"
    >
      <CommonComboBox
        lable="Chức vụ"
        endpoint={`/ChucVu/GetAllChucVu`}
        labelField="tenChucVu"
        valueField="id"
        value={form.chucVuId}
        onChange={(val) => setForm({ ...form, chucVuId: val })}
        placeholder="-- Chọn chức vụ --"
        required
        showError={showError}
        length={100}
      />

       <CommonMultiComboBox
        lable="Quyền"
        endpoint={`/Permission/GetAllPermission`}
        labelField="tenQuyen"
        valueField="id"
        value={form.permissionId} 
        onChange={(vals) => setForm({ ...form, permissionId: vals })}
        placeholder="-- Chọn quyền --"
        required
        showError={showError}
        length={100}
      />

    </CommonModal>
  );
};

export default FormPhanQuyen;
