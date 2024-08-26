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
  Badge,
} from "antd";
import Swal from "sweetalert2";
import SizeService from "../service/SizeService";

function Size() {
  const [AllSize, setAllSize] = useState("");
  const [OpenModalAdd, setOpenModalAdd] = useState(false);
  const [OpenModalEdit, setOpenModalEdit] = useState(false);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  useEffect(() => {
    GetSize();
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
      title: "Size Code",
      dataIndex: "size_id",
      key: "size_id",
      hidden: "true",
      width: "1%",
    },
    {
      title: "ชื่อขนาด",
      dataIndex: "size_name",
      key: "size_name",
      width: "55%",
      ...getColumnSearchProps("size_name"),
    },
    {
      title: "สถานะการใช้งาน",
      dataIndex: "status",
      key: "status",
      width: "30%",
      ...getColumnSearchProps("statussize"),
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
      width: "15%",
      fixed: "right",
      render: (text) => (
        <Button
          icon={<ToolTwoTone/>}
          style={{ cursor: "pointer" }}
          type="primary"
          ghost
          onClick={(e) => showEditModal(text.size_id)}
        >
          แก้ไข
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);

  const GetSize = () => {
    SizeService.getSize()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllSize(data);
        }
      })
      .catch((err) => {});
  };

  const showEditModal = (data) => {
    let para = {
      id : data
    }
    SizeService.getSizeByid(para)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          
          formEdit.setFieldValue("Editsizename", data.size_name);
          formEdit.setFieldValue("Editstatus", data.status);
          formEdit.setFieldValue("Editsizeid", data.size_id);

          setOpenModalEdit(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    SizeService.addSize(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status == 1) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetSize();
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
        }
      })
      .catch((err) => {});
  };

  const submitEdit = (dataform) => {
    SizeService.editSize(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status == 1) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetSize();

          setOpenModalEdit(false);
          } else {
            // alert(data.message)
            Swal.fire({
              title: "<strong>ผิดพลาด!</strong>",
              html: data.message,
              icon: "error",
            });
          }
        }
      })
      .catch((err) => {});
  };

  ////////////////////////////////

  const ModalAdd = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="เพิ่มขนาด"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          formAdd
            .validateFields()
            .then((values) => {
              // formAdd.resetFields();
              // console.log(values)
              submitAdd(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
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
            name="Addsizename"
            rules={[
              {
                required: true,
                message: "กรุณาใส่ชื่อขนาดสินค้า!",
              },
            ]}
          >
            <Input placeholder="ใส่ชื่อขนาดสินค้า" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const ModalEdit = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="แก้ไขขนาด"
        okText="Edit"
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
          }}
        >
          <Form.Item
            name="Editsizename"
            rules={[
              {
                required: true,
                message: "กรุณากรอกชื่อขนาดสินค้า",
              },
            ]}
          >
            <Input placeholder="ใส่ชื่อขนาดสินค้า" />
          </Form.Item>
          <Form.Item name="Editstatus">
            <Select
              style={{ width: 150 }}
              // disabled={isEdit}
              options={[
                {
                  value: "Y",
                  label: <Badge status="success" text="เปิดการใช้งาน" />,
                },
                {
                  value: "N",
                  label: <Badge status="error" text="ปิดการใช้งาน" />,
                },
              ]}
            />
          </Form.Item>
          <Form.Item name="Editsizeid">
            <Input type="hidden" />
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
          เพิ่มขนาด
        </Button>
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
        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table size="small" columns={columns} dataSource={AllSize} rowKey="sizecode" />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Size;
