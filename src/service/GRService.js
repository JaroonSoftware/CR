
import { requestService as api , getParmeter} from "./Request.service"  

const API_URL = {
  Add_GR: `/GR/addGr.php`,
  Edit_GR: `/GR/edit_gr.php`,
  GET_Option: `/GR/getoption.php`,
  GET_DetailPO: `/GR/get_detailpo.php`,
  GET_GrNo: `/GR/getgr_no.php`,
  GET_AllGR: `/GR/get_allGr.php`,
  GET_GRById: `/GR/get_gr_byid.php`,
  //DEL_ProductSize: `/GR/del_productsize.php`,
};


const GR = {

  getOption: async (parm = {}) => {
    return api.get(`${API_URL.GET_Option}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getGrNo: async (parm = {}) => {
    return api.get(`${API_URL.GET_GrNo}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  addGR: (reqData) => {
    return api.post(API_URL.Add_GR, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getAllGR: async (parm = {}) => {
    return api.get(`${API_URL.GET_AllGR}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getGRByid: async (parm = {}) => {
    return api.get(`${API_URL.GET_GRById}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  editGR: (reqData) => {
    return api.post(API_URL.Edit_GR, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  getDetailPo: async (parm = {}) => {
    return api.get(`${API_URL.GET_DetailPO}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  
  // DeleteProductSize: (reqData) => {
  //   return api.post(API_URL.DEL_ProductSize, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  // },
};

export default GR;
