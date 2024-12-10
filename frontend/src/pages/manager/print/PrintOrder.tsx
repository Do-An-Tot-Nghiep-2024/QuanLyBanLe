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
import bold from "../../../assets/fonts/Roboto-Bold.ttf";
import regular from "../../../assets/fonts/Roboto-Regular.ttf";
import medium from "../../../assets/fonts/Roboto-Medium.ttf";
import { formatMoney } from "../../../utils/formatMoney";
import logo from "../../../assets/images/logo.png";
import { Box, Button } from "@mui/material";
import { formatDateTime } from "../../../utils/dateUtil";
import { useAppSelector } from "../../../redux/hook";

Font.register({
  family: "Roboto",
  fonts: [
    {
      src: bold,
      fontWeight: "bold",
    },
    {
      src: regular,
      fontWeight: "normal",
    },
    {
      src: medium,
      fontWeight: "medium",
    },
  ],
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
    fontWeight: 500,
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
    fontSize: 15,
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
    fontSize: 16,
    fontWeight: "medium",
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
  percentage,
  minOrderValue,
  promotion,
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
  percentage: number;
  minOrderValue: number;
  promotion: number;
}) => (
  <Document title="Hóa đơn" style={styles.body}>
    <Page size="A4" style={styles.page}>
      <Image style={styles.image} src={logo} />
      <View style={{ display: "flex" }}>
        <Text style={styles.header}>{title}</Text>
        <View style={styles.head}>
          <View style={styles.info}>
            <Text>Ngày tạo: </Text>
            <Text>{formatDateTime(createdAt)}</Text>
          </View>
          <View style={styles.info}>
            <Text>Mã hóa đơn: </Text>
            <Text>{orderId}</Text>
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
          <Text>Nhân viên: </Text>
          <Text>{employee}</Text>
        </View>
      </View>
      <View>
        {/* Render the order items in a table */}
        <PDFTable
          data={data}
          pecentage={percentage}
          minOrderValue={minOrderValue}
          totalDiscount={promotion}
        />

        <View style={styles.payment}>
          <Text>{"Tổng tiền hàng".toUpperCase()}</Text>
          <Text> {formatMoney(total)}</Text>
        </View>

        <View style={styles.payment}>
          <Text>{"Tổng tiền đã giảm".toUpperCase()}</Text>
          <Text> {formatMoney(discount > 0 ? -discount : -0)}</Text>
        </View>

        <View style={styles.payment}>
          <Text>{"Tổng tiền phải thanh toán".toUpperCase()}</Text>
          <Text> {formatMoney(total - discount)}</Text>
        </View>

        <View style={styles.payment}>
          <Text>{"Tiền khách đưa".toUpperCase()}</Text>
          <Text>{formatMoney(customerPayment)}</Text>
        </View>

        <View style={styles.payment}>
          <Text>{"Tiền trả lại".toUpperCase()}</Text>
          <Text>{formatMoney(change)}</Text>
        </View>

        <Text
          style={{
            marginTop: 10,
            fontSize: 12,
            textAlign: "center",
          }}
        >
          {`( Giá trên đã bao gồm thuế GTGT )`}
        </Text>
        {/* {discount > 0 && percentage !== 0 && minOrderValue > 0 && (
          <Text
            style={{
              color: "red",
              textAlign: "center",
              marginTop: 10,
              fontSize: 14,
            }}
          >
            ! Hóa đơn được giảm {percentage * 100} % khi đơn hàng{" "}
            {formatMoneyThousand(minOrderValue)} VND
          </Text>
        )} */}
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
    percentage,
    minOrderValue,
  } = location.state || {}; // Get data from location state
  const auth = useAppSelector((state) => state.auth);
  // // Calculate the total from order items
  const title = "HÓA ĐƠN BÁN HÀNG";
  const change = customerPayment - (total - totalDiscount);
  const productsItems = location.state?.orderItemResponses as any[];

  let promotion = 0;
  // // increment quantity and price if product duplicate name
  const items = Object.values(
    productsItems.reduce(
      (acc, item) => {
        if (!acc[item.name]) {
          acc[item.name] = { ...item }; // Initialize the grouped item
          acc[item.name].discount =
            item.discount > 0 ? item.discount * item.price * item.quantity : 0;
        } else {
          // Increment the quantity, price, and amount
          acc[item.name].quantity += item.quantity;
          acc[item.name].amount += item.amount;
          acc[item.name].discount +=
            item.discount > 0 ? item.discount * item.price * item.quantity : 0;
        }
        if (item.discount > 0) {
          promotion += item.discount * item.price * item.quantity;
          acc[item.name].discount = item.discount * item.price * item.quantity;
        }
        return acc;
      },
      {} as Record<string, any>
    )
  );
  console.log("Items are: ", items);

  // calculate promotion
  // items.forEach((item: any) => {
  //   if (item.discount > 0) {
  //     promotion += item.discount * item.price * item.quantity;
  //   }
  // });
  console.log("Promotion value ", promotion);
  promotion = totalDiscount - promotion;
  console.log("Total discount ", totalDiscount);

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
          total={total}
          promotion={promotion}
          discount={totalDiscount}
          customerPayment={customerPayment}
          change={change}
          orderId={orderId}
          createdAt={createdAt}
          employee={employee}
          percentage={percentage}
          minOrderValue={minOrderValue}
        />
      </PDFViewer>
    </Box>
  );
}
