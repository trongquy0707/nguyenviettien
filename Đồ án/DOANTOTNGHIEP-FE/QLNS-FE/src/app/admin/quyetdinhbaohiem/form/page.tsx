"use client";
import React, { useState, useEffect } from "react";
import CommonModal from "@/src/components/FormControlls/ModalCommon";
import TextInputCommon, {
  TextAreaCommon,
} from "@/src/components/FormControlls/TextInputCommon";
import DateCommon from "@/src/components/FormControlls/DateCommon";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import { it } from "node:test";

interface FormState {
  id: string;
  ten: string;
  soQuyetDinh: string;
  ngayHieuLuc: Date | null;
  ngayHetHan: Date | null;
  ngayQuyetDinh: Date | null;
  bHYT_NV: string;
  bHYT_DN: string;
  bHXH_NV: string;
  bHXH_DN: string;
  bHTN_NV: string;
  bHTN_DN: string;
}

const initialForm: FormState = {
  id: "",
  ten: "",
  soQuyetDinh: "",
  ngayHieuLuc: null,
  ngayHetHan: null,
  ngayQuyetDinh: null,
  bHYT_NV: "",
  bHYT_DN: "",
  bHXH_NV: "",
  bHXH_DN: "",
  bHTN_NV: "",
  bHTN_DN: "",
};

interface FormQDBHProps {
  open: boolean;
  action: "add" | "edit";
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const FormQDBH: React.FC<FormQDBHProps> = ({
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
        soQuyetDinh: item.soQuyetDinh,
        ngayHieuLuc: item.ngayHieuLuc ? new Date(item.ngayHieuLuc) : null,
        ngayHetHan: item.ngayHetHan ? new Date(item.ngayHetHan) : null,
        ngayQuyetDinh: item.ngayQuyetDinh ? new Date(item.ngayQuyetDinh) : null,
        bHYT_NV: item.bhyT_NV,
        bHYT_DN: item.bhyT_DN,
        bHXH_NV: item.bhxH_NV,
        bHXH_DN: item.bhxH_DN,
        bHTN_NV: item.bhtN_NV,
        bHTN_DN: item.bhtN_DN,
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
        soQuyetDinh: form.soQuyetDinh,
        ngayHieuLuc: form.ngayHieuLuc || null,
        ngayHetHan: form.ngayHetHan || null,
        ngayQuyetDinh: form.ngayQuyetDinh || null,
        BHYT_NV: form.bHYT_NV ? parseFloat(form.bHYT_NV) : null,
        BHYT_DN: form.bHYT_DN ? parseFloat(form.bHYT_DN) : null,
        BHXH_NV: form.bHXH_NV ? parseFloat(form.bHXH_NV) : null,
        BHXH_DN: form.bHXH_DN ? parseFloat(form.bHXH_DN) : null,
        BHTN_NV: form.bHTN_NV ? parseFloat(form.bHTN_NV) : null,
        BHTN_DN: form.bHTN_DN ? parseFloat(form.bHTN_DN) : null,
      };
      let res;
      if (action === "edit") {
        res = await apiService.post(`/QuyetDinhBH/UpdateQDBH`, payload);
      } else {
        const { id, ...createPayload } = payload;
        res = await apiService.post(
          `/QuyetDinhBH/CreateQDBH`,
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
    if (!form.ten || !form.soQuyetDinh || !form.bHTN_DN || !form.bHTN_NV || !form.bHYT_DN || !form.bHYT_NV || !form.bHXH_DN || !form.bHXH_NV) {
      setShowError(true);
      return;
    }
    handleSubmit();
    onClose();
  };
  const handleSubmitNews = () => {
    if (!form.ten || !form.soQuyetDinh || !form.bHTN_DN || !form.bHTN_NV || !form.bHYT_DN || !form.bHYT_NV || !form.bHXH_DN || !form.bHXH_NV) {
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
      title={action === "edit" ? "Sửa quyết định bảo hiểm" : "Thêm quyết định bảo hiểm"}
      onClose={onClose}
      onSubmitClose={handleSubmitClose}
      onSubmitNew={handleSubmitNews}
    >
      <TextInputCommon
        length={100}
        lable="Tên quyết định bảo hiểm"
        value={form.ten}
        onChangeText={(text) => setForm({ ...form, ten: text })}
        required
        placeholder="Nhập tên quyết định"
        showError={showError}
      />

       <TextInputCommon
        length={100}
        lable="Số quyết định bảo hiểm"
        value={form.soQuyetDinh}
        onChangeText={(text) => setForm({ ...form, soQuyetDinh: text })}
        required
        placeholder="Nhập số quyết định"
        showError={showError}
      />

       <TextInputCommon
        length={100}
        lable="BHYT Nhân viên (%)"
        value={form.bHYT_NV}
        onChangeText={(text) => setForm({ ...form, bHYT_NV: text })}
        required
        placeholder="Nhập BHYT Nhân viên"
        showError={showError}
      />

       <TextInputCommon
        length={100}
        lable="BHYT Doanh nghiệp (%)"
        value={form.bHYT_DN}
        onChangeText={(text) => setForm({ ...form, bHYT_DN: text })}
        required
        placeholder="Nhập BHYT Doanh nghiệp"
        showError={showError}
      />

       <TextInputCommon
        length={100}
        lable="BHXH Nhân viên (%)"
        value={form.bHXH_NV}
        onChangeText={(text) => setForm({ ...form, bHXH_NV: text })}
        required
        placeholder="Nhập BHXH Nhân viên"
        showError={showError}
      />

      <TextInputCommon
        length={100}
        lable="BHXH Doanh nghiệp (%)"
        value={form.bHXH_DN}
        onChangeText={(text) => setForm({ ...form, bHXH_DN: text })}
        required
        placeholder="Nhập BHXH Doanh nghiệp"
        showError={showError}
      />

        <TextInputCommon
        length={100}
        lable="BHTN Nhân viên (%)"
        value={form.bHTN_NV}
        onChangeText={(text) => setForm({ ...form, bHTN_NV: text })}
        required
        placeholder="Nhập BHTN Nhân viên"
        showError={showError}
      />

         <TextInputCommon
        length={100}
        lable="BHTN Doanh nghiệp (%)"
        value={form.bHTN_DN}
        onChangeText={(text) => setForm({ ...form, bHTN_DN: text })}
        required
        placeholder="Nhập BHTN Doanh nghiệp"
        showError={showError}
      />


      <DateCommon
        label="Ngày quyết định"
        value={form.ngayQuyetDinh}
        onChange={(date) => setForm({ ...form, ngayQuyetDinh: date })}
      />

        <DateCommon
        label="Ngày hiệu lực"
        value={form.ngayHieuLuc}
        onChange={(date) => setForm({ ...form, ngayHieuLuc: date })}
      />

        <DateCommon
        label="Ngày hết hạn"
        value={form.ngayHetHan}
        onChange={(date) => setForm({ ...form, ngayHetHan: date })}
      />
    </CommonModal>
  );
};

export default FormQDBH;
