"use client";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";

interface LuongCoBan {
  ID: string;
  userId: string;
  hoTen: string;
  tenLuongCoBan: string;
  ngayTao: Date | null;
  luongDeal: number | null;
  luongMotNgayCong: number | null;
  luongMotNgayCongChuNhat: number | null;
  luongMotNgayCongNgayLe: number | null;
  luongTangCaMotTiengNgayThuong: number | null;
  luongTangCaMotTiengNgayChuNhat: number | null;
  luongTangCaMotTiengNgayLe: number | null;
  lyDo: string;
}

interface FormLuongCoBanProps {
  open: boolean;
  action: "view";
  item?: LuongCoBan;
  onClose: () => void;
  onSuccess: () => void;
}

const FormViewLuongCoBan: React.FC<FormLuongCoBanProps> = ({
  open,
  action,
  item,
  onClose,
}) => {
  const [detail, setDetail] = useState<LuongCoBan | null>(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && action === "view" && item) {
      setLoading(true);
      setDetail({
        ID: item.ID || "",
        userId: item.userId || "",
        hoTen: item.hoTen || "",
        tenLuongCoBan: item.tenLuongCoBan || "",
        ngayTao: item.ngayTao ? new Date(item.ngayTao) : null,
        luongDeal: item.luongDeal || 0,
        luongMotNgayCong: item.luongMotNgayCong || 0,
        luongMotNgayCongChuNhat: item.luongMotNgayCongChuNhat || 0,
        luongMotNgayCongNgayLe: item.luongMotNgayCongNgayLe || 0,
        luongTangCaMotTiengNgayThuong: item.luongTangCaMotTiengNgayThuong || 0,
        luongTangCaMotTiengNgayChuNhat:
          item.luongTangCaMotTiengNgayChuNhat || 0,
        luongTangCaMotTiengNgayLe: item.luongTangCaMotTiengNgayLe || 0,
        lyDo: item.lyDo || "",
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
         Thông tin Lương cơ bản {detail?.tenLuongCoBan}
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
            {/* Cột trái: Thông tin cơ bản */}
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
                    gridTemplateColumns: "155px auto",
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
                    <b style={{ color: "#34495e" }}>Tên lương cơ bản:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{detail.tenLuongCoBan}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Ngày tạo:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {detail.ngayTao
                        ? detail.ngayTao.toLocaleDateString("vi-VN")
                        : "Chưa có"}
                    </span>
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
                    gridTemplateColumns: "197px auto",
                    gap: "18px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Lương deal:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.luongDeal || 0)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Lương một ngày công:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.luongMotNgayCong || 0)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>
                      Lương một ngày công chủ nhật:
                    </b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.luongMotNgayCongChuNhat || 0)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>
                      Lương một ngày công ngày lễ:
                    </b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.luongMotNgayCongNgayLe || 0)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>
                      Lương tăng ca 1 tiếng ngày thường:
                    </b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.luongTangCaMotTiengNgayThuong || 0)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>
                      Lương tăng ca 1 tiếng ngày chủ nhật:
                    </b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.luongTangCaMotTiengNgayChuNhat || 0)}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>
                      Lương tăng ca 1 tiếng ngày lễ:
                    </b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.luongTangCaMotTiengNgayLe || 0)}
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

export default FormViewLuongCoBan;
