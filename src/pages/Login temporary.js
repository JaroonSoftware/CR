import { React } from "react";
import { useNavigate } from "react-router-dom";
import { Layout,Card, Form,} from "antd";
import logo4 from "../assets/images/logo_nsf.png";
import Swal from "sweetalert2";
import SystemService from "../service/SystemService";


const { Header, Footer, Content } = Layout;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    // alert(values.password, values);
    Connectapp(values);
  };

  const Connectapp = (values) => {
    SystemService.signIn(values)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data?.status === "1") {
            navigate("/dashboard", { replace: true });
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

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <div className="layout-default ant-layout layout-sign-up">
        <Header>
          <div className="header-col header-brand">
          </div>
        </Header>

        <Content className="p-0">
          <div className="sign-up-header">
            <div className="content">
            </div>
          </div>
          <Card
          
            className="card-signup header-solid h-full ant-card pt-0"
            bordered="false"
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
             <h5 align="center" >ร้าน ชุดนักเรียนชัยรัตน์ ปิดชั่วคราว ขออภัยค่ะ</h5>
             <h5 align="center" > โปรดแวะกลับมาเยี่ยมชมร้านภายหลังนะคะ</h5>
             <h5 align="center" > ติดต่อเรา</h5>
             <h5 align="center" > contact.chairat@gmail.com</h5>
             <h5 align="center" > Tel. 0859001310</h5>
            </Form>
          </Card>
        </Content>
        <Footer>
          <p className="copyright">
            {" "}
            <a href="https://www.facebook.com/jaroonsoft">
              Jaroon Software Co., Ltd.
            </a>{" "}
          </p>
        </Footer>
      </div>
    </>
  );
};

export default Login;
