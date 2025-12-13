import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Login from './pages/Users/login/Login.jsx'
import { Route, Routes } from 'react-router-dom'
import store from './store.js'
import { Provider } from 'react-redux'
import Mainpage from './components/Mainpage.jsx'
import ExchangeRate from './pages/ExchangeRate/ExchangeRate.jsx'
import ChangePassword from './pages/Users/user/ChangePassword.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Category from './pages/Category/Category.jsx'
import ProductList from './pages/Product/Product List/ProductList.jsx'
import Homepage from './pages/Homepage/Homepage.jsx'
import { HashRouter } from 'react-router-dom'
import ImportProduct from './pages/Import/ImportProduct.jsx'
import ImportReport from './pages/Import/ImportReport.jsx'
import ProductStock from './pages/Product/ProductStock/ProductStock.jsx'
import ProductStockCut from './pages/Product/ProductStock/ProductStockCut.jsx'
import SaleManagement from './pages/Sale/SaleManagement.jsx'
import Customer from './pages/Customer/Customer.jsx'
import Report from './pages/Report/Report.jsx'
import Menu from './pages/Menu/Menu.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Mainpage />}>
          <Route path="/home" element={<Homepage />} />
          <Route path="/exchange" element={<ExchangeRate />} />
          <Route path="/category" element={<Category />} />
          <Route path="/password" element={<ChangePassword />} />
          <Route path="/product" element={<ProductList />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/import" element={<ImportProduct />} />
          <Route path="/import/report" element={<ImportReport />} />
          <Route path="/report" element={<Report />} />
          <Route path="/stock" element={<ProductStock />}></Route>
          <Route path="/stock/cut" element={<ProductStockCut />}></Route>
          <Route path="/sale/listing" element={<SaleManagement />}></Route>
          <Route path="/customer" element={<Customer />}></Route>
        </Route>
      </Routes>
    </HashRouter>
    <ToastContainer />
  </Provider>
)
