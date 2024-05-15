import jwt_decode from "jwt-decode";
import {decode as dcode, encode as ecode} from 'base-64'; 
export  const Authenticate = () => {
    
    const setToken = (token) =>{
       sessionStorage.setItem("authen", token);
    }
    
    const getToken = () =>{
        const t = sessionStorage.getItem("authen");
        // console.log(t);
        return t;
    }
    
    const removeToken = () =>{
        window.history.replaceState(null, null, "/");
        return sessionStorage.removeItem("authen");
    }
    
    const decodeToken = (token) => {
        let d = jwt_decode(token); 
        return d;
    }
    
    const isExpireToken = ( dirc = ()=>{} ) =>{
        // debugger;
        const t = getToken();
        if(!t) {
            removeToken();
            window.history.replaceState(null, null, "/");
            dirc(); 
            return false;
        }
        const {expd:newdate } = decodeToken(t); 
        return (new Date(newdate.date)).getTime() > Date.now();
    }
    
    const setCurrent = (path) =>{
        localStorage.setItem( "current", ecode(ecode(path)) );
    }

    const getCurrent = () =>{
        let path = localStorage.getItem( "current");

        return !!path ? dcode(dcode(path)) : path;
    }

    const token = getToken();

    return {
        token,
        setToken,
        getToken,
        removeToken,
        decodeToken,
        isExpireToken,
        setCurrent,
        getCurrent
    };
}