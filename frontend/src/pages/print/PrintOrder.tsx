import { Page, Text, View, Document, StyleSheet, PDFViewer, Font, Image } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import PDFTable from "../../components/PDFTable";
import source from "../../assets/fonts/Roboto-Regular.ttf";

// Register the custom font
Font.register({
  family: "Roboto",
  src: source,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#DCDCE1",
  },
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  description: {
    width: "60%",
  },
  xyz: {
    width: "40%",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  body: {
    fontFamily: "Roboto",
  },
  header: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 60,
  },
  top: {
    flexDirection: "column",
    justifyContent: "space-evenly",
    paddingTop: 20,
    marginLeft: 50,
    gap: 10,
  },
  total: {
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 20,
    marginRight: 100,
  },
  title: {
    flexDirection: "row",
    padding: 4,
    fontSize: 10,
  },
  textTitle: {
    fontWeight: "bold",
    color: "#181C14",
  },
  info: {
    flexDirection: "row",
    fontSize: 14,
  },
  image: {
    marginLeft: "auto",
    marginRight: "auto",
    width: 100,
    height: 100,
    borderRadius: "50%",
    marginTop: 25,
  },
});

// Format the money values (VND format)
const formatMoney = (amount: number) => {
  return amount?.toLocaleString("de-DE") + " VND";
};

// Invoice document component
const InvoiceDoc = ({
  data,
  total,
  customerPayment,
  change,
  orderId,
  createdAt,
  title,
}: {
  data: any[];
  total: number;
  customerPayment: number;
  change: number;
  orderId: number;
  createdAt: string;
  title: string;
}) => (
  <Document title="Hóa đơn" style={styles.body}>
    <Page size="A4" style={styles.page}>
      <Image
        style={styles.image}
        src="https://res.cloudinary.com/dujylxkra/image/upload/c_thumb,w_200,g_face/v1729824625/logo-product_imja18.png"
      />
      <View>
        <Text style={styles.header}>{title}</Text>
        <View style={styles.top}>
          <View style={styles.info}>
            <Text style={styles.textTitle}>Mã hóa đơn: </Text>
            <Text>{orderId}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.textTitle}>Ngày tạo: </Text>
            <Text>{createdAt}</Text>
          </View>
        </View>
      </View>
      <View>
        {/* Render the order items in a table */}
        <PDFTable data={data} />
        
        {/* Display total amount and payment information */}
        <Text style={styles.total}>Tổng tiền: {formatMoney(total)}</Text>
        <Text style={styles.total}>Khách thanh toán: {formatMoney(customerPayment)}</Text>
        <Text style={styles.total}>Tiền thối: {formatMoney(change)}</Text>

        <Text
          style={{
            fontSize: 14,
            marginRight: 100,
            textAlign: "right",
          }}
        >
          {`( Đã bao gồm VAT )`}
        </Text>
      </View>
    </Page>
  </Document>
);

// Main print invoice component
export default function PrintImportInvoice() {
  const location = useLocation();
  const { orderItemResponses, total, customerPayment, change, orderId, createdAt } = location.state?.data || {}; // Get data from location state

  // Calculate the total from order items
  const title = "Hóa đơn đơn hàng";

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <InvoiceDoc 
        data={orderItemResponses} 
        title={title} 
        total={total}
        customerPayment={customerPayment} 
        change={change} 
        orderId={orderId} 
        createdAt={createdAt} 
      />
    </PDFViewer>
  );
}
