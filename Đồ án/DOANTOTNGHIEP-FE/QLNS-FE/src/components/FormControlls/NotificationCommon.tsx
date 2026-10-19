"use client";

import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const CommonToast = {
  success: (message: string) =>
    toast.success(message, { position: "top-right" }),
  error: (message: string) =>
    toast.error(message, { position: "top-right" }),
  warning: (message: string) =>
    toast.warning(message, { position: "top-right" }),
  info: (message: string) =>
    toast.info(message, { position: "top-right" }),
};

// ToastContainer nên để ở layout hoặc App để render 1 lần duy nhất
export const ToastContaineCommon = () => (
  <ToastContainer
    position="top-right"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick={false}
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
    transition={Bounce}
  />
);
