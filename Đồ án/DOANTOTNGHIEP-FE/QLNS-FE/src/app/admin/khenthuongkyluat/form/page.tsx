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
  hinhThuc: boolean;
  soQuyetDinh: string;
  ngayQuyetDinh: Date | null;
  nguoiKy: string;
  lyDo: string;
  thuongPhat: string;
  ghiChu: string;
  userId: string;
}

const initialForm: FormState = {
  id: "",
  hinhThuc: true,
  soQuyetDinh: "",
  ngayQuyetDinh: null,
  nguoiKy: "",
  lyDo: "",
  thuongPhat: "",
  ghiChu: "",
  userId: "",
};

interface FormKTKLProps {
  open: boolean;
  action: "add" | "edit";
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const FormKTKL: React.FC<FormKTKLProps> = ({
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
        hinhThuc: item.hinhThuc,
        soQuyetDinh: item.soQuyetDinh,
        ngayQuyetDinh: item.ngayQuyetDinh ? new Date(item.ngayQuyetDinh) : null,
        nguoiKy: item.nguoiKy,
        lyDo: item.lyDo,
        thuongPhat: item.thuongPhat,
        ghiChu: item.ghiChu ?? "",
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
        hinhThuc: form.hinhThuc,
        soQuyetDinh: form.soQuyetDinh.trim(),
        ngayQuyetDinh: form.ngayQuyetDinh || null,
        nguoiKy: form.nguoiKy.trim(),
        lyDo: form.lyDo,
        thuongPhat: form.thuongPhat ? parseFloat(form.thuongPhat) : null,
        ghiChu: form.ghiChu,
        userID: form.userId,
      };
      let res;
      if (action === "edit") {
        res = await apiService.post(`/KhenThuongKyLuat/UpdateKTKL`, payload);
      } else {
        const { id, ...createPayload } = payload;
        res = await apiService.post(
          `/KhenThuongKyLuat/CreateKTKL`,
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
    if (!form.soQuyetDinh || !form.userId || !form.ngayQuyetDinh) {
      setShowError(true);
      return;
    }
    handleSubmit();
    onClose();
  };
  const handleSubmitNews = () => {
    if (!form.soQuyetDinh || !form.userId || !form.ngayQuyetDinh) {
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
        action === "edit"
          ? "Sửa quyết định khen thưởng/kỷ luật"
          : "Thêm quyết định khen thưởng/kỷ luật"
      }
      onClose={onClose}
      onSubmitClose={handleSubmitClose}
      onSubmitNew={handleSubmitNews}
    >
      <RadioGroupCommon
        label="Hình thức"
        options={[
          { label: "Khen thưởng", value: true },
          { label: "Kỷ luật", value: false },
        ]}
        value={form.hinhThuc}
        onChange={(val) => setForm({ ...form, hinhThuc: val as boolean })}
      />

      <TextInputCommon
        length={100}
        lable="Số quyết định"
        value={form.soQuyetDinh}
        onChangeText={(text) => setForm({ ...form, soQuyetDinh: text })}
        required
        placeholder="Nhập số quyết định"
        showError={showError}
      />

      <DateCommon
        label="Ngày quyết định"
        value={form.ngayQuyetDinh}
        onChange={(date) => setForm({ ...form, ngayQuyetDinh: date })}
        required
        showError={showError}
      />

      <CommonComboBox
        lable="Người nhận quyết định"
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

      <TextInputCommon
        length={100}
        lable="Người ký"
        value={form.nguoiKy}
        onChangeText={(text) => setForm({ ...form, nguoiKy: text })}
        required
        placeholder="Nhập người ký quyết định"
        showError={showError}
      />

      <TextInputCommon
        length={100}
        lable="Số tiền nhận thưởng/phạt"
        value={form.thuongPhat}
        onChangeText={(text) => setForm({ ...form, thuongPhat: text })}
        placeholder="Nhập số tiền nhận thưởng/phạt"
      />

      <TextAreaCommon
        length={100}
        lable="Lý do"
        value={form.lyDo}
        onChangeText={(text) => setForm({ ...form, lyDo: text })}
        placeholder="Nhập lý do"
      />

      <TextAreaCommon
        length={100}
        lable="Ghi chú"
        value={form.ghiChu}
        onChangeText={(text) => setForm({ ...form, ghiChu: text })}
        placeholder="Nhập ghi chú"
      />
    </CommonModal>
  );
};

export default FormKTKL;
