"use client";
import React, { useState, useEffect } from "react";
import CommonModal from "@/src/components/FormControlls/ModalCommon";
import TextInputCommon, { TextAreaCommon } from "@/src/components/FormControlls/TextInputCommon";
import apiService from "@/src/service/apiService";
import { toast } from "react-toastify";
import { it } from "node:test";

interface FormState {
  id: string;
  bac: string;
  tyLeThue: string;
  khoangGiamTru: string;
  thuNhapToiDa: string;
  thuNhapToiThieu: string;
}

const initialForm: FormState = {
  id: "",
  bac: "",
  tyLeThue:  "",
  khoangGiamTru: "",
  thuNhapToiDa:  "",
  thuNhapToiThieu:  "",
}

interface FormThueProps {
  open: boolean;
  action: "add" | "edit";
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const FormThue: React.FC<FormThueProps> = ({ open, action, item, onClose, onSuccess }) => {
  const [form, setForm] = useState<FormState>(initialForm);
  const [showError, setShowError] = useState(false);

  // load dữ liệu khi edit
  useEffect(() => {
    if (action === "edit" && item) {
      setForm({
        id: item.id,
        bac: item.bac,
        tyLeThue: item.tyLeThue,
        thuNhapToiDa: item.thuNhapToiDa,
        thuNhapToiThieu: item.thuNhapToiThieu,
        khoangGiamTru: item.khoangGiamTru,
      });
    } else {
      setForm(initialForm);
    }
  }, [action, item, open]);

  const handleSubmit = async () => {
    try {
      const payload = {
      id: form.id || undefined,
      bac: form.bac ? parseInt(form.bac, 10) : null,
      tyLeThue: form.tyLeThue ? parseFloat(form.tyLeThue) : null,
      khoangGiamTru: form.khoangGiamTru ? parseFloat(form.khoangGiamTru) : null,
      thuNhapToiDa: form.thuNhapToiDa ? parseFloat(form.thuNhapToiDa) : null,
      thuNhapToiThieu: form.thuNhapToiThieu ? parseFloat(form.thuNhapToiThieu) : null,
    };
      let res;
      if (action === "edit") {
        res = await apiService.post(`/Thue/UpdateThue`, payload);
      } else {
        const { id, ...createPayload  } = payload;
        res = await apiService.post(`/Thue/CreateThue`, createPayload );
      }
      if (!res.error) {
        toast.success(`${action === "edit" ? "Cập nhật" : "Thêm mới"} thành công`);
        onSuccess();
      } else {
        toast.error(`${action === "edit" ? "Cập nhật" : "Thêm mới"} thất bại`);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

const handleSubmitClose = () => {
    if (!form.bac || !form.tyLeThue || !form.thuNhapToiThieu || !form.thuNhapToiDa) {
      setShowError(true);
      return;
    }
    handleSubmit();
    onClose();
  };
 const handleSubmitNews = () => {
    if (!form.bac || !form.tyLeThue || !form.thuNhapToiThieu || !form.thuNhapToiDa) {
      setShowError(true);
      return;
    }
    handleSubmit();
    setForm(initialForm);
    setShowError(false);
  };

  return (
    <CommonModal
      open={open}
      title={action === "edit" ? "Sửa bậc thuê" : "Thêm bậc thuế"}
      onClose={onClose}
      onSubmitClose={handleSubmitClose}
      onSubmitNew={handleSubmitNews}
    >
      <TextInputCommon
            length={100}
            lable="Bậc thuế"
            value={form.bac}
            onChangeText={(text) => setForm({ ...form, bac: text })}
            required
            placeholder="Nhập bậc thuế"
            showError={showError}
      />

       <TextInputCommon
            length={100}
            lable="Tỷ lệ thuế"
            value={form.tyLeThue}
            onChangeText={(text) => setForm({ ...form, tyLeThue: text})}
            required
            placeholder="Nhập tỷ lệ thuế"
            showError={showError}
      />

       <TextInputCommon
            length={100}
            lable="Thu nhập tối thiểu"
            value={form.thuNhapToiThieu}
            onChangeText={(text) => setForm({ ...form, thuNhapToiThieu: text})}
            required
            placeholder="Nhập thu nhập tối thiểu"
            showError={showError}
      />

       <TextInputCommon
            length={100}
            lable="Thu nhập tối đa"
            value={form.thuNhapToiDa}
            onChangeText={(text) => setForm({ ...form, thuNhapToiDa: text})}
            required
            placeholder="Nhập thu nhập tối đa"
            showError={showError}
      />

       <TextInputCommon
            length={100}
            lable="Khoảng giảm trừ"
            value={form.khoangGiamTru}
            onChangeText={(text) => setForm({ ...form, khoangGiamTru: text})}
            placeholder="Nhập khoảng giảm trừ"
      />

    </CommonModal>
  );
};

export default FormThue;
