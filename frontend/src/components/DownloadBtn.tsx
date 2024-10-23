import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx/xlsx.mjs";
import { exportEmployeeService } from "../services/employee.service";
import { useQuery } from "@tanstack/react-query";
const DownloadBtn = ({ fileName }: { fileName?: string }) => {
  const exportFile = async (): Promise<any> => {
    try {
      const response = await exportEmployeeService();
      console.log(response);
      if (response.message !== "success") {
        throw new Error("Error fetching employees");
      }
      return response.data as any;
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to be handled by useQuery
    }
  };
  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["employees"],
    queryFn: () => exportFile(), // No need for async/await here
  });
  if (isLoading || isFetching) {
    return <p>Loading...</p>;
  }
  if (isError) {
    return <p>Error: {error.message}</p>;
  }
  return (
    <FileDownloadIcon
      onClick={() => {
        const datas = data?.length ? data : [];
        const worksheet = XLSX.utils.json_to_sheet(datas);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, fileName ? `${fileName}.xlsx` : "data.xlsx");
      }}
    />
  );
};

export default DownloadBtn;
