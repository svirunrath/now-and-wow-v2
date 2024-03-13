import { Select, Tabs, Card, Button, Carousel, Pagination } from "antd";
import "./ProductList.css";
import { useGetMainCategoryQuery } from "../../../slices/mainCategoryAPISlices";
import { useEffect, useState } from "react";
import {
  useGetSubCategoryByMainIdQuery,
  useGetSubCategoryQuery,
} from "../../../slices/subCategoryAPISlices";
import ProductCard from "../../../components/ProductCard.jsx";
import { useGetProductBySubIdQuery } from "../../../slices/productAPISlices";
const { Option } = Select;
import { PlusOutlined } from "@ant-design/icons";

const ProductList = () => {
  //Handle Main Category
  const {
    data: category_data,
    isLoading: category_isLoading,
    refetch: category_refetch,
  } = useGetMainCategoryQuery();
  const [mainId, setMainId] = useState("ALL");

  let main_category = [];

  if (!category_isLoading) {
    const response_main_category = category_data
      ? category_data.main_category
      : null;

    for (let i = 0; i < response_main_category.length; i++) {
      main_category.push(
        <Option
          key={response_main_category[i].category_id}
          value={response_main_category[i].category_id}
        >
          {response_main_category[i].category_name}
        </Option>
      );
    }
  }

  //Tab
  const { TabPane } = Tabs;
  const [subId, setSubId] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  let sub_category = [];
  let tabList = [];
  const {
    data: product_data,
    isLoading: product_isLoading,
    refetch: product_refetch,
  } = useGetProductBySubIdQuery(
    { sub_category_id: subId },
    { skip: subId === undefined }
  );

  //Pagnation
  const [itemCount, setItemCount] = useState(0);
  const numPerPage = 11;
  const [currentPage, setCurrentPage] = useState(1);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(numPerPage);

  if (mainId === "ALL") {
    const {
      data: sub_data,
      isLoading: sub_isLoading,
      refetch: sub_refetch,
    } = useGetSubCategoryQuery();

    if (!sub_isLoading) {
      sub_category = sub_data.sub_category;
    }
  } else {
    const {
      data: sub_data,
      isLoading: sub_isLoading,
      refetch: sub_refetch,
    } = useGetSubCategoryByMainIdQuery({ category_id: mainId });

    if (!sub_isLoading) {
      sub_category = sub_data.sub_category;
    }
  }

  let childrenList = [];

  if (sub_category.length > 0) {
    for (let i = 0; i < sub_category.length; i++) {
      tabList.push({
        key: sub_category[i].sub_category_id,
        label: sub_category[i].sub_category_name,
        children: childrenList,
      });
    }
  }

  if (!product_isLoading && product_data) {
    const products = product_data.products;
    for (let i = 0; i < products.length; i++)
      childrenList.push(
        <ProductCard
          isNew={false}
          product={products[i]}
          category_id={mainId}
          onSubmitChange={setIsFinish}
        ></ProductCard>
      );
  }

  const handleAddCard = () => {
    setIsNew(true);
  };

  useEffect(() => {
    setIsNew(false);
    setIsFinish(false);
    product_refetch({ subId });
  }, [isFinish]);

  useEffect(() => {
    setItemCount(childrenList.length);
  }, [childrenList]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(currentPage != pageNumber ? pageNumber : currentPage);
    setMinValue((pageNumber - 1) * numPerPage);
    setMaxValue(pageNumber * numPerPage);
  };

  return (
    <>
      <div className="product-list-main-container">
        <div className="product-list-main-header">
          <header>Products Management</header>
          <div className="main-category">
            <p>Main Category</p>
            <Select
              className="main-category-select"
              value={mainId}
              onChange={(value) => {
                setMainId(value);
                setIsNew(false);
              }}
            >
              <Option key="ALL" value="ALL">
                All
              </Option>
              {main_category ? main_category : null}
            </Select>
          </div>
        </div>
        <div className="product-tab-main-container">
          <Tabs
            activeKey={subId}
            onChange={(tab) => {
              setSubId(tab);
              setIsNew(false);
            }}
            className="product-tabs"
          >
            {tabList.length > 0
              ? tabList.map((tab) => {
                  const { key, label, children } = tab;
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
                                    overflow: "hidden",
                                    height: "390px",
                                    width: "250px",
                                  }}
                                >
                                  <Button
                                    className="button-card"
                                    onClick={handleAddCard}
                                  >
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
                          onChange={(pageNumber) =>
                            handlePageChange(pageNumber)
                          }
                          total={itemCount} //total number of card data available
                        />
                      </div>
                    </TabPane>
                  );
                })
              : null}
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default ProductList;
