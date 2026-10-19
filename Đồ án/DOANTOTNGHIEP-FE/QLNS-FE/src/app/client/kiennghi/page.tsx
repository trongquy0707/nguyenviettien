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
import { BsPencil } from "@react-icons/all-files/bs/BsPencil";
import { FaTimes } from "@react-icons/all-files/fa/FaTimes";
import { FaArrowUp } from "@react-icons/all-files/fa/FaArrowUp";
import { FaCheck } from "@react-icons/all-files/fa/FaCheck";
import { Backdrop, CircularProgress } from "@mui/material";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import "../kiennghi/kiennghi.css";
import Cookies from "js-cookie";
import FormKienNghi from "./form/page";
import FormViewKienNghi from "./form/viewpage";

// Định nghĩa kiểu cho cột
interface Column {
  field: string;
  title: string;
  type?: "string" | "number" | "date" | "currency" | "percentage" | "status";
  format?: string;
  statusMap?: { [key: string]: string };
}

const KienNghiList: React.FC = () => {
  const [datakn, setDatakn] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit">("add");
  const [submitAction, setSubmitAction] = useState<"trinhgui" | "huytrinhgui">(
    "trinhgui"
  );
  const [openModalView, setOpenModalView] = useState(false);
  const [modalViewAction, setModalViewAction] = useState<"view">("view");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

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
    { field: "ten", title: "Người làm kiến nghị" },
    { field: "tenChucVu", title: "Tên chức vụ" },
    { field: "tenPhongBan", title: "Tên phòng ban" },
    { field: "noiDung", title: "Nội dung", type: "string" },
    {
      field: "ngayTao",
      title: "Ngày tạo",
      type: "date",
      format: "dd/MM/yyyy",
    },
  ];

  const fetchData = React.useCallback(
    async (page: number, pageSize: number, searchKey?: string) => {
      setLoading(true);
      try {
        const res = await apiService.get<{
          data: any[];
          totalItems: number;
          pageIndex: number;
          pageSize: number;
          totalPages: number;
        }>(
          `/KienNghi/GetAllKienNghiByIdUser/${idUser}?pageIndex=${page}&pageSize=${pageSize}${
            searchKey ? `&seachKey=${encodeURIComponent(searchKey)}` : ""
          }`
        );
        setDatakn(res.data?.data || []);
        setTotalPages(res.data?.totalPages || 1);
        setCurrentPage(res.data?.pageIndex || page);
        setPageSize(res.data?.pageSize || pageSize);
      } catch (err: any) {
        setError(err.message);
        toast.error(`Lỗi khi tải danh sách kiến nghị: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [idUser]
  );

  useEffect(() => {
    if (idUser !== null) {
      fetchData(currentPage, pageSize, searchKey);
    }
  }, [currentPage, pageSize, searchKey, idUser, refreshKey]);

  // Xử lý chọn tất cả
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(datakn);
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (item: any, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelected((prev) => [...new Set([...prev, item])]);
    else setSelected((prev) => prev.filter((sel) => sel.id !== item.id));
  };

  const handleAdd = () => {
    setModalAction("add");
    setSelectedItem(null);
    setOpenModal(true);
  };

  const handleEdit = async (item: any) => {
    try {
      setModalAction("edit");
      const res = await apiService.get(`/KienNghi/GetByIdKienNghi/${item.id}`);
      setSelectedItem(res.data);
      setOpenModal(true);
    } catch (error) {
      toast.error("Không tải được dữ liệu chi tiết");
    }
  };

    // Xử lý xem
  const handleView = async (item: any) => {
    try {
      setModalViewAction("view");
      const res = await apiService.get(
        `/KienNghi/GetByIdKienNghi/${item.id}`
      );
      if (res.data) {
        setSelectedItem({
          ...res.data,
          hoTen: item.ten,
          tenPhongBan: item.tenPhongBan,
          tenChucVu: item.tenChucVu,
        });
      }
      setOpenModalView(true);
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
    setLoading(true);
    try {
      for (const item of itemsToDelete) {
        await apiService.post(`/KienNghi/DeleteKienNghi/${item.id}`, {});
      }
      toast.success("Xóa thành công");
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      toast.error(`Lỗi khi xóa đơn nghỉ: ${err.message}`);
    } finally {
      setShowConfirm(false);
      setItemsToDelete([]);
      setLoading(false);
    }
  };

  // Xử lý trình gửi, hủy trình gửi đơn kiến nghị
  const handleSubmitClick = (item: any, action: "trinhgui" | "huytrinhgui") => {
    setSelectedItem(item);
    setSubmitAction(action);
    setOpenSubmitModal(true);
  };

  const confirmSubmit = async () => {
    if (!selectedItem) return;
    setLoading(true);
    try {
      const apiEndpoint =
        submitAction === "trinhgui"
          ? `/KienNghi/TrinhGuiKienNghi/${selectedItem.id}`
          : `/KienNghi/HuyTrinhGuiKienNghi/${selectedItem.id}`;
      await apiService.post(apiEndpoint, {});
      toast.success(
        submitAction === "trinhgui"
          ? "Trình gửi kiến nghị thành công"
          : "Hủy trình gửi kiến nghị thành công"
      );
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      toast.error(
        `Lỗi khi ${
          submitAction === "trinhgui" ? "trình gửi" : "hủy trình gửi"
        } kiến nghị: ${err.message}`
      );
    } finally {
      setOpenSubmitModal(false);
      setSelectedItem(null);
      setLoading(false);
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
      case "string":
        const maxLength = 80; 
        return typeof value === "string" && value.length > maxLength
          ? `${value.substring(0, maxLength)} ...`
          : value.toString();
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

  // Kiểm tra xem có mục nào trong selected có trạng thái không cho phép xóa
  const canDeleteMultiple =
    selected.length >= 2 &&
    !selected.some(
      (item) =>
        item.trangThai === 1 || item.trangThai === 2 || item.trangThai === 3
    );

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Danh sách Kiến nghị</h2>
      <div className="grid-container">
        {/* Action buttons */}
        <div className="grid-actions mb-2 d-flex justify-content-between align-items-center">
          <div>
            <Button
              variant="success"
              size="sm"
              onClick={handleAdd}
              className="me-1 btn-custom"
            >
              Thêm
            </Button>
            {canDeleteMultiple && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteClick(selected)}
                className="me-1 btn-custom"
              >
                Xóa nhiều
              </Button>
            )}
          </div>

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
                <th>
                  <Form.Check type="checkbox" onChange={handleSelectAll} />
                </th>
                <th style={{ width: "3%", textAlign: "center" }}>STT</th>
                {columns.map((col) => (
                  <th key={col.field}>{col.title}</th>
                ))}
                <th style={{ width: "11.5%", textAlign: "center" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {datakn.map((item, index) => {
                const stt = (currentPage - 1) * pageSize + index + 1;
                const isEditableOrDeletable = !(
                  item.trangThai === 1 ||
                  item.trangThai === 2 ||
                  item.trangThai === 3
                );
                return (
                  <tr key={item.id || `row_${index}`}>
                    <td style={{ textAlign: "center" }}>
                      <Form.Check
                        type="checkbox"
                        checked={selected.some((sel) => sel.id === item.id)}
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
                        {(item.trangThai === 0 ||
                          item.trangThai === 1 ||
                          item.trangThai === 2 ||
                          item.trangThai === 3 ||
                          item.trangThai === 5) && (
                          <Button
                            variant={
                              item.trangThai === 1 || item.trangThai === 2
                                ? "success"
                                : item.trangThai === 3
                                ? "danger"
                                : item.trangThai === 5
                                ? "secondary"
                                : "secondary"
                            }
                            size="sm"
                            onClick={() =>
                              item.trangThai === 0 || item.trangThai === 5
                                ? handleSubmitClick(item, "trinhgui")
                                : item.trangThai === 1
                                ? handleSubmitClick(item, "huytrinhgui")
                                : null
                            }
                            className="me-1 btn-custom"
                            title={
                              item.trangThai === 0
                                ? "Trình gửi kiến nghị"
                                : item.trangThai === 1
                                ? "Hủy trình gửi"
                                : item.trangThai === 2
                                ? "Đã duyệt"
                                : item.trangThai === 3
                                ? "Đã từ chối"
                                : "Trình gửi lại"
                            }
                            disabled={
                              item.trangThai !== 0 &&
                              item.trangThai !== 1 &&
                              item.trangThai !== 5
                            }
                          >
                            {item.trangThai === 2 ? (
                              <FaCheck />
                            ) : item.trangThai === 3 ? (
                              <FaTimes />
                            ) : (
                              <FaArrowUp />
                            )}
                          </Button>
                        )}
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleView(item)}
                          className="me-1 btn-custom"
                          title="Xem chi tiết"
                        >
                          <BsEye />
                        </Button>
                        {isEditableOrDeletable && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="me-1 btn-custom"
                            title="Chỉnh sửa"
                          >
                            <BsPencil />
                          </Button>
                        )}
                        {isEditableOrDeletable && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(item)}
                            className="btn-custom"
                            title="Xóa kiến nghị"
                          >
                            <BsTrash />
                          </Button>
                        )}
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
              ? `Bạn có chắc chắn muốn xóa ${selected.length} bản kiến nghị này?`
              : "Bạn có chắc chắn muốn xóa bản kiến nghị này?"}
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

        {/* Modal xác nhận trình gửi/hủy trình gửi */}
        <Modal show={openSubmitModal} onHide={() => setOpenSubmitModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {submitAction === "trinhgui"
                ? "Xác nhận trình gửi kiến nghị"
                : "Xác nhận hủy trình gửi kiến nghị"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {submitAction === "trinhgui"
              ? `Bạn muốn trình gửi kiến nghị của nhân viên ${
                  selectedItem?.ten || "N/A"
                }?`
              : `Bạn muốn hủy trình gửi kiến nghị của nhân viên ${
                  selectedItem?.ten || "N/A"
                }?`}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={confirmSubmit}>
              Đồng ý
            </Button>
            <Button
              variant="secondary"
              onClick={() => setOpenSubmitModal(false)}
            >
              Hủy
            </Button>
          </Modal.Footer>
        </Modal>

        <FormKienNghi
          open={openModal}
          action={modalAction}
          item={selectedItem}
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            setRefreshKey((k) => k + 1);
          }}
        />

          <FormViewKienNghi
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

export default KienNghiList;
