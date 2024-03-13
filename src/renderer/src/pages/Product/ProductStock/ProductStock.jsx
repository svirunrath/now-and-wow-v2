import { useEffect, useState } from "react";
import { useGetMainCategoryQuery } from "../../../slices/mainCategoryAPISlices";
import "./ProductStock.css";
import { Select, Tabs, Table } from "antd";
import {
  useGetSubCategoryByMainIdQuery,
  useGetSubCategoryQuery,
} from "../../../slices/subCategoryAPISlices";
import {
  useGetStockItemBySubIdQuery,
  useGetStockDetailByProductIdQuery,
} from "../../../slices/stockSlices";
const { Option } = Select;

const ProductStock = () => {
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
  const [subId, setSubId] = useState(0);
  let sub_category = [];
  let tabList = [];
  const {
    data: stockItemData,
    isLoading: stockItemIsLoading,
    refetch: stockItemRefetch,
  } = useGetStockItemBySubIdQuery(
    { sub_category_id: subId, category_id: mainId },
    { skip: subId === undefined }
  );

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
  //Handle Table
  let stockDataSource = [];
  const stockMasterColumn = [
    {
      title: "Nº",
      dataIndex: "key",
      rowScope: "row",
    },
    {
      title: "Product Id",
      dataIndex: "product_id",
      hidden: true,
    },
    {
      title: "Product Name",
      dataIndex: "product_name",
    },
    {
      title: "Sub Category Id",
      dataIndex: "sub_category_id",
      hidden: true,
    },
    {
      title: "Category Name",
      dataIndex: "sub_category_name",
    },
    {
      title: "Unit Id",
      dataIndex: "unit_id",
      hidden: true,
    },
    {
      title: "Unit Name",
      dataIndex: "unit_name",
    },
    {
      title: "Stock Quantity",
      dataIndex: "product_qty",
    },
    {
      title: "Total Sell Price",
      dataIndex: "total_sell_price",
    },
  ].filter((stockMasterColumn) => !stockMasterColumn.hidden);

  if (stockItemData && !stockItemIsLoading) {
    for (let i = 0; i < stockItemData.stock_items.length; i++) {
      let total_sell_price = Number(
        stockItemData.stock_items[i].total_sell_price
      );

      stockDataSource.push({
        key: i + 1,
        product_id: stockItemData.stock_items[i].product_id,
        product_name: stockItemData.stock_items[i].product_name,
        sub_category_id: stockItemData.stock_items[i].sub_category_id,
        sub_category_name: stockItemData.stock_items[i].sub_category_name,
        unit_id: stockItemData.stock_items[i].unit_id,
        unit_name: stockItemData.stock_items[i].unit_name,
        product_qty: stockItemData.stock_items[i].product_qty,
        total_sell_price: "$ " + total_sell_price.toFixed(2),
      });
    }
  }

  if (sub_category.length > 0) {
    tabList.push({
      key: 0,
      label: "All",
    });

    for (let i = 0; i < sub_category.length; i++) {
      tabList.push({
        key: sub_category[i].sub_category_id,
        label: sub_category[i].sub_category_name,
      });
    }
  }

  //Expanded Key
  const [expandedKey, setExpandedKey] = useState(null);
  const [productId, setProductId] = useState(null);
  const {
    data: stockDetailData,
    isLoading: stockDetailIsLoading,
    refetch: stockDetailRefetch,
  } = useGetStockDetailByProductIdQuery(
    { product_id: productId },
    { skip: productId == undefined }
  );

  const onExpand = (_, key) => {
    setExpandedKey((prev) => {
      const newKey = key.key;
      if (prev !== newKey) {
        setProductId(null);
        return newKey;
      }
      return null;
    });
  };

  const onExpandedRowRender = (record) => {
    //Import Detail
    let stockDetailDataSource = [];

    if (record.key == expandedKey) {
      setProductId(record.product_id);

      // stockDetailRefetch({ product_id: productId });

      if (!stockDetailIsLoading && stockDetailData) {
        let stock_details = stockDetailData.stock_items;

        for (let i = 0; i < stock_details.length; i++) {
          let product_sell_price = Number(stock_details[i].product_sell_price);
          let total_product_price = Number(
            stock_details[i].total_product_price
          );
          stockDetailDataSource.push({
            key: i + 1,
            product_id: stock_details[i].product_id,
            product_name: stock_details[i].product_name,
            product_qty: stock_details[i].product_qty,
            price_id: stock_details[i].price_id,
            product_sell_price: "$ " + product_sell_price.toFixed(2),
            total_product_price: "$ " + total_product_price.toFixed(2),
          });
        }
      }
    }

    const stockDetailColumns = [
      {
        title: "Nº",
        dataIndex: "key",
        rowScope: "row",
      },
      {
        title: "Product Id",
        dataIndex: "product_id",
        hidden: true,
      },
      {
        title: "Product Name",
        dataIndex: "product_name",
      },
      {
        title: "Stock Quantity",
        dataIndex: "product_qty",
      },
      {
        title: "Price Id",
        dataIndex: "price_id",
        hidden: true,
      },
      {
        title: "Unit Sell Price",
        dataIndex: "product_sell_price",
      },
      {
        title: "Total Sell Price",
        dataIndex: "total_product_price",
      },
    ].filter((stockDetailColumns) => !stockDetailColumns.hidden);

    return !stockDetailIsLoading ? (
      <Table
        size="small"
        bordered
        columns={stockDetailColumns}
        dataSource={stockDetailDataSource}
      />
    ) : (
      <p>Loading..</p>
    );
  };

  return (
    <>
      <div className="stock-main-container">
        <div className="stock-main-header">
          <header>Product Stock</header>
          <div className="stock-category">
            <p>Main Category</p>
            <Select
              className="main-category-select"
              value={mainId}
              onChange={(value) => {
                setMainId(value);
                stockDataSource = [];
                setSubId(0);
              }}
            >
              <Option key="ALL" value="ALL">
                All
              </Option>
              {main_category ? main_category : null}
            </Select>
          </div>
        </div>
        <div className="stock-tab-main-container">
          <Tabs
            activeKey={subId}
            onChange={(tab) => {
              stockDataSource = [];
              setSubId(tab);
            }}
            className="product-tabs"
          >
            {tabList.length > 0
              ? tabList.map((tab) => {
                  const { key, label } = tab;
                  return (
                    <TabPane key={key} tab={label}>
                      <Table
                        columns={stockMasterColumn}
                        bordered
                        dataSource={stockDataSource}
                        expandable={{
                          onExpand: onExpand,
                          expandedRowKeys: [expandedKey],
                          expandedRowRender: (record) =>
                            onExpandedRowRender(record),
                        }}
                      ></Table>
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

export default ProductStock;
