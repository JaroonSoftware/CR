/* eslint-disable react-hooks/exhaustive-deps */
import { SearchOutlined, ToolTwoTone,DeleteFilled, PrinterOutlined   } from "@ant-design/icons";
import React, { useRef, useState, useEffect } from "react";
import Highlighter from "react-highlight-words";
import { Button, Input, Space, Table, Row, Col, Card, Modal, Form, Select, DatePicker, Radio, Divider, InputNumber,Badge, } from "antd";
import Swal from "sweetalert2";
import ShopOrderService from "../service/ShopOrderService";
import '../../src/assets/CSS.css';
import { PROVINCE_OPTIONS } from "../utils/util";
import ReactToPrint from "react-to-print";
import PrintWordOrder from "./PrintWordOrder";
import PrintLabel from "./PrintLabel";

const ShopOrder = () => {
  const [AllShopOrder, setAllShopOrder] = useState("");
  const [OpenModalAddShopOrder, setOpenModalAddShopOrder] = useState(false);
  const [OpenModalEditShopOrder, setOpenModalEditShopOrder] = useState(false);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const { Option } = Select;
  const [itemsOptionProduct, setItemsOptionProduct] = useState([]);
  const [itemsOptionSize, setItemsOptionSize] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [ItemProduct, setItemProduct] = useState('');
  const [dataSourceEdit, setDataSourceEdit] = useState([]);
  const [OrderNo, setOrderNo] = useState("");
  const [IsCancelShopOrder, setIsCancelShopOrder] = useState(true);
  const [Isdisabled, setIsdisabled] = useState(false);
  const [textTitle, setTextTitle] = useState('');
  //Print
  const [formPrint] = Form.useForm();
  const [OpenModalPrint, setOpenModalPrint] = useState(false);
  const [dataPrint, setDataPrint] = useState(null);
  // const [dataSourcePrint, setDataSourcePrint] = useState("");
  // const [dataSourcePrintDetail, setDataSourcePrintDetail] = useState([]);
  const [dataPrintLabel, setDataPrintLabel] = useState(null);

  const searchInput = useRef(null);
  useEffect(() => {
    ShowShopOrder();

    async function getItemOptionProduct(){
      const {data, status} =  await ShopOrderService.getOptionShopOrder({Option:"Product"}) 
      
      if(status === 200) setItemsOptionProduct(data.data); 
    }
    getItemOptionProduct();

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

  const ShowShopOrder = () => {
    ShopOrderService.getAllShopOrder()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllShopOrder(data);
        }
      })
      .catch((err) => {});
  };

  const showEditModal = (data,action) => {
    let para = {
      id : data
    }
    ShopOrderService.getShopOrderByid(para)
      .then((res) => {
        let { status, data } = res;
        let data_so = data.data[0];
        debugger
        if (status === 200) {
          formEdit.setFieldValue("Editso_no", data_so.so_no);
          formEdit.setFieldValue("Editcus_name", data_so.cus_name);
          formEdit.setFieldValue("Editaddress", data_so.address);
          formEdit.setFieldValue("Editsubdistrict", data_so.subdistrict);
          formEdit.setFieldValue("Editdistrict", data_so.district);
          formEdit.setFieldValue("Editprovince", data_so.province);
          formEdit.setFieldValue("Editzipcode", data_so.zipcode);
          formEdit.setFieldValue("Edittel", data_so.tel);
          let detailSo = data.dataDetail;  
          setOrderNo(data_so.so_no);
          if(action === "Read"){setIsdisabled(true); setTextTitle('รายละเอียด Order') }else{ setIsdisabled(false); setTextTitle('แก้ไข Order')}
          //console.log(detailSo);
          const SoDetail = detailSo.map((data, index) => ({
            No: index+1,
            prod_code: data.prod_code,
            prod_name: data.prod_name,
            amount: data.amount,
            unit_name: data.unit,
            size_id: data.size_name,
            price: data.price,
            total: data.amount*data.price,
          }));
          setDataSourceEdit(SoDetail);
          //formEdit.setFieldsValue({ EditItem : PoDetail });
          setOpenModalEditShopOrder(true);
        }
      })
      .catch((err) => {});
  };

  const showPrintModal = (data) => {
    let para = {
      id : data
    }
    ShopOrderService.getShopOrderByid(para)
      .then((res) => {
        let { status, data } = res;
        let data_so = data.data[0];
        debugger
        if (status === 200) {
          formPrint.setFieldValue("OrderNo", data_so.so_no);
          formPrint.setFieldValue("embroider_prefix", data_so.embroider_prefix);
          formPrint.setFieldValue("embroider_name", data_so.embroider_name);
          formPrint.setFieldValue("embroider_surname", data_so.embroider_surname);
          formPrint.setFieldValue("CustomerName", data_so.cus_name);
          //setDataSourcePrint(data_so);
          //console.log(data_so);
          let detailSoP = data.dataDetail;  
          let SoDetailPrint = detailSoP.map((data, index) => ({
            No: index+1,
            ProductName: data.prod_name+' '+data.size_name,
            Amount: data.amount
          }));
          //setDataSourcePrintDetail(SoDetailPrint);
          formPrint.setFieldsValue({ ItemProduct : SoDetailPrint });
          setOpenModalPrint(true);
        }
      })
      .catch((err) => {});
  };

  const PrintWOrder =(data) => {
    try {
      setDataPrint(data);
      console.log(dataPrint);
      handlePrint();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handlePrint = () => {
    document.getElementById('print').click();
  };
  const PrintLabels =(data) => {
    let para = {
      id : data
    }
    ShopOrderService.getShopOrderByid(para)
      .then((res) => {
        let { status, data } = res;
        let data_so = data.data[0];
        debugger
        if (status === 200) {
          setDataPrintLabel(data_so);
          handlePrintLable();
        }
      })
      .catch((err) => {});
  };
  const handlePrintLable = () => {
    document.getElementById('printLabel').click();
  };

  const submitAdd = () => {
    const requiredFields = ['size_id']; 
    const missingFields = dataSource.some(row => requiredFields.some(field => !row[field]));
    if (missingFields) {
      Swal.fire({
        title: "<strong>เลือกขนาดสินค้าให้ครบ!</strong>",
        showConfirmButton: false,
        timer: 1500,
        icon: "warning",
      });
      return;
    }
    formAdd.setFieldsValue({ Item: dataSource });
    formAdd.validateFields().then(value=>{
        ShopOrderService.addShopOrder(value).then(respon => {
          const { status, data } = respon;
          if (status === 200 && data.status === '1') {
             Swal.fire({
              title: "<strong>เปิด Order สำเร็จ</strong>",
              html: "Order No."+data.message,
              icon: "success",
            });

            ShowShopOrder();
            setOpenModalAddShopOrder(false);
            formAdd.resetFields();
            setDataSource([]);
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

  const submitEdit = () => {
    formEdit.validateFields().then(value=>{
        ShopOrderService.editShopOrder(value).then(res => {
          //debugger
          let { status, data } = res;
          if (status === 200 && data.status === '1') {
            Swal.fire({
              title: "<strong>แก้ไข Order สำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });
            setOrderNo("");
            ShowShopOrder();
            setOpenModalEditShopOrder(false);
            setDataSourceEdit([]);
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

  const CancelShopOrder = (id) => {
    let parm = {
      id : id,
      action : "Cancel" 
    } 
    Swal.fire({
        title: "ยืนยันยกเลิก Order?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
      }).then((result) => {
        if (result.isConfirmed) {
            ShopOrderService.CancelShopOrder(parm).then( res => {
                const { status, data } = res;
              if (status === 200 && data.status === '1') {
                Swal.fire({
                 title: "<strong>ยกเลิก Order สำเร็จ</strong>",
                 html: data.message,
                 icon: "success",
               });
               setOrderNo("");
               ShowShopOrder();
               setOpenModalEditShopOrder(false);
               setDataSourceEdit([]);
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

  const ShowModalAddShopOrder = () => {
    ShopOrderService.getOrderNo()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          formAdd.setFieldValue("so_no", data.so_no);
          setOpenModalAddShopOrder(true);
        }
      })
      .catch((err) => {});
  };

  const SelectChangeProduct = (value) => {
    setItemProduct(value);
  };
  const handleAddRow = () => {
    if(ItemProduct){
      let para = {
        id : ItemProduct
      }
      ShopOrderService.getItem(para)
        .then((res) => {
          let { status, data } = res;
          if (status === 200) {
            debugger
            //setItemsOptionSize(data.size); 
            const newRowOptions = data.size.map(option => ({
                key: option.value,
                value: option.value,
                label: option.label,
            }));
            let data1 = data.data[0];
            setDataSource([...dataSource, { key: dataSource.length.toString(), No: dataSource.length+1, prod_code: data1.prod_code, prod_name: data1.prod_name, amount: 1, discount: 0 ,size_id: '', unit_id: data1.unitcode, unit_name: data1.unit, price: data1.price, total: data1.price,options: newRowOptions,}]);
          }
        })
        .catch((err) => {});
            
    setItemProduct('');
    formAdd.setFieldsValue({ product: undefined });
    }else{
      Swal.fire({
        title: "<strong>ยังไม่ได้เลือกสินค้า</strong>",
        showConfirmButton: false,
        timer: 1500,
        icon: "error",
      });
    }
  };
  const handleSelectChange = (value, record) => {
    const updatedDataSource = dataSource.map((item) => {
      if (item.key === record.key) {
        return { ...item, size_id: value };
      }
      return item;
    });
    setDataSource(updatedDataSource);
  };

  const handleRemoveRow = (key) => {
    const newDataSource = dataSource.filter(item => item.key !== key);
    setDataSource(newDataSource);
  };

  const handleTextBoxChange = (key, dataIndex, value) => {
    console.log(dataSource)
    const newData = [...dataSource];
    const index = newData.findIndex(item => key === item.key);
    if (index > -1) {
      newData[index][dataIndex] = value;
      if(dataIndex === 'amount'){
        let total =  newData[index]['price'] * value;
        newData[index]['total'] = total.toFixed(3);
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
  const columnsDetailSO = [
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
      title: 'จำนวน',
      dataIndex: 'amount',
      key: 'amount',
      render: (text, record) => (
        <InputNumber
          min={1} max={9999}
          value={record.amount} 
          onChange={(value) => handleTextBoxChange(record.key, 'amount' ,value)}
        />
      ),
    },
    { dataIndex: "unit_id",key: "unit_id",className: 'hidden-column', },
    {
      title: "หน่วย",
      dataIndex: "unit_name",
      key: "unit_name",
    },
    {
      title: 'ขนาด',
      dataIndex: 'size_id',
      key: 'size_id',
      render: (text, record) => (
          <Select
            showSearch
            style={{ height: 40,width: 130 }}
            placeholder="เลือกขนาดสินค้า"
            value={record.size_id} onChange={(value) => handleSelectChange(value, record)}
          >
            {/* <Option value="" selected>- เลือกขนาด -</Option> */}
            {/* {itemsOptionSize.map(option => (
            <Option key={option.value} value={option.value}>{option.label}</Option>
          ))} */}
            {record.options.map(option => (
            <Option key={option.key} value={option.value}>
              {option.label}
            </Option>
          ))}
          </Select>
      ),
    },
    {
      title: 'ราคา',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'จำนวนเงิน',
      dataIndex: 'total',
      key: 'total',
      render: (text, record) => (
        <InputNumber
          min={1} max={999999}
          disabled 
          value={text}
          onChange={(value) => handleTextBoxChange(record.key, 'total', value)}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
            icon={<DeleteFilled  />}
            style={{ cursor: "pointer" }}
            danger
            onClick={() => handleRemoveRow(record.key)}
            className="custom-button"
          >
          </Button>
      ),
    },
  ];

  const columnsDetailEditSO = [
    {
      title: "ลำดับ",
      dataIndex: "No",
      key: "No",
      width: "10%",
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
      title: 'จำนวน',
      dataIndex: 'amount',
      key: 'amount',
    },
    { dataIndex: "unit_id",key: "unit_id",className: 'hidden-column', },
    {
      title: "หน่วย",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: 'ขนาด',
      dataIndex: 'size_id',
      key: 'size_id',
    },
    {
      title: 'ราคา',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'จำนวนเงิน',
      dataIndex: 'total',
      key: 'total',
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
      title: "Order No",
      dataIndex: "so_no",
      key: "so_no",
      width: "20%",
      
      ...getColumnSearchProps("so_no"),
      sorter: (a, b) => a.so_no.length - b.so_no.length,
      sortDirections: ["descend", "ascend"],
    },
    {
        title: "วันทีขาย Order",
        dataIndex: "so_date",
        key: "so_date",
        width: "20%",
        ...getColumnSearchProps("so_date"),
        sorter: (a, b) => a.so_date.length - b.so_date.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "ชื่อ-นามสกุลลูกค้า",
        dataIndex: "cus_name",
        key: "cus_name",
        width: "20%",
        ...getColumnSearchProps("cus_name"),
        sorter: (a, b) => a.cus_name.length - b.cus_name.length,
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "สถานะ",
        dataIndex: "status",
        key: "status",
        width: "20%",
        ...getColumnSearchProps("status"),
        sorter: (a, b) => a.status.length - b.status.length,
        sortDirections: ["descend", "ascend"],
        render: (data) => {
          if(data === "ชำระเงินแล้ว"){ return <Badge status="success" text="ชำระเงินแล้ว" />}
          if(data === "รอชำระ"){ return <Badge color="yellow" text="รอชำระ" />}  
          if(data === "ยกเลิก"){ return <Badge color="red" text="ยกเลิก Order" />} 
        },
      },
      {
        title: "Action",
        key: "operation",
        width: "35%",
        fixed: "right",
        render: (text) => {
          if(text.status === "รอชำระ"){
            return (
            <span>
            <Button
            icon={<ToolTwoTone/>}
            style={{ cursor: "pointer" }}
            type="primary"
            ghost
            onClick={(e) => showEditModal(text.so_no,'')}
            >
            Edit
            </Button>
            </span>
            );
          }
          else if(text.status === "ชำระเงินแล้ว"){
            return (
            <span>
            <Button
            icon={<SearchOutlined />}
            style={{ cursor: "pointer" }}
            type="primary"
            ghost
            onClick={(e) => showEditModal(text.so_no,'Read')}
            >
            Detail
            </Button>
            {' '}
            <Button
            icon={<PrinterOutlined/>}
            style={{ cursor: "pointer" }}
            onClick={(e) => showPrintModal(text.so_no,'')}
            >
            ใบสั่งปัก
            </Button>
            {' '}
            <Button
            icon={<PrinterOutlined/>}
            style={{ cursor: "pointer" }}
            onClick={(e) => PrintLabels(text.so_no)}
            >
            ใบจ่าหน้า
            </Button>
            </span>
            );
          }
          
        },
      },
  ].filter((item) => !item.hidden);
  
  return (
    <>
      <div className="layout-content">
        <Button
          type="primary"
          onClick={ShowModalAddShopOrder}
        >
          เพิ่ม Order
        </Button>
        <br></br>
        <br></br>

        {/* PopUp ADD Order */}
        <Modal
          open={OpenModalAddShopOrder}
          title="เปิด Order"
          onCancel={() => {
            setOpenModalAddShopOrder(false);
          }}
          width={1200}
          footer={
            <>
              <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
                <Button type='primary' onClick={()=>{submitAdd()}} >เปิด Order</Button>
                <Button onClick={() => setOpenModalAddShopOrder(false) }>Cancel</Button> 
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
          <Col xs={24} sm={24} md={4} lg={4} xl={4}>
              เลขที่ใบ Order
              <Form.Item
                name="so_no"
              >
              <Input  disabled/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={20} lg={20} xl={20}>
            ชื่อ-นามสกุลลูกค้า
            <Form.Item 
                name="cus_name" 
                rules={[{ required: true, message: 'จำเป็นต้องกรอกชื่อ-นามสกุลลูกค้า!' }]}
            >
                <Input  />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              ที่อยู่จัดส่งสินค้า
              <Form.Item
                name="address"
                rules={[{ required: true, message: 'จำเป็นต้องกรอกที่อยู่จัดส่งสินค้า!' }]}
              >
              <Input  />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            ตำบล
            <Form.Item
              name="subdistrict"
              rules={[{ required: true, message: 'จำเป็นต้องกรอกตำบล!' }]}
              style={{ width: '100%' }}
            >
            <Input  />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            อำเภอ
            <Form.Item
              name="district"
              rules={[{ required: true, message: 'จำเป็นต้องกรอกอำเภอ!' }]}
              style={{ width: '100%' }}
            >
            <Input  />    
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            จังหวัด 
            <Form.Item
              name="province"
              rules={[{ required: true, message: 'จำเป็นต้องกรอกจังหวัด!' }]}
            >
            <Select style={{ height: 40 }} 
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                options={PROVINCE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            รหัสไปรษณีย์
            <Form.Item
              name="zipcode"
              rules={[{ required: true, message: 'จำเป็นต้องกรอกรหัสไปรษณีย์!' }]}
            >
            <Input  />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            เบอร์โทรศัพท์ 
              <Form.Item
                name="tel"
                rules={[{ required: true, message: 'จำเป็นต้องกรอกเบอร์โทรศัพท์!' }]}
              >
              <Input  />
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ margin: '5px 0' }}/>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            สินค้า
            <Form.Item name="product" >
              <Select
                onChange={SelectChangeProduct}
                value={ItemProduct}
                showSearch
                style={{ height: 40 }}
                placeholder="เลือกสินค้า"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)} 
                options={itemsOptionProduct}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
          <Form.Item>
            <Button type="primary" style={{ marginTop: '20px' }}  onClick={handleAddRow}> {/*onClick={AddItemPo} */} 
              เพิ่มสินค้า
            </Button>
          </Form.Item>
          <Form.Item
            name="Item"
            style={{ display: 'none' }}
          >
          <Input />
          </Form.Item>
          </Col>
        </Row>
        {/* Table detail PO */}
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
             <Table
                dataSource={dataSource}
                columns={columnsDetailSO}
                pagination={false}
                bordered
              />
          </Col>
        </Row>
        {/* End Table detail SO */}
        </Form>
        </Modal>
        {/* End PopUp ADD SO */}

        {/* PopUp Edit SO */}
        <Modal
          open={OpenModalEditShopOrder}
          maskClosable={false}
          title={textTitle}
          onCancel={() => {
            setOpenModalEditShopOrder(false);
          }}
          width={1200}
          footer={
            <>
              <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
                {!Isdisabled && <Button type='primary' danger onClick={()=>{CancelShopOrder(OrderNo)}}>ยกเลิกใบสั่งซื้อ</Button>}
                {!Isdisabled && <Button type='primary' onClick={()=>{submitEdit()}} >Update</Button>}
                <Button onClick={() => setOpenModalEditShopOrder(false) }>Cancel</Button> 
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
          <Col xs={24} sm={24} md={4} lg={4} xl={4}>
              เลขที่ใบ Order
              <Form.Item
                name="Editso_no"
              >
              <Input  disabled/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={20} lg={20} xl={20}>
            ชื่อ-นามสกุลลูกค้า
            <Form.Item name="Editcus_name" >
                <Input  />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              ที่อยู่จัดส่งสินค้า
              <Form.Item
                name="Editaddress"
                rules={[{ required: true, message: 'จำเป็นต้องกรอกที่อยู่จัดส่งสินค้า!' }]}
              >
              <Input  />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            ตำบล
            <Form.Item
              name="Editsubdistrict"
              rules={[{ required: true, message: 'จำเป็นต้องกรอกตำบล!' }]}
              style={{ width: '100%' }}
            >
            <Input  />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            อำเภอ
            <Form.Item
              name="Editdistrict"
              rules={[{ required: true, message: 'จำเป็นต้องกรอกอำเภอ!' }]}
              style={{ width: '100%' }}
            >
            <Input  />    
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            จังหวัด 
            <Form.Item
              name="Editprovince"
              rules={[{ required: true, message: 'จำเป็นต้องกรอกจังหวัด!' }]}
            >
            <Select style={{ height: 40 }} 
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                options={PROVINCE_OPTIONS} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            รหัสไปรษณีย์
            <Form.Item
              name="Editzipcode"
              rules={[{ required: true, message: 'จำเป็นต้องกรอกรหัสไปรษณีย์!' }]}
            >
            <Input  />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            เบอร์โทรศัพท์ 
              <Form.Item
                name="Edittel"
                rules={[{ required: true, message: 'จำเป็นต้องกรอกเบอร์โทรศัพท์!' }]}
              >
              <Input  />
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ margin: '5px 0' }}/>
        {/* Table detail */}
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
             <Table
                dataSource={dataSourceEdit}
                columns={columnsDetailEditSO}
                pagination={false}
                bordered
              />
          </Col>
        </Row>
        {/* End Table detail */}
        </Form>
        </Modal>
        {/* End PopUp Edit ShopOrder */}
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table columns={columns} dataSource={AllShopOrder} rowKey="id" />
            </Card>
          </Col>
        </Row>
        {/*ใบสั่งปัก*/}
        <Modal
          open={OpenModalPrint}
          maskClosable={false}
          title="ใบสั่งปัก"
          onCancel={() => {
            setOpenModalPrint(false);
          }}
          width={700}
          footer={
            <>
              <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
              <Button type='primary' onClick={() => {
                      formPrint
                        .validateFields()
                        .then((values) => {
                          PrintWOrder(values);
                        })
                        .catch((info) => {
                          console.log("Validate Failed:", info);
                        });
                }} >Print ใบสั่งปัก</Button>
                
                <Button onClick={() => setOpenModalPrint(false) }>Cancel</Button> 
              </Space>
            </>
            }
        >
        <Form
          form={formPrint}
          layout="vertical"
          name="form_in_modal"
          initialValues={{}}
        >
          <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              เลขที่ใบสั่งซื้อ
              <Form.Item
                name="OrderNo"
              >
              <Input  disabled/>
            </Form.Item>
          </Col>
          <Form.Item name="CustomerName" >
            <Input  type="hidden" />
          </Form.Item>
          <Form.Item name="ItemProduct" >
            <Input  type="hidden" />
          </Form.Item>
        </Row>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            คำนำหน้า (ที่สั่งปัก)
            <Form.Item
              name="embroider_prefix"
              style={{ width: '100%' }}
            >
            <Input disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={9} lg={9} xl={9}>
            ชื่อ (ที่สั่งปัก)
            <Form.Item
              name="embroider_name"
              style={{ width: '100%' }}
            >
            <Input disabled />    
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={9} lg={9} xl={9}>
            นามสกุล (ที่สั่งปัก) 
            <Form.Item
              name="embroider_surname"
            >
            <Input disabled />
            </Form.Item>
          </Col>
        </Row>
        <b>รายละเอียดเพิ่มเติมสั่งปัก</b>
        <Divider style={{ margin: '5px 0' }}/>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              ชั้น
              <Form.Item
                name="class"
                rules={[{ required: true, message: 'จำเป็นต้องกรอกชั้น!' }]}
              >
              <Input  />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              สัญลักษณ์
              <Form.Item
                name="emblem"
                rules={[{ required: true, message: 'จำเป็นต้องกรอกสัญลักษณ์!' }]}
              >
              <Input  />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              สี
              <Form.Item
                name="color"
                rules={[{ required: true, message: 'จำเป็นต้องกรอกสี!' }]}
              >
              <Input  />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              ตำแหน่งที่ปัก
              <Form.Item
                name="position"
                rules={[{ required: true, message: 'จำเป็นต้องกรอกตำแหน่งที่ปัก!' }]}
              >
              <Input  />
            </Form.Item>
          </Col>
        </Row>

        </Form>
        </Modal>
      <div style={{display : 'none'}}>
       {dataPrint !== null &&  
       <div>
        <div id="vertical-report">
        <PrintWordOrder data={dataPrint} />
        </div>
        <ReactToPrint
            trigger={() => (
              <button
                id="print"
                style={{
                  padding: "0 2em",
                  marginBottom: "8px",
                  height: 35,
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer"
                }}
              >
                Print
              </button>
            )}
            content={() =>  document.getElementById('printable-content')}
          />
        </div>
         } 
      {/* PrintLabel */}
      {dataPrintLabel !== null &&  
        <div>
        <div id="horizontal-report">  
        <PrintLabel data={dataPrintLabel} />
        </div>
        <ReactToPrint
            trigger={() => (
              <button
                id="printLabel"
                style={{
                  padding: "0 2em",
                  marginBottom: "8px",
                  height: 35,
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer"
                }}
              >
                Print
              </button>
            )}
            content={() => document.getElementById('prinlabel-content')}
            pageStyle="@page { size: landscape; }"
          />
        </div>
         }
      </div>
    </div>
    </>
  );
};

export default ShopOrder;
