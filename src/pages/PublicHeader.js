import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LOGO from "../assets/images/banner-shop.png";
import logo4 from "../assets/images/logo_nsf.png";
import Swal from "sweetalert2";
import SystemService from "../service/SystemService";
import { Authenticate } from "../service/Authenticate.service";
import EcommerceService from "../service/EcommerceService";
import { BACKEND_URL } from "../utils/util";
import {
  Card,
  Row,
  Col,
  ConfigProvider,
  Image,
  Menu,
  Button,
  Input,
  Form,
  Modal,
} from "antd";
const PublicHeader = () => {
  const [isModalloginOpen, setIsModalloginOpen] = useState(true); //fix isModalloginOpen = true เพื่อเทสหลังบ้าน
  const [AllProductEcommerce, setAllProductEcommerce] = useState([]);
  const [curr, setCurr] = useState(false);
  const authService = Authenticate();
  const navigate = useNavigate();
  const ProductEcommerce = () => {
    EcommerceService.getProdEcommerce()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          data.data.forEach((array) => {
            // วนลูปผ่านทุกๆ อ็อบเจกต์ในอาร์เรย์ซ้อนอยู่
            array.file.forEach((obj) => {
              // ทำการแก้ไขอ็อบเจกต์ที่อยู่ภายใน
              obj.file_name = `${BACKEND_URL}/product/uploads/` + obj.file_name;
            });
          });
          setAllProductEcommerce(data.data);
          console.log(AllProductEcommerce);
        }
      })
      .catch((err) => {});
  };
  const showModallogin = () => {
    setIsModalloginOpen(true);
  };
  const handleloginOk = () => {
    setIsModalloginOpen(false);
  };
  const handleloginCancel = () => {
    setIsModalloginOpen(false);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onFinish = (values) => {
    // alert(values.password, values);
    Connectapp(values);
  };
  const Connectapp = (values) => {
    SystemService.signIn(values)
      .then((res) => {
        let { status, data } = res;
        const { token } = data;
        if (status === 200) {
          debugger
          if (data?.status === "1") {
            authService.setToken(token);

            direcetSystem();
          }else{
            Swal.fire({
              title: "<strong>Login ผิดพลาด!</strong>",
              html: data.message,
              icon: "error",
            });
          }
        } else {
          Swal.fire({
            title: "<strong>Login ผิดพลาด!</strong>",
            html: data.message,
            icon: "error",
          });
        }
      })
      .catch((err) => {});
  };
  const direcetSystem = () => {
    navigate(!!curr ? curr : "/product", { replace: true });
  };
  
  useEffect(() => {
    ProductEcommerce();
    // setIsModalnoticOpen(false);
    // const isLogin = () => {
    //   const isAuthen = authService.isExpireToken();
    //   if(!isAuthen) setLogined( true );
    //   else direcetSystem();
    // }
     let curLocation = authService.getCurrent();

    setCurr(curLocation);
    // isLogin();
  }, []);
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#FFAD00",
            colorBgContainer: "#14357A",
          },
        }}
      >
        <div>
          <nav>
            <Card>
              <Button
                onClick={showModallogin}
                type="link"
                style={{
                  width: 100,
                  float: "right",
                  color: "white",
                }}
              >
                เข้าสู่ระบบ
              </Button>
              <Row gutter={[20, 0]}>
                <Col offset={11}>
                  <Image
                    className="width-20 uploadfile.pb-15"
                    width={150}
                    src={LOGO}
                  />
                </Col>
              </Row>
            </Card>
          </nav>
        </div>
        <div>
          <nav>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#14357A",
                  colorBgContainer: "#FDFEFE",
                },
              }}
            >
              <Menu mode="horizontal">
                &nbsp;&nbsp;&nbsp;
                <Link to="/">หน้าหลัก</Link>
                &nbsp;&nbsp;&nbsp;
                <Link to="/HTP">วิธีการสั่งซื้อ</Link>
                &nbsp;&nbsp;&nbsp;
                <Link to="/Allitems">สินค้าทั้งหมด</Link>
                &nbsp;&nbsp;&nbsp;
                <Link to="/payment">ยืนยันการชำระเงิน</Link>
              </Menu>
            </ConfigProvider>
          </nav>
        </div>
      </ConfigProvider>
      {/* Modal เข้าสู่ระบบ */}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#143574",
            colorBgContainer: "#FDFEFE",
          },
        }}
      >
        <Modal
          onOk={handleloginOk}
          onCancel={handleloginCancel} //fix สำหรับเทสหลังบ้าน
          closable={false} //fix สำหรับเทสหลังบ้าน
          cancelButtonProps={{ style: { display: "none" } }} 
          okButtonProps={{ style: { display: "none" } }}
          open={isModalloginOpen}
        >
          <div className="sign-up-gateways ">
            <img
              className="width-20 uploadfile.pb-15"
              src={logo4}
              alt="logo 1"
            />
            <br></br>
            <br></br>
          </div>
          <br></br>
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className="row-col"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "กรุณากรอก username!" }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "กรุณาใส่รหัสผ่าน!" }]}
            >
              <Input.Password size="small" placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button
                style={{
                  width: "100%",
                }}
                type="primary"
                htmlType="submit"
              >
                LOGIN
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </ConfigProvider>
    </>
  );
};
export default PublicHeader;
