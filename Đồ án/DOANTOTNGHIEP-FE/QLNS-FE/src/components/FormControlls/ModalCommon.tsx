// CommonModal.tsx
"user client"
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

interface CommonModalProps {
  open: boolean;
  title?: string;
  onClose: () => void;
  onSubmitClose: () => void;
  onSubmitNew?: () => void;
  children?: React.ReactNode; // nhận input từ bên ngoài
  size?:string; //lg-md-sm-xl-xs
}

const CommonModal: React.FC<CommonModalProps> = ({ open, title, onClose, onSubmitClose,onSubmitNew, children }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={(e) => { e.preventDefault(); onSubmitClose(); }}>
          {children}
        </form>
      </DialogContent>
      <DialogActions>
    
        <Button onClick={onSubmitClose} variant="contained" color="info">Lưu & đóng</Button>
        <Button onClick={onSubmitNew} variant="contained" color="success">Lưu & thêm mới</Button>
        <Button onClick={onClose} color="error" variant="contained">Hủy</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommonModal;
