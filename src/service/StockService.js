
import { requestService as api , getParmeter} from "./Request.service" 
const API_URL = {
  GET_Stock: `/stock/get_Stock.php`,
};

 
const StockService = {

  getAllStock: async (parm = {}) => {
    return api.get(`${API_URL.GET_Stock}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดข้อผิดพลาด") });
  },

};

export default StockService;
