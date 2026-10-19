"use client";
import { useEffect, useState } from "react";
import { Pie, Line, Bar } from "react-chartjs-2";
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
import apiService from "@/src/service/apiService";
import dynamic from "next/dynamic";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);
import Cookies from "js-cookie";
export default function ReportCharts() {
  const [data, setData] = useState<any[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);
  const [salaryByMonth, setSalaryByMonth] = useState<any[]>([]);
  const baseColors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
  ];

  function repeatColors(count: number) {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(baseColors[i % baseColors.length]);
    }
    return colors;
  }
       const userStr = Cookies.get("user");
  const [idPhongBan, setIdPhongBan] = useState<string | null>(null);
  useEffect(() => {
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setIdPhongBan(user.idPhongBan ?? null);
      } catch {
        setIdPhongBan(null);
      }
    }
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const response: any = await apiService.get("/BaoCaoTK/GetAllBCTK");
      if (response.data) {
        setData(response?.data?.data ?? []);
      }
      let urlLine = "/BaoCaoTK/tong-luong-phong-ban";
      if (idPhongBan) {
        debugger
        urlLine += `?phongBanId=${idPhongBan}`;
      }
      console.log("Fetching line data from URL:", urlLine);
      const responseLine: any = await apiService.get(urlLine);
      if (responseLine.data) {
        setLineData(responseLine?.data ?? []);
      }
      let urlMonth = "/BaoCaoTK/Get_tong_tong-luong";
      if (idPhongBan) {
        debugger
        urlMonth += `?phongBanId=${idPhongBan}`;
      }
      console.log("Fetching salary by month from URL:", urlMonth);
      const responseMonth: any = await apiService.get(urlMonth);
      if (responseMonth.data) setSalaryByMonth(responseMonth?.data ?? []);
    };
    fetchData();
  }, [idPhongBan]);

  if (!data.length || !lineData.length) return <p>Đang tải dữ liệu...</p>;

  // Pie chart: Trung bình lương
  const salaryChart = {
    labels: data.map((d) => d.tenPhongBan),
    datasets: [
      {
        label: "Trung bình lương",
        data: data.map((d) => d.trungBinhLuong),
        backgroundColor: repeatColors(data.length),
        hoverOffset: 4,
      },
    ],
  };

  // Pie chart: Số lượng nhân viên
  const employeeChart = {
    labels: data.map((d) => d.tenPhongBan),
    datasets: [
      {
        label: "Số lượng nhân viên",
        data: data.map((d) => d.tongNhanVien),
        backgroundColor: [
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 205, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  // Line chart: biến động lương theo tháng
  const allMonths = Array.from(
    new Set(lineData.flatMap((d) => d.luongTheoThang.map((l: any) => l.thang)))
  ).sort();

  const lineChartData = {
    labels: allMonths,
    datasets: lineData.map((d, idx) => ({
      label: d.tenPhongBan,
      data: allMonths.map((m) => {
        const monthData = d.luongTheoThang.find((l: any) => l.thang === m);
        return monthData ? monthData.tongLuong : 0;
      }),
      fill: false,
      borderColor: baseColors[idx % baseColors.length],
      backgroundColor: baseColors[idx % baseColors.length].replace(
        "0.6",
        "0.3"
      ), // trong suốt
      tension: 0.3,
    })),
  };

  // Bar chart: Tổng lương toàn công ty theo tháng
  const barChartData = {
    labels: salaryByMonth.map((d) => `Tháng ${d.tenBangLuong}`),
    datasets: [
      {
        label: "Tổng lương phải trả (VNĐ)",
        data: salaryByMonth.map((d) => d.tongLuongPhaiTra),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // biến động Bảo hiểm theo tháng
  const lineChartBaoHiem = {
    labels: allMonths,
    datasets: lineData.map((d, idx) => ({
      label: d.tenPhongBan,
      data: allMonths.map((m) => {
        const monthData = d.luongTheoThang.find((l: any) => l.thang === m);
        return monthData ? monthData.tongBaoHiemPhaiDong : 0;
      }),
      fill: false,
      borderColor: baseColors[idx % baseColors.length],
      backgroundColor: baseColors[idx % baseColors.length].replace(
        "0.6",
        "0.3"
      ), // trong suốt
      tension: 0.3,
    })),
  };

  const lineChartThue = {
    labels: allMonths,
    datasets: lineData.map((d, idx) => ({
      label: d.tenPhongBan,
      data: allMonths.map((m) => {
        const monthData = d.luongTheoThang.find((l: any) => l.thang === m);
        return monthData ? monthData.tongThuePhaiDong : 0;
      }),
      fill: false,
      borderColor: baseColors[idx % baseColors.length],
      backgroundColor: baseColors[idx % baseColors.length].replace(
        "0.6",
        "0.3"
      ), // trong suốt
      tension: 0.3,
    })),
  };
  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        overflow: "auto",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginTop: "30px",
        }}
      >
        <div style={{ width: "250px", height: "250px" }}>
          <h3 style={{ textAlign: "center" }}>
            Trung bình lương từng phòng ban
          </h3>
          <Pie data={salaryChart} />
        </div>

        <div style={{ width: "250px", height: "250px" }}>
          <h3 style={{ textAlign: "center" }}>
            Số lượng nhân viên từng phòng ban
          </h3>
          <Pie data={employeeChart} />
        </div>
      </div>

      <div style={{ width: "80%", margin: "0 auto", marginTop: "100px" }}>
        <h3 style={{ textAlign: "center" }}>
          Biến động lương từng phòng ban theo tháng
        </h3>
        <Line data={lineChartData} />
      </div>
      {/* </div> */}

      {/* Biểu đồ mới: Tổng lương toàn công ty theo tháng */}
      <div style={{ width: "80%", margin: "0 auto", marginTop: "50px" }}>
        <h3 style={{ textAlign: "center" }}>
          Tổng lương toàn công ty theo tháng
        </h3>
        <Line data={barChartData} />
      </div>

      <div style={{ width: "80%", margin: "0 auto", marginTop: "50px" }}>
        <h3 style={{ textAlign: "center" }}>Tổng Bảo hiểm theo tháng</h3>
        <Line data={lineChartBaoHiem} />
      </div>

      {/* Biểu đồ mới: Tổng thuế toàn công ty theo tháng */}
      <div style={{ width: "80%", margin: "0 auto", marginTop: "50px" }}>
        <h3 style={{ textAlign: "center" }}>Tổng Thuế theo tháng</h3>
        <Line data={lineChartThue} />
      </div>
    </div>
  );
}
