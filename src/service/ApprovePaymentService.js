
import { requestService as api , getParmeter} from "./Request.service" 
const API_URL = {
  GET_ApprovePayment: `/approvepayment/get_Payment.php`,
  GET_ApprovePayment_ByID: `/approvepayment/get_Payment_byid.php`,
  GET_OrderNo: `/approvepayment/get_orderno.php`,
  Approve_Payment: `/approvepayment/approve_Payment.php`,
  Cancel_Payment: `/approvepayment/cancel_Payment.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};
 
const ApprovePaymentService = {

  getApprovePayment: async (parm = {}) => {
    return api.get(`${API_URL.GET_ApprovePayment}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  
  getApprovePaymentByid: (reqData) => {
    return api.get(`${API_URL.GET_ApprovePayment_ByID}?${getParmeter(reqData)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },

  ApprovePayment: (reqData) => {
    return api.post(API_URL.Approve_Payment, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  CancelPayment: (reqData) => {
    return api.post(API_URL.Cancel_Payment, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  // GetOrderNo: (reqData) => {
  //   return api.get(`${API_URL.GET_OrderNo}?${getParmeter(reqData)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  // },
  GetOrderNo: async (parm = {}) => {
    return api.get(`${API_URL.GET_OrderNo}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  

};

export default ApprovePaymentService;
