
import { requestService as api , getParmeter} from "./Request.service"  

const API_URL = {
  Add_ShopOrder: `/ShopOrder/addShopOrder.php`,
  Edit_ShopOrder: `/ShopOrder/edit_ShopOrder.php`,
  GET_Option: `/ShopOrder/getoption.php`,
  GET_OrderNo: `/ShopOrder/getso_no.php`,
  GET_ItemProduct: `/ShopOrder/get_itemprod.php`,
  GET_SizeProd: `/ShopOrder/get_sizeprod.php`,
  GET_AllShopOrder: `/ShopOrder/get_allShopOrder.php`,
  GET_ShopOrderById: `/ShopOrder/get_so_byid.php`,
  Cancel_ShopOrder: `/ShopOrder/cancel_ShopOrder.php`,
  Action_Delivery: `/ShopOrder/action_delivery.php`,
  ActionCancel_Delivery: `/ShopOrder/action_cancel_delivery.php`,
};


const ShopOrder = {

  getOptionShopOrder: async (parm = {}) => {
    return api.get(`${API_URL.GET_Option}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getOrderNo: async (parm = {}) => {
    return api.get(`${API_URL.GET_OrderNo}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getItem: async (parm = {}) => {
    return api.get(`${API_URL.GET_ItemProduct}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  // getSizeProd: async (parm = {}) => {
  //   return api.get(`${API_URL.GET_SizeProd}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  // },
  addShopOrder: (reqData) => {
    return api.post(API_URL.Add_ShopOrder, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getAllShopOrder: async (parm = {}) => {
    return api.get(`${API_URL.GET_AllShopOrder}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getShopOrderByid: async (parm = {}) => {
    return api.get(`${API_URL.GET_ShopOrderById}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  editShopOrder: (reqData) => {
    return api.post(API_URL.Edit_ShopOrder, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  CancelShopOrder: (reqData) => {
    return api.post(API_URL.Cancel_ShopOrder, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  ActionDelivery: (reqData) => {
    return api.post(API_URL.Action_Delivery, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  ActionCancelDelivery: (reqData) => {
    return api.post(API_URL.ActionCancel_Delivery, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  
  // DeleteProductSize: (reqData) => {
  //   return api.post(API_URL.DEL_ProductSize, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  // },
};

export default ShopOrder;
