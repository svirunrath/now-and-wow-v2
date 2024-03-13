import React from "react";
import { Table } from "antd";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Typography,
  Button,
  Select,
} from "antd";
import "./Category.css";
import { MdInventory } from "react-icons/md";
import {
  useDeleteMainCategoryMutation,
  useGetMainCategoryQuery,
  useRegisterMainCategoryMutation,
  useUpdateMainCategoryMutation,
} from "../../slices/mainCategoryAPISlices";
import {
  useDeleteSubCategoryMutation,
  useGetSubCategoryByMainIdQuery,
  useRegisterSubCategoryMutation,
  useUpdateSubCategoryMutation,
} from "../../slices/subCategoryAPISlices";
import { useNavigate } from "react-router-dom";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 1,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Category = () => {
  //main category columns
  const [form] = Form.useForm();
  const isEditing = (record) => record.key === editingKey;
  const [editingKey, setEditingKey] = useState("");
  const [registerMainCategory] = useRegisterMainCategoryMutation();
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const columns = [
    {
      title: "Category Id",
      dataIndex: "category_id",
      key: "category_id",
      hidden: true,
    },
    {
      title: "Main Category",
      dataIndex: "category_name",
      key: "category_name",
      width: "200px",
      editable: true,
    },
    {
      title: "Action",
      width: "200px",
      dataIndex: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => handleSaveMain(record)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm
              title="Are you sure you want to cancel?"
              onConfirm={handleMainCancel}
            >
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => handleMainEdit(record)}
            >
              Edit
            </Typography.Link>
            <Popconfirm
              title="Are you sure you want to to delete?"
              onConfirm={() => handleMainDelete(record)}
            >
              <Typography.Link
                disabled={editingKey !== ""}
                style={{ marginLeft: 10 }}
              >
                Delete
              </Typography.Link>
            </Popconfirm>
          </span>
        );
      },
    },
  ].filter((columns) => !columns.hidden);

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  //Main Category Data
  const { data, isLoading, refetch } = useGetMainCategoryQuery();
  const [updateMainCategory] = useUpdateMainCategoryMutation();
  const [deleteMainCategory] = useDeleteMainCategoryMutation();
  const originData = [];
  const mainChildren = []; 
  const [catName, setCatName] = useState("");

  if (!isLoading) {
    for (let i = 0; i < data.main_category.length; i++) {
      originData.push({
        key: data.main_category[i].category_id,
        category_id: data.main_category[i].category_id,
        category_name: data.main_category[i].category_name,
      });
      mainChildren.push(
        <Option
          key={data.main_category[i].category_id}
          value={data.main_category[i].category_id}
        >
          {data.main_category[i].category_name}
        </Option>
      );
    }
  }

  const handleMainEdit = (record) => {
    form.setFieldsValue({
      category_name: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const handleMainCancel = () => {
    setEditingKey("");
  };

  const handleSaveMain = async (record) => {
    try {
      const row = await form.validateFields();

      const req = {
        modified_by: userInfo.username,
        category_id: record.category_id,
        category_name: row.category_name,
      };

      if (!record.category_name) {
        toast.error("Category Name is required.");
      } else {
        const res = await updateMainCategory(req).unwrap();
        toast.success(res.message);
        setEditingKey("");
        refetch();
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleMainDelete = async (record) => {
    try {
      const req = {
        modified_by: userInfo.username,
        category_id: record.category_id,
      };

      const res = await deleteMainCategory(req).unwrap();
      toast.success(res.message);
      setEditingKey("");
      refetch();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleMainCategorySubmit = async (e) => {
    try {
      const req = {
        category_name: catName,
        modified_by: userInfo.username,
        created_by: userInfo.username,
      };

      const res = await registerMainCategory(req).unwrap();

      refetch();

      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  //Sub-Category Handler
  const [categoryId, setCategoryId] = useState(null);
  const [expandedKey, setExpandedKey] = useState(null);
  const [mainCatId, setMainCatId] = useState(null);
  const [subName, setSubName] = useState("");
  const [registerSubCategory] = useRegisterSubCategoryMutation();
  const isSubEditing = (record) => record.key === subEditingKey;
  const [subEditingKey, setSubEditingKey] = useState("");
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();

  const onExpand = (_, key) => {
    setExpandedKey((prev) => {
      const newKey = key.key;
      if (prev !== newKey) {
        return newKey;
      }
      return null;
    });
  };

  const {
    data: sub_category,
    isLoading: isSubLoading,
    refetch: refetchSub,
  } = useGetSubCategoryByMainIdQuery(
    { category_id: categoryId },
    { skip: categoryId === undefined }
  );

  //Expandable Sub Category
  const onExpandedRowRender = (record) => {
    const subData = [];
    if (record.key == expandedKey) {
      setCategoryId(record.category_id);

      if (!isSubLoading) {
        for (let i = 0; i < sub_category.sub_category.length; i++) {
          subData.push({
            key: sub_category.sub_category[i].sub_category_id,
            sub_category_name: sub_category.sub_category[i].sub_category_name,
          });
        }
      }
    }

    const subcolumns = [
      {
        title: "Sub Category Id",
        dataIndex: "sub_category_id",
        key: "sub_category_id",
        hidden: true,
      },
      {
        title: "Sub Category",
        dataIndex: "sub_category_name",
        key: "sub_category_name",
        width: "200px",
        editable: true,
      },
      {
        title: "Action",
        width: "200px",
        dataIndex: "action",
        render: (_, record) => {
          const editable = isSubEditing(record);
          return editable ? (
            <span>
              <Typography.Link
                onClick={() => handleSaveSub(record)}
                style={{
                  marginRight: 8,
                }}
              >
                Save
              </Typography.Link>
              <Popconfirm
                title="Are you sure you want to cancel?"
                onConfirm={handleSubCancel}
              >
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <span>
              <Typography.Link
                disabled={subEditingKey !== ""}
                onClick={() => handleSubEdit(record)}
              >
                Edit
              </Typography.Link>
              <Popconfirm
                title="Are you sure you want to to delete?"
                onConfirm={() => handleSubDelete(record)}
              >
                <Typography.Link
                  disabled={editingKey !== ""}
                  style={{ marginLeft: 10 }}
                >
                  Delete
                </Typography.Link>
              </Popconfirm>
            </span>
          );
        },
      },
    ].filter((subcolumns) => !subcolumns.hidden);

    const mergedSubColumns = subcolumns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isSubEditing(record),
        }),
      };
    });

    const handleSubEdit = (record) => {
      form.setFieldsValue({
        sub_category_name: "",
        ...record,
      });
      setSubEditingKey(record.key);
    };

    const handleSaveSub = async (record) => {
      const row = await form.validateFields();

      const req = {
        modified_by: userInfo.username,
        sub_category_id: record.key,
        sub_category_name: row.sub_category_name,
      };

      if (!record.sub_category_name) {
        toast.error("Category Name is required.");
      } else {
        const res = await updateSubCategory(req).unwrap();

        toast.success(res.message);

        setSubEditingKey("");
        setExpandedKey("");
        refetchSub({ category_id: mainCatId });
      }
    };

    const handleSubCancel = () => {
      setSubEditingKey("");
    };

    const handleSubDelete = async (record) => {
      try {
        const req = {
          modified_by: userInfo.username,
          sub_category_id: record.key,
        };

        const res = await deleteSubCategory(req).unwrap();
        toast.success(res.message);
        setSubEditingKey("");
        setExpandedKey("");
        refetchSub({ category_id: mainCatId });
      } catch (error) {
        toast.error(error);
      }
    };

    return !isSubLoading ? (
      <Table
        showHeader={false}
        id="subCategoryTbl"
        bordered
        columns={mergedSubColumns}
        dataSource={subData}
        rowClassName="editable-row"
        pagination={false}
        // pagination={{
        //   defaultPageSize: 5,
        //   total: {},
        //   simple: true,
        // }}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
      />
    ) : (
      <p>Loading...</p>
    );
  };

  const handleSubCategorySubmit = async (e) => {
    try {
      const req = {
        sub_category_name: subName,
        category_id: mainCatId,
        created_by: userInfo.username,
        modified_by: userInfo.username,
      };

      const res = await registerSubCategory(req).unwrap();

      setExpandedKey("");
      refetchSub({ category_id: mainCatId });

      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  //Back Handler
  const navigate = useNavigate();
  const backHandler = () => {
    navigate("/");
  };
  //Render
  return (
    <div className="categoryMainContainer">
      <header className="categoryMainHeader">
        Category <MdInventory></MdInventory>
      </header>
      <p>This page will be used to add main category and sub-category</p>
      <div className="FormFlex">
        <div className="category-main-block">
          <Form
            style={{ maxWidth: 800, padding: 25 }}
            onFinish={handleMainCategorySubmit}
          >
            <Form.Item>
              <p>Main Category Information</p>
            </Form.Item>
            <Form.Item label="Main Category" name="main-Category">
              <div className="main-cat-wrapper">
                <Input onChange={(e) => setCatName(e.target.value)}></Input>
              </div>
            </Form.Item>
            <Form.Item className="buttonContainer">
              <Button
                type="primary"
                className="btnMainCatSave"
                htmlType="submit"
              >
                Add Main Category
              </Button>
            </Form.Item>
          </Form>
          <Form
            style={{ maxWidth: 800, padding: 25 }}
            onFinish={handleSubCategorySubmit}
          >
            <Form.Item>
              <p>Sub Category Information</p>
            </Form.Item>
            <Form.Item label="Main Category" name="main-Category">
              <div className="main-category-wrapper">
                <Select
                  showSearch
                  placeholder="Select a main category"
                  allowClear
                  optionFilterProp="children"
                  onChange={(value) => setMainCatId(value)}
                >
                  {mainChildren}
                </Select>
              </div>
            </Form.Item>
            <Form.Item label="Sub Category" name="main-Category">
              <div className="main-cat-wrapper">
                <Input onChange={(e) => setSubName(e.target.value)}></Input>
              </div>
            </Form.Item>
            <Form.Item className="buttonContainer">
              <Button
                type="primary"
                className="btnSubCatSave"
                htmlType="submit"
              >
                Add Sub Category
              </Button>
              <Button type="primary" className="btnBack" onClick={backHandler}>
                Back
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="product-table">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <Form form={form} component={false}>
              <Table
                bordered
                dataSource={originData}
                columns={mergedColumns}
                rowClassName="editable-row"
                expandable={{
                  expandedRowRender: (record) => onExpandedRowRender(record),
                  onExpand: onExpand,
                  expandedRowKeys: [expandedKey],
                }}
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                pagination={{
                  defaultPageSize: 10,
                  total: {},
                  simple: true,
                }}
              />
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;
