import { SearchOutlined, ToolTwoTone, PlusOutlined } from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { BACKEND_URL_MAIN } from "../utils/util";
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
  Upload,
  message,
  Badge
} from "antd";
import Swal from "sweetalert2";
import optionService from "../service/Options.service"
import ProductService from "../service/ProductService";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const Product = () => {
  const [AllProduct, setAllProduct] = useState("");
  const optionRequest = optionService();
  const [OpenModalAdd, setOpenModalAdd] = useState(false);
  const [OpenModalEdit, setOpenModalEdit] = useState(false);
  const [itemsOptionType, setItemsOptionType] = useState([]);
  const [itemsOptionUnit, setItemsOptionUnit] = useState([]);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [EditProdId, setEditProdId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const validateNumber = (rule, value, callback) => {
    if (!value || /^[0-9]+$/.test(value)) {
      callback(); // ไม่มีข้อผิดพลาด
    } else {
      callback('โปรดป้อนตัวเลขเท่านั้น');
    }
  };
  // ลบไฟล์ทั้งหมด
  // const handleDeleteAll = () => {
  //   // ส่งข้อมูลไปยังเซิร์ฟเวอร์ PHP เพื่อดำเนินการลบไฟล์
  //   ProductService.deleteAllPic(fileList)
  //   .then(response => {
  //       console.log(response.data);
  //       // หลังจากลบไฟล์ที่สำเร็จ ปรับ state ใน ReactJS
  //       setFileList([]);
  //     })
  //     .catch(error => {
  //       console.error('Error deleting files:', error);
  //     });
  // };
  const handleCancel = () => setPreviewOpen(false);
  const handlemodalAddCancel = () => {
    // console.log('func_delAll')
    setOpenModalAdd(false);
    formAdd.resetFields();
    if(fileList.length > 0){
      //debugger
      ProductService.deleteAllPic({fileList})
      .then(response => {
          console.log(response.data);
          // หลังจากลบไฟล์ที่สำเร็จ ปรับ state ใน ReactJS
          setFileList([]);
        })
        .catch(error => {
          console.error('Error deleting files:', error);
        });
    }
    setOpenModalAdd(false);
  };
  const onUploadSuccess = (file) => {
    //debugger
    const newFile = {
      uid: file.uid,
      name: file.name,
      status: 'done',
      url : `${BACKEND_URL_MAIN}/uploads/` + file.uid+'_'+file.name,
    };
    setFileList((prevFileList) => [...prevFileList, newFile]);
    // console.log(file);
    // console.log('-----');
    // console.log(fileList);

  };
  const onUploadSuccessUpdate = (file,prod_img_id) => {
    //debugger
    const newFile = {
      prod_img_id: prod_img_id,
      uid: file.uid,
      name: file.name,
      status: 'done',
      url : `${BACKEND_URL_MAIN}/uploads/` + file.uid+'_'+file.name,
    };
    console.log(newFile);
    //debugger
    setFileList((prevFileList) => [...prevFileList, newFile]);
    console.log(file);
    console.log('-----');
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
          ProductService.uploadPic(formData)
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
  const propsUpdate = {
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
        formData.append('prod_id', EditProdId);
        try {
          ProductService.uploadPic(formData)
          .then(async (res) => {
            //debugger
            let { status, data } = res;
            if (status === 200 && data.status === '1') {
              onSuccess();
              onUploadSuccessUpdate(file,data.id);
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
  const handleChange = (info) => {
    console.log('FileList:', info.fileList);
    //setFileList(info.fileList);
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };
  const onRemove = (file) => {
    console.log(fileList);
    //debugger
    try {
      const formData_Del = new FormData();
      formData_Del.append('file', file);
      formData_Del.append('uid', file.uid);
      ProductService.deletePic(formData_Del)
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

  const showRemoveConfirmation = (file) => {
    //debugger
    Swal.fire({
      title: "ยืนยัน ลบรูปสินค้า?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก"
    }).then((result) => {
      if (result.isConfirmed) {
        const formData_DelUpdate = new FormData();
        formData_DelUpdate.append('file', file);
        formData_DelUpdate.append('uid', file.uid);
        formData_DelUpdate.append('id', file.prod_img_id);
        ProductService.deletePicUpdate(formData_DelUpdate).then( res => {
          const { status, data } = res;
          if (status === 200 && data.status === '1') {
              Swal.fire({
               title: "<strong>ลบรูปสินค้าสำเร็จ</strong>",
               html: data.message,
               icon: "success",
             });
             handleRemove(file);
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
  };

  const handleRemove = (file) => {
    //debugger
    // Your logic to remove the file
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newFileList);
    //message.success(`File deleted successfully`);
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

  const searchInput = useRef(null);
  useEffect(() => {
    Product();
    async function getItemOptionType(){
      const {data, status} =  await optionRequest.optionsItems({Option:"Type"}) 
      
      if(status === 200) setItemsOptionType(data.data); 
    } 
    async function getItemOptionUnit(){
      const {data, status} =  await optionRequest.optionsItems({Option:"Unit"}) 
      
      if(status === 200) setItemsOptionUnit(data.data); 
    } 
    
    getItemOptionType();
    getItemOptionUnit();

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

//Column
  const columns = [
    {
        title: "No",
        dataIndex: "prod_id",
        key: "prod_id",
        hidden: "true",
        width: "1%",
    },
    {
        title: "รหัสสินค้า",
        dataIndex: "prod_code",
        key: "prod_code",
        width: "10%",
        ...getColumnSearchProps("prod_code"),
    },
    {
      title: "สินค้า",
      dataIndex: "prod_name",
      key: "prod_name",
      width: "25%",
      ...getColumnSearchProps("prod_name"),
    },
    {
      title: "ประเภทสินค้า",
      dataIndex: "prod_type",
      key: "prod_type",
      width: "10%",
      ...getColumnSearchProps("prod_type"),
    },
    {
      title: "ราคาสินค้า",
      dataIndex: "price",
      key: "price",
      width: "10%",
      ...getColumnSearchProps("price"),
      sorter: (a, b) => {
        const intA = parseInt(a.price.match(/-?\d{1,3}(?:,\d{3})*/)[0].replace(/,/g, ''), 10); 
        const intB = parseInt(b.price.match(/-?\d{1,3}(?:,\d{3})*/)[0].replace(/,/g, ''), 10);
        return intA - intB;
      },
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "หน่วยสินค้า",
      dataIndex: "unit",
      key: "unit",
      width: "10%",
      ...getColumnSearchProps("unit"),
    },
    {
      title: "สถานะการใช้งาน",
      dataIndex: "status",
      key: "status",
      width: "20%",
      ...getColumnSearchProps("status"),
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
            icon={<ToolTwoTone />}
            style={{ cursor: "pointer" }}
            type="primary"
            ghost
              onClick={(e) => showEditModal(text.prod_id)}
            >
            แก้ใข
          </Button>
          ),
      },
  ].filter((item) => !item.hidden);
//Column

  const Product = () => {
    ProductService.getProduct()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllProduct(data);
        }
      })
      .catch((err) => {});
  };

  const onChangeType = (data) => {
    let para = {
      id : data
    }
    ProductService.getProcode(para)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          // console.log(data.replaceAll('"', ''))
          formAdd.setFieldValue("Addprod_code", data.replaceAll('"', ""));
        }
      })
      .catch((err) => {});
    // this.setState({someVal: e.target.value})
  }

  const showEditModal = (data) => {
    let para = {
      id : data
    }
    ProductService.getProductByid(para)
      .then((res) => {
        let { status, data } = res;
        let data_prod = data.data[0];
        if (status === 200) {
          formEdit.setFieldValue("Editprod_code", data_prod.prod_code);
          formEdit.setFieldValue("Editprod_name", data_prod.prod_name);
          formEdit.setFieldValue("Editprodty_id", data_prod.prodty_id);
          formEdit.setFieldValue("Editprice", data_prod.price);
          formEdit.setFieldValue("Editunit", data_prod.unit);
          formEdit.setFieldValue("Editstatus", data_prod.status);    
          formEdit.setFieldValue("Editprod_id", data_prod.prod_id);
          setEditProdId(data_prod.prod_id);
          let file = data.file.map(data => ({ ...data, file_name:  `${BACKEND_URL_MAIN}/uploads/` + data.file_name }));   
          console.log(file) ;
          const formattedFileList = file.map((data) => ({
            prod_img_id: data.prod_img_id,
            uid: data.uid,
            name: data.name,
            status: 'done',
            url: data.file_name,
          }));
          setFileList(formattedFileList);
          formEdit.setFieldsValue({ Editprod_img: formattedFileList });
          setOpenModalEdit(true);
        }
      })
      .catch((err) => {});
  };

  const submitAdd = () => {
    formAdd.validateFields().then(value=>{
      ProductService.addProduct(value).then(respon => {
          const { status, data } = respon;
          //debugger
          if (status === 200 && data.status === '1') {
             Swal.fire({
              title: "<strong>สร้างสินค้าสำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            Product();
            setOpenModalAdd(false);
            formAdd.resetFields();
            setFileList([]);
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
    //debugger
    ProductService.editProduct(dataform)
      .then(async (res) => {
        //debugger
        let { status, data } = res;
        if (status === 200 && data.status === '1') {
          await Swal.fire({
            title: "<strong>แก้ไขสินค้าสำเร็จ</strong>",
            html: data.message,
            icon: "success",
          });

          Product();
          setOpenModalEdit(false);
          setFileList([]);
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


  return (
    <>
      <div className="layout-content">
        <Button
          type="primary"
          onClick={() => {
            setOpenModalAdd(true);

          }}
        >
          เพิ่มสินค้า
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
        maskClosable={false}
        title="เพิ่มสินค้า"
        okText="Create"
        cancelText="Cancel"
        onCancel={handlemodalAddCancel}
        width={800}
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
          name="form_in_modal_add"
          initialValues={{
            modifier: "public",
          }}
        >
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              ประเภทสินค้า
              <Form.Item name="Addprodty_id" rules={[{ required: true, message: 'กรุณาระบุประเภทสินค้า!' }]}  >
                <Select
                showSearch
                style={{ height: 40 }}
                placeholder="เลือกประเภทสินค้า"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)} 
                options={itemsOptionType}
                onSelect={(value) => onChangeType(value)}
                />
              </Form.Item> 
            </Col>
            </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={8}>
              รหัสสินค้า
              <Form.Item
                name="Addprod_code"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่รหัสสินค้า!",
                  },
                ]}
              >
                <Input placeholder="รหัสสินค้า" disabled/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={18} lg={18} xl={16}>
              ชื่อสินค้า
              <Form.Item
                name="Addprod_name"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อสินค้า!",
                  },
                ]}
              >
                <Input placeholder="ใส่ชื่อสินค้า" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              หน่วยสินค้า
              <Form.Item name="Addunit" rules={[{ required: true, message: 'กรุณาระบุหน่วยสินค้า!' }]}  >
                <Select
                showSearch
                style={{ height: 40 }}
                placeholder="เลือกหน่วยสินค้า"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)} 
                options={itemsOptionUnit}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              ราคาซื้อ
              <Form.Item
                name="Addprice"
                rules={[
                {
                    required: true,
                    message: 'กรุณาใส่ราคาซื้อ!',
                },
                {
                    validator: validateNumber, // เรียกใช้งาน validator
                },
                ]}
            >
                <Input placeholder="ใส่ราคาซื้อ" />
            </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              รูปสินค้า
              <Form.Item
                name="prod_img"
                getValueFromEvent={(event) => { return event?.fileList}}
                rules={[
                {
                    required: true,
                    message: 'กรุณาอัพโหลดรูปสินค้า!',
                },
                ]}
              >
                <Upload
                  {...propsAdd} 
                  onChange={handleChange}
                  fileList={fileList}
                  listType="picture-card"
                  onPreview={handlePreview}
                  onRemove={onRemove}
                >
                  {fileList.length >= 5 ? null : uploadButton}
                </Upload>
            </Form.Item>
            </Col>
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
      <Modal
        open={OpenModalEdit}
        maskClosable={false}
        title="แก้ไขประเภทสินค้า"
        okText="Update"
        cancelText="Cancel"
        onCancel={() => {
          setOpenModalEdit(false);
          setFileList([]);
        }}
        width={800}
        onOk={() => {
          formEdit
            .validateFields()
            .then((values) => {
              // formAdd.resetFields();
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
          name="form_in_modal_edit"
          initialValues={{
            modifier: "public",
          }}>
           <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={8}>
              รหัสสินค้า
              <Form.Item
                name="Editprod_code"
                rules={[
                  {
                    
                    required: false,
                    message: "กรุณาใส่รหัสสินค้า!",
                  },
                ]}
              >
                <Input placeholder="รหัสสินค้า" disabled/>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={18} lg={18} xl={16}>
              ชื่อสินค้า
              <Form.Item
                name="Editprod_name"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อสินค้า!",
                  },
                ]}
              >
                <Input placeholder="ใส่ชื่อสินค้า" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              ประเภทสินค้า
              <Form.Item name="Editprodty_id" rules={[{ required: true, message: 'กรุณาระบุประเภทสินค้า!' }]}  >
                <Select
                showSearch
                style={{ height: 40 }}
                placeholder="เลือกประเภทสินค้า"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)} 
                options={itemsOptionType}
                disabled
                />
              </Form.Item> 
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              หน่วยสินค้า
              <Form.Item name="Editunit" rules={[{ required: true, message: 'กรุณาระบุหน่วยสินค้า!' }]}  >
                <Select
                showSearch
                style={{ height: 40 }}
                placeholder="เลือกหน่วยสินค้า"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)} 
                options={itemsOptionUnit}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              ราคาซื้อ
              <Form.Item
                name="Editprice"
                rules={[
                {
                    required: true,
                    message: 'กรุณาใส่ราคาซื้อ!',
                },
                {
                    validator: validateNumber, // เรียกใช้งาน validator
                },
                ]}
            >
                <Input placeholder="ใส่ราคาซื้อ" />
            </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            สถานะการใช้งาน
            <Form.Item
              name="Editstatus"
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
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              รูปสินค้า
              <Form.Item
                name="Editprod_img"
                getValueFromEvent={(event) => { return event?.fileList}}
                rules={[
                {
                    required: true,
                    message: 'กรุณาอัพโหลดรูปสินค้า!',
                },
                ]}
              >
                <Upload
                  {...propsUpdate}
                  fileList={fileList}
                  listType="picture-card"
                  onPreview={handlePreview}
                  onRemove={(file) => {
                    showRemoveConfirmation(file);
                    return false;
                  }}
                >
                  {fileList.length >= 5 ? null : uploadButton}
                </Upload>
            </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="Editprod_id"
            style={{ display: 'none' }} // หรือใช้ { visibility: 'hidden' }
          >
            <Input
            type="hidden"            
            />
          </Form.Item>
        </Form>
      </Modal>
      <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table  size="small" columns={columns} dataSource={AllProduct} rowKey="prod_code" />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Product;
