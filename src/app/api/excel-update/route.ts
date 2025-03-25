import {
  addMultipleCurtains,
  deleteCurtains,
  getCurtains,
} from "@/lib/actions/curtains";
import { processExcelData } from "@/lib/filter-excel";
import { filterCompareArrays } from "@/lib/utils";
import axios from "axios";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export const PUT = async () => {
  try {
    const response = await axios.get(
      "https://decor-web.s3.us-east-2.amazonaws.com/catalogo_web.xlsx",
      { responseType: "arraybuffer" }
    );

    const workbook = XLSX.read(response.data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName!];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet!);

    const filteredData = await processExcelData(jsonData);

    // Obtener datos existentes
    const existingCurtains = await getCurtains();

    // Cortinas
    const changedOrNewCurtains = filterCompareArrays(
      existingCurtains.data,
      filteredData.curtains
    );

    const newCurtainIds = new Set(
      filteredData.curtains.map((curtain) => curtain.id)
    );

    const curtainsToDelete = existingCurtains.data.filter(
      (curtain) => !newCurtainIds.has(curtain.id)
    );

    // console.log("=============== Cortinas ===============");
    // console.log("Actualizar:", changedOrNewCurtains.length);
    // console.log("Eliminar:", curtainsToDelete.length);
    // console.log("========================================");

    if (curtainsToDelete.length > 0) {
      await deleteCurtains(curtainsToDelete.map((curtain) => curtain.id));
    }

    if (changedOrNewCurtains.length > 0) {
      await addMultipleCurtains(changedOrNewCurtains);
    }

    return NextResponse.json({
      updatedCurtains: changedOrNewCurtains,
    });
  } catch (error) {
    console.error("API request failed:", error);
    return NextResponse.error();
  }
};
