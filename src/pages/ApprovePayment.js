import { SearchOutlined, ToolTwoTone } from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { Button,Input,Space,Table,Row,Col,Card,Modal,Form,Select,Badge,Upload} from "antd";
import Swal from "sweetalert2";
import { BACKEND_URL_MAIN } from "../utils/util";
import ApprovePaymentService from "../service/ApprovePaymentService";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function ApprovePayment() {
  const [AllPayment, setAllPayment] = useState("");
  const [OpenModalChkPayment, setOpenModalChkPayment] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [PaymentId, setPaymentId] = useState("");
  const [IsRead, setIsRead] = useState(false);
  const [itemsOptionOrderNo, setItemsOptionOrderNo] = useState([]);
  const [isOrderNo, setisOrderNo] = useState('');
  const [data, setData] = useState([]);
  const [ischeckvalue_sono, setischeckvalue] = useState('');
  useEffect(() => {
    GetPayment();
    async function getItemOptionOrderNo(){
      const {data, status} =  await ApprovePaymentService.GetOrderNo() 
      debugger
      if(status === 200) setItemsOptionOrderNo(data); 
    }
    getItemOptionOrderNo();

    if(OpenModalChkPayment){
      console.log(isOrderNo);
      if (data) {
        form.resetFields(['so_no'])
        setisOrderNo(data.so_no); // เลือกค่าที่ต้องการจากข้อมูลที่ได้รับจาก API
      }else{
        setisOrderNo('');
        form.resetFields();
      }
    }

  }, [OpenModalChkPayment]);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleCancelModal = () => {
    setFileList([]);
    setPaymentId("");
    setOpenModalChkPayment(false);
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
      title: "ชื่อ-นามสกุลผู้ติดต่อ",
      dataIndex: "contact_name",
      key: "contact_name",
      ...getColumnSearchProps("contact_name"),
    },
    {
        title: "เบอร์โทรศัพท์ ",
        dataIndex: "tel",
        key: "tel",
        ...getColumnSearchProps("tel"),
    },
    {
        title: "เลขใบสั่งซื้อ ",
        dataIndex: "so_no",
        key: "so_no",
        ...getColumnSearchProps("so_no"),
        sorter: (a, b) => a.so_no.localeCompare(b.so_no),
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "จำนวนเงิน ",
        dataIndex: "price",
        key: "price",
        ...getColumnSearchProps("price"),
        sorter: (a, b) => {
          const intA = parseInt(a.price.match(/-?\d{1,3}(?:,\d{3})*/)[0].replace(/,/g, ''), 10); 
          const intB = parseInt(b.price.match(/-?\d{1,3}(?:,\d{3})*/)[0].replace(/,/g, ''), 10);
          return intA - intB;
        },
        sortDirections: ["descend", "ascend"],
    },
    {
        title: "วันที่และเวลา ",
        dataIndex: "date_time",
        key: "date_time",
        ...getColumnSearchProps("date_time"),
        sorter: (a, b) => {
          const [datePartA, timePartA] = a.date_time.split(' ');
          const [dayA, monthA, yearA] = datePartA.split('-');
          const formattedDateStringA = `${yearA}${monthA}${dayA}${timePartA.replace(/:/g, '')}`;
          const dateA = parseInt(formattedDateStringA, 10);
      
          const [datePartB, timePartB] = b.date_time.split(' ');
          const [dayB, monthB, yearB] = datePartB.split('-');
          const formattedDateStringB = `${yearB}${monthB}${dayB}${timePartB.replace(/:/g, '')}`;
          const dateB = parseInt(formattedDateStringB, 10);

          return dateA - dateB;
        },
        sortDirections: ["descend", "ascend"],
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps("status"),
      render: (data) => {
        if(data === "อนุมัติการชำระเงิน"){ return <Badge status="success" text="อนุมัติการชำระเงิน" />}
        if(data === "รอตรวจสอบ"){ return <Badge color="yellow" text="รอตรวจสอบ" />}  
        if(data === "ไม่อนุมัติการชำระเงิน"){ return <Badge color="red" text="ไม่อนุมัติการชำระเงิน" />} 
      },
    },
    {
        title: "Action",
        key: "operation",
        fixed: "right",
        render: (text) => {
          if(text.status === "รอตรวจสอบ"){
            return <Button
            icon={<ToolTwoTone/>}
            style={{ cursor: "pointer" }}
            type="primary"
            ghost
            onClick={(e) => showDetailCheckPayment(text.id,'approve')}
            >
            ตรวจสอบ Slip
            </Button>
          }else {
            return <Button
            icon={<SearchOutlined/>}
            style={{ cursor: "pointer" }}
            type="primary"
            ghost
            onClick={(e) => showDetailCheckPayment(text.id,'read')}
            >
            รายละเอียด
            </Button>
          }
        },
    },
  ].filter((item) => !item.hidden);

  const GetPayment = () => {
    ApprovePaymentService.getApprovePayment()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllPayment(data);
        }
      })
      .catch((err) => {});
  };
  const showDetailCheckPayment = (data,action) => {
    
    if(action === 'read'){ setIsRead(true) } else if(action === 'approve'){ setIsRead(false)}
    let para = {
      id : data
    }
    ApprovePaymentService.getApprovePaymentByid(para)
    .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setData(data);
          //form.setFieldValue("so_no", data.so_no);
          form.setFieldValue("contact_name", data.contact_name);
          form.setFieldValue("tel", data.tel); 
          form.setFieldValue("price", parseFloat(data.price).toLocaleString()); 
          form.setFieldValue("date_payment", data.date_payment);          
          form.setFieldValue("time_payment", data.time); 
          form.setFieldValue("bank", data.bank); 
          setPaymentId(data.id);
          setisOrderNo(data.so_no);
          if(data.slip !== ''){
          const formattedFileList = [{
            id: data.id,
            status: 'done',
            url: `${BACKEND_URL_MAIN}/upload_slip/` + data.slip,
          }];
          setFileList(formattedFileList);
          form.setFieldsValue({ slip: formattedFileList });
          //Check
          debugger
          if(itemsOptionOrderNo.find(obj => obj["value"] === data.so_no)){ 
            setischeckvalue({so_no : data.so_no});
          }else{
            setischeckvalue({});
          }
        }
        setOpenModalChkPayment(true);
        }
      })
      .catch((err) => {});
      
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const handleCancel = () => setPreviewOpen(false);
  const CancelPayment = (id) => {
    let parm = {
      id : id,
      action : "Cancel"
    } 
    Swal.fire({
        title: "ยืนยัน ยกเลิกการชำระเงิน?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
      }).then((result) => {
        if (result.isConfirmed) {
            ApprovePaymentService.CancelPayment(parm).then( res => {
                const { status, data } = res;
              if (status === 200 && data.status === '1') {
                Swal.fire({
                 title: "<strong>ยกเลิกการชำระเงินสำเร็จ</strong>",
                 icon: "success",
               });
        
               GetPayment();
               form.resetFields();
               setFileList([]);
               setPaymentId("");
               setOpenModalChkPayment(false);
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
  const AppovePay = () => {
    // let parm = {
    //   id : id,
    //   action : "Approve"
    // } 
    form.setFieldValue("id", PaymentId);
    form.setFieldValue("action", "Approve");
    form.validateFields().then(value=>{
    Swal.fire({
        title: "ยืนยัน การชำระเงิน?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
      }).then((result) => {
        if (result.isConfirmed) {
            ApprovePaymentService.ApprovePayment(value).then( res => {
                const { status, data } = res;
              if (status === 200 && data.status === '1') {
                Swal.fire({
                 title: "<strong>ยืนยันการชำระเงินสำเร็จ</strong>",
                 icon: "success",
               });
        
               GetPayment();
               form.resetFields();
               setFileList([]);
               setPaymentId("");
               setOpenModalChkPayment(false);
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
    })
    .catch((info) => {
      console.log("Validate Failed:", info);
    });  
      
  }
  return (
    <>
    <Modal
          open={OpenModalChkPayment}
          title="ตรวจสอบการชำระเงิน"
          onCancel={handleCancelModal}
          width={1000}
          footer={
            <>
              <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
                {!IsRead && <Button type='primary' danger onClick={()=>{CancelPayment(PaymentId)}}>ยกเลิกการชำระเงิน</Button>}
                {!IsRead && <Button type='primary' onClick={()=>{AppovePay()}} >ยืนยันการชำระเงินถูกต้อง</Button>}
                <Button onClick={handleCancelModal}>Cancel</Button> 
              </Space>
            </>
            }
        >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={ischeckvalue_sono}
        >
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={4} lg={4} xl={4}>
              เลขที่คำสั่งซื้อ
              {/* <Form.Item
                name="so_no"
              >
              <Input />
            </Form.Item> */}
            <Form.Item name="so_no" rules={[{ required: true, message: 'กรุณาเลือก เลขที่คำสั่งซื้อ!'}]}  >
                <Select
                showSearch
                defaultValue={isOrderNo}
                style={{ height: 40 }}
                optionFilterProp="label"
                filterOption={(input, option) => (option?.label ?? '').includes(input)} 
                options={itemsOptionOrderNo}
                disabled={IsRead}
                />
            </Form.Item> 
            {/* <Form.Item name="so_no" rules={[{ required: true, message: 'กรุณาเลือก เลขที่คำสั่งซื้อ!' }]}  >
              <AutoComplete
                placeholder="Type to search..."
                filterOption={filterOption}
                style={{ height: 40 , width: '100%' }}
                
              >
                {itemsOptionOrderNo.map(option => (
                  <Option Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </AutoComplete>
            </Form.Item>   */}
            
          </Col>
          <Col xs={24} sm={24} md={13} lg={13} xl={13}>
            ชื่อ-นามสกุลผู้ติดต่อ
            <Form.Item name="contact_name" >
              <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={7} lg={7} xl={7}>
            เบอร์โทรศัพท์ 
            <Form.Item
              name="tel"
            >
            <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            จำนวนเงินที่ชำระ
            <Form.Item
              name="price"
            >
            <Input disabled={IsRead} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            วันที่ 
            <Form.Item
              name="date_payment"
            >
            <Input disabled/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            เวลา  
            <Form.Item
              name="time_payment"
            >
            <Input disabled/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            ชำระเข้าธนาคาร  
            <Form.Item
              name="bank"
            >
            <Input  disabled/>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              รูป Slip
              <Form.Item
                name="slip"
              >
              <Upload 
                  fileList={fileList}
                  listType="picture-card"
                  showUploadList={{
                    showRemoveIcon:false
                  }}
                  onPreview={handlePreview}
                >
                </Upload>
            </Form.Item>
          </Col>
          <Form.Item
            name="id"
            style={{ display: 'none' }} // หรือใช้ { visibility: 'hidden' }
          >
            <Input
            type="hidden"            
            />
          </Form.Item>
          <Form.Item
            name="action"
            style={{ display: 'none' }} // หรือใช้ { visibility: 'hidden' }
          >
            <Input
            type="hidden"            
            />
          </Form.Item>
        </Row>

        </Form>
        </Modal>
        <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>      
      <div className="layout-content">
        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table size="small" columns={columns} dataSource={AllPayment} rowKey="id" />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ApprovePayment;
