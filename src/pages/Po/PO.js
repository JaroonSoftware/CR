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
  Radio,
  Divider,
  InputNumber,Badge,
} from "antd";
import Swal from "sweetalert2";
import POService from "../../service/POService";
import './Po.css';
import dayjs from 'dayjs';

const PO = () => {
  const [AllPO, setAllPO] = useState("");
  const [OpenModalAddPO, setOpenModalAddPO] = useState(false);
  const [OpenModalEditPO, setOpenModalEditPO] = useState(false);
  const [formAdd] = Form.useForm();
  const [formEdit] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [itemsOptionSupplier, setItemsOptionSupplier] = useState([]);
  const { Option } = Select;
  const { TextArea } = Input;
  const [itemsOptionProduct, setItemsOptionProduct] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [ItemProduct, setItemProduct] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [textAreaEditValue, setTextAreaEditValue] = useState('');
  const [dataSourceEdit, setDataSourceEdit] = useState([]);
  const [PoCode, setPoCode] = useState("");
  const [IsCancelPo, setIsCancelPo] = useState(true);
  const [Isdisabled, setIsdisabled] = useState(false);


  const searchInput = useRef(null);
  useEffect(() => {
    ShowPO();

    async function getItemOptionProduct(){
      const {data, status} =  await POService.getOptionPO({Option:"Product"}) 
      
      if(status === 200) setItemsOptionProduct(data.data); 
    } 
    async function getItemOptionSupplier(){
      const {data, status} =  await POService.getOptionPO({Option:"Supplier"}) 
       
      if(status === 200) setItemsOptionSupplier(data.data); 
    } 
    getItemOptionProduct();
    getItemOptionSupplier();

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

  const ShowPO = () => {
    POService.getAllPO()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          setAllPO(data);
        }
      })
      .catch((err) => {});
  };

  const showEditModal = (data,action) => {
    let para = {
      id : data
    }
    if(action === "cancel"){setIsdisabled(true); }else{ setIsdisabled(false);}
    POService.getPOByid(para)
      .then((res) => {
        let { status, data } = res;
        let data_po = data.data[0];
        debugger
        if (status === 200) {
          formEdit.setFieldValue("Editpo_no", data_po.po_code);
          formEdit.setFieldValue("Editsupcode", data_po.supcode);
          formEdit.setFieldValue("Editname_sup", data_po.supname);
          formEdit.setFieldValue("Editaddress_sup", data_po.assdress);
          formEdit.setFieldValue("Editpo_date" , dayjs(data_po.po_date));
          formEdit.setFieldValue("Editdel_date" , dayjs(data_po.del_date));   
          formEdit.setFieldValue("Editpayment", data_po.payment);
          formEdit.setFieldValue("Editvat", data_po.vat);
          formEdit.setFieldValue("EditRemarkArea", data_po.remark);
          setTextAreaEditValue(data_po.remark);
          setPoCode(data_po.po_code);
          if(data_po.status === 'WR'){ setIsCancelPo(true) }
          if(data_po.status !== 'WR'){ setIsCancelPo(false) }
          let detailPo = data.dataDetail;   
          console.log(detailPo);
          const PoDetail = detailPo.map((data) => ({
            podetail_id: data.id,
            No: data.no,
            prod_code: data.prod_code,
            prod_name: data.prod_name,
            amount: data.amount,
            recamount: data.recamount,
            unit_id: data.unit_id,
            unit_name: data.unit,
            size_id: data.size_name,
            price: data.price,
            discount: data.discount,
            total: (data.amount*data.price) - (data.amount*data.price*data.discount/100),
            status_item : (data.statusItem !== 'รอรับ' || action === "cancel" ? true : false),
          }));
          setDataSourceEdit(PoDetail);
          //formEdit.setFieldsValue({ EditItem : PoDetail });
          setOpenModalEditPO(true);
        }
      })
      .catch((err) => {});
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
    formAdd.setFieldValue("remark", textAreaValue);
    formAdd.setFieldsValue({ Item: dataSource });
    formAdd.validateFields().then(value=>{
        POService.addPO(value).then(respon => {
          const { status, data } = respon;
          if (status === 200 && data.status === '1') {
             Swal.fire({
              title: "<strong>เปิดใบสั่งซื้อสินค้าสำเร็จ</strong>",
              html: "PO No."+data.message,
              icon: "success",
            });

            ShowPO();
            setOpenModalAddPO(false);
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
    debugger
    formEdit.setFieldValue("Editremark", textAreaEditValue);
    formEdit.setFieldsValue({ EditItem : dataSourceEdit });
    formEdit.validateFields().then(value=>{
        POService.editPO(value).then(res => {
          //debugger
          let { status, data } = res;
          if (status === 200 && data.status === '1') {
            Swal.fire({
              title: "<strong>แก้ไขใบสั่งซื้อสินค้าสำเร็จ</strong>",
              html: data.message,
              icon: "success",
            });

            ShowPO();
            setOpenModalEditPO(false);
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

  const CancelPO = (id) => {
    let parm = {
      id : id,
      action : "Cancel" 
    } 
    Swal.fire({
        title: "ยืนยัน ยกเลิกใบสั่งซื้อสำเร็จ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก"
      }).then((result) => {
        if (result.isConfirmed) {
            POService.CancelPO(parm).then( res => {
                const { status, data } = res;
              if (status === 200 && data.status === '1') {
                Swal.fire({
                 title: "<strong>ยกเลิกใบสั่งซื้อสำเร็จ</strong>",
                 html: data.message,
                 icon: "success",
               });
        
               ShowPO();
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

  const ShowModalAddPO = () => {
    POService.getPoNo()
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          formAdd.setFieldValue("po_no", data.po_code);
          setOpenModalAddPO(true);
        }
      })
      .catch((err) => {});
  };

  const onChangeSupplier = (data) => {
    let para = {
      id : data
    }
    POService.getSupplier(para)
      .then((res) => {
        let { status, data } = res;
        if (status === 200) {
          formAdd.setFieldValue("name_sup", data.supname);
          formAdd.setFieldValue("address_sup", data.assdress);
        }
      })
      .catch((err) => {});
    // this.setState({someVal: e.target.value})
  }

  const SelectChangeProduct = (value) => {
    setItemProduct(value);
  };
  const handleAddRow = () => {
    if(ItemProduct){
      let para = {
        id : ItemProduct
      }
      POService.getItem(para)
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
        // debugger
        // POService.getSizeProd(prod_id)
        //   .then((res) => {
        //     debugger
        //     let { status, data } = res;
        //     if (status === 200) {
        //       setItemsOptionSize(data.data); 
        //     }
        // })
        // .catch((err) => {});
            
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

  const handleTextBoxChangeEdit = (key, dataIndex, value) => {
    console.log(dataSourceEdit)
    const newData = [...dataSourceEdit];
    const index = newData.findIndex(item => key === item.podetail_id);
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
      setDataSourceEdit(newData);
    }
  };

  const handleChangeRemark = (event) => {
    debugger
    setTextAreaValue(event.target.value);
  };

  const handleChangeRemarkEdit = (event) => {
    debugger
    setTextAreaEditValue(event.target.value);
  };

  const columnsDetailPo = [
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
            {record.options.map(option => (
            <Option key={option.key} value={option.value}>
              {option.label}
            </Option>
          ))}
          </Select>
      ),
    },
    {
      title: 'ราคาซื้อ',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => (
        <InputNumber
          min={1} max={99999}
          value={text}
          onChange={(value) => handleTextBoxChange(record.key, 'price', value)}
        />
      ),
    },
    {
      title: 'ส่วนลด %',
      dataIndex: 'discount',
      key: 'discount',
      render: (text, record) => (
        <InputNumber
          min={0} max={100}
          value={text}
          onChange={(value) => handleTextBoxChange(record.key, 'discount', value)}
        />
      ),
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

  const columnsDetailEditPo = [
    {
      title: '',
      dataIndex: 'podetail_id',
      key: 'podetail_id',
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
          disabled={record.status_item}
          min={1} max={9999}
          value={record.amount} 
          onChange={(value) => handleTextBoxChangeEdit(record.podetail_id, 'amount' ,value)}
        />
      ),
    },
    {
      title: "จำนวนที่รับแล้ว",
      dataIndex: "recamount",
      key: "recamount",
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
      // render: (text, record) => (
      //     <Select
      //       showSearch
      //       style={{ height: 40,width: 130 }}
      //       placeholder="เลือกขนาดสินค้า"
      //       value={record.size_id} onChange={(value) => handleSelectChange(value, record)}
      //     >
      //       {/* <Option value="" selected>- เลือกขนาด -</Option> */}
      //       {itemsOptionSize.map(option => (
      //       <Option key={option.value} value={option.value}>{option.label}</Option>
      //     ))}
      //     </Select>
      // ),
    },
    {
      title: 'ราคาซื้อ',
      dataIndex: 'price',
      key: 'price',
      render: (text, record) => (
        <InputNumber
          disabled={record.status_item}
          min={1} max={99999}
          value={text}
          onChange={(value) => handleTextBoxChangeEdit(record.podetail_id, 'price', value)}
        />
      ),
    },
    {
      title: 'ส่วนลด %',
      dataIndex: 'discount',
      key: 'discount',
      render: (text, record) => (
        <InputNumber
          disabled={record.status_item}
          min={0} max={100}
          value={text}
          onChange={(value) => handleTextBoxChangeEdit(record.podetail_id, 'discount', value)}
        />
      ),
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
          onChange={(value) => handleTextBoxChangeEdit(record.podetail_id, 'total', value)}
        />
      ),
    },
    { dataIndex: "status_item",key: "status_item",className: 'hidden-column', },
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
      title: "เลขที่ PO",
      dataIndex: "po_code",
      key: "po_code",
      width: "20%",
      
      ...getColumnSearchProps("po_code"),
      sorter: (a, b) => a.po_code.localeCompare(b.po_code),
      sortDirections: ["descend", "ascend"],
    },
    {
        title: "วันที่ออก PO",
        dataIndex: "po_date",
        key: "po_date",
        width: "25%",
        ...getColumnSearchProps("po_date"),
        sorter: (a, b) => {
          const dateA = new Date(a.po_date.split('-').reverse().join('-')); // แปลงจาก "DD-MM-YYYY" เป็น "YYYY-MM-DD"
          const dateB = new Date(b.po_date.split('-').reverse().join('-'));
          return dateA - dateB; // เปรียบเทียบ Date object
        },
        sortDirections: ["descend", "ascend"],
      },
      {
        title: "ผู้ขาย",
        dataIndex: "supname",
        key: "supname",
        width: "25%",
        ...getColumnSearchProps("supname"),
      },
      {
        title: "สถานะ",
        dataIndex: "status",
        key: "status",
        width: "20%",
        ...getColumnSearchProps("status"),
        render: (data) => {
          if(data === "รับครบแล้ว"){ return <Badge status="success" text="รับครบแล้ว" />}
          if(data === "รอรับของ"){ return <Badge color="yellow" text="รอรับของ" />}  
          if(data === "รับยังไม่ครบ"){ return <Badge color="blue" text="รับยังไม่ครบ" />} 
          if(data === "ยกเลิกใบสั่งซื้อ"){ return <Badge color="red" text="ยกเลิกใบสั่งซื้อ" />} 
        },
      },
      {
        title: "Action",
        key: "operation",
        width: "25%",
        fixed: "right",
        render: (text) => {
          if(text.status !== "ยกเลิกใบสั่งซื้อ"){
            return <Button
            icon={<ToolTwoTone/>}
            style={{ cursor: "pointer" }}
            type="primary"
            ghost
            onClick={(e) => showEditModal(text.po_code,'')}
            >
            Edit
            </Button>
          }
          else if(text.status === "ยกเลิกใบสั่งซื้อ"){
            return <Button
            icon={<SearchOutlined/>}
            style={{ cursor: "pointer" }}
            type="primary"
            ghost
            onClick={(e) => showEditModal(text.po_code,'cancel')}
            >
            Detail
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
          onClick={ShowModalAddPO}
        >
          เพิ่ม ใบสั่งซื้อสินค้า
        </Button>
        <br></br>
        <br></br>
        {/* <ModalAdd
          open={OpenModalAdd}
          onCancel={() => {
            setOpenModalAdd(false);
          }}
        /> */}
        {/* PopUp ADD PO */}
        <Modal
          open={OpenModalAddPO}
          title="เพิ่ม ใบสั่งซื้อสินค้า"
          onCancel={() => {
            setOpenModalAddPO(false);
          }}
          width={1200}
          footer={
            <>
              <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
                <Button type='primary' onClick={()=>{submitAdd()}} >Create</Button>
                <Button onClick={() => setOpenModalAddPO(false) }>Cancel</Button> 
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
              เลขที่ใบ PO
              <Form.Item
                name="po_no"
              >
              <Input  disabled/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            รหัสผู้ขาย
            <Form.Item name="supcode" >
              <Select
                showSearch
                style={{ height: 40 }}
                placeholder="เลือกรหัสผู้ขาย"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)} 
                options={itemsOptionSupplier}
                onSelect={(value) => onChangeSupplier(value)}
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
            วันที่สั่งซื้อ
            <Form.Item
              name="po_date"
              rules={[{ required: true, message: 'Please select a date!' }]}
              style={{ width: '100%' }}
            >
            <DatePicker style={{ width: '100%' , height: 40}}/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            วันที่นัดส่งของ
            <Form.Item
              name="del_date"
              rules={[{ required: true, message: 'Please select a date!' }]}
              style={{ width: '100%' }}
            >
            <DatePicker style={{ width: '100%', height: 40}}/>
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
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            ภาษี
            <Form.Item
              name="vat"
              rules={[{ required: true, message: 'Please select an option!' }]}
            >
            <Radio.Group>
              <Radio value="Y">มี</Radio>
              <Radio value="N">ไม่มี</Radio>
            </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            หมายเหตุ
              <Form.Item
                name="RemarkArea"
              >
              <TextArea 
                rows={3} 
                value={textAreaValue}
                onChange={handleChangeRemark}
              />
            </Form.Item>
            <Form.Item
              name="remark"
              style={{ display: 'none' }}
            >
            <Input />
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
                columns={columnsDetailPo}
                pagination={false}
                bordered
              />
          </Col>
        </Row>
        {/* End Table detail PO */}
        </Form>
        </Modal>
        {/* End PopUp ADD PO */}

        {/* PopUp Edit PO */}
        <Modal
          open={OpenModalEditPO}
          maskClosable={false}
          title="แก้ไข ใบสั่งซื้อสินค้า"
          onCancel={() => {
            setOpenModalEditPO(false);
          }}
          width={1200}
          footer={
            <>
              <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent:'end' }} > 
                {IsCancelPo && <Button type='primary' danger onClick={()=>{CancelPO(PoCode)}}>ยกเลิกใบสั่งซื้อ</Button>}
                {!Isdisabled && <Button type='primary' onClick={()=>{submitEdit()}} >Update</Button>}
                <Button onClick={() => setOpenModalEditPO(false) }>Cancel</Button> 
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
          <Col xs={24} sm={24} md={3} lg={3} xl={3}>
              เลขที่ใบ PO
              <Form.Item
                name="Editpo_no"
              >
              <Input  disabled/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
            รหัสผู้ขาย
            <Form.Item name="Editsupcode" >
              <Select
                showSearch
                style={{ height: 40 }}
                placeholder="เลือกรหัสผู้ขาย"
                optionFilterProp="children"
                filterOption={(input, option) => (option?.label ?? '').includes(input)} 
                options={itemsOptionSupplier}
                onSelect={(value) => onChangeSupplier(value)}
                disabled
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={13} lg={13} xl={13}>
            ชื่อผู้ขาย
            <Form.Item
              name="Editname_sup"
            >
            <Input  disabled/>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              ที่อยู่ผู้ขาย
              <Form.Item
                name="Editaddress_sup"
              >
              <Input  disabled/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            วันที่สั่งซื้อ
            <Form.Item
              name="Editpo_date"
              rules={[{ required: true, message: 'Please select a date!' }]}
              style={{ width: '100%' }}
            >
            <DatePicker style={{ width: '100%' , height: 40}} disabled={Isdisabled}/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            วันที่นัดส่งของ
            <Form.Item
              name="Editdel_date"
              rules={[{ required: true, message: 'Please select a date!' }]}
              style={{ width: '100%' }}
            >
            <DatePicker style={{ width: '100%', height: 40}} disabled={Isdisabled}/>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            การชำระเงิน
            <Form.Item
              name="Editpayment"
            >
            <Select placeholder="เลือก การชำระเงิน" style={{ height: 40 }} disabled={Isdisabled}>
              <Option value="เงินสด">เงินสด</Option>
              <Option value="30 วัน">30 วัน</Option>
              <Option value="45 วัน">45 วัน</Option>
              <Option value="60 วัน">60 วัน</Option>
              <Option value="90 วัน">90 วัน</Option>
              <Option value="120 วัน">120 วัน</Option>
            </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6} xl={6}>
            ภาษี
            <Form.Item
              name="Editvat"
              rules={[{ required: true, message: 'Please select an option!' }]}
            >
            <Radio.Group  disabled={Isdisabled}>
              <Radio value="Y">มี</Radio>
              <Radio value="N">ไม่มี</Radio>
            </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            หมายเหตุ
              <Form.Item
                name="EditRemarkArea"
              >
              <TextArea 
                rows={3} 
                value={textAreaEditValue}
                onChange={handleChangeRemarkEdit}
                disabled={Isdisabled}
              />
            </Form.Item>
            <Form.Item
              name="Editremark"
              style={{ display: 'none' }}
            >
            <Input />
            </Form.Item>
            <Form.Item
              name="EditItem"
              style={{ display: 'none' }}
            >
            <Input />
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ margin: '5px 0' }}/>
        {/* Table detail PO */}
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
             <Table
                dataSource={dataSourceEdit}
                columns={columnsDetailEditPo}
                pagination={false}
                bordered
              />
          </Col>
        </Row>
        {/* End Table detail PO */}
        </Form>
        </Modal>
        {/* End PopUp Edit PO */}
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
            <Card bordered={false} className="criclebox cardbody h-full">
              <Table columns={columns} dataSource={AllPO} rowKey="po_code" />
            </Card>
          </Col>
        </Row>

      </div>
    </>
  );
};

export default PO;
