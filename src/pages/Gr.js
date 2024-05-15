/* eslint-disable react-hooks/exhaustive-deps */
import { SearchOutlined, ToolTwoTone,DeleteFilled  } from "@ant-design/icons";
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
  DatePicker,
  Divider,
  InputNumber,
} from "antd";
import Swal from "sweetalert2";
import GRService from "../service/GRService";
import dayjs from 'dayjs';

const Gr = () => {
  const [AllGR, setAllGR] = useState("");
  const [OpenModalAddGR, setOpenModalAddGR] = useState(false);
  const [OpenModalReadGR, setOpenModalReadGR] = useState(false);
  const [formAdd] = Form.useForm();
  const [formRead] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [itemsOptionSupplier, setItemsOptionSupplier] = useState([]);
  const { Option } = Select;
  const { TextArea } = Input;
  const [itemsOptionPO, setItemsOptionPO] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [ItemProduct, setItemProduct] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [textAreaEditValue, setTextAreaEditValue] = useState('');
  const [dataSourceRead, setDataSourceRead] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);  

  const searchInput = useRef(null);
  useEffect(() => {
    
    ShowGR();
    
    async function getItemOptionPO(){
        const {data, status} =  await GRService.getOption({Option:"PO"}) 
        
        if(status === 200) setItemsOptionPO(data.data); 
    }
    getItemOptionPO(); 
    if (formSubmitted) {
        getItemOptionPO(); 
    }

  }, [formSubmitted]);

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
  
  const ShowGR = () => {
    GRService.getAllGR()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllGR(data);
        }
      })
      .catch((err) => {});
  };

  const handlemodalAddGrCancel = () => {
    // console.log('func_delAll')
    setOpenModalAddGR(false);
    formAdd.resetFields();
    setDataSource([]);
    setOpenModalAddGR(false);
  };

  const showDetailGRModal = (data) => {
    let para = {
      id : data
    }
    GRService.getGRByid(para)
      .then((res) => {
        let { status, data } = res;
        let data_gr = data.data[0];
        debugger
        if (status === 200) {
          formRead.setFieldValue("read_gr_no", data_gr.gr_code);
          formRead.setFieldValue("read_po_code", data_gr.po_code);
          formRead.setFieldValue("read_name_sup", data_gr.supname);
          formRead.setFieldValue("read_address_sup", data_gr.assdress);
          formRead.setFieldValue("read_gr_date" , data_gr.gr_date);
          formRead.setFieldValue("read_payment" , data_gr.payment);
          let detailGR = data.dataDetail;   
          const GRDetail = detailGR.map((data) => ({
            No: data.gr_no,
            po_code: data.po_code,
            prod_code: data.prod_code,
            prod_name: data.prod_name,
            amount: data.amount,
            unit_name: data.unit,
            size_name: data.size_name,
            discount: data.discount,
          }));
          setDataSourceRead(GRDetail);
          //formEdit.setFieldsValue({ EditItem : PoDetail });
          setOpenModalReadGR(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = () => {
    
    formAdd.setFieldsValue({ Item: dataSource });
    formAdd.validateFields().then(value=>{
        GRService.addGR(value).then(respon => {
          const { status, data } = respon;
          if (status === 200 && data.status === '1') {
             Swal.fire({
              title: "<strong>สร้างใบรับสินค้าสำเร็จ</strong>",
              html: "PO No."+data.message,
              icon: "success",
            });

            ShowGR();
            setOpenModalAddGR(false);
            formAdd.resetFields();
            setDataSource([]);
            setFormSubmitted(true);
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
    });
  };

  const ShowModalAddGR = () => {
    GRService.getGrNo()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          formAdd.setFieldValue("gr_no", data.gr_code);
          setOpenModalAddGR(true);
        }
      })
      .catch((err) => {});
  };

  const onChangePO = (data) => {
    let para = {
      id : data
    }
    GRService.getDetailPo(para)
      .then((res) => {
        let { status, data } = res;
        let data_po = data.data[0];
        if (status === 200) {
          formAdd.setFieldValue("name_sup", data_po.supname);
          formAdd.setFieldValue("address_sup", data_po.assdress);

          let detailPo = data.dataDetail;   
          console.log(detailPo);
          const PoDetail = detailPo.map((data) => ({
            podetail_id: data.id,
            No: data.no,
            po_code: data.po_code,
            prod_code: data.prod_code,
            prod_name: data.prod_name,
            amount_total: (data.amount-data.recamount),
            amount: (data.amount-data.recamount),
            recamount: data.recamount,
            unit_name: data.unit,
            size: data.size_name,
            size_id: data.size_id,
            price: data.price,
            discount: data.discount,
            status : data.statusItem,
          }));
          setDataSource(PoDetail);

        }
      })
      .catch((err) => {});
    // this.setState({someVal: e.target.value})
  }

  const handleRemoveRow = (key) => {
    const newDataSource = dataSource.filter(item => item.podetail_id !== key);
    setDataSource(newDataSource);
  };

  const handleTextBoxChange = (key, dataIndex, value) => {
    debugger
    console.log(dataSource)
    const newData = [...dataSource];
    const index = newData.findIndex(item => key === item.podetail_id);
    if (index > -1) {
      newData[index][dataIndex] = value;
      if(dataIndex === 'amount'){
        let total =  newData[index]['amount_total'];
        let amount =  newData[index]['amount'];
        if(amount > total){
          Swal.fire({
            title: "<strong>จำนวนสินค้าที่รับได้เกินกำหนด!</strong>",
            showConfirmButton: false,
            timer: 1500,
            icon: "warning",
          });
          newData[index]['amount'] = 0;
        }
      }
      if(dataIndex === 'discount'){
        let totalP =  newData[index]['price'] * newData[index]['amount'];
        let total =  totalP - (totalP * value)/100;
        newData[index]['total'] = total.toFixed(3);
      }
      if(dataIndex === 'price'){
        let totalP =  value * newData[index]['amount'];
        let total =  totalP - (totalP * newData[index]['discount'])/100;
        newData[index]['total'] = total.toFixed(3);
      }
      setDataSource(newData);
    }
  };


  const columnsDetailGr = [
    {
      title: '',
      dataIndex: 'prod_id',
      key: 'prod_id',
      className: 'hidden-column',  
    },
    {
      title: "ลำดับ",
      dataIndex: "No",
      key: "No",
      width: "10%",
    },
    {
        title: "ใบสั่งซื้อ",
        dataIndex: "po_code",
        key: "po_code",
    },
    {
      title: "รหัสสินค้า",
      dataIndex: "prod_code",
      key: "prod_code",
    },
    {
      title: "รายการสินค้า",
      dataIndex: "prod_name",
      key: "prod_name",
    },
    {
        title: "หน่วย",
        dataIndex: "unit_name",
        key: "unit_name",
    },
    {
        title: 'ขนาด',
        dataIndex: 'size',
        key: 'size',
    },
    {
        dataIndex: 'size_id',
        key: 'size_id',
        className: 'hidden-column',  
    },
    {
        dataIndex: 'podetail_id',
        key: 'podetail_id',
        className: 'hidden-column',  
    },
    {
      dataIndex: 'amount_total',
      key: 'amount_total',
      className: 'hidden-column',  
  },
    {
      title: 'จำนวนที่รับแล้ว',
      dataIndex: 'recamount',
      key: 'recamount',
    },
    {
        title: 'จำนวนที่รับ',
        dataIndex: 'amount',
        key: 'amount',
        render: (text, record) => (
          <InputNumber
            min={1} max={9999}
            value={record.amount} 
            onChange={(value) => handleTextBoxChange(record.podetail_id, 'amount' ,value)}
          />
        ),
    },
    {
        title: 'สถานะ',
        dataIndex: 'status',
        key: 'status',
    },
    {
      title: 'ส่วนลด %',
      dataIndex: 'discount',
      key: 'discount',
      className: 'hidden-column',  
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
            icon={<DeleteFilled  />}
            style={{ cursor: "pointer" }}
            danger
            onClick={() => handleRemoveRow(record.podetail_id)}
            className="custom-button"
          >
          </Button>
      ),
    },
  ];

  const columnsDetailGrRead = [

    {
      title: "ลำดับ",
      dataIndex: "No",
      key: "No",
      width: "10%",
    },
    {
        title: "ใบสั่งซื้อ",
        dataIndex: "po_code",
        key: "po_code",
    },
    {
      title: "รหัสสินค้า",
      dataIndex: "prod_code",
      key: "prod_code",
    },
    {
      title: "รายการสินค้า",
      dataIndex: "prod_name",
      key: "prod_name",
    },
    {
        title: "หน่วย",
        dataIndex: "unit_name",
        key: "unit_name",
    },
    {
        title: 'ขนาด',
        dataIndex: 'size_name',
        key: 'size_name',
    },
    {
      title: 'จำนวนที่รับแล้ว',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'ส่วนลด %',
      dataIndex: 'discount',
      key: 'discount',  
    },
  ];

  const columns = [
    {
        title: "No",
        dataIndex: "id",
        key: "id",
        hidden: "true",
        width: "10%",
    },
    {
      title: "เลขที่ GR",
      dataIndex: "gr_code",
      key: "gr_code",
      width: "15%",
      
      ...getColumnSearchProps("gr_code"),
      sorter: (a, b) => a.gr_code.length - b.gr_code.length,
      sortDirections: ["descend", "ascend"],
    },
    {
        title: "วันที่รับ",
        dataIndex: "gr_date",
        key: "gr_date",
        width: "15%",
        ...getColumnSearchProps("gr_date"),
        sorter: (a, b) => a.gr_date.length - b.gr_date.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "เลขที่ PO",
        dataIndex: "po_code",
        key: "po_code",
        width: "15%",
        ...getColumnSearchProps("po_code"),
        sorter: (a, b) => a.po_code.length - b.po_code.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "ผู้ขาย",
        dataIndex: "supname",
        key: "supname",
        width: "25%",
        ...getColumnSearchProps("supname"),
        sorter: (a, b) => a.supname.length - b.supname.length,
        sortDirections: ["descend", "ascend"],
      },
      // {
      //   title: "สถานะ",
      //   dataIndex: "status",
      //   key: "status",
      //   width: "15%",
      //   ...getColumnSearchProps("status"),
      //   sorter: (a, b) => a.status.length - b.status.length,
      //   sortDirections: ["descend", "ascend"],
      // },
      {
        title: "Action",
        key: "operation",
        width: "15%",
        fixed: "right",
        render: (text) => (
            <Button
            icon={<SearchOutlined  />}
            style={{ cursor: "pointer" }}
            type="primary"
            ghost
            onClick={(e) => showDetailGRModal(text.gr_code)}
          >
            Detail
          </Button>
          ),
      },
  ].filter((item) => !item.hidden);
  
  return (
    <>
      <div className="layout-content">
        <Button
          type="primary"
          onClick={ShowModalAddGR}
        >
          เพิ่ม ใบรับสินค้า
        </Button>
        <br></br>
        <br></br>
        {/* <ModalAdd
          open={OpenModalAdd}
          onCancel={() => {
            setOpenModalAdd(false);
          }}
        /> */}
        {/* PopUp ADD GR */}
        <Modal
          open={OpenModalAddGR}
          title="เพิ่ม ใบรับสินค้า"
          onCancel={handlemodalAddGrCancel}
          width={1200}
          footer={
            <>
              <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
                <Button type='primary' onClick={()=>{submitAdd()}} >Create</Button>
                <Button onClick={handlemodalAddGrCancel}>Cancel</Button> 
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
          <Col xs={24} sm={24} md={3} lg={3} xl={3}>
              เลขที่ใบ GR
              <Form.Item
                name="gr_no"
              >
              <Input  disabled/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            เลขที่ใบ PO
            <Form.Item name="po_code" >
              <Select
                showSearch
                style={{ height: 40 }}
                placeholder="เลือกใบ PO"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)} 
                options={itemsOptionPO}
                onSelect={(value) => onChangePO(value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={13} lg={13} xl={13}>
            ชื่อผู้ขาย
            <Form.Item
              name="name_sup"
            >
            <Input  disabled/>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              ที่อยู่ผู้ขาย
              <Form.Item
                name="address_sup"
              >
              <Input  disabled/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            วันที่รับสินค้า
            <Form.Item
              name="gr_date"
              rules={[{ required: true, message: 'Please select a date!' }]}
              style={{ width: '100%' }}
            >
            <DatePicker style={{ width: '100%' , height: 40}}/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            การชำระเงิน
            <Form.Item
              name="payment"
            >
            <Select placeholder="เลือก การชำระเงิน" style={{ height: 40 }}>
              <Option value="เงินสด">เงินสด</Option>
              <Option value="30 วัน">30 วัน</Option>
              <Option value="45 วัน">45 วัน</Option>
              <Option value="60 วัน">60 วัน</Option>
              <Option value="90 วัน">90 วัน</Option>
              <Option value="120 วัน">120 วัน</Option>
            </Select>
            </Form.Item>
            <Form.Item
            name="Item"
            style={{ display: 'none' }}
            ></Form.Item>
          </Col>
        </Row>
        <Divider style={{ margin: '5px 0' }}/>
         
        {/* Table detail PO */}
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
             <Table
                dataSource={dataSource}
                columns={columnsDetailGr}
                pagination={false}
                bordered
              />
          </Col>
        </Row>
        {/* End Table detail PO */}
        </Form>
        </Modal>
        {/* End PopUp ADD GR */}

        
        {/* PopUp Read GR */}
        <Modal
          open={OpenModalReadGR}
          title="ใบรับสินค้า"
          onCancel={() => {
            setOpenModalReadGR(false);
          }}
          width={1200}
          footer={
            <>
              <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
                <Button onClick={() => {setOpenModalReadGR(false);}}>Cancel</Button> 
              </Space>
            </>
            }
        >
        <Form
          form={formRead}
          layout="vertical"
          name="form_in_modal"
          initialValues={{}}
        >
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={3} lg={3} xl={3}>
              เลขที่ใบ GR
              <Form.Item
                name="read_gr_no"
              >
              <Input  disabled/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            เลขที่ใบ PO
            <Form.Item name="read_po_code" >
              <Input  disabled/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={13} lg={13} xl={13}>
            ชื่อผู้ขาย
            <Form.Item
              name="read_name_sup"
            >
            <Input  disabled/>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              ที่อยู่ผู้ขาย
              <Form.Item
                name="read_address_sup"
              >
              <Input  disabled/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            วันที่รับสินค้า
            <Form.Item
              name="read_gr_date"
            >
            <Input  disabled/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            การชำระเงิน
            <Form.Item
              name="read_payment"
            >
            <Input  disabled/>
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ margin: '5px 0' }}/>
         
        {/* Table detail */}
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
             <Table
                dataSource={dataSourceRead}
                columns={columnsDetailGrRead}
                pagination={false}
                bordered
              />
          </Col>
        </Row>
        {/* End Table detail */}
        </Form>
        </Modal>
        {/* End PopUp Read GR */}

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table columns={columns} dataSource={AllGR} rowKey="id" />
            </Card>
          </Col>
        </Row>

      </div>
    </>
  );
};

export default Gr;
