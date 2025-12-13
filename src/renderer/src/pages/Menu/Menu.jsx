import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Button, Flex, Modal, Empty, Select, Divider, Table, Popconfirm, Checkbox } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Carousel } from 'antd'
import './Menu.css'
import MenuOrder from './MenuOrder'
import Scrollbars from 'react-custom-scrollbars-2'
import { Input } from 'antd'
import MenuCat from './MenuCat'
import {
  PlusOutlined,
  InstagramOutlined,
  FacebookOutlined,
  PhoneOutlined,
  PrinterOutlined
} from '@ant-design/icons'
import MenuItem from './MenuItem'
import { useGetMainCategoryQuery } from '../../slices/mainCategoryAPISlices'
import { useGetProductCountBySubIdQuery } from '../../slices/subCategoryAPISlices'
import { useGetAllProductQuery } from '../../slices/productAPISlices'
import ReactToPrint from 'react-to-print'
import { toast } from 'react-toastify'
import { CommaFormatted, CurrencyFormatted } from '../../utils/NumberFormatterUtils.js'
import { useLazyRetrieveProductByBarcodeQuery } from '../../slices/barcodeSlices.js'
import { useRegisterSaleMutation, useRetrieveLastSaleIdQuery } from '../../slices/saleSlices.js'
import path from 'path'
const __dirname = path.resolve(path.dirname(''))
const { Option } = Select

const Menu = () => {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  const ref = useRef()
  //Main Category Select
  const {
    data: category_data,
    isLoading: category_isLoading,
    refetch: category_refetch
  } = useGetMainCategoryQuery()
  const [mainId, setMainId] = useState('ALL')
  const [subId, setSubId] = useState(null)
  const [showProduct, setShowProduct] = useState(false)
  const exchangeRate = localStorage.getItem('exchangeRate')
  const [receiptId, setReceiptId] = useState('')
  const [isFreeDelivery, setIsFreeDelivery] = useState(false)
  let currentDate = new Date()
  let currDate = currentDate.toDateString()
  let currTime = new Date().toLocaleTimeString()
  const [registerSale] = useRegisterSaleMutation()
  const {
    data: saleId,
    isLoading: saleIdLoading,
    refetch: saleIdRefetch
  } = useRetrieveLastSaleIdQuery()

  useEffect(() => {
    console.log(saleId)
    if (!saleIdLoading) setReceiptId(saleId.sale[0].sale_id)
  }, [saleId])

  const {
    data: product_data,
    isLoading: product_isLoading,
    refetch: product_refetch
  } = useGetAllProductQuery()

  const [productData, setProductData] = useState([])
  let main_category = []

  if (!category_isLoading) {
    const response_main_category = category_data ? category_data.main_category : null

    for (let i = 0; i < response_main_category.length; i++) {
      main_category.push(
        <Option
          key={response_main_category[i].category_id}
          value={response_main_category[i].category_id}
        >
          {response_main_category[i].category_name}
        </Option>
      )
    }
  }

  //Sub category card
  const [menuItem, setMenuItem] = useState([])
  let childrenList = []
  let sub_category = []

  if (mainId === 'ALL') {
    const {
      data: sub_data,
      isLoading: sub_isLoading,
      refetch: sub_refetch
    } = useGetProductCountBySubIdQuery({ category_id: 0 })

    if (!sub_isLoading) {
      sub_category = sub_data.sub_category
    }
  } else {
    const {
      data: sub_data,
      isLoading: sub_isLoading,
      refetch: sub_refetch
    } = useGetProductCountBySubIdQuery({ category_id: mainId })

    if (!sub_isLoading) {
      sub_category = sub_data.sub_category
    }
  }

  if (sub_category.length > 0) {
    for (let i = 0; i < sub_category.length; i++) {
      childrenList.push({
        id: sub_category[i].sub_category_id,
        name: sub_category[i].sub_category_name,
        isSelected: 'menu-cat-main-card',
        item: sub_category[i].product_count ? sub_category[i].product_count : '0'
      })
    }
  }

  useEffect(() => {
    if (!product_isLoading && product_data) {
      setProductData(product_data.products)
    }
  }, [product_data])

  useEffect(() => {
    if (sub_category.length > 0) {
      setMenuItem(childrenList)
    }
  }, [sub_category])

  //Select Product
  function changeMenuItem(id) {
    setShowProduct(true)
    const newProductData = [...menuItem]
    const Item = newProductData.find((Item) => Item.id === id)

    for (let i = 0; i < newProductData.length; i++) {
      if (newProductData[i].id !== Item.id) {
        newProductData[i].isSelected = 'menu-cat-main-card'
      } else {
        newProductData[i].isSelected = 'menu-cat-main-card menu-cat-main-card-active'
      }
    }
    setMenuItem(newProductData)
    setSubId(id)
  }

  //Order
  const [order, setOrder] = useState([])

  const [isChange, setIsChange] = useState(false)

  useEffect(() => {
    if (isChange) {
      setOrder(mergeObjectsInUnique(order, 'import_detail_id'))
    }
    setIsChange(false)
  }, [isChange])

  //Customer Information
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [customerLoc, setCustomerLoc] = useState('')

  //Handle Barcode
  const [enterBarcodeValue, setEnterBarcodeValue] = useState('')
  const [trigger] = useLazyRetrieveProductByBarcodeQuery()

  const handleAddBarcode = async () => {
    const { data, isLoading } = await trigger({
      barcode_value: enterBarcodeValue
    })

    if (!isLoading) {
      if (data.barcode.length > 0) {
        let tempOrder = [...order]
        let isExisted = tempOrder.find(
          (item) => item.barcode_value == data.barcode[0].barcode_value
        )

        if (data.barcode[0].product_qty <= 0) {
          toast.error('Product is out of stock.')
          return
        }

        if (!isExisted) {
          tempOrder.push({
            barcode_value: data.barcode[0].barcode_value,
            discount: 0,
            product_id: data.barcode[0].product_id,
            product_name: data.barcode[0].product_name,
            product_qty: 1,
            import_detail_id: data.barcode[0].import_detail_id
              ? data.barcode[0].import_detail_id
              : null,
            product_sell_price: Number(data.barcode[0].product_sell_price),
            sub_category_id: data.barcode[0].sub_category_id,
            total_price: Number(data.barcode[0].product_sell_price),
            stock_qty: Number(data.barcode[0].product_qty)
          })
        } else {
          let index = tempOrder.findIndex((item) => item.barcode_value == isExisted.barcode_value)

          tempOrder[index].product_qty = Number(tempOrder[index].product_qty) + 1
        }
        await setOrder(tempOrder)
        //setIsScan(false);
        setEnterBarcodeValue('')
      } else {
        toast.error('No Product Found.')
      }
    }
  }

  function orderDelete({ import_detail_id }) {
    let tempOrder = [...order]

    tempOrder = tempOrder.filter((item) => item.import_detail_id != import_detail_id)

    setOrder(tempOrder)
  }

  //Barcode
  const [barcodeValue, setBarcodeValue] = useState('')
  const [isScan, setIsScan] = useState(false)

  const barcode = {
    timing: 1000,
    data: ''
  }

  const barcodeReaded = () => {
    if (barcode.data.length > 1) {
      setBarcodeValue(barcode.data.padStart(12, '0'))
      setIsScan(true)
    } else {
      barcode.data = ''
      setBarcodeValue('')
      setIsScan(false)
    }
  }

  let timeout = setTimeout(barcodeReaded, 500)

  useEffect(() => {
    window.addEventListener('keypress', (e) => {
      if (barcode.data.length === 0 || e.timeStamp - barcode.timing < 35) {
        if (e.key !== 'Enter') {
          barcode.data += e.key
        }
        barcode.timing = e.timeStamp
        clearTimeout(timeout)
        timeout = setTimeout(barcodeReaded, 500)
      } else {
        barcode.data = ''
        setBarcodeValue('')
        setIsScan(false)
      }
    })
  }, [])

  useEffect(() => {
    async function handleBarcode() {
      if (isScan) {
        const { data, isLoading } = await trigger({
          barcode_value: barcodeValue
        })

        if (!isLoading) {
          if (data.barcode.length > 0) {
            let tempOrder = [...order]
            let isExisted = tempOrder.find(
              (item) => item.barcode_value == data.barcode[0].barcode_value
            )

            if (data.barcode[0].product_qty <= 0) {
              toast.error('Product is out of stock.')
              return
            }

            if (!isExisted) {
              tempOrder.push({
                barcode_value: data.barcode[0].barcode_value,
                discount: 0,
                product_id: data.barcode[0].product_id,
                product_name: data.barcode[0].product_name,
                product_qty: 1,
                import_detail_id: data.barcode[0].import_detail_id
                  ? data.barcode[0].import_detail_id
                  : null,
                product_sell_price: Number(data.barcode[0].product_sell_price),
                sub_category_id: data.barcode[0].sub_category_id,
                total_price: Number(data.barcode[0].product_sell_price),
                stock_qty: Number(data.barcode[0].product_qty)
              })
            } else {
              let index = tempOrder.findIndex(
                (item) => item.barcode_value == isExisted.barcode_value
              )

              tempOrder[index].product_qty = Number(tempOrder[index].product_qty) + 1
            }

            await setOrder(tempOrder)
            setIsScan(false)
            barcode.data = ''
            setBarcodeValue('')
          } else {
            toast.error('No Product Found.')
          }
        }
      }
    }

    handleBarcode()
  }, [barcodeValue])

  //Calculate
  let subTotalUsd = 0
  let subTotalKhr = 0
  let [discount, setDiscount] = useState(0)
  let [discountType, setDiscountType] = useState('percentage')
  let groupDis = 0
  let discountUsd = 0
  let discountKhr = 0
  let totalUsd = 0
  let totalKhr = 0

  let changeUsd = 0
  let changeKhr = 0
  let [receivedUsd, setReceivedUsd] = useState(0)
  let [receivedKhr, setReceivedKhr] = useState(0)
  let [deliveryFee, setDeliveryFee] = useState(0)
  let totalReceivedAmt = 0

  //Sub-Total
  order.forEach((item) => {
    subTotalUsd += item.total_price
  })
  subTotalKhr = subTotalUsd * exchangeRate

  //Discount
  groupDis = discountType === 'percentage' ? (subTotalUsd * discount) / 100 : discount
  discountUsd = groupDis
  discountKhr = discountUsd * exchangeRate

  //Total
  totalUsd = subTotalUsd + Number(deliveryFee) - discountUsd
  totalKhr = totalUsd * exchangeRate

  totalReceivedAmt = Number(receivedUsd) + Number(receivedKhr) / Number(exchangeRate)
  changeUsd = totalUsd - totalReceivedAmt
  changeKhr = changeUsd * exchangeRate

  //table receipt
  const receiptColumn = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'qty'
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price'
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount'
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total'
    }
  ]

  const [receiptOrder, setReceiptOrder] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const tempArr = []
    if (order.length > 0) {
      for (let i = 0; i < order.length; i++) {
        tempArr.push({
          name: order[i].product_name,
          quantity: order[i].product_qty,
          price: '$ ' + Number(order[i].product_sell_price).toFixed(2),
          discount: '$ ' + Number(order[i].discount).toFixed(2),
          total: '$ ' + Number(order[i].total_price).toFixed(2)
        })
      }
      setReceiptOrder(tempArr)
    }
  }, [order])

  useEffect(() => {
    const tempArr = []
    if (order.length > 0) {
      for (let i = 0; i < order.length; i++) {
        tempArr.push({
          name: order[i].product_name,
          quantity: order[i].product_qty,
          price: '$ ' + Number(order[i].product_sell_price).toFixed(2),
          discount: '$ ' + Number(order[i].discount).toFixed(2),
          total: '$ ' + Number(order[i].total_price).toFixed(2)
        })
      }
      setReceiptOrder(tempArr)
    }
  }, [order])

  const validateAndRegisterSale = async () => {
    if (order.length === 0) {
      toast.error('There is no order to print.')
      return null
    } else {
      return true
    }
  }

  const handleRegisterTable = async () => {
    try {
      const outputData = await validateAndRegisterSale()

      if (!outputData) return

      const req = {
        sale_price: Number(subTotalUsd).toFixed(2),
        sale_discount: Number(discountUsd).toFixed(2),
        sale_total_price: Number(totalUsd).toFixed(2),
        received_payment: Number(totalReceivedAmt).toFixed(2),
        payment_remaining: Number(changeUsd).toFixed(2),
        exch_rate: exchangeRate,
        customer_name: customerName,
        customer_location: customerLoc,
        customer_phone: customerPhone,
        delivery_fee: Number(deliveryFee).toFixed(2),
        created_by: userInfo.username,
        sale_time: currTime,
        is_delivery_free: isFreeDelivery,
        orders: order
      }

      try {
        const outputData = await registerSale(req).unwrap()
        if (outputData.body.success) {
          toast.success('Registered Sale Successfully.')

          setBarcodeValue('')
          setCustomerLoc('')
          setCustomerName('')
          setCustomerPhone('')
          setDiscount(0)
          setDeliveryFee(0)
          setDiscountType('percentage')
          setEnterBarcodeValue('')
          setIsChange(false)
          setIsScan(false)
          setOpen(false)
          setShowProduct(false)
          setMainId('ALL')
          setOrder([])
          setProductData([])
          setSubId(null)
          setReceiptOrder([])
          setReceivedUsd(0)
          setReceivedKhr(0)
          setIsFreeDelivery(false)
          subTotalUsd = 0
          subTotalKhr = 0
          groupDis = 0
          discountUsd = 0
          discountKhr = 0
          totalUsd = 0
          totalKhr = 0

          changeUsd = 0
          changeKhr = 0
          saleIdRefetch()
          product_refetch()
          return outputData
        } else {
          toast.error('Registered sale failed.')
          return null
        }
      } catch (error) {
        toast.error(error.message)
        return null
      }
    } catch (error) {
      toast.error(error.message)
      return
    }
  }

  const printRef = useRef(null)
  const reactToPrintTrigger = useRef(null)

  const handlePrint = async () => {
    const success = await handleRegisterTable()
    if (success && reactToPrintTrigger.current) {
      reactToPrintTrigger.current() // triggers ReactToPrint manually
    }
  }

  const handleClear = () => {
    setBarcodeValue('')
    setCustomerLoc('')
    setCustomerName('')
    setCustomerPhone('')
    setDiscount(0)
    setDeliveryFee(0)
    setDiscountType('percentage')
    setEnterBarcodeValue('')
    setIsChange(false)
    setIsScan(false)
    setOpen(false)
    setShowProduct(false)
    setMainId('ALL')
    setOrder([])
    setProductData([])
    setSubId(null)
    setReceiptOrder([])
    setReceivedUsd(0)
    setReceivedKhr(0)
    saleIdRefetch()
    setIsFreeDelivery(false)
    product_refetch()
  }

  const pageStyle = `
  @page {
    size: 80mm 50mm !important;
    margin: 0.5px !important;
  }
`

  return (
    <>
      <div className="menu-container">
        <div className="menu-cat-wrapper menu-wrapper">
          <div className="menu-cat-header menu-cat-el">
            <div className="menu-select">
              <h3 style={{ color: 'white' }}>Main Category:</h3>
              <Select
                className="menu-main-select"
                onChange={(value) => {
                  setMainId(value)
                  setSubId(null)
                }}
                value={mainId}
              >
                <Option key="ALL" value="ALL">
                  All
                </Option>
                {main_category ? main_category : null}
              </Select>
            </div>
            <div className="menu-code">
              <h3 style={{ color: 'white' }}>Product Code</h3>
              <Input
                style={{ width: '50%' }}
                value={enterBarcodeValue}
                onChange={(e) => setEnterBarcodeValue(e.target.value)}
              ></Input>
              <Button icon={<PlusOutlined />} onClick={handleAddBarcode}></Button>
            </div>
          </div>
          <div className="menu-cat-main menu-cat-el">
            <div className="menu-main-list">
              <Carousel
                className="menu-main-slider"
                rows={2}
                slidesPerRow={4}
                draggable
                dots={{ className: 'menu-slider-dots' }}
                speed={800}
              >
                {menuItem.map((a) => (
                  <div>
                    <MenuItem
                      key={a.id}
                      setProductArray={a}
                      setSelect={() => changeMenuItem(a.id)}
                    />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
          <div className="menu-cat-sub menu-cat-el">
            <div className="menu-main-list">
              {showProduct == false ? (
                <Empty
                  imageStyle={{ opacity: 0.2 }}
                  description={<span style={{ color: 'white' }}>No data</span>}
                />
              ) : (
                // we need to setProduct() according to Category list.
                <Carousel
                  className="menu-main-slider"
                  rows={2}
                  slidesPerRow={4}
                  draggable
                  dots={{ className: 'menu-slider-dots' }}
                  speed={800}
                >
                  {!product_isLoading
                    ? productData
                        .filter((product) => product.sub_category_id === subId)
                        .map((a) => (
                          <div>
                            <MenuCat key={a.product_id} setProductArray={a} />
                          </div>
                        ))
                    : null}
                </Carousel>
              )}
            </div>
          </div>
        </div>
        <div className="menu-order-wrapper menu-wrapper">
          <div className=" menu-order-el menu-order-header">
            <div className="menu-order-name-box1">
              <p style={{ fontSize: '12px' }} className="menu-order-name">
                Customer Name:{' '}
              </p>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={{ height: '100%', width: '80%' }}
              ></Input>
            </div>
            <div className="menu-order-name-box1">
              <p style={{ fontSize: '12px' }} className="menu-order-name">
                Customer Phone:{' '}
              </p>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={{ height: '100%', width: '80%' }}
              ></Input>
            </div>
            <div className="menu-order-name-box1">
              <p style={{ fontSize: '12px' }} className="menu-order-name">
                Customer Location:{' '}
              </p>
              <Input
                value={customerLoc}
                onChange={(e) => setCustomerLoc(e.target.value)}
                style={{ height: '100%', width: '80%' }}
              ></Input>
            </div>
          </div>
          <Scrollbars
            className="menu-order-body menu-order-el"
            renderTrackVertical={({ style, ...props }) => (
              <div
                {...props}
                style={{
                  ...style,
                  backgroundColor: '#2d2e31',
                  right: '0px',
                  bottom: '0px',
                  top: '0px',
                  width: '5px',
                  borderRadius: 2
                }}
              />
            )}
            renderThumbVertical={({ style, ...props }) => (
              <div
                {...props}
                style={{
                  ...style,
                  width: '20px',
                  height: 2,
                  borderRadius: '3px',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.16)',
                  backgroundColor: '#41486f'
                }}
              />
            )}
          >
            <div className="menu-order-body-inside">
              {order
                .filter((o) => o.product_qty != 0)
                .map((newOrderData) => (
                  <MenuOrder
                    orderData={newOrderData}
                    setDeleteOrder={() =>
                      orderDelete({
                        import_detail_id: newOrderData.import_detail_id
                      })
                    }
                    setIsChange={setIsChange}
                  />
                ))}
            </div>
          </Scrollbars>
          <div className="menu-order-payment menu-order-el">
            <div className="menu-order-payment-box">
              <div className="menu-order-total-box">
                <p>Subtotal:</p>
                <div className="menu-order-total-currency">
                  <p>$ {CommaFormatted(CurrencyFormatted(subTotalUsd))}</p>
                  <p>R {CommaFormatted(CurrencyFormatted(subTotalKhr))}</p>
                </div>
              </div>
              <Flex className="menu-payment-btn-box">
                <p>Discount:</p>
                <div style={{ display: 'flex', width: '100%' }}>
                  <Input
                    placeholder="0"
                    type="number"
                    id="totalDiscount"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      width: '100%',
                      borderTopRightRadius: '0',
                      borderBottomRightRadius: '0'
                    }}
                  />
                  <Select
                    style={{
                      height: '100%',
                      width: '70px'
                    }}
                    suffixIcon={null}
                    value={discountType}
                    onChange={(value) => setDiscountType(value)}
                    className="menu-disc-type"
                  >
                    <Option key="percentage" value="percentage">
                      %
                    </Option>
                    <Option key="amount" value="amount">
                      $
                    </Option>
                  </Select>
                </div>
              </Flex>
              <Flex className="menu-payment-btn-box">
                <div className="delivery-fee">
                  <p>Delivery:</p>
                  <Input
                    placeholder="0"
                    type="number"
                    id="totalDiscount"
                    className="delivery-fee-input"
                    disabled={isFreeDelivery}
                    value={deliveryFee}
                    onChange={(e) => setDeliveryFee(e.target.value)}
                    suffix={'$'}
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      width: '60%',
                      textAlign: 'center'
                    }}
                  />
                </div>
                <div className="delivery-chkbox">
                  <p width="100%">Free Delivery:</p>
                  <Checkbox
                    value={isFreeDelivery}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDeliveryFee(0)
                      }
                      setIsFreeDelivery(e.target.checked)
                    }}
                  ></Checkbox>
                </div>
              </Flex>
              <div className="menu-order-total-box">
                <p>Total:</p>
                <div className="menu-order-total-currency">
                  <p>$ {CommaFormatted(CurrencyFormatted(totalUsd))}</p>
                  <p>R {CommaFormatted(CurrencyFormatted(totalKhr))}</p>
                </div>
              </div>
              <Flex className="menu-payment-btn-box">
                <p>Recieved:</p>
                <Input
                  placeholder="0"
                  type="number"
                  size="small"
                  id="totalDiscount"
                  value={receivedUsd}
                  onChange={(e) => setReceivedUsd(e.target.value)}
                  suffix={'$'}
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    maxWidth: '50%',
                    textAlign: 'center'
                  }}
                />
                <Input
                  placeholder="0"
                  type="number"
                  size="small"
                  id="totalDiscount"
                  value={receivedKhr}
                  onChange={(e) => setReceivedKhr(e.target.value)}
                  suffix={'R'}
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    maxWidth: '50%',
                    textAlign: 'center'
                  }}
                />
              </Flex>
              <Flex className="menu-payment-btn-box">
                <Popconfirm
                  onConfirm={handleClear}
                  title="Delete the task"
                  description="Are you sure to delete this item?"
                  icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                >
                  <Button className="menu-payment-btn" type="primary" block danger>
                    Clear Input
                  </Button>
                </Popconfirm>
                <Button
                  className="menu-payment-btn"
                  type="primary"
                  onClick={() => setOpen(true)}
                  block
                >
                  Payment
                </Button>
              </Flex>
            </div>
          </div>
        </div>
      </div>
      <Modal
        className="menu-modal-payment-box"
        width={'93mm'}
        centered
        open={open}
        onCancel={() => {
          setOpen(false)
        }}
        footer={[
          <Popconfirm title="Are you sure you want to print this receipt?" onConfirm={handlePrint}>
            <Button type="primary" icon={<PrinterOutlined />}>
              Print
            </Button>
          </Popconfirm>,
          <Button
            onClick={() => {
              setOpen(false)
            }}
          >
            Close
          </Button>
        ]}
      >
        <div className="print-container" ref={ref}>
          <div className="menu-receipt-header">
            <div className="shop-name">
              {/* <img
                width={'30px'}
                height={'30px'}
                src={__dirname + `/src/renderer/public/images/products/logo.jpg`}
              ></img> */}
              <h1 style={{ fontFamily: 'Gloria Hallelujah' }}>Now & Wow</h1>
              <div className="phone">
                <PhoneOutlined style={{ color: 'black' }} />
                <div className="phone-num">
                  <h3>078 7000 80</h3>
                  <h3>016 8287 09</h3>
                </div>
              </div>
            </div>
            <div className="shop-detail">
              <div className="instagram">
                <InstagramOutlined style={{ color: 'black' }} />
                <h3>nowwow_cambodia</h3>
              </div>
              <div className="facebook">
                <FacebookOutlined style={{ color: 'black' }} />
                <h3>Now & Wow</h3>
              </div>
            </div>
          </div>
          <Divider style={{ borderColor: 'black', margin: '0' }}></Divider>
          <Divider style={{ borderColor: 'black', margin: '0' }}></Divider>
          <div className="customer-info">
            <p style={{ fontSize: '12px' }}>Receipt Id: {receiptId}</p>
            <p style={{ fontSize: '12px' }}>Customer Information: </p>
            <div className="customer-detail">
              <p style={{ fontSize: '10px' }}>Name: {customerName}</p>
              <p style={{ fontSize: '10px' }}>Phone: {customerPhone}</p>
              <p style={{ fontSize: '10px' }}>Location: {customerLoc}</p>
              <p style={{ fontSize: '10px' }}>
                Date: {currDate} {currTime}
              </p>
            </div>
          </div>
          <Divider style={{ borderColor: 'black', margin: '0' }}></Divider>
          <Divider style={{ borderColor: 'black', margin: '0' }}></Divider>
          <div className="receipt-order">
            <Table
              className="table-order"
              columns={receiptColumn}
              dataSource={receiptOrder}
              pagination={false}
            ></Table>
          </div>
          <div className="menu-modal-payment">
            <div className="menu-modal-total-box">
              <div className="menu-modal-total">
                <p>Subtotal:</p>
                <div className="menu-modal-total-currency">
                  <p>{CommaFormatted(CurrencyFormatted(subTotalUsd))} $</p>
                  {/* <p>{CommaFormatted(CurrencyFormatted(subTotalKhr))} R</p> */}
                </div>
              </div>
            </div>
            <div className="menu-modal-total-box">
              <div className="menu-modal-total">
                <p>Discount:</p>
                <div className="menu-modal-discount-currency">
                  <p> -{CommaFormatted(CurrencyFormatted(discountUsd))} $</p>
                  {/* <p> -{CommaFormatted(CurrencyFormatted(discountKhr))} R</p> */}
                </div>
              </div>
            </div>
            <div className="menu-modal-total-box">
              <div className="menu-modal-total">
                <p>Delivery:</p>
                <div className="menu-modal-total-currency">
                  {isFreeDelivery ? (
                    <p>Free</p>
                  ) : (
                    <p> {CommaFormatted(CurrencyFormatted(Number(deliveryFee)))} $</p>
                  )}
                  {/* <p> -{CommaFormatted(CurrencyFormatted(discountKhr))} R</p> */}
                </div>
              </div>
            </div>
            <div className="menu-modal-total-box">
              <div className="menu-modal-total">
                <p>Total:</p>
                <div className="menu-modal-total-currency">
                  <p>{CommaFormatted(CurrencyFormatted(totalUsd))} $</p>
                  <p>{CommaFormatted(CurrencyFormatted(totalKhr))} R</p>
                </div>
              </div>
            </div>
            <div className="menu-modal-total-box" id="no-print">
              <div className="menu-modal-total">
                <p>Recieved:</p>
                <div className="menu-modal-total-currency">
                  <p>{CommaFormatted(CurrencyFormatted(receivedUsd))} $</p>
                  <p>{CommaFormatted(CurrencyFormatted(receivedKhr))} R</p>
                </div>
              </div>
            </div>
            <div className="menu-modal-total-box" id="no-print">
              <div className="menu-modal-total">
                <p>Change:</p>
                <div className="menu-modal-total-currency">
                  <p>{CommaFormatted(CurrencyFormatted(changeUsd))} $</p>
                  <p>{CommaFormatted(CurrencyFormatted(changeKhr))} R</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ReactToPrint
          pageStyle={pageStyle}
          content={() => ref.current}
          trigger={() => <></>} // Don't use the trigger here
          ref={(el) => {
            if (el) reactToPrintTrigger.current = el.handlePrint
          }}
        />
      </Modal>
      <Input
        style={{ display: 'none' }}
        value={barcodeValue}
        onChange={(e) => setBarcodeValue(e.target.value)}
      ></Input>
    </>
  )

  function mergeObjectsInUnique(array, property) {
    const newArray = new Map()

    array.forEach((item) => {
      const propertyValue = item[property]
      if (newArray.has(propertyValue)) {
        newArray.get(propertyValue).product_qty =
          item.product_qty + newArray.get(propertyValue).product_qty
        newArray.set(propertyValue, {
          ...item,
          ...newArray.get(propertyValue)
        })
        setIsChange(true)
      } else {
        newArray.set(propertyValue, item)
      }
    })

    return Array.from(newArray.values())
  }
}

export default Menu
