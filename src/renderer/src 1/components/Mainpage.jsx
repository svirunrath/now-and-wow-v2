import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {Layout, theme,Button} from 'antd'
import Logo from './Logo.jsx';
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'
import Menulist from "./Menulist.jsx";
import { Outlet } from 'react-router-dom';

// import { BrowserRouter } from 'react-router-dom';


const {Header, Sider, Content} = Layout;

function Mainpage() {
    const [Collapsed, setCollapsed] = useState(true);
    const {
      token:{colorBgContainer}}= theme.useToken();

    const { userInfo } = useSelector((state) => state.auth);
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === null ? false : sessionStorage.getItem("isLoggedIn");
    const navigate = useNavigate();
      
    useEffect(() => {
      if (!isLoggedIn) {
          if (!userInfo) {
              navigate('/login');
          }
        }
      }, [navigate, userInfo]);

  return (
    
    <Layout>      
      <Sider 
        collapsed={Collapsed}
        trigger={null}
        className ="sidebar"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'sticky',
          left: 0,
          top: 0,
          bottom: 0,
        }}>
        
        <Logo></Logo>
        <Menulist></Menulist>
      </Sider>    
      <Layout>
      <Header style={{padding : 0, background : "black"}}>
          <Button 
              type='text'
              className='toggle'
              onClick={()=>setCollapsed(!Collapsed)}
              icon={Collapsed? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
          >
          </Button>
        </Header>
        <Content style={{background: "#181818", alignItems:"center"}}> 
          <Outlet></Outlet>
        </Content>
      </Layout>
    </Layout>
  )
}

export default Mainpage
