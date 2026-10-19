"use client";
import React, { useState, useEffect } from "react";
import apiService from "@/src/service/apiService";
import GridCommon, { Column } from "@/src/components/GridView/GridCommon";
import FormThue from "./form/page";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";

const ThueList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [pageIndex, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  

  const columns: Column[] = [
    { field: "bac", title: "Bậc thuế"},
    { field: "tyLeThue", title: "Tỷ lệ thuế", type: "percentage", format: "0 %" },
    { field: "thuNhapToiThieu", title: "Thu nhập tối thiểu", type: "currency", format: "###,### VND" },
    { field: "thuNhapToiDa", title: "Thu nhập tối đa", type: "currency", format: "###,### VND" },
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
      `/Thue/GetAllThue?pageIndex=${page}&pageSize=${pageSize}${
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

  const handleEdit = (item: any) => {
    setModalAction("edit");
    setSelectedItem(item);
    setOpenModal(true);
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
        await apiService.post(`/Thue/DeleteThue/${item.id}`, {});
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
      <h2>Danh sách Thuế</h2>
      <GridCommon
        columns={columns}
        fetchData={fetchData}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        itemsToDelete={itemsToDelete}
        refreshKey={refreshKey} 
      />

      <FormThue
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
            ? `Bạn có chắc chắn muốn xóa ${itemsToDelete.length} bậc thuế?`
            : "Bạn có chắc chắn muốn xóa bậc thuế này?"}
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

export default ThueList;
 