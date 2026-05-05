import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Test } from "./pages/Test";
import { UpdateUser } from "./pages/UpdateUser";
import { ProductDetail } from "./pages/ProductDetail";
import { CreateProduct } from "./pages/CreateProduct";
import { SelectProductToModify } from "./pages/SelectProductToModify";
import { NotFound } from "./pages/NotFound";
import { ModifyProduct } from "./pages/ModifyProduct";
import { Catalog } from "./pages/Catalog";
import { NewProducts } from "./pages/NewProducts";
import { Offers } from "./pages/Offers";
import { Cart } from "./pages/Cart";
import { FAQ } from "./pages/FAQ";
import { Shipping } from "./pages/Shipping";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";
import { Cookies } from "./pages/Cookies";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<NotFound />}>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="test" element={<Test />} />
      <Route path="updateuser" element={<UpdateUser />} />
      <Route path="createproduct" element={<CreateProduct />} />
      <Route path="product/products/:id" element={<ProductDetail />} />
      <Route path="selectproducttomodify" element={<SelectProductToModify />} />
      <Route path="selectproducttomodify/:id" element={<ModifyProduct />} />
      <Route path="catalog" element={<Catalog />} />
      <Route path="newproducts" element={<NewProducts />} />
      <Route path="offers" element={<Offers />} />
      <Route path="cart" element={<Cart />} />
      <Route path="faq" element={<FAQ />} />
      <Route path="shipping" element={<Shipping />} />
      <Route path="terms" element={<Terms />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="cookies" element={<Cookies />} />
    </Route>
  )
);