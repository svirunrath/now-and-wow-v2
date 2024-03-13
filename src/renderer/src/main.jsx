import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Login from './pages/Users/login/Login.jsx'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import store from './store.js'
import { Provider } from 'react-redux'
import Mainpage from './components/Mainpage.jsx'
import Home from './pages/Home.jsx'
import ExchangeRate from './pages/ExchangeRate/ExchangeRate.jsx'
import ChangePassword from './pages/Users/user/ChangePassword.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Category from './pages/Category/Category.jsx'
import CreateProduct from './pages/Product/Product Management/CreateProduct.jsx'
import ProductCard from './components/ProductCard.jsx'
import BarcodeModal from './components/BarcodeModal.jsx'
import Menu from './pages/Menu/Menu.jsx'
import ImportProduct from './pages/Import/ImportProduct.jsx'
import ProductList from './pages/Product/Product List/ProductList.jsx'
import ProductStock from './pages/Product/ProductStock/ProductStock.jsx'
import Homepage from './pages/Homepage/Homepage.jsx'
import Report from './pages/Report/Report.jsx'
import { HashRouter } from 'react-router-dom'

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
          <Route path="/test" element={<CreateProduct />} />
          <Route path="/test2" element={<BarcodeModal />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/import" element={<ImportProduct />} />
          <Route path="/report" element={<Report />} />
          <Route path="/stock" element={<ProductStock />}></Route>
        </Route>
      </Routes>
    </HashRouter>
    <ToastContainer />
  </Provider>
)
