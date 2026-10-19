"use client";
import React, { useState, useEffect } from "react";
import apiService from "@/src/service/apiService";
import GridCommon, { Column } from "@/src/components/GridView/GridCommon";
import FormChucVu from "./form/page";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import { withPermission } from "@/src/utils/withPermission";

const ChucVuList: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const [modalAction, setModalAction] = useState<"add" | "edit">("add");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [pageIndex, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns: Column[] = [
    { field: "tenChucVu", title: "Tên chức vụ"},
    { field: "moTa", title: "Mô tả", type: "string" },
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
      `/ChucVu/GetAllChucVu?pageIndex=${page}&pageSize=${pageSize}${
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
    console.log("items::", items);
    setItemsToDelete(items);
    setShowConfirm(true);
    setSelectedItem(null);
  };

  const confirmDelete = async () => {
    try {
      for (const item of itemsToDelete) {
        await apiService.post(`/ChucVu/DeleteChucVu/${item.id}`, {});
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

  return (
    <div>
      <h2>Danh sách Chức vụ</h2>
      <GridCommon
        columns={columns}
        fetchData={fetchData}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        itemsToDelete={itemsToDelete}
        refreshKey={refreshKey} 
      />

      <FormChucVu
        open={openModal}
        action={modalAction}
        item={selectedItem}
        onClose={() => setOpenModal(false)}
        onSuccess={() => {  setRefreshKey((k) => k + 1);}}/>

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
            ? `Bạn có chắc chắn muốn xóa ${itemsToDelete.length} chức vụ?`
            : "Bạn có chắc chắn muốn xóa chức vụ này?"}
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

export default ChucVuList;
// export default withPermission(ChucVuList, ["chucvu.GetAllChucVu"]);
