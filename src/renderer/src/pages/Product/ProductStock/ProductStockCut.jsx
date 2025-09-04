import './ProductStockCut.css'
import React, { useState, useEffect } from 'react'
import { Select, Input, InputNumber, Button, Table, Popconfirm } from 'antd'
import { useGetAllProductQuery } from '../../../slices/productAPISlices.js'
import { CommaFormatted, CurrencyFormatted } from '../../../utils/NumberFormatterUtils.js'
import { useRetrieveImportDetailByIdQuery } from '../../../slices/importAPISlices.js'
import { useLazyGetStockInfoByProductIdQuery } from '../../../slices/stockSlices.js'
const { Option } = Select
const { TextArea } = Input
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useRegisterStockCutMutation } from '../../../slices/stockCutSlices.js'

const ProductStockCut = () => {
  const { data: productData, isLoading: productIsLoading } = useGetAllProductQuery()
  const [productId, setProductId] = useState(null)
  const { data: priceData, isLoading: priceIsLoading } = useRetrieveImportDetailByIdQuery(
    { product_id: productId },
    { skip: !productId }
  )
  const [importDetailId, setimportDetailId] = useState(null)
  const [productInfo, setProductInfo] = useState(null)
  const [retrieveStockInfo] = useLazyGetStockInfoByProductIdQuery()
  const [mainQty, setMainQty] = useState(0)
  const [subQty, setSubQty] = useState(0)
  const [cutQty, setCutQty] = useState(0)
  const [description, setDescription] = useState('')
  const [stockId, setStockId] = useState(null)
  const [registerStockCut] = useRegisterStockCutMutation()
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  const navigate = useNavigate()

  function setDefault() {
    setimportDetailId(null)
    setProductInfo(null)
    setProductId(null)
    setStockId(null)
    setSubQty(0)
    setMainQty(0)
    setCutQty(0)
    setDescription('')
  }

  async function retrieveStockInfoFunc({ product_id, import_detail_id }) {
    const { data, isLoading } = await retrieveStockInfo({
      product_id: product_id,
      import_detail_id: import_detail_id
    })

    if (!isLoading && data) {
      let stockInfo = data.stock_items[0]

      setMainQty(stockInfo.main_stock)
      setSubQty(stockInfo.detail_stock)
      setStockId(stockInfo.stock_id)
    }
  }

  const handleSubmit = async () => {
    if (!productId) {
      toast.error('Please select a product.')
    } else if (!importDetailId) {
      toast.error('Please select a product sell price.')
    } else if (mainQty <= 0 || subQty <= 0) {
      toast.error('This product does not have in the current stock.')
    } else if (cutQty > subQty) {
      toast.error('The cut quantity cannot be larger than stock quantity.')
    } else {
      const reqData = {
        product_id: productId,
        stock_id: stockId,
        stck_cut_qty: -1 * Number(cutQty),
        created_by: userInfo.username,
        description: description,
        import_detail_id: importDetailId
      }

      const res = await registerStockCut(reqData).unwrap()

      if (res) {
        toast.success(res.message)
        setDefault()
      }
    }
  }
  const filterOption = (input, option) =>
    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())

  useEffect(() => {
    if (productId && importDetailId) {
      retrieveStockInfoFunc({ product_id: productId, import_detail_id: importDetailId })
    }
  }, [importDetailId])

  useEffect(() => {
    if (productId) {
      let product = productData.products.filter((product) => product.product_id == productId)
      setProductInfo(product[0])
      setimportDetailId(null)
      setSubQty(0)
      setMainQty(0)
      setCutQty(0)
      setStockId(null)
    } else {
      setProductInfo(null)
    }
  }, [productId])

  return (
    <>
      <div className="stock-cut-main-container">
        <header className="stock-cut-header">Cut Stock</header>
        <div className="stock-cut-input-container">
          <div className="stock-cut-input-block">
            <div className="stock-cut-row-1">
              <div className="stock-cut-input-group">
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
                  {!productIsLoading && productData
                    ? productData.products.map((product) => (
                        <Option value={product.product_id} key={product.product_id}>
                          {product.product_name}
                        </Option>
                      ))
                    : null}
                </Select>
              </div>
            </div>
            <div className="stock-cut-row-1">
              <div className="stock-cut-input-group">
                <label>Product Sale Price</label>
                <Select
                  style={{ width: '87%' }}
                  value={importDetailId}
                  onChange={(e) => setimportDetailId(e)}
                >
                  {!priceIsLoading && priceData
                    ? priceData.import_detail.map((price) => (
                        <Option value={price.import_detail_id} key={price.import_detail_id}>
                          {new Date(price.import_date).toLocaleDateString('GB')} - Import Price: ${' '}
                          {Number(price.product_unit_total_price).toFixed(2)} - Shipping Fee: ${' '}
                          {Number(price.tax_amt).toFixed(2)} - Tax Amt: ${' '}
                          {Number(price.shipping_fee).toFixed(2)} - Sell Price: ${' '}
                          {Number(price.product_sell_price).toFixed(2)} - Stock Qty:
                          {Number(price.product_qty)}
                        </Option>
                      ))
                    : null}
                </Select>
              </div>
            </div>
            <div className="stock-cut-row-1">
              <div className="stock-cut-input-group">
                <label>Unit</label>
                <Input
                  disabled={true}
                  value={productInfo ? productInfo.unit_name : ''}
                  style={{ width: '60%' }}
                ></Input>
              </div>
              <div className="stock-cut-input-group">
                <label>Category</label>
                <Input
                  disabled={true}
                  value={productInfo ? productInfo.category_name : ''}
                  style={{ width: '60%' }}
                ></Input>
              </div>
              <div className="stock-cut-input-group">
                <label>Sub-Category</label>
                <Input
                  disabled={true}
                  value={productInfo ? productInfo.sub_category_name : ''}
                  style={{ width: '60%' }}
                ></Input>
              </div>
            </div>
            <div className="stock-cut-row-1">
              <div className="stock-cut-input-group">
                <label>Product Main Stock</label>
                <InputNumber value={mainQty} disabled={true} style={{ width: '60%' }}></InputNumber>
              </div>
              <div className="stock-cut-input-group">
                <label>Product Sub Stock</label>
                <InputNumber value={subQty} disabled={true} style={{ width: '60%' }}></InputNumber>
              </div>
              <div className="stock-cut-input-group">
                <label>Stock Cut Quantity</label>
                <InputNumber
                  value={cutQty}
                  onChange={(e) => setCutQty(e)}
                  style={{ width: '60%' }}
                ></InputNumber>
              </div>
            </div>
            <div className="stock-cut-row-1">
              <div className="stock-cut-input-group">
                <label>Descriptions</label>
                <TextArea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  allowClear
                  style={{ width: '87%' }}
                  rows={4}
                />
              </div>
            </div>
            <div className="stock-cut-row-1">
              <div className="stock-cut-input-button">
                <Popconfirm
                  title="Are you sure you want to proceed the next action?"
                  onConfirm={handleSubmit}
                >
                  <Button type="primary">Submit</Button>
                </Popconfirm>
                <Button type="primary" onClick={setDefault}>
                  Clear
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
      </div>
    </>
  )
}

export default ProductStockCut
