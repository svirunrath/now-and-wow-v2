import React, { Component, useState, } from "react";
import { Carousel } from 'antd';
import { Avatar, Card, Skeleton, Switch,Typography,Button } from 'antd';
import Menu from "./Menu";
import { sortProduct } from "./MenuTemp";
import {orderdata } from "./MenuTemp";

const { Meta } = Card;
const { Paragraph } = Typography;


const MenuCat = ({setProductArray, orderIncrement ,orderDecrement})=> {
  

return(
    <div key={setProductArray.id}>
      <Card
      id={setProductArray.id}
      key={setProductArray.id}
      className='menu-cat-main-card'>
        <Meta className="menu-cat-main-card-meta"
        avatar={<Avatar shape={"square"} size={75} src={setProductArray.image} />}
        title={<Paragraph  style={{textWrap:"wrap", fontSize:15, margin:0}}  level={1}>{setProductArray.name}</Paragraph>}
        description={setProductArray.price+" $"}/>
      <div className="menu-cat-main-card-button">
        <Button size="middle"danger onClick={orderDecrement}>-</Button>                                                  
        <p id={setProductArray.name} style={{color:"black", fontSize:12,width:"10%",textAlign:"center"}}>{setProductArray.quantity}</p>
        <Button type="default" onClick={orderIncrement} size="middle" style={{border:"1px solid darkgrey"}}>+</Button>
        </div>    
      </Card>
    </div>
          
)
}
export default MenuCat;