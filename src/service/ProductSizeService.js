
import { requestService as api , getParmeter} from "./Request.service"  

const API_URL = {
  Add_ProductSize: `/productsize/add_productsize.php`,
  GET_ProductSize: `/productsize/get_productsize.php`,
  GET_SizeByProduct: `/productsize/get_sizebyproduct.php`,
  DEL_ProductSize: `/productsize/del_productsize.php`,
};


const ProductSize = {

  addProductSize: (reqData) => {
    return api.post(API_URL.Add_ProductSize, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getProductSize: async (parm = {}) => {
    return api.get(`${API_URL.GET_ProductSize}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getSizeByProduct: async (parm = {}) => {
    return api.get(`${API_URL.GET_SizeByProduct}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  
  DeleteProductSize: (reqData) => {
    return api.post(API_URL.DEL_ProductSize, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
};

export default ProductSize;
