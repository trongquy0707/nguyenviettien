"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Header() {
  const router = useRouter();

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login"); // quay về trang login
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const confirmLogout = () => {
    toast.info(
      <div>
        <p>Bạn có chắc chắn muốn đăng xuất?</p>
        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={() => {
              toast.dismiss(); // tắt toast
              logout();
            }}
            className="btn btn-primary"
          >
            Xác nhận
          </button>
          <button
            style={{ marginLeft: "5px" }}
            type="button"
            onClick={() => toast.dismiss()}
            className="btn btn-secondary"
          >
            Hủy
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false, // không tự đóng
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  const [fullname, setFullName] = useState<string>("");
  const [chucvu, setchucvu] = useState<string>("");
  const [phongban, setphongban] = useState<string>("");
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
    const userStr = Cookies.get("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setFullName(user.username || "");
        setchucvu(user.chucVu || "");
        setphongban(user.phongBan || "");
        setPermissions(user.permissions || []);
      } catch {
        setFullName("");
      }
    }
  }, []);

  return (
    <>
      {/* Toast container */}
      <ToastContainer />

      {/* Top Header */}
      <div className="top-header">
        <div className="left-header">
          <div className="logo">
            <img src="/images/logocongty2.png" alt="Logo Công Ty QA Garment" />
          </div>
          <div className="text-block">
            <p className="ministry">CÔNG TY CỔ PHẦN QA GARMENT</p>
            <p className="software-name">
              <i>Phần mềm quản lý nhân sự</i>
            </p>
          </div>
        </div>
        <div className="right-header">
          <a href="#" style={{ color: "black" }}>
            <i className="fa fa-user" style={{ marginRight: "5px" }}></i>{" "}
            {fullname}
          </a>
          <span className="divider">|</span>
          <a href="#" style={{ color: "black" }}>
            <i className="fa fa-briefcase" style={{ marginRight: "5px" }}></i>{" "}
            {chucvu}
          </a>
          <span className="divider">|</span>
          {phongban && phongban.trim() !== "" && (
            <>
              <a href="#" style={{ color: "black" }}>
                <i className="fa fa-sitemap" style={{ marginRight: "5px" }}></i>{" "}
                {phongban}
              </a>
              <span className="divider">|</span>
            </>
          )}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              confirmLogout();
            }}
          >
            <i className="fa fa-sign-out"></i> Đăng xuất
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <nav className="top-nav">
          <ul>
            <li>
              <Link href="/client/hosocanhan">HỒ SƠ CÁ NHÂN</Link>
            </li>
            <li>
              <Link href="/client/khenthuongkyluat">KHEN THƯỞNG KỶ LUẬT</Link>
            </li>
              <li>
              <Link href="/client/hopdong">HỢP ĐỒNG LAO ĐỘNG</Link>
            </li>
            <li>
              <Link href="/client/luongcoban">LƯƠNG CƠ BẢN</Link>
            </li>
            <li>
              <Link href="/client/phucap">PHỤ CẤP</Link>
            </li>
            <li>
              <Link href="/client/bangchamcong">THÔNG TIN CHẤM CÔNG</Link>
            </li>
            <li>
              <Link href="/client/bangluongnhanvien">BẢNG LƯƠNG</Link>
            </li>
            <li>
              <Link href="/client/baohiemnhanvien">BẢO HIỂM NHÂN VIÊN</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
