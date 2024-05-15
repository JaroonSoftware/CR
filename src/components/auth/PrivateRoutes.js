/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Modal } from 'antd';
import Main from "../layout/Main";
import { Authenticate } from "../../service/Authenticate.service";

const authService = Authenticate();

const PrivateRoute = ({ allowdRole }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [ tokenExp, setTokenExp ] = useState(true);
  // const navigate = useNavigate();

  //   useEffect(() => {
  //     let exp = STORAGE.GET("expired");
  //     let token = STORAGE.GET("token");
  //     let current = parseInt(Date.now() / 1000);

  //     if (!token || !exp || current > exp) {
  //       navigate("/login", { replace: true });
  //     }
  //   }, [location.pathname]);
  useEffect(() => { 
    //console.log(location.pathname)  
    authService.setCurrent(location.pathname);
    let exp = authService.isExpireToken(()=>{
      navigate("/login", { replace: true });
    });
    setTokenExp(exp); 
  }, [location.pathname]);

  const authCheck = () => {
    let payload = { role: "admin" };
    // let tokenExp = authService.isExpireToken( ()=>{ navigate("/login", { replace: true }) }); 
    if( allowdRole.includes(payload?.role) && tokenExp ) return true;
    else return Modal.error({
      title: 'Session Expire',
      content: 'your session expired please relogin',
      onOk: () => navigate("/login", { replace: true })
    })
  };

  return authCheck() ? (
    <Main>
      <Outlet />
    </Main>
  ) : ( <Navigate to="/login" state={{ from: location }} replace /> )
};

export default PrivateRoute;
