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
import UserService from "../service/UserService";

function User() {
  const [AllUser, setAllUser] = useState("");
  const [OpenModalAdd, setOpenModalAdd] = useState(false);
  const [OpenModalEdit, setOpenModalEdit] = useState(false);
  const [OpenModalResetPassword, setOpenModalResetPassword] = useState(false);

  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [formReset] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const searchInput = useRef(null);

  useEffect(() => {
    GetUser();
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
      title: "User Code",
      dataIndex: "code",
      key: "code",
      hidden: "true",
      width: "10%",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      width: "20%",
      ...getColumnSearchProps("username"),
      sorter: (a, b) => a.username.length - b.username.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ชื่อ",
      dataIndex: "firstname",
      key: "firstname",
      width: "20%",
      ...getColumnSearchProps("firstname"),
      sorter: (a, b) => a.firstname.length - b.firstname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "นามสกุล",
      dataIndex: "lastname",
      key: "lastname",
      width: "20%",
      ...getColumnSearchProps("lastname"),
      sorter: (a, b) => a.lastname.length - b.lastname.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "ประเภท",
      dataIndex: "type",
      key: "type",
      width: "20%",
      ...getColumnSearchProps("type"),
      sorter: (a, b) => a.type.length - b.type.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "สถานะการใช้งาน",
      dataIndex: "statususer",
      key: "statususer",
      width: "20%",
      ...getColumnSearchProps("statususer"),
      sorter: (a, b) => a.statususer.length - b.statususer.length,
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
      width: "20%",
      fixed: "right",
      render: (text) => (
        <Button
          icon={<ToolTwoTone twoToneColor="#E74C3C" />}
          style={{ cursor: "pointer" }}
          danger
          onClick={(e) => showEditModal(text.code)}
        >
          แก้ใข
        </Button>
      ),
    },
  ].filter((item) => !item.hidden);

  const GetUser = () => {
    UserService.getUser()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllUser(data);
        }
      })
      .catch((err) => {});
  };

  const showEditModal = (data) => {
    UserService.getSupUser(data)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          formEdit.setFieldValue("Editusername", data.username);
          formEdit.setFieldValue("Editfirstname", data.firstname);
          formEdit.setFieldValue("Editlastname", data.lastname);
          formEdit.setFieldValue("Edittype", data.type);
          formEdit.setFieldValue("Edittel", data.tel);
          formEdit.setFieldValue("Editstatususer", data.statususer);
          formEdit.setFieldValue("Editcode", data.code);
          formReset.setFieldValue("Resetcode", data.code);

          setOpenModalEdit(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = (dataform) => {
    UserService.addUser(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetUser();
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
    UserService.editUser(dataform)
      .then(async (res) => {
        let { status, data } = res;
        if (status === 200) {
          if (data.status) {
            await Swal.fire({
              title: "<strong>สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetUser();
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
        title="เพิ่มผู้ใช้งาน"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        width={1000}
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
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              Username
              <Form.Item
                name="Addusername"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อผู้ใช้!",
                  },
                ]}
              >
                <Input placeholder="Username" style={{ height: 50 }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              Password
              <Form.Item
                name="Addpassword"
                rules={[{ required: true, message: "กรุณาใส่รหัสผ่าน!" }]}
              >
                <Input.Password placeholder="Password" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              ชื่อจริง
              <Form.Item
                name="Addfirstname"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อจริง!",
                  },
                ]}
              >
                <Input placeholder="ชื่อจริง" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              นามสกุล
              <Form.Item
                name="Addlastname"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อนามสกุล!",
                  },
                ]}
              >
                <Input placeholder="นามสกุล" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              ประเภท
              <Form.Item
                name="Addtype"
                rules={[
                  {
                    required: true,
                    message: "กรุณาระบุประเภท!",
                  },
                ]}
              >
                <Select
                  style={{ height: 40 }}
                  options={[
                    { value: "Admin", label: "Admin" },
                    { value: "User", label: "User" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              เบอร์โทรศัพท์
              <Form.Item name="AddTel">
                <Input placeholder="เบอร์โทรศัพท์" />
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
        title="แก้ไขผู้ใช้งาน"
        okText="Edit"
        cancelText="Cancel"
        onCancel={onCancel}
        width={1000}
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
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              Username
              <Form.Item
                name="Editusername"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อผู้ใช้!",
                  },
                ]}
              >
                <Input placeholder="Username" style={{ height: 50 }} disabled />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              Password
              <Form.Item name="Editpassword">
                <Input.Password
                  defaultValue="123456789"
                  placeholder="Password"
                  disabled
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={4} lg={4} xl={4}>
              <Form.Item label="รีเซ็ต Password">
                <Button
                  style={{ height: 40 }}
                  onClick={() => {
                    setOpenModalEdit(false);
                    setOpenModalResetPassword(true);
                  }}
                >
                  Reset
                </Button>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              ชื่อจริง
              <Form.Item
                name="Editfirstname"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อจริง!",
                  },
                ]}
              >
                <Input placeholder="ชื่อจริง" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              นามสกุล
              <Form.Item
                name="Editlastname"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อนามสกุล!",
                  },
                ]}
              >
                <Input placeholder="นามสกุล" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              ประเภท
              <Form.Item
                name="Edittype"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อจริง!",
                  },
                ]}
              >
                <Select
                  style={{ height: 40 }}
                  options={[
                    { value: "Admin", label: "Admin" },
                    { value: "User", label: "User" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              เบอร์โทรศัพท์
              <Form.Item name="Edittel">
                <Input placeholder="เบอร์โทรศัพท์" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              สถานการใช้งาน
              <Form.Item
                name="Editstatususer"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select
                  style={{ height: 40 }}
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
            </Col>
          </Row>
          <Form.Item name="Editcode">
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
          เพิ่มผู้ใช้งาน
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
        {OpenModalResetPassword && (
          <Modal
            open={OpenModalResetPassword}
            title="แก้ไขรหัสผ่าน"
            width={1000}
            onOk={() => {
              UserService.resetPassword(formReset.getFieldValue("Resetpassword"),formReset.getFieldValue("Resetcode")).then(async (res) => {
                let { status, data } = res;
                if (status === 200) {
                  if (data.status) {
                    await Swal.fire({
                      title: "<strong>สำเร็จ</strong>",
                      html: data.message,
                      icon: "success",
                    });
        
                    setOpenModalResetPassword(false);
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
              
            }}
            onCancel={() => setOpenModalResetPassword(false)}
          >
            <Form
              form={formReset}
              layout="vertical"
              name="form_in_modal"
              initialValues={{
                modifier: "public",
              }}
            >
              <Row gutter={[24, 0]}>
                <Col xs={24} sm={24} md={16} lg={16} xl={16}>
                  Password
                  <Form.Item
                    name="Resetpassword"
                  >
                    <Input.Password placeholder="Password" />
                  </Form.Item>
                  <Form.Item name="Resetcode">
                    <Input type="hidden" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        )}

        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table size="small" columns={columns} dataSource={AllUser} />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default User;
