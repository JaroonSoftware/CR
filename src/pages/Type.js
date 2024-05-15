import { SearchOutlined, ToolTwoTone } from "@ant-design/icons";
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
import ProductTypeService from "../service/ProductTypeService";

const Type = () => {
  const [AllProductType, setAllProductType] = useState("");

  const [OpenModalAdd, setOpenModalAdd] = useState(false);
  const [OpenModalEdit, setOpenModalEdit] = useState(false);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");


  const searchInput = useRef(null);
  useEffect(() => {
    ProductType();
  }, []);

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

  const columns = [
    {
        title: "No",
        dataIndex: "prodty_id",
        key: "prodty_id",
        hidden: "true",
        width: "40%",
    },
    {
      title: "ประเภทสินค้า",
      dataIndex: "prodty_name",
      key: "prodty_name",
      width: "40%",
      ...getColumnSearchProps("prodty_name"),
      sorter: (a, b) => a.unit.length - b.unit.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "สถานะการใช้งาน",
      dataIndex: "status",
      key: "status",
      width: "20%",
      ...getColumnSearchProps("status"),
      sorter: (a, b) => a.statutype.length - b.statutype.length,
      sortDirections: ["descend", "ascend"],
      render: (data) => (
        <div>
          {data === "Y" ? (
            <Badge status="success" text="เปิดการใช้งาน" />
          ) : (
            <Badge status="error" text="ปิดการใช้การ" />
          )} 
        </div>
      ),
    },
    {
        title: "Action",
        key: "operation",
        width: "40%",
        fixed: "right",
        render: (text) => (
            <Button
            icon={<ToolTwoTone twoToneColor="#E74C3C" />}
            style={{ cursor: "pointer" }}
            danger
            onClick={(e) => showEditModal(text.prodty_id)}
          >
            แก้ใข
          </Button>
          ),
      },
  ].filter((item) => !item.hidden);

  const ProductType = () => {
    ProductTypeService.getProductType()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllProductType(data);
        }
      })
      .catch((err) => {});
  };
  

  const showEditModal = (data) => {
    let para = {
      id : data
    }
    ProductTypeService.getProductTypeByid(para)
      .then((res) => {
        
        let { status, data } = res;
        if (status === 200) {
          formEdit.setFieldValue("Editproducttypename", data.prodty_name);
          formEdit.setFieldValue("Editstatusproducttype", data.status);
          formEdit.setFieldValue("Editproducttypeid", data.prodty_id);          
          formEdit.setFieldValue("Editpreprod_code", data.preprod_code);          
          
          setOpenModalEdit(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = () => {
    formAdd.validateFields().then(value=>{
      ProductTypeService.addProductType(value).then(respon => {
          const { status, data } = respon;
          
          if (status === 200 && data.status === '1') {
             Swal.fire({
              title: "<strong>สร้างประเภทสินค้าสำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            ProductType();
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
    });
  };

  const submitEdit = (dataform) => {
    
    ProductTypeService.editProductType(dataform)
      .then(async (res) => {
        
        let { status, data } = res;
        if (status === 200 && data.status === '1') {
          await Swal.fire({
            title: "<strong>แก้ไขประเภทสินค้าสำเร็จ</strong>",
            html: data.message,
            icon: "success",
          });

          ProductType();
          setOpenModalEdit(false);
        } else {
          // alert(data.message)
          Swal.fire({
            title: "<strong>ผิดพลาด!</strong>",
            html: data.message,
            icon: "error",
          });
        }
      })
      .catch((err) => {});
  };



  const ModalAdd = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="เพิ่มประเภทสินค้า"
        onCancel={onCancel}
        footer={
          <>
            <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
              <Button type='primary' onClick={()=>{submitAdd()}} >Create</Button>
              <Button onClick={() => onCancel()}>Cancel</Button> 
            </Space>
          </>
          }
      >
        <Form
          form={formAdd}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            name="Addproducttypename"
            rules={[
              {
                required: true,
                message: "กรุณาใส่ชื่อประเภทสินค้า",
              },
            ]}
          >
            <Input placeholder="ใส่ชื่อประเภทสินค้า" />
          </Form.Item>
          <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            อักษรนำหน้า
              <Form.Item
                name="Addpreprod_code"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่อักษรนำหน้า!",
                  },
                ]}
              >
                <Input placeholder="อักษรนำหน้า 3 หลัก" maxLength={3} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  };

  const ModalEdit = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="แก้ไขประเภทสินค้า"
        okText="Update"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          formEdit
            .validateFields()
            .then((values) => {
              
              // formEdit.resetFields();
              // console.log(values)
              submitEdit(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form 
          form={formEdit} 
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}>
          <Form.Item
            name="Editproducttypename"
            rules={[
              {
                required: true,
                message: "กรุณากรอกชื่อประเภทสินค้า",
              },
            ]}
          >
            <Input
              placeholder="ใส่ชื่อประเภทสินค้า"
            />
          </Form.Item>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            อักษรนำหน้า
              <Form.Item
                name="Editpreprod_code"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่อักษรนำหน้า!",
                  },
                ]}
              >
                <Input placeholder="อักษรนำหน้า 3 หลัก" maxLength={3} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="Editstatusproducttype"
          >
            <Select
              style={{ width: 120 }}
              // disabled={isEdit}
              options={[
                { value: "Y", label: "เปิดใช้งาน" },
                { value: "N", label: "ปิดใช้งาน" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="Editproducttypeid"
            style={{ display: 'none' }} // หรือใช้ { visibility: 'hidden' }
          >
            <Input
            type="hidden"            
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  };
  return (
    <>
      <div className="layout-content">
        <Button
          type="primary"
          onClick={() => {
            setOpenModalAdd(true);
          }}
        >
          เพิ่มประเภทสินค้า
        </Button>
        <br></br>
        <br></br>
        <ModalAdd
          open={OpenModalAdd}
          onCancel={() => {
            setOpenModalAdd(false);
          }}
        />
        <ModalEdit
          open={OpenModalEdit}
          onCancel={() => {
            setOpenModalEdit(false);
          }}
        />
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table columns={columns} dataSource={AllProductType} />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Type;
