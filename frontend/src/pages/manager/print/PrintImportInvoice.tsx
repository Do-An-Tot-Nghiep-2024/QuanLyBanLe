import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
  Image,
} from "@react-pdf/renderer";

import source from "../../assets/fonts/Roboto-Regular.ttf";
import PDFTable from "../../../components/PDFTable";
import { useLocation } from "react-router-dom";
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

const formatMoney = (amount: number) => {
  return amount.toLocaleString("de-DE") + " VND";
};

const defaultValue = {
  id: "HDNH-001-2023-10-10",
  dueDate: new Date().toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }),
  supplier: "Duc Trung",
};
// const data = [
//   {
//     name: "Banh mi",
//     quantity: 10,
//     price: 100,
//     total: 1000,
//   },
//   {
//     name: "Banh bao",
//     quantity: 5,
//     price: 200,
//     total: 1000,
//   },
// ];
const InvoiceDoc = ({
  data,
  total,
  title,
}: {
  data: any[];
  total: number;
  title: string;
}) => (
  <Document title="Hóa đơn nhập hàng" style={styles.body}>
    <Page size="A4" style={styles.page}>
      <Image
        style={styles.image}
        src="https://res.cloudinary.com/dujylxkra/image/upload/c_thumb,w_200,g_face/v1729824625/logo-product_imja18.png"
      ></Image>
      <View>
        <Text style={styles.header}>{title}</Text>
        <View style={styles.top}>
          <View style={styles.info}>
            <Text style={styles.textTitle}>Mã hóa đơn: </Text>
            <Text>{defaultValue.id}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.textTitle}>Tên nhà cung cấp: </Text>
            <Text>{defaultValue.supplier}</Text>
          </View>

          <View style={styles.info}>
            <Text style={styles.textTitle}>Ngày tạo: </Text>
            <Text>{defaultValue.dueDate}</Text>
          </View>
        </View>
      </View>
      <View>
        <PDFTable data={data} />
        <Text style={styles.total}>Tổng tiền: {formatMoney(total)}</Text>
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
export default function PrintImportInvoice() {
  const location = useLocation();
  const productsItems = location.state?.productItems as any[];
  const title = "Hóa đơn nhập hàng";
  const total = productsItems.reduce((acc, item) => acc + item.total, 0);
  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <InvoiceDoc data={productsItems} title={title} total={total} />
      {/* <PDFDownloadLink
        document={
          <InvoiceDoc data={productsItems} title={title} total={total} />
        }
        fileName="somename.pdf"
      ></PDFDownloadLink> */}
    </PDFViewer>
  );
}
