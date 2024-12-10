import './SaleManagement.css'
import { DatePicker, Button, Table, Select, Typography, Popconfirm, Modal, Divider } from 'antd'
import { CommaFormatted, CurrencyFormatted } from '../../utils/NumberFormatterUtils.js'
import ReactToPrint from 'react-to-print'
import {
  PlusOutlined,
  InstagramOutlined,
  FacebookOutlined,
  PhoneOutlined,
  PrinterOutlined
} from '@ant-design/icons'
const { RangePicker } = DatePicker
import React, { useState, useEffect, useRef } from 'react'
import {
  useLazyRetrieveSaleDetailBySaleIdQuery,
  useLazyRetrieveSaleMasterListQuery,
  useUpdateRefundedSaleMutation
} from '../../slices/saleSlices.js'
const { Option } = Select
import { toast } from 'react-toastify'
import { useLazyGetPriceIdByProductPriceLazyQuery } from '../../slices/productPriceSlices.js'
import {
  useUpdateStockDetailByProductIdAndPriceIdMutation,
  useUpdateStockMasterByProductIdMutation
} from '../../slices/stockSlices.js'

const SaleManagement = () => {
  const [dates, setDates] = useState([])
  const [refundedYN, setRefundedYN] = useState('ALL')
  const [paidOrderYn, setPaidOrderYn] = useState('ALL')
  const [retrieveListSale] = useLazyRetrieveSaleMasterListQuery()
  const [updateRefund] = useUpdateRefundedSaleMutation()
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [saleDatasource, setSaleDatasource] = useState([])
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [printRecord, setPrintRecord] = useState({})
  const [retrieveSaleDetailBySaleId] = useLazyRetrieveSaleDetailBySaleIdQuery()
  const [saleDetailDataSource, setSaleDetailDatasource] = useState([])

  const ref = useRef()

  const saleColumns = [
    {
      title: 'Nº',
      dataIndex: 'key',
      rowScope: 'row'
    },
    {
      title: 'Sale Date',
      dataIndex: 'sale_date',
      render: (value) => {
        return new Date(value).toLocaleDateString('en-GB')
      },
      sorter: (a, b) => new Date(a.sale_date) - new Date(b.sale_date)
    },
    {
      title: 'Receipt ID',
      dataIndex: 'sale_id'
    },
    {
      title: 'Customer Name',
      dataIndex: 'customer_name'
    },
    {
      title: 'Customer Phone',
      dataIndex: 'customer_phone'
    },
    {
      title: 'Customer Location',
      dataIndex: 'customer_location'
    },
    {
      title: 'Sale Price',
      dataIndex: 'sale_price',
      render: (value) => {
        return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
      }
    },
    {
      title: 'Delivery Fee/ Free',
      dataIndex: 'is_delivery_free',
      render: (value) => {
        return value ? 'Free' : 'Charged'
      }
    },
    {
      title: 'Delivery Fee',
      dataIndex: 'delivery_fee',
      render: (value) => {
        return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
      }
    },
    {
      title: 'Sale Discount',
      dataIndex: 'sale_discount',
      render: (value) => {
        return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
      }
    },
    {
      title: 'Total Sale Price',
      dataIndex: 'sale_total_price',
      render: (value) => {
        return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
      }
    },
    {
      title: 'Payment Paid',
      dataIndex: 'received_payment',
      render: (value) => {
        return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
      }
    },
    {
      title: 'Exchange Rate',
      dataIndex: 'exch_rate',
      render: (value) => {
        return CommaFormatted(CurrencyFormatted(Number(value)))
      }
    },
    {
      title: 'Actions',
      dataIndex: 'action',
      render: (_, record) => {
        return (
          <span style={{ display: 'flex', gap: '5px' }}>
            <Typography.Link>
              <Popconfirm
                title="Are you sure you want to refund the receipt?"
                onConfirm={() => handleRefund(record)}
              >
                <a disabled={record.is_refunded}>Refund</a>
              </Popconfirm>
            </Typography.Link>
            <Typography.Link>
              <Popconfirm
                title="Are you sure you want to refund the receipt?"
                onConfirm={() => handleReprint(record)}
              >
                <a disabled={record.is_refunded}>Re-print</a>
              </Popconfirm>
            </Typography.Link>
          </span>
        )
      }
    }
  ]

  const receiptColumn = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      render: (value) => {
        return CommaFormatted(CurrencyFormatted(Number(value)))
      }
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (value) => {
        return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
      }
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      render: (value) => {
        return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
      }
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (value) => {
        return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
      }
    }
  ]

  const handleRangeChange = (value, dateStrings) => {
    setStartDate(dateStrings[0])
    setEndDate(dateStrings[1])
    setDates(value)
  }

  const handleRefund = async (record) => {
    const req = {
      sale_id: record.sale_id,
      modified_by: userInfo.username
    }

    const outputData = await updateRefund(req).unwrap()

    if (outputData.success) {
      toast.success('Refunded Successfully')
      handleSearch()
    } else {
      toast.error('Refunded Failed')
      return
    }
  }

  const handleReprint = async (record) => {
    await setPrintRecord(record)
    const { data, isLoading } = await retrieveSaleDetailBySaleId({ sale_id: record.sale_id })

    if (!isLoading && data) {
      await setSaleDetailDatasource(data.sale)
      await setIsOpenModal(true)
    } else {
      toast.error('No Sale Information')
      return
    }
  }

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.error('Please choose start date and end date.')
      return
    }

    const req = {
      startDate: startDate,
      endDate: endDate,
      refundedYn: refundedYN,
      unpaidYn: paidOrderYn
    }

    const { data, isLoading } = await retrieveListSale(req)

    if (!isLoading && data) {
      setSaleDatasource(data.sale)
    } else {
      toast.error('No Data!')
    }
  }

  const pageStyle = `
  @page {
    size: 80mm 50mm !important;
    margin: 0.5px !important;
  }
`

  return (
    <>
      <div className="sale-management-container">
        <header className="sale-management-header">Sale Management</header>
        <div className="sale-management-content">
          <div className="sale-inquiry-condition">
            <p style={{ fontSize: 15, color: 'white' }}>Refunded Y/N: </p>
            <Select
              className="main-category-select"
              value={refundedYN}
              onChange={(value) => {
                setRefundedYN(value)
              }}
            >
              {refundChoices.map((a) => {
                return (
                  <Option key={a.value} value={a.value} label={a.label}>
                    {a.label}
                  </Option>
                )
              })}
            </Select>
            <p style={{ fontSize: 15, color: 'white' }}>Paid Order Y/N: </p>
            <Select
              className="main-category-select"
              value={paidOrderYn}
              onChange={(value) => {
                setPaidOrderYn(value)
              }}
            >
              {unpaidOrderType.map((a) => {
                return (
                  <Option key={a.value} value={a.value} label={a.label}>
                    {a.label}
                  </Option>
                )
              })}
            </Select>
            <p style={{ fontSize: 15, color: 'white' }}>Inquiry Period:</p>
            <RangePicker format="YYYY-MM-DD" value={dates} onChange={handleRangeChange} />
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </div>
          <div className="sale-table-container">
            <Table
              style={{ width: '100%' }}
              columns={saleColumns}
              dataSource={saleDatasource}
            ></Table>
          </div>
        </div>
      </div>
      <Modal
        className="menu-modal-payment-box"
        width={'93mm'}
        centered
        open={isOpenModal}
        onCancel={() => {
          setIsOpenModal(false)
          setPrintRecord({})
        }}
        footer={[
          <ReactToPrint
            //bodyClass="print-receipt"
            pageStyle={pageStyle}
            content={() => ref.current}
            onAfterPrint={() => {
              setIsOpenModal(false)
              setPrintRecord({})
              setSaleDetailDatasource([])
              toast.success('Re-print Successfully')
            }}
            trigger={() => (
              <Button type="primary" icon={<PrinterOutlined />}>
                Print
              </Button>
            )}
          />,
          <Button
            onClick={() => {
              setIsOpenModal(false)
              setPrintRecord({})
            }}
          >
            Close
          </Button>
        ]}
      >
        <div className="print-container" ref={ref}>
          <div className="menu-receipt-header">
            <div className="shop-name">
              {/* <img
                width={'30px'}
                height={'30px'}
                src={__dirname + `/src/renderer/public/images/products/logo.jpg`}
              ></img> */}
              <h1 style={{ fontFamily: 'Gloria Hallelujah' }}>Now & Wow</h1>
              <div className="phone">
                <PhoneOutlined style={{ color: 'black' }} />
                <div className="phone-num">
                  <h3>078 7000 80</h3>
                  <h3>016 8287 09</h3>
                </div>
              </div>
            </div>
            <div className="shop-detail">
              <div className="instagram">
                <InstagramOutlined style={{ color: 'black' }} />
                <h3>nowwow_cambodia</h3>
              </div>
              <div className="facebook">
                <FacebookOutlined style={{ color: 'black' }} />
                <h3>Now & Wow</h3>
              </div>
            </div>
          </div>
          <Divider style={{ borderColor: 'black', margin: '0' }}></Divider>
          <Divider style={{ borderColor: 'black', margin: '0' }}></Divider>
          <div className="customer-info">
            <p style={{ fontSize: '12px' }}>Receipt Id: {printRecord.sale_id}</p>
            <p style={{ fontSize: '12px' }}>Customer Information: </p>
            <div className="customer-detail">
              <p style={{ fontSize: '10px' }}>Name: {printRecord.customer_name}</p>
              <p style={{ fontSize: '10px' }}>Phone: {printRecord.customer_phone}</p>
              <p style={{ fontSize: '10px' }}>Location: {printRecord.customer_location}</p>
              <p style={{ fontSize: '10px' }}>
                Date: {new Date(printRecord.sale_date).toLocaleDateString('GB')}{' '}
                {printRecord.sale_time}
              </p>
            </div>
          </div>
          <Divider style={{ borderColor: 'black', margin: '0' }}></Divider>
          <Divider style={{ borderColor: 'black', margin: '0' }}></Divider>
          <div className="receipt-order">
            <Table
              className="table-order"
              columns={receiptColumn}
              dataSource={saleDetailDataSource}
              pagination={false}
            ></Table>
          </div>
          <div className="menu-modal-payment">
            <div className="menu-modal-total-box">
              <div className="menu-modal-total">
                <p>Subtotal:</p>
                <div className="menu-modal-total-currency">
                  <p>{CommaFormatted(CurrencyFormatted(Number(printRecord.sale_price)))} $</p>
                  {/* <p>{CommaFormatted(CurrencyFormatted(subTotalKhr))} R</p> */}
                </div>
              </div>
            </div>
            <div className="menu-modal-total-box">
              <div className="menu-modal-total">
                <p>Discount:</p>
                <div className="menu-modal-discount-currency">
                  <p> -{CommaFormatted(CurrencyFormatted(Number(printRecord.sale_discount)))} $</p>
                  {/* <p> -{CommaFormatted(CurrencyFormatted(discountKhr))} R</p> */}
                </div>
              </div>
            </div>
            <div className="menu-modal-total-box">
              <div className="menu-modal-total">
                <p>Delivery:</p>
                <div className="menu-modal-total-currency">
                  {printRecord.is_delivery_free ? (
                    <p>Free</p>
                  ) : (
                    <p> {CommaFormatted(CurrencyFormatted(Number(printRecord.delivery_fee)))} $</p>
                  )}
                  {/* <p> -{CommaFormatted(CurrencyFormatted(discountKhr))} R</p> */}
                </div>
              </div>
            </div>
            <div className="menu-modal-total-box">
              <div className="menu-modal-total">
                <p>Total:</p>
                <div className="menu-modal-total-currency">
                  <p>{CommaFormatted(CurrencyFormatted(Number(printRecord.sale_total_price)))} $</p>
                  <p>
                    {CommaFormatted(
                      CurrencyFormatted(
                        Number(printRecord.sale_total_price) * Number(printRecord.exch_rate)
                      )
                    )}{' '}
                    R
                  </p>
                </div>
              </div>
            </div>
            <div className="menu-modal-total-box" id="no-print">
              <div className="menu-modal-total">
                <p>Recieved:</p>
                <div className="menu-modal-total-currency">
                  <p>{CommaFormatted(CurrencyFormatted(Number(printRecord.received_payment)))} $</p>
                  <p>
                    {CommaFormatted(
                      CurrencyFormatted(
                        Number(printRecord.received_payment) * Number(printRecord.exch_rate)
                      )
                    )}{' '}
                    R
                  </p>
                </div>
              </div>
            </div>
            <div className="menu-modal-total-box" id="no-print">
              <div className="menu-modal-total">
                <p>Change:</p>
                <div className="menu-modal-total-currency">
                  <p>0.00 $</p>
                  <p>0.00 R</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default SaleManagement

const refundChoices = [
  { value: 'ALL', label: 'All' },
  { value: '02', label: 'Refunded Sale' },
  { value: '01', label: 'Non-Refunded Sale' }
]

const unpaidOrderType = [
  { value: 'ALL', label: 'All' },
  { value: '02', label: 'Unpaid Orders' },
  { value: '01', label: 'Paid Orders' }
]
