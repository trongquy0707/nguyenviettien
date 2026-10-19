"use client";
import React, { useState, useEffect } from "react";
import CommonModal from "@/src/components/FormControlls/ModalCommon";
import TextInputCommon, {
  TextAreaCommon,
} from "@/src/components/FormControlls/TextInputCommon";
import DateCommon from "@/src/components/FormControlls/DateCommon";
import CommonComboBox from "@/src/components/FormControlls/ComboBoxCommon";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import { it } from "node:test";
import Cookies from "js-cookie";

interface FormState {
  id: string;
  userId: string;
  tenLuongCoBan: string;
  luongDeal: string;
  // LuongMotNgayCong: string;
  // luongMotNgayCongChuNhat: string;
  // luongMotNgayCongNgayLe: string;
  // luongTangCaMotTiengNgayThuong: string;
  // luongTangCaMotTiengChuNhat: string;
  // luongTangCaMotTiengNgayLe: string;
  lyDo: string;
  ngayTao: Date | null;
}

const initialForm: FormState = {
  id: "",
  userId: "",
  tenLuongCoBan: "",
  luongDeal: "",
  // LuongMotNgayCong: "",
  // luongMotNgayCongChuNhat: "",
  // luongMotNgayCongNgayLe: "",
  // luongTangCaMotTiengNgayThuong: "",
  // luongTangCaMotTiengChuNhat: "",
  // luongTangCaMotTiengNgayLe: "",
  lyDo: "",
  ngayTao: null,
};

interface FormLuongCoBanProps {
  open: boolean;
  action: "add" | "edit";
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const FormLuongCoBan: React.FC<FormLuongCoBanProps> = ({
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
        tenLuongCoBan: item.tenLuongCoBan,
        luongDeal: item.luongDeal,
        // LuongMotNgayCong: item.luongMotNgayCong,
        // luongMotNgayCongChuNhat: item.luongMotNgayCongChuNhat,
        // luongMotNgayCongNgayLe: item.luongMotNgayCongNgayLe,
        // luongTangCaMotTiengNgayThuong: item.luongTangCaMotTiengNgayThuong,
        // luongTangCaMotTiengChuNhat: item.luongTangCaMotTiengChuNhat,
        // luongTangCaMotTiengNgayLe: item.luongTangCaMotTiengNgayLe,
        lyDo: item.lyDo,
        ngayTao: item.ngayTao ? new Date(item.ngayTao) : null,
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
        tenLuongCoBan: form.tenLuongCoBan,
        luongDeal: form.luongDeal ? parseFloat(form.luongDeal) : null,
        // luongMotNgayCong: form.LuongMotNgayCong ? parseFloat(form.LuongMotNgayCong) : null,
        // luongMotNgayCongChuNhat: form.luongMotNgayCongChuNhat ? parseFloat(form.luongMotNgayCongChuNhat) : null,
        // luongMotNgayCongNgayLe: form.luongMotNgayCongNgayLe ? parseFloat(form.luongMotNgayCongNgayLe) : null,
        // luongTangCaMotTiengNgayThuong: form.luongTangCaMotTiengNgayThuong ? parseFloat(form.luongTangCaMotTiengNgayThuong) : null,
        // luongTangCaMotTiengChuNhat: form.luongTangCaMotTiengChuNhat ? parseFloat(form.luongTangCaMotTiengChuNhat) : null,
        // luongTangCaMotTiengNgayLe: form.luongTangCaMotTiengNgayLe ? parseFloat(form.luongTangCaMotTiengNgayLe) : null,
        lyDo: form.lyDo,
        ngayTao: form.ngayTao || null,
      };
      let res;
      if (action === "edit") {
        res = await apiService.post(`/LuongCoBan/UpdateLuongCoBan`, payload);
      } else {
        const { id, ...createPayload } = payload;
        res = await apiService.post(
          `/LuongCoBan/CreateLuongCoBan`,
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
    if (!form.userId || !form.tenLuongCoBan || !form.luongDeal) {
      setShowError(true);
      return;
    }
    handleSubmit();
    onClose();
  };
  const handleSubmitNews = () => {
    if (!form.userId || !form.tenLuongCoBan || !form.luongDeal) {
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
      title={action === "edit" ? "Sửa lương cơ bản" : "Thêm lương cơ bản"}
      onClose={onClose}
      onSubmitClose={handleSubmitClose}
      onSubmitNew={handleSubmitNews}
    >
      <TextInputCommon
        length={100}
        lable="Tên lương cơ bản"
        value={form.tenLuongCoBan}
        onChangeText={(text) => setForm({ ...form, tenLuongCoBan: text })}
        required
        placeholder="Nhập tên lương cơ bản"
        showError={showError}
      />

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

      <TextInputCommon
        length={100}
        lable="Lương deal"
        value={form.luongDeal}
        onChangeText={(text) => setForm({ ...form, luongDeal: text })}
        required
        placeholder="Nhập lương deal"
        showError={showError}
      />

      <DateCommon
        label="Ngày tạo"
        value={form.ngayTao}
        onChange={(date) => setForm({ ...form, ngayTao: date })}
      />

      {/* <TextAreaCommon
        length={100}
        lable="Lý do"
        value={form.lyDo}
        onChangeText={(text) => setForm({ ...form, lyDo: text })}
        placeholder="Nhập lý do"
      /> */}
    </CommonModal>
  );
};

export default FormLuongCoBan;
