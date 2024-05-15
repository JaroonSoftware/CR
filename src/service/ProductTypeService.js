
import { requestService as api , getParmeter} from "./Request.service"  

const API_URL = {
  Add_ProductType: `/producttype/add_producttype.php`,
  GET_ProductType: `/producttype/get_producttype.php`,
  GET_ProductType_ByID: `/producttype/get_producttype_byid.php`,
  Edit_ProductType: `/producttype/edit_producttype.php`,
};


const ProductType = {
  addProductType: (reqData) => {
    /*return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_CATEGORY,
      headers: contenttype,
      data: reqData,
    });*/
    return api.post(API_URL.Add_ProductType, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },

  getProductType: async (parm = {}) => {
    /*return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_CATEGORY,
      headers: contenttype,
    });*/
    return api.get(`${API_URL.GET_ProductType}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  
  getProductTypeByid: (reqData) => {
    return api.get(`${API_URL.GET_ProductType_ByID}?${getParmeter(reqData)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },

  editProductType: (reqData) => {
    return api.post(API_URL.Edit_ProductType, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
};

export default ProductType;
