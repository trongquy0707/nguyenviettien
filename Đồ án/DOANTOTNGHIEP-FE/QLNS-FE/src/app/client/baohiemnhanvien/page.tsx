"use client";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Table,
  Pagination,
  Form,
  Button,
  Dropdown,
  DropdownButton,
  Modal,
} from "react-bootstrap";
import { BsEye } from "@react-icons/all-files/bs/BsEye";
import { Backdrop, CircularProgress } from "@mui/material";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import "../baohiemnhanvien/baohiemnhanvien.css";
import Cookies from "js-cookie";
import FormViewBHNV from "./form/page";

// Định nghĩa kiểu cho cột
interface Column {
  field: string;
  title: string;
  type?: "string" | "number" | "date" | "currency" | "percentage" | "status";
  format?: string;
  statusMap?: { [key: string]: string };
}

const BHNVList: React.FC = () => {
  const [databhnv, setDatabhnv] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState<string>("");
  const [openModalView, setOpenModalView] = useState(false);
  const [modalViewAction, setModalViewAction] = useState<"view">("view");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // focus vào ô search khi render
  useLayoutEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  // Lấy UserId từ cookie
  const userStr = Cookies.get("user");
  const [idUser, setIdUser] = useState<string | null>(null);
  const [hoTen, setHoTen] = useState<string | null>(null);
  useEffect(() => {
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIdUser(user.id ?? null);
        setHoTen(user.username ?? null);
      } catch {
        setIdUser(null);
      }
    }
  }, []);

  // Cấu hình cột
  const columns: Column[] = [
    { field: "soBaoHiem", title: "Số bảo hiểm"},
    { field: "ten", title: "Họ tên"},
    { field: "mucDong", title: "Mức đóng", type: "currency", format: "###,### VND" },
    { field: "ngayDong", title: "Ngày đóng", type: "date", format: "dd/MM/yyyy" },
  ];

  const fetchData = React.useCallback(
    async (page: number, pageSize: number, searchKey?: string) => {
      const res = await apiService.get<{
        data: any[];
        totalItems: number;
        pageIndex: number;
        pageSize: number;
        totalPages: number;
      }>(
        `/BaoHiemNhanVien/GetByUserIdBaoHiemNhanVien/${idUser}?pageIndex=${page}&pageSize=${pageSize}${
          searchKey ? `&seachKey=${encodeURIComponent(searchKey)}` : ""
        }`
      );
      setDatabhnv(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      setCurrentPage(res.data?.pageIndex || page);
      setPageSize(res.data?.pageSize || pageSize);
    },
    [idUser]
  );

  useEffect(() => {
    if (idUser !== null) {
      fetchData(currentPage, pageSize, searchKey);
    }
  }, [currentPage, pageSize, searchKey, idUser, refreshKey]);

  // Xử lý xem
  const handleView = async (item: any) => {
    try {
      setModalViewAction("view");
      const res = await apiService.get(
        `/BaoHiemNhanVien/GetByIdBaoHiemNhanVien/${item.id}`
      );
      if (res.data) {
        setSelectedItem({
          ...res.data,
          hoTen: item.ten,
        });
      }
      setOpenModalView(true);
    } catch (error) {
      toast.error("Không tải được dữ liệu phụ cấp");
    }
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    fetchData(1, size, searchKey);
  };

  const handleFirstPage = () => handlePageChange(1);
  const handlePreviousPage = () =>
    currentPage > 1 && handlePageChange(currentPage - 1);
  const handleNextPage = () =>
    currentPage < totalPages && handlePageChange(currentPage + 1);

  // Định dạng giá trị
  const formatValue = (
    value: any,
    type?: string,
    format?: string,
    statusMap?: { [key: string]: string }
  ) => {
    if (value === null || value === undefined) return "";
    switch (type) {
      case "date":
        return new Date(value).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      case "number":
        return Number(value).toLocaleString("vi-VN");
      case "currency":
        return format
          ? `${format.replace(
              "###,###",
              Number(value).toLocaleString("vi-VN")
            )}`
          : `${Number(value).toLocaleString("vi-VN")} VND`;
      case "percentage":
        if (isNaN(Number(value))) return "N/A";
        const percentageValue = Number(value) * 100;
        if (format && format.includes("%")) {
          const decimalPlaces = 1;
          return `${percentageValue.toLocaleString("vi-VN", {
            minimumFractionDigits: decimalPlaces,
            maximumFractionDigits: decimalPlaces,
          })} %`;
        }
        return `${percentageValue.toLocaleString("vi-VN")} %`;
      case "status":
        const mapKey =
          typeof value === "boolean" ? value.toString() : value.toString();
        if (statusMap && statusMap.hasOwnProperty(mapKey)) {
          return statusMap[mapKey];
        }
        return "Chưa xác định";
      default:
        return value.toString();
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Danh sách Bảo hiểm nhân viên</h2>
      <div className="grid-container">
        {/* Action buttons */}
        <div className="grid-actions mb-2 d-flex justify-content-between align-items-center">
          <div></div>

          {/* Search */}
          <div className="d-flex align-items-center">
            <input
              ref={inputRef}
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              placeholder="Tìm kiếm theo tên..."
              className="form-control me-2"
              style={{ width: "180px", height: "28px", fontSize: "14px" }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: "3%", textAlign: "center" }}>STT</th>
                {columns.map((col) => (
                  <th key={col.field}>{col.title}</th>
                ))}
                <th style={{ width: "6%", textAlign: "center" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {databhnv.map((item, index) => {
                const stt = (currentPage - 1) * pageSize + index + 1;
                return (
                  <tr key={item.id || `row_${index}`}>
                    <td style={{ textAlign: "center" }}>{stt}</td>
                    {columns.map((col) => (
                      <td key={col.field} style={{ textAlign: "left" }}>
                        {formatValue(
                          item[col.field],
                          col.type,
                          col.format,
                          col.statusMap
                        )}
                      </td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleView(item)}
                          className="me-1 btn-custom"
                          title="Xem chi tiết"
                        >
                          <BsEye />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="grid-pagination-fixed">
          <div className="pagination-controls">
            <Pagination size="sm" className="pagination-custom">
              <Pagination.First
                onClick={handleFirstPage}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              />
              {Array.from({ length: totalPages }).map((_, i) => (
                <Pagination.Item
                  key={i + 1}
                  active={i + 1 === currentPage}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
          <div className="pagination-dropdown">
            <DropdownButton
              id="dropdown-page-size"
              title={`${pageSize} bản ghi/trang`}
              onSelect={(eventKey) => handlePageSizeChange(Number(eventKey))}
              size="sm"
              className="btn-custom dropdown-pagination"
            >
              <Dropdown.Item eventKey="10">10 bản ghi</Dropdown.Item>
              <Dropdown.Item eventKey="15">15 bản ghi</Dropdown.Item>
              <Dropdown.Item eventKey="30">30 bản ghi</Dropdown.Item>
            </DropdownButton>
          </div>
        </div>

        {loading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}

        <FormViewBHNV
          open={openModalView}
          action={modalViewAction}
          item={selectedItem}
          onClose={() => setOpenModalView(false)}
          onSuccess={() => {
            setRefreshKey((k) => k + 1);
          }}
        />
      </div>
    </div>
  );
};

export default BHNVList;
