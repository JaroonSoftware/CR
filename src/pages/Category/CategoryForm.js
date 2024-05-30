import { SearchOutlined, ToolTwoTone, PlusOutlined  } from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { BACKEND_URL_MAIN } from "../../utils/util";
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
  Badge,
  message,
  Upload,
  Select,
} from "antd";
import Swal from "sweetalert2";
import CategoryService from "../../service/CategoryService";


const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const Category = () => {
  const [AllCategory, setAllCategory] = useState("");
  const [OpenModalAdd, setOpenModalAdd] = useState(false);
  const [OpenModalEdit, setOpenModalEdit] = useState(false);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [EditCtgyId, setEditCtgyId] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);

  const searchInput = useRef(null);
  useEffect(() => {
    GetCategory();
  }, []);
  //function upload
  const handleCancel = () => setPreviewOpen(false);
  const handlemodalAddCancel = () => {
    // console.log('func_delAll')
    setOpenModalAdd(false);
    formAdd.resetFields();
    if(fileList.length > 0){
      //debugger
      CategoryService.deleteAllPic({fileList})
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
      url : `${BACKEND_URL_MAIN}/upload_logo/` + file.uid+'_'+file.name,
    };
    setFileList((prevFileList) => [...prevFileList, newFile]);
    // console.log(file);
    // console.log('-----');
    // console.log(fileList);

  };
  const onUploadSuccessUpdate = (file,prod_img_id) => {
    //debugger
    const newFile = {
      uid: file.uid,
      name: file.name,
      status: 'done',
      url : `${BACKEND_URL_MAIN}/upload_logo/` + file.uid+'_'+file.name,
    };
    console.log(newFile);
    //debugger
    setFileList((prevFileList) => [...prevFileList, newFile]);
    //console.log(file);
    //console.log('-----');
    //console.log(fileList);

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
          CategoryService.uploadPic(formData)
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
        formData.append('ctgy_id', EditCtgyId);
        try {
          CategoryService.uploadPic(formData)
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
    debugger
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
      CategoryService.deletePic(formData_Del)
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
      title: "ยืนยัน ลบรูปหมวดหมู่หลัก?",
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
        formData_DelUpdate.append('id', file.ctgy_id);
        CategoryService.deletePicUpdate(formData_DelUpdate).then( res => {
          const { status, data } = res;
          if (status === 200 && data.status === '1') {
              Swal.fire({
               title: "<strong>ลบรูปหมวดหมู่หลักสำเร็จ</strong>",
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
  //function upload

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
        width: "1%",
    },
    {
      title: "ชื่อหมวดหมู่",
      dataIndex: "ctgy_name",
      key: "ctgy_name",
      width: "60%",
      ...getColumnSearchProps("ctgy_name"),
      sorter: (a, b) => a.unit.length - b.unit.length,
      sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <span
          style={{ color: "#29f", cursor: "pointer" }}
          onClick={(e) => subcategory(record.ctgy_id)}
        >
          {record.ctgy_name}
        </span>
      ),
    },
    {
      title: "สถานะการใช้งาน",
      dataIndex: "status",
      key: "status",
      width: "25%",
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
        width: "15%",
        fixed: "right",
        render: (text) => (
            <Button
              icon={<ToolTwoTone twoToneColor="#E74C3C" />}
              style={{ cursor: "pointer" }}
              danger
              onClick={(e) => showEditModal(text.ctgy_id)}
            >
              แก้ใข
            </Button>
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
    //window.location.href = `/category/${data}`;
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
          setEditCtgyId(data.ctgy_id);
          if(data.img_uid !== ''){
          const formattedFileList = [{
            ctgy_id: data.ctgy_id,
            uid: data.img_uid,
            name: data.img_name,
            status: 'done',
            url: `${BACKEND_URL_MAIN}/upload_logo/` + data.img_filename,
          }];
          setFileList(formattedFileList);
          formEdit.setFieldsValue({ Editctgy_img: formattedFileList });
        }
          setOpenModalEdit(true);
        }
      })
      .catch((err) => {});
  };
  const subcategory = (id) => {
    const action = "SubCategory"
    window.location.href = `/category/${action}/${id}`;
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
          เพิ่มหมวดหมู่
        </Button>
        <br></br>
        <br></br>
        <Modal
          open={OpenModalAdd}
          maskClosable={false}
          title="เพิ่มหมวดหมู่"
          onCancel={handlemodalAddCancel}
          footer={
            <>
              <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
                <Button type='primary' onClick={()=>{submitAdd()}} >Create</Button>
                <Button onClick={handlemodalAddCancel}>Cancel</Button> 
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
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              รูปหมวดหมู่หลัก
              <Form.Item
                name="ctgy_img"
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
        </Form>
      </Modal>

      <Modal
        open={OpenModalEdit}
        title="แก้ไขหมวดหมู่"
        okText="Update"
        cancelText="Cancel"
        onCancel={() => {
          setOpenModalEdit(false);
          setFileList([]);
        }}
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
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              รูปหมวดหมู่หลัก
              <Form.Item
                name="Editctgy_img"
                getValueFromEvent={(event) => { return event?.fileList}}
              >
                <Upload
                  {...propsUpdate} 
                  onChange={handleChange}
                  fileList={fileList}
                  listType="picture-card"
                  onPreview={handlePreview}
                  onRemove={(file) => {
                    showRemoveConfirmation(file);
                    return false;
                  }}
                >
                  {fileList.length >= 1 ? null : uploadButton}
                </Upload>
            </Form.Item>
            </Col>
          </Row>
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
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
        <Row gutter={[24, 0]} style={{ marginTop: "1rem" }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table size="small" columns={columns} dataSource={AllCategory} rowKey="ctgy_name" />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );

  

};

export default Category;
