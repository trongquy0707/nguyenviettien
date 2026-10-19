"use client";
import { useRouter } from "next/navigation";
import "./unauthorized.css";

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-box">
        <h1>🚫</h1>
        <h1>Truy cập bị từ chối</h1>
        <p>Bạn không có quyền truy cập vào trang này.</p>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
