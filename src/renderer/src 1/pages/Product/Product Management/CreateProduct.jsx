import { BiSolidBox } from "react-icons/bi";
import { Form, Upload, Select, Input, Modal, Button, Table } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./CreateProduct.css";
import { useState } from "react";
import { useGetSubCategoryByMainIdQuery } from "../../../slices/subCategoryAPISlices";
import { useGetMainCategoryQuery } from "../../../slices/mainCategoryAPISlices";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const CreateProduct = () => {
  //Handle Category
  const mainChildren = [];

  const { Option } = Select;

  const [disabled, setDisabled] = useState(true);

  const [categoryId, setCategoryId] = useState(null);

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const getMainCategory = useGetMainCategoryQuery();

  if (getMainCategory.data) {
    for (let i = 0; i < getMainCategory.data.main_category.length; i++) {
      mainChildren.push(
        <Option
          key={getMainCategory.data.main_category[i].category_id}
          value={getMainCategory.data.main_category[i].category_id}
        >
          {getMainCategory.data.main_category[i].category_name}
        </Option>
      );
    }
  }

  //Sub-Category Handler
  const result = useGetSubCategoryByMainIdQuery(
    { category_id: categoryId },
    { skip: categoryId === undefined }
  );

  let subChildren = [];

  const handleMainChange = (value) => {
    if (value) {
      setCategoryId(value);
    }

    if (result.data) {
      setDisabled(false);
    }
  };

  if (result.data) {
    for (let i = 0; i < result.data.sub_category.length; i++) {
      subChildren.push(
        <Option
          key={result.data.sub_category[i].sub_category_id}
          value={result.data.sub_category[i].sub_category_id}
        >
          {result.data.sub_category[i].sub_category_name}
        </Option>
      );
    }
  }

  //Image Handler
  const [previewOpen, setPreviewOpen] = useState(false);

  const [previewImage, setPreviewImage] = useState("");

  const [previewTitle, setPreviewTitle] = useState("");

  const [fileList, setFileList] = useState([]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  //Render
  return (
    <>
      <div className="createProductMainContainer">
        <header className="createProductMainHeader">
          Product Management
          <div className="createProductIcon">
            <BiSolidBox></BiSolidBox>
          </div>
        </header>
        <p className="page-description">
          This page will be used to manage your products.
        </p>
        <div className="FormFlex">
          <div className="product-main-block">
            <Form name="add-product" style={{ maxWidth: 800, padding: 25 }}>
              <Form.Item label="Product Name">
                <div className="pro-name-wrapper">
                  <Input></Input>
                </div>
              </Form.Item>
              <Form.Item label="Product Main Category">
                <div className="main-category-wrapper">
                  <Select
                    showSearch
                    placeholder="Select a main category"
                    optionFilterProp="children"
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
                    value={subChildren ? subChildren : null}
                  >
                    {subChildren ? subChildren : null}
                  </Select>
                </div>
              </Form.Item>
              <Form.Item label="Product Image">
                <div className="image-wrapper">
                  <Upload
                    action="/api/product/upload"
                    listType="picture-card"
                    fileList={fileList}
                    multiple={false}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    maxCount={1}
                    name="file"
                  >
                    {fileList.length >= 8 ? null : uploadButton}
                  </Upload>
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
                      width: "100%",
                    }}
                    src={previewImage}
                  />
                </Modal>
              </Form.Item>
              <Form.Item className="buttonContainer">
                <Button
                  type="primary"
                  className="btnProductSave"
                  htmlType="submit"
                >
                  Save
                </Button>
                <Button type="primary" className="btnProductDetail">
                  Product Detail
                </Button>
                <Button type="primary" className="btnBack">
                  Back
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className="product-table">
            <Table bordered rowClassName="editable-row" />
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProduct;
