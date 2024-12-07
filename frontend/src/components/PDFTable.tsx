import { Text, View, StyleSheet } from "@react-pdf/renderer";
import OrderItemResponse from "../types/order/orderItemResponse";

// Create styles
const styles = StyleSheet.create({
  // Table container remains the same
  tableContainer: {
    flexDirection: "column", // Column-wise arrangement
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10px",
    marginHorizontal: "40px",
  },

  // Header row style to center the header content
  tableHeaderRow: {
    flexDirection: "row", // Row-wise arrangement
    width: "100%", // Full width of the table
    textAlign: "center", // Center the text in the header
    justifyContent: "center", // Center the entire row
    backgroundColor: "#f0f0f0", // Optional: add background color for header
  },

  // Table row for content with left-aligned text
  tableRow: {
    flexDirection: "row", // Row-wise arrangement
    width: "100%", // Full width of the table
  },

  // Column definition: flexBasis ensures consistent width for all columns
  tableCol: {
    // width: "100%",
    borderBottomWidth: 1,
    borderColor: "#000",
    borderBottomStyle: "dashed",
    padding: 5,
    fontSize: 14,
  },

  // Table cell font size
  tableCell: {
    fontSize: 16,
    fontWeight: "medium",
  },
});

// Create Document Component
const PDFTable = ({ data }: { data: OrderItemResponse[] }) => (
  // <Document>
  <View style={styles.tableContainer}>
    {/* Table Header */}
    <View style={styles.tableRow}>
      <View style={[styles.tableCol, { flex: 3 }]}>
        <Text style={[styles.tableCell, {}]}>Mặt hàng</Text>
      </View>
      <View style={[styles.tableCol, { flex: 1 }]}>
        <Text style={[styles.tableCell, {}]}>Đơn giá</Text>
      </View>
      <View style={[styles.tableCol, { flex: 0.5 }]}>
        <Text style={[styles.tableCell, { textAlign: "center" }]}>SL</Text>
      </View>
      <View style={[styles.tableCol, { flex: 0.5 }]}>
        <Text style={[styles.tableCell, {}]}>T.Tiền</Text>
      </View>
    </View>

    {/* Table Rows */}
    {data?.map((item, index) => (
      <View key={index} style={styles.tableRow}>
        <View style={[styles.tableCol, { flex: 3 }]}>
          <Text>{item?.name}</Text>
        </View>

        <View style={[styles.tableCol, { flex: 1 }]}>
          <Text>{Number(item.price).toLocaleString("de-DE")}</Text>
        </View>

        <View style={[styles.tableCol, { flex: 0.5 }]}>
          <Text style={{ textAlign: "center" }}>{item?.quantity}</Text>
        </View>

        <View style={[styles.tableCol, { flex: 0.5 }]}>
          <Text>{Number(item.amount).toLocaleString("de-DE")}</Text>
        </View>
      </View>
    ))}
  </View>
  // </Document>
);

export default PDFTable;
