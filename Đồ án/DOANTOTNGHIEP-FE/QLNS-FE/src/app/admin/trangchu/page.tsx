"use client";
import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Pagination,
  Button,
  Dropdown,
  DropdownButton,
  Modal,
} from "react-bootstrap";
import { Backdrop, CircularProgress } from "@mui/material";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import "../trangchu/trangchu.css";
import { BsEye } from "@react-icons/all-files/bs/BsEye";
import { BsPencil } from "@react-icons/all-files/bs/BsPencil";
import { BsTrash } from "@react-icons/all-files/bs/BsTrash";
import Cookies from "js-cookie";
import FormUser from "./form/page";
import FormViewUser from "./form/viewpage";

const HSNVList: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalAction, setModalAction] = useState<"add" | "edit">("add");
  const [openModal, setOpenModal] = useState(false);
  const [openModalView, setOpenModalView] = useState(false);
  const [modalViewAction, setModalViewAction] = useState<"view">("view");
  const [itemsToDelete, setItemsToDelete] = useState<any[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const userStr = Cookies.get("user");
  const [idPhongBan, setIdPhongBan] = useState<number | null>(null);
  useEffect(() => {
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIdPhongBan(user.idPhongBan ?? null);
      } catch {
        setIdPhongBan;
      }
    }
  }, []);

  // Gọi API
  const fetchData = async (
    page: number,
    pageSize: number,
    searchKey?: string
  ) => {
    const res = await apiService.get<{
      data: any[];
      totalItems: number;
      pageIndex: number;
      pageSize: number;
      totalPages: number;
    }>(
      `/User/GetAllUserByIdPhongBan?pageIndex=${page}&pageSize=${pageSize}${
        searchKey ? `&seachKey=${encodeURIComponent(searchKey)}` : ""
      }${idPhongBan ? `&idphongban=${idPhongBan}` : ""}`
    );
    debugger;
    setEmployees(res.data?.data || []);
    setTotalPages(res.data?.totalPages || 1);
    setCurrentPage(res.data?.pageIndex || page);
    setPageSize(res.data?.pageSize || pageSize);
  };

  useEffect(() => {
    if (idPhongBan !== null) {
      fetchData(currentPage, pageSize, searchKey);
    }
  }, [currentPage, pageSize, searchKey, idPhongBan, refreshKey]);

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

  // Mở form thêm
  const handleAdd = () => {
    setModalAction("add");
    setSelectedItem(null);
    setOpenModal(true);
  };

  // Mở form sửa
  const handleEdit = async (item: any) => {
    try {
      setModalAction("edit");
      const res = await apiService.get(`/User/GetByIdUser/${item.id}`);
      setSelectedItem(res.data);
      setOpenModal(true);
    } catch {
      toast.error("Không tải được dữ liệu chi tiết");
    }
  };

  // Xử lý xem
  const handleView = async (item: any) => {
    try {
      setModalViewAction("view");
      const res = await apiService.get(`/User/GetByIdHoSoNhanVien/${item.id}`);
      if (res.data) {
        setSelectedItem({
          ...res.data,
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
    setItemsToDelete(items);
    setShowConfirm(true);
    setSelectedItem(null);
  };

  const confirmDelete = async () => {
    try {
      for (const item of itemsToDelete) {
        await apiService.post(`/User/DeleteUser/${item.id}`, {});
      }
      toast.success("Xóa thành công");
      fetchData(currentPage, pageSize, searchKey);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setShowConfirm(false);
      setItemsToDelete([]);
    }
  };

  // chọn từng dòng
  const handleSelect = (item: any, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected([...selected, item]);
    } else {
      setSelected(selected.filter((sel) => sel.id !== item.id));
    }
  };

  return (
    <div>
      <h2>Danh sách nhân viên</h2>

      {/* Action bar */}
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
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteClick(selected)}
            disabled={selected.length < 2}
            className="btn-custom"
          >
            Xóa nhiều
          </Button>
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

      <table className="employee-table">
        <tbody>
          <tr>
            <td>
              <div className="grid">
                {employees.map((emp, index) => (
                  <div className="container" key={emp.id || `emp_${index}`}>
                    <input
                      type="checkbox"
                      checked={selected.some((sel) => sel.id === emp.id)}
                      onChange={(e) => handleSelect(emp, e)}
                    />
                    <div className="imageFullname">
                      <img
                        src={emp.avartar}
                        alt="Ảnh đại diện"
                        className="hospital-logo"
                      />
                    </div>
                    <div className="container-box">
                      <div className="sohieu">
                        Số hiệu: <span className="items">{emp.soHieu}</span>
                      </div>
                      <div className="fullname">
                        Họ tên: <span className="items">{emp.hoTen}</span>
                      </div>
                      <div className="infor">
                        <div className="phongban">
                          Phòng ban:{" "}
                          <span className="items">{emp.tenPhongBan}</span>
                        </div>
                        <div className="chucvu">
                          Chức vụ:{" "}
                          <span className="items">{emp.tenChucVu}</span>
                        </div>
                      </div>
                    </div>
                    <div className="actions">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleView(emp)}
                        title="Xem chi tiết"
                      >
                        <BsEye />
                      </Button>
                      <Button
                        size="sm"
                        variant="warning"
                        style={{ marginRight: "5px" }}
                        onClick={() => handleEdit(emp)}
                        title="Sửa hồ sơ"
                      >
                        <BsPencil />
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          setItemsToDelete([emp]);
                          setShowConfirm(true);
                        }}
                        title="Xóa hồ sơ"
                      >
                        <BsTrash />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <FormUser
        open={openModal}
        action={modalAction}
        item={selectedItem}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          fetchData(currentPage, pageSize);
        }}
      />

      {/* Pagination */}
      <div className="grid-pagination-fixed">
        <div className="pagination-controls">
          <Pagination size="sm" className="pagination-custom">
            <Pagination.First
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }).map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
        <div className="pagination-dropdown">
          <DropdownButton
            id="dropdown-page-size"
            title={`${pageSize} bản ghi/trang`}
            onSelect={(eventKey) => setPageSize(Number(eventKey))}
            size="sm"
            className="btn-custom dropdown-pagination"
          >
            <Dropdown.Item eventKey="15">15 bản ghi</Dropdown.Item>
            <Dropdown.Item eventKey="30">30 bản ghi</Dropdown.Item>
            <Dropdown.Item eventKey="50">50 bản ghi</Dropdown.Item>
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

      <Modal
        show={showConfirm}
        onHide={() => {
          setShowConfirm(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {itemsToDelete.length > 1
            ? `Bạn có chắc chắn muốn xóa ${itemsToDelete.length} nhân viên này?`
            : "Bạn có chắc chắn muốn xóa nhân viên này?"}
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

      <FormViewUser
        open={openModalView}
        action={modalViewAction}
        item={selectedItem}
        onClose={() => setOpenModalView(false)}
        onSuccess={() => {
          setRefreshKey((k) => k + 1);
        }}
      />
    </div>
  );
};

export default HSNVList;
