/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import { Modal, Card, Table, message, Form, Spin , Select } from "antd";
import { Row, Col, Space, } from "antd";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useForm } from 'antd/es/form/Form';

import optionService from "../../service/Options.service"
import POService from "../../service/POService";
export default function ModalAddPO({show, close, onSubmit }) {

    const [form] = useForm();

    const [itemsOptionSupplier, setItemsOptionSupplier] = useState([]);
 
    const [openModal,  setOpenModel] = useState(show);
    const [loading,  setLoading] = useState(true);
    /** handle logic component */
    const handleClose = () =>{ 
        setTimeout( () => { close(false);  }, 140);
        
        //setTimeout( () => close(false), 200 );
    } 
 
 
    const handleChoose = (value) => {
       // values(value);
        setOpenModel(false);
    }

    /** setting initial component */

    const onload = () => {
        // debugger;
        // setLoading(true);
        // SampleRequestService.sampleRequestMaster()
        // .then((res) => {
        //   let { status, data } = res;
        //   if (status === 200) {
        //     setSampleRequestMasterData([...sampleRequestMasterData, ...data.data]);
        //     setSampleRequestMasterDataWrap([...sampleRequestMasterData, ...data.data]);

        //   } 
        // })
        // .catch((err) => {  
        //     message.error("Request error!")
        // })
        // .finally( () => setTimeout( () => { setLoading(false) }, 400));
    }

    const handleSubmit = () => {
      // ส่งข้อมูลไปยังหน้าหลัก
      onSubmit(form);
    };

    useEffect( () => {
        if( !!openModal ){
            onload();
            // console.log("modal-sample-request")
        } 
    }, [openModal]);
 
    return (
        <>
        <Modal
            open={openModal}
            title="เพิ่ม PO"
            afterClose={() => handleClose() }
            onCancel={() => setOpenModel(false) } 
            style={{ top: 20 }}
            width={1000}
            onOk={handleSubmit}
        >
            {/* <Spin > */}
                <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative'}}  >
                    <Card style={{backgroundColor:'#f0f0f0' }}>
                        <Form form={form} layout="vertical" autoComplete="off" >
                          <Row gutter={[24, 0]}>
                            <Col xs={24} sm={24} md={3} lg={3} xl={3}>
                              เลขที่ใบ PO
                              <Form.Item
                                name="po_no"
                              >
                                <Input  />
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
                                />
                              </Form.Item>
                            </Col>
                            <Col xs={24} sm={24} md={13} lg={13} xl={13}>
                              เลขที่ใบ PO
                              <Form.Item
                                name="po_no"
                              >
                                <Input  disabled/>
                              </Form.Item>
                            </Col>
                          </Row>
   
                        </Form>
                    </Card>
                </Space>                
            {/* </Spin> */}

        </Modal>    
        </>
    )
}
