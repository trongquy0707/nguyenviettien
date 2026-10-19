"use client";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";

interface HopDong {
  ID: string;
  userId: string;
  hoTen: string;
  isLoaiHD: boolean;
  mucLuong: number | null;
  ngayBatDau: Date | null;
  ngayKetThuc: Date | null;
  ngayKy: Date | null;
}

interface FormHopDongProps {
  open: boolean;
  action: "view";
  item?: HopDong;
  onClose: () => void;
  onSuccess: () => void;
}

const FormViewHopDong: React.FC<FormHopDongProps> = ({
  open,
  action,
  item,
  onClose,
}) => {
  const [detail, setDetail] = useState<HopDong | null>(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && action === "view" && item) {
      setLoading(true);
      setDetail({
        ID: item.ID || "",
        userId: item.userId || "",
        hoTen: item.hoTen || "",
        isLoaiHD: item.isLoaiHD,
        mucLuong: item.mucLuong || 0,
        ngayBatDau: item.ngayBatDau ? new Date(item.ngayBatDau) : null,
        ngayKetThuc: item.ngayKetThuc ? new Date(item.ngayKetThuc) : null,
        ngayKy: item.ngayKy ? new Date(item.ngayKy) : null,
      });
      setLoading(false);
    } else {
      setDetail(null);
    }
  }, [action, item, open]);

  const getLoaiHopDongText = (isLoaiHD: boolean | undefined) => {
    if (isLoaiHD === undefined) return "Chưa xác định";
    return isLoaiHD ? "Thử việc" : "Chính thức";
  };

  return (
    <Modal show={open} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Thông tin Hợp đồng {getLoaiHopDongText(detail?.isLoaiHD)}{" "}
          {detail?.hoTen ? `của ${detail.hoTen}` : ""}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
        {loading ? (
          <div>Đang tải...</div>
        ) : detail ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {/* Cột trái */}
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h5 style={{ marginBottom: "10px", color: "#2c3e50" }}>
                Thông tin hợp đồng
              </h5>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "150px auto",
                  gap: "10px",
                }}
              >
                <b>Họ tên:</b>
                <span>{detail.hoTen}</span>

                <b>Loại hợp đồng:</b>
                <span>{getLoaiHopDongText(detail.isLoaiHD)}</span>

                <b>Mức lương:</b>
                <span>
                  {detail.mucLuong !== null
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(detail.mucLuong)
                    : "Chưa có"}
                </span>
              </div>
            </div>

            {/* Cột phải */}
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h5 style={{ marginBottom: "10px", color: "#2c3e50" }}>
                Thời gian hợp đồng
              </h5>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "150px auto",
                  gap: "10px",
                }}
              >
                <b>Ngày ký:</b>
                <span>
                  {detail.ngayKy
                    ? detail.ngayKy.toLocaleDateString("vi-VN")
                    : "Chưa có"}
                </span>

                <b>Ngày bắt đầu:</b>
                <span>
                  {detail.ngayBatDau
                    ? detail.ngayBatDau.toLocaleDateString("vi-VN")
                    : "Chưa có"}
                </span>

                <b>Ngày kết thúc:</b>
                <span>
                  {detail.ngayKetThuc
                    ? detail.ngayKetThuc.toLocaleDateString("vi-VN")
                    : "Chưa có"}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", color: "#7f8c8d" }}>
            Không có dữ liệu hợp đồng
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FormViewHopDong;
