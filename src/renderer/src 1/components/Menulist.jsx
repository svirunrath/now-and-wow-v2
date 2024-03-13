

//@react-import
import React from 'react'
import { useState } from 'react';
import { Link, NavLink, Routes, useNavigate} from 'react-router-dom';
//@ant-Layout
import { Menu} from 'antd'

//@raect-icons
import { MdInventory,MdOutlineAccountCircle,MdManageAccounts} from "react-icons/md";
import {BsCurrencyExchange, BsFillBoxSeamFill} from "react-icons/bs"
import {ImHome2}from 'react-icons/im'
import {TbLanguageHiragana} from 'react-icons/tb'
import {BiSolidReport, BiSolidCategory, BiSolidBox } from 'react-icons/bi'
import {AiFillSetting} from 'react-icons/ai'
import {IoLogOutSharp} from 'react-icons/io5'
import {FaUserPlus} from 'react-icons/fa'

import { logout } from '../slices/userSlices';
import { useLogoutMutation } from '../slices/userAPISlices';
import { useDispatch } from 'react-redux';
import { BiSolidFoodMenu } from "react-icons/bi";


//@item-data
const Lists =[
  {key:0,icon:<BiSolidFoodMenu />  ,text:"Menu", path:"/Menu"},
  {key:1,icon:<ImHome2/>,text:"Home", path:"/home"},
  {key:2,icon:<MdInventory/>,text:"Inventory",path:"/inventory"},
  {key:3,icon:<BsFillBoxSeamFill/>,text:"Orders",path:"/orders"},
  {key:4,icon:<BsCurrencyExchange/>,text:"Exchange Rate",path:"/exchange"},
  {key:5,icon:<BiSolidReport/>,text:"Report",path:"/report"},
]

const mainSubMenu = [
  {key:1, icon:<MdInventory/>, title: "Inventory"},
  {key:2, icon:<BsFillBoxSeamFill/>, title: "Orders"},
  {key:3, icon:<BsCurrencyExchange/>,title: "Report"},
  {key:4, icon:<BiSolidReport/>, title: "Report"},
]

const inventorySubMenu = [
  {key:1, icon:<BiSolidCategory/ >, text: "Item Category"}
]


const Importantlist=[  
  {key:6,icon:<TbLanguageHiragana/>,text:"Language",path:"/language"},
  {key:7,icon:<AiFillSetting/>,text:"Setting",path:"/setting"}
]


//@item_Generate to Menu list
const ListGen = Lists.map((List)=>
  <Menu.Item key={List.path} icon={List.icon} >
    <NavLink to={List.path}>
      {List.text}
    </NavLink>
  </Menu.Item>
);

const ImportantListGen = Importantlist.map((List)=>
<Menu.Item key={List.path} icon ={List.icon}>
  <NavLink to={List.path}>
    {List.text}
  </NavLink>
</Menu.Item>
);


//@Menu-list
const Menulist = () => {
  const currentLocation = window.location.pathname;
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loggedInUser = sessionStorage.getItem("userInfo") ? JSON.parse(sessionStorage.getItem("userInfo")): "Account" ;

  const logoutHandler = async () => {
    try {
      const confirm = window.confirm("are you sure?");
      if(confirm){
          await logoutApiCall().unwrap();
          dispatch(logout());
          navigate('/login');
      }else {
          // same as clicking a link 
          // not optimal solution though
          window.location.href = window.location.href;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <Menu mode="inline" className="menu-bar" theme='dark' defaultSelectedKeys={[currentLocation]}>
    
      <Menu.Item key="Home" icon={<ImHome2/>} >
        <NavLink to="/home">
            Home
        </NavLink>
      </Menu.Item>
      <Menu.Item key="Menu" icon={<BiSolidFoodMenu />} >
        <NavLink to="/Menu">
            Menu
        </NavLink>
      </Menu.Item>
      <Menu.SubMenu key="Inventory" icon={<MdInventory/>} title="Inventory" >
        <Menu.Item key="Item Category" icon={<BiSolidCategory/>}>
          <NavLink to="/category">
            Product Category
          </NavLink>
        </Menu.Item>
        <Menu.Item key="Item Management" icon={<BiSolidBox/>} title="Item Management">
          <NavLink to="/product">
            Product Management
          </NavLink>
        </Menu.Item>
      </Menu.SubMenu>
      <Menu.Item key="Exchange Rate" icon={<BsCurrencyExchange/>} >
          <NavLink to="/exchange">
            Exchange Rate
          </NavLink>
      </Menu.Item>
      <Menu.Divider className='divider'></Menu.Divider>
          {ImportantListGen}
      <Menu.Divider className='divider'></Menu.Divider>
      <Menu.SubMenu key="Account" icon={<MdOutlineAccountCircle/>} title={loggedInUser.username} >
          {loggedInUser.admin_yn ? (
                  <Menu.Item key="Create Account" icon={<FaUserPlus/>} >
                      Create Account
                  </Menu.Item>
          ) : null
        }
        <Menu.Item key="Change Password" icon={<MdManageAccounts/>} >
          <NavLink to="/password">
            Change Password
          </NavLink>
        </Menu.Item>
        <Menu.Item key="Logout" icon={<IoLogOutSharp/>} onClick={logoutHandler}>
            Logout
        </Menu.Item>
      </Menu.SubMenu>
    </Menu>
    </>
  )
}

export default Menulist;