import {Button, Flex ,Popconfirm,Input } from 'antd'
import React, { useState ,useEffect } from 'react'
import { MdDelete } from "react-icons/md";
import { sortMenuData, orderdata, sortProduct } from './MenuTemp';
import { QuestionCircleOutlined } from '@ant-design/icons';


const MenuOrder=({orderdata,setOrderDiscount,setDeleteOrder})=>{
  const subTotalOrderprice= orderdata.quantity*orderdata.price;
  let totalOrderprice= subTotalOrderprice*((100-orderdata.discount)/100);
    return(
        <>
        <div className='menu-order-item' key={orderdata.id}>
        <div className='menu-order-name-box'>
            <p className='menu-order-name'>{orderdata.name}</p>
            <p className='menu-order-price'>{orderdata.price}$</p>
        </div>
        <Input      placeholder='0'
                    id={'input-'+orderdata.id}
                    value={orderdata.discount}
                    onChange={setOrderDiscount}
                    suffix={"%"}
                    style={{fontSize:15, fontWeight:'bold',width:"20%", textAlign:"center"}} />
        <p className='menu-order-qty' id={orderdata.id}>x{orderdata.quantity}</p>   
        <p className='menu-order-totalprice'>{
            totalOrderprice.toFixed(2)}$
        </p>
        <div className='menu-order-delete '>
        <Popconfirm 
        onConfirm={setDeleteOrder}
        title="Delete the task"
        description="Are you sure to delete this item?"
        icon={
          <QuestionCircleOutlined
            style={{color: 'red',}}/>}>
            <Button 
            className='menu-order-delete'
            danger
            block
            icon={<MdDelete/>}>
            </Button>
        </Popconfirm></div>
        </div>
        </>
    )
}
export default MenuOrder;