import { SearchOutlined, ToolTwoTone, DeleteFilled, ArrowLeftOutlined, DollarOutlined  } from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import { useNavigate  } from 'react-router-dom';
import Highlighter from "react-highlight-words";
import { Button,Input,Space,Table,Row,Col,Card,Modal,Form,Select,Badge,Divider,} from "antd";
import Swal from "sweetalert2";
import EcommerceService from "../service/EcommerceService";
import Gopp from "../pages/PublicHeader";
import { PROVINCE_OPTIONS } from "../utils/util";
import '../assets/CSS.css';
function Order() {
  const navigate  = useNavigate();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [Items, setItems] = useState([]);
  
  const searchInput = useRef(null);
  useEffect(() => {
    setItems([]);
    const DatalocalStorage = localStorage.getItem('ProdInCart');
    let newData;
    newData = JSON.parse(DatalocalStorage);
    if(newData !== null && newData !== undefined && newData.length > 0 ) { 
          console.log(newData);
          const item = newData.map((data, index) => ({
            No: index+1,
            prod_code: data.prod_code,
            prod_name: data.prod_name,
            amount: data.amount,
            size_name: data.size_name,
            size_id: data.size_id,
            price: data.price,
            totalprice: parseInt(data.amount)*parseFloat(data.price),
          }));
          //setDataSourceEdit(item);
          setItems(item); 
        
    }else{ 
        setItems([]);  
        navigate('/');
    }
  }, []);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleGoToHome = () => {
    // กลับไปยังหน้าแรกสุด
    navigate('/');
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

//   const showAddModal = () => {
//     SupplierService.getSupcode()
//       .then((res) => {
//         let { status, data } = res;
//         if (status === 200) {
//           // console.log(data.replaceAll('"', ''))
//           formAdd.setFieldValue("Addsupcode", data.replaceAll('"', ""));
//         }
//       })
//       .catch((err) => {});
//     setOpenModalAdd(true);
//   };

//   const showEditModal = (data) => {
//     SupplierService.getSupSupplier(data)
//       .then((res) => {
//         let { status, data } = res;
//         if (status === 200) {
//           // console.log(data)
//           formEdit.setFieldValue("Editsupname", data.supname);
//           formEdit.setFieldValue("Editstatussup", data.statussup);
//           formEdit.setFieldValue("Editidno", data.idno);
//           formEdit.setFieldValue("Editroad", data.road);
//           formEdit.setFieldValue("Editsubdistrict", data.subdistrict);
//           formEdit.setFieldValue("Editdistrict", data.district);
//           formEdit.setFieldValue("Editprovince", data.province);
//           formEdit.setFieldValue("Editzipcode", data.zipcode);
//           formEdit.setFieldValue("Edittel", data.tel);
//           formEdit.setFieldValue("Editfax", data.fax);
//           formEdit.setFieldValue("Edittaxnumber", data.taxnumber);
//           formEdit.setFieldValue("Editemail", data.email);
//           formEdit.setFieldValue("Editsupcode", data.supcode);

//           setOpenModalEdit(true);
//         }
//       })
//       .catch((err) => {});
//   };

//   const submitAdd = (dataform) => {
//     SupplierService.addSupplier(dataform)
//       .then(async (res) => {
//         let { status, data } = res;
//         if (status === 200) {
//           if (data.status) {
//             await Swal.fire({
//               title: "<strong>สำเร็จ</strong>",
//               html: data.message,
//               icon: "success",
//             });
//             form.resetFields();
//           } else {
//             // alert(data.message)
//             Swal.fire({
//               title: "<strong>ผิดพลาด!</strong>",
//               html: data.message,
//               icon: "error",
//             });
//           }
//         }
//       })
//       .catch((err) => {});
//   };

  const submitAddSo = (dataform) => {
    form.setFieldsValue({ Item: Items });
    console.log(dataform)
    console.log(Items)
    form.validateFields().then(value=>{
        EcommerceService.addSO(value).then(respon => {
          const { status, data } = respon;
          if (status === 200 && data.status === '1') {
             Swal.fire({
              title: "<strong>สร้างใบสั่งซื้อสินค้าสำเร็จ</strong>",
              html: "Order No."+data.message,
              icon: "success",
            });
            localStorage.removeItem("ProdInCart");
            setItems([]);
            navigate('/');
          } else if (status === 200 && data.status === '2') {
            Swal.fire({
                title: "<strong>แจ้งเตือน!</strong>",
                showConfirmButton: false,
                html: data.message,
                timer: 3000,
                icon: "warning",
            });
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
  };
  //
  const handleRemoveRow = (key,id,size) => {
    debugger
    const newDataSource = Items.filter(item => item.No !== key);
    //console.log(newDataSource)
    setItems(newDataSource);

    let data = JSON.parse(localStorage.getItem('ProdInCart'));
    let newData = data.filter(item => item.prod_code !== id || item.size_id !== size);
    //console.log(newData)
    localStorage.setItem('ProdInCart', JSON.stringify(newData))
  };
  const columnsItem = [
    {
      title: "ลำดับ",
      dataIndex: "No",
      key: "No",
    },
    {
      title: "รหัสสินค้า",
      dataIndex: "prod_code",
      key: "prod_code",
      className: 'hidden-column',
    },
    {
      title: "รายการสินค้า",
      dataIndex: "prod_name",
      key: "prod_name",
    },
    {
      title: 'จำนวน',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'ขนาด',
      dataIndex: 'size_name',
      key: 'size_name',
    },
    {
        dataIndex: "size_id",
        key: "size_id",
        className: 'hidden-column',
    },
    {
      title: 'ราคา',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'จำนวนเงิน',
      dataIndex: 'totalprice',
      key: 'totalprice',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Button
              icon={<DeleteFilled  />}
              style={{ cursor: "pointer" }}
              danger
              onClick={() => handleRemoveRow(record.No,record.prod_code,record.size_id)}
              className="custom-button"
            >
            </Button>
        ),
      },
  ];
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
        title="ยืนยันการสั่งซื้อ"
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
            {/* <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              เลขใบสั่งซื้อ
              <Form.Item
                name="so_no"
              >
                <Input disabled />
              </Form.Item>
            </Col> */}
            <Col xs={24} sm={24} md={8} lg={8} xl={8}>
              ชื่อ-นามสกุล <span style={{ color: 'red' }}>*</span>
              <Form.Item
                name="cus_name"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ชื่อ-นามสกุล!",
                  },
                ]}
              >
                <Input placeholder="ใส่ชื่อ-นามสกุล" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={16}>
              ที่อยู่จัดส่งสินค้า <span style={{ color: 'red' }}>*</span>
              <Form.Item
                name="address"
                rules={[
                  {
                    required: true,
                    message: "กรุณาใส่ที่อยู่จัดส่งสินค้า!",
                  },
                ]}
              >
                <Input placeholder="ใส่ เลขที่ ถนน" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]} >
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              ตำบล <span style={{ color: 'red' }}>*</span>
              <Form.Item 
                name="subdistrict"
                rules={[
                    {
                      required: true,
                      message: "กรุณาใส่ตำบล!",
                    },
                  ]}
                >
                <Input placeholder="ตำบล" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              อำเภอ <span style={{ color: 'red' }}>*</span>
              <Form.Item 
              name="district"
              rules={[
                {
                  required: true,
                  message: "กรุณาใส่อำเภอ!",
                },
              ]}
              >
                <Input placeholder="อำเภอ" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              จังหวัด <span style={{ color: 'red' }}>*</span>
              <Form.Item
                name="province"
                rules={[
                  {
                    required: true,
                    message: "กรุณาระบุจังหวัด!",
                  },
                ]}
              >
                <Select style={{ height: 40 }} 
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                options={PROVINCE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              รหัสไปรษณีย์ <span style={{ color: 'red' }}>*</span>
              <Form.Item 
              name="zipcode"
              rules={[
                {
                  required: true,
                  message: "กรุณาใส่รหัสไปรษณีย์!",
                },
              ]}
              >
                <Input placeholder="รหัสไปรษณีย์" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
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
                <Input placeholder="เบอร์โทรศัพท์" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              คำนำหน้าชื่อที่จะปัก <span style={{ color: 'red' }}>*</span>
              <Form.Item name="embroider_prefix">
                <Input placeholder="คำนำหน้าชื่อที่จะปัก" />
              </Form.Item>
            </Col>          
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              ชื่อที่จะปัก <span style={{ color: 'red' }}>*</span>
              <Form.Item name="embroider_name">
                <Input placeholder="ชื่อที่จะปัก" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              นามสกุลที่จะปัก <span style={{ color: 'red' }}>*</span>
              <Form.Item name="embroider_surname">
                <Input placeholder="นามสกุลที่จะปัก" />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left" style={{ margin: 0 }}></Divider>
          <h3 style={{ paddingTop: 10, paddingLeft: 10  }}>รายการสินค้า</h3>
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-10">
                    <Table columns={columnsItem} dataSource={Items} rowKey="id" />
            </Col>
            <Form.Item
            name="Item"
            style={{ display: 'none' }}
            ></Form.Item>
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
                {Items.length > 0 && <Button type="primary" onClick={() => {
                    form.validateFields().then((values) => {
                        submitAddSo(values);
                    }).catch((info) => {
                        console.log("Validate Failed:", info);
                    });
                }}   icon={<DollarOutlined />}>
                สั่งซื้อสินค้า
                </Button>}
              </Space>
            </Col>
          </Row> 
        </Form>
    </Card>
    
</div>
</>
);
}

export default Order;
