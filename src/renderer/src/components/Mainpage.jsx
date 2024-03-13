import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Layout, theme, Button } from 'antd'
import Logo from './Logo.jsx'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import Menulist from './Menulist.jsx'
import { Outlet } from 'react-router-dom'
import path from 'path'
const __dirname = path.resolve(path.dirname(''))

// import { BrowserRouter } from 'react-router-dom';

const { Header, Sider, Content } = Layout

function Mainpage() {
  const [Collapsed, setCollapsed] = useState(true)
  const {
    token: { colorBgContainer }
  } = theme.useToken()

  const { userInfo } = useSelector((state) => state.auth)
  const isLoggedIn =
    sessionStorage.getItem('isLoggedIn') === null ? false : sessionStorage.getItem('isLoggedIn')
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoggedIn) {
      if (!userInfo) {
        navigate('/login')
      }
    }
  }, [navigate, userInfo])

  return (
    <Layout style={{ height: '100%', display: 'flex' }}>
      <Sider
        collapsed={Collapsed}
        trigger={null}
        className="sidebar"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          maxWidth: '25%',
          left: 0,
          top: 0,
          bottom: 0
        }}
      >
        <div className="logo">
          <div className="logo-icon">
            <img
              width={'50px'}
              height={'50px'}
              src={__dirname + `/src/renderer/public/images/products/logo.jpg`}
            ></img>
            {!Collapsed ? <span style={{ fontSize: 14, paddingLeft: 5 }}>Now & Wow</span> : null}
          </div>
        </div>
        <Menulist></Menulist>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: 'black' }}>
          <Button
            type="text"
            className="toggle"
            onClick={() => setCollapsed(!Collapsed)}
            icon={Collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          ></Button>
        </Header>
        <Content style={{ background: '#181818', alignItems: 'center' }}>
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  )
}

export default Mainpage
