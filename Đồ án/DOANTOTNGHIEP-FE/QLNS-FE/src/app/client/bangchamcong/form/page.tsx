"use client";
import React, { useState, useEffect } from "react";
import CommonModal from "@/src/components/FormControlls/ModalCommon";
import TextInputCommon from "@/src/components/FormControlls/TextInputCommon";
import DateCommon from "@/src/components/FormControlls/DateCommon";
import RadioGroupCommon from "@/src/components/FormControlls/RadioCommon";
import {Modal, Table } from "react-bootstrap";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";


interface BangChamCong {
  ID: string;
  userId: string;
  tenDangNhap: string;
  hoTen: string;
  thangChamCong: string;
  ngayCong: Date | null;
  gioVao: string | null;
  gioRa: string | null;
  diMuon: boolean;
  soGioTangCa: string;
}

const initialForm: BangChamCong = {
  ID: "",
  userId: "",
  tenDangNhap: "",
  hoTen: "",
  thangChamCong: "",
  ngayCong: null,
  gioVao: null,
  gioRa: null,
  diMuon: false,
  soGioTangCa: "",
};

interface FormBangChamCongProps {
  open: boolean;
  action: "view";
  item?: any; // Mảng 30 bản ghi từ API
  onClose: () => void;
  onSuccess: () => void;
}

const FormViewBangChamCong: React.FC<FormBangChamCongProps> = ({
  open,
  action,
  item,
  onClose,
  onSuccess,
}) => {
  const [details, setDetails] = useState<BangChamCong[]>([]);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && action === "view" && item && Array.isArray(item)) {
      setLoading(true);
      const mappedDetails = item.map((d: any) => ({
        ID: d.ID || "",
        userId: d.userID ? String(d.UserID) : "",
        tenDangNhap: d.tenDangNhap || "",
        hoTen: d.hoTen || "",
        thangChamCong: d.thangChamCong || "",
        ngayCong: d.ngayCong ? new Date(d.ngayCong) : null,
        gioVao: d.gioVao ? d.gioVao.toString().substring(0, 5) : null,
        gioRa: d.gioRa ? d.gioRa.toString().substring(0, 5) : null,
        diMuon: d.diMuon || false,
        soGioTangCa: d.soGioTangCa?.toString() || "",
      }));
      setDetails(mappedDetails);
      setLoading(false);
    } else {
      setDetails([initialForm]); 
    }
  }, [action, item, open]);

  return (
    <Modal show={open} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
         Danh sách chấm công tháng{" "}
        {details.length > 0 ? details[0].thangChamCong : "Không xác định"} của{" "}
        {details.length > 0 ? details[0].hoTen : "Nhân viên"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>STT</th>
                <th>Ngày công</th>
                <th>Giờ vào</th>
                <th>Giờ ra</th>
                <th>Đi muộn</th>
                <th>Số giờ tăng ca</th>
              </tr>
            </thead>
            <tbody>
              {details.map((detail, index) => (
                <tr key={detail.ID || index}>
                  <td>{index + 1}</td>
                  <td>
                    {detail.ngayCong
                      ? detail.ngayCong.toLocaleDateString("vi-VN")
                      : "Chưa có"}
                  </td>
                  <td>{detail.gioVao || "Chưa có"}</td>
                  <td>{detail.gioRa || "Chưa có"}</td>
                  <td>{detail.diMuon ? "Có" : "Không"}</td>
                  <td>{detail.soGioTangCa || "0"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default FormViewBangChamCong;