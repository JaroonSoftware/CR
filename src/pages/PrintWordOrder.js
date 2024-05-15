import React from 'react';

import '../../src/assets/PrintWordOrder.css';

const PrintWordOrder = ({ data }) => (   
    
      <div className="invoice-box " id="printable-content" >
        <table cellPadding={0} cellSpacing={0}>
          <tr className="top">
            <td colSpan={2}>
              <table>
                <tr>
                  <td className="title" style={{textAlign : 'center'}}>
                    <h4>ร้านชัยรัตน์</h4>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr className="information">
            <td colSpan={2}>
              <table>
                <tr>
                  <td>
                    เลขที่ใบสั่งซื้อ <b>{data.OrderNo}</b>
                  </td>

                  <td>
                    วันที่ <b>{new Date().toLocaleDateString()}</b>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr className="heading">
            <td>รายการสินค้า</td>

            <td>จำนวน</td>
          </tr>
          {data.ItemProduct.map((list) => (
          <tr className="details">
            <td>{list.No+'. '+list.ProductName}</td>
            <td>{list.Amount}</td>
          </tr>
          ))}
        </table>
        <div style={{height : '50px'}}>

        </div>
        <table>
        <tr className='Hremark'>
            <td>
            <b>รายละเอียดที่สั่งปัก</b>
            </td>
        </tr>
        <tr>
            <td>
            1. ชื่อ - นามสกุล : <b>{data.embroider_prefix+' '+data.embroider_name+' '+data.embroider_surname}</b>
            <br/>
            2. ชั้น : <b>{data.class}</b>
            <br/>
            3. สัญลักษณ์ : <b>{data.emblem}</b>
            <br/>
            4. สี : <b>{data.color}</b>
            <br/>
            5. ตำแหน่ง : <b>{data.position}</b>
            </td>
        </tr>
        
        </table>
      </div>
    );
export default PrintWordOrder;