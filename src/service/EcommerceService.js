import axios from "axios";
import { MEDTHOD } from "../constant/constant";
import { BACKEND_URL } from "../utils/util";
const API_URL = {
  GET_Ecommerce: `${BACKEND_URL}/ecommerce/get_product_ecommerce.php`,
  GET_CategoryEcommerce: `${BACKEND_URL}/ecommerce/get_category_ecommerce.php`,
  GET_ProductCategory: `${BACKEND_URL}/ecommerce/get_productcategory.php`,
  GET_SubProductCategory: `${BACKEND_URL}/ecommerce/get_subcategory.php`,
  GET_Option :`${BACKEND_URL}/ecommerce/getoption.php`,
  GET_ProductById :`${BACKEND_URL}/ecommerce/get_prodbyid.php`,
  GET_Amount :`${BACKEND_URL}/ecommerce/get_amount.php`,
  CHECK_AmountProductSizeByCart:`${BACKEND_URL}/ecommerce/check_amountCart.php`,
  ADD_SO:`${BACKEND_URL}/ecommerce/add_SO.php`,
  ADD_PAYMENT:`${BACKEND_URL}/ecommerce/add_Payment.php`,

  Upload_Pic: `${BACKEND_URL}/ecommerce/upload_pic.php`,
  Delete_Pic: `${BACKEND_URL}/ecommerce/delete_pic.php`,
  DeleteAll_Pic: `${BACKEND_URL}/ecommerce/delete_all_pic.php`,
};

let contenttype = {"content-type": "application/x-www-form-urlencoded"};

const Ecommerce = {
  getProdEcommerce: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.GET_Ecommerce,
      headers: contenttype,
      data: reqData,
    });
  },
  getCategoryEcommerce: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_CategoryEcommerce,
      headers: contenttype,
    });
  },
  getCategoryItem: () => {
    return axios({
      medthod: MEDTHOD.GET,
      url: API_URL.GET_ProductCategory,
      headers: contenttype,
    });
  },
  getOption: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.GET_Option,
      headers: contenttype,
      data: {
        Option: reqData,
      },
    });
  },
  getSubProductCategory: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.GET_SubProductCategory,
      headers: contenttype,
      data: {
        id: reqData,
      },
    });
  },
  getProductByid: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.GET_ProductById,
      headers: contenttype,
      data: reqData,
    });
  },
  CheckAmount: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.GET_Amount,
      headers: contenttype,
      data: reqData,
    });
  },
  CheckAmountProductSizeByCart: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.CHECK_AmountProductSizeByCart,
      headers: contenttype,
      data: reqData,
    });
  },
  addSO: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.ADD_SO,
      headers: contenttype,
      data: reqData,
    });
  },
  addPayment: (reqData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.ADD_PAYMENT,
      headers: contenttype,
      data: reqData,
    });
  },
  uploadPic: (formData) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.Upload_Pic,
      headers: contenttype,
      data: formData,
    });
  },
  deletePic: (formData) => {
      return axios({
        method: MEDTHOD.POST,
        url: API_URL.Delete_Pic,
        headers: contenttype,
        data: formData,
      });
  },
  deleteAllPic: (filesToDelete ) => {
    return axios({
      method: MEDTHOD.POST,
      url: API_URL.DeleteAll_Pic,
      headers: contenttype,
      data: filesToDelete ,
    });
  },
  

};

export default Ecommerce;
