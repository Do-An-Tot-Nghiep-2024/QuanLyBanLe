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
import { useLocation, useNavigate } from "react-router-dom";
import PDFTable from "../../../components/PDFTable";
import source from "../../../assets/fonts/Roboto-Regular.ttf";
import { formatMoney } from "../../../utils/formatMoney";
import logo from "../../../assets/images/logo.png";
import { Box, Button } from "@mui/material";
import { formatDateTime } from "../../../utils/dateUtil";
import { useAppSelector } from "../../../redux/hook";
// Register the custom font
Font.register({
  family: "Roboto",
  src: source,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
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
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 15,
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
  orderId: {
    flexDirection: "row",
    fontSize: 20,
    alignContent: "center",
    justifyContent: "center",
  },
  info: {
    flexDirection: "row",
    fontSize: 14,
  },
  image: {
    marginLeft: "auto",
    marginRight: "auto",
    width: 80,
    height: 80,
    borderRadius: "50%",
    marginTop: 10,
  },
  payment: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between", // Distributes space evenly with alignment
    paddingHorizontal: 35,
    paddingVertical: 4,
    fontSize: 15,
    fontWeight: 1000,
  },
  head: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between", // Distributes space evenly with alignment
    paddingHorizontal: 35,
    paddingTop: 10,
  },
  textLeft: {
    flex: 1,
    textAlign: "right",
  },
  textRight: {
    flex: 1,
    textAlign: "center",
  },
});

// Invoice document component
const InvoiceDoc = ({
  data,
  total,
  customerPayment,
  change,
  orderId,
  createdAt,
  employee,
  title,
  discount,
}: {
  data: any[];
  total: number;
  customerPayment: number;
  change: number;
  orderId: number;
  createdAt: Date;
  employee: string;
  title: string;
  discount: number;
}) => (
  <Document title="Hóa đơn" style={styles.body}>
    <Page size="A4" style={styles.page}>
      <Image style={styles.image} src={logo} />
      <View style={{ display: "flex", padding: "none" }}>
        <Text style={styles.header}>{title}</Text>
        <View style={styles.head}>
          <View style={styles.info}>
            <Text style={styles.textTitle}>Ngày tạo: </Text>
            <Text>{formatDateTime(createdAt)}</Text>
          </View>
          <View style={styles.info}>
            <Text>Mã hóa đơn: </Text>
            <Text style={{ fontWeight: "bold" }}>{orderId}</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          alignItems: "flex-end",
          paddingHorizontal: 35,
          paddingVertical: 10,
        }}
      >
        <View style={styles.info}>
          <Text style={styles.textTitle}>Nhân viên: </Text>
          <Text>{employee}</Text>
        </View>
      </View>
      <View>
        {/* Render the order items in a table */}
        <PDFTable data={data} />

        {/* Display total amount and payment information */}
        {/* {discount > 0 && (
          <Text style={styles.total}>Khuyến mãi: {formatMoney(discount)}</Text>
        )} */}
        <View style={styles.payment}>
          <Text>{"Tổng tiền phải thanh toán".toUpperCase()}</Text>
          <Text> {formatMoney(total)}</Text>
        </View>

        <View style={styles.payment}>
          <Text>{"Tổng tiền đã giảm".toUpperCase()}</Text>
          <Text> {formatMoney(discount > 0 ? discount : 0)}</Text>
        </View>

        <View style={styles.payment}>
          <Text>{"Tiền khách trả".toUpperCase()}</Text>
          <Text>{formatMoney(customerPayment)}</Text>
        </View>

        <View style={styles.payment}>
          <Text>{"Tiền trả lại".toUpperCase()}</Text>
          <Text>{formatMoney(change)}</Text>
        </View>

        <Text
          style={{
            marginTop: 10,
            fontSize: 10,
            marginRight: 100,
            paddingLeft:40
            // textAlign: "center",
          }}
        >
          {`( Giá trên đã bao gồm thuế GTGT )`}
        </Text>
      </View>
    </Page>
  </Document>
);

// Main print invoice component
export default function PrintOrder() {
  const location = useLocation();
  // console.log(location.state);
  const navigate = useNavigate();
  const {
    total,
    customerPayment,
    orderId,
    createdAt,
    employee,
    totalDiscount,
  } = location.state || {}; // Get data from location state
  const auth = useAppSelector((state) => state.auth);
  // // Calculate the total from order items
  const title = "HÓA ĐƠN BÁN HÀNG";
  const change = customerPayment - (total - totalDiscount);
  const productsItems = location.state?.orderItemResponses as any[];
  // // increment quantity and price if product duplicate name
  const items = Object.values(
    productsItems.reduce(
      (acc, item) => {
        if (!acc[item.name]) {
          acc[item.name] = { ...item }; // Initialize the grouped item
        } else {
          // Increment the quantity, price, and amount
          acc[item.name].quantity += item.quantity;
          // acc[item.name].price += item.price;
          acc[item.name].amount += item.amount;
        }
        return acc;
      },
      {} as Record<string, any>
    )
  );
  // const fetchData = {
  //   total: 2000,
  //   customerPayment: 2000,
  //   orderId: 1,
  //   createdAt: new Date(),
  //   employee: "Nguyen",
  //   totalDiscount: 0,
  //   change: 0,
  //   items: [
  //     {
  //       name: "Banh bao",
  //       quantity: 2,
  //       price: 24000,
  //       amount: 48000,
  //     },
  //     {
  //       name: "Banh mi",
  //       quantity: 1,
  //       price: 24000,
  //       amount: 24000,
  //     },
  //   ],
  // };

  return (
    <Box width={"90%"}>
      <Button
        onClick={() => {
          if (auth.role === "EMPLOYEE") {
            navigate("/staff/orders/create-order");
          } else {
            navigate("/orders/create-order");
          }
        }}
        sx={{
          my: 3,
        }}
        variant="contained"
      >
        HOÀN THÀNH
      </Button>

      <PDFViewer style={{ width: "100%", height: "100vh" }}>
        <InvoiceDoc
          data={items}
          title={title}
          total={total - totalDiscount}
          discount={totalDiscount}
          customerPayment={customerPayment}
          change={change}
          orderId={orderId}
          createdAt={createdAt}
          employee={employee}
        />
      </PDFViewer>
    </Box>
  );
}
