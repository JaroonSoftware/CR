import React from 'react';
import '../../src/assets/PrintLabel.css';
const PrintLabel = ({ data }) => (   
        <div className="page-box" id="prinlabel-content" style={{ transform: 'rotate(-90deg)', writingMode: 'vertical-rl'}}>
          <table>
            <tr>
                <td>
                <br/>
                   <span style={{fontSize:35,marginTop: 20}}>
                        {data.cus_name} 
                   </span>
                    <br/>
                    <br/>
                    <span style={{fontSize:25,marginTop: 20, lineHeight: 1}}> 
                        {data.address+' '+data.subdistrict+' '+data.district+' '+data.province+' '+data.zipcode}
                    </span>
                    <br/>
                    <br/>
                    <span style={{fontSize:25,marginTop: 20}}> 
                    Tel. {data.tel}
                    </span>
                </td>
            </tr>
          </table>
        </div>
      );
export default PrintLabel;