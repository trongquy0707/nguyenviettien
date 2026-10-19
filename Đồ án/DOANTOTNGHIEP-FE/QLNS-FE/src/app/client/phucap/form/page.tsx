"use client";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";

interface PhuCap {
  ID: string;
  userId: string;
  hoTen: string;
  tenPhuCap: string;
  ngayQuyetDinh: Date | null;
  lyDo: string;
  soTien: number | null;
}

interface FormPhuCapProps {
  open: boolean;
  action: "view";
  item?: PhuCap;
  onClose: () => void;
  onSuccess: () => void;
}

const FormViewPhuCap: React.FC<FormPhuCapProps> = ({
  open,
  action,
  item,
  onClose,
}) => {
  const [detail, setDetail] = useState<PhuCap | null>(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && action === "view" && item) {
      setLoading(true);
      setDetail({
        ID: item.ID || "",
        userId: item.userId || "",
        hoTen: item.hoTen || "",
        tenPhuCap: item.tenPhuCap || "",
        lyDo: item.lyDo || "",
        ngayQuyetDinh: item.ngayQuyetDinh ? new Date(item.ngayQuyetDinh) : null,
        soTien: item.soTien || 0,
      });
      setLoading(false);
    } else {
      setDetail(null);
    }
  }, [action, item, open]);

  return (
    <Modal show={open} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{detail?.tenPhuCap} của {detail?.hoTen}</Modal.Title>
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
                  Thông tin cơ bản
                </h5>
                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "15px",
                    }}
                  >
                    <b
                      style={{
                        color: "#34495e",
                        minWidth: "150px",
                        flexShrink: 0,
                      }}
                    >
                      Họ tên:
                    </b>
                    <span style={{ flex: 1 }}>{detail.hoTen}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "15px",
                    }}
                  >
                    <b
                      style={{
                        color: "#34495e",
                        minWidth: "150px",
                        flexShrink: 0,
                      }}
                    >
                      Tên phụ cấp:
                    </b>
                    <span style={{ flex: 1 }}>{detail.tenPhuCap}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "15px",
                    }}
                  >
                    <b
                      style={{
                        color: "#34495e",
                        minWidth: "150px",
                        flexShrink: 0,
                      }}
                    >
                      Ngày quyết định:
                    </b>
                    <span style={{ flex: 1 }}>
                      {detail.ngayQuyetDinh
                        ? detail.ngayQuyetDinh.toLocaleDateString("vi-VN")
                        : "Chưa có"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Chi tiết Phụ cấp */}
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
                  Chi tiết Phụ cấp
                </h5>
                <div
                  style={{
                    display: "grid",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1px",
                    }}
                  >
                    <b
                      style={{
                        color: "#34495e",
                        minWidth: "150px",
                        flexShrink: 0,
                      }}
                    >
                      Lý do:
                    </b>
                    <span style={{ flex: 1, wordBreak: "break-word" }}>
                      {detail.lyDo}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1px",
                    }}
                  >
                    <b
                      style={{
                        color: "#34495e",
                        minWidth: "150px",
                        flexShrink: 0,
                      }}
                    >
                      Số tiền:
                    </b>
                    <span style={{ flex: 1 }}>
                      {detail.soTien !== null
                        ? `${new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(detail.soTien)}`
                        : "Chưa có"}
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

export default FormViewPhuCap;
