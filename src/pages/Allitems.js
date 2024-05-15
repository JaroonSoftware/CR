import { Card } from 'antd';
import Gopp from "./PublicHeader";
const Allitems = () => {
  return (
    <>
      <Gopp></Gopp>
      <Card
        bordered={false}
        style={{ color: "red", textAlign: "center" }}
      >
        <h1>กำลังปรับปรุง</h1>
      </Card>
    </>
  );
};
export default Allitems;
