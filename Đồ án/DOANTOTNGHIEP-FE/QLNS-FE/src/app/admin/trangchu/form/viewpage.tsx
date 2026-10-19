"use client";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { Backdrop, CircularProgress } from "@mui/material";

interface User {
  id: string;
  hoTen: string;
  tenPhongBan: string;
  tenChucVu: string;
  tenThanhPhoThuongTru: string;
  tenXaPhuongThuongTru: string;
  tenThanhPhoNoiO: string;
  tenXaPhuongNoiO: string;
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

interface FormViewUserProps {
  open: boolean;
  action: "view";
  item?: User;
  onClose: () => void;
  onSuccess: () => void;
}

const FormViewUser: React.FC<FormViewUserProps> = ({
  open,
  action,
  item,
  onClose,
}) => {
  const [detail, setDetail] = useState<User | null>(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && action === "view" && item) {
      setLoading(true);
      setDetail({
        id: item.id || "",
        hoTen: item.hoTen || "",
        tenPhongBan: item.tenPhongBan || "",
        tenChucVu: item.tenChucVu || "",
        tenThanhPhoThuongTru: item.tenThanhPhoThuongTru || "",
        tenXaPhuongThuongTru: item.tenXaPhuongThuongTru || "",
        tenThanhPhoNoiO: item.tenThanhPhoNoiO || "",
        tenXaPhuongNoiO: item.tenXaPhuongNoiO || "",
        gioiTinh: item.gioiTinh || false,
        ngaySinh: item.ngaySinh ? new Date(item.ngaySinh) : null,
        phongBanID: item.phongBanID || "",
        soHieu: item.soHieu || "",
        chucVuID: item.chucVuID || "",
        ngayBoNhiem: item.ngayBoNhiem ? new Date(item.ngayBoNhiem) : null,
        congViecChinh: item.congViecChinh || "",
        email: item.email || "",
        diDong: item.diDong || "",
        lienHeKhanCap: item.lienHeKhanCap || "",
        cccd: item.cccd || "",
        ngayCap: item.ngayCap ? new Date(item.ngayCap) : null,
        noiCap: item.noiCap || "",
        soBaoHiemYTe: item.soBaoHiemYTe || "",
        thuongTru_TP: item.thuongTru_TP || "",
        thuongTru_XP: item.thuongTru_XP || "",
        thuongTru_CT: item.thuongTru_CT || "",
        noiO_TP: item.noiO_TP || "",
        noiO_XP: item.noiO_XP || "",
        noiO_CT: item.noiO_CT || "",
        ngayVaoLam: item.ngayVaoLam ? new Date(item.ngayVaoLam) : null,
        soNguoiPhuThuoc: item.soNguoiPhuThuoc || "",
        hinhThucXetTuyen: item.hinhThucXetTuyen || "",
        maSoThue: item.maSoThue || "",
        soTaiKhoan: item.soTaiKhoan || "",
        tenNganHang: item.tenNganHang || "",
        avartar: item.avartar || null,
        tenCongViecTruoc: item.tenCongViecTruoc || "",
        tenCongTyTruoc: item.tenCongTyTruoc || "",
        phongBanTruoc: item.phongBanTruoc || "",
        chucVuTruoc: item.chucVuTruoc || "",
        moTaCongViecTruoc: item.moTaCongViecTruoc || "",
        tuNgay: item.tuNgay ? new Date(item.tuNgay) : null,
        denNgay: item.denNgay ? new Date(item.denNgay) : null,
      });
      setLoading(false);
    } else {
      setDetail(null);
    }
  }, [action, item, open]);

  const renderField = (label: string, value: React.ReactNode) => (
    <div style={{ display: "flex", marginBottom: "10px", gap: "15px" }}>
      <div style={{ minWidth: "150px", fontWeight: 600, color: "#34495e" }}>
        {label}:
      </div>
      <div style={{ color: "#2c3e50" }}>{value}</div>
    </div>
  );

  return (
    <Modal show={open} onHide={onClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "1.5rem", color: "#2c3e50" }}>
          Hồ sơ nhân viên: {detail?.hoTen || "Chưa xác định"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
        {loading ? (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        ) : !detail ? (
          <div
            style={{ textAlign: "center", color: "#7f8c8d", padding: "20px" }}
          >
            Không có dữ liệu
          </div>
        ) : (
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Summary Card */}
            <div
              style={{
                background: "linear-gradient(135deg, #3f87f5 0%, #7faff5 100%)",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <img
                src={
                  typeof detail.avartar === "string"
                    ? detail.avartar || "/default-avatar.png"
                    : "/default-avatar.png"
                }
                alt="Avatar"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #fff",
                }}
              />
              <div>
                <h3 style={{ margin: 0, color: "#fff", fontSize: "1.8rem" }}>
                  {detail.hoTen || "Không tên"}
                </h3>
                <p
                  style={{ margin: "5px 0", color: "#fff", fontSize: "1.1rem" }}
                >
                  {detail.tenChucVu || "Chức vụ chưa xác định"}
                </p>
                <p style={{ margin: 0, color: "#fff", fontSize: "1rem" }}>
                  {detail.tenPhongBan || "Phòng ban chưa xác định"} | Mã số:{" "}
                  {detail.soHieu || "N/A"}
                </p>
              </div>
            </div>

            {/* Details Grid – 3 cột */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {/* Thông tin chung */}
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e9ecef",
                }}
              >
                <h4
                  style={{
                    marginBottom: "15px",
                    color: "#2c3e50",
                    fontWeight: 600,
                  }}
                >
                  Thông tin chung
                </h4>
                <div>
                  {renderField("Họ tên", detail.hoTen || "Chưa có")}
                  {renderField(
                    "Giới tính",
                    detail.gioiTinh === true
                      ? "Nam"
                      : detail.gioiTinh === false
                      ? "Nữ"
                      : "Chưa có"
                  )}
                  {renderField(
                    "Ngày sinh",
                    detail.ngaySinh
                      ? new Date(detail.ngaySinh).toLocaleDateString("vi-VN")
                      : "Chưa có"
                  )}
                  {renderField("Phòng ban", detail.tenPhongBan || "Chưa có")}
                  {renderField("Chức vụ", detail.tenChucVu || "Chưa có")}
                  {renderField(
                    "Công việc chính",
                    detail.congViecChinh || "Chưa có"
                  )}
                  {renderField(
                    "Ngày bổ nhiệm",
                    detail.ngayBoNhiem
                      ? new Date(detail.ngayBoNhiem).toLocaleDateString("vi-VN")
                      : "Chưa có"
                  )}
                  {renderField(
                    "Ngày vào làm",
                    detail.ngayVaoLam
                      ? new Date(detail.ngayVaoLam).toLocaleDateString("vi-VN")
                      : "Chưa có"
                  )}
                  {renderField(
                    "Hình thức xét tuyển",
                    detail.hinhThucXetTuyen || "Chưa có"
                  )}
                  {renderField(
                    "Số người phụ thuộc",
                    detail.soNguoiPhuThuoc || "Chưa có"
                  )}
                </div>
              </div>

              {/* Thông tin liên hệ */}
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e9ecef",
                }}
              >
                <h4
                  style={{
                    marginBottom: "15px",
                    color: "#2c3e50",
                    fontWeight: 600,
                  }}
                >
                  Thông tin liên hệ
                </h4>
                <div>
                  {renderField("Email", detail.email || "Chưa có")}
                  {renderField("Số điện thoại", detail.diDong || "Chưa có")}
                  {renderField(
                    "Liên hệ khẩn cấp",
                    detail.lienHeKhanCap || "Chưa có"
                  )}
                </div>
              </div>

              {/* Giấy tờ & Ngân hàng */}
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e9ecef",
                }}
              >
                <h4
                  style={{
                    marginBottom: "15px",
                    color: "#2c3e50",
                    fontWeight: 600,
                  }}
                >
                  Giấy tờ & Ngân hàng
                </h4>
                <div>
                  {renderField("CCCD", detail.cccd || "Chưa có")}
                  {renderField(
                    "Ngày cấp CCCD",
                    detail.ngayCap
                      ? new Date(detail.ngayCap).toLocaleDateString("vi-VN")
                      : "Chưa có"
                  )}
                  {renderField("Nơi cấp CCCD", detail.noiCap || "Chưa có")}
                  {renderField("Số BHYT", detail.soBaoHiemYTe || "Chưa có")}
                  {renderField("Mã số thuế", detail.maSoThue || "Chưa có")}
                  {renderField("Số tài khoản", detail.soTaiKhoan || "Chưa có")}
                  {renderField(
                    "Tên ngân hàng",
                    detail.tenNganHang || "Chưa có"
                  )}
                </div>
              </div>

              {/* Địa chỉ Thường trú – full width */}
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e9ecef",
                  gridColumn: "1 / -1" /* chiếm toàn bộ chiều rộng của grid */,
                }}
              >
                <h4
                  style={{
                    marginBottom: "15px",
                    color: "#2c3e50",
                    fontWeight: 600,
                  }}
                >
                  Địa chỉ Thường trú
                </h4>
                <div>
                  {renderField(
                    "Tỉnh/TP",
                    detail.tenThanhPhoThuongTru || "Chưa có"
                  )}
                  {renderField(
                    "Huyện/Xã",
                    detail.tenXaPhuongThuongTru || "Chưa có"
                  )}
                  {renderField("Chi tiết", detail.thuongTru_CT || "Chưa có")}
                </div>
              </div>

              {/* Địa chỉ Nơi ở hiện tại – full width */}
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e9ecef",
                  gridColumn: "1 / -1",
                }}
              >
                <h4
                  style={{
                    marginBottom: "15px",
                    color: "#2c3e50",
                    fontWeight: 600,
                  }}
                >
                  Địa chỉ Nơi ở hiện tại
                </h4>
                <div>
                  {renderField("Tỉnh/TP", detail.tenThanhPhoNoiO || "Chưa có")}
                  {renderField("Huyện/Xã", detail.tenXaPhuongNoiO || "Chưa có")}
                  {renderField("Chi tiết", detail.noiO_CT || "Chưa có")}
                </div>
              </div>

              {/* Thông tin công việc trước khi vào công ty – full width */}
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e9ecef",
                  gridColumn: "1 / -1",
                }}
              >
                <h4
                  style={{
                    marginBottom: "15px",
                    color: "#2c3e50",
                    fontWeight: 600,
                  }}
                >
                  Quá trình công tác
                </h4>
                <div>
                  {renderField(
                    "Công việc",
                    detail.tenCongViecTruoc || "Chưa có"
                  )}
                  {renderField("Công ty", detail.tenCongTyTruoc || "Chưa có")}
                  {renderField("Phòng ban", detail.phongBanTruoc || "Chưa có")}
                  {renderField("Chức vụ", detail.chucVuTruoc || "Chưa có")}
                  {renderField(
                    "Mô tả công việc",
                    detail.moTaCongViecTruoc || "Chưa có"
                  )}
                  {renderField(
                    "Từ ngày",
                    detail.tuNgay
                      ? new Date(detail.tuNgay).toLocaleDateString("vi-VN")
                      : "Chưa có"
                  )}
                  {renderField(
                    "Đến ngày",
                    detail.denNgay
                      ? new Date(detail.denNgay).toLocaleDateString("vi-VN")
                      : "Chưa có"
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FormViewUser;
