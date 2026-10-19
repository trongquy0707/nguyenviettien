"use client";
import Link from "next/link";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Sidebar() {
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
    <aside className="cb-sidebar">
      <div className="sidebar-title">QUẢN LÝ DANH MỤC</div>
      <ul>
        {permissions.includes("phongban.GetAllPhongBan") && (
          <li>
            <Link href="/admin/phongban">Phòng ban</Link>
          </li>
        )}
        {permissions.includes("chucvu.GetAllChucVu") && (
          <li>
            <Link href="/admin/chucvu">Chức vụ</Link>
          </li>
        )}
        {/* <li>
          <Link href="/admin/chucvu">Chức vụ</Link>
        </li> */}
        {/* {permissions.includes("KhenThuongKyLuat.GetAllKTKL") && (

          <li>
            <Link href="/admin/khenthuongkyluat">Khen thưởng kỷ luật</Link>
          </li>
        )} */}
        {permissions.includes("thue.GetAllThue") && (
          <li>
            <Link href="/admin/thue">Thuế</Link>
          </li>
        )}
        {permissions.includes("quyetdinhbh.GetAllQuyetDinhBH") && (
          <li>
            <Link href="/admin/quyetdinhbaohiem">Quy định bảo hiểm</Link>
          </li>
        )}
        {permissions.includes("hesolt.GetAllHeSoLT") && (
        <li>
          <Link href="/admin/hesolamthem">Hệ số làm thêm</Link>
        </li>
        )}
        {permissions.includes("phucap.GetAllPhuCap") && (
        <li>
          <Link href="/admin/phucap">Phụ cấp</Link>
        </li>
        )}
        {permissions.includes("kiennghi.GetAllKienNghiByIdPhongBan") && (
        <li>
          <Link href="/admin/kiennghi">Kiến nghị</Link>
        </li>
        )}
        {/* {permissions.includes("baocaotk.GetAllBCTK") && (
        <li>
          <Link href="/admin/baocaothongke">Báo cáo thống kê</Link>
        </li>
        )} */}
        <li>
          <Link href="/admin/baocaothongke">Báo cáo thống kê</Link>
        </li>
          {/* <li>
          <Link href="/admin/baocaothongke">Báo cáo thống kê</Link>
        </li> */}
        {permissions.includes("chucvupermission.GetAllChucVuPermission") && (
        <li>
          <Link href="/admin/phanquyen">Phân quyền</Link>
        </li>
        )}
      </ul>
    </aside>
  );
}
