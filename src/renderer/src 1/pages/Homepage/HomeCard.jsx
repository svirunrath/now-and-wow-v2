import React from 'react'
import { Button, Flex, Segmented } from 'antd';
import { PiMoneyFill } from "react-icons/pi";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaPiggyBank } from "react-icons/fa6";
import { FaBoxesPacking } from "react-icons/fa6";


const HomepageCard = [
    {icon: PiMoneyFill,name:`Today's Upsale`,number:125.37,unit:'$'},
    {icon: FaMoneyBillTransfer,name:`Yesterday's Upsale`,number:150.00,unit:'$'},
    {icon: FaBoxesStacked,name:`Unpaid Orders`,number:15,unit:''},
    {icon: FaBoxesPacking ,name:`Last Month Sale`,number:1450.76,unit:'$'},
    {icon: FaPiggyBank,name:`This Month Sale`,number:1200.75,unit:'$'}
    
]
const HomeCard = () => {
  return (
    <>
    {HomepageCard.map((a)  =>{
    const Riel = "R ";
    const IconAny= a.icon;
    return(
    <div className='homepage-card-el homepage-revenue'>
    <Flex  vertical={true} justify='space-between' align='left'style={{height:"100%"}}>
    <Flex className='homepage-icon' vertical={true} align='center' justify='center' >
    <IconAny size={25} color='white'/>
    </Flex>
    <Flex  vertical={true} gap={5}>
    <p style={{fontWeight:200,fontSize:15}}>{a.name}</p>
    <p style={{fontSize:35}}>{a.unit}{(a.number)}</p>
    </Flex>
    </Flex>
    </div>)})}
  </>
  )
}

export default HomeCard