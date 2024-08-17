import {
  AppstoreOutlined,  
  FileDoneOutlined,
  HddOutlined,
  InboxOutlined,
  TeamOutlined,  
  ImportOutlined,
  FileSyncOutlined ,
  ExceptionOutlined ,
  DollarOutlined  ,
} from "@ant-design/icons";

let _nav = [
  // {
  //   title: "DATA",
  //   type: "group",
  // },
  // {
  //   title: "Dashboard",
  //   icon: <AppstoreOutlined className="nav-ico" />,
  //   to: "/dashboard",
  // },
  {
    title: "ระบบจัดซื้อสินค้า",
    type: "group",
  },
  {
    title: "ใบซื้อสินค้า (PO)",
    icon: <FileSyncOutlined   className="nav-ico" />,
    to: "/Po",
  },
  {
    title: "รับสินค้า (GR)",
    icon: <ImportOutlined className="nav-ico" />,
    to: "/Gr",
  },
  {
    title: "คลังสินค้า",
    icon: <AppstoreOutlined  className="nav-ico" />,
    to: "/Stock",
  },
  {
    title: "Order",
    icon: <FileSyncOutlined   className="nav-ico" />,
    to: "/ShopOrder",
  },
  {
    title: "ใบเสร็จ (Receipt)",
    icon: <DollarOutlined    className="nav-ico" />,
    to: "/Receipt",
  },
  {
    title: "ตรวจสอบชำระเงิน",
    icon: <ExceptionOutlined className="nav-ico" />,
    to: "/ApprovePayment",
  },
  // {
  //   title: "Test รายงาน",
  //   icon: <ExceptionOutlined className="nav-ico" />,
  //   to: "/TestReport",
  // },
  {
    title: "MASTER",
    type: "group",
  },
  {
    title: "สินค้า",
    icon: <InboxOutlined className="nav-ico" />,
    to: "/product",
  },
  {
    title: "ผู้ขาย",
    icon: <InboxOutlined className="nav-ico" />,
    to: "/supplier",
  },
  {
    title: "หน่วย",
    icon: <InboxOutlined className="nav-ico" />,
    to: "/unit",
  },
  {
    title: "ประเภทสินค้า",
    icon: <InboxOutlined className="nav-ico" />,
    to: "/type",
  },
  {
    title: "หมวดหมู่",
    icon: <InboxOutlined className="nav-ico" />,
    to: "/category",
  },
  {
    title: "จัดการหมวดหมู่สินค้า",
    icon: <InboxOutlined className="nav-ico" />,
    to: "/ManageProductCategory",
  },
  {
    title: "ขนาด",
    icon: <InboxOutlined className="nav-ico" />,
    to: "/Size",
  },
  {
    title: "จัดการขนาดของสินค้า",
    icon: <InboxOutlined className="nav-ico" />,
    to: "/ManageProductSize",
  },
  
  {
    title: "SYSTEM",
    type: "group",
  },
  {
    title: "User",
    icon: <TeamOutlined className="nav-ico" />,
    to: "/user",
  },
];

export default _nav;
