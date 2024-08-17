import { SearchOutlined, DeleteOutlined  } from "@ant-design/icons";
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
import ProductSizeService from "../service/ProductSizeService";

const Manage_product_size = () => {
  const [AllProductSize, setAllProductSize] = useState("");
  const optionRequest = optionService();
  const [itemsOptionProduct, setItemsOptionProduct] = useState([]);
  const [itemsOptionSize, setItemsOptionSize] = useState([]);
  const [isSelectDisabled, setIsSelectDisabled] = useState(true);
  const [OpenModalAdd, setOpenModalAdd] = useState(false);
  const [formAdd] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const [itemsOptionChangeProduct, setItemsOptionChangeProduct] = useState("");


  const searchInput = useRef(null);
  useEffect(() => {
     ProductSize();
     async function getItemOptionProduct(){
         const {data, status} =  await optionRequest.optionsItems({Option:"Product"}) 
        
         if(status === 200) setItemsOptionProduct(data.data); 
       }
     getItemOptionProduct();
  }, []);

  useEffect(() => {
    const handleProductChange = async() => {
      try {
        let para = {
            id : itemsOptionChangeProduct
        }
          const {data, status} =  await ProductSizeService.getSizeByProduct(para);
          if(status === 200){
            if(data.data.length > 0){   
              setItemsOptionSize(data.data); 
            }else{
                formAdd.setFieldsValue({ size_id: undefined });
                setItemsOptionSize([]); 
            }
          }
          if(itemsOptionChangeProduct !== undefined && itemsOptionChangeProduct !== ''){
            setIsSelectDisabled(false); 
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      handleProductChange();
  }, [itemsOptionChangeProduct]);


  
  const doDelete = (id) => {
    let parm = {
      id : id 
    } 
    Swal.fire({
        title: "ยืนยัน การยกเลิกขนาดของสินค้า?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
      }).then((result) => {
        if (result.isConfirmed) {
            ProductSizeService.DeleteProductSize(parm).then( res => {
                const { status, data } = res;
              if (status === 200 && data.status === '1') {
                Swal.fire({
                 title: "<strong>ยกเลิกขนาดของสินค้าสำเร็จ</strong>",
                 html: data.message,
                 icon: "success",
               });
        
               ProductSize();
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

  const ProductSize = () => {
    ProductSizeService.getProductSize()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllProductSize(data);
        }
      })
      .catch((err) => {});
  };


  const submitAdd = () => {
    formAdd.validateFields().then(value=>{
        ProductSizeService.addProductSize(value).then(respon => {
          const { status, data } = respon;
          if (status === 200 && data.status === '1') {
             Swal.fire({
              title: "<strong>เพิ่มขนาดของสินค้าสำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            ProductSize();
            setOpenModalAdd(false);
            setIsSelectDisabled(true); 
            setItemsOptionChangeProduct("");
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
        width: "30%",
    },
    {
      title: "ขนาด",
      dataIndex: "size_name",
      key: "size_name",
      width: "25%",
      ...getColumnSearchProps("size_name"),
    },
    {
        title: "สินค้า",
        dataIndex: "prod_name",
        key: "prod_name",
        width: "25%",
        ...getColumnSearchProps("prod_name"),
      },
      {
        title: "Action",
        key: "operation",
        width: "5%",
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

  return (
    <>
      <div className="layout-content">
        <Button
          type="primary"
          onClick={() => {
            setOpenModalAdd(true);
          }}
        >
          เพิ่ม ขนาดของสินค้า
        </Button>
        {/* <ModalAdd
          open={OpenModalAdd}
          onCancel={() => {
            setOpenModalAdd(false);
          }}
        /> */}
        <Modal
          open={OpenModalAdd}
          title="เพิ่ม ขนาดของสินค้า"
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
              สินค้า
              <Form.Item name="prod_id" rules={[{ required: true, message: 'กรุณาเลือกสินค้า!' }]}  >
                <Select
                showSearch
                style={{ height: 40 }}
                placeholder="เลือกสินค้า"
                optionFilterProp="label"
                filterOption={(input, option) => (option?.label ?? '').includes(input)} 
                options={itemsOptionProduct}
                onChange={(val)=>{setItemsOptionChangeProduct(val)}}
                />
              </Form.Item> 
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              ขนาด
              <Form.Item name="size_id" rules={[{ required: true, message: 'กรุณาเลือกขนาด!' }]}  >
                <Select
                showSearch
                style={{ height: 40 }}
                placeholder="เลือกขนาด"
                optionFilterProp="label"
                filterOption={(input, option) => (option?.label ?? '').includes(input)} 
                options={itemsOptionSize}
                disabled={isSelectDisabled}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        </Modal>
        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table size="small" columns={columns} dataSource={AllProductSize} rowKey="id" />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Manage_product_size;
