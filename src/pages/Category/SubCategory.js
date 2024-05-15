/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import { Button, Form, Input, Radio, Table, Select, Badge } from 'antd';
import { Card, Space, Col, Row, Modal } from 'antd'; 
import { SearchOutlined, ToolTwoTone } from '@ant-design/icons';
import Highlighter from "react-highlight-words";
import "./category.css"

import CategoryService from "../../service/CategoryService";

// import { bomRequestViewModel } from  './bom.model'
import { ArrowLeftOutlined, CheckOutlined} from '@ant-design/icons';
import Swal from "sweetalert2";
import { message } from 'antd';

const SubCategory = () => {

  let { id} = useParams(); 
  const [AllSubCategory, setAllSubCategory] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [OpenModalAdd, setOpenModalAdd] = useState(false);
  const [OpenModalEdit, setOpenModalEdit] = useState(false);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [formValue, setFormValue] = useState({});
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const searchInput = useRef(null);
  useEffect(() => {
    SubCategory(id);
    GetCategory(id);
  }, []);

  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: '${label} is required!', 
  }; 
  /** Hook use Effect */


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const Delete = (id) => {
    
  }
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
        dataIndex: "subctgy_id",
        key: "subctgy_id",
        hidden: "true",
        width: "40%",
    },
    {
      title: "ชื่อหมวดหมู่ย่อย",
      dataIndex: "subctgy_name",
      key: "subctgy_name",
      width: "30%",
      ...getColumnSearchProps("ctgy_name"),
      sorter: (a, b) => a.unit.length - b.unit.length,
      sortDirections: ["descend", "ascend"],
    },
    {
        title: "สถานะการใช้งาน",
        dataIndex: "status",
        key: "status",
        width: "10%",
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
        title: 'Create Date',
        width: "10%",
        dataIndex: 'c_date',
        key: 'c_date',
        textWrap: 'word-break',
        minWidth: 150,
      },
    {
        title: 'Create By',
        dataIndex: 'c_by',
        key: 'c_by',
        width: "15%",
        textWrap: 'word-break',
        minWidth: 150,
      },
      {
        title: 'Update Date',
        dataIndex: 'e_date',
        key: 'e_date',
        width: "10%",
        minWidth: 150,
      },
      {
        title: 'Update By',
        dataIndex: 'e_by',
        key: 'e_by',
        width: "15%",
        minWidth: 150,
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
            onClick={(e) => showEditModal(text.subctgy_id)}
          >
            แก้ใข
          </Button>
          ),
        },
  ].filter((item) => !item.hidden);

  const showEditModal = (data) => {
    let para = {
      id : data
    }
    CategoryService.getSubCategoryByid(para)
      .then((res) => {
        debugger
        let { status, data } = res;
        if (status === 200) {
          formEdit.setFieldValue("Editsubcategory", data.subctgy_name);
          formEdit.setFieldValue("Editstatussubcategory", data.status);
          formEdit.setFieldValue("editsubcategory_id", data.subctgy_id);          

          setOpenModalEdit(true);
        }
      })
      .catch((err) => {});
  };

  const SubCategory = (id) => {
    let para = {
        id : id
      }
    CategoryService.getSubCategory(para)
    .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllSubCategory(data);
        }
      })
      .catch((err) => {});
  };
  const GetCategory = (data) => {
    let para = {
      id : data
    }
    CategoryService.getCategoryByid(para)
      .then((res) => {
        debugger
        let { status, data } = res;
        if (status === 200) {
          form.setFieldValue("category_name", data.ctgy_name);   
          formAdd.setFieldValue("category_id", data.ctgy_id);     
          formEdit.setFieldValue("editcategory_id", data.ctgy_id); 
        }
      })
      .catch((err) => {});
  };
  /** End Hook use Effect */


  //** Function logic */

  const submitAdd = () => {
    formAdd.validateFields().then(value=>{
      CategoryService.AddSubCategory(value).then(respon => {
          const { status, data } = respon;
          debugger
          if (status === 200 && data.status === '1') {
             Swal.fire({
              title: "<strong>สร้างหมวดหมู่ย่อยสำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            SubCategory(id);
            GetCategory(id);
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
    debugger
    CategoryService.editSubCategory(dataform)
      .then(async (res) => {
        debugger
        let { status, data } = res;
        if (status === 200 && data.status === '1') {
          await Swal.fire({
            title: "<strong>แก้ไขหมวดหมู่ย่อยสำเร็จ</strong>",
            html: data.message,
            icon: "success",
          });

          SubCategory(id);
          GetCategory(id);
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
  /** End Function Logic */

  const ModalAdd = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="เพิ่มหมวดหมู่ย่อย"
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
            name="Addsubcategory"
            rules={[
              {
                required: true,
                message: "กรุณาใส่ชื่อหมวดหมู่ย่อย",
              },
            ]}
          >
            <Input placeholder="ใส่ชื่อหมวดหมู่ย่อย" />
          </Form.Item>
          <Form.Item
            name="category_id"
            style={{ display: 'none' }} 
          >
            <Input
            type="hidden"            
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const ModalEdit = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="แก้ไขหมวดหมู่ย่อย"
        okText="Update"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          formEdit
            .validateFields()
            .then((values) => {
              debugger
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
            name="Editsubcategory"
            rules={[
              {
                required: true,
                message: "กรุณาใส่ชื่อหมวดหมู่ย่อย",
              },
            ]}
          >
            <Input
              placeholder="ใส่ชื่อหมวดหมู่ย่อย"
            />
          </Form.Item>
          <Form.Item
            name="Editstatussubcategory"
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
            name="editsubcategory_id"
            style={{ display: 'none' }} 
          >
            <Input
            type="hidden"            
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  //** Component */

  const DetailForm = ()=>{
    return(
      <Form 
        form={form} 
        layout="vertical" 
        name="wrap"
        initialValues={formValue}
        validateMessages={validateMessages}
      >
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12}>
            <Form.Item label="หมวดหมู่" name="category_name" className="bold-label" >
              <Input autoComplete='off' disabled />
            </Form.Item>
          </Col> 
        </Row>  
      </Form>
    )
  }; 

  /** Emd Component */
  return (
    <>
      <div className='page--layout' >  
        <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative' }} >  
          <Card bordered={false} className="criclebox card-p cardbody h-full no-box-shadow card-secondary"> 
            <DetailForm />
          </Card>
          <Card bordered={false} className="criclebox card-p cardbody h-full no-box-shadow card-tb">
          <Row gutter={[8, 8]} style={{ display: 'flex', alignItems:'center', justifyContent:"space-between" }}>
            <Col span={12} style={{ display: 'flex', alignItems:'center', justifyContent:'start' }}> 
                <Space size="middle" style={{ display: 'flex', alignItems:'center' }} >
                <span style={{fontSize: 'clamp(0.9rem, 1.1vw, 24px)'}}>รายการ หมวดหมู่ย่อย</span>
                </Space>
            </Col>
            <Col span={12} style={{ display: 'flex', alignItems:'center', justifyContent:'end' }}> 
                <Space size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
                <Button
                    type="primary"
                    onClick={() => {
                        setOpenModalAdd(true);
                    }}
                    >
                    เพิ่มหมวดหมู่ย่อย
                </Button>
                </Space>
            </Col> 
            </Row>
            <br></br>
            <Table columns={columns} dataSource={AllSubCategory} />
          </Card> 
          <Row gutter={[8, 8]}>
            <Col span={12}> 
              <Space size="middle" style={{ display: 'flex' }} >
                <Button type="primary" onClick={() => navigate("/category", { replace: true })} className='bg-secondary' icon={<ArrowLeftOutlined />}>
                  Back
                </Button>  
              </Space>
            </Col>
          </Row> 
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
        </Space> 
      </div>
    </>
  )
};

export default SubCategory;