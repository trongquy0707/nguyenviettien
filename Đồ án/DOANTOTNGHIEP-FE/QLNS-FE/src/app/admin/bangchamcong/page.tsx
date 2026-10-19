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
import { FaFileImport } from "@react-icons/all-files/fa/FaFileImport";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import "../bangchamcong/bangchamcong.css";
import Cookies from "js-cookie";
import FormBangChamCong from "./form/page";

// Định nghĩa kiểu cho cột
interface Column {
  field: string;
  title: string;
  type?: "string" | "number" | "date" | "currency" | "percentage" | "status";
  format?: string;
  statusMap?: { [key: string]: string };
}

const ChamCongList: React.FC = () => {
  const [datachamcong, setDatachamcong] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<any[]>([]);
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
    { field: "thangChamCong", title: "Tháng chấm công" },
    { field: "hoTen", title: "Họ tên" },
    { field: "tongNgayCong", title: "Tổng ngày công", type: "number" },
    { field: "tongGioTangCa", title: "Tổng giờ tăng ca", type: "number" },
    { field: "tongDiMuon", title: "Tổng ngày đi muộn", type: "number" },
  ];

  const fetchData = async (
    page: number,
    pageSize: number,
    searchKey?: string
  ) => {
    setLoading(true);
    try {
      let thangChamCong = "";
      if (selectedMonth && selectedYear) {
        thangChamCong = `${selectedMonth.padStart(2, "0")}/${selectedYear}`; // "06/2024"
      } else if (selectedMonth) {
        thangChamCong = `${selectedMonth.padStart(2, "0")}`; // "06"
      } else if (selectedYear) {
        thangChamCong = `/${selectedYear}`; // "/2024"
      }

      const res = await apiService.get<{
        data: any[];
        totalItems: number;
        pageIndex: number;
        pageSize: number;
        totalPages: number;
      }>(
        `/BangChamCong/GetTongChamCongAllNhanVien?pageIndex=${page}&pageSize=${pageSize}${
          searchKey ? `&seachKey=${encodeURIComponent(searchKey)}` : ""
        }${idPhongBan ? `&idPhongBan=${idPhongBan}` : ""}${
          thangChamCong
            ? `&thangChamCong=${encodeURIComponent(thangChamCong)}`
            : ""
        }`
      );
      console.log("API Response:", res.data);
      setDatachamcong(res.data?.data || []);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      setError("Lỗi khi tải dữ liệu: " + (err as Error).message);
      toast.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idPhongBan !== null) {
      fetchData(currentPage, pageSize, searchKey);
    }
  }, [idPhongBan, refreshKey, selectedMonth, selectedYear, searchKey]);

  // Helper function
  const getUniqueKey = (item: any) => {
    return `${item.hoTen}_${item.thangChamCong}`;
  };

  // Xử lý chọn tất cả
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(datachamcong);
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

  // Xử lý sửa
  const handleView = async (item: any) => {
    try {
      setModalAction("edit");
      const thangChamCong = item.thangChamCong;
      const res = await apiService.get(
        `/BangChamCong/GetChamCongByUserId/${
          item.userID
        }?thangChamCong=${encodeURIComponent(thangChamCong)}`
      );
      setSelectedItem(res.data);
      setOpenModal(true);
    } catch (error) {
      toast.error("Không tải được dữ liệu chi tiết");
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
          `/BangChamCong/DeleteChamCongNhanVien/${item.userID}`,
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

  // Xử lý thay đổi trang
  const handlePageChange = async (page: number) => {
    if (page >= 1) {
      setCurrentPage(page);
      await fetchData(page, pageSize, searchKey);
    }
  };

  const handlePageSizeChange = async (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    await fetchData(1, size, searchKey);
  };

  const handleFirstPage = () => handlePageChange(1);
  const handlePreviousPage = () =>
    currentPage > 1 && handlePageChange(currentPage - 1);
  const handleNextPage = () => handlePageChange(currentPage + 1);
  const handleLastPage = () => handlePageChange(totalPages);

  // Xử lý import file
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setLoading(true);
      apiService
        .postWithFile("/BangChamCong/import", formData)
        .then((res) => {
          if (res.status === 200 && res.data) {
            toast.success("Import thành công");
            fetchData(currentPage, pageSize, searchKey);
          } else {
            throw new Error(res.error || "Import thất bại");
          }
        })
        .catch((err) => {
          toast.error(
            "Lỗi khi import file: " + (err.message || "Không xác định")
          );
          console.error("Lỗi:", err);
        })
        .finally(() => setLoading(false));
    }
  };

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
  const [permissions, setPermissions] = useState<string[]>([]);  useEffect(() => {
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
      <h2>Danh sách Thông tin chấm công</h2>
      <div className="grid-container">
        {/* Action buttons */}
        <div className="grid-actions mb-2 d-flex justify-content-between align-items-center">
          <div>
  {permissions.includes("BangChamCong.Importfile") && (
    <>
      <label
        htmlFor="import-file"
        className="btn btn-primary btn-sm me-1 btn-custom"
        title="Nhập dữ liệu từ Excel"
        style={{
          width: "40px",
          height: "25.3px",
          fontSize: "15px",
          padding: "2px",
        }}
      >
        <FaFileImport />
        <input
          id="import-file"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleImportFile}
          style={{ display: "none" }}
        />
      </label>

      <Button
        variant="danger"
        size="sm"
        onClick={() => handleDeleteClick(selected)}
        disabled={selected.length < 2}
        className="btn-custom"
      >
        Xóa nhiều
      </Button>
    </>
  )}
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
              {datachamcong.map((item, index) => {
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
              {Array.from({ length: totalPages }, (_, i) => (
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
                onClick={handleLastPage}
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
              <Dropdown.Item eventKey="50">50 bản ghi</Dropdown.Item>
              <Dropdown.Item eventKey="100">100 bản ghi</Dropdown.Item>
              <Dropdown.Item eventKey="150">150 bản ghi</Dropdown.Item>
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
              ? `Bạn có chắc chắn muốn xóa ${selected.length} thông tin chấm công này?`
              : "Bạn có chắc chắn muốn xóa thông tin chấm công này?"}
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

        <FormBangChamCong
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

export default ChamCongList;
