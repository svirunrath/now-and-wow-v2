import './ImportProduct.css'
import { HiMiniArchiveBoxArrowDown } from 'react-icons/hi2'
import { CommaFormatted, CurrencyFormatted } from '../../utils/NumberFormatterUtils.js'
import React, { useState, useRef, useContext, useEffect } from 'react'
import {
  Table,
  Tabs,
  Form,
  Button,
  Select,
  Input,
  Popconfirm,
  InputNumber,
  DatePicker,
  Typography,
  Modal
} from 'antd'
const { TabPane } = Tabs
import { useGetAllProductQuery } from '../../slices/productAPISlices.js'
import { toast } from 'react-toastify'
import {
  useLazyRetrieveImportHistoryQuery,
  useRegisterImportMutation,
  useRetrieveImportByIdQuery,
  useUpdateImportMutation
} from '../../slices/importAPISlices.js'
const { Option } = Select
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import BarcodeModal from '../../components/BarcodeModal.jsx'
dayjs.extend(customParseFormat)

const EditableContext = React.createContext(null)
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)
  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])
  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    })
  }
  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({
        ...record,
        ...values
      })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }
  let childNode = children
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`
          }
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }
  return <td {...restProps}>{childNode}</td>
}

const DetailEditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 1
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const ImportProduct = () => {
  //New Import Tab
  const [dataSource, setDataSource] = useState([])
  const [count, setCount] = useState(1)
  const { data, isLoading } = useGetAllProductQuery()
  const productData = []
  const [registerImport] = useRegisterImportMutation()
  let filteredProduct = []
  const [productValue, setProductValue] = useState([{ record_id: 0, product_id: '' }])
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

  if (!isLoading) {
    if (data) {
      filteredProduct = data.products

      // var filteredArray = filteredProduct.filter(function (array_el) {
      //   return (
      //     productValue.filter(function (anotherOne_el) {
      //       return anotherOne_el.product_id == array_el.product_id;
      //     }).length == 0
      //   );
      // });

      //data.products.filter((item) => item.record_id !== key);

      for (let i = 0; i < filteredProduct.length; i++) {
        productData.push(
          <Option key={filteredProduct[i].product_id} value={filteredProduct[i].product_id}>
            {filteredProduct[i].product_name}
          </Option>
        )
      }
    }
  }
  const importColumn = [
    {
      title: 'Nº',
      dataIndex: 'key',
      rowScope: 'row'
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      width: '200px',
      render: (_, record) => {
        return (
          <Select
            showSearch
            placeholder="Select a product"
            allowClear
            onChange={(value) => handleProductChange(record, value)}
          >
            {productData}
          </Select>
        )
      }
    },
    {
      title: 'Product Id',
      dataIndex: 'product_id',
      hidden: true
    },
    {
      title: 'Unit Id',
      dataIndex: 'unit_id',
      hidden: true
    },
    {
      title: 'Unit Name',
      dataIndex: 'unit_name',
      width: '150px'
    },
    {
      title: 'Import Quantity',
      dataIndex: 'import_qty',
      width: '150px',
      editable: true
    },
    {
      title: 'Import Unit Price',
      dataIndex: 'product_import_price',
      width: '150px',
      editable: true
    },
    {
      title: 'Tax Price',
      dataIndex: 'tax_amt',
      width: '150px',
      editable: true
    },
    {
      title: 'Shipping Fee',
      dataIndex: 'shipping_fee',
      width: '150px',
      editable: true
    },
    {
      title: 'Import Total Price',
      dataIndex: 'import_price',
      width: '150px',
      render: (_, record) => {
        return (
          <InputNumber
            className="total-price-input"
            disabled
            value={Number(
              record.import_qty *
                (Number(record.product_import_price) +
                  Number(record.shipping_fee) +
                  Number(record.tax_amt))
            )}
          ></InputNumber>
        )
      }
    },
    {
      title: 'Sell Unit Price',
      dataIndex: 'product_sell_price',
      width: '150px',
      editable: true
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => {
        return (
          <span>
            <Popconfirm
              title="Are you sure you want to delete?"
              onConfirm={() => handleDeleteRow(record.key)}
            >
              <a>Delete</a>
            </Popconfirm>
          </span>
        )
      }
    }
  ].filter((importColumn) => !importColumn.hidden)

  const handleDeleteRow = (key) => {
    const newData = dataSource.filter((item) => item.key !== key)
    const productvalue = productValue.filter((item) => item.record_id !== key)
    setDataSource(newData)
    setProductValue(productvalue)
    setCount(count - 1)
  }

  const handleProductChange = (record, value) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => record.key === item.key)
    const productIndex = filteredProduct.findIndex((item) => item.product_id === value)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...record
    })
    newData[index].product_id = value
    newData[index].unit_id = filteredProduct[productIndex].unit_id
    newData[index].unit_name = filteredProduct[productIndex].unit_name

    setDataSource(newData)

    if (count > productValue.length) {
      productValue.push({
        record_id: record.key,
        product_id: value
      })
    }

    // for (let i = 1; i < productValue.length; i++) {
    //   if (record.key == productValue[i].record_id) {
    //     productValue[i].product_id = value;
    //   }

    //   filteredProduct.push(productValue[i].product_id);
    // }
  }

  const handleAddProduct = () => {
    if (count <= productValue.length) {
      const newData = {
        key: count,
        import_qty: 1,
        product_id: null,
        unit_id: null,
        product_import_price: 0.0,
        tax_amt: 0.0,
        shipping_fee: 0.0,
        import_price: 0.0,
        product_sell_price: 0.0
      }
      setDataSource([...dataSource, newData])
      setCount(count + 1)
    } else {
      toast.error('Please input all the required fields in the above row.')
    }
  }

  const handleSave = (row) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...row
    })
    newData[index].import_price = item.import_qty * item.product_import_price
    setDataSource(newData)
  }

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  }
  const columns = importColumn.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave
      })
    }
  })

  const handleSubmit = async () => {
    if (dataSource.length == 0) {
      toast.error('No product in the import list.')
    } else {
      const inputData = {}

      inputData.created_by = userInfo.username
      inputData.import_detail = dataSource

      dataSource.map((data) => {
        if (data.product_import_price == 0) {
          toast.error('Please set import price.')
        }

        if (data.product_sell_price == 0) {
          toast.error('Please set sell price.')
        }
      })

      const res = await registerImport(inputData).unwrap()

      if (res) {
        setDataSource([])
        setCount(1)
        setProductValue([{ record_id: 0, product_id: '' }])
        toast.success(res.message)
      }
    }
  }

  //Render New Import Tab
  const newImportTab = [
    <>
      <Button type="primary" onClick={handleAddProduct} className="btn-add-product">
        Add New Product
      </Button>
      <Table
        columns={columns}
        dataSource={dataSource}
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
      ></Table>
      <div className="import-button-wrapper">
        <Button type="primary" className="btn-save-import" htmlType="submit">
          Save
        </Button>
        <Button type="primary" className="btn-back">
          Back
        </Button>
      </div>
    </>
  ]

  //Import History Tab
  var longToday = new Date()
  var today =
    longToday.getFullYear() +
    '/' +
    ('0' + (longToday.getMonth() + 1)).slice(-2) +
    '/' +
    ('0' + longToday.getDate()).slice(-2)

  const { RangePicker } = DatePicker
  const [dates, setDates] = useState([dayjs(today, 'YYYY-MM-DD'), dayjs(today, 'YYYY-MM-DD')])
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [expandedKey, setExpandedKey] = useState(null)
  const [importId, setImportId] = useState(null)
  const [updateImportInfo] = useUpdateImportMutation()
  const [trigger] = useLazyRetrieveImportHistoryQuery()
  const [historyDataSource, setHistoryDataSource] = useState([])
  const {
    data: detailData,
    isLoading: isDetailLoading,
    refetch: refetchDetailById
  } = useRetrieveImportByIdQuery({ import_id: importId }, { skip: importId === undefined })
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [detailForm] = Form.useForm()

  const historyColumn = [
    {
      title: 'Nº',
      dataIndex: 'key',
      rowScope: 'row'
    },
    { title: 'Date', width: '400px', dataIndex: 'import_date' },
    {
      dataIndex: 'import_id',
      hidden: true
    },
    {
      title: 'Number of Products',
      dataIndex: 'product_count',
      width: '400px',
      sorter: (a, b) => a.product_count - b.product_count
    },
    {
      title: 'Total Import Price',
      dataIndex: 'import_price',
      width: '400px',
      sorter: (a, b) => a.import_price - b.import_price
    }
  ].filter((historyColumn) => !historyColumn.hidden)

  const onExpand = (_, key) => {
    setExpandedKey((prev) => {
      const newKey = key.key
      if (prev !== newKey) {
        return newKey
      }
      return null
    })
  }

  const handleRangeChange = (value, dateStrings) => {
    setStartDate(dateStrings[0])
    setEndDate(dateStrings[1])
    setDates(value)
  }

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.error('Please choose start date and end date.')
    }

    let tempDatasource = []
    const { data: historyData, isLoading: isHistoryLoading } = await trigger({
      startDate: startDate,
      endDate: endDate
    })

    if (!isHistoryLoading) {
      if (historyData.import_history.length == 0) {
        toast.error('There is no data.')
      }

      for (let i = 0; i < historyData.import_history.length; i++) {
        const importDate = new Date(historyData.import_history[i].import_date)
        const date = importDate.toLocaleDateString('en-GB')

        tempDatasource.push({
          key: i + 1,
          import_date: date,
          import_id: historyData.import_history[i].import_id,
          product_count: historyData.import_history[i].product_count,
          import_price:
            '$ ' + CommaFormatted(CurrencyFormatted(historyData.import_history[i].import_price))
        })
      }

      setHistoryDataSource(tempDatasource)
    }
  }
  //Import Detail
  const [detailEditingKey, setDetailEditingKey] = useState('')
  const isDetailEditing = (record) => record.key === detailEditingKey

  const onExpandedRowRender = (record) => {
    //Import Detail
    let importDetailDataSource = []

    if (record.key == expandedKey) {
      setImportId(record.import_id)

      refetchDetailById({ import_id: importId })

      if (!isDetailLoading && detailData) {
        for (var i = 0; i < detailData.import_detail.length; i++) {
          importDetailDataSource.push({
            key: i + 1,
            import_id: record.import_id,
            product_id: detailData.import_detail[i].product_id,
            product_name: detailData.import_detail[i].product_name,
            sub_category_id: detailData.import_detail[i].sub_category_id,
            sub_category_name: detailData.import_detail[i].sub_category_name,
            import_qty: detailData.import_detail[i].import_qty,
            unit_id: detailData.import_detail[i].unit_id,
            unit_name: detailData.import_detail[i].unit_name,
            shipping_fee:
              '$ ' + CommaFormatted(CurrencyFormatted(detailData.import_detail[i].shipping_fee)),
            tax_amt: '$ ' + CommaFormatted(CurrencyFormatted(detailData.import_detail[i].tax_amt)),
            product_import_price:
              '$ ' +
              CommaFormatted(CurrencyFormatted(detailData.import_detail[i].product_import_price)),
            product_sell_price:
              '$ ' +
              CommaFormatted(CurrencyFormatted(detailData.import_detail[i].product_sell_price))
          })
        }
      }
    }

    const importDetailColumns = [
      {
        title: 'Nº',
        dataIndex: 'key',
        rowScope: 'row'
      },
      {
        title: 'Import Id',
        dataIndex: 'import_id',
        hidden: true
      },
      {
        title: 'Product Id',
        dataIndex: 'product_id',
        hidden: true
      },
      {
        title: 'Product Name',
        dataIndex: 'product_name'
      },
      {
        title: 'Category Id',
        dataIndex: 'sub_category_id',
        hidden: true
      },
      {
        title: 'Category Name',
        dataIndex: 'sub_category_name'
      },
      {
        title: 'Unit Id',
        dataIndex: 'unit_id',
        hidden: true
      },
      {
        title: 'Unit Name',
        dataIndex: 'unit_name'
      },
      {
        title: 'Import Quantity',
        dataIndex: 'import_qty',
        editable: true,
        sorter: (a, b) => a.import_qty - b.import_qty
      },
      {
        title: 'Unit Price',
        dataIndex: 'product_import_price',
        editable: true,
        sorter: (a, b) => a.product_import_price - b.product_import_price
      },
      {
        title: 'Tax Price',
        dataIndex: 'tax_amt',
        editable: true,
        sorter: (a, b) => a.tax_amt - b.tax_amt
      },
      {
        title: 'Shipping Fee',
        dataIndex: 'shipping_fee',
        editable: true,
        sorter: (a, b) => a.shipping_fee - b.shipping_fee
      },
      {
        title: 'Sell Price',
        dataIndex: 'product_sell_price',
        editable: true,
        sorter: (a, b) => a.product_sell_price - b.product_sell_price
      },
      {
        title: 'Action',
        dataIndex: 'action',
        render: (_, record) => {
          const editable = isDetailEditing(record)
          return editable ? (
            <span>
              <Typography.Link
                onClick={() => handleSaveDetail(record)}
                style={{
                  marginRight: 8
                }}
              >
                Save
              </Typography.Link>
              <Popconfirm title="Are you sure you want to cancel?" onConfirm={handleDetailCancel}>
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <span>
              <Typography.Link
                disabled={detailEditingKey !== ''}
                onClick={() => handleDetailEdit(record)}
              >
                Edit
              </Typography.Link>
              <Typography.Link
                disabled={detailEditingKey !== ''}
                onClick={handleBarcode}
                style={{
                  marginLeft: 20
                }}
              >
                Barcode
              </Typography.Link>
              {isOpenModal /* Handle Modal */ ? (
                <BarcodeModal
                  isOpen={isOpenModal}
                  product={{
                    product_name: record.product_name,
                    product_id: record.product_id
                  }}
                  product_sell_price={record.product_sell_price}
                  handleOpenModal={setIsOpenModal}
                ></BarcodeModal>
              ) : null}
            </span>
          )
        }
      }
    ].filter((importDetailColumns) => !importDetailColumns.hidden)

    const handleBarcode = () => {
      setIsOpenModal(true)
    }

    const detailColumns = importDetailColumns.map((col) => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: ['import_qty', 'product_import_price', 'product_sell_price'].includes(
            col.dataIndex
          )
            ? 'number'
            : 'text',
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isDetailEditing(record),
          handleSave
        })
      }
    })

    const handleDetailEdit = (record) => {
      detailForm.setFieldsValue({
        import_qty: '',
        product_import_price: '',
        product_sell_price: '',
        ...record
      })
      setDetailEditingKey(record.key)
    }

    const detailComponents = {
      body: {
        cell: DetailEditableCell
      }
    }

    const handleDetailCancel = () => {
      setDetailEditingKey('')
    }

    const handleSaveDetail = async (record) => {
      const row = await detailForm.validateFields()

      const req = {
        import_qty: row.import_qty ? row.import_qty : 0,
        product_import_price: row.product_import_price ? row.product_import_price : 0.0,
        modified_by: userInfo.username,
        product_sell_price: row.product_sell_price ? row.product_sell_price : 0.0,
        import_id: record.import_id,
        product_id: record.product_id,
        old_price: record.product_sell_price,
        old_qty: row.import_qty - record.import_qty,
        shipping_fee: row.shipping_fee ? row.shipping_fee : 0.0,
        tax_amt: row.tax_amt ? row.tax_amt : 0.0
      }

      const res = await updateImportInfo(req).unwrap()

      toast.success(res.message)

      setDetailEditingKey('')
      setExpandedKey('')
      setImportId(null)
      importDetailDataSource = []
      setHistoryDataSource([])

      let tempDatasource = []
      const { data: tempData, isLoading: tempIsLoading } = await trigger({
        startDate: startDate,
        endDate: endDate
      })

      if (!tempIsLoading) {
        if (tempData.import_history.length == 0) {
          toast.error('There is no data.')
        }

        for (let i = 0; i < tempData.import_history.length; i++) {
          const importDate = new Date(tempData.import_history[i].import_date)
          const date = importDate.toLocaleDateString('en-GB')

          tempDatasource.push({
            key: i + 1,
            import_date: date,
            import_id: tempData.import_history[i].import_id,
            product_count: tempData.import_history[i].product_count,
            import_price: tempData.import_history[i].import_price
          })
        }

        setHistoryDataSource(tempDatasource)
      }
    }

    return !isDetailLoading ? (
      <Table
        id="tbl-import-detail"
        size="small"
        bordered
        columns={detailColumns}
        components={detailComponents}
        dataSource={importDetailDataSource}
        rowClassName="editable-row"
      />
    ) : (
      <p>Loading..</p>
    )
  }

  //Render Import History Tab
  const importHistoryTab = [
    <>
      <div className="import-inquiry-wrapper">
        <RangePicker
          className="import-range-picker"
          format="YYYY-MM-DD"
          value={dates}
          onChange={handleRangeChange}
        />
        <Button type="primary" className="btn-search" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <Form form={detailForm} component={false}>
        <Table
          columns={historyColumn}
          rowClassName={() => 'editable-row'}
          bordered
          expandable={{
            onExpand: onExpand,
            expandedRowKeys: [expandedKey],
            expandedRowRender: (record) => onExpandedRowRender(record)
          }}
          dataSource={historyDataSource}
        ></Table>
      </Form>
      <div className="import-button-wrapper">
        <Button type="primary" className="btn-back">
          Back
        </Button>
      </div>
    </>
  ]

  //Render Screen
  return (
    <>
      <div className="import-main-container">
        <header className="import-main-header">
          Import Product
          <div className="import-icon">
            <HiMiniArchiveBoxArrowDown></HiMiniArchiveBoxArrowDown>
          </div>
        </header>
        <Form style={{ maxWidth: 1200, padding: 25 }} onFinish={handleSubmit}>
          <div className="import-tabs-container">
            <Tabs className="import-tabs" defaultActiveKey="1">
              <TabPane key="New Import" tab="New Import" className="new-import-tab">
                {newImportTab}
              </TabPane>
              <TabPane key="Import History" tab="Import History" className="import-history-tab">
                {importHistoryTab}
              </TabPane>
            </Tabs>
          </div>
        </Form>
      </div>
    </>
  )
}

export default ImportProduct
