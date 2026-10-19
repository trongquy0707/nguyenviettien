"use client";
import React, { useState, useEffect } from "react";
import apiService from "@/src/service/apiService";
import GridCommon, { Column } from "@/src/components/GridView/GridCommon";
import FormHSLT from "./form/page";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";

const HSLTList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [pageIndex, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns: Column[] = [
    { field: "ten", title: "Tên hệ số" },
    { field: "heSo", title: "Hệ số", type: "number"},
    { field: "ngayQuyetDinh", title: "Ngày quyết định", type: "date", format: "dd/MM/yyyy" },
    // { field: "maHeSo", title: "Mã hệ số", type: "number"},
  ];

  const fetchData = async (
    page: number,
    pageSize: number,
    searchKey?: string
  ) => {
    const response = await apiService.get<{
      data: any[];
      totalItems: number;
      pageIndex: number;
      pageSize: number;
      totalPages: number;
    }>(
      `/HeSoLT/GetAllHeSoLT?pageIndex=${page}&pageSize=${pageSize}${
        searchKey ? `&seachKey=${encodeURIComponent(searchKey)}` : ""
      }`

    );
    return {
      items: response.data?.data || [],
      totalItems: response.data?.totalItems || 0,
      pageIndex: response.data?.pageIndex || page,
      pageSize: response.data?.pageSize || pageSize,
      totalPages: response.data?.totalPages || 1,
    };
  };

  const handleAdd = () => {
    setModalAction("add");
    setSelectedItem(null);
    setOpenModal(true);
  };

  const handleEdit = async (item: any) => {
  try {
    setModalAction("edit");
    const res = await apiService.get(`/HeSoLT/GetHeSoLTById/${item.id}`);
    setSelectedItem(res.data); 
    setOpenModal(true);
  } catch (error) {
    toast.error("Không tải được dữ liệu chi tiết");
  }
};
  const [showConfirm, setShowConfirm] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState<any[]>([]);
  const handleDeleteClick = (items: any[]) => {
    setItemsToDelete(items);
    setShowConfirm(true);
    setSelectedItem(null);
  };

  const confirmDelete = async () => {
    try {
      for (const item of itemsToDelete) {
        await apiService.post(`/HeSoLT/DeleteHSLT/${item.id}`, {});
      }
      toast.success("Xóa thành công");
      setRefreshKey((k) => k + 1);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setShowConfirm(false);
      setItemsToDelete([])
    }
  };

  return (
    <div>
      <h2>Danh sách Hệ số làm thêm</h2>
      <GridCommon
        columns={columns}
        fetchData={fetchData}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        itemsToDelete={itemsToDelete}
        refreshKey={refreshKey}
      />

      <FormHSLT
        open={openModal}
        action={modalAction}
        item={selectedItem}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {
          setRefreshKey((k) => k + 1);
        }}
      />

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
            ? `Bạn có chắc chắn muốn xóa ${itemsToDelete.length} hệ số này?`
            : "Bạn có chắc chắn muốn xóa hệ số này?"}
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
    </div>
  );
};

export default HSLTList;

 