import { Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import OrderItemResponse from "../types/order/orderItemResponse";

// Create styles
const styles = StyleSheet.create({
  // Table container remains the same
  tableContainer: {
    flexDirection: "column", // Column-wise arrangement
    justifyContent: "center",
    alignItems: "center",
    marginBottom:"10px"
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
    textAlign: "left", // Left-align the content
  },

  // Column definition: flexBasis ensures consistent width for all columns
  tableCol: {
    flexBasis: "33.33%", // Make all columns take up 1/3 of the row width
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderColor: "#007AFF",
    padding: 5,
    fontSize: 13,
  },

  // Table cell font size
  tableCell: {
    fontSize: 15,
    fontWeight: "bold",
  },
});

// Create Document Component
const PDFTable = ({ data }: { data: OrderItemResponse[] }) => (
  <Document >
    <View style={styles.tableContainer}>
      {/* Table Header */}
      <View style={styles.tableRow}>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>STT</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>Tên sản phẩm</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>Số lượng</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>Đơn giá</Text>
        </View>
        <View style={styles.tableCol}>
          <Text style={styles.tableCell}>Thành tiền</Text>
        </View>
      </View>

      {/* Table Rows */}
      {data?.map((item, index) => (
        <View key={index} style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text>{index + 1}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text>{item?.name}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text>{item?.quantity}</Text>
          </View>

          <View style={styles.tableCol}>
            <Text>{Number(item.price).toLocaleString("de-DE")}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text>{Number(item.amount).toLocaleString("de-DE")}</Text>
          </View>
        </View>
      ))}
    </View>
  </Document>
);

export default PDFTable;
