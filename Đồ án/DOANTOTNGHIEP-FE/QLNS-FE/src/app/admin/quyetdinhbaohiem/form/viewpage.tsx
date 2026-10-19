"use client";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";

interface QDBH {
  id: string;
  ten: string;
  soQuyetDinh: string;
  ngayHieuLuc: Date | null;
  ngayHetHan: Date | null;
  ngayQuyetDinh: Date | null;
  bhyT_NV: string;
  bhyT_DN: string;
  bhxH_NV: string;
  bhxH_DN: string;
  bhtN_NV: string;
  bhtN_DN: string;
  tongBH_NV: string;
  tongBH_DN: string;
}

interface FormViewQDBHProps {
  open: boolean;
  action: "view";
  item?: QDBH;
  onClose: () => void;
  onSuccess: () => void;
}

const FormViewQDBH: React.FC<FormViewQDBHProps> = ({
  open,
  action,
  item,
  onClose,
}) => {
  const [detail, setDetail] = useState<QDBH | null>(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && action === "view" && item) {
      setLoading(true);
      setDetail({
        id: item.id,
        ten: item.ten,
        soQuyetDinh: item.soQuyetDinh,
        ngayHieuLuc: item.ngayHieuLuc ? new Date(item.ngayHieuLuc) : null,
        ngayHetHan: item.ngayHetHan ? new Date(item.ngayHetHan) : null,
        ngayQuyetDinh: item.ngayQuyetDinh ? new Date(item.ngayQuyetDinh) : null,
        bhyT_NV: item.bhyT_NV,
        bhyT_DN: item.bhyT_DN,
        bhxH_NV: item.bhxH_NV,
        bhxH_DN: item.bhxH_DN,
        bhtN_NV: item.bhtN_NV,
        bhtN_DN: item.bhtN_DN,
        tongBH_DN: item.tongBH_DN,
        tongBH_NV: item.tongBH_NV,
      });
      setLoading(false);
    } else {
      setDetail(null);
    }
  }, [action, item, open]);

  return (
    <Modal show={open} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin Quyết định bảo hiểm: {detail?.ten}</Modal.Title>
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
            {/* Cột trái: Thông tin quyết định */}
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
                  Thông tin quyết định
                </h5>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "160px auto",
                    gap: "10px",
                  }}
                >
                  <div>
                    <b>Tên quyết định:</b>
                  </div>
                  <div>{detail.ten}</div>

                  <div>
                    <b>Số quyết định:</b>
                  </div>
                  <div>{detail.soQuyetDinh}</div>

                  <div>
                    <b>Ngày quyết định:</b>
                  </div>
                  <div>
                    {detail.ngayQuyetDinh
                      ? detail.ngayQuyetDinh.toLocaleDateString("vi-VN")
                      : "Chưa có"}
                  </div>

                  <div>
                    <b>Ngày hiệu lực:</b>
                  </div>
                  <div>
                    {detail.ngayHieuLuc
                      ? detail.ngayHieuLuc.toLocaleDateString("vi-VN")
                      : "Chưa có"}
                  </div>

                  <div>
                    <b>Ngày hết hạn:</b>
                  </div>
                  <div>
                    {detail.ngayHetHan
                      ? detail.ngayHetHan.toLocaleDateString("vi-VN")
                      : "Chưa có"}
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Thông tin chi tiết bảo hiểm */}
            <div style={{ display: "grid", gap: "20px" }}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <h5 style={{ marginBottom: "10px", color: "#2c3e50" }}>
                  Chi tiết bảo hiểm
                </h5>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "250px auto",
                    gap: "15px",
                  }}
                >
                  <div>
                    <b>BHYT (Nhân viên):</b>
                  </div>
                  <div>{detail.bhyT_NV}%</div>

                  <div>
                    <b>BHYT (Doanh nghiệp):</b>
                  </div>
                  <div>{detail.bhyT_DN}%</div>

                  <div>
                    <b>BHXH (Nhân viên):</b>
                  </div>
                  <div>{detail.bhxH_NV}%</div>

                  <div>
                    <b>BHXH (Doanh nghiệp):</b>
                  </div>
                  <div>{detail.bhxH_DN}%</div>

                  <div>
                    <b>BHTN (Nhân viên):</b>
                  </div>
                  <div>{detail.bhtN_NV}%</div>

                  <div>
                    <b>BHTN (Doanh nghiệp):</b>
                  </div>
                  <div>{detail.bhtN_DN}%</div>

                  <div>
                    <b>Tổng bảo hiểm (Nhân viên):</b>
                  </div>
                  <div>{detail.tongBH_NV}%</div>

                  <div>
                    <b>Tổng bảo hiểm (Doanh nghiệp):</b>
                  </div>
                  <div>{detail.tongBH_DN}%</div>
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

export default FormViewQDBH;
