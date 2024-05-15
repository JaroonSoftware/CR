import { requestService as api , getParmeter} from "./Request.service"  
import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";

const API_URL = {
  Add_SUPPLIER: `${BACKEND_URL}/supplier/add_supplier.php`,
  GET_SUPPLIER: `${BACKEND_URL}/supplier/get_supplier.php`,
  GETSUP_SUPPLIER: `${BACKEND_URL}/supplier/getsup_supplier.php`,
  Edit_SUPPLIER: `${BACKEND_URL}/supplier/edit_supplier.php`,
  GET_SUPCODE: `${BACKEND_URL}/supplier/get_supcode.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};

const SupplierService = {
  addSupplier: (reqData) => {
    return api.post(API_URL.Add_SUPPLIER, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },

  getSupcode:  (parm = {}) => {
    return api.get(`${API_URL.GET_SUPCODE}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },  
  
  getSupSupplier: (reqData) => {
    return axios({
      method: MEDTHOD.POST,      
      url: API_URL.GETSUP_SUPPLIER,
      data: {
        idcode: reqData,
      },
      headers: contenttype,
    });
  },

  editSupplier: (reqData) => {
    return api.post(API_URL.Edit_SUPPLIER, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },

  getSupplier: (parm = {}) => {
    return api.get(`${API_URL.GET_SUPPLIER}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
};

export default SupplierService;
