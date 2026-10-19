"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import Cookies from "js-cookie";
import apiService from "@/src/service/apiService";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default function ReportCharts() {
  const [salaryByMonth, setSalaryByMonth] = useState<any[]>([]);
  const [hoTen, setHoTen] = useState<string | null>(null);

  const baseColors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
  ];

  // ✅ Chỉ đọc cookie trong useEffect để tránh hydration lỗi
  useEffect(() => {
    const userStr = Cookies.get("user");
    if (!userStr) return;

    try {
      const user = JSON.parse(userStr);
      setHoTen(user.username ?? "Người dùng");

      if (user.id) {
        apiService
          .get(`/BaoCaoTK/Get_tong_tong-luong-by-user/${user.id}`)
          .then((res: any) => {
            setSalaryByMonth(res.data ?? []);
          })
          .catch((err) => console.error("Lỗi khi gọi API:", err));
      }
    } catch (err) {
      console.error("Parse user cookie failed", err);
    }
  }, []);

  // ✅ Khi chưa có dữ liệu
  if (!salaryByMonth.length) {
    return <p style={{ textAlign: "center" }}>Đang tải dữ liệu...</p>;
  }

  // ✅ Tạo nhãn tháng
  const allMonths = salaryByMonth.map((d) => `Tháng ${d.thang}/${d.nam}`);

  // ✅ Cấu hình dữ liệu cho Line chart
  const lineChartData = {
    labels: allMonths,
    datasets: [
      {
        label: `Tổng lương của ${hoTen}`,
        data: salaryByMonth.map((d) => d.tongLuongPhaiTra),
        borderColor: baseColors[0],
        backgroundColor: baseColors[0].replace("0.6", "0.3"),
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const lineChartThue = {
    labels: allMonths,
    datasets: [
      {
        label: `Tổng lương của ${hoTen}`,
        data: salaryByMonth.map((d) => d.tongThuePhaiDong),
        borderColor: baseColors[1],
        backgroundColor: baseColors[1].replace("0.6", "0.3"),
        fill: false,
        tension: 0.3,
      },
    ],
  };
 const lineChartBaoHiem = {
    labels: allMonths,
    datasets: [
      {
        label: `Tổng lương của ${hoTen}`,
        data: salaryByMonth.map((d) => d.tongBaoHiemPhaiDong),
        borderColor: baseColors[2],
        backgroundColor: baseColors[2].replace("0.6", "0.3"),
        fill: false,
        tension: 0.3,
      },
    ],
  };
  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        overflow: "auto",
      }}
    >
      <div style={{ width: "80%", margin: "0 auto", marginTop: "20px" }}>
        <h3 style={{ textAlign: "center" }}>
          Biến động lương của {hoTen} theo tháng
        </h3>
        <Line data={lineChartData} />
      </div>
       <div style={{ width: "80%", margin: "0 auto", marginTop: "20px" }}>
        <h3 style={{ textAlign: "center" }}>
          Biến động Bảo Hiểm phải đóng của {hoTen} theo tháng
        </h3>
        <Line data={lineChartBaoHiem} />
      </div>
      <div style={{ width: "80%", margin: "0 auto", marginTop: "20px" }}>
        <h3 style={{ textAlign: "center" }}>
          Biến động Thuế phải đóng của {hoTen} theo tháng
        </h3>
        <Line data={lineChartThue} />
      </div>
    </div>
  );
}
