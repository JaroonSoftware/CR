import { Link } from "react-router-dom";
import LOGO from "../assets/images/banner-shop.png";
import { Card, Row, Col, ConfigProvider, Image, Menu, Button } from "antd";
const PublicHeader = () => {
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
                // onClick={showModallogin}
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
              <Menu>
                &nbsp;&nbsp;&nbsp;
                <Link to="/">หน้าหลัก</Link>
                &nbsp;&nbsp;&nbsp;
                <Link to="/HTP">วิธีการสั่งซื้อ</Link>
                &nbsp;&nbsp;&nbsp;
                <Link to="/Gopp">Contact</Link>
              </Menu>
            </ConfigProvider>
          </nav>
        </div>
      </ConfigProvider>
    </>
  );
};
export default PublicHeader;
