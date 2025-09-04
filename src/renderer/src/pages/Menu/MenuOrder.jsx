import { Button, Flex, Popconfirm, Input, Select, InputNumber } from 'antd'
import React, { useState, useEffect } from 'react'
import { MdDelete } from 'react-icons/md'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useGetProductPriceByPriceIdQuery } from '../../slices/productPriceSlices'
const { Option } = Select
import { FaMinus } from 'react-icons/fa6'
import { toast } from 'react-toastify'

const MenuOrder = ({
  orderData,
  setOrderDiscount,
  handleDecrement,
  setDeleteOrder,
  setIsChange
}) => {
  const [productQty, setProductQty] = useState(orderData.product_qty)
  const [sellPrice, setSellPrice] = useState(
    orderData.product_sell_price > 0 ? orderData.product_sell_price : 0
  )

  const [discountType, setDiscountType] = useState('percentage')
  const subTotalOrderprice = productQty * Number(sellPrice).toFixed(2)
  const [discount, setDiscount] = useState(orderData.discount)
  let discountAmt =
    discountType === 'percentage' ? (subTotalOrderprice * discount) / 100 : discount * productQty
  let product_total = Number(subTotalOrderprice).toFixed(2) - Number(discountAmt).toFixed(2)

  useEffect(() => {
    orderData.discount = Number(discountAmt).toFixed(2)
  }, [discountAmt])

  useEffect(() => {
    if (Number(orderData.product_qty) > Number(orderData.stock_qty)) {
      setProductQty(orderData.stock_qty)
      orderData.product_qty = orderData.stock_qty
      toast.error('Product ' + orderData.product_name + ' is out of stock.')
      return
    }
    setProductQty(orderData.product_qty)
  }, [orderData.product_qty])

  useEffect(() => {
    orderData.total_price = product_total
    return setIsChange(true)
  }, [product_total])

  return (
    <>
      <div className="menu-order-item" key={orderData.import_detail_id}>
        <div className="menu-order-name-box">
          <p className="menu-order-name">{orderData.product_name}</p>
          <p>{'$ ' + sellPrice.toFixed(2)}</p>
        </div>
        <Input
          placeholder="0"
          id={'input-' + orderData.product_id}
          value={discount}
          onChange={(e) => {
            setDiscount(e.target.value)
            return setIsChange(true)
          }}
          style={{
            fontSize: 15,
            fontWeight: 'bold',
            width: '20%',
            textAlign: 'center',
            borderTopRightRadius: '0',
            borderBottomRightRadius: '0',
            height: '32px'
          }}
        />
        <Select
          className="menu-dis-type"
          value={discountType}
          suffixIcon={null}
          onChange={(value) => {
            setDiscountType(value)
            return setIsChange(true)
          }}
        >
          <Option key="percentage" value="percentage">
            %
          </Option>
          <Option key="amount" value="amount">
            $
          </Option>
        </Select>
        <InputNumber
          className="menu-order-qty"
          value={productQty}
          onChange={(e) => {
            if (e > Number(orderData.stock_qty)) {
              setProductQty(orderData.stock_qty)
              orderData.product_qty = orderData.stock_qty
              toast.error('Product ' + orderData.product_name + ' is out of stock.')
            } else if (e == 0) {
              toast.error('Product quantity cannot be zero.')
            } else {
              setProductQty(e)
              orderData.product_qty = e
            }
          }}
        ></InputNumber>
        <p className="menu-order-totalprice">$ {product_total.toFixed(2)}</p>

        <div className="menu-order-delete" style={{ display: 'flex', gap: '10px' }}>
          <Popconfirm
            onConfirm={setDeleteOrder}
            title="Delete the task"
            description="Are you sure to delete this item?"
            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          >
            <Button className="menu-order-delete" danger block icon={<MdDelete />}></Button>
          </Popconfirm>
        </div>
      </div>
    </>
  )
}
export default MenuOrder
