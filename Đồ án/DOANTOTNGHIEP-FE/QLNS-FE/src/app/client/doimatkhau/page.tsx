"use client";
import React, { useState, useEffect } from "react";
import { Button, Card, Form, Alert, Spinner } from "react-bootstrap";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import "../doimatkhau/doimatkhau.css";

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

const initialForm: ChangePasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const DoiMatKhau: React.FC = () => {
  const [form, setForm] = useState<ChangePasswordForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const userStr = Cookies.get("user");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserId(user.id || null);
      } catch {
        setUserId(null);
        toast.error("Không thể lấy thông tin người dùng");
      }
    } else {
      toast.error("Vui lòng đăng nhập để đổi mật khẩu");
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setShowError(false);
  };

  const validateForm = (): boolean => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let isValid = true;

    if (!form.currentPassword.trim()) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
      isValid = false;
    }

    if (!form.newPassword.trim()) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
      isValid = false;
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
      isValid = false;
    } else if (form.newPassword === form.currentPassword) {
      newErrors.newPassword = "Mật khẩu mới không được giống mật khẩu hiện tại";
      isValid = false;
    }

    if (!form.confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới";
      isValid = false;
    } else if (form.confirmPassword !== form.newPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }

    setErrors(newErrors);
    setShowError(!isValid);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!userId) {
      toast.error(
        "Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại."
      );
      return;
    }

    setLoading(true);
    try {
      const request = {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      };

      const response = await apiService.post<ChangePasswordResponse>(
        `/User/ChangePassword/${userId}`,
        request
      );

      if (response.data && response.data.success) {
        toast.success(response.data.message || "Đổi mật khẩu thành công!");
        setForm(initialForm);
        setErrors({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowError(false);
      } else {
        toast.error(response.data?.message || "Mật khẩu hiện tại không đúng.");
        setErrors((prev) => ({
          ...prev,
          currentPassword: "Mật khẩu hiện tại không đúng",
        }));
      }
    } catch (error: any) {
      console.error("Lỗi đổi mật khẩu:", error);
      if (error.response?.status === 400) {
        toast.error("Mật khẩu hiện tại không đúng hoặc yêu cầu không hợp lệ");
      } else if (error.response?.status === 404) {
        toast.error("Không tìm thấy thông tin người dùng");
      } else {
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowError(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="change-password-page-wrapper">
      <div className="change-password-content-area">
        <div className="change-password-card">
          <Card.Header>
            <h3>Đổi mật khẩu</h3>
            <p>Nhập mật khẩu hiện tại và mật khẩu mới</p>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Mật khẩu hiện tại <span className="text-danger">*</span>
                </Form.Label>
                <div className="password-input-group">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    className={`form-control ${
                      errors.currentPassword ? "is-invalid" : ""
                    }`}
                    name="currentPassword"
                    value={form.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu hiện tại"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    onMouseEnter={() => setShowCurrentPassword(true)}
                    onMouseLeave={() => setShowCurrentPassword(false)}
                  >
                    <i
                      className={
                        showCurrentPassword ? "fas fa-eye-slash" : "fas fa-eye"
                      }
                    ></i>
                  </button>
                  {errors.currentPassword && (
                    <div className="invalid-feedback">
                      {errors.currentPassword}
                    </div>
                  )}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Mật khẩu mới <span className="text-danger">*</span>
                </Form.Label>
                <div className="password-input-group">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className={`form-control ${
                      errors.newPassword ? "is-invalid" : ""
                    }`}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                    disabled={loading}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    onMouseEnter={() => setShowNewPassword(true)}
                    onMouseLeave={() => setShowNewPassword(false)}
                  >
                    <i
                      className={
                        showNewPassword ? "fas fa-eye-slash" : "fas fa-eye"
                      }
                    ></i>
                  </button>
                  {errors.newPassword && (
                    <div className="invalid-feedback">{errors.newPassword}</div>
                  )}
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Xác nhận mật khẩu mới <span className="text-danger">*</span>
                </Form.Label>
                <div className="password-input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Nhập lại mật khẩu mới"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    onMouseEnter={() => setShowConfirmPassword(true)}
                    onMouseLeave={() => setShowConfirmPassword(false)}
                  >
                    <i
                      className={
                        showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"
                      }
                    ></i>
                  </button>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
              </Form.Group>

              {showError && (
                <Alert variant="danger" className="mb-3">
                  Vui lòng kiểm tra lại thông tin nhập vào
                </Alert>
              )}

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <Button
                  variant="secondary"
                  onClick={handleReset}
                  className="me-md-2"
                  disabled={loading}
                >
                  Đặt lại
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Đang xử lý...
                    </>
                  ) : (
                    "Đổi mật khẩu"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </div>
      </div>
    </div>
  );
};

export default DoiMatKhau;
