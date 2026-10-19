"use client";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";

interface KienNghi {
  ID: string;
  userId: string;
  hoTen: string;
  tenPhongBan: string;
  tenChucVu: string;
  noiDung: string;
  ngayTao: Date | null;
}

interface FormViewKienNghiProps {
  open: boolean;
  action: "view";
  item?: KienNghi;
  onClose: () => void;
  onSuccess: () => void;
}

const FormViewKienNghi: React.FC<FormViewKienNghiProps> = ({
  open,
  action,
  item,
  onClose,
}) => {
  const [detail, setDetail] = useState<KienNghi | null>(null);
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
        noiDung: item.noiDung || "",
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
          Kiến nghị ngày{" "}
          {detail?.ngayTao
            ? new Date(detail.ngayTao).toLocaleDateString("vi-VN")
            : "Chưa xác định"}{" "}
          của {detail?.hoTen || "Chưa xác định"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
        {!detail ? (
          <div style={{ textAlign: "center", color: "#7f8c8d" }}>
            Không có dữ liệu
          </div>
        ) : (
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
                      Ngày kiến nghị:
                    </b>
                    <span>
                      {detail.ngayTao
                        ? new Date(detail.ngayTao).toLocaleDateString("vi-VN")
                        : "Chưa có"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Nội dung kiến nghị */}
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
                  Nội dung kiến nghị
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
                  {detail.noiDung || "Không có nội dung"}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FormViewKienNghi;
