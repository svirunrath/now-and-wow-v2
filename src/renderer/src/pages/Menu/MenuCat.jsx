import React, { Component, useState } from "react";
import { Carousel } from "antd";
import { Avatar, Card, Skeleton, Switch, Typography, Button } from "antd";
import Menu from "./Menu";
import { sortProduct } from "./MenuTemp";
import { orderdata } from "./MenuTemp";

const { Meta } = Card;
const { Paragraph } = Typography;

const MenuCat = ({ setProductArray, orderIncrement, orderDecrement }) => {
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
            <Avatar
              shape={"square"}
              size={75}
              src={setProductArray.image_path}
            />
          }
          title={
            <Paragraph
              style={{ textWrap: "wrap", fontSize: 15, margin: 0 }}
              level={1}
            >
              {setProductArray.product_name}
            </Paragraph>
          }
          description={
            setProductArray.product_qty +
            " " +
            setProductArray.unit_name +
            "(s)"
          }
        />
        <div className="menu-cat-main-card-button">
          <Button size="middle" danger onClick={orderDecrement}>
            -
          </Button>
          <p
            id={setProductArray.product_name}
            style={{
              color: "black",
              fontSize: 12,
              width: "10%",
              textAlign: "center",
            }}
          >
            {setProductArray.product_qty}
          </p>
          <Button
            type="default"
            onClick={orderIncrement}
            size="middle"
            style={{ border: "1px solid darkgrey" }}
          >
            +
          </Button>
        </div>
      </Card>
    </div>
  );
};
export default MenuCat;
