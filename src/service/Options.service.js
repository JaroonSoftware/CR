import { requestService as api, getParmeter } from "./Request.service"  
const API_URL = {
  ITEMS_OPTION: `/common/items-option.php`, 
};
 

const optionService = () => {
  const optionsItems = (parm = {}) => api.get(`${API_URL.ITEMS_OPTION}?${getParmeter(parm)}`).catch(e => { throw new Error("เกิดปัญช้อผิดพลาด") })

  return {
    optionsItems
  };
};

export default optionService;