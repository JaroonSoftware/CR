import React, { useState, useEffect } from "react";
import {
  ShoppingCartOutlined,
  MinusCircleTwoTone,
  AlignCenterOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import EcommerceService from "../service/EcommerceService";
import { BACKEND_URL_MAIN } from "../utils/util";
import Gopp from "../pages/PublicHeader";
import logo4 from "../assets/images/logo_nsf.png";
import {
  Layout,
  Card,
  Space,
  Row,
  Col,
  Select,
  Form,
  ConfigProvider,
  Image,
  FloatButton,
  Modal,
  Button,
  InputNumber,
  Divider,
  Segmented,
  Carousel,
  Avatar,
} from "antd";
import Swal from "sweetalert2";
const { Meta } = Card;
const { Content } = Layout;
const Login = () => {
  const [AllProductEcommerce, setAllProductEcommerce] = useState([]);
  const [AllCategoryEcommerce, setAllCategoryEcommerce] = useState([]);
  const [isModalproductOpen, setIsModalproductOpen] = useState(false);
  const [isModalCartOpen, setIsModalCartOpen] = useState(false);
  // const [logined, setLogined] = useState(false);
  const [isModalnoticOpen, setIsModalnoticOpen] = useState(false);
  //Set show and hide
  const [ShowCategory, setShowCategory] = useState(true);
  const [ShowProduct, setShowProduct] = useState(false);
  //
  const [form] = Form.useForm();
  const [itemsOptionCategory, setItemsOptionCategory] = useState([]);
  const [itemsOptionSubCategory, setItemsOptionSubCategory] = useState([]);
  const [itemsOptionType, setItemsOptionType] = useState([]);
  const [itemsOptionChangeCategory, setItemsOptionChangeCategory] =
    useState("");
  const [itemsOptionChangeSubCategory, setItemsOptionChangeSubCategory] =
    useState("");
  //Prod Detail
  const [IsProd, setIsProd] = useState([]);
  const [PicProd, setPicProd] = useState([]);
  const [itemsSize, setItemsSize] = useState([]);
  const [maxProd, setmaxProd] = useState(0);
  const [alertAmount, setalertAmount] = useState("");
  const [ProdCode, setProdCode] = useState("");
  const [SizeProd, setSizeProd] = useState("");
  const [amountProd, setamountProd] = useState("");
  const [formProd] = Form.useForm();
  const { Option } = Select;
  const [itemsCart, setItemsCart] = useState([]);
  const [TotalPrice, setTotalPrice] = useState("");
  //End Prod Detail
  const navigate = useNavigate();
  useEffect(() => {
    //setIsModalnoticOpen(true);
    //ProductEcommerce();
    CategoryEcommerce();
    //handleCategoryChange();
  }, []);

  const CategoryEcommerce = () => {
    EcommerceService.getCategoryEcommerce()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          data.data.forEach((array) => {
            array.img_filename =
              `${BACKEND_URL_MAIN}/upload_logo/` + array.img_filename;
          });
          setAllCategoryEcommerce(data.data);
          //console.log(data.data);
          //console.log(AllCategoryEcommerce);
        }
      })
      .catch((err) => {});
  };
  const ProductEcommerce = (ctgy_id) => {
    let id, subctgy_id, type;
    id = form.getFieldValue("ctgy_id");
    subctgy_id = form.getFieldValue("subctgy_id");
    type = form.getFieldValue("prodty_id");
    if (id === "" || id === undefined) {
      id = ctgy_id;
    } else {
      id = id;
    }
    if (subctgy_id === "" || subctgy_id === undefined) {
      subctgy_id = "";
    } else {
      subctgy_id = subctgy_id;
    }
    if (type === "" || type === undefined) {
      type = "";
    } else {
      type = type;
    }
    let para = {
      ctgy_id: id,
      subctgy_id: subctgy_id,
      type: type,
    };
    EcommerceService.getProdEcommerce(para)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          data.data.forEach((array) => {
            // วนลูปผ่านทุกๆ อ็อบเจกต์ในอาร์เรย์ซ้อนอยู่
            array.file.forEach((obj) => {
              // ทำการแก้ไขอ็อบเจกต์ที่อยู่ภายใน
              obj.file_name = `${BACKEND_URL_MAIN}/uploads/` + obj.file_name;
            });
          });
          setAllProductEcommerce(data.data);
          //console.log(data.data);
          // console.log(AllProductEcommerce);
          getItemOptionCategory();
          form.setFieldValue("ctgy_id", id);
          form.getFieldValue("ctgy_id");
          setItemsOptionChangeCategory(id);
          //console.log(itemsOptionChangeCategory);
          getItemOptionSubCategory(id);
          getItemOptionType();
          setShowCategory(false);
          setShowProduct(true);
        }
      })
      .catch((err) => {});
  };
  //   useEffect(() => {
  //     const handleCategoryChange = async() => {
  //       try {
  //         debugger
  //         let para = {
  //             id : itemsOptionChangeCategory
  //         }
  //           const {data, status} =  await EcommerceService.getSubCategoryItem(para);
  //           if(status === 200){
  //             if(data.data.length > 0){
  //                 setItemsOptionSubCategory(data.data);
  //             }else{
  //                 form.setFieldsValue({ subctgy_id: undefined });
  //                 setItemsOptionSubCategory([]);
  //             }
  //           }
  //         } catch (error) {
  //           console.error('Error fetching data:', error);
  //         }
  //       }
  //       handleCategoryChange();
  // }, [itemsOptionChangeCategory]);
  const getItemOptionCategory = async () => {
    const { data, status } = await EcommerceService.getOption("Category");
    if (status === 200) setItemsOptionCategory(data.data);
  };

  const getItemOptionSubCategory = async (id) => {
    const { data, status } = await EcommerceService.getSubProductCategory(id);
    if (status === 200) setItemsOptionSubCategory(data.data);
  };

  const getItemOptionType = async () => {
    const { data, status } = await EcommerceService.getOption("Type");
    if (status === 200) setItemsOptionType(data.data);
  };

  const onChange = (value) => {
    //console.log("changed", value);
  };
  const showModalproduct = (data) => {
    setalertAmount("");
    let para = {
      id: data,
    };
    EcommerceService.getProductByid(para)
      .then((res) => {
        let { status, data } = res;
        let data_prod = data.data[0];
        if (status === 200) {
          setIsProd(data_prod);
          let file = data_prod.file.map((data) => ({
            ...data,
            file_name: `${BACKEND_URL_MAIN}/uploads/` + data.file_name,
          }));
          console.log(file);
          const formattedFileList_prod = file.map((data) => ({
            prod_img_id: data.prod_img_id,
            uid: data.uid,
            name: data.name,
            status: "done",
            url: data.file_name,
          }));

          setItemsSize(data_prod.size);
          setProdCode(data_prod.prod_code);
          setPicProd(formattedFileList_prod);
          setIsModalproductOpen(true);
        }
      })
      .catch((err) => {});
    //setIsModalproductOpen(true);
    //console.log(AllProductEcommerce);
  };
  //Check amount Product
  const Checkamount = (data) => {
    setSizeProd(data);
    let para = {
      size: data,
      prod: ProdCode,
    };
    formProd.setFieldValue("amount_prod", 0);
    EcommerceService.CheckAmount(para)
      .then((res) => {
        let { status, data } = res;
        let dataA = data.data;
        if (status === 200) {
          setmaxProd(dataA.amount);
          if (dataA.amount <= 5) {
            setalertAmount("สินค้าเหลือ " + dataA.amount);
          } else {
            setalertAmount("");
          }
          if (dataA.amount < amountProd) {
            setamountProd(0);
          }
        }
      })
      .catch((err) => {});
    //setIsModalproductOpen(true);
    //console.log(AllProductEcommerce);
  };
  //Close Modal
  const handlemodalProdClose = () => {
    // console.log('func_delAll')
    formProd.resetFields();
    formProd.setFieldValue("size_prod", "");
    formProd.setFieldValue("amount_prod", 0);
    setmaxProd(0);
    setItemsSize([]);
    setProdCode("");
    setPicProd([]);
    setamountProd(0);
    setSizeProd("");
    setIsModalproductOpen(false);
  };

  const AddProdInCart = () => {
    const existingData = localStorage.getItem("ProdInCart");
    let newData;
    let size = SizeProd.split("_");
    // ถ้ามีข้อมูลอยู่ใน Local Storage
    if (existingData) {
      // ดึงข้อมูลเดิมมาและแปลงเป็น Array
      newData = JSON.parse(existingData);
      // ตรวจสอบว่าข้อมูลที่ต้องการอัปเดตอยู่ใน Array หรือไม่
      const dataIndex = newData.findIndex(
        (item) => item.prod_code === ProdCode && item.size_id === size[0]
      );
      if (dataIndex !== -1) {
        // ถ้าข้อมูลอยู่ใน Array ให้ทำการอัปเดตข้อมูล
        newData[dataIndex] = {
          prod_code: ProdCode,
          size_id: size[0],
          size_name: size[1],
          amount: amountProd,
          pic: PicProd,
          prod_name: IsProd.prod_name,
          price: IsProd.price,
        };
      } else {
        // ถ้าข้อมูลไม่อยู่ใน Array ให้ทำการเพิ่มข้อมูลใหม่
        newData.push({
          prod_code: ProdCode,
          size_id: size[0],
          size_name: size[1],
          amount: amountProd,
          pic: PicProd,
          prod_name: IsProd.prod_name,
          price: IsProd.price,
        });
      }
    } else {
      // ถ้าไม่มีข้อมูลใน Local Storage สร้าง Array ใหม่และเพิ่มข้อมูลใหม่เข้าไป
      newData = [
        {
          prod_code: ProdCode,
          size_id: size[0],
          size_name: size[1],
          amount: amountProd,
          pic: PicProd,
          prod_name: IsProd.prod_name,
          price: IsProd.price,
        },
      ];
    }

    // บันทึกข้อมูล Array ลงใน Local Storage
    localStorage.setItem("ProdInCart", JSON.stringify(newData));
    //alert
    Swal.fire({
      position: "top-center",
      icon: "success",
      title: "เพิ่มสินค้าลงตะกล้าสำเร็จ",
      showConfirmButton: false,
      timer: 1500,
    });
    //
    formProd.resetFields();
    formProd.setFieldValue("size_prod", "");
    formProd.setFieldValue("amount_prod", 0);
    setmaxProd(0);
    setItemsSize([]);
    setProdCode("");
    setPicProd([]);
    setamountProd(0);
    setSizeProd("");
    setIsModalproductOpen(false);
  };
  const HandleDelProductInCart = (id, size) => {
    //debugger
    //alert(id+'---'+size)
    let data = JSON.parse(localStorage.getItem("ProdInCart"));
    let newData = data.filter(
      (item) => item.prod_code !== id || item.size_name !== size
    );
    console.log(newData);
    setItemsCart(newData);
    localStorage.setItem("ProdInCart", JSON.stringify(newData));
  };

  const handleCartAmountChange = (id, size, value) => {
    console.log("ItemCart");
    console.log(itemsCart);
    let para = {
      id: id,
      size: size,
      amount: value,
    };
    EcommerceService.CheckAmountProductSizeByCart(para)
      .then((res) => {
        let { status, data } = res;
        let sts = data.status;
        if (status === 200 && sts === "1") {
          Swal.fire({
            title: "<strong>จำนวนสินค้าไม่พอ!</strong>",
            showConfirmButton: false,
            timer: 1500,
            icon: "warning",
          });
        } else {
          const newData = [...itemsCart];
          const index = newData.findIndex(
            (item) => item.prod_code === id && item.size_id === size
          );
          if (index > -1) {
            newData[index]["amount"] = value;
            setItemsCart(newData);
          }
          const existingData = localStorage.getItem("ProdInCart");
          console.log("localStorageItemCart");
          console.log(existingData);
          let newData2;
          // ถ้ามีข้อมูลอยู่ใน Local Storage
          if (existingData) {
            // ดึงข้อมูลเดิมมาและแปลงเป็น Array
            newData2 = JSON.parse(existingData);
            // ตรวจสอบว่าข้อมูลที่ต้องการอัปเดตอยู่ใน Array หรือไม่
            const dataIndex = newData2.findIndex(
              (item) => item.prod_code === id && item.size_id === size
            );
            if (dataIndex !== -1) {
              // ถ้าข้อมูลอยู่ใน Array ให้ทำการอัปเดตข้อมูล
              newData2[dataIndex] = {
                prod_code: newData2[dataIndex].prod_code,
                size_id: newData2[dataIndex].size_id,
                size_name: newData2[dataIndex].size_name,
                amount: value,
                pic: newData2[dataIndex].pic,
                prod_name: newData2[dataIndex].prod_name,
                price: newData2[dataIndex].price,
              };
            }
          }
          // บันทึกข้อมูล Array ลงใน Local Storage
          localStorage.setItem("ProdInCart", JSON.stringify(newData2));
        }
      })
      .catch((err) => {});
  };

  const handleproductOk = () => {
    setIsModalproductOpen(false);
  };
  const handleproductCancel = () => {
    setIsModalproductOpen(false);
  };
  const showModalCart = () => {
    setItemsCart([]);
    const DatalocalStorage = localStorage.getItem("ProdInCart");
    let newData;
    newData = JSON.parse(DatalocalStorage);
    if (newData !== null && newData !== undefined) {
      setItemsCart(newData);
    } else {
      setItemsCart([]);
    }
    console.log(itemsCart);
    setIsModalCartOpen(true);
  };
  const handleshopOk = () => {
    // ไปยังหน้า Order
    navigate("/order");
  };
  const handleshopCancel = () => {
    setIsModalCartOpen(false);
  };
  const handlenoticCancel = () => {
    setIsModalnoticOpen(false);
  };
  const BackPage = () => {
    // Your click event handling logic goes here
    window.location.reload();
  };

  return (
    <>
      <Layout className="layout ">
        <Gopp></Gopp>
        {ShowCategory && (
          <Content
            style={{
              marginLeft: 20,
              marginRight: 20,
              minHeight: 200,
            }}
          >
            <div mode="horizontal">
              <Row gutter={[24, 0]}>
                {AllCategoryEcommerce.map((list) => (
                  <Col
                    xs={22}
                    sm={12}
                    md={12}
                    lg={6}
                    xl={4}
                    className="content-top-content"
                  >
                    <Card
                      onClick={(e) => ProductEcommerce(list.ctgy_id)}
                      hoverable
                      bordered={false}
                    >
                      <Carousel
                        autoplay
                        autoplaySpeed={7000}
                        draggable={true}
                        arrows={true}
                      >
                        <div key={list.img_uid} >
                          <Avatar
                            //preview={false}
                  
                            size={250}
                            src={list.img_filename}
                            alt={`Image ${list.img_name}`}
                          />
                        </div>
                      </Carousel>

                      <Meta
                        style={{
                          textAlign: "center",
                          marginTop: 10,
                        }}
                        title={list.ctgy_name}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Content>
        )}
        {ShowProduct && (
          <Content
            style={{
              marginLeft: 15,
              marginTop: 10,
              marginRight: 15,
              minHeight: 280,
            }}
          >
            <div mode="horizontal">
              <Button
                style={{
                  marginLeft: 5,
                  marginBottom: 5,
                }}
                onClick={BackPage}
              >
                ย้อนกลับ
              </Button>
              <Card
                style={{
                  minHeight: 150,
                }}
              >
                <Form
                  form={form}
                  layout="vertical"
                  name="form_in_modal"
                  initialValues={{}}
                >
                  <Row
                    gutter={[24, 0]}
                    offset={6}
                    className="content-top-content"
                  >
                    <Col xs={24} sm={24} md={8} lg={8} xl={6}>
                      หมวดหมู่
                      <Form.Item
                        name="ctgy_id"
                        rules={[
                          { required: true, message: "กรุณาเลือกหมวดหมู่!" },
                        ]}
                      >
                        <Select
                          showSearch
                          style={{ height: 40 }}
                          placeholder="เลือกหมวดหมู่"
                          optionFilterProp="label"
                          filterOption={(input, option) =>
                            (option?.label ?? "").includes(input)
                          }
                          options={itemsOptionCategory}
                          onChange={ProductEcommerce}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={4}>
                      หมวดหมู่ย่อย
                      <Form.Item
                        name="subctgy_id"
                        rules={[
                          {
                            required: true,
                            message: "กรุณาเลือกหมวดหมู่ย่อย!",
                          },
                        ]}
                      >
                        <Select
                          showSearch
                          style={{ height: 40 }}
                          placeholder="เลือกหมวดหมู่ย่อย"
                          optionFilterProp="label"
                          filterOption={(input, option) =>
                            (option?.label ?? "").includes(input)
                          }
                          options={itemsOptionSubCategory}
                          onChange={ProductEcommerce}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={4}>
                      ประเภทสินค้า
                      <Form.Item
                        name="prodty_id"
                        rules={[
                          { required: true, message: "กรุณาระบุประเภทสินค้า!" },
                        ]}
                      >
                        <Select
                          showSearch
                          style={{ height: 40 }}
                          placeholder="เลือกประเภทสินค้า"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            (option?.label ?? "").includes(input)
                          }
                          options={itemsOptionType}
                          onChange={ProductEcommerce}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Card>
              <Row gutter={[24, 0]}>
                {AllProductEcommerce.map((list) => (
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={6}
                    xl={4}
                    className="content-top-content"
                  >
                    <Card
                      onClick={(e) => showModalproduct(list.prod_code)}
                      hoverable
                      className="content-picture"
                      bordered={false}
                    >
                      <Carousel
                        autoplay
                        autoplaySpeed={7000}
                        draggable={true}
                        arrows={true}
                      >
                        {list.file.map((file) => (
                          <div key={file.uid}>
                            <Image
                              width={250}
                              height={150}
                              preview={false}
                              src={file.file_name}
                              alt={`Image ${file.name}`}
                            />
                          </div>
                        ))}
                      </Carousel>
                      <Meta
                        title={list.prod_name}
                        description={list.price + " บาท"}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </Content>
        )}
      </Layout>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#FFAD00",
          },
        }}
      >
        <FloatButton
          onClick={showModalCart}
          icon={<ShoppingCartOutlined />}
          type="primary"
          style={{
            right: 24,
          }}
        />
      </ConfigProvider>

      {/* รายการสินค้าในตะกร้า */}
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#14357A",
            colorBgBase: "#fafafa",
            colorBorder: "#14357A",
            colorBorderBg: "#34495E",
          },
        }}
      >
        <Modal
          title="ตะกร้าสินค้า"
          width={1200}
          open={isModalCartOpen}
          onCancel={handleshopCancel}
          footer={
            <>
              <Space
                direction="horizontal"
                size="middle"
                style={{ display: "flex", justifyContent: "end" }}
              >
                <Button onClick={() => setIsModalCartOpen(false)}>ปิด</Button>
                {itemsCart.length > 0 && (
                  <Button type="primary" onClick={handleshopOk}>
                    สั่งซื้อสินค้า
                  </Button>
                )}
              </Space>
            </>
          }
        >
          <div mode="horizontal">
            <ConfigProvider
              theme={{
                token: {
                  colorBgBase: "#FFFFFF",
                },
              }}
            >
              {itemsCart.map((list) => (
                <Card
                  hoverable
                  style={{
                    marginTop: 5,
                  }}
                >
                  <Row align="middle" gutter={[24, 0]}>
                    <Col align="center" xs={2} sm={2} md={2} lg={2} xl={2}>
                      <Button
                        onClick={() =>
                          HandleDelProductInCart(list.prod_code, list.size_name)
                        }
                        type="link"
                        icon={<MinusCircleTwoTone twoToneColor="#eb2f96" />}
                      ></Button>
                    </Col>
                    <Col align="center" xs={20} sm={22} md={6} lg={6} xl={6}>
                      <p
                        style={{
                          margin: 30,
                        }}
                      >
                        {list.prod_name}&nbsp;&nbsp;&nbsp;{list.size_name}
                      </p>
                    </Col>
                    <Col align="center" xs={24} sm={10} md={8} lg={8} xl={8}>
                      {/* <Image
                      width={60}
                      src="https://promotions.co.th/wp-content/uploads/2022/05/Nomjit-female-student-shirt.jpg"
                    /> */}
                      <Carousel
                        autoplay
                        autoplaySpeed={7000}
                        draggable={true}
                        arrows={true}
                      >
                        {list.pic.map((pic) => (
                          <div key={pic.uid}>
                            <Image
                              width={100}
                              height={60}
                              preview={true}
                              src={pic.url}
                              alt={`Image ${pic.name}`}
                            />
                          </div>
                        ))}
                      </Carousel>
                    </Col>

                    <Col align="center" xs={12} sm={7} md={4} lg={4} xl={4}>
                      <InputNumber
                        min={1}
                        max={99}
                        value={list.amount}
                        onChange={(value) =>
                          handleCartAmountChange(
                            list.prod_code,
                            list.size_id,
                            value
                          )
                        }
                      />
                    </Col>
                    <Col align="center" xs={12} sm={7} md={4} lg={4} xl={4}>
                      <p style={{ paddingTop: 15 }}>
                        {list.price
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                        ฿
                      </p>
                    </Col>
                  </Row>
                </Card>
              ))}
              <Card hoverable style={{ marginTop: 30 }}>
                <Row align="middle" gutter={[24, 0]}>
                  <Col align="center" span={6}>
                    {" "}
                    <h3 style={{ paddingTop: 17 }}>รวม</h3>
                  </Col>
                  <Col align="right" span={12}>
                    <h3 style={{ paddingTop: 17 }}>
                      {itemsCart
                        .reduce((accumulator, currentValue) => {
                          return (
                            accumulator +
                            currentValue.amount * currentValue.price
                          );
                        }, 0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </h3>
                  </Col>
                  <Col align="right" span={6}>
                    <h3
                      style={{
                        paddingTop: 17,
                      }}
                    >
                      บาท
                    </h3>
                  </Col>
                </Row>
              </Card>
            </ConfigProvider>
          </div>
        </Modal>
      </ConfigProvider>
      {/* Modal ของ สินค้า */}
      <Modal
        width={1000}
        onCancel={handlemodalProdClose}
        open={isModalproductOpen}
        footer={
          <>
            <Space
              direction="horizontal"
              size="middle"
              style={{ display: "flex", justifyContent: "end" }}
            >
              {amountProd > 0 && (
                <Button
                  type="primary"
                  onClick={() => {
                    AddProdInCart();
                  }}
                >
                  เพิ่มลงตะกล้าสินค้า
                </Button>
              )}
              <Button onClick={handlemodalProdClose}>ยกเลิก</Button>
            </Space>
          </>
        }
      >
        <Form
          form={formProd}
          layout="vertical"
          name="form_in_modal"
          initialValues={{}}
        >
          <Row gutter={[24, 0]}>
            <Col align="center" xs={24} sm={24} md={8} lg={8} xl={8}>
              {/* <Image
              style={{ paddingTop: 30 }}
              width={200}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSwx6kmN9-XsHJxbAvTFMvOdZn7TK9LJ4OoPe0k5BSZGqnygwepwVJL21gsqUvMNri_LI&usqp=CAU"
            /> */}
              <Carousel
                style={{ paddingTop: "35%" }}
                autoplay
                autoplaySpeed={7000}
                draggable={true}
                arrows={true}
              >
                {PicProd.map((file) => (
                  <div key={file.uid}>
                    <Image
                      preview={true}
                      src={file.url}
                      alt={`Image ${file.name}`}
                    />
                  </div>
                ))}
              </Carousel>
            </Col>
            <Col
              style={{ paddingTop: 15 }}
              xs={24}
              sm={24}
              md={15}
              lg={15}
              xl={15}
            >
              <Row gutter={[24, 0]} style={{ padding: 30 }}>
                <Col
                  style={{ padding: 10 }}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <h2>{IsProd.prod_name}</h2>
                </Col>
                <Divider plain>ขนาด</Divider>
                <Col
                  style={{ padding: 10 }}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                >
                  {/* <Segmented options={["S", "M", "L", "X", "XL"]} /> */}
                  <Form.Item name="size_prod">
                    <Select
                      showSearch
                      style={{ height: 40, width: 130 }}
                      placeholder="เลือกขนาดสินค้า"
                      onChange={(val) => {
                        Checkamount(val);
                      }}
                    >
                      <Option value="" selected>
                        - เลือกขนาด -
                      </Option>
                      {itemsSize.map((option) => (
                        <Option key={option.value} value={option.value}>
                          {option.label}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Divider plain>จำนวน</Divider>
                <Col
                  style={{ padding: 10 }}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                >
                  <Form.Item name="amount_prod">
                    <InputNumber
                      style={{
                        width: 130,
                      }}
                      min={0}
                      max={maxProd}
                      defaultValue={0}
                      onChange={(val) => {
                        setamountProd(val);
                      }}
                    />
                  </Form.Item>
                  <span style={{ color: "red" }}> {alertAmount}</span>
                </Col>
                <Divider plain>ราคา</Divider>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  {/* <span style={{ float: "right" }}>รวม</span> */}
                  <span style={{ fontSize: 40, float: "right" }}>
                    {IsProd.price}
                  </span>
                  <span style={{ fontSize: 40, float: "right" }}>฿</span>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>
      {/* แจ้งเตือนปิดปรับปรุง */}
      <Modal
        cancelButtonProps={{ style: { display: "none" } }}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={handlenoticCancel}
        open={isModalnoticOpen}
      >
        <div className="sign-up-gateways ">
          <img className="width-20 uploadfile.pb-15" src={logo4} alt="logo 1" />
          <br></br>
          <br></br>
        </div>
        <br></br>
        <h1 style={{ color: "red", textAlign: "center" }}>
          ร้าน ชุดนักเรียนชัยรัตน์ <br></br>ปิดปรับปรุงชั่วคราว ขออภัยค่ะ{" "}
          <br></br>ติดต่อเรา<br></br>contact.chairat@gmail.com<br></br>Tel.
          0859001310
        </h1>
      </Modal>
    </>
  );
};

export default Login;
