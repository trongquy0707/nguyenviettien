"use client";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";

interface BaoHiemNhanVien {
  ID: string;
  userId: string;
  hoTen: string;
  soBaoHiem: string;
  ngayDong: Date | null;
  gioiTinh: boolean;
  CCCD: string;
  ngaySinh: Date | null;
  mucDong: number | null;
}

interface FormBHNVProps {
  open: boolean;
  action: "view";
  item?: BaoHiemNhanVien;
  onClose: () => void;
  onSuccess: () => void;
}

const FormViewBHNV: React.FC<FormBHNVProps> = ({
  open,
  action,
  item,
  onClose,
}) => {
  const [detail, setDetail] = useState<BaoHiemNhanVien | null>(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && action === "view" && item) {
      setLoading(true);
      setDetail({
        ID: item.ID || "",
        userId: item.userId || "",
        hoTen: item.hoTen || "",
        soBaoHiem: item.soBaoHiem || "",
        ngayDong: item.ngayDong ? new Date(item.ngayDong) : null,
        ngaySinh: item.ngaySinh ? new Date(item.ngaySinh) : null,
        mucDong: item.mucDong || 0,
        CCCD: item.CCCD || "",
        gioiTinh: item.gioiTinh,
      });
      setLoading(false);
    } else {
      setDetail(null);
    }
  }, [action, item, open]);

  const getGioiTinhText = (gioiTinh: boolean | undefined) => {
    if (gioiTinh === undefined) return "Chưa xác định";
    return gioiTinh ? "Nam" : "Nữ";
  };

  const getThangDong = (ngayDong: Date | null) => {
    if (!ngayDong) return "";
    return ngayDong.toLocaleDateString("vi-VN", { month: "numeric" });
  };
  return (
    <Modal show={open} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Bảo hiểm nhân viên tháng{" "}
          {detail ? getThangDong(detail.ngayDong) : "Chưa xác định"} của{" "}
          {detail?.hoTen || "Chưa xác định"}
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
                      Giới tính:
                    </b>
                    <span style={{ flex: 1 }}>
                      {getGioiTinhText(detail.gioiTinh)}
                    </span>
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
                      Ngày sinh:
                    </b>
                    <span style={{ flex: 1 }}>
                      {detail.ngaySinh
                        ? detail.ngaySinh.toLocaleDateString("vi-VN")
                        : "Chưa có"}
                    </span>
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
                      CCCD:
                    </b>
                    <span style={{ flex: 1 }}>{detail.CCCD}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Chi tiết Bảo hiểm */}
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
                  Chi tiết Bảo hiểm
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
                      Số bảo hiểm:
                    </b>
                    <span style={{ flex: 1 }}>{detail.soBaoHiem}</span>
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
                      Ngày đóng:
                    </b>
                    <span style={{ flex: 1 }}>
                      {detail.ngayDong
                        ? detail.ngayDong.toLocaleDateString("vi-VN")
                        : "Chưa có"}
                    </span>
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
                      Mức đóng:
                    </b>
                    <span style={{ flex: 1 }}>
                      {detail.mucDong !== null
                        ? `${new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(detail.mucDong)}`
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

export default FormViewBHNV;
