"use client";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import { Backdrop, CircularProgress } from "@mui/material";
import "../hosocanhan/hosocanhan.css";

interface UserProfile {
  id: string;
  hoTen: string | null;
  gioiTinh: boolean | null;
  ngaySinh: Date | null;
  ngayBoNhiem: Date | null;
  congViecChinh: string | null;
  email: string | null;
  diDong: string | null;
  lienHeKhanCap: string | null;
  cccd: string | null;
  ngayCap: Date | null;
  noiCap: string | null;
  soBaoHiemYTe: string | null;
  thuongTru_TP: number | null;
  thuongTru_XP: number | null;
  tenThanhPhoThuongTru: string | null;
  tenXaPhuongThuongTru: string | null;
  thuongTru_CT: string | null;
  noiO_TP: number | null;
  noiO_XP: number | null;
  tenThanhPhoNoiO: string | null;
  tenXaPhuongNoiO: string | null;
  noiO_CT: string | null;
  ngayVaoLam: Date | null;
  soNguoiPhuThuoc: number | null;
  hinhThucXetTuyen: string | null;
  maSoThue: string | null;
  soTaiKhoan: string | null;
  tenNganHang: string | null;
  soHieu: string | null;
  chucVuID: string | null;
  phongBanID: string | null;
  avartar: string | null;
  tenCongViecTruoc: string | null;
  tenCongTyTruoc: string | null;
  phongBanTruoc: string | null;
  chucVuTruoc: string | null;
  moTaCongViecTruoc: string | null;
  tuNgay: Date | null;
  denNgay: Date | null;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userStr = Cookies.get("user");
  const [idUser, setIdUser] = useState<string | null>(null);
  const [tenPhongBan, settenPhongBan] = useState<string | null>(null);
  const [tenChucVu, settenChucVu] = useState<string | null>(null);

  useEffect(() => {
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIdUser(user.id ?? null);
        settenPhongBan(user.phongBan ?? null);
        settenChucVu(user.chucVu ?? null);
      } catch {
        setIdUser(null);
      }
    }
  }, []);

  const fetchProfile = async () => {
    if (!idUser) return;
    setLoading(true);
    try {
      const res = await apiService.get<UserProfile>(
        `/User/GetByIdHoSoNhanVien/${idUser}`
      );
      setProfile(res.data);
    } catch (err) {
      setError("Lỗi khi tải dữ liệu hồ sơ cá nhân");
      toast.error("Lỗi khi tải dữ liệu hồ sơ cá nhân");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idUser !== null) {
      fetchProfile();
    }
  }, [idUser]);

  const renderField = (label: string, value: React.ReactNode) => (
    <div className="profile-field">
      <div className="profile-label">{label}:</div>
      <div className="profile-value">{value}</div>
    </div>
  );

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="profile-page-wrapper">
      {loading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : profile ? (
        <div className="profile-content-area custom-container">
          <div className="profile-summary-card">
            <div className="summary-avatar-group">
              <img
                src={profile.avartar || "/default-avatar.png"}
                alt="Avatar"
                className="profile-avatar-lg"
              />
              <div className="summary-info">
                <h3 className="summary-name">{profile.hoTen || "Không tên"}</h3>
                <p className="summary-title">
                  {tenChucVu || "Chức vụ chưa xác định"}
                </p>
                <p className="summary-department-code">
                  {tenPhongBan || "Phòng ban chưa xác định"} | Mã số:{" "}
                  {profile.soHieu || "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="detail-card">
              <h4 className="detail-card-title">Thông tin chung</h4>
              <div className="detail-card-content">
                {renderField("Họ tên", profile.hoTen || "Chưa có")}
                {renderField(
                  "Giới tính",
                  profile.gioiTinh === true
                    ? "Nam"
                    : profile.gioiTinh === false
                    ? "Nữ"
                    : "Chưa có"
                )}
                {renderField(
                  "Ngày sinh",
                  profile.ngaySinh
                    ? new Date(profile.ngaySinh).toLocaleDateString("vi-VN")
                    : "Chưa có"
                )}
                {renderField("Phòng ban", tenPhongBan)}
                {renderField("Chức vụ", tenChucVu)}
                {renderField(
                  "Công việc chính",
                  profile.congViecChinh || "Chưa có"
                )}
                {renderField(
                  "Ngày bổ nhiệm",
                  profile.ngayBoNhiem
                    ? new Date(profile.ngayBoNhiem).toLocaleDateString("vi-VN")
                    : "Chưa có"
                )}
                {renderField(
                  "Ngày vào làm",
                  profile.ngayVaoLam
                    ? new Date(profile.ngayVaoLam).toLocaleDateString("vi-VN")
                    : "Chưa có"
                )}
                {renderField(
                  "Hình thức xét tuyển",
                  profile.hinhThucXetTuyen || "Chưa có"
                )}
                {renderField(
                  "Số người phụ thuộc",
                  profile.soNguoiPhuThuoc || "Chưa có"
                )}
              </div>
            </div>

            <div className="detail-card">
              <h4 className="detail-card-title">Thông tin liên hệ</h4>
              <div className="detail-card-content">
                {renderField("Email", profile.email || "Chưa có")}
                {renderField("Số điện thoại", profile.diDong || "Chưa có")}
                {renderField(
                  "Liên hệ khẩn cấp",
                  profile.lienHeKhanCap || "Chưa có"
                )}
              </div>
            </div>

            <div className="detail-card">
              <h4 className="detail-card-title">Giấy tờ & Ngân hàng</h4>
              <div className="detail-card-content">
                {renderField("CCCD", profile.cccd || "Chưa có")}
                {renderField(
                  "Ngày cấp CCCD",
                  profile.ngayCap
                    ? new Date(profile.ngayCap).toLocaleDateString("vi-VN")
                    : "Chưa có"
                )}
                {renderField("Nơi cấp CCCD", profile.noiCap || "Chưa có")}
                {renderField("Số BHYT", profile.soBaoHiemYTe || "Chưa có")}
                {renderField("Mã số thuế", profile.maSoThue || "Chưa có")}
                {renderField("Số tài khoản", profile.soTaiKhoan || "Chưa có")}
                {renderField("Tên ngân hàng", profile.tenNganHang || "Chưa có")}
              </div>
            </div>

            <div className="detail-card detail-card-full">
              <h4 className="detail-card-title">Địa chỉ Thường trú</h4>
              <div className="detail-card-content">
                {renderField(
                  "Tỉnh/TP",
                  profile.tenThanhPhoThuongTru || "Chưa có"
                )}
                {renderField(
                  "Huyện/Xã",
                  profile.tenXaPhuongThuongTru || "Chưa có"
                )}
                {renderField("Chi tiết", profile.thuongTru_CT || "Chưa có")}
              </div>
            </div>

            <div className="detail-card detail-card-full">
              <h4 className="detail-card-title">Địa chỉ Nơi ở hiện tại</h4>
              <div className="detail-card-content">
                {renderField("Tỉnh/TP", profile.tenThanhPhoNoiO || "Chưa có")}
                {renderField("Huyện/Xã", profile.tenXaPhuongNoiO || "Chưa có")}
                {renderField("Chi tiết", profile.noiO_CT || "Chưa có")}
              </div>
            </div>

            <div className="detail-card detail-card-full">
              <h4 className="detail-card-title">Quá trình công tác</h4>
              <div className="detail-card-content">
                {renderField("Công việc", profile.tenCongViecTruoc || "Chưa có")}
                {renderField("Công ty", profile.tenCongTyTruoc || "Chưa có")}
                {renderField("Phòng ban", profile.phongBanTruoc || "Chưa có")}
                {renderField("Chức vụ", profile.chucVuTruoc || "Chưa có")}
                {renderField("Mô tả công việc", profile.moTaCongViecTruoc || "Chưa có")}
                {renderField(
                  "Từ ngày",
                  profile.tuNgay
                    ? new Date(profile.tuNgay).toLocaleDateString("vi-VN")
                    : "Chưa có"
                )}
                {renderField(
                  "Đến ngày",
                  profile.denNgay
                    ? new Date(profile.denNgay).toLocaleDateString("vi-VN")
                    : "Chưa có"
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Không có dữ liệu hồ sơ cá nhân</p>
      )}
    </div>
  );
};

export default ProfilePage;
