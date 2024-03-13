import { useRef, useEffect, useState } from 'react'
import './styles/ProductCard.css'
import { Card, Button, Divider, Upload, Input, Select, Modal, Space } from 'antd'
import { toast } from 'react-toastify'
const { Meta } = Card
import { PlusOutlined, EditOutlined, BarcodeOutlined, PlusCircleOutlined } from '@ant-design/icons'
import {
  useGetSubCategoryByMainIdQuery,
  useGetSubCategoryQuery
} from '../slices/subCategoryAPISlices.js'
import { useRegisterUnitMutation, useRetrieveUnitListQuery } from '../slices/unitAPISlices.js'
import { useInsertImageMutation, useRegisterProductMutation } from '../slices/productAPISlices.js'
import CreateProduct from '../pages/Product/Product Management/CreateProduct.jsx'
import BarcodeModal from './BarcodeModal.jsx'
import path from 'path'
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
  }, 50)
}

const ProductCard = ({ category_id, product, isNew, sub_category_id, onSubmitChange }) => {
  const [isOpen, setIsOpen] = useState(true)
  let product_title = ''
  let product_description = ''

  if (product) {
    var min_price = Number(product.min_product_sell_price)
    var max_price = Number(product.max_product_sell_price)

    var sell_price = [min_price, max_price]

    product_title = product.sub_category_name + ' - ' + product.product_name
    product_description =
      '$ ' +
      (max_price == min_price
        ? sell_price[1].toFixed(2)
        : sell_price[0].toFixed(2) + ' - $ ' + sell_price[1].toFixed(2)) +
      ' - ' +
      product.product_qty +
      ' ' +
      product.unit_name +
      '(s)'
  }

  let categoryDataSource = []

  if (category_id == 'ALL') {
    const { data, isLoading, refetch } = useGetSubCategoryQuery()

    if (!isLoading) {
      for (let i = 0; i < data.sub_category.length; i++) {
        categoryDataSource.push(
          <Option
            key={data.sub_category[i].sub_category_id}
            value={data.sub_category[i].sub_category_id}
          >
            {data.sub_category[i].sub_category_name}
          </Option>
        )
      }
    }
  } else {
    const { data, isLoading, refetch } = useGetSubCategoryByMainIdQuery({
      category_id
    })

    if (!isLoading) {
      for (let i = 0; i < data.sub_category.length; i++) {
        categoryDataSource.push(
          <Option
            key={data.sub_category[i].sub_category_id}
            value={data.sub_category[i].sub_category_id}
          >
            {data.sub_category[i].sub_category_name}
          </Option>
        )
      }
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

  //Handle Unit
  const { data, isLoading, refetch } = useRetrieveUnitListQuery()
  let unitList = []
  const [newUnit, setNewUnit] = useState('')
  const [registerUnit] = useRegisterUnitMutation()
  const inputRef = useRef(null)

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

  //Handle Submit
  const [productName, setProductName] = useState('')
  const [subCatId, setSubCatId] = useState(null)
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  const [unitValue, setUnitValue] = useState(null)
  const [insertImage] = useInsertImageMutation()
  const [registerProduct] = useRegisterProductMutation()
  const [isOpenBarcode, setIsOpenBarcode] = useState(false)

  useEffect(() => {
    if (sub_category_id) {
      setSubCatId(sub_category_id)
    }
  }, [sub_category_id])

  const [isEdit, setIsEdit] = useState(false)
  const [isEdited, setIsEdited] = useState(false)

  useEffect(() => {
    if (isEdit) {
      setIsEdit(true)
      setIsEdited(false)
    }

    if (isEdited) {
      setIsEdit(false)
      setIsEdited(false)
      return onSubmitChange(true)
    }
  }, [isEdited, isEdit])

  const handleAdd = async () => {
    try {
      if (!subCatId) {
        toast.error('Please select a sub category.')
      }

      if (!unitValue) {
        toast.error('Please select a unit.')
      }

      if (!productName) {
        toast.error('Please enter product name.')
      }

      let img = fileList.length > 0 ? await insertImage(formData).unwrap() : ''
      const image_name = img === '' ? 'no-images.jpg' : img.file.filename
      const image_path = '/src/renderer/public/images/products/' + image_name

      const req = {
        sub_category_id: subCatId,
        product_name: productName,
        image_path: image_path,
        created_by: userInfo.username,
        unit_id: unitValue
      }

      const res = await registerProduct(req).unwrap()

      if (res) {
        toast.success(res.message)
        setFileList([])
        setUnitValue(null)
        setSubCatId(null)
        setProductName('')
        img = null
        formData.delete('file')
        setIsOpen(false)
      }

      return onSubmitChange(true)
    } catch (error) {
      toast.error(error)
    }
  }

  if (!isOpen) {
    return null
  }

  //handleEdit
  const handleEditProduct = () => {
    setIsEdit(true)
  }

  //handlebarcode
  const handleBarcode = () => {
    setIsOpenBarcode(true)
  }

  return (
    <>
      {!isNew ? (
        <div style={{ height: 300, width: 250, marginBottom: 100 }}>
          <Card
            key={product.product_id}
            hoverable
            className="product-card"
            cover={
              <img
                src={__dirname + product.image_path}
                style={{
                  height: 250,
                  maxHeight: 300,
                  maxWidth: 250,
                  padding: '2%',
                  borderBottomLeftRadius: '6%',
                  borderBottomRightRadius: '6%'
                }}
              ></img>
            }
          >
            <div className="meta-class">
              <Divider style={{ margin: '8px 0' }}></Divider>
              <div className="meta-container">
                <Meta
                  className="product-meta"
                  title={product_title}
                  description={product_description}
                />
                <Divider style={{ margin: '8px 0' }}></Divider>
              </div>
              <div className="card-buttons">
                <Button
                  className="edit-button"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEditProduct}
                >
                  Edit Product
                </Button>
                <Button
                  className="barcode-button"
                  type="primary"
                  icon={<BarcodeOutlined />}
                  onClick={handleBarcode}
                >
                  Barcode
                </Button>
                {isOpenBarcode ? (
                  <BarcodeModal
                    isOpen={isOpenBarcode}
                    product={product}
                    handleOpenModal={setIsOpenBarcode}
                  ></BarcodeModal>
                ) : null}
              </div>
              {isEdit ? (
                <CreateProduct
                  isOpen={isEdit}
                  product={product}
                  onSubmitEdit={setIsEdited}
                ></CreateProduct>
              ) : null}
            </div>
          </Card>
        </div>
      ) : (
        <div style={{ height: 300, width: 250 }}>
          <Card
            hoverable
            className="product-card"
            cover={
              <div className="card-upload-container">
                <Upload
                  customRequest={dummyRequest}
                  className="product-upload"
                  listType="picture-card"
                  fileList={fileList}
                  multiple={false}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  onRemove={handleRemove}
                  maxCount={1}
                >
                  {fileList.length < 1 && <PlusOutlined style={{ color: 'black' }} id="plus-ico" />}
                </Upload>
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
              </div>
            }
          >
            <div className="meta-class">
              <Divider style={{ margin: '3px 0' }}></Divider>
              <div className="meta-container">
                <Meta
                  className="product-meta"
                  title={
                    <div className="card-select-container">
                      <Select
                        placeholder="Category"
                        className="category-select"
                        value={subCatId}
                        onChange={(value) => setSubCatId(value)}
                      >
                        {categoryDataSource}
                      </Select>
                      <Select
                        showSearch
                        className="unit-select"
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
                                placeholder="Unit"
                                bordered
                                ref={inputRef}
                                value={newUnit}
                                onChange={onNameChange}
                                onKeyDown={(e) => e.stopPropagation()}
                              />
                              <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddUnit}
                              ></Button>
                            </Space>
                            {menu}
                          </>
                        )}
                        options={unitList}
                      ></Select>
                    </div>
                  }
                  description={
                    <Input
                      style={{ backgroundColor: 'gainsboro', width: 240 }}
                      placeholder="Enter product name"
                      onChange={(e) => setProductName(e.target.value)}
                    ></Input>
                  }
                />
                <Divider style={{ margin: '4px 0' }}></Divider>
              </div>
              <Button
                className="add-button"
                type="primary"
                onClick={handleAdd}
                icon={<PlusCircleOutlined />}
              >
                Add Product
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default ProductCard
