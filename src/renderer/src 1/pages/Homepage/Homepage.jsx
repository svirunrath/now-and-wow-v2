import React from 'react'
import { useState, useEffect } from 'react';
import {  Dropdown, message, Space, Tooltip } from 'antd';
import { Button, Flex, Segmented,Select } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import Chart from 'chart.js/auto';
import Scrollbars from 'react-custom-scrollbars-2';
//Components
import HomeCard from './HomeCard';
import HomeReport from './HomeReport';
import HomePaidOrder from './HomePaidOrder'
import HomeGraph from './HomeGraph';
import "./Homepage.css"
//icons
import { DatePicker } from 'antd';
import { GiDelicatePerfume } from "react-icons/gi";
import { SiAirtable } from "react-icons/si";
import { FaTshirt } from "react-icons/fa";
import { RiInkBottleFill } from "react-icons/ri";
import { FaShoppingBag } from "react-icons/fa";
import { MdOutlineCheckBox } from "react-icons/md";
import { FaMoneyCheck } from "react-icons/fa6";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import { DownOutlined, UserOutlined } from '@ant-design/icons';




//Temp Data
const paidordericon =FaMoneyCheck;

function paidorderid(){
  return Math.floor(Math.random() * 10000)
}
function paidorderprice(){
  return Math.floor(Math.random() * 200)
}
function paidorderboolean(){
  return HomepagePaidOrder[i].paid= Math.random()*10 > 5
}
const HomepageReport=[
  {paid:true ,icon: GiDelicatePerfume,name:"Perfume",number:22},
  {paid:false ,icon: SiAirtable,name:"furniture",number:17},
  {paid:true ,icon: FaTshirt ,name:"Cloth",number:65},
  {paid:true ,icon: RiInkBottleFill ,name:"Skin Care",number:2},
  {paid:false ,icon: FaShoppingBag ,name:"Bag",number:71},
  {paid:true ,icon: SiAirtable,name:"hello",number:1},
  {paid:true ,icon: GiDelicatePerfume,name:"Perfume",number:22},
  {paid:false ,icon: SiAirtable,name:"furniture",number:17},
  {paid:true ,icon: FaTshirt ,name:"Cloth",number:65},
  {paid:true ,icon: RiInkBottleFill ,name:"Skin Care",number:2},
  {paid:false ,icon: FaShoppingBag ,name:"Bag",number:71},
  {paid:true ,icon: SiAirtable,name:"hello",number:1},
]
const HomepagePaidOrder=[
  {paid:true ,icon: paidordericon, orderid:`${paidorderid()}`,orderprice:`${paidorderprice()}`},
  {paid:true ,icon: paidordericon, orderid:`${paidorderid()}`,orderprice:`${paidorderprice()}`},
  {paid:true ,icon: paidordericon, orderid:`${paidorderid()}`,orderprice:`${paidorderprice()}`},
  {paid:true ,icon: paidordericon, orderid:`${paidorderid()}`,orderprice:`${paidorderprice()}`},
  {paid:true ,icon: paidordericon, orderid:`${paidorderid()}`,orderprice:`${paidorderprice()}`},
  {paid:true ,icon: paidordericon, orderid:`${paidorderid()}`,orderprice:`${paidorderprice()}`},
  {paid:true ,icon: paidordericon, orderid:`${paidorderid()}`,orderprice:`${paidorderprice()}`},
  {paid:true ,icon: paidordericon, orderid:`${paidorderid()}`,orderprice:`${paidorderprice()}`},
  {paid:true ,icon: paidordericon, orderid:`${paidorderid()}`,orderprice:`${paidorderprice()}`},
  {paid:true ,icon: paidordericon, orderid:`${paidorderid()}`,orderprice:`${paidorderprice()}`},
  {paid:true ,icon: paidordericon, orderid:`${paidorderid()}`,orderprice:`${paidorderprice()}`},
  {paid:true ,icon: paidordericon, orderid:`${paidorderid()}`,orderprice:`${paidorderprice()}`},
]
const max=11
const maxReportLength=[]
const maxPaidOrderLength=[];
for(let i=0; i<max;i++){
  HomepagePaidOrder[i].paid= Math.random() >= 0.5;
  maxReportLength.push(HomepageReport[i])
  maxPaidOrderLength.push(HomepagePaidOrder[i])
}
//Graph Data
let weeklabel=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]
function randomMonthOrder(){
  return Math.floor(Math.random() * 100)
}
const monthlabel=[]
const monthOrder=[]
for(let i=1;i<=31;i++){
  monthlabel.push(i);
  monthOrder.push(randomMonthOrder());
}



//Graph Options
const items = [
  {
    label: 'This Week',
    value: '1',
  },
  {
    label: 'This Month',
    value: '2',
  }
];
//Time
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const weekFormat = 'MM/DD';
const monthFormat = 'YYYY/MM';

const Homepage =() => {
  const[loadingId,setLoadingId]= useState(0);
  const[report, setReport]=useState(maxReportLength)
  const[paidorder, setPaidOrder]=useState(maxPaidOrderLength)
  const[loadings, setLoadings] = useState([]);
  const[graphBar,setGraphBar]=useState(weeklabel)


  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 500);
  };
  function paidOrder(id,e){
    enterLoading(e);

    setTimeout(() => {
      const NewReport=[...paidorder]
      let item= NewReport.find(item=>item.orderid === id)
      item.paid=true;
      console.log(paidorder)
      setPaidOrder(NewReport); 
    }, 500);

  }
  return (
    <div className='homepage-container'>
      <div className='homepage-wrapper homepage-header'>
        <p> Homepage</p>
      </div>
      <div className='homepage-wrapper homepage-sale'>
        <HomeCard/>
      </div>
      <div className='homepage-wrapper homepage-data'>
          <div className='homepage-card-el homepage-report'>
              <Flex justify='space-between'>
                <p>Today's Items Sold</p>
                <Flex gap={10}>
                </Flex>
              </Flex>
              <Scrollbars 
                        renderTrackVertical={({ style, ...props }) =>
                            <div {...props} style={{ ...style, backgroundColor: '#2d2e31', right: '0px', bottom: '0px', top: '0px', width: '0px', borderRadius: 2 }} />}
                        renderThumbVertical={({ style, ...props }) =>
                            <div {...props} style={{ ...style, width: '20px', height: 2, borderRadius: '3px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.16)', backgroundColor: '#41486f' }} />}>
            <div className='homepage-report-body'>
              {report.map((a,index)=>
              <HomeReport setHomepageOrder={a} ></HomeReport>)}
            </div>
            </Scrollbars>
          </div>
          <div className='homepage-card-el homepage-paidorder'>
              <Flex justify='space-between'>
                <p style={{height:"100%"}}>Today's Order</p>
                <Flex gap={10}>
                </Flex>
              </Flex>
              <Scrollbars 
                        renderTrackVertical={({ style, ...props }) =>
                            <div {...props} style={{ ...style, backgroundColor: '#2d2e31', right: '0px', bottom: '0px', top: '0px', width: '0px', borderRadius: 2 }} />}
                        renderThumbVertical={({ style, ...props }) =>
                            <div {...props} style={{ ...style, width: '20px', height: 2, borderRadius: '3px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.16)', backgroundColor: '#41486f' }} />}>
            <div className='homepage-paidorder-body'>
              {paidorder.map((a,index)=>
              <HomePaidOrder setHomepageOrder={a} setPaidOrder={()=>paidOrder(a.orderid,index)} setLoading={loadings[index]}></HomePaidOrder>
              )}
            </div>
            </Scrollbars>
          </div>
          <div className='homepage-card-el homepage-graph'>
          <Flex justify='space-between'>
              <p>Accepted Orders</p>
              <Select
                labelInValue:true
                defaultValue={items[0].label}
                style={{width: 120,}}
                options={items}
                onSelect={(value)=>value==items[1].value?setGraphBar(monthlabel):setGraphBar(weeklabel)}/>
              
              </Flex>
                <HomeGraph setBarLabels={graphBar} setBarData={monthOrder}></HomeGraph>
          </div>
      </div>
    </div>
  )
}

export default Homepage