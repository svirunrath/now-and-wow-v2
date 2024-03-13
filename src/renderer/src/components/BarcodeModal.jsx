import { Button, Modal, Select } from 'antd'
import Barcode from 'react-barcode'
import './styles/BarcodeModal.css'
import { useEffect, useRef, useState } from 'react'
import {
  useGetPriceIdByProductPriceQuery,
  useGetProductPriceByPriceIdQuery
} from '../slices/productPriceSlices.js'
import { PrinterOutlined } from '@ant-design/icons'
import ReactToPrint from 'react-to-print'
import { useRegisterBarcodeMutation } from '../slices/barcodeSlices.js'

const { Option } = Select

const BarcodeModal = ({ isOpen, product, handleOpenModal, product_sell_price }) => {
  const ref = useRef()
  let priceDataSource = []
  const [priceId, setPriceId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(isOpen)
  const [priceValue, setPriceValue] = useState('$ ' + '0.00')
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  const [registerBarcode] = useRegisterBarcodeMutation()

  const [barcodeValue, setBarcodeValue] = useState(
    product.product_id.toString().padStart(6, '0') + '0'.padStart(6, '0')
  )

  const { data: priceData, isLoading: priceIsLoading } = useGetProductPriceByPriceIdQuery({
    product_id: product.product_id
  })

  const { data, isLoading } = useGetPriceIdByProductPriceQuery(
    {
      product_id: product.product_id,
      product_sell_price: product_sell_price
    },
    { skip: product_sell_price === undefined }
  )

  useEffect(() => {
    if (!isLoading && product_sell_price) {
      let price = Number(product_sell_price)
      setPriceId(data.product_price[0].price_id)
      setPriceValue('$ ' + price.toFixed(2))
      setBarcodeValue(
        product.product_id.toString().padStart(6, '0') +
          data.product_price[0].price_id.toString().padStart(6, '0')
      )
    }
  }, [data])

  if (!priceIsLoading) {
    for (let i = 0; i < priceData.product_price.length; i++) {
      const price = Number(priceData.product_price[i].product_sell_price)
      priceDataSource.push(
        <Option
          key={priceData.product_price[i].price_id}
          value={priceData.product_price[i].price_id}
          label={'$ ' + price.toFixed(2)}
        >
          {'$ ' + price.toFixed(2)}
        </Option>
      )
    }
  }

  const handlePriceChange = (value, options) => {
    setPriceId(value)
    setPriceValue(options.label)
    setBarcodeValue(
      product.product_id.toString().padStart(6, '0') + value.toString().padStart(6, '0')
    )
  }

  const handleRegisterBarcode = async () => {
    const req = {
      product_id: product.product_id,
      price_id: priceId,
      created_by: userInfo.username,
      barcode_value: barcodeValue
    }

    const res = await registerBarcode(req).unwrap()

    if (res) {
      setPriceId(null)
      setIsModalOpen(false)
      setPriceValue('$ ' + '0.00')
      setBarcodeValue(product.product_id.toString().padStart(6, '0') + '0'.padStart(6, '0'))
      return handleOpenModal(false)
    }
  }

  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)
          return handleOpenModal(false)
        }}
        footer={[
          <ReactToPrint
            bodyClass="print-agreement"
            content={() => ref.current}
            onAfterPrint={handleRegisterBarcode}
            trigger={() => (
              <Button type="primary" icon={<PrinterOutlined />}>
                Print
              </Button>
            )}
          />,
          <Button
            onClick={() => {
              setIsModalOpen(false)
              return handleOpenModal(false)
            }}
          >
            Close
          </Button>
        ]}
      >
        <p1>Price Select: </p1>
        <Select style={{ width: '130px' }} onChange={handlePriceChange} value={priceId}>
          {priceDataSource}
        </Select>
        <div className="barcode-container" ref={ref}>
          <div className="product-barcode">
            <Barcode
              width={2}
              height={60}
              displayValue={true}
              format="CODE128"
              value={barcodeValue}
            ></Barcode>
          </div>
          <div className="barcode-content">
            <div className="product-name">
              <p1 style={{ color: 'black' }}>Product Name:</p1>
              <p1> {product.product_name}</p1>
            </div>
            <div className="product-price-select">
              Product Price:
              <p1 style={{ color: 'black' }}>{priceValue}</p1>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default BarcodeModal
