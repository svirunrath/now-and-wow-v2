import { Button, Modal, Select } from 'antd'
import Barcode from 'react-barcode'
import './styles/BarcodeModal.css'
import { useEffect, useRef, useState } from 'react'

import { PrinterOutlined } from '@ant-design/icons'
import ReactToPrint from 'react-to-print'
import { useRegisterBarcodeMutation } from '../slices/barcodeSlices.js'
import { useRetrieveImportDetailByIdQuery } from '../slices/importAPISlices.js'

const { Option } = Select

const BarcodeModal = ({ isOpen, product, handleOpenModal, importDetailId }) => {
  const ref = useRef()
  const [priceId, setPriceId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(isOpen)
  const [priceValue, setPriceValue] = useState('$ ' + '0.00')
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  const [registerBarcode] = useRegisterBarcodeMutation()
  const [importDataSource, setImportDataSource] = useState([])
  const {
    data: importDetailData,
    isLoading: importLoading,
    refetch: import_refetch
  } = useRetrieveImportDetailByIdQuery({ product_id: product.product_id })

  const [barcodeValue, setBarcodeValue] = useState(
    product.product_id.toString().padStart(6, '0') + '0'.padStart(6, '0')
  )

  useEffect(() => {
    if (!importLoading) {
      setImportDataSource(importDetailData.import_detail)
    }
  }, [importDetailData])

  useEffect(() => {
    if (!importLoading && importDataSource.length > 0 && importDetailId) {
      handlePriceChange(importDetailId.toString())
    }
  }, [importDataSource])

  const handlePriceChange = (value) => {
    setPriceId(value)
    let detail = [...importDataSource]
    detail = detail.filter((inner) => inner.import_detail_id === value)
    importDetailId = value

    setPriceValue('$ ' + Number(detail[0].product_sell_price).toFixed(2))
    setBarcodeValue(
      product.product_id.toString().padStart(6, '0') + value.toString().padStart(6, '0')
    )
  }

  const handleRegisterBarcode = async () => {
    let detail = [...importDataSource]
    detail = detail.filter((inner) => inner.import_detail_id === priceId)

    const req = {
      product_id: product.product_id,
      import_detail_id: priceId,
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
        className="modal-body"
        onCancel={() => {
          setIsModalOpen(false)
          return handleOpenModal(false)
        }}
        footer={[
          <ReactToPrint
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
        <div className="modal-main-container">
          <div className="price-select-container">
            <p1 id="no-print">Price Select: </p1>
            <Select
              id="no-print"
              onChange={handlePriceChange}
              value={priceId}
              style={{ width: '100%' }}
            >
              {importDataSource.map((importDetail) => {
                return (
                  <Option value={importDetail.import_detail_id}>
                    {new Date(importDetail.import_date).toLocaleDateString('GB')} - Import Price: ${' '}
                    {Number(importDetail.product_unit_total_price).toFixed(2)} - Sell Price: ${' '}
                    {Number(importDetail.product_sell_price).toFixed(2)} - Qty:{' '}
                    {Number(importDetail.product_qty)}
                  </Option>
                )
              })}
            </Select>
          </div>
          <div ref={ref} className="barcode-print-container">
            <div className="barcode-container">
              <Barcode
                width={1.2}
                height={30}
                margin={0}
                textAlign="center"
                fontSize={12}
                displayValue={true}
                format="CODE128"
                value={barcodeValue}
              ></Barcode>
              <div className="product-name">
                <p1 style={{ color: 'black' }}>Name:</p1>
                <p1> {product.product_name}</p1>
              </div>
              <div className="product-price-select">
                <p1 style={{ color: 'black' }}>Price:</p1>
                <p1 style={{ color: 'black' }}>{priceValue}</p1>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default BarcodeModal
