
import { requestService as api , getParmeter} from "./Request.service" 
import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";
const API_URL = {
  Add_CATEGORY: `/category/add_category.php`,
  GET_CATEGORY: `/category/get_category.php`,
  GET_CATEGORY_ByID: `/category/get_category_byid.php`,
  Edit_CATEGORY: `/category/edit_category.php`,
  GET_SUBCATEGORY: `/category/get_subcategory.php`,
  Add_SUBCATEGORY: `/category/add_subcategory.php`,
  Edit_SUBCATEGORY: `/category/edit_subcategory.php`,
  GET_SUBCATEGORY_ByID: `/category/get_subcategory_byid.php`,
  //PIC
  Upload_Pic: `${BACKEND_URL}/category/upload_pic.php`,
  Delete_Pic: `${BACKEND_URL}/category/delete_pic.php`,
  Delete_Pic_Update: `${BACKEND_URL}/category/delete_pic_update.php`,
  DeleteAll_Pic: `${BACKEND_URL}/category/delete_all_pic.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};
 
const CategoryService = {
  addCategory: (reqData) => {
    /*return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_CATEGORY,
      headers: contenttype,
      data: reqData,
    });*/
    return api.post(API_URL.Add_CATEGORY, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },

  getCategory: async (parm = {}) => {
    /*return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_CATEGORY,
      headers: contenttype,
    });*/
    return api.get(`${API_URL.GET_CATEGORY}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  
  getCategoryByid: (reqData) => {
    return api.get(`${API_URL.GET_CATEGORY_ByID}?${getParmeter(reqData)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },

  editCategory: (reqData) => {
    return api.post(API_URL.Edit_CATEGORY, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getSubCategory: (reqData) => {
    return api.get(`${API_URL.GET_SUBCATEGORY}?${getParmeter(reqData)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  AddSubCategory: (reqData) => {
    return api.post(API_URL.Add_SUBCATEGORY, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  editSubCategory: (reqData) => {
    return api.post(API_URL.Edit_SUBCATEGORY, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getSubCategoryByid: (reqData) => {
    return api.get(`${API_URL.GET_SUBCATEGORY_ByID}?${getParmeter(reqData)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  //Pic
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

export default CategoryService;
