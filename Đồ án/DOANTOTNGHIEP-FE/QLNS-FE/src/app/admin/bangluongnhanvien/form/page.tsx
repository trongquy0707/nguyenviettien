"use client";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";

interface BangLuongNhanVien {
  ID: string;
  userId: string;
  hoTen: string;
  tenBangLuong: string;
  ngayNhanLuong: Date | null;
  luongDeal: number | null;
  tongLuong: number | null;
  luongTongNgayCongThuong: number | null;
  luongTangCa: number | null;
  luongTongNgayChuNhat: number | null;
  luongTangCaNgayThuong: number | null;
  luongTangCaNgayChuNhat: number | null;
  luongPhuCap: number | null;
  tongThuong: number | null;
  tongPhat: number | null;
  mucDongBaoHiem: number | null;
  tienThue: number | null;
  tienPhatDiMuon: number | null;
  tongNgayCong: number | null;
  tongNgayCongThuong: number | null;
  tongNgayCongChuNhat: number | null;
  tongGioTangCa: number | null;
  tongGioTangCaNgayThuong: number | null;
  tongGioTangCaNgayChuNhat: number | null;
  tongDiMuon: number | null;
}

interface FormBangLuongProps {
  open: boolean;
  action: "add" | "edit";
  item?: BangLuongNhanVien;
  onClose: () => void;
  onSuccess: () => void;
}

const FormBangLuongNhanVien: React.FC<FormBangLuongProps> = ({
  open,
  action,
  item,
  onClose,
}) => {
  const [detail, setDetail] = useState<BangLuongNhanVien | null>(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && action === "edit" && item) {
      setLoading(true);
      setDetail({
        ID: item.ID || "",
        userId: item.userId || "",
        hoTen: item.hoTen || "",
        tenBangLuong: item.tenBangLuong || "",
        ngayNhanLuong: item.ngayNhanLuong ? new Date(item.ngayNhanLuong) : null,
        tongLuong: item.tongLuong || 0,
        luongDeal: item.luongDeal || 0,
        luongTongNgayCongThuong: item.luongTongNgayCongThuong || 0,
        luongTangCa: item.luongTangCa || 0,
        luongTongNgayChuNhat: item.luongTongNgayChuNhat || 0,
        luongTangCaNgayThuong: item.luongTangCaNgayThuong || 0,
        luongTangCaNgayChuNhat: item.luongTangCaNgayChuNhat || 0,
        luongPhuCap: item.luongPhuCap || 0,
        tongThuong: item.tongThuong || 0,
        tongPhat: item.tongPhat || 0,
        mucDongBaoHiem: item.mucDongBaoHiem || 0,
        tienThue: item.tienThue || 0,
        tienPhatDiMuon: item.tienPhatDiMuon || 0,
        tongNgayCong: item.tongNgayCong || 0,
        tongGioTangCa: item.tongGioTangCa || 0,
        tongGioTangCaNgayThuong: item.tongGioTangCaNgayThuong || 0,
        tongGioTangCaNgayChuNhat: item.tongGioTangCaNgayChuNhat || 0,
        tongDiMuon: item.tongDiMuon || 0,
        tongNgayCongChuNhat: item.tongNgayCongChuNhat || 0,
        tongNgayCongThuong: item.tongNgayCongThuong || 0,
      });
      setLoading(false);
    } else {
      setDetail(null);
    }
  }, [action, item, open]);

  return (
    <Modal show={open} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Bảng lương tháng {detail?.tenBangLuong} của {detail?.hoTen}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
        {loading ? (
          <div>Loading...</div>
        ) : detail ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* Cột trái: Thông tin cơ bản và Ngày công & Tăng ca */}
            <div style={{ display: "grid", gap: "15px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h5 style={{ marginBottom: "10px", color: "#2c3e50" }}>
                  Thông tin cơ bản
                </h5>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "200px auto",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Họ tên:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{detail.hoTen}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Tên bảng lương:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{detail.tenBangLuong}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Ngày nhận:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {detail.ngayNhanLuong
                        ? detail.ngayNhanLuong.toLocaleDateString("vi-VN")
                        : "Chưa có"}
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h5 style={{ marginBottom: "10px", color: "#2c3e50" }}>
                  Ngày công & Tăng ca
                </h5>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "200px auto",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Tổng ngày công:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{detail.tongNgayCong + " công"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Tổng ngày công thường:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{detail.tongNgayCongThuong + " công"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Tổng ngày công chủ nhật:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{detail.tongNgayCongChuNhat + " công"}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Tổng giờ tăng ca:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{`${detail.tongGioTangCa ?? 0} giờ`}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Giờ tăng ca ngày thường:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{`${detail.tongGioTangCaNgayThuong ?? 0} giờ`}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>
                      Giờ tăng ca ngày chủ nhật:
                    </b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{`${detail.tongGioTangCaNgayChuNhat ?? 0} giờ`}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Tổng ngày đi muộn:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{detail.tongDiMuon + " ngày"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Chi tiết lương */}
            <div style={{ display: "grid", gap: "15px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h5 style={{ marginBottom: "10px", color: "#2c3e50" }}>
                  Chi tiết lương
                </h5>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "200px auto",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Lương ngày công thường:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.luongTongNgayCongThuong || 0)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>
                      Lương ngày công chủ nhật:
                    </b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.luongTongNgayChuNhat || 0)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>
                      Lương tăng ca ngày thường:
                    </b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.luongTangCaNgayThuong || 0)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>
                      Lương tăng ca ngày chủ nhật:
                    </b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.luongTangCaNgayChuNhat || 0)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Phụ cấp:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.luongPhuCap || 0)}
                    </span>
                  </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Tổng tiền khen thưởng:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.tongThuong || 0)}
                    </span>
                  </div>
                   <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Tổng tiền kỷ luật:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.tongPhat || 0)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Tiền phạt đi muộn:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.tienPhatDiMuon || 0)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Tiền đóng bảo hiểm:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.mucDongBaoHiem || 0)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Tiền thuế:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.tienThue || 0)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "bold",
                      color: "#e74c3c",
                    }}
                  >
                    <b style={{ color: "#34495e", minWidth: "200px" }}>
                      Tổng lương:
                    </b>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.tongLuong || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#7f8c8d" }}>
            Không có dữ liệu
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FormBangLuongNhanVien;
