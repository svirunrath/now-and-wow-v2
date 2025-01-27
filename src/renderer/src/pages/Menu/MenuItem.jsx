import React, { Component, useState } from 'react'
import { Carousel } from 'antd'
import { Avatar, Card, Skeleton, Switch, Typography, Button } from 'antd'

const { Meta } = Card
const { Paragraph } = Typography

const MenuItem = ({ setProductArray, setSelect }) => {
  function a(id) {
    var elements = document.getElementsByClassName('menu-cat-main-card menu-cat-main-card-active')

    while (elements.length > 0) {
      elements[0].classList.remove('menu-cat-main-card-active')
    }
    document.getElementById(id).classList.add('menu-cat-main-card-active')
  }
  return (
    <div key={setProductArray.id}>
      <Card
        onClick={setSelect}
        id={setProductArray.id}
        key={setProductArray.id}
        className={setProductArray.isSelected}
      >
        <Meta
          className="menu-cat-main-card-meta"
          title={
            <Paragraph style={{ textWrap: 'wrap', fontSize: 15, margin: 0 }} level={1}>
              {setProductArray.name}
            </Paragraph>
          }
          description={'Item: ' + setProductArray.item}
        />
      </Card>
    </div>
  )
}
export default MenuItem
