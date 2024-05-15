import { SearchOutlined } from "@ant-design/icons";
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
} from "antd";
import Swal from "sweetalert2";
import CategoryService from "../service/CategoryService";

const Category = () => {
  const [AllCategory, setAllCategory] = useState("");

  const [OpenModalAdd, setOpenModalAdd] = useState(false);
  const [OpenModalEdit, setOpenModalEdit] = useState(false);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");


  const searchInput = useRef(null);
  useEffect(() => {
    GetCategory();
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
        dataIndex: "ctgy_id",
        key: "ctgy_id",
        hidden: "true",
        width: "40%",
    },
    {
      title: "ชื่อหมวดหมู่",
      dataIndex: "ctgy_name",
      key: "ctgy_name",
      width: "40%",
      ...getColumnSearchProps("ctgy_name"),
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
    },
    {
        title: "Action",
        key: "operation",
        width: "40%",
        fixed: "right",
        render: (text) => (
            <span
              style={{ color: "#29f", cursor: "pointer" }}
              onClick={(e) => showEditModal(text.ctgy_id)}
            >
              Edit
            </span>
          ),
      },
  ].filter((item) => !item.hidden);

  const GetCategory = () => {
    CategoryService.getCategory()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllCategory(data);
        }
      })
      .catch((err) => {});
  };

  const showEditModal = (data) => {
    let para = {
      id : data
    }
    CategoryService.getCategoryByid(para)
      .then((res) => {
        debugger
        let { status, data } = res;
        if (status === 200) {
          formEdit.setFieldValue("Editcategoryname", data.ctgy_name);
          formEdit.setFieldValue("Editstatuscategory", data.status);
          formEdit.setFieldValue("Editcategoryid", data.ctgy_id);          

          setOpenModalEdit(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = () => {
    formAdd.validateFields().then(value=>{
      CategoryService.addCategory(value).then(respon => {
          const { status, data } = respon;
          debugger
          if (status === 200 && data.status === '1') {
             Swal.fire({
              title: "<strong>สร้างหมวดหมู่สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetCategory();
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
    CategoryService.editCategory(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200 && data.status === '1') {
          await Swal.fire({
            title: "<strong>แก้ไขหมวดหมู่สำเร็จ</strong>",
            html: data.message,
            icon: "success",
          });

          GetCategory();
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
        title="เพิ่มหมวดหมู่"
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
            name="Addcategoryname"
            rules={[
              {
                required: true,
                message: "กรุณาใส่ชื่อหมวดหมู่",
              },
            ]}
          >
            <Input placeholder="ใส่ชื่อหมวดหมู่" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const ModalEdit = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="แก้ไขหมวดหมู่"
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
            name="Editcategoryname"
            rules={[
              {
                required: true,
                message: "กรุณากรอกชื่อหมวดหมู่",
              },
            ]}
          >
            <Input
              placeholder="ใส่ชื่อหมวดหมู่"
            />
          </Form.Item>
          <Form.Item
            name="Editstatuscategory"
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
            name="Editcategoryid"
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
          เพิ่มหมวดหมู่
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
              <Table columns={columns} dataSource={AllCategory} />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );

  

};

export default Category;
