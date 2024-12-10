//@react-import
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
//@ant-Layout
import { Menu, Popconfirm } from 'antd'

//@raect-icons
import { MdInventory, MdOutlineAccountCircle, MdManageAccounts } from 'react-icons/md'
import { BsCurrencyExchange, BsFillBoxSeamFill } from 'react-icons/bs'
import { ImHome2 } from 'react-icons/im'
import { BiSolidReport, BiSolidCategory, BiSolidBox } from 'react-icons/bi'
import { IoLogOutSharp } from 'react-icons/io5'
import { HiMiniArchiveBoxArrowDown } from 'react-icons/hi2'
import { FaWarehouse, FaCashRegister, FaReceipt } from 'react-icons/fa'
import { FaFileLines } from 'react-icons/fa6'
import { BsFillCalendarMinusFill } from 'react-icons/bs'

import { logout } from '../slices/userSlices'
import { useLogoutMutation } from '../slices/userAPISlices'
import { useDispatch } from 'react-redux'

//@item-data
const Lists = [
  { key: 1, icon: <ImHome2 />, text: 'Home', path: '/home' },
  { key: 2, icon: <MdInventory />, text: 'Inventory', path: '/inventory' },
  { key: 3, icon: <BsFillBoxSeamFill />, text: 'Orders', path: '/orders' },
  {
    key: 4,
    icon: <BsCurrencyExchange />,
    text: 'Exchange Rate',
    path: '/exchange'
  },
  { key: 5, icon: <BiSolidReport />, text: 'Report', path: '/report' }
]

const mainSubMenu = [
  { key: 1, icon: <FaCashRegister />, title: 'POS' },
  { key: 2, icon: <BsFillBoxSeamFill />, title: 'Orders' },
  { key: 3, icon: <BsCurrencyExchange />, title: 'Report' },
  { key: 4, icon: <BiSolidReport />, title: 'Report' }
]

const inventorySubMenu = [{ key: 1, icon: <BiSolidCategory />, text: 'Item Category' }]

const Importantlist = [
  { key: 6, icon: <FaCashRegister />, text: 'Point of Sale', path: '/menu' },
  { key: 7, icon: <FaReceipt />, text: 'Sale Management', path: '/sale/listing' }
]

//@item_Generate to Menu list
const ListGen = Lists.map((List) => (
  <Menu.Item key={List.path} icon={List.icon}>
    <NavLink to={List.path}>{List.text}</NavLink>
  </Menu.Item>
))

const ImportantListGen = Importantlist.map((List) => (
  <Menu.Item key={List.path} icon={List.icon}>
    <NavLink to={List.path} reloadDocument>
      {List.text}
    </NavLink>
  </Menu.Item>
))

//@Menu-list
const Menulist = () => {
  const currentLocation = window.location.pathname
  const [logoutApiCall] = useLogoutMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loggedInUser = sessionStorage.getItem('userInfo')
    ? JSON.parse(sessionStorage.getItem('userInfo'))
    : 'Account'

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap()
      dispatch(logout())
      navigate('/login')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <Menu mode="inline" className="menu-bar" theme="dark" defaultSelectedKeys={[currentLocation]}>
        <Menu.Item key="Home" icon={<ImHome2 />}>
          <NavLink to="/home" reloadDocument>
            Home
          </NavLink>
        </Menu.Item>
        <Menu.SubMenu key="Inventory" icon={<MdInventory />} title="Inventory">
          <Menu.Item key="Item Category" icon={<BiSolidCategory />}>
            <NavLink to="/category">Product Category</NavLink>
          </Menu.Item>
          <Menu.Item key="Item Management" icon={<BiSolidBox />} title="Item Management">
            <NavLink to="/product" reloadDocument>
              Product Management
            </NavLink>
          </Menu.Item>
          <Menu.Item key="Product Stock" icon={<FaWarehouse />} title="Product Stock">
            <NavLink to="/stock" reloadDocument>
              Product Stock
            </NavLink>
          </Menu.Item>
          <Menu.Item key="Cut Stock" icon={<BsFillCalendarMinusFill />} title="Cut Stock">
            <NavLink to="/stock/cut" reloadDocument>
              Cut Stock
            </NavLink>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="Exchange Rate" icon={<BsCurrencyExchange />}>
          <NavLink to="/exchange" reloadDocument>
            Exchange Rate
          </NavLink>
        </Menu.Item>
        <Menu.SubMenu key="Import" icon={<HiMiniArchiveBoxArrowDown />} title="Import">
          <Menu.Item key="Import Product" icon={<HiMiniArchiveBoxArrowDown />}>
            <NavLink to="/import" reloadDocument>
              Import Product
            </NavLink>
          </Menu.Item>
          <Menu.Item key="Import Report" icon={<BiSolidReport />}>
            <NavLink to="/import/report" reloadDocument>
              Import Report
            </NavLink>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="Report" icon={<FaFileLines />}>
          <NavLink to="/report" reloadDocument>
            Report
          </NavLink>
        </Menu.Item>
        <Menu.Divider className="divider"></Menu.Divider>
        {ImportantListGen}
        <Menu.Divider className="divider"></Menu.Divider>
        <Menu.SubMenu key="Account" icon={<MdOutlineAccountCircle />} title={loggedInUser.username}>
          {/* {loggedInUser.admin_yn ? (
            <Menu.Item key="Create Account" icon={<FaUserPlus />}>
              Create Account
            </Menu.Item>
          ) : null} */}
          <Menu.Item key="Change Password" icon={<MdManageAccounts />}>
            <NavLink to="/password">Change Password</NavLink>
          </Menu.Item>
          <Popconfirm title="Are you sure you want to delete?" onConfirm={logoutHandler}>
            <Menu.Item key="Logout" icon={<IoLogOutSharp />}>
              Logout
            </Menu.Item>
          </Popconfirm>
        </Menu.SubMenu>
      </Menu>
    </>
  )
}

export default Menulist
