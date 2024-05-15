import { SearchOutlined, ToolTwoTone, PlusOutlined, ArrowLeftOutlined, DollarOutlined  } from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate  } from 'react-router-dom';
import Highlighter from "react-highlight-words";
import { Button,Input,Space,Upload,Row,Col,Card,Select,Form,DatePicker,TimePicker , message,InputNumber} from "antd";
import Swal from "sweetalert2";
import EcommerceService from "../service/EcommerceService";
import Gopp from "../pages/PublicHeader";
import { BACKEND_URL_MAIN } from "../utils/util";
import '../assets/CSS.css';
function Payment() {
  const navigate  = useNavigate();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const { Option } = Select;
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {

  }, []);

  const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

  const handleGoToHome = () => {
    // กลับไปยังหน้าแรกสุด
    navigate('/');
  };
  const submitPayment = (dataform) => {
    if(fileList.length > 0){
    console.log(dataform)
    form.validateFields().then(value=>{
        EcommerceService.addPayment(value).then(respon => {
          const { status, data } = respon;
          if (status === 200 && data.status === '1') {
             Swal.fire({
              title: "<strong>ยืนยันชำระเงินสำเร็จ</strong>",
              icon: "success",
            });
            form.resetFields();
            setFileList([]);
        }else {
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
  }else{
    Swal.fire({
      title: "<strong>ยังไม่ได้อัพโหลด Slip โปรดอัพโหลด Slip</strong>",
      showConfirmButton: false,
      timer: 1500,
      icon: "warning",
    });
  }
  };
  //
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleChange = (info) => {
    console.log('FileList:', info.fileList);
    //setFileList(info.fileList);
  };
  const onUploadSuccess = (file) => {
    //debugger
    const newFile = {
      uid: file.uid,
      name: file.name,
      status: 'done',
      url : `${BACKEND_URL_MAIN}/upload_slip/` + file.uid+'_'+file.name,
    };
    setFileList((prevFileList) => [...prevFileList, newFile]);
    // console.log(file);
    // console.log('-----');
    // console.log(fileList);

  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const handleRemove = (file) => {
    //debugger
    // Your logic to remove the file
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newFileList);
    //message.success(`File deleted successfully`);
  };
  const onRemove = (file) => {
    console.log(fileList);
    //debugger
    try {
      const formData_Del = new FormData();
      formData_Del.append('file', file);
      formData_Del.append('uid', file.uid);
      EcommerceService.deletePic(formData_Del)
      .then(async (res) => {
        //debugger
        let { status, data } = res;
        if (status === 200 && data.status === '1') {
          handleRemove(file);
          
        } else {
          // alert(data.message)
        }
      })
    } catch (error) {
      message.error('Failed to delete file');
    }
    console.log(fileList);
  };
  const propsAdd = {
    customRequest: async ({ file, onSuccess, onError }) => {
      console.log(fileList);
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif']; // รายการสกุลไฟล์ที่อนุญาต
      const fileExtension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2); // สกุลไฟล์ของไฟล์ที่อัพโหลด
      if (!allowedExtensions.includes(`.${fileExtension.toLowerCase()}`)) {
        message.error('สกุลไฟล์ไม่ถูกต้อง');
        onError();
        return false;
      }else{
        const formData = new FormData();
        formData.append('file', file);
        formData.append('uid', file.uid);
        try {
          EcommerceService.uploadPic(formData)
          .then(async (res) => {
            //debugger
            let { status, data } = res;
            if (status === 200 && data.status === '1') {
              onUploadSuccess(file);
              onSuccess();
              message.success(`${file.name} file uploaded successfully`);
            } else {
              // alert(data.message)
            }
          })
        } catch (error) {
          onError(error);
          message.error(`${file.name} file upload failed.`);
        }
      }
      console.log(fileList);
    },
  };
  //

  return (
    <>
    <Gopp></Gopp>
    <div mode="horizontal"
    style={{
        padding: 19
      }}
    >
    <Card
        title="ยืนยันการชำระเงิน"
        bordered={false}
        style={{ color: "red", textAlign: "left" }}
    >
      <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              ชื่อ-นามสกุลผู้ติดต่อ <span style={{ color: 'red' }}>*</span>
              <Form.Item
                name="contact_name"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อ-นามสกุลผู้ติดต่อ!",
                  },
                ]}
              >
                <Input placeholder="ใส่ชื่อ-นามสกุลผู้ติดต่อ" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              เบอร์โทรศัพท์ <span style={{ color: 'red' }}>*</span>
              <Form.Item
                name="tel"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่เบอร์โทรศัพท์!",
                  },
                ]}
              >
                <Input placeholder="ใส่เบอร์โทรศัพท์" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              จำนวนเงิน <span style={{ color: 'red' }}>*</span>
              <Form.Item
                name="price"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่จำนวนเงิน!",
                  },
                ]}
              >
                <InputNumber min={1} max={99999}  placeholder="ใส่จำนวนเงิน"  style={{ width: '100%', height: 40}}/>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              วันที่ <span style={{ color: 'red' }}>*</span>
              <Form.Item
                name="date"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่วันที่!",
                  },
                ]}
              >
                <DatePicker style={{ width: '100%', height: 40}}/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              เวลา <span style={{ color: 'red' }}>*</span>
              <Form.Item
                name="time"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่เวลา!",
                  },
                ]}
              >
                <TimePicker format="HH:mm" style={{ width: '100%', height: 40}}/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              เลขใบสั่งซื้อ 
              <Form.Item
                name="so_no"
                defaultValue=" "
              >
                <Input placeholder="ใส่เลขใบสั่งซื้อ" />
              </Form.Item>
            </Col>
          </Row> 

          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              ชำระเข้าธนาคาร <span style={{ color: 'red' }}>*</span>
              <Form.Item
                name="bank"
                rules={[
                  {
                    required: true,
                    message: "โปรดเลือกตัวเลือก ธนาคาร!",
                  },
                ]}
              >
                <Select style={{ width: '100%', height: 40}}>
                <Option value="KTC">กรุงไทย</Option>
                <Option value="TTB">ทหารไทยธนชาต</Option>
                <Option value="KBANK">กสิกรไทย</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              รูปสลิป <span style={{ color: 'red' }}>*</span>
              <Form.Item
                name="slip"
                getValueFromEvent={(event) => { return event?.fileList}}
              >
                <Upload
                  {...propsAdd} 
                  onChange={handleChange}
                  fileList={fileList}
                  listType="picture-card"
                  onPreview={handlePreview}
                  onRemove={onRemove}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
            
          </Row>    

         <Row gutter={[8, 8]}>
            <Col span={12} > 
              <Space size="middle" style={{ display: 'flex', paddingTop :10 }} >
                <Button type="primary" onClick={handleGoToHome}  className='bg-secondary' icon={<ArrowLeftOutlined />}>
                  Back
                </Button>  
              </Space>
            </Col>
            <Col span={12} > 
              <Space size="middle" style={{ display: 'flex', justifyContent: 'flex-end', paddingTop :10 }} >
                <Button type="primary" onClick={() => {
                    form.validateFields().then((values) => {
                        submitPayment();
                    }).catch((info) => {
                        console.log("Validate Failed:", info);
                    });
                }}>
                ยืนยันการชำระเงิน
                </Button>  
              </Space>
            </Col>
          </Row> 
        </Form>
    </Card>
    
</div>
</>
);
}

export default Payment;
