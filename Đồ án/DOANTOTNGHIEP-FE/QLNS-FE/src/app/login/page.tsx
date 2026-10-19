"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./login.css";
import apiService from "@/src/service/apiService";
import TextInputCommon from "@/src/components/FormControlls/TextInputCommon";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

interface FormState {
  tenDangNhap: string;
  matKhau: string;
}

interface LoginResponse {
  token: string;
  username: string;
  idPhongBan: string;
  phongBan: string;
  id: string;
  tenDangNhap: string;
  idChucVu: string;
  chucVu: string;
  permissions: string[];
  role: string[];
}

const initialForm: FormState = {
  tenDangNhap: "",
  matKhau: "",
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);
  const router = useRouter();
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowError(true);
    if (!form.tenDangNhap || !form.matKhau) {
      toast.dismiss();
      toast.error("Vui lòng điền đầy đủ thông tin");
      setShowError(true);
      return;
    }
    try {
      const response = await apiService.post<LoginResponse>("/Login/login", form);

      console.log("API Response:", response); // Debug log

      if (response.status === 200 && response.data) {
        const user = response.data;
        user.permissions = user.permissions || [];
        Cookies.set("token", user.token, { expires: 1 });
        Cookies.set("role", user.role[0] || "", { expires: 1 });
        Cookies.set("user", JSON.stringify(user), { expires: 1 });

        localStorage.setItem("user", JSON.stringify(user));

        toast.dismiss();
        toast.success("Đăng nhập thành công!");

        setTimeout(() => {
          if (user.role.includes("admin")) {
            router.push("/admin/trangchu");
          } else {
            router.push("/client/hosocanhan");
          }
        }, 300); // Tăng timeout để toast hiển thị
      } else {
        toast.dismiss();
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      toast.dismiss();
      toast.error("Có lỗi xảy ra khi đăng nhập");
    }
  };

  useEffect(() => {
    // Reset trạng thái khi vào trang
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user");
    localStorage.removeItem("user");
    setForm(initialForm);
    setShowError(false);
    setShowPassword(false);
    toast.dismiss(); // Xóa toast cũ khi vào trang
  }, []);

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header text-center">
          <img
            src="./images/logocongty2.png"
            alt="Bệnh viện K Logo"
            className="hospital-logo"
          />
          <h2 className="login-title">Đăng nhập hệ thống</h2>
          <p className="login-subtitle">Quản lý nhân sự</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group position-relative">
            <TextInputCommon
              length={100}
              lable="Tên đăng nhập"
              value={form.tenDangNhap}
              onChangeText={(text) => setForm({ ...form, tenDangNhap: text })}
              required
              placeholder="Nhập tên đăng nhập"
              showError={showError}
            />
          </div>

          <div className="form-group position-relative">
            <TextInputCommon
              length={100}
              lable="Mật khẩu"
              value={form.matKhau}
              onChangeText={(text) => setForm({ ...form, matKhau: text })}
              required
              placeholder="Nhập mật khẩu"
              secureTextEntry={!showPassword}
              showError={showError}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <button type="submit" className="btn btn-primary login-button">
            Đăng nhập
          </button>

          <div className="text-center mt-3">
            <button
              type="button"
              className="forgot-password-link"
              onClick={() => router.push("/reset-password")}
            >
              Quên mật khẩu?
            </button>
          </div>
        </form>

        <p className="copyright">
          © {new Date().getFullYear()} Công ty Cổ phần QA Garment
        </p>
      </div>
    </div>
  );
};

export default Login;