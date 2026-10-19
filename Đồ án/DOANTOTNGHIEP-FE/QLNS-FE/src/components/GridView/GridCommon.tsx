import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Table,
  Pagination,
  Form,
  Button,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { BsPencil } from "@react-icons/all-files/bs/BsPencil";
import { BsTrash } from "@react-icons/all-files/bs/BsTrash";
import { Backdrop, CircularProgress } from "@mui/material";

// Định nghĩa kiểu cho cột
export interface Column {
  field: string;
  title: string;
  type?: "string" | "number" | "date" | "currency" | "percentage"| "status";
  format?: string;
  statusMap?: { [key: string]: string };
}

// Định nghĩa kiểu cho dữ liệu API
export interface PaginationResponse {
  items: any[];
  totalItems: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

// Định nghĩa kiểu cho props
interface GridCommonProps {
  columns: Column[];
  itemsToDelete: any[];
  fetchData: (
    page: number,
    pageSize: number,
    searchKey?: string
  ) => Promise<PaginationResponse>;
  onAdd?: () => void;
  onEdit?: (selected: any) => void;
  onDelete?: (selected: any[]) => void;
  refreshKey?: string | number; 
}

const GridCommon: React.FC<GridCommonProps> = ({
  columns,
  fetchData,
  onAdd,
  onEdit,
  onDelete,
  itemsToDelete,
  refreshKey,
}) => {
  const [data, setData] = useState<PaginationResponse>({
    items: [],
    totalItems: 0,
    pageIndex: 1,
    pageSize: 15,
    totalPages: 1,
  });

  const [selected, setSelected] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKey, setSearchKey] = useState<string>("");

  const inputRef = useRef<HTMLInputElement | null>(null);

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

  // gọi API mỗi khi currentPage, pageSize, searchKey, refreshKey thay đổi
  useEffect(() => {
    const fetchDataAsync = async () => {
      setLoading(true);
      try {
        const response = await fetchData(currentPage, pageSize, searchKey);
        setData(response);
        setCurrentPage(response.pageIndex);
        setPageSize(response.pageSize);
      } catch (err) {
        setError("Lỗi khi lấy dữ liệu từ server");
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAsync();
  }, [fetchData, currentPage, pageSize, searchKey, refreshKey]);


  // chọn tất cả
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(data.items);
    } else {
      setSelected([]);
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

  // gọi onEdit khi bấm nút sửa
  const handleEdit = (item: any) => {
    if (onEdit) onEdit(item);
  };


  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= data.totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleFirstPage = () => handlePageChange(1);
  const handlePreviousPage = () => currentPage > 1 && handlePageChange(currentPage - 1);
  const handleNextPage = () => currentPage < data.totalPages && handlePageChange(currentPage + 1);


  const formatValue = (value: any, type?: string, format?: string, statusMap?: { [key: number]: string }) => {
    if (value === null || value === undefined) return "";

    switch (type) {
       case "string":
        const maxLength = 90; 
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
        ? `${format.replace("###,###", Number(value).toLocaleString("vi-VN"))}`
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
      const mapKey = typeof value === "boolean" ? value.toString() : value.toString();
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
    <div className="grid-container">
      {/* Action buttons */}
      <div className="grid-actions mb-2 d-flex justify-content-between align-items-center">
        <div>
          {onAdd && (
            <Button
              variant="success"
              size="sm"
              onClick={onAdd}
              className="me-1 btn-custom"
            >
              Thêm
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete && onDelete(selected)}
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
            {data.items.map((item, index) => {
              const stt = (data.pageIndex - 1) * data.pageSize + index + 1;
              return (
                <tr key={item.id}>
                  <td style={{ textAlign: "center" }}>
                    <Form.Check
                      type="checkbox"
                      checked={selected.some((sel) => sel.id === item.id)}
                      onChange={(e) => handleSelect(item, e)}
                    />
                  </td>

                  <td style={{ textAlign: "center" }}>{stt}</td>
                  {columns.map((col) => (
                    <td
                      key={col.field}
                      style={{ textAlign: "left" }}
                    >
                      {formatValue(item[col.field], col.type, col.format, col.statusMap)}

                    </td>
                  ))}
                  <td>
                    <div className="action-buttons">
                      {onEdit && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEdit(item)}
                          className="me-1 btn-custom"
                        >
                          <BsPencil />
                        </Button>
                      )}

                      {onDelete && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDelete([item])}
                          className="btn-custom"
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
            {Array.from({ length: data.totalPages }).map((_, i) => (
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
              disabled={currentPage === data.totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(data.totalPages)}
              disabled={currentPage === data.totalPages}
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
            <Dropdown.Item eventKey="5">5 bản ghi</Dropdown.Item>
            <Dropdown.Item eventKey="10">10 bản ghi</Dropdown.Item>
            <Dropdown.Item eventKey="15">15 bản ghi</Dropdown.Item>
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
    </div>
  );
};

export default GridCommon;
