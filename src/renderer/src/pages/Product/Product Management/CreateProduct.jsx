import {
  Form,
  Upload,
  Select,
  Input,
  Modal,
  Button,
  InputNumber,
  Typography,
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
import { useRegisterUnitMutation, useRetrieveUnitListQuery } from '../../../slices/unitAPISlices'

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
    /*setFileList(newFileList);
    if (newFileList) {)
      formData.append("file", newFileList[0].originFileObj);
    }*/
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
  const exchangeRate = localStorage.getItem('exchangeRate')

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

  //Submit product

  const handleSubmitProduct = async () => {
    try {
      if (!subCatId) {
        toast.error('Please Select a Sub Category.')
        throw new Error('Please Select a Sub Category.')
      }

      let img = fileList.length > 0 ? await insertImage(formData).unwrap() : ''
      const image_name =
        img === '' ? currentImg : '/src/renderer/public/images/products/' + +img.file.filename

      const req = {
        product_id: product.product_id,
        sub_category_id: subCatId,
        product_name: productName,
        image_path: image_name,
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
      toast.error(error)
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
      toast.error(error)
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
        <div className="FormFlex">
          <div className="product-main-block">
            <Form name="add-product" style={{ maxWidth: 800, padding: 25 }}>
              <Form.Item label="Product Name">
                <div className="pro-name-wrapper">
                  <Input
                    onChange={(e) => setProductName(e.target.value)}
                    value={productName}
                    className="product-name-input"
                  ></Input>
                </div>
              </Form.Item>
              <Form.Item label="Product Unit">
                <div className="unit-wrapper">
                  <Select
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
              </Form.Item>
              <Form.Item label="Product Main Category">
                <div className="main-category-wrapper">
                  <Select
                    showSearch
                    placeholder="Select a main category"
                    optionFilterProp="children"
                    value={categoryId}
                    disabled={disabled}
                    filterOption={filterOption}
                    onSelect={handleMainChange}
                  >
                    {mainChildren}
                  </Select>
                </div>
              </Form.Item>
              <Form.Item label="Product Sub Category">
                <div className="sub-category-wrapper">
                  <Select
                    showSearch
                    id="sub-category-select"
                    placeholder="Select a sub category"
                    optionFilterProp="children"
                    disabled={disabled}
                    value={subCatId}
                    onChange={(value) => setSubCatId(value)}
                  >
                    {subChildren ? subChildren : null}
                  </Select>
                </div>
              </Form.Item>
              <Form.Item label="Sell Unit Price">
                <div className="sell-price-wrapper">
                  <InputNumber
                    addonAfter={selectAfter}
                    defaultValue={0.0}
                    onChange={handleSellPriceChange}
                    value={sellPrice ? sellPrice.toFixed(2) : 0}
                    type="number"
                  />
                  <Input
                    className="exchange-amount"
                    disabled={true}
                    onChange={(e) => setExchangedPrice(e.target.value)}
                    value={exchangedPrice.toFixed(2)}
                  ></Input>
                </div>
              </Form.Item>
              <Form.Item label="Product Image">
                <div className="image-wrapper">
                  <Upload
                    customRequest={dummyRequest}
                    listType="picture-card"
                    fileList={fileList}
                    multiple={false}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    onRemove={handleRemove}
                    maxCount={1}
                    name="file"
                  >
                    {fileList.length < 1 && uploadButton}
                  </Upload>
                  <Form.Item label="Current Image">
                    <img src={currentImg} style={{ width: '100px', height: '100px' }}></img>
                  </Form.Item>
                </div>
                <Modal
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
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default CreateProduct
