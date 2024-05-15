
import { requestService as api , getParmeter} from "./Request.service"  

const API_URL = {
  Add_Receipt: `/receipt/add_receipt.php`,
  Edit_Receipt: `/receipt/update_receipt.php`,
  GET_OrderNo: `/receipt/get_orderno.php`,
  GET_AllReceipt: `/receipt/get_receipt.php`,
  GET_ReceiptByid: `/receipt/get_receiptbyid.php`,
  Cancel_Receipt: `/receipt/cancel_receipt.php`,
};


const Receipt = {

  addReceipt: (reqData) => {
    return api.post(API_URL.Add_Receipt, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  UpdateReceipt: (reqData) => {
    return api.post(API_URL.Edit_Receipt, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getOrderNo: async (parm = {}) => {
    return api.get(`${API_URL.GET_OrderNo}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getAllReceipt: async (parm = {}) => {
    return api.get(`${API_URL.GET_AllReceipt}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getReceiptById: async (parm = {}) => {
    return api.get(`${API_URL.GET_ReceiptByid}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  CancelReceipt: (reqData) => {
    return api.post(API_URL.Cancel_Receipt, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
};

export default Receipt;
