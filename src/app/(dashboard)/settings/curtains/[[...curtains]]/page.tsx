"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import ExcelForm from "../_components/excel-form";
import { Button } from "@/components/custom/button";
import { toast } from "sonner";
import { LoadingDialog } from "@/components/loading-dialog";
import { User } from "@/db/schema";
import AdminAlert from "@/components/admin-alert";

const CurtainsPage = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.put("/api/excel-update");

      const resData = response.data;

      return resData;
    } catch (error) {
      console.error(error);
      toast.error("Error al subir el archivo.");
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const handleGetUser = async () => {
    try {
      const response = await axios.get(`/api/users`);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  if (user?.roleId !== "0") {
    return <AdminAlert />;
  }

  return (
    <div className="w-full flex flex-col">
      <ExcelForm loading={loading} setLoading={setLoading} />
      <Button
        className="w-full mt-5"
        onClick={handleUpdate}
        loading={loading}
        disabled={loading}
      >
        Actualizar
        <span className="sr-only">Subir archivo a S3</span>
      </Button>
      <LoadingDialog open={loading} />
    </div>
  );
};

export default CurtainsPage;
