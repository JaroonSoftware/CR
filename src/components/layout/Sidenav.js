// import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {  Menu, MenuItem } from "react-pro-sidebar";
import logo from "../../assets/images/logo_nsf.png";
import nav from "../../nav";
import '../../assets/MenuStyles.css';

const Sidenav = () => {
  const { pathname } = useLocation();

  const navActiveStyle = {
    padding: "10px 16px",
    color: "#141414",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 20px 27px rgba(0,0,0,.05)",
  }
  const menuItemStyle = {
    whiteSpace: 'normal', // อนุญาตให้ข้อความมีหลายบรรทัด
    height: 'auto', // ให้ความสูงปรับตามจำนวนบรรทัดของข้อความ
    lineHeight: 'normal', // จัดระยะห่างระหว่างบรรทัดให้เหมาะสม
    padding: '8px 16px', // ปรับ padding ตามความต้องการ
  };
  const titleContentStyle = {
    display: 'inline-block', // ทำให้เนื้อหาแสดงผลเป็นบล็อคสำหรับการบรรทัดใหม่
    maxWidth: '150px', // กำหนดความกว้างสูงสุด
    overflow: 'hidden', // ป้องกันไม่ให้ข้อความล้น
    whiteSpace: 'normal', // อนุญาตให้ข้อความมีหลายบรรทัด
    lineHeight: '1.2', // ปรับระยะห่างระหว่างบรรทัด
  };
  return (
    <>
      <div className="brand">
        <img src={logo} alt="" />
        <span>Chai Rat</span>
      </div>
      <hr />

      {/* <Sidebar style={{minWidth:"100%", width:"100%"}} > */}
        <Menu theme="light" mode="inline">
          {nav.map((item, idx) => {
            return ( !item?.type ? (
                  <MenuItem
                    icon={item?.icon}
                    key={idx}
                    component={<Link to={item?.to} style={{navActiveStyle}} />}
                    style={menuItemStyle} 
                    className={pathname.startsWith(item?.to)? "nav-active" : null}
                  >
                  <span style={titleContentStyle}> {item?.title}</span>  
                  </MenuItem>
                ) : (
                  <MenuItem key={idx} className="nav-group-title">
                    <span style={titleContentStyle}> {item?.title}</span>  
                  </MenuItem>
                )
            );
          })}
        </Menu>
      {/* </Sidebar> */}
    </>
  );
};

export default Sidenav;
