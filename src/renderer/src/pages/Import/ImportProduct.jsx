import './ImportProduct.css'
import { HiMiniArchiveBoxArrowDown } from 'react-icons/hi2'
import React, { useState, useEffect } from 'react'
import { Select, Input, InputNumber, Button, Table, Popconfirm } from 'antd'
const { Option } = Select
import { useGetAllProductQuery } from '../../slices/productAPISlices.js'
import { importColumn } from './ImportColumn.jsx'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useRegisterImportMutation } from '../../slices/importAPISlices.js'

const filterOption = (input, option) =>
  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())

const ImportProduct = () => {
  const [productId, setProductId] = useState(null)
  const [productInfo, setProductInfo] = useState(null)
  const [importQty, setImportQty] = useState(0)
  const [importUnitPrice, setImportUnitPrice] = useState(0)
  const [importPrice, setImportPrice] = useState(0)
  const [importTax, setImportTax] = useState(0)
  const [shippingFee, setShippingFee] = useState(0)
  const [productSellPrice, setProductSellPrice] = useState(0)
  const [importTtlPrice, setImportTtlPrice] = useState(0)
  const [importDataSource, setImportDataSource] = useState([])
  const [rowCount, setRowCount] = useState(1)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [registerImport] = useRegisterImportMutation()
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  const navigate = useNavigate()

  const { data: productData, isLoading: productIsLoading } = useGetAllProductQuery()
  let count = rowCount
  let productTobBeInsert = {}
  let tempDataSource = importDataSource

  const setDefault = () => {
    setImportPrice(0)
    setImportQty(0)
    setImportTax(0)
    setImportUnitPrice(0)
    setShippingFee(0)
    setProductSellPrice(0)
    setProductId(null)
    setProductInfo(null)
    setImportTtlPrice(0)
    productTobBeInsert = {}
  }

  useEffect(() => {
    if (productId) {
      let product = productData.products.filter((product) => product.product_id == productId)
      setProductInfo(product[0])
    } else {
      setProductInfo(null)
    }
  }, [productId])

  useEffect(() => {
    for (let i = 0; i < tempDataSource.length; i++) {
      tempDataSource[i].key = i + 1
    }
    setImportDataSource(tempDataSource)

    setRowCount(tempDataSource.length + 1)
  }, [importDataSource])

  useEffect(() => {
    // let importTaxPrice = (importPrice * 10.25) / 100
    // setImportTax(importTaxPrice)
    let importUnitPrice = Number(shippingFee) + Number(importPrice) + Number(importTax)
    let totalPrice = Number(importUnitPrice) * Number(importQty)
    setImportUnitPrice(importUnitPrice)
    setImportTtlPrice(totalPrice)
  }, [shippingFee, importPrice, importQty, importTax])

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys)
    }
  }

  const handleAddRow = () => {
    if (!productInfo) {
      toast.error('Please select a product first.')
    } else if (productSellPrice === 0) {
      toast.error('Sell price cannot be 0.')
    } else if (importQty === 0) {
      toast.error('Import qty cannot be 0.')
    } else {
      setRowCount(count + 1)
      productTobBeInsert = { ...productInfo }
      productTobBeInsert.key = count
      productTobBeInsert.import_qty = importQty
      productTobBeInsert.product_import_price = importPrice
      productTobBeInsert.tax_amt = importTax
      productTobBeInsert.shipping_fee = shippingFee
      productTobBeInsert.import_unit_price = importUnitPrice
      productTobBeInsert.import_total_price = importTtlPrice
      productTobBeInsert.product_sell_price = productSellPrice
      tempDataSource.push(productTobBeInsert)

      setImportDataSource(tempDataSource)
      setDefault()
    }
  }

  const handleDeleteRow = () => {
    if (selectedRowKeys.length === 0) {
      toast.error('Please select a product to delete.')
    } else {
      tempDataSource = tempDataSource.filter((data) => !selectedRowKeys.includes(data.key))

      setImportDataSource(tempDataSource)
    }
  }

  const handSubmitImport = async () => {
    if (importDataSource.length == 0) {
      toast.error('No product in the import list.')
    } else {
      const inputData = {}
      inputData.created_by = userInfo.username
      inputData.import_detail = importDataSource

      const res = await registerImport(inputData).unwrap()
      if (res) {
        setRowCount(1)
        setDefault()
        setImportDataSource([])
        tempDataSource = []
        toast.success(res.message)
      } else {
        toast.error('There is something wrong while importing products.')
      }
    }
  }

  //Render Screen
  return (
    <>
      <div className="import-main-container">
        <header className="import-main-header">
          Import Product
          <div className="import-icon">
            <HiMiniArchiveBoxArrowDown color="white"></HiMiniArchiveBoxArrowDown>
          </div>
        </header>
        <div className="import-input-container">
          <div className="import-input-block">
            <div className="import-row-1">
              {/* Product Name */}
              <div className="import-input-group">
                <label>Product Name</label>
                <Select
                  showSearch
                  value={productId}
                  onChange={(value) => {
                    setProductId(value)
                  }}
                  filterOption={filterOption}
                  style={{ width: '87%' }}
                >
                  {!productIsLoading
                    ? productData.products.map((product) => (
                        <Option value={product.product_id} key={product.product_id}>
                          {product.product_name}
                        </Option>
                      ))
                    : null}
                </Select>
              </div>
            </div>
            <div className="import-row-1">
              <div className="import-input-group">
                <label>Unit</label>
                <Input
                  disabled={true}
                  value={productInfo ? productInfo.unit_name : ''}
                  style={{ width: '60%' }}
                ></Input>
              </div>
              <div className="import-input-group">
                <label>Import Quantity</label>
                <InputNumber
                  style={{ width: '60%' }}
                  value={importQty}
                  onChange={(value) => {
                    setImportQty(value)
                  }}
                ></InputNumber>
              </div>
              <div className="import-input-group">
                <label>Import Price</label>
                <InputNumber
                  style={{ width: '60%' }}
                  value={importPrice}
                  onChange={(value) => setImportPrice(value)}
                ></InputNumber>
              </div>
            </div>
            <div className="import-row-1">
              <div className="import-input-group">
                <label>Import Tax</label>
                <InputNumber
                  style={{ width: '60%' }}
                  onChange={(value) => setImportTax(value)}
                  value={importTax}
                  // disabled={true}
                ></InputNumber>
              </div>
              <div className="import-input-group">
                <label>Shipping Fee</label>
                <InputNumber
                  style={{ width: '60%' }}
                  value={shippingFee}
                  onChange={(value) => setShippingFee(value)}
                ></InputNumber>
              </div>
              <div className="import-input-group">
                <label>Product Sell Price</label>
                <InputNumber
                  style={{ width: '60%' }}
                  value={productSellPrice}
                  onChange={(value) => setProductSellPrice(value)}
                ></InputNumber>
              </div>
            </div>
            <div className="import-row-1">
              <div className="import-input-group">
                <label>Import Unit Price</label>
                <InputNumber
                  disabled={true}
                  style={{ width: '60%' }}
                  value={importUnitPrice.toFixed(2)}
                ></InputNumber>
              </div>
              <div className="import-input-group">
                <label>Import Total Price</label>
                <InputNumber
                  disabled={true}
                  style={{ width: '60%' }}
                  value={importTtlPrice.toFixed(2)}
                ></InputNumber>
              </div>
              <div className="import-input-button">
                <Button type="primary" onClick={handleAddRow}>
                  Add Row
                </Button>
                <Button type="primary" onClick={setDefault}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="import-table">
          <div className="import-input-block">
            <Table
              style={{ width: '100%' }}
              dataSource={[...importDataSource]}
              columns={importColumn}
              rowSelection={{
                type: 'checkbox',
                ...rowSelection
              }}
            ></Table>
            <div className="import-input-button">
              <Popconfirm title="Are you sure you want to submit?" onConfirm={handSubmitImport}>
                <Button type="primary">Submit</Button>
              </Popconfirm>
              <Popconfirm
                title="Are you sure you want to delete the selected row(s)?"
                onConfirm={handleDeleteRow}
              >
                <Button type="primary" danger>
                  Delete
                </Button>
              </Popconfirm>
              <Button
                type="primary"
                onClick={() => {
                  navigate('/import/report')
                }}
              >
                Import Report
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  navigate('/home')
                }}
              >
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ImportProduct
