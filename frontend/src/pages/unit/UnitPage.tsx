import { useQuery } from "@tanstack/react-query";
import { getUnitsService } from "../../services/unit.service";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import UnitResponse from "../../types/unit/unitResponse";
export default function UnitPage() {
  const getUnits = async () => {
    try {
      const response = await getUnitsService();
      console.log(response);
      if (response.message !== "success") {
        throw new Error("Error fetching units");
      }
      return response.data as any;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["units"],
    queryFn: () => getUnits(),
    refetchOnWindowFocus: false,
  });
  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
 const columns = ["Mã đơn vị tính", "Tên đơn vị tính"];
  return (
    <TableContainer
      component={Paper}
      sx={{ width: "100%", backgroundColor: "white" }}
    >
      <Table aria-label="custom pagination table">
        <TableHead sx={{ backgroundColor: "gray" }}>
          <TableRow>
            {columns.map((column: string) => (
              <TableCell
                key={column}
                align={column === "Tên đơn vị tính" ? "left" : "center"}
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  fontSize: 16,
                }}
              >
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data !== undefined && data.length > 0 ? (
            data.map((row: UnitResponse) => (
              <TableRow hover key={row.id} >
                  <TableCell align={"center"}>{row.id}</TableCell>
                <TableCell align={"left"}>{row.name}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    
  );
}
