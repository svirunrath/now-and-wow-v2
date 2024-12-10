import React, { Component, useState } from 'react'
import { Carousel } from 'antd'
import { Avatar, Card, Skeleton, Switch, Typography, Button } from 'antd'
import Menu from './Menu'

const { Meta } = Card
const { Paragraph } = Typography
import path from 'path'
const __dirname = path.resolve(path.dirname(''))

const MenuCat = ({ setProductArray }) => {
  return (
    <div key={setProductArray.product_id}>
      <Card
        id={setProductArray.product_id}
        key={setProductArray.product_id}
        className="menu-cat-main-card"
      >
        <Meta
          className="menu-cat-main-card-meta"
          avatar={
            <Avatar shape={'square'} size={75} src={__dirname + setProductArray.image_path} />
          }
          title={
            <Paragraph style={{ textWrap: 'wrap', fontSize: 15, margin: 0 }} level={1}>
              {setProductArray.product_name}
            </Paragraph>
          }
          description={setProductArray.product_qty + ' ' + setProductArray.unit_name + '(s)'}
        />
      </Card>
    </div>
  )
}
export default MenuCat
