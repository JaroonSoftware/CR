
import { requestService as api , getParmeter} from "./Request.service"  

const API_URL = {
  Add_ProductCategory: `/productcategory/add_productcategory.php`,
  GET_ProductCategory: `/productcategory/get_productcategory.php`,
  GET_SubProductCategory: `/productcategory/get_subcategory.php`,
  DEL_ProductCategory: `/productcategory/del_productcategory.php`,
};


const ProductCategory = {

  addProductCategory: (reqData) => {
    return api.post(API_URL.Add_ProductCategory, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getProductCategory: async (parm = {}) => {
    return api.get(`${API_URL.GET_ProductCategory}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getSubProductCategory: async (parm = {}) => {
    return api.get(`${API_URL.GET_SubProductCategory}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  
  DeleteProductCategory: (reqData) => {
    return api.post(API_URL.DEL_ProductCategory, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
};

export default ProductCategory;
