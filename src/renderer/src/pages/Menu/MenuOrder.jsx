import { Button, Flex, Popconfirm, Input, Select } from "antd";
import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useGetProductPriceByPriceIdQuery } from "../../slices/productPriceSlices";
const { Option } = Select;
import { FaMinus } from "react-icons/fa6";

const MenuOrder = ({
  orderData,
  setOrderDiscount,
  handleDecrement,
  setDeleteOrder,
  setIsChange,
}) => {
  const [priceId, setPriceId] = useState(
    orderData.price_id > 0 ? orderData.price_id : null
  );

  const [sellPrice, setSellPrice] = useState(
    orderData.product_sell_price > 0 ? orderData.product_sell_price : 0
  );
  const { data: priceData, isLoading: priceIsLoading } =
    useGetProductPriceByPriceIdQuery({ product_id: orderData.product_id });
  const [discountType, setDiscountType] = useState("percentage");

  let priceDataSource = [];

  if (!priceIsLoading && priceData) {
    for (let i = 0; i < priceData.product_price.length; i++) {
      let price = Number(priceData.product_price[i].product_sell_price);

      priceDataSource.push(
        <Option
          key={priceData.product_price[i].price_id}
          value={priceData.product_price[i].price_id}
          label={price}
        >
          {"$ " + price.toFixed(2)}
        </Option>
      );
    }
  }

  const subTotalOrderprice = orderData.product_qty * sellPrice;
  const [discount, setDiscount] = useState(orderData.discount);
  let discountAmt =
    discountType === "percentage"
      ? (subTotalOrderprice * discount) / 100
      : discount * orderData.product_qty;
  let product_total = subTotalOrderprice - discountAmt;

  // const handleDecrement = () => {
  //   orderData.product_qty = orderData.product_qty - 1;
  //   orderData.isDecreased = true;
  //   return setIsChange(true);
  // };

  useEffect(() => {
    orderData.discount = discountAmt;
  }, [discountAmt]);

  useEffect(() => {
    orderData.total_price = product_total;
  }, [product_total]);

  useEffect(() => {
    if (priceId > 0) {
      return setIsChange(true);
    }
  }, [priceId]);

  return (
    <>
      <div className="menu-order-item" key={orderData.product_id}>
        <div className="menu-order-name-box">
          <p className="menu-order-name">{orderData.product_name}</p>
          {!priceId && !priceIsLoading ? (
            <Select
              className="menu-price-data"
              style={{ width: "100px" }}
              value={priceId}
              onChange={(value, options) => {
                setPriceId(value);
                setSellPrice(options.label);
                orderData.price_id = value;
                orderData.product_sell_price = options.label;
              }}
            >
              {priceDataSource}
            </Select>
          ) : (
            <p>{"$ " + sellPrice.toFixed(2)}</p>
          )}
        </div>
        <Input
          placeholder="0"
          id={"input-" + orderData.product_id}
          value={discount}
          onChange={(e) => {
            setDiscount(e.target.value);
            return setIsChange(true);
          }}
          style={{
            fontSize: 15,
            fontWeight: "bold",
            width: "20%",
            textAlign: "center",
            borderTopRightRadius: "0",
            borderBottomRightRadius: "0",
            height: "32px",
          }}
        />
        <Select
          className="menu-dis-type"
          value={discountType}
          suffixIcon={null}
          onChange={(value) => {
            setDiscountType(value);
            return setIsChange(true);
          }}
        >
          <Option key="percentage" value="percentage">
            %
          </Option>
          <Option key="amount" value="amount">
            $
          </Option>
        </Select>
        <p className="menu-order-qty" id={orderData.product_id}>
          x{orderData.product_qty}
        </p>
        <p className="menu-order-totalprice">$ {product_total.toFixed(2)}</p>

        <div
          className="menu-order-delete"
          style={{ display: "flex", gap: "10px" }}
        >
          <Button
            className="menu-order-delete"
            onClick={handleDecrement}
            block
            icon={<FaMinus style={{ color: "white" }} />}
          ></Button>
          <Popconfirm
            onConfirm={setDeleteOrder}
            title="Delete the task"
            description="Are you sure to delete this item?"
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              className="menu-order-delete"
              danger
              block
              icon={<MdDelete />}
            ></Button>
          </Popconfirm>
        </div>
      </div>
    </>
  );
};
export default MenuOrder;
