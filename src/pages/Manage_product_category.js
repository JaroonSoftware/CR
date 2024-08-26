/* eslint-disable react-hooks/exhaustive-deps */
import { SearchOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import {
  Button,
  Input,
  Space,
  Table,
  Row,
  Col,
  Card,
  Modal,
  Form,
  Select,
  Badge
} from "antd";
import Swal from "sweetalert2";
import optionService from "../service/Options.service"
import ProductCategoryService from "../service/ProductCategoryService";

const Manage_product_category = () => {
  const [AllProductCategory, setAllProductCategory] = useState("");
  const optionRequest = optionService();
  const [itemsOptionProduct, setItemsOptionProduct] = useState([]);
  const [itemsOptionCategory, setItemsOptionCategory] = useState([]);
  const [itemsOptionSubCategory, setItemsOptionSubCategory] = useState([]);
  const [isSelectDisabled, setIsSelectDisabled] = useState(true);
  const [OpenModalAdd, setOpenModalAdd] = useState(false);
  const [formAdd] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const [itemsOptionChangeCategory, setItemsOptionChangeCategory] = useState("");


  const searchInput = useRef(null);
  useEffect(() => {
    ProductCategory();
    async function getItemOptionProduct(){
        const {data, status} =  await optionRequest.optionsItems({Option:"Product"}) 
        
        if(status === 200) setItemsOptionProduct(data.data); 
      } 
    async function getItemOptionCategory(){
        const {data, status} =  await optionRequest.optionsItems({Option:"Category"}) 
        
        if(status === 200) setItemsOptionCategory(data.data); 
      } 
      getItemOptionProduct();
      getItemOptionCategory();
  }, []);

  useEffect(() => {
    const handleCategoryChange = async() => {
      try {
        let para = {
            id : itemsOptionChangeCategory
        }
          const {data, status} =  await ProductCategoryService.getSubProductCategory(para);
          if(status === 200){
            if(data.data.length > 0){   
                setItemsOptionSubCategory(data.data); 
            }else{
                formAdd.setFieldsValue({ subctgy_id: undefined });
                setItemsOptionSubCategory([]); 
            }
          }
          setIsSelectDisabled(false); 
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      handleCategoryChange();
  }, [itemsOptionChangeCategory]);

  // const handleCategoryChange = async(value) => {
  // try {
  //   let para = {
  //       id : value
  //   }
  //     const {data, status} =  await ProductCategoryService.getSubProductCategory(para)
  //     debugger
  //     if(status === 200){
  //       if(data.data.length > 0){   
  //           setItemsOptionSubCategory(data.data); 
  //       }else{
  //           formAdd.setFieldsValue({ subctgy_id: undefined });
  //       }
  //     }
  //     //setIsSelectDisabled(false); 
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // }

  
  const doDelete = (id) => {
    let parm = {
      id : id 
    } 
    Swal.fire({
        title: "ยืนยัน การลบหมวดหมู่สินค้า?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
      }).then((result) => {
        if (result.isConfirmed) {
            ProductCategoryService.DeleteProductCategory(parm).then( res => {
                const { status, data } = res;
              if (status === 200 && data.status === '1') {
                Swal.fire({
                 title: "<strong>ลบหมวดหมู่สินค้าสำเร็จ</strong>",
                 html: data.message,
                 icon: "success",
               });
        
               ProductCategory();
             } else {
               Swal.fire({
                 title: "<strong>ผิดพลาด!</strong>",
                 html: data.message,
                 icon: "error",
               });
             }
            });   
        }
      });
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
              height: 40,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
              height: 40,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });  

  const ProductCategory = () => {
    ProductCategoryService.getProductCategory()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllProductCategory(data);
        }
      })
      .catch((err) => {});
  };


  const submitAdd = () => {
    formAdd.validateFields().then(value=>{
        ProductCategoryService.addProductCategory(value).then(respon => {
          const { status, data } = respon;
          if (status === 200 && data.status === '1') {
             Swal.fire({
              title: "<strong>สร้างประเภทสินค้าสำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            ProductCategory();
            setOpenModalAdd(false);
            formAdd.resetFields();
          } else {
            // alert(data.message)
            Swal.fire({
              title: "<strong>ผิดพลาด!</strong>",
              html: data.message,
              icon: "error",
            });
          }
        });
    })
    .catch((info) => {
      console.log("Validate Failed:", info);
    });;
  };

  const columns = [
    {
        title: "No",
        dataIndex: "id",
        key: "id",
        hidden: "true",
        width: "1%",
    },
    {
      title: "หมวดหมู่หลัก",
      dataIndex: "ctgy_name",
      key: "ctgy_name",
      width: "30%",
      ...getColumnSearchProps("ctgy_name"),
    },
    {
        title: "หมวดหมู่ย่อย",
        dataIndex: "subctgy_name",
        key: "subctgy_name",
        width: "30%",
        ...getColumnSearchProps("subctgy_name"),
      },
      {
        title: "สินค้า",
        dataIndex: "prod_name",
        key: "prod_name",
        width: "25%",
        ...getColumnSearchProps("prodty_name"),
      },
      {
        title: "Action",
        key: "operation",
        width: "15%",
        fixed: "right",
        render: (text) => (
            <Button
            icon={<DeleteOutlined twoToneColor="#E74C3C" />}
            style={{ cursor: "pointer" }}
            danger
            onClick={(e) => doDelete(text.id)}
          >
            Delete
          </Button>
          ),
      },
  ].filter((item) => !item.hidden);
  

  // const ModalAdd = ({ open, onCancel }) => {
  //   return (
  //     <Modal
  //       open={open}
  //       title="เพิ่ม หมวดหมู่สินค้า"
  //       onCancel={() => onCancel()}
  //       width={900}
  //       footer={
  //         <>
  //           <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
  //             <Button type='primary' onClick={()=>{submitAdd()}} >Create</Button>
  //             <Button onClick={() => onCancel()}>Cancel</Button> 
  //           </Space>
  //         </>
  //         }
  //     >
  //       <Form
  //         form={formAdd}
  //         layout="vertical"
  //         name="form_in_modal"
  //         initialValues={{}}
  //       >
  //       <Row gutter={[24, 0]}>
  //           <Col xs={24} sm={24} md={8} lg={8} xl={8}>
  //             หมวดหมู่
  //             <Form.Item name="ctgy_id" rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่!' }]}  >
  //               <Select
  //               showSearch
  //               style={{ height: 40 }}
  //               placeholder="เลือกหมวดหมู่"
  //               optionFilterProp="children"
  //               filterOption={(input, option) => (option?.label ?? '').includes(input)} 
  //               options={itemsOptionCategory}
  //               onChange={(val)=>{setItemsOptionChangeCategory(val)}}
  //               />
  //             </Form.Item> 
  //           </Col>
  //           <Col xs={24} sm={24} md={8} lg={8} xl={8}>
  //             หมวดหมู่ย่อย
  //             <Form.Item name="subctgy_id" rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่ย่อย!' }]}  >
  //               <Select
  //               showSearch
  //               style={{ height: 40 }}
  //               placeholder="เลือกหมวดหมู่ย่อย"
  //               optionFilterProp="children"
  //               filterOption={(input, option) => (option?.label ?? '').includes(input)} 
  //               options={itemsOptionSubCategory}
  //               disabled={isSelectDisabled}
  //               />
  //             </Form.Item>
  //           </Col>
  //           <Col xs={24} sm={24} md={8} lg={8} xl={8}>
  //             สินค้า
  //             <Form.Item name="prod_id" rules={[{ required: true, message: 'กรุณาเลือกสินค้า!' }]}  >
  //               <Select
  //               showSearch
  //               style={{ height: 40 }}
  //               placeholder="เลือกสินค้า"
  //               optionFilterProp="children"
  //               filterOption={(input, option) => (option?.label ?? '').includes(input)} 
  //               options={itemsOptionProduct}
  //               />
  //             </Form.Item> 
  //           </Col>
  //         </Row>
  //       </Form>
  //     </Modal>
  //   );
  // };

  return (
    <>
      <div className="layout-content">
        <Button
          type="primary"
          onClick={() => {
            setOpenModalAdd(true);
          }}
        >
          เพิ่ม หมวดหมู่สินค้า
        </Button>
        <br></br>
        <br></br>
        {/* <ModalAdd
          open={OpenModalAdd}
          onCancel={() => {
            setOpenModalAdd(false);
          }}
        /> */}
        <Modal
          open={OpenModalAdd}
          title="เพิ่ม หมวดหมู่สินค้า"
          onCancel={() => {
            setOpenModalAdd(false);
          }}
          width={900}
          footer={
            <>
              <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
                <Button type='primary' onClick={()=>{submitAdd()}} >Create</Button>
                <Button onClick={() => setOpenModalAdd(false) }>Cancel</Button> 
              </Space>
            </>
            }
        >
        <Form
          form={formAdd}
          layout="vertical"
          name="form_in_modal"
          initialValues={{}}
        >
        <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              หมวดหมู่
              <Form.Item name="ctgy_id" rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่!' }]}  >
                <Select
                showSearch
                style={{ height: 40 }}
                placeholder="เลือกหมวดหมู่"
                optionFilterProp="label"
                filterOption={(input, option) => (option?.label ?? '').includes(input)} 
                options={itemsOptionCategory}
                onChange={(val)=>{setItemsOptionChangeCategory(val)}}
                />
              </Form.Item> 
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              หมวดหมู่ย่อย
              <Form.Item name="subctgy_id" rules={[{ required: true, message: 'กรุณาเลือกหมวดหมู่ย่อย!' }]}  >
                <Select
                showSearch
                style={{ height: 40 }}
                placeholder="เลือกหมวดหมู่ย่อย"
                optionFilterProp="label"
                filterOption={(input, option) => (option?.label ?? '').includes(input)} 
                options={itemsOptionSubCategory}
                disabled={isSelectDisabled}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              สินค้า
              <Form.Item name="prod_id" rules={[{ required: true, message: 'กรุณาเลือกสินค้า!' }]}  >
                <Select
                showSearch
                style={{ height: 40 }}
                placeholder="เลือกสินค้า"
                optionFilterProp="label"
                filterOption={(input, option) => (option?.label ?? '').includes(input)} 
                options={itemsOptionProduct}
                />
              </Form.Item> 
            </Col>
          </Row>
        </Form>
        </Modal>
        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table size="small" columns={columns} dataSource={AllProductCategory} rowKey="id" />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Manage_product_category;
