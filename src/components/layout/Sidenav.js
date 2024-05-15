// import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {  Menu, MenuItem } from "react-pro-sidebar";
import logo from "../../assets/images/logo_nsf.png";
import nav from "../../nav";

const Sidenav = () => {
  const { pathname } = useLocation();

  const navActiveStyle = {
    padding: "10px 16px",
    color: "#141414",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 20px 27px rgba(0,0,0,.05)",
  }
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
                    className={pathname.startsWith(item?.to)? "nav-active" : null}
                  >
                    {item?.title}
                  </MenuItem>
                ) : (
                  <MenuItem key={idx} className="nav-group-title">
                    {item?.title}
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
