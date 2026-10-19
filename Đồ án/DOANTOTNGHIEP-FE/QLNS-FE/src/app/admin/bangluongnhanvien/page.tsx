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
import { BsTrash } from "@react-icons/all-files/bs/BsTrash";
import { Backdrop, CircularProgress } from "@mui/material";
import { FaCalculator } from "@react-icons/all-files/fa/FaCalculator";
import { FaFileExcel } from "@react-icons/all-files/fa/FaFileExcel";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import "../bangluongnhanvien/bangluongnhanvien.css";
import Cookies from "js-cookie";
import FormBangLuongNhanVien from "./form/page";

// Định nghĩa kiểu cho cột
interface Column {
  field: string;
  title: string;
  type?: "string" | "number" | "date" | "currency" | "percentage" | "status";
  format?: string;
  statusMap?: { [key: string]: string };
}

const BangLuongNhanVienList: React.FC = () => {
  const [datablnv, setDatablnv] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<any[]>([]);
  const [showConfirmCalc, setShowConfirmCalc] = useState(false);
  const [showConfirmExport, setShowConfirmExport] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  // focus vào ô search khi render
  useLayoutEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  useEffect(() => {
    if (itemsToDelete.length <= 0) {
      setSelected([]);
    }
  }, [itemsToDelete]);

  // Lấy idPhongBan từ cookie
  const userStr = Cookies.get("user");
  const [idPhongBan, setIdPhongBan] = useState<string | null>(null);
  useEffect(() => {
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIdPhongBan(user.idPhongBan ?? null);
      } catch {
        setIdPhongBan(null);
      }
    }
  }, []);

  // Cấu hình cột
  const columns: Column[] = [
    { field: "tenBangLuong", title: "Tên bảng lương" },
    { field: "ten", title: "Họ tên" },
    {
      field: "tienThue",
      title: "Tiền thuế",
      type: "currency",
      format: "###,### VND",
    },
    {
      field: "mucDongBaoHiem",
      title: "Tiền bảo hiểm",
      type: "currency",
      format: "###,### VND",
    },
    {
      field: "tongLuong",
      title: "Tổng lương",
      type: "currency",
      format: "###,### VND",
    },
    {
      field: "ngayNhanLuong",
      title: "Ngày nhận lương",
      type: "date",
      format: "dd/MM/yyyy",
    },
  ];

  const fetchData = React.useCallback(
    async (page: number, pageSize: number, searchKey?: string) => {
      let tenBangLuong = "";
      if (selectedMonth && selectedYear) {
        tenBangLuong = `${selectedMonth.padStart(2, "0")}/${selectedYear}`;
      } else if (selectedMonth) {
        tenBangLuong = `${selectedMonth.padStart(2, "0")}`;
      } else if (selectedYear) {
        tenBangLuong = `/${selectedYear}`;
      }
      const res = await apiService.get<{
        data: any[];
        totalItems: number;
        pageIndex: number;
        pageSize: number;
        totalPages: number;
      }>(
        `/BangLuongNhanVien/GetAllBangLuongNhanVienByIdPhongBan?pageIndex=${page}&pageSize=${pageSize}${
          searchKey ? `&seachKey=${encodeURIComponent(searchKey)}` : ""
        }${idPhongBan ? `&idPhongBan=${idPhongBan}` : ""}${
          tenBangLuong
            ? `&tenBangLuong=${encodeURIComponent(tenBangLuong)}`
            : ""
        }`
      );
      setDatablnv(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
      setCurrentPage(res.data?.pageIndex || page);
      setPageSize(res.data?.pageSize || pageSize);
    },
    [idPhongBan, selectedMonth, selectedYear]
  );

  useEffect(() => {
    if (idPhongBan !== null) {
      fetchData(currentPage, pageSize, searchKey);
    }
  }, [
    currentPage,
    pageSize,
    searchKey,
    idPhongBan,
    refreshKey,
    selectedMonth,
    selectedYear,
  ]);

  // Helper function
  const getUniqueKey = (item: any) => {
    return `${item.hoTen}_${item.tenBangLuong}`;
  };

  // Xử lý chọn tất cả
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(datablnv);
    } else {
      setSelected([]);
    }
  };

  // Xử lý chọn từng dòng
  const handleSelect = (item: any, e: React.ChangeEvent<HTMLInputElement>) => {
    const uniqueKey = getUniqueKey(item);
    if (e.target.checked) {
      setSelected((prev) =>
        [...prev, item].filter(
          (sel, index, self) =>
            index ===
            self.findIndex((s) => getUniqueKey(s) === getUniqueKey(sel))
        )
      );
    } else {
      setSelected((prev) =>
        prev.filter((sel) => getUniqueKey(sel) !== uniqueKey)
      );
    }
  };

  // Xử lý xem
  const handleView = async (item: any) => {
    try {
      setModalAction("edit");
      const res = await apiService.get(
        `/BangLuongNhanVien/GetBangLuongById/${item.id}`
      );
      if (res.data) {
        setSelectedItem({
          ...res.data,
          hoTen: item.ten,
        });
      }
      setOpenModal(true);
    } catch (error) {
      toast.error("Không tải được dữ liệu lương nhân viên");
    }
  };

  const handleDeleteClick = (items: any[]) => {
    const itemsToProcess = Array.isArray(items) ? items : [items];
    setItemsToDelete(itemsToProcess);
    setShowConfirm(true);
    setSelectedItem(null);
  };

  const confirmDelete = async () => {
    try {
      for (const item of itemsToDelete) {
        await apiService.post(
          `/BangLuongNhanVien/DeleteBangLuongNhanVien/${item.id}`,
          {}
        );
      }
      toast.success("Xóa thành công");
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setShowConfirm(false);
      setItemsToDelete([]);
    }
  };

  // Xử lý tính all lương
  const handleCalculateAllSalary = () => {
    setShowConfirmCalc(true); // Mở modal xác nhận
  };

  const confirmCalculateAllSalary = async () => {
    try {
      setLoading(true);
      let tenBangLuong = "";

      if (!selectedMonth || !selectedYear) {
        toast.error("Vui lòng chọn tháng và năm để tính lương!");
        return;
      }
      if (selectedMonth && selectedYear) {
        tenBangLuong = `${selectedMonth.padStart(2, "0")}/${selectedYear}`;
      } else if (selectedMonth) {
        tenBangLuong = `${selectedMonth.padStart(2, "0")}`;
      } else if (selectedYear) {
        tenBangLuong = `/${selectedYear}`;
      }
      const res = await apiService.post(
        `/BangLuongNhanVien/TinhAllBangLuongNhanVien?tenBangLuong=${encodeURIComponent(
          tenBangLuong
        )}`
      );
      if (res.status === 200) {
        toast.success("Tính lương thành công");
        setRefreshKey((k) => k + 1); // Làm mới danh sách
      } else {
        throw new Error(res.error || "Tính lương thất bại");
      }
    } catch (err: any) {
      toast.error("Lỗi khi tính lương: " + (err.message || "Không xác định"));
    } finally {
      setLoading(false);
      setShowConfirmCalc(false); // Đóng modal
    }
  };

  const handleExportExcel = () => {
    setShowConfirmExport(true);
  };

  const confirmExportExcel = async () => {
    try {
      setLoading(true);
      let tenBangLuong = "";

      if (!selectedMonth || !selectedYear) {
        toast.error("Vui lòng chọn tháng và năm để xuất file!");
        return;
      }

      if (selectedMonth && selectedYear) {
        tenBangLuong = `${selectedMonth.padStart(2, "0")}/${selectedYear}`;
      } else if (selectedMonth) {
        tenBangLuong = `${selectedMonth.padStart(2, "0")}`;
      } else if (selectedYear) {
        tenBangLuong = `/${selectedYear}`;
      }

      const res = await apiService.getWithFile(
        `/BangLuongNhanVien/ExportSalarybyMonth?tenBangLuong=${encodeURIComponent(
          tenBangLuong
        )}`
      );

      if (!res.data) {
        toast.error(res.error || "Xuất file thất bại");
        return;
      }
      const fileName = `BangLuongNhanVien_${selectedMonth}-${selectedYear}.xlsx`;
      const url = window.URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Xuất file thành công");
    } catch (err: any) {
      toast.error(err.message || "Lỗi khi xuất file");
    } finally {
      setLoading(false);
      setShowConfirmExport(false); // Đóng modal xuất file
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
    setCurrentPage(1); // Reset về trang 1
    fetchData(1, size, searchKey); // Cập nhật dữ liệu với pageSize mới
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
  const [permissions, setPermissions] = useState<string[]>([]);
    useEffect(() => {
    // Lấy user từ cookie
    const userStr = Cookies.get("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setPermissions(user.permissions || []);
      } catch {
        setPermissions([]);
      }
    }
  }, []);
  return (
    <div>
      <h2>Danh sách Bảng lương nhân viên</h2>
      <div className="grid-container">
        {/* Action buttons */}
        <div className="grid-actions mb-2 d-flex justify-content-between align-items-center">
          <div>
            {permissions.includes("Bangluongnhanvien.TinhAllBangLuongNhanVien") && (
      <Button
              variant="success"
              size="sm"
              onClick={handleCalculateAllSalary}
              className="me-1 btn-custom"
              title="Tính toàn bộ lương"
              style={{
                width: "40px",
                height: "25.6px",
                fontSize: "15px",
                paddingTop: "1px",
                backgroundColor: "#1E88E5",
                borderColor: "#1E88E5",
                color: "white",
              }}
            >
              <FaCalculator />
            </Button>
        )}
            
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDeleteClick(selected)}
              disabled={selected.length < 2}
              className="me-1 btn-custom"
            >
              Xóa nhiều
            </Button>
            <Button
              variant="info"
              size="sm"
              onClick={handleExportExcel}
              className="btn-custom"
              title="Xuất file Excel"
              style={{
                width: "40px",
                height: "25.6px",
                fontSize: "16px",
                paddingTop: "1px",
                backgroundColor: "#217346",
                borderColor: "#217346",
                color: "white",
              }}
            >
              <FaFileExcel />
            </Button>
          </div>

          {/* Search */}
          <div className="d-flex align-items-center">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="form-control month-select me-2"
              style={{
                width: "100px",
                height: "28px",
                fontSize: "14px",
                padding: "3px 12px",
              }}
            >
              <option value="">Chọn tháng</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={(i + 1).toString()}>
                  Tháng {i + 1}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="form-control year-select me-2"
              style={{
                width: "100px",
                height: "28px",
                fontSize: "14px",
                padding: "3px 13px",
              }}
            >
              <option value="">Chọn năm</option>
              {Array.from({ length: 16 }, (_, i) => {
                const year = 2020 + i;
                return (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                );
              })}
            </select>
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
                <th>
                  <Form.Check type="checkbox" onChange={handleSelectAll} />
                </th>
                <th style={{ width: "3%", textAlign: "center" }}>STT</th>
                {columns.map((col) => (
                  <th key={col.field}>{col.title}</th>
                ))}
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {datablnv.map((item, index) => {
                const stt = (currentPage - 1) * pageSize + index + 1;
                return (
                  <tr key={item.id || `row_${index}`}>
                    <td style={{ textAlign: "center" }}>
                      <Form.Check
                        type="checkbox"
                        checked={selected.some(
                          (sel) => getUniqueKey(sel) === getUniqueKey(item)
                        )}
                        onChange={(e) => handleSelect(item, e)}
                      />
                    </td>
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
                        >
                          <BsEye />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(item)}
                          className="btn-custom"
                        >
                          <BsTrash />
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

        {/* Modal xác nhận xóa */}
        <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận xóa</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selected.length > 1
              ? `Bạn có chắc chắn muốn xóa ${selected.length} bảng lương nhân viên này?`
              : "Bạn có chắc chắn muốn xóa bảng lương nhân viên này?"}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setShowConfirm(false);
                setItemsToDelete([]);
              }}
            >
              Hủy
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal xác nhận tính all lương */}
        <Modal show={showConfirmCalc} onHide={() => setShowConfirmCalc(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận tính lương</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedMonth && selectedYear ? (
              <>
                Bạn có chắc chắn muốn tính lương tháng {selectedMonth}/
                {selectedYear} cho tất cả nhân viên?
              </>
            ) : (
              <>Bạn có chắc chắn muốn tính lương cho tất cả nhân viên?</>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmCalc(false)}
            >
              Hủy
            </Button>
            <Button variant="success" onClick={confirmCalculateAllSalary}>
              Đồng ý
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal xác nhận export file excel */}
        <Modal
          show={showConfirmExport}
          onHide={() => setShowConfirmExport(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận Export bảng lương</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedMonth && selectedYear ? (
              <>
                Bạn có chắc chắn muốn Export bảng lương tháng {selectedMonth}/
                {selectedYear} ra file Excel?
              </>
            ) : (
              <>Bạn có chắc chắn muốn Export bảng lương ra file excel ?</>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmExport(false)}
            >
              Hủy
            </Button>
            <Button variant="primary" onClick={confirmExportExcel}>
              Đồng ý
            </Button>
          </Modal.Footer>
        </Modal>

        <FormBangLuongNhanVien
          open={openModal}
          action={modalAction}
          item={selectedItem}
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            fetchData(currentPage, pageSize);
          }}
        />
      </div>
    </div>
  );
};

export default BangLuongNhanVienList;
