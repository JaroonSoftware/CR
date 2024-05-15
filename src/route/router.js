import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Unit from "../pages/Unit";
import Profile from "../pages/Profile";
import Ecommerce from "../pages/ecommerce";
import HTP from "../pages/HTP";
import Allitems from "../pages/Allitems";
import PageNotFound from "../pages/404";
import Type from "../pages/Type";
import Product from "../pages/Product";
import User from "../pages/User";
import Size from "../pages/Size";
// import Category from "../pages/Category";
import Supplier from "../pages/Supplier";
import { CategoryForm, SubCategory } from "../pages/Category/Category";
import POForm  from "../pages/Po/PO";
import Gr from "../pages/Gr";
import ManageProductCategory from "../pages/Manage_product_category";
import ManageProductSize from "../pages/Manage_product_size";
//import TEST from "../pages/TEST";
import PrivateRoute from "../components/auth/PrivateRoutes";
import { ROLES } from "../constant/constant";
import Order from "../pages/Order";
import Payment from "../pages/Payment";
import ApprovePayment from "../pages/ApprovePayment";
import ShopOrder from "../pages/ShopOrder";
import Stock from "../pages/Stock";
import Receipt from "../pages/Receipt";
const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ส่วนของหน้าบ้าน */}
        <Route path="/" element={<Ecommerce />}></Route>
        <Route path="/HTP" element={<HTP />}></Route>
        <Route path="/Allitems" element={<Allitems />}></Route>
        <Route path="/Order" element={<Order />}></Route>
        <Route path="/Payment" element={<Payment />}></Route>
        {/* ส่วนของหลังบ้าน */}
        <Route element={<PrivateRoute allowdRole={[ROLES.ADMIN]} />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/unit" element={<Unit />} />
          <Route path="/type" element={<Type />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/supplier" element={<Supplier />} />
          <Route path="/size" element={<Size />} />
          <Route path="/ManageProductSize" element={<ManageProductSize />} />
          {/* <Route path="/category" element={<Category />} /> */}
          <Route path="category/" element={<CategoryForm />} />
          <Route path="category/:action/:id" element={<SubCategory />} />
          <Route
            path="/ManageProductCategory"
            element={<ManageProductCategory />}
          />
          <Route path="Po/" element={<POForm />} />
          <Route path="Gr/" element={<Gr />} />
          <Route path="ShopOrder/" element={<ShopOrder />} />
          <Route path="Receipt/" element={<Receipt />} />
          <Route path="ApprovePayment/" element={<ApprovePayment />} />
          <Route path="Stock/" element={<Stock />} />
          
        </Route>
        
        {/* ส่วนของหลังบ้านเฉพาะ Admin */}
        <Route element={<PrivateRoute allowdRole={[ROLES.ADMIN]} />}>
          <Route path="/user" element={<User />} />
        </Route>
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
