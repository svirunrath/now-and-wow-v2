import './ImportReport.css'
import { HiMiniArchiveBoxArrowDown } from 'react-icons/hi2'
import { Table, Button, DatePicker, Popconfirm, Form, Input, InputNumber, Typography } from 'antd'
import {
  useLazyRetrieveImportQuery,
  useUpdateImportDetailMutation
} from '../../slices/importAPISlices.js'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const { RangePicker } = DatePicker
import { CommaFormatted, CurrencyFormatted } from '../../utils/NumberFormatterUtils.js'
import { Excel } from 'antd-table-saveas-excel'
import BarcodeModal from '../../components/BarcodeModal.jsx'

const editableCell = ({
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
            margin: 0
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

const ImportReport = () => {
  const [trigger] = useLazyRetrieveImportQuery()
  const [form] = Form.useForm()
  const [importDataSource, setImportDataSource] = useState([])
  const [dates, setDates] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [updateImportInfo] = useUpdateImportDetailMutation()
  const [editingKey, setEditingKey] = useState('')
  const isEditing = (record) => record.key === editingKey
  const navigate = useNavigate()
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [recordBarcode, setRecordBarcode] = useState('')

  const edit = (record) => {
    form.setFieldsValue({
      ...record
    })
    setEditingKey(record.key)
  }
  const cancel = () => {
    setEditingKey('')
  }

  const save = async (key, record) => {
    try {
      const row = await form.validateFields()
      const newData = [...importDataSource]
      const index = newData.findIndex((item) => key === item.key)

      let ttlImport =
        Number(row.product_import_price) +
        Number(row.shipping_fee) +
        Number(row.tax_amt) -
        Number(row.product_discount_price)
      let res = null
      row.product_unit_total_price = ttlImport
      const req = {
        import_qty: row.import_qty ? row.import_qty : 0,
        import_detail_id: record.import_detail_id,
        product_import_price: row.product_import_price
          ? Number(row.product_import_price).toFixed(2)
          : 0.0,
        created_by: userInfo.username,
        product_sell_price: row.product_sell_price
          ? Number(row.product_sell_price).toFixed(2)
          : 0.0,
        import_id: record.import_id,
        product_id: record.product_id,
        shipping_fee: row.shipping_fee ? Number(row.shipping_fee).toFixed(2) : 0.0,
        product_unit_total_price: ttlImport > 0 ? Number(ttlImport).toFixed(2) : 0.0,
        product_discount_price: row.product_discount_price
          ? Number(row.product_discount_price).toFixed(2)
          : 0.0,
        tax_amt: row.tax_amt ? Number(row.tax_amt).toFixed(2) : 0.0
      }

      res = await updateImportInfo(req).unwrap()

      if (res) {
        if (index > -1) {
          const item = newData[index]
          newData.splice(index, 1, {
            ...item,
            ...row
          })
          setImportDataSource(newData)
          setEditingKey('')
        } else {
          newData.push(row)
          setImportDataSource(newData)
          setEditingKey('')
        }
        toast.success(res.message)
      }
    } catch (errInfo) {
      toast.error(errInfo)
    }
  }

  const handleBarcode = (record) => {
    setIsOpenModal(true)
    setRecordBarcode(record)
  }

  const importReportColumn = [
    {
      title: 'Nº',
      dataIndex: 'key',
      rowScope: 'row'
    },
    {
      title: 'Import Date',
      dataIndex: 'import_date',
      render: (value) => {
        return new Date(value).toLocaleDateString('en-GB')
      },
      sorter: (a, b) => new Date(a.import_date) - new Date(b.import_date)
    },
    {
      title: 'Import Id',
      dataIndex: 'import_id',
      hidden: true
    },
    {
      title: 'Import Detail Id',
      dataIndex: 'import_detail_id',
      hidden: true
    },
    {
      title: 'Product Id',
      dataIndex: 'product_id',
      hidden: true
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
      sorter: (a, b) => a.product_name.localeCompare(b.product_name)
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
      sorter: (a, b) => a.import_qty - b.import_qty,
      editable: true,
      width: '150px'
    },
    {
      title: 'Unit Price',
      dataIndex: 'product_import_price',
      render: (value) => {
        return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
      },
      sorter: (a, b) => a.product_import_price - b.product_import_price,
      width: '120px',
      editable: true
    },
    {
      title: 'Tax Price',
      dataIndex: 'tax_amt',
      render: (value) => {
        return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
      },
      width: '150px',
      sorter: (a, b) => a.tax_amt - b.tax_amt,
      editable: true
    },
    {
      title: 'Shipping Fee',
      dataIndex: 'shipping_fee',
      width: '150px',
      render: (value) => {
        return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
      },
      sorter: (a, b) => a.shipping_fee - b.shipping_fee,
      editable: true
    },
    {
      title: 'Discount',
      dataIndex: 'product_discount_price',
      width: '150px',
      render: (value) => {
        return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
      },
      sorter: (a, b) => a.product_discount_price - b.product_discount_price,
      editable: true
    },
    {
      title: 'Unit Total Price',
      dataIndex: 'product_unit_total_price',
      width: '150px',
      render: (value) => {
        return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
      },
      sorter: (a, b) => a.product_unit_total_price - b.product_unit_total_price,
      editable: false
    },
    {
      title: 'Sell Price',
      dataIndex: 'product_sell_price',
      width: '150px',
      render: (value) => {
        return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
      },
      sorter: (a, b) => a.product_sell_price - b.product_sell_price,
      editable: true
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key, record)}
              style={{
                marginRight: 8
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Are you sure you want to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            <Typography.Link
              disabled={editingKey !== ''}
              onClick={() => handleBarcode(record)}
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
                  product_name: recordBarcode.product_name,
                  product_id: recordBarcode.product_id
                }}
                importDetailId={recordBarcode.import_detail_id}
                handleOpenModal={setIsOpenModal}
              ></BarcodeModal>
            ) : null}
          </>
        )
      }
    }
  ].filter((a) => !a.hidden)

  const handleRangeChange = (value, dateStrings) => {
    setStartDate(dateStrings[0])
    setEndDate(dateStrings[1])
    setDates(value)
  }

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.error('Please choose start date and end date.')
      return
    }

    const { data: historyData, isLoading: isHistoryLoading } = await trigger({
      startDate: startDate,
      endDate: endDate
    })

    if (!isHistoryLoading) {
      if (historyData.import_detail.length > 0) {
        setImportDataSource(historyData.import_detail)
      } else {
        toast.error('No Data!')
        return
      }
    }
  }

  const mergedColumns = importReportColumn.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  const handleDownloadExcel = () => {
    if (importDataSource.length <= 0) {
      toast.error('No Data to Print!')
      return
    } else {
      const printColumn = [
        {
          title: 'Product Name',
          dataIndex: 'product_name'
        },
        {
          title: 'Category Name',
          dataIndex: 'sub_category_name'
        },
        {
          title: 'Unit Name',
          dataIndex: 'unit_name'
        },
        {
          title: 'Import Quantity',
          dataIndex: 'import_qty'
        },
        {
          title: 'Unit Price',
          dataIndex: 'product_import_price'
        },
        {
          title: 'Tax Price',
          dataIndex: 'tax_amt'
        },
        {
          title: 'Shipping Fee',
          dataIndex: 'shipping_fee'
        },
        {
          title: 'Discount',
          dataIndex: 'product_discount_price'
        },
        {
          title: 'Total Unit Price',
          dataIndex: 'product_unit_total_price'
        },
        {
          title: 'Sell Price',
          dataIndex: 'product_sell_price'
        }
      ]
      const excel = new Excel()
      const date =
        new Date().getFullYear() +
        ('-' +
          ('0' + (new Date().getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + new Date().getDate()).slice(-2))
      excel
        .setTBodyStyle({
          fontSize: 12,
          fontName: 'Times New Roman',
          border: 1,
          v: 'center',
          h: 'center'
        })
        .setTHeadStyle({
          fontSize: 12,
          fontName: 'Times New Roman',
          border: 1,
          background: 'F2F2F2',
          v: 'center',
          h: 'center'
        })
        .addSheet(`${date}`)
        .addColumns(printColumn)
        .addDataSource(importDataSource, {
          str2Percent: true,
          str2num: true
        })
        .saveAs(`Import Detail_on_${date}.xlsx`)
    }
  }

  return (
    <>
      <div className="import-main-container">
        <header className="import-main-header">
          Import Report
          <div className="import-icon">
            <HiMiniArchiveBoxArrowDown color="white"></HiMiniArchiveBoxArrowDown>
          </div>
        </header>
        <div className="import-report-container">
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
          <Form form={form} component={false}>
            <Table
              columns={[...mergedColumns]}
              rowClassName="editable-row"
              components={{
                body: {
                  cell: editableCell
                }
              }}
              dataSource={[...importDataSource]}
            ></Table>
          </Form>
          <div className="import-input-button">
            <Button type="primary" onClick={handleDownloadExcel}>
              Download Excel
            </Button>
            <Button
              type="primary"
              onClick={() => {
                navigate('/import')
              }}
            >
              Import Product
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
    </>
  )
}

export default ImportReport
