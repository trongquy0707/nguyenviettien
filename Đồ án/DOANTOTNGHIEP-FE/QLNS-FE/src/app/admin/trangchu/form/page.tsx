"use client";
import React, { useState, useEffect } from "react";
import CommonModal from "@/src/components/FormControlls/ModalCommon";
import TextInputCommon, {
  TextAreaCommon,
} from "@/src/components/FormControlls/TextInputCommon";
import DateCommon from "@/src/components/FormControlls/DateCommon";
import FileInputCommon from "@/src/components/FormControlls/FileInputCommon";
import RadioGroupCommon from "@/src/components/FormControlls/RadioCommon";
import CommonComboBox from "@/src/components/FormControlls/ComboBoxCommon";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import { it } from "node:test";
import Cookies from "js-cookie";


interface FormState {
  id: string;
  hoTen: string;
  gioiTinh: boolean;
  ngaySinh: Date | null;
  phongBanID: string;
  soHieu: string;
  chucVuID: string;
  ngayBoNhiem: Date | null;
  congViecChinh: string;
  email: string;
  diDong: string;
  lienHeKhanCap: string;
  cccd: string;
  ngayCap: Date | null;
  noiCap: string;
  soBaoHiemYTe: string;
  thuongTru_TP: string;
  thuongTru_XP: string;
  thuongTru_CT: string;
  noiO_TP: string;
  noiO_XP: string;
  noiO_CT: string;
  ngayVaoLam: Date | null;
  soNguoiPhuThuoc: string;
  hinhThucXetTuyen: string;
  maSoThue: string;
  soTaiKhoan: string;
  tenNganHang: string;
  avartar?: File | string | null;
  tenCongViecTruoc: string;
  tenCongTyTruoc: string;
  phongBanTruoc: string;
  chucVuTruoc: string;
  moTaCongViecTruoc: string;
  tuNgay: Date | null;
  denNgay: Date | null;
}
const initialForm: FormState = {
  id: "",
  hoTen: "",
  gioiTinh: true,
  ngaySinh: null,
  phongBanID: "",
  soHieu: "",
  chucVuID: "",
  ngayBoNhiem: null,
  congViecChinh: "",
  email: "",
  diDong: "",
  lienHeKhanCap: "",
  cccd: "",
  ngayCap: null,
  noiCap: "",
  soBaoHiemYTe: "",
  thuongTru_TP: "",
  thuongTru_XP: "",
  thuongTru_CT: "",
  noiO_TP: "",
  noiO_XP: "",
  noiO_CT: "",
  ngayVaoLam: null,
  soNguoiPhuThuoc: "",
  hinhThucXetTuyen: "",
  maSoThue: "",
  soTaiKhoan: "",
  tenNganHang: "",
  avartar: null,
  tenCongViecTruoc: "",
  tenCongTyTruoc: "",
  phongBanTruoc: "",
  chucVuTruoc: "",
  moTaCongViecTruoc: "",
  tuNgay: null,
  denNgay: null,
};
interface FormUsersProps {
  open: boolean;
  action: "add" | "edit";
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const FormUser: React.FC<FormUsersProps> = ({
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
        hoTen: item.hoTen,
        gioiTinh: item.gioiTinh,
        ngaySinh: item.ngaySinh ? new Date(item.ngaySinh) : null,
        phongBanID: item.phongBanID ? String(item.phongBanID) : "",
        soHieu: item.soHieu,
        chucVuID: item.chucVuID ? String(item.chucVuID) : "",
        ngayBoNhiem: item.ngayBoNhiem ? new Date(item.ngayBoNhiem) : null,
        congViecChinh: item.congViecChinh,
        email: item.email,
        diDong: item.diDong,
        lienHeKhanCap: item.lienHeKhanCap,
        cccd: item.cccd,
        ngayCap: item.ngayCap ? new Date(item.ngayCap) : null,
        noiCap: item.noiCap,
        soBaoHiemYTe: item.soBaoHiemYTe,
        thuongTru_TP: item.thuongTru_TP?.toString() ?? "",
        thuongTru_XP: item.thuongTru_XP?.toString() ?? "",
        thuongTru_CT: item.thuongTru_CT,
        noiO_TP: item.noiO_TP?.toString() ?? "",
        noiO_XP: item.noiO_XP?.toString() ?? "",
        noiO_CT: item.noiO_CT,
        ngayVaoLam: item.ngayVaoLam ? new Date(item.ngayVaoLam) : null,
        soNguoiPhuThuoc: item.soNguoiPhuThuoc ?? "",
        hinhThucXetTuyen: item.hinhThucXetTuyen,
        maSoThue: item.maSoThue,
        soTaiKhoan: item.soTaiKhoan,
        tenNganHang: item.tenNganHang,
        avartar: item.avartar ?? null,
        tenCongViecTruoc: item.tenCongViecTruoc ?? "",
        tenCongTyTruoc: item.tenCongTyTruoc ?? "",
        phongBanTruoc: item.phongBanTruoc ?? "",
        chucVuTruoc: item.chucVuTruoc ?? "",
        moTaCongViecTruoc: item.moTaCongViecTruoc ?? "",
        tuNgay: item.tuNgay ? new Date(item.tuNgay) : null,
        denNgay: item.denNgay ? new Date(item.denNgay) : null,
      });
    } else {
      setForm(initialForm);
    }
  }, [action, item, open]);

    // Lấy idPhongBan từ cookie
  const userStr = Cookies.get("user");
  const [idPhongBan, setIdPhongBan] = useState<string | null>(null);
  useEffect(() => {
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIdPhongBan(user.idPhongBan ?? null);
      } catch {
        setIdPhongBan(null);
      }
    }
  }, []);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Thêm các trường dữ liệu vào FormData
      formData.append("ID", form.id || "");
      formData.append("HoTen", form.hoTen);
      formData.append("GioiTinh", form.gioiTinh.toString());
      formData.append(
        "NgaySinh",
        form.ngaySinh ? form.ngaySinh.toISOString().split("T")[0] : ""
      );
      formData.append("PhongBanID", form.phongBanID);
      formData.append("SoHieu", form.soHieu);
      formData.append("ChucVuID", form.chucVuID);
      formData.append(
        "NgayBoNhiem",
        form.ngayBoNhiem ? form.ngayBoNhiem.toISOString().split("T")[0] : ""
      );
      formData.append("CongViecChinh", form.congViecChinh || "");
      formData.append("Email", form.email || "");
      formData.append("DiDong", form.diDong || "");
      formData.append("LienHeKhanCap", form.lienHeKhanCap || "");
      formData.append("CCCD", form.cccd || "");
      formData.append(
        "NgayCap",
        form.ngayCap ? form.ngayCap.toISOString().split("T")[0] : ""
      );
      formData.append("NoiCap", form.noiCap || "");
      formData.append("SoBaoHiemYTe", form.soBaoHiemYTe || "");
      formData.append("ThuongTru_TP", form.thuongTru_TP);
      formData.append("ThuongTru_XP", form.thuongTru_XP);
      formData.append("ThuongTru_CT", form.thuongTru_CT);
      formData.append("NoiO_TP", form.noiO_TP);
      formData.append("NoiO_XP", form.noiO_XP);
      formData.append("NoiO_CT", form.noiO_CT);
      formData.append(
        "NgayVaoLam",
        form.ngayVaoLam ? form.ngayVaoLam.toISOString().split("T")[0] : ""
      );
      formData.append("SoNguoiPhuThuoc", form.soNguoiPhuThuoc || "");
      formData.append("HinhThucXetTuyen", form.hinhThucXetTuyen || "");
      formData.append("MaSoThue", form.maSoThue || "");
      formData.append("SoTaiKhoan", form.soTaiKhoan || "");
      formData.append("TenNganHang", form.tenNganHang || "");
      formData.append("TenCongViecTruoc", form.tenCongViecTruoc || "");
      formData.append("TenCongTyTruoc", form.tenCongTyTruoc || "");
      formData.append("PhongBanTruoc", form.phongBanTruoc || "");
      formData.append("ChucVuTruoc", form.chucVuTruoc || "");
      formData.append("MoTaCongViecTruoc", form.moTaCongViecTruoc || "");
      formData.append(
        "TuNgay",
        form.tuNgay ? form.tuNgay.toISOString().split("T")[0] : ""
      );
      formData.append(
        "DenNgay",
        form.denNgay ? form.denNgay.toISOString().split("T")[0] : ""
      );

      if (form.avartar instanceof File) {
        formData.append("avartar", form.avartar);
      } else if (typeof form.avartar === "string" && form.avartar) {
        formData.append("avartar", form.avartar);
      } else {
        formData.append("avartar", "");
      }

      let res;
      if (action === "edit") {
        res = await apiService.postWithFile(`/User/UpdateUser`, formData);
      } else {
        const { id, ...createPayload } = Object.fromEntries(
          Array.from(formData.entries()).filter(([key]) => key !== "ID")
        );
        res = await apiService.postWithFile(`/User/CreateUser`, createPayload);
      }

      if (!res.error) {
        toast.success(
          `${action === "edit" ? "Cập nhật" : "Thêm mới"} thành công`
        );
        onSuccess();
      } else {
        toast.error(
          `${action === "edit" ? "Cập nhật" : "Thêm mới"} thất bại: ${
            res.error
          }`
        );
      }
    } catch (err: any) {
      toast.error(`Lỗi: ${err.message}`);
    }
  };

  const handleSubmitClose = () => {
    if (
      !form.hoTen ||
      !form.chucVuID ||
      !form.phongBanID ||
      !form.soHieu ||
      !form.ngaySinh ||
      !form.diDong ||
      !form.cccd ||
      !form.thuongTru_TP ||
      !form.thuongTru_TP ||
      !form.noiO_TP ||
      !form.noiO_XP ||
      !form.noiO_CT ||
      !form.thuongTru_CT ||
      !form.tenCongViecTruoc ||
      !form.tuNgay ||
      !form.denNgay ||
      !form.soBaoHiemYTe
    ) {
      setShowError(true);
      return;
    }
    handleSubmit();
    onClose();
  };
  const handleSubmitNews = () => {
    if (
      !form.hoTen ||
      !form.chucVuID ||
      !form.phongBanID ||
      !form.soHieu ||
      !form.ngaySinh ||
      !form.diDong ||
      !form.cccd ||
      !form.thuongTru_TP ||
      !form.thuongTru_TP ||
      !form.noiO_TP ||
      !form.noiO_XP ||
      !form.noiO_CT ||
      !form.thuongTru_CT ||
      !form.tenCongViecTruoc ||
      !form.tuNgay ||
      !form.denNgay ||
      !form.soBaoHiemYTe
    ) {
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
        action === "edit" ? "Sửa hồ sơ nhân viên" : "Thêm mới hồ sơ nhân viên"
      }
      onClose={onClose}
      onSubmitClose={handleSubmitClose}
      onSubmitNew={handleSubmitNews}
    >
      <TextInputCommon
        length={100}
        lable="Số hiệu"
        value={form.soHieu}
        onChangeText={(text) => setForm({ ...form, soHieu: text })}
        required
        placeholder="Nhập số hiệu"
        showError={showError}
      />

      <TextInputCommon
        length={100}
        lable="Họ tên"
        value={form.hoTen}
        onChangeText={(text) => setForm({ ...form, hoTen: text })}
        required
        placeholder="Nhập họ tên"
        showError={showError}
      />

      <RadioGroupCommon
        label="Giới tính"
        options={[
          { label: "Nam", value: true },
          { label: "Nữ", value: false },
        ]}
        value={form.gioiTinh}
        onChange={(val) => setForm({ ...form, gioiTinh: val as boolean })}
        required
        showError={showError}
      />

      <DateCommon
        label="Ngày sinh"
        value={form.ngaySinh}
        onChange={(date) => setForm({ ...form, ngaySinh: date })}
        required
        showError={showError}
      />

      <CommonComboBox
        lable="Phòng ban"
        endpoint={`/PhongBan/GetAllPhongBanCBB?idphongban=${idPhongBan}`}
        labelField="tenPhongBan"
        valueField="id"
        value={form.phongBanID}
        onChange={(val) => setForm({ ...form, phongBanID: val })}
        placeholder="-- Chọn phòng ban --"
        length={100}
        required
        showError={showError}
      />

      <CommonComboBox
        lable="Chức vụ"
        endpoint={`/ChucVu/GetAllChucVuCBB`}
        labelField="tenChucVu"
        valueField="id"
        value={form.chucVuID}
        onChange={(val) => setForm({ ...form, chucVuID: val })}
        placeholder="-- Chọn chức vụ --"
        required
        showError={showError}
        length={100}
      />

      <TextInputCommon
        length={100}
        lable="Email"
        value={form.email}
        onChangeText={(text) => setForm({ ...form, email: text })}
        placeholder="Nhập email"
      />

      <TextInputCommon
        length={100}
        lable="SĐT"
        value={form.diDong}
        onChangeText={(text) => setForm({ ...form, diDong: text })}
        placeholder="Nhập SĐT"
        required
        showError={showError}
      />

      <TextInputCommon
        length={100}
        lable="Số liên hệ khẩn cấp"
        value={form.lienHeKhanCap}
        onChangeText={(text) => setForm({ ...form, lienHeKhanCap: text })}
        placeholder="Nhập số liên hệ khẩn cấp"
      />

      <TextInputCommon
        length={100}
        lable="CCCD"
        value={form.cccd}
        onChangeText={(text) => setForm({ ...form, cccd: text })}
        required
        placeholder="Nhập số CCCD"
        showError={showError}
      />

      <DateCommon
        label="Ngày cấp"
        value={form.ngayCap}
        onChange={(date) => setForm({ ...form, ngayCap: date })}
      />

      <TextInputCommon
        length={100}
        lable="Nơi cấp"
        value={form.noiCap}
        onChangeText={(text) => setForm({ ...form, noiCap: text })}
        placeholder="Nhập nơi cấp"
      />

      <TextInputCommon
        length={100}
        lable="Số thẻ bảo hiểm y tế"
        value={form.soBaoHiemYTe}
        onChangeText={(text) => setForm({ ...form, soBaoHiemYTe: text })}
        placeholder="Nhập số thẻ bảo hiểm y tế"
        required
        showError={showError}
      />

      <TextInputCommon
        length={100}
        lable="Công việc chính"
        value={form.congViecChinh}
        onChangeText={(text) => setForm({ ...form, congViecChinh: text })}
        placeholder="Nhập công việc chính"
      />

      <DateCommon
        label="Ngày bổ nhiệm"
        value={form.ngayBoNhiem}
        onChange={(date) => setForm({ ...form, ngayBoNhiem: date })}
      />

      <CommonComboBox
        lable="Thường trú: Thành phố"
        endpoint={`/DiaChi/ThanhPho`}
        labelField="tenDayDu"
        valueField="maThanhPho"
        value={form.thuongTru_TP}
        onChange={(val) =>
          setForm({ ...form, thuongTru_TP: val, thuongTru_XP: "" })
        }
        placeholder="-- Chọn thành phố --"
        required
        showError={showError}
        length={100}
      />

      <CommonComboBox
        lable="Thường trú: Xã phường"
        endpoint={`/DiaChi/XaPhuong/${form.thuongTru_TP}`}
        labelField="tenDayDu"
        valueField="maXaPhuong"
        value={form.thuongTru_XP}
        onChange={(val) => setForm({ ...form, thuongTru_XP: val })}
        placeholder="-- Chọn xã phường --"
        required
        showError={showError}
        length={100}
      />

      <TextInputCommon
        length={100}
        lable="Thường trú: Chi tiết"
        value={form.thuongTru_CT}
        onChangeText={(text) => setForm({ ...form, thuongTru_CT: text })}
        required
        placeholder="Nhập chi tiết nơi thường trú"
        showError={showError}
      />

      <CommonComboBox
        lable="Nơi ở: Thành phố"
        endpoint={`/DiaChi/ThanhPho`}
        labelField="tenDayDu"
        valueField="maThanhPho"
        value={form.noiO_TP}
        onChange={(val) => setForm({ ...form, noiO_TP: val, noiO_XP: "" })}
        placeholder="-- Chọn thành phố --"
        required
        showError={showError}
        length={100}
      />

      <CommonComboBox
        lable="Nơi ở: Xã phường"
        endpoint={`/DiaChi/XaPhuong/${form.noiO_TP}`}
        labelField="tenDayDu"
        valueField="maXaPhuong"
        value={form.noiO_XP}
        onChange={(val) => setForm({ ...form, noiO_XP: val })}
        placeholder="-- Chọn xã phường --"
        required
        showError={showError}
        length={100}
      />

      <TextInputCommon
        length={100}
        lable="Nơi ở: Chi tiết"
        value={form.noiO_CT}
        onChangeText={(text) => setForm({ ...form, noiO_CT: text })}
        required
        placeholder="Nhập chi tiết nơi ở"
        showError={showError}
      />

      <DateCommon
        label="Ngày vào làm"
        value={form.ngayVaoLam}
        onChange={(date) => setForm({ ...form, ngayVaoLam: date })}
      />

      <TextInputCommon
        length={100}
        lable="Hình thức xét tuyển"
        value={form.hinhThucXetTuyen}
        onChangeText={(text) => setForm({ ...form, hinhThucXetTuyen: text })}
        placeholder="Nhập hình thức xét tuyển"
      />

      <TextInputCommon
        length={100}
        lable="Mã số thuế"
        value={form.maSoThue}
        onChangeText={(text) => setForm({ ...form, maSoThue: text })}
        placeholder="Nhập mã số thuế"
      />

      <TextInputCommon
        length={100}
        lable="Số người phụ thuộc(Nhập số)"
        value={form.soNguoiPhuThuoc}
        onChangeText={(text) => setForm({ ...form, soNguoiPhuThuoc: text })}
        placeholder="Nhập số người phụ thuộc"
      />

      <TextInputCommon
        length={100}
        lable="Số tài khoản"
        value={form.soTaiKhoan}
        onChangeText={(text) => setForm({ ...form, soTaiKhoan: text })}
        placeholder="Nhập số tài khoản"
      />

      <TextInputCommon
        length={100}
        lable="Tên ngân hàng"
        value={form.tenNganHang}
        onChangeText={(text) => setForm({ ...form, tenNganHang: text })}
        placeholder="Nhập tên ngân hàng"
      />

      <TextInputCommon
        length={100}
        lable="Tên công việc làm trước khi vào công ty"
        value={form.tenCongViecTruoc}
        onChangeText={(text) => setForm({ ...form, tenCongViecTruoc: text })}
        placeholder="Nhập tên công việc"
        required
        showError={showError}
      />

      <TextInputCommon
        length={100}
        lable="Tên công ty làm trước khi vào công ty"
        value={form.tenCongTyTruoc}
        onChangeText={(text) => setForm({ ...form, tenCongTyTruoc: text })}
        placeholder="Nhập tên công ty"
      />

      <TextInputCommon
        length={100}
        lable="Tên phòng ban trước khi vào công ty"
        value={form.phongBanTruoc}
        onChangeText={(text) => setForm({ ...form, phongBanTruoc: text })}
        placeholder="Nhập tên phòng ban"
      />

      <TextInputCommon
        length={100}
        lable="Tên chức vụ trước khi vào công ty"
        value={form.chucVuTruoc}
        onChangeText={(text) => setForm({ ...form, chucVuTruoc: text })}
        placeholder="Nhập tên chức vụ"
      />

      <DateCommon
        label="Từ ngày"
        value={form.tuNgay}
        onChange={(date) => setForm({ ...form, tuNgay: date })}
        required
        showError={showError}
      />

      <DateCommon
        label="Đến ngày"
        value={form.denNgay}
        onChange={(date) => setForm({ ...form, denNgay: date })}
        required
        showError={showError}
      />

      <TextAreaCommon
        length={200}
        lable="Mô tả công việc trước khi vào công ty"
        value={form.moTaCongViecTruoc}
        onChangeText={(text) => setForm({ ...form, moTaCongViecTruoc: text })}
        placeholder="Nhập mô tả công việc"
      />

      <FileInputCommon
        lable="Ảnh đại diện"
        required={false}
        showError={showError}
        value={form.avartar}
        onChangeFile={(file) => setForm({ ...form, avartar: file })}
      />
    </CommonModal>
  );
};

export default FormUser;
