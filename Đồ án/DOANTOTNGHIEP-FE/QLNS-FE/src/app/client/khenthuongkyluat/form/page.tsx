"use client";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";

interface KhenThuongKyLuat {
  ID: string;
  userId: string;
  hoTen: string;
  soQuyetDinh: string;
  ngayQuyetDinh: Date | null;
  hinhThuc: boolean;
  nguoiKy: string;
  lyDo: string;
  thuongPhat: number | null;
  ghiChu: string;
}

interface FormKhenThuongKyLuatProps {
  open: boolean;
  action: "view";
  item?: KhenThuongKyLuat;
  onClose: () => void;
  onSuccess: () => void;
}

const FormViewKTKL: React.FC<FormKhenThuongKyLuatProps> = ({
  open,
  action,
  item,
  onClose,
}) => {
  const [detail, setDetail] = useState<KhenThuongKyLuat | null>(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && action === "view" && item) {
      setLoading(true);
      setDetail({
        ID: item.ID || "",
        userId: item.userId || "",
        hoTen: item.hoTen || "",
        soQuyetDinh: item.soQuyetDinh || "",
        nguoiKy: item.nguoiKy || "",
        lyDo: item.lyDo || "",
        ghiChu: item.ghiChu || "",
        ngayQuyetDinh: item.ngayQuyetDinh ? new Date(item.ngayQuyetDinh) : null,
        thuongPhat: item.thuongPhat || 0,
        hinhThuc: item.hinhThuc,
      });
      setLoading(false);
    } else {
      setDetail(null);
    }
  }, [action, item, open]);

  const getHinhThucText = (hinhThuc: boolean | undefined) => {
    if (hinhThuc === undefined) return "Chưa xác định";
    return hinhThuc ? "Khen thưởng" : "Kỷ luật";
  };

  return (
   <Modal show={open} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{detail?.hinhThuc ? "Khen thưởng" : "Kỷ luật"} số {detail?.soQuyetDinh} của {detail?.hoTen}</Modal.Title>
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
                    gridTemplateColumns: "150px auto",
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
                    <b style={{ color: "#34495e" }}>Số quyết định:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{detail.soQuyetDinh}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Ngày quyết định:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {detail.ngayQuyetDinh
                        ? detail.ngayQuyetDinh.toLocaleDateString("vi-VN")
                        : "Chưa có"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Người ký:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{detail.nguoiKy}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Chi tiết KTKL */}
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
                  Chi tiết {detail?.hinhThuc ? "Khen thưởng" : "Kỷ luật"}
                </h5>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "150px auto",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Hình thức:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{getHinhThucText(detail.hinhThuc)}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Lý do:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{detail.lyDo}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Thưởng/Phạt:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>
                      {detail.thuongPhat !== null
                        ? `${new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(detail.thuongPhat)}`
                        : "Chưa có"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <b style={{ color: "#34495e" }}>Ghi chú:</b>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>{detail.ghiChu}</span>
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

export default FormViewKTKL;
