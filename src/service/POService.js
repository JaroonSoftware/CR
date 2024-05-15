
import { requestService as api , getParmeter} from "./Request.service"  

const API_URL = {
  Add_PO: `/po/addPo.php`,
  Edit_PO: `/po/edit_po.php`,
  GET_Option: `/po/getoption.php`,
  GET_Supplier: `/po/getsup.php`,
  GET_PoNo: `/po/getpo_no.php`,
  GET_ItemProduct: `/po/get_itemprod.php`,
  GET_SizeProd: `/po/get_sizeprod.php`,
  GET_AllPO: `/po/get_allPo.php`,
  GET_POById: `/po/get_po_byid.php`,
  Cancel_PO: `/po/cancel_po.php`,
};


const PO = {

  getSupplier: async (parm = {}) => {
    return api.get(`${API_URL.GET_Supplier}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getOptionPO: async (parm = {}) => {
    return api.get(`${API_URL.GET_Option}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getPoNo: async (parm = {}) => {
    return api.get(`${API_URL.GET_PoNo}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getItem: async (parm = {}) => {
    return api.get(`${API_URL.GET_ItemProduct}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getSizeProd: async (parm = {}) => {
    return api.get(`${API_URL.GET_SizeProd}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  addPO: (reqData) => {
    return api.post(API_URL.Add_PO, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getAllPO: async (parm = {}) => {
    return api.get(`${API_URL.GET_AllPO}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getPOByid: async (parm = {}) => {
    return api.get(`${API_URL.GET_POById}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  editPO: (reqData) => {
    return api.post(API_URL.Edit_PO, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  CancelPO: (reqData) => {
    return api.post(API_URL.Cancel_PO, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  
  // DeleteProductSize: (reqData) => {
  //   return api.post(API_URL.DEL_ProductSize, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  // },
};

export default PO;
