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
  tenPhuCap: string;
  soTien: string;
  ngayQuyetDinh: Date | null;
  lyDo: string;
  userId: string;
}

const initialForm: FormState = {
  id: "",
  tenPhuCap: "",
  soTien: "",
  ngayQuyetDinh: null,
  lyDo: "",
  userId: "",
};

interface FormPhuCapProps {
  open: boolean;
  action: "add" | "edit";
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const FormPhuCap: React.FC<FormPhuCapProps> = ({
  open,
  action,
  item,
  onClose,
  onSuccess,
}) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [showError, setShowError] = useState(false);
  const userStr = Cookies.get("user");
  const [idPhongBan,SetidPhongBan] = useState();
 useEffect(()=>{
  if (userStr) {
      try {
        const user = JSON.parse(userStr);
        SetidPhongBan(user.idPhongBan );
      } catch {
        SetidPhongBan;
      }
    }
 },[])

  // load dữ liệu khi edit
  useEffect(() => {
    if (action === "edit" && item) {
      setForm({
        id: item.id,
        tenPhuCap: item.tenPhuCap,
        ngayQuyetDinh: item.ngayQuyetDinh ? new Date(item.ngayQuyetDinh) : null,
        lyDo: item.lyDo,
        soTien: item.soTien,
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
        tenPhuCap: form.tenPhuCap,
        ngayQuyetDinh: form.ngayQuyetDinh || null,
        lyDo: form.lyDo,
        soTien: form.soTien ? parseFloat(form.soTien) : null,
        userID: form.userId,
      };
      let res;
      if (action === "edit") {
        res = await apiService.post(`/PhuCap/UpdatePhuCap`, payload);
      } else {
        const { id, ...createPayload } = payload;
        res = await apiService.post(`/PhuCap/CreatePhuCap`, createPayload);
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
    if (!form.tenPhuCap || !form.userId || !form.soTien) {
      setShowError(true);
      return;
    }
    handleSubmit();
    onClose();
  };
  const handleSubmitNews = () => {
    if (!form.tenPhuCap || !form.userId || !form.soTien) {
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
      title={action === "edit" ? "Sửa phụ cấp" : "Thêm phụ cấp"}
      onClose={onClose}
      onSubmitClose={handleSubmitClose}
      onSubmitNew={handleSubmitNews}
    >
      <TextInputCommon
        length={100}
        lable="Tên phụ cấp"
        value={form.tenPhuCap}
        onChangeText={(text) => setForm({ ...form, tenPhuCap: text })}
        required
        placeholder="Nhập tên phụ cấp"
        showError={showError}
      />

      <CommonComboBox
        lable="Nhân viên nhận"
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
        lable="Số tiền nhận"
        value={form.soTien}
        onChangeText={(text) => setForm({ ...form, soTien: text })}
        required
        placeholder="Nhập số tiền"
        showError={showError}
      />

      <TextAreaCommon
        length={200}
        lable="Lý do"
        value={form.lyDo}
        onChangeText={(text) => setForm({ ...form, lyDo: text })}
        placeholder="Nhập lý do"
      />

      <DateCommon
        label="Ngày quyết định"
        value={form.ngayQuyetDinh}
        onChange={(date) => setForm({ ...form, ngayQuyetDinh: date })}
      />
    </CommonModal>
  );
};

export default FormPhuCap;
