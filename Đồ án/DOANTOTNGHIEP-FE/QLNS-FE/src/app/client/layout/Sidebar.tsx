import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="cb-sidebar">
      <div className="sidebar-title">TRUY CẬP NHANH</div>
      <ul>
         <li>
          <Link href="/client/donnghi">Đăng ký nghỉ phép</Link>
        </li>
         <li>
          <Link href="/client/kiennghi">Kiến nghị</Link>
        </li>
                 <li>
          <Link href="/client/biendongluong">Thống kê</Link>
        </li>
           <li>
          <Link href="/client/doimatkhau">Đổi mật khẩu</Link>
        </li>

      </ul>
    </aside>
  );
}