"use client";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";

interface PhanQuyen {
  id: string;
  chucVuId: string;
  tenQuyens: string[];
  tenChucVu: string;
}

interface FormViewPhanQuyenProps {
  open: boolean;
  action: "view";
  item?: PhanQuyen;
  onClose: () => void;
  onSuccess: () => void;
}

const FormViewPhanQuyen: React.FC<FormViewPhanQuyenProps> = ({
  open,
  action,
  item,
  onClose,
}) => {
  const [detail, setDetail] = useState<PhanQuyen | null>(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && action === "view" && item) {
      setLoading(true);
      setDetail({
        id: item.id,
        chucVuId: item.chucVuId,
        tenQuyens: Array.isArray(item.tenQuyens) ? item.tenQuyens : [],
        tenChucVu: item.tenChucVu,
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
          Thông tin phân quyền của chức vụ: {detail?.tenChucVu}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
        {loading ? (
          <div style={{ textAlign: "center" }}>Đang tải dữ liệu...</div>
        ) : detail ? (
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <h5 style={{ marginBottom: "15px", color: "#2c3e50" }}>
              Danh sách quyền được cấp
            </h5>

            {detail.tenQuyens.length > 0 ? (
              <Table bordered hover responsive>
                <thead style={{ backgroundColor: "#f1f1f1" }}>
                  <tr>
                    <th style={{ width: "50px", textAlign: "center" }}>STT</th>
                    <th>Mã quyền</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.tenQuyens.map((p, index) => (
                    <tr key={p}>
                      <td style={{ textAlign: "center" }}>{index + 1}</td>
                      <td>{p}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p style={{ textAlign: "center", color: "#7f8c8d" }}>
                Chức vụ này chưa được cấp quyền nào.
              </p>
            )}
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

export default FormViewPhanQuyen;
