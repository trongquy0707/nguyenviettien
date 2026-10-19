"use client";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";

interface DonNghi {
  ID: string;
  userId: string;
  hoTen: string;
  tenNguoiBanGiao: string;
  tenPhongBan: string;
  tenChucVu: string;
  nguoiBanGiaoId: string;
  ngayBatDau: Date | null;
  ngayKetThuc: Date | null;
  lyDo: string;
  soNgayNghi: string;
  ngayTao: Date | null;
  loaiNghi: boolean;
}

interface FormViewDonNghiProps {
  open: boolean;
  action: "view";
  item?: DonNghi;
  onClose: () => void;
  onSuccess: () => void;
}

const FormViewDonNghi: React.FC<FormViewDonNghiProps> = ({
  open,
  action,
  item,
  onClose,
}) => {
  const [detail, setDetail] = useState<DonNghi | null>(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && action === "view" && item) {
      setLoading(true);
      setDetail({
        ID: item.ID || "",
        userId: item.userId || "",
        hoTen: item.hoTen || "",
        tenPhongBan: item.tenPhongBan || "",
        ngayTao: item.ngayTao ? new Date(item.ngayTao) : null,
        ngayBatDau: item.ngayBatDau ? new Date(item.ngayBatDau) : null,
        ngayKetThuc: item.ngayKetThuc ? new Date(item.ngayKetThuc) : null,
        lyDo: item.lyDo || "",
        soNgayNghi: item.soNgayNghi || "",
        loaiNghi: item.loaiNghi,
        nguoiBanGiaoId: item.nguoiBanGiaoId || "",
        tenNguoiBanGiao: item.tenNguoiBanGiao || "",
        tenChucVu: item.tenChucVu || "",
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
          Đơn nghỉ phép ngày{" "}
          {detail?.ngayTao
            ? new Date(detail.ngayTao).toLocaleDateString("vi-VN")
            : "Chưa xác định"}{" "}
          của {detail?.hoTen || "Chưa xác định"}
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
            {/* Cột trái: Thông tin nhân viên */}
            <div style={{ display: "grid", gap: "15px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e9ecef",
                }}
              >
                <h5
                  style={{
                    marginBottom: "15px",
                    color: "#2c3e50",
                    fontWeight: 600,
                  }}
                >
                  Thông tin nhân viên
                </h5>

                <div style={{ display: "grid", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <b style={{ minWidth: "150px", color: "#34495e" }}>
                      Họ tên:
                    </b>
                    <span>{detail.hoTen}</span>
                  </div>

                  <div style={{ display: "flex", gap: "15px" }}>
                    <b style={{ minWidth: "150px", color: "#34495e" }}>
                      Phòng ban:
                    </b>
                    <span>{detail.tenPhongBan}</span>
                  </div>

                  <div style={{ display: "flex", gap: "15px" }}>
                    <b style={{ minWidth: "150px", color: "#34495e" }}>
                      Chức vụ:
                    </b>
                    <span>{detail.tenChucVu}</span>
                  </div>

                  <div style={{ display: "flex", gap: "15px" }}>
                    <b style={{ minWidth: "150px", color: "#34495e" }}>
                      Người bàn giao:
                    </b>
                    <span>{detail.tenNguoiBanGiao}</span>
                  </div>

                  <div style={{ display: "flex", gap: "15px" }}>
                    <b style={{ minWidth: "150px", color: "#34495e" }}>
                      Ngày tạo đơn:
                    </b>
                    <span>
                      {detail.ngayTao
                        ? detail.ngayTao.toLocaleDateString("vi-VN")
                        : "Chưa có"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Thông tin đơn nghỉ */}
            <div style={{ display: "grid", gap: "15px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e9ecef",
                }}
              >
                <h5
                  style={{
                    marginBottom: "15px",
                    color: "#2c3e50",
                    fontWeight: 600,
                  }}
                >
                  Thông tin nghỉ phép
                </h5>

                <div style={{ display: "grid", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "15px" }}>
                    <b style={{ minWidth: "150px", color: "#34495e" }}>
                      Ngày bắt đầu:
                    </b>
                    <span>
                      {detail.ngayBatDau
                        ? detail.ngayBatDau.toLocaleDateString("vi-VN")
                        : "Chưa có"}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "15px" }}>
                    <b style={{ minWidth: "150px", color: "#34495e" }}>
                      Ngày kết thúc:
                    </b>
                    <span>
                      {detail.ngayKetThuc
                        ? detail.ngayKetThuc.toLocaleDateString("vi-VN")
                        : "Chưa có"}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "15px" }}>
                    <b style={{ minWidth: "150px", color: "#34495e" }}>
                      Số ngày nghỉ:
                    </b>
                    <span>{detail.soNgayNghi || "Không rõ"}</span>
                  </div>

                  <div style={{ display: "flex", gap: "15px" }}>
                    <b style={{ minWidth: "150px", color: "#34495e" }}>
                      Loại nghỉ:
                    </b>
                    <span
                      style={{
                        color: detail.loaiNghi ? "#27ae60" : "#c0392b",
                        fontWeight: 500,
                      }}
                    >
                      {detail.loaiNghi ? "Nghỉ có phép" : "Nghỉ không phép"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Lý do nghỉ */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e9ecef",
                }}
              >
                <h5
                  style={{
                    marginBottom: "15px",
                    color: "#2c3e50",
                    fontWeight: 600,
                  }}
                >
                  Lý do nghỉ
                </h5>
                <div
                  style={{
                    backgroundColor: "#f8f9fa",
                    padding: "10px 12px",
                    borderRadius: "6px",
                    lineHeight: "1.6",
                    whiteSpace: "pre-line",
                  }}
                >
                  {detail.lyDo || "Không có lý do"}
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

export default FormViewDonNghi;
