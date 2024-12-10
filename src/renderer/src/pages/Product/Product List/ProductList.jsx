import { Select, Tabs, Card, Button, Carousel, Pagination, Input } from 'antd'
import './ProductList.css'
import { useGetMainCategoryQuery } from '../../../slices/mainCategoryAPISlices'
import { useEffect, useState } from 'react'
import {
  useGetSubCategoryByMainIdQuery,
  useGetSubCategoryQuery
} from '../../../slices/subCategoryAPISlices'
import ProductCard from '../../../components/ProductCard.jsx'
import { useGetProductBySubIdQuery } from '../../../slices/productAPISlices'
const { Option } = Select
import { PlusOutlined } from '@ant-design/icons'

const ProductList = () => {
  //Handle Main Category
  const {
    data: category_data,
    isLoading: category_isLoading,
    refetch: category_refetch
  } = useGetMainCategoryQuery()
  const [mainId, setMainId] = useState('ALL')
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

  //Tab
  const { TabPane } = Tabs
  const [subId, setSubId] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [isFinish, setIsFinish] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [productSearchQuery, setProductSearchQuery] = useState('')

  const { data: subCategoryData, isLoading: subCategoryLoading } =
    mainId === 'ALL'
      ? useGetSubCategoryQuery()
      : useGetSubCategoryByMainIdQuery({ category_id: mainId })

  const {
    data: productData,
    isLoading: productLoading,
    refetch: productRefetch
  } = useGetProductBySubIdQuery({ sub_category_id: subId }, { skip: !subId })

  //Pagnation
  const [itemCount, setItemCount] = useState(0)
  const numPerPage = 11
  const [currentPage, setCurrentPage] = useState(1)
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(numPerPage)

  const filteredSubCategories =
    !subCategoryLoading && subCategoryData
      ? subCategoryData.sub_category.filter((sub) =>
          sub.sub_category_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : []

  const filteredProducts =
    !productLoading && productData
      ? productData.products.filter((product) =>
          product.product_name.toLowerCase().includes(productSearchQuery.toLowerCase())
        )
      : []

  let childrenList =
    filteredProducts.length > 0
      ? filteredProducts.map((product) => (
          <ProductCard
            key={product.product_id}
            isNew={false}
            product={product}
            category_id={mainId}
            onSubmitChange={setIsFinish}
          />
        ))
      : []

  const tabList = filteredSubCategories.map((sub) => ({
    key: sub.sub_category_id,
    label: sub.sub_category_name,
    children: childrenList // will be populated with products
  }))

  // if (!product_isLoading && product_data) {
  //   const products = product_data.products
  //   for (let i = 0; i < products.length; i++)
  //     childrenList.push(
  //       <ProductCard
  //         isNew={false}
  //         product={products[i]}
  //         category_id={mainId}
  //         onSubmitChange={setIsFinish}
  //       ></ProductCard>
  //     )
  // }

  const handleAddCard = () => {
    setIsNew(true)
  }

  useEffect(() => {
    setIsNew(false)
    setIsFinish(false)
    if (isFinish) productRefetch({ subId })
  }, [isFinish])

  useEffect(() => {
    setItemCount(childrenList.length)
  }, [childrenList])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(currentPage != pageNumber ? pageNumber : currentPage)
    setMinValue((pageNumber - 1) * numPerPage)
    setMaxValue(pageNumber * numPerPage)
  }

  return (
    <>
      <div className="product-list-main-container">
        <div className="product-list-main-header">
          <header style={{ fontSize: '24px', width: '30%' }}>Products Management</header>
        </div>

        <div className="main-category">
          <p>Main Category</p>
          <Select
            className="main-category-select"
            value={mainId}
            onChange={(value) => {
              setMainId(value)
              setIsNew(false)
            }}
          >
            <Option key="ALL" value="ALL">
              All
            </Option>
            {main_category ? main_category : null}
          </Select>
          <p>Search Sub-Category</p>
          <Input
            className="main-category-select"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Sub-Category"
          ></Input>
          <p>Search Product</p>
          <Input
            className="main-category-select"
            value={productSearchQuery}
            onChange={(e) => setProductSearchQuery(e.target.value)}
            placeholder="Enter Product Name"
          ></Input>
        </div>
        <div className="product-tab-main-container">
          <Tabs
            activeKey={subId}
            onChange={(tab) => {
              setSubId(tab)
              setIsNew(false)
            }}
            className="product-tabs"
          >
            {tabList.length > 0
              ? tabList.map((tab) => {
                  const { key, label, children } = tab
                  return (
                    <TabPane key={key} tab={label}>
                      <div className="product-card-list-page">
                        <div className="product-card-list">
                          {isNew ? (
                            <ProductCard
                              isNew={isNew}
                              category_id={mainId}
                              sub_category_id={subId ? subId : null}
                              onSubmitChange={setIsFinish}
                            ></ProductCard>
                          ) : (
                            <Card
                              className="new-product-card"
                              cover={
                                <div
                                  style={{
                                    overflow: 'hidden',
                                    height: '390px',
                                    width: '250px'
                                  }}
                                >
                                  <Button className="button-card" onClick={handleAddCard}>
                                    <PlusOutlined></PlusOutlined>
                                    Add New Product
                                  </Button>
                                </div>
                              }
                            ></Card>
                          )}
                          {children ? children.slice(minValue, maxValue) : null}
                        </div>
                        <Pagination
                          className="product-pagination"
                          current={currentPage}
                          defaultPageSize={numPerPage} //default size of page
                          onChange={(pageNumber) => handlePageChange(pageNumber)}
                          total={itemCount} //total number of card data available
                        />
                      </div>
                    </TabPane>
                  )
                })
              : null}
          </Tabs>
        </div>
      </div>
    </>
  )
}

const searchTypeData = [
  { key: 'pro', value: 'pro', label: 'Product' },
  { key: 'cat', value: 'cat', label: 'Sub-Category' }
]

export default ProductList
