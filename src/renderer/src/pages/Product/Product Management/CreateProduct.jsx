import {
  Form,
  Upload,
  Select,
  Input,
  Modal,
  Button,
  InputNumber,
  Divider,
  Space,
  Popconfirm
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './CreateProduct.css'
import { useEffect, useState, useRef } from 'react'
import { useGetSubCategoryByMainIdQuery } from '../../../slices/subCategoryAPISlices'
import { useGetMainCategoryQuery } from '../../../slices/mainCategoryAPISlices'
import { toast } from 'react-toastify'
import {
  useInsertImageMutation,
  useUpdateProductByIdMutation
} from '../../../slices/productAPISlices'
import { useRegisterUnitMutation, useRetrieveUnitListQuery } from '../../../slices/unitAPISlices.js'
import path from 'path'
import {
  useRetrieveImportDetailByIdQuery,
  useUpdateImportMutation
} from '../../../slices/importAPISlices.js'
const __dirname = path.resolve(path.dirname(''))

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
let formData = new FormData()

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok')
  }, 0)
}

const CreateProduct = ({ isOpen, product, onSubmitEdit }) => {
  //Handle Category
  const mainChildren = []
  const { Option } = Select
  const [disabled, setDisabled] = useState(true)
  const [categoryId, setCategoryId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(isOpen ? isOpen : false)

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  const getMainCategory = useGetMainCategoryQuery()

  if (getMainCategory.data) {
    for (let i = 0; i < getMainCategory.data.main_category.length; i++) {
      mainChildren.push(
        <Option
          key={getMainCategory.data.main_category[i].category_id}
          value={getMainCategory.data.main_category[i].category_id}
        >
          {getMainCategory.data.main_category[i].category_name}
        </Option>
      )
    }
  }

  //Sub-Category Handler
  const result = useGetSubCategoryByMainIdQuery(
    { category_id: categoryId },
    { skip: categoryId === undefined }
  )

  let subChildren = []

  const handleMainChange = (value) => {
    if (value) {
      setCategoryId(value)
    }

    if (result.data) {
      setDisabled(false)
    }
  }

  if (result.data) {
    for (let i = 0; i < result.data.sub_category.length; i++) {
      subChildren.push(
        <Option
          key={result.data.sub_category[i].sub_category_id}
          value={result.data.sub_category[i].sub_category_id}
        >
          {result.data.sub_category[i].sub_category_name}
        </Option>
      )
    }
  }

  //Image Handler
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([])
  const newFileList = []

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  const handleChange = (info) => {
    if (info.fileList.length > 0) {
      newFileList.push(info.file)
      setFileList(newFileList)

      if (fileList.length == 1) {
        if (info.file) formData.append('file', info.file.originFileObj)
      }
    }
  }

  const handleRemove = (info) => {
    setFileList([])
    newFileList.splice()
    formData.delete('file')
  }

  const uploadButton = (
    <div>
      <PlusOutlined id="plus-ico" />
      <div
        style={{
          marginTop: 8
        }}
      >
        Change Image
      </div>
    </div>
  )

  //Handle Unit
  const { data, isLoading, refetch } = useRetrieveUnitListQuery()
  const {
    data: importDetailData,
    isLoading: importLoading,
    refetch: import_refetch
  } = useRetrieveImportDetailByIdQuery({ product_id: product.product_id })
  let unitList = []
  const [newUnit, setNewUnit] = useState('')
  const [unitValue, setUnitValue] = useState(null)
  const [registerUnit] = useRegisterUnitMutation()
  const [currentImg, setCurrentImg] = useState('')
  const inputRef = useRef(null)
  const [subCatId, setSubCatId] = useState(null)
  const [productName, setProductName] = useState('')
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  const [insertImage] = useInsertImageMutation()
  const [updateProductById] = useUpdateProductByIdMutation()
  const [currency, setCurrency] = useState('USD')
  const [sellPrice, setSellPrice] = useState(0.0)
  const [exchangedPrice, setExchangedPrice] = useState(0.0)
  const [importDataSource, setImportDataSource] = useState([])
  const [importId, setImportId] = useState(null)
  const [shippingFee, setShippingFee] = useState(0)
  const [taxAmount, setTaxAmount] = useState(0)
  const [importDiscount, setImportDiscount] = useState(0)
  const [importPrice, setImportPrice] = useState(0)
  const [updateImportInfo] = useUpdateImportMutation()
  const exchangeRate = localStorage.getItem('exchangeRate')
  const [productUnitTotalPrice, setProductUnitTotalPrice] = useState(0)
  const [isDisabled, setIsDisabled] = useState(true)

  const onNameChange = (event) => {
    setNewUnit(event.target.value)
  }

  if (!isLoading) {
    if (data) {
      for (let i = 0; i < data.unit.length; i++) {
        unitList.push({
          value: data.unit[i].unit_id,
          label: data.unit[i].unit_name
        })
      }
    }
  }

  useEffect(() => {
    if (!importLoading) {
      setImportDataSource(importDetailData.import_detail)
    }
  }, [importDetailData])

  useEffect(() => {
    if (!importId) {
      setIsDisabled(true)
    } else {
      setIsDisabled(false)
    }
  }, [importId])

  useEffect(() => {
    if (importDataSource.length > 0) {
      let detail = [...importDataSource]
      detail = detail.filter((inner) => inner.import_detail_id === importId)

      setShippingFee(detail[0].shipping_fee)
      setImportPrice(detail[0].product_import_price)
      setTaxAmount(detail[0].tax_amt)
      setImportDiscount(detail[0].product_discount_price)
      setSellPrice(detail[0].product_sell_price)
      setProductUnitTotalPrice(detail[0].product_unit_total_price)
      handleSellPriceChange(Number(detail[0].product_sell_price))
    }
  }, [importId])

  const handleUnitChange = (value) => {
    setUnitValue(value)
  }

  const handleAddUnit = async () => {
    try {
      if (!newUnit) {
        toast.error('Please input the unit name')
      } else {
        const req = { unit_name: newUnit }

        const res = await registerUnit(req).unwrap()

        if (res) {
          setNewUnit('')
          refetch()
        }
      }
    } catch (error) {}
  }

  useEffect(() => {
    if (product) {
      setProductName(product.product_name)
      setUnitValue(product.unit_id)
      setSubCatId(product.sub_category_id)
      setCategoryId(product.category_id)
      setCurrentImg(product.image_path)
    }
  }, [product])

  useEffect(() => {
    let tax = Number(taxAmount)
    let shipping = Number(shippingFee)
    let tempImportPrice = Number(importPrice)
    let importTotal = tax + shipping + tempImportPrice - importDiscount

    setProductUnitTotalPrice(importTotal)
  }, [taxAmount, shippingFee, importPrice, importDiscount])

  //Submit product

  const handleSubmitProduct = async () => {
    try {
      if (!importId) {
        toast.error('Please Select an Import Detail.')
        return
      }

      if (!subCatId) {
        toast.error('Please Select a Sub Category.')
        return
      }

      if (productName == '') {
        toast.error('Product Name cannot be empty.')
        return
      }

      let img = fileList.length > 0 ? await insertImage(formData).unwrap() : ''
      const image_name =
        img === '' ? currentImg : '/src/renderer/public/images/products/' + img.file.filename

      const reqProduct = {
        product_id: product.product_id,
        sub_category_id: subCatId,
        product_name: productName,
        image_path: image_name,
        modfied_by: userInfo.username,
        unit_id: unitValue
      }

      let detail = [...importDataSource]
      detail = detail.filter((inner) => inner.import_detail_id === importId)

      const reqImport = {
        product: reqProduct,
        import_detail_id: detail[0].import_detail_id,
        import_id: detail[0].import_id,
        product_id: product.product_id,
        import_qty: detail[0].import_qty,
        product_import_price: Number(importPrice).toFixed(2),
        product_discount_price: Number(importDiscount).toFixed(2),
        product_sell_price: Number(sellPrice).toFixed(2),
        shipping_fee: Number(shippingFee).toFixed(2),
        tax_amt: Number(taxAmount).toFixed(2),
        product_unit_total_price: productUnitTotalPrice.toFixed(2),
        created_by: userInfo.username,
        modfied_by: userInfo.username
      }

      const res_import = await updateImportInfo(reqImport).unwrap()

      if (res_import) {
        toast.success(res_import.message)
        setCategoryId(null)
        setFileList([])
        setUnitValue(null)
        setSubCatId(null)
        setProductName('')
        setCurrency('USD')
        setExchangedPrice(0.0)
        setImportId(null)
        setImportDataSource([])
        setShippingFee(0)
        setImportDiscount(0)
        setTaxAmount(0)
        setProductUnitTotalPrice(0)
        setImportPrice(0)
        setSellPrice(0)
        img = null
        formData.delete('file')
        setIsModalOpen(false)

        await import_refetch()

        return await onSubmitEdit(true)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleRemoveProduct = async () => {
    try {
      const req = {
        product_id: product.product_id,
        sub_category_id: subCatId,
        product_name: productName,
        isdeleted_yn: true,
        modfied_by: userInfo.username,
        unit_id: unitValue,
        product_sell_price: sellPrice == 0 ? null : sellPrice
      }

      const res = await updateProductById(req).unwrap()

      if (res) {
        toast.success(res.message)
        setCategoryId(null)
        setFileList([])
        setUnitValue(null)
        setSubCatId(null)
        setProductName('')
        setCurrency('USD')
        setExchangedPrice(0.0)
        setSellPrice(0)
        img = null
        formData.delete('file')
        setIsModalOpen(false)

        return onSubmitEdit(true)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleCurrencyChange = (value) => {
    if (value == 'USD') {
      setExchangedPrice(sellPrice * exchangeRate)
    } else if (value == 'RIEL') {
      setExchangedPrice(sellPrice / exchangeRate)
    }

    setCurrency(value)
  }

  const handleSellPriceChange = (value) => {
    if (currency == 'USD') {
      setExchangedPrice(value * exchangeRate)
    } else if (currency == 'RIEL') {
      setExchangedPrice(value / exchangeRate)
    }

    setSellPrice(value)
  }

  const selectAfter = (
    <Select
      defaultValue="USD"
      style={{
        width: 75,
        height: 30,
        backgroundColor: 'white',
        borderRadius: '6px'
      }}
      disabled={true}
      value={currency}
      onChange={handleCurrencyChange}
    >
      <Option value="USD">USD</Option>
      <Option value="RIEL">Riel</Option>
    </Select>
  )

  //Render
  return (
    <>
      <Modal
        open={isModalOpen}
        className="createProductMainContainer"
        onCancel={() => {
          setIsModalOpen(false)
          return onSubmitEdit(true)
        }}
        onOk={handleSubmitProduct}
        footer={[
          <Button onClick={handleSubmitProduct} type="primary">
            Save
          </Button>,
          <Button
            onClick={() => {
              setIsModalOpen(false)
              return onSubmitEdit(true)
            }}
          >
            Close
          </Button>,
          <Popconfirm
            title="Delete Product"
            description="Are you sure you want to delete this product?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              handleRemoveProduct()
              setIsModalOpen(false)
              return onSubmitEdit(true)
            }}
          >
            <Button type="primary" danger>
              Delete Product
            </Button>
          </Popconfirm>
        ]}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold'
          }}
        >
          Edit {productName}
        </header>

        <Form style={{ width: 800, padding: 25 }}>
          <div className="product-main-block">
            <div className="product-input">
              <label>Import Info:</label>
              <Select
                style={{ width: '100%' }}
                value={importId}
                filterOption={filterOption}
                onSelect={(value) => {
                  setImportId(value)
                }}
              >
                {importDataSource.map((importDetail) => {
                  return (
                    <Option value={importDetail.import_detail_id}>
                      {new Date(importDetail.import_date).toLocaleDateString('GB')} - Import Price:
                      $ {Number(importDetail.product_unit_total_price).toFixed(2)} - Sell Price: ${' '}
                      {Number(importDetail.product_sell_price).toFixed(2)}
                    </Option>
                  )
                })}
              </Select>
            </div>
            <div className="product-input">
              <label>Product Name:</label>
              <Input
                onChange={(e) => setProductName(e.target.value)}
                disabled={isDisabled}
                value={productName}
                className="product-name-input"
              ></Input>
            </div>
            <div className="product-input">
              <label>Unit Name:</label>
              <Select
                style={{ width: '100%' }}
                disabled={isDisabled}
                showSearch
                placeholder="Select a unit"
                optionFilterProp="children"
                onChange={(value) => handleUnitChange(value)}
                value={unitValue}
                dropdownRender={(menu) => (
                  <>
                    <Divider
                      style={{
                        margin: '8px 0'
                      }}
                    />
                    <Space
                      style={{
                        padding: '0 8px 4px'
                      }}
                    >
                      <Input
                        placeholder="Please enter item"
                        bordered
                        ref={inputRef}
                        value={newUnit}
                        onChange={onNameChange}
                        onKeyDown={(e) => e.stopPropagation()}
                      />
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        className="add-unit-button"
                        onClick={handleAddUnit}
                      >
                        Add item
                      </Button>
                    </Space>
                    {menu}
                  </>
                )}
                options={unitList}
              ></Select>
            </div>
            <div className="product-input">
              <label>Main Category:</label>
              <Select
                showSearch
                placeholder="Select a main category"
                optionFilterProp="children"
                style={{ width: '100%' }}
                value={categoryId}
                disabled={disabled}
                filterOption={filterOption}
                onSelect={handleMainChange}
              >
                {mainChildren}
              </Select>
            </div>
            <div className="product-input">
              <label>Sub Category:</label>
              <Select
                showSearch
                id="sub-category-select"
                placeholder="Select a sub category"
                optionFilterProp="children"
                style={{ width: '100%' }}
                disabled={disabled}
                value={subCatId}
                onChange={(value) => setSubCatId(value)}
              >
                {subChildren ? subChildren : null}
              </Select>
            </div>
            <div className="product-input">
              <label>Import Unit Price:</label>
              <InputNumber
                defaultValue={0.0}
                style={{ width: '100%' }}
                disabled={isDisabled}
                onChange={(e) => {
                  setImportPrice(e)
                }}
                value={importPrice ? Number(importPrice).toFixed(2) : 0}
                type="number"
              />
            </div>
            <div className="product-input">
              <label>Shipping Fee:</label>
              <InputNumber
                defaultValue={0.0}
                style={{ width: '100%' }}
                disabled={isDisabled}
                onChange={(e) => setShippingFee(e)}
                value={shippingFee ? Number(shippingFee).toFixed(2) : 0}
                type="number"
              />
            </div>
            <div className="product-input">
              <label>Tax Amount:</label>
              <InputNumber
                defaultValue={0.0}
                style={{ width: '100%' }}
                disabled={isDisabled}
                onChange={(e) => setTaxAmount(e)}
                value={taxAmount ? Number(taxAmount).toFixed(2) : 0}
                type="number"
              />
            </div>
            <div className="product-input">
              <label>Discount :</label>
              <InputNumber
                defaultValue={0.0}
                style={{ width: '100%' }}
                disabled={isDisabled}
                onChange={(e) => setImportDiscount(e)}
                value={importDiscount ? Number(importDiscount).toFixed(2) : 0}
                type="number"
              />
            </div>
            <div className="product-input">
              <label>Total Unit Price:</label>
              <InputNumber
                defaultValue={0.0}
                disabled={disabled}
                style={{ width: '100%' }}
                value={productUnitTotalPrice ? Number(productUnitTotalPrice).toFixed(2) : 0}
                type="number"
              />
            </div>
            <div className="product-input">
              <label>Sell Unit Price:</label>
              <InputNumber
                addonAfter={selectAfter}
                defaultValue={0.0}
                disabled={isDisabled}
                style={{ width: '50%' }}
                onChange={handleSellPriceChange}
                value={sellPrice ? Number(sellPrice).toFixed(2) : 0}
                type="number"
              />
              <Input
                className="exchange-amount"
                disabled={true}
                style={{ width: '50%' }}
                onChange={(e) => setExchangedPrice(e.target.value)}
                value={exchangedPrice.toFixed(2)}
              ></Input>
            </div>
            <div className="product-input-image">
              <label>Product Image:</label>
              <Upload
                customRequest={dummyRequest}
                disabled={isDisabled}
                listType="picture-card"
                fileList={fileList}
                multiple={false}
                onPreview={handlePreview}
                onChange={handleChange}
                onRemove={handleRemove}
                maxCount={1}
                name="file"
                style={{ width: '50%' }}
              >
                {fileList.length < 1 && uploadButton}
              </Upload>
              <label>Current Image: </label>
              <img src={__dirname + currentImg} style={{ width: '100px', height: '100px' }}></img>
              <Modal
                style={{ color: 'black' }}
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
              >
                <img
                  alt="example"
                  style={{
                    width: '100%'
                  }}
                  src={previewImage}
                />
              </Modal>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default CreateProduct
