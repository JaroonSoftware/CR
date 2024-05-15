import { requestService as api , getParmeter} from "./Request.service"  
import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";
const API_URL = {
  Add_Product: `${BACKEND_URL}/product/add_product.php`,
  GET_Product: `${BACKEND_URL}/product/get_product.php`,
  GET_Product_ByID: `${BACKEND_URL}/product/get_product_byid.php`,
  Edit_Product: `${BACKEND_URL}/product/edit_product.php`,
  Upload_Pic: `${BACKEND_URL}/product/upload_pic.php`,
  Delete_Pic: `${BACKEND_URL}/product/delete_pic.php`,
  Delete_Pic_Update: `${BACKEND_URL}/product/delete_pic_update.php`,
  DeleteAll_Pic: `${BACKEND_URL}/product/delete_all_pic.php`,
  GET_Procode: `${BACKEND_URL}/product/get_procode.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};

const Product = {
  addProduct: (reqData) => {
    return api.post(API_URL.Add_Product, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },

  getProduct: (parm = {}) => {
    return api.get(`${API_URL.GET_Product}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  
  getProductByid: (reqData) => {
    return api.get(`${API_URL.GET_Product_ByID}?${getParmeter(reqData)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },

  editProduct: (reqData) => {
    return api.post(API_URL.Edit_Product, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getProcode: (reqData) => {
    return api.get(`${API_URL.GET_Procode}?${getParmeter(reqData)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },  

  uploadPic: (formData) => {
      return axios({
        method: MEDTHOD.POST,
        url: API_URL.Upload_Pic,
        headers: contenttype,
        data: formData,
      });
    },
  deletePic: (formData) => {
      return axios({
        method: MEDTHOD.POST,
        url: API_URL.Delete_Pic,
        headers: contenttype,
        data: formData,
      });
  },
  deletePicUpdate: (formData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Delete_Pic_Update,
      headers: contenttype,
      data: formData,
    });
},
  deleteAllPic: (filesToDelete ) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.DeleteAll_Pic,
      headers: contenttype,
      data: filesToDelete ,
    });
},
};

export default Product;
