
import { requestService as api , getParmeter} from "./Request.service"  

const API_URL = {
  Add_Size: `/size/add_size.php`,
  GET_Size: `/size/get_size.php`,
  GET_Size_ByID: `/size/get_size_byid.php`,
  Edit_Size: `/size/edit_size.php`,
};


const Size = {
  addSize: (reqData) => {
    /*return axios({
      method: MEDTHOD.POST,
      url: API_URL.Add_CATEGORY,
      headers: contenttype,
      data: reqData,
    });*/
    return api.post(API_URL.Add_Size, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },

  getSize: async (parm = {}) => {
    /*return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_CATEGORY,
      headers: contenttype,
    });*/
    return api.get(`${API_URL.GET_Size}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
  
  getSizeByid: (reqData) => {
    return api.get(`${API_URL.GET_Size_ByID}?${getParmeter(reqData)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },

  editSize: (reqData) => {
    return api.post(API_URL.Edit_Size, {...reqData}).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },
};

export default Size;