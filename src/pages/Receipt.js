/* eslint-disable react-hooks/exhaustive-deps */
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
  InputNumber
} from "antd";
import Swal from "sweetalert2";
import ReceiptService from "../service/ReceiptService";

const Receipt = () => {
  const [AllReceipt, setAllReceipt] = useState("");
  const [itemsOptionSo_No, setItemsOptionSo_No] = useState([]);
  const [OpenModalAdd, setOpenModalAdd] = useState(false);
  const [OpenModalEdit, setOpenModalEdit] = useState(false);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [ReceiptNo, setReceiptNo] = useState("");

  useEffect(() => {
    GetAllReceipt();
    async function getItemOptionOrderNo(){
        const {data, status} =  await ReceiptService.getOrderNo() 
        debugger
        if(status === 200) setItemsOptionSo_No(data); 
      }
      getItemOptionOrderNo();

  }, [OpenModalAdd]);

  const doDelete = (id) => {
    let parm = {
      id : id,
      action : 'Cancel'
    } 
    Swal.fire({
        title: "ยืนยัน การยกเลิกใบเสร็จรับเงิน ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
      }).then((result) => {
        if (result.isConfirmed) {
            ReceiptService.CancelReceipt(parm).then( res => {
                const { status, data } = res;
              if (status === 200 && data.status === '1') {
                Swal.fire({
                 title: "<strong>ยกเลิกใบเสร็จรับเงินสำเร็จ</strong>",
                 html: data.message,
                 icon: "success",
               });
               setOpenModalEdit(false);
               GetAllReceipt();
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

  const showEdit = (data) => {
    let para = {
      id : data
    }
    ReceiptService.getReceiptById(para)
      .then((res) => {
        
        let { status, data } = res;
        if (status === 200) {
            debugger;
          formEdit.setFieldValue("Editso_no", data.so_no);
          formEdit.setFieldValue("Edit_amounts", data.amounts);
          formEdit.setFieldValue("rcpt_no", data.rcpt_no);  
          setReceiptNo(data.rcpt_no);
          setOpenModalEdit(true);
        }
      })
      .catch((err) => {});
  };

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

  const GetAllReceipt = () => {
    ReceiptService.getAllReceipt()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
            setAllReceipt(data);
        }
      })
      .catch((err) => {});
  };


  const submitAdd = () => {
    formAdd.validateFields().then(value=>{
        ReceiptService.addReceipt(value).then(respon => {
          const { status, data } = respon;
          if (status === 200 && data.status === '1') {
             Swal.fire({
              title: "<strong>เพิ่มใบเสร็จรับเงินสำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            GetAllReceipt();
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

  const submitEdit = () => {
    formEdit.validateFields().then(value=>{
        ReceiptService.UpdateReceipt(value).then(async (res) => {
            let { status, data } = res;
            if (status === 200 && data.status === '1') {
              await Swal.fire({
                title: "<strong>แก้ไขใบเสร็จรับเงินสำเร็จ</strong>",
                html: data.message,
                icon: "success",
              });
    
              GetAllReceipt();
              setOpenModalEdit(false);
            } else {
              Swal.fire({
                title: "<strong>ผิดพลาด!</strong>",
                html: data.message,
                icon: "error",
              });
            }
          })
    })
    .catch((info) => {
      console.log("Validate Failed:", info);
    });
  };

  const columns = [
    {
        title: "No",
        dataIndex: "id",
        key: "id",
        hidden: "true",
    },
    {
      title: "เลขที่ใบเสร็จ",
      dataIndex: "rcpt_no",
      key: "rcpt_no",
      width: "25%",
      ...getColumnSearchProps("rcpt_no"),
      sorter: (a, b) => a.rcpt_no.length - b.rcpt_no.length,
      sortDirections: ["descend", "ascend"],
    },
    {
        title: "เลขที่คำสั่งซื้อ",
        dataIndex: "so_no",
        key: "so_no",
        width: "25%",
        ...getColumnSearchProps("so_no"),
        sorter: (a, b) => a.so_no.length - b.so_no.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "จำนวนเงิน",
        dataIndex: "amounts",
        key: "amounts",
        width: "25%",
        ...getColumnSearchProps("amounts"),
        sorter: (a, b) => a.amounts.length - b.amounts.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "สถานะ",
        dataIndex: "status",
        key: "status",
        ...getColumnSearchProps("status"),
        sorter: (a, b) => a.status.length - b.status.length,
        sortDirections: ["descend", "ascend"],
        render: (data) => {
          if(data === "1"){ return <Badge status="success" text="ชำระเงินสำเร็จ" />}
          if(data === "ยกเลิก"){ return <Badge color="red" text="ยกเลิก" />} 
        },
      },
      {
        title: "Action",
        key: "operation",
        width: "25%",
        fixed: "right",
        render: (text) => {
            if(text.status !== "ยกเลิก"){
              return <Button
              icon={<ToolTwoTone/>}
              style={{ cursor: "pointer" }}
              type="primary"
              ghost
              onClick={(e) => showEdit(text.rcpt_no)}
              >
              Edit
              </Button>
            }
          },
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
          เพิ่ม ใบเสร็จรับเงิน
        </Button>
        <br></br>
        <br></br>
        <Modal
          open={OpenModalAdd}
          title="เพิ่ม ใบเสร็จรับเงิน"
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
                เลขที่คำสั่งซื้อ
                <Form.Item name="so_no" rules={[{ required: true, message: 'กรุณาเลือก เลขที่คำสั่งซื้อ!'}]}  >
                    <Select
                    showSearch
                    style={{ height: 40 }}
                    optionFilterProp="label"
                    filterOption={(input, option) => (option?.label ?? '').includes(input)} 
                    options={itemsOptionSo_No}
                    />
                </Form.Item>  
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                จำนวนเงิน
                <Form.Item
                name="amounts"
                rules={[{ required: true, message: 'กรุณากรอก จำนวนเงิน!'}]}
                >
                <InputNumber
                    min={1} max={9999999}
                    style={{ width: '100%', height : 40}}
                />
                </Form.Item>
            </Col>
          </Row>
        </Form>
        </Modal>

        <Modal
          open={OpenModalEdit}
          title="แก้ไข ใบเสร็จรับเงิน"
          onCancel={() => {
            setOpenModalEdit(false);
          }}
          width={900}
          footer={
            <>
              <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
                <Button type='primary' danger onClick={()=>{doDelete(ReceiptNo)}}>ยกเลิกใบสั่งซื้อ</Button>
                <Button type='primary' onClick={()=>{submitEdit()}} >Update</Button>
                <Button onClick={() => setOpenModalEdit(false) }>Cancel</Button> 
              </Space>
            </>
            }
        >
        <Form
          form={formEdit}
          layout="vertical"
          name="form_in_modal"
          initialValues={{}}
        >
        <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                เลขที่คำสั่งซื้อ
                <Form.Item name="Editso_no" >
                 <Input  disabled/>
                </Form.Item>  
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                จำนวนเงิน
                <Form.Item
                name="Edit_amounts"
                rules={[{ required: true, message: 'กรุณากรอก จำนวนเงิน!'}]}
                >
                <InputNumber
                    min={1} max={9999999}
                    style={{ width: '100%', height : 40}}
                />
                </Form.Item>
                <Form.Item
                    name="rcpt_no"
                    style={{ display: 'none' }} // หรือใช้ { visibility: 'hidden' }
                >
                <Input  type="hidden" />
                </Form.Item>
            </Col>
          </Row>
        </Form>
        </Modal>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table columns={columns} dataSource={AllReceipt} rowKey="rcpt_no" />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Receipt;
