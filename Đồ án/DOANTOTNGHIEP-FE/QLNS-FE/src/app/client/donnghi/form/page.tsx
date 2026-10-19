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
  nguoiBanGiaoId: string;
  ngayBatDau: Date | null;
  ngayKetThuc: Date | null;
  lyDo: string;
  soNgayNghi: string;
  ngayTao: Date | null;
  loaiNghi: boolean;
}

const initialForm: FormState = {
  id: "",
  loaiNghi: true,
  ngayTao: null,
  ngayBatDau: null,
  ngayKetThuc: null,
  lyDo: "",
  soNgayNghi: "",
  userId: "",
  nguoiBanGiaoId: "",
};

interface FormDonNghiProps {
  open: boolean;
  action: "add" | "edit";
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const FormDonNghi: React.FC<FormDonNghiProps> = ({
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
  const [idUser, SetidUser] = useState();
  useEffect(() => {
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        SetidUser(user.id);
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
        loaiNghi: item.loaiNghi,
        ngayBatDau: item.ngayBatDau ? new Date(item.ngayBatDau) : null,
        ngayKetThuc: item.ngayKetThuc ? new Date(item.ngayKetThuc) : null,
        lyDo: item.lyDo,
        soNgayNghi: item.soNgayNghi ? String(item.soNgayNghi) : "",
        ngayTao: item.ngayTao ? new Date(item.ngayTao) : null,
        userId: item.userID ? String(item.userID) : "",
        nguoiBanGiaoId: item.nguoiBanGiaoID ? String(item.nguoiBanGiaoID) : "",
      });
    } else {
      setForm(initialForm);
    }
  }, [action, item, open]);

  const handleSubmit = async () => {
    // try {
      const payload = {
        id: form.id || undefined,
        loaiNghi: form.loaiNghi,
        ngayBatDau: form.ngayBatDau || null,
        ngayKetThuc: form.ngayKetThuc || null,
        lyDo: form.lyDo,
        soNgayNghi: form.soNgayNghi ? parseInt(form.soNgayNghi, 10) : null,
        userID: form.userId,
        nguoiBanGiaoID: form.nguoiBanGiaoId || null,
        ngayTao: form.ngayTao || null,
      };
      let res;
      if (action === "edit") {
        res = await apiService.post(`/DonNghi/UpdateDonNghi`, payload);
      } else {
        const { id, ...createPayload } = payload;
        res = await apiService.post(`/DonNghi/CreateDonNghi`, createPayload);
      }
      if (res.error) {
        toast.error(res.error);
        return;
      }
      if (!res.error) {
        toast.success(
          `${action === "edit" ? "Cập nhật" : "Thêm mới"} thành công`,
        );
        onSuccess();
      } else {
        toast.error(`${action === "edit" ? "Cập nhật" : "Thêm mới"} thất bại`);
      }
    // } catch (err: any) {
    //   const errorMessage =
    //     err?.response?.data?.message || // backend trả { message }
    //     err?.response?.data || // backend trả string
    //     err?.message ||
    //     "Có lỗi xảy ra";

    //   toast.error(errorMessage);
    // }
  };

  const handleSubmitClose = () => {
    if (
      !form.userId ||
      !form.nguoiBanGiaoId ||
      !form.ngayBatDau ||
      !form.ngayKetThuc ||
      !form.lyDo
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
      !form.nguoiBanGiaoId ||
      !form.ngayBatDau ||
      !form.ngayKetThuc ||
      !form.lyDo
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
      title={action === "edit" ? "Sửa đơn nghỉ phép" : "Thêm đơn nghỉ phép"}
      onClose={onClose}
      onSubmitClose={handleSubmitClose}
      onSubmitNew={handleSubmitNews}
    >
      <CommonComboBox
        lable="Người làm đơn"
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

      <RadioGroupCommon
        label="Loại nghỉ phép"
        options={[
          { label: "Có phép", value: true },
          { label: "Không phép", value: false },
        ]}
        value={form.loaiNghi}
        onChange={(val) => setForm({ ...form, loaiNghi: val as boolean })}
      />

      <TextAreaCommon
        length={100}
        lable="Lý do"
        value={form.lyDo}
        onChangeText={(text) => setForm({ ...form, lyDo: text })}
        placeholder="Nhập lý do"
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

      <TextInputCommon
        length={100}
        lable="Số ngày nghỉ"
        value={form.soNgayNghi}
        onChangeText={(text) => setForm({ ...form, soNgayNghi: text })}
        placeholder="Nhập số ngày nghỉ"
      />

      <CommonComboBox
        lable="Người bàn giao"
        endpoint={`/User/GetByIdPhongBan?idPhongban=${idPhongBan || ""}`}
        labelField="hoTen"
        valueField="id"
        value={form.nguoiBanGiaoId}
        onChange={(val) => setForm({ ...form, nguoiBanGiaoId: val })}
        placeholder="-- Chọn nhân viên --"
        required
        showError={showError}
        length={100}
      />

      <DateCommon
        label="Ngày tạo đơn"
        value={form.ngayTao}
        onChange={(date) => setForm({ ...form, ngayTao: date })}
      />
    </CommonModal>
  );
};

export default FormDonNghi;
