import { useEffect, useState } from 'react'
import { CommaFormatted, CurrencyFormatted } from '../../utils/NumberFormatterUtils.js'
import { useGetMainCategoryQuery } from '../../slices/mainCategoryAPISlices.js'
import { Select, DatePicker, Button, Table } from 'antd'
import './Report.css'
import {
  productSaleColumn,
  productSaleColumnForPrint,
  saleReportColumn,
  saleReportColumnForPrint,
  stockCutColumn,
  stockCutColumnForPrint,
  stockDetailColumn,
  stockDetailColumnForPrint,
  stockMasterColumn,
  stockMasterColumnForPrint
} from './ReportColumns.jsx'
import {
  useLazyRetrieveProductSaleReportQuery,
  useLazyRetrieveSaleReportQuery,
  useLazyRetrieveStockDetailReportQuery,
  useLazyRetrieveStockMasterReportQuery
} from '../../slices/reportSlices.js'
import { toast } from 'react-toastify'
import { Excel } from 'antd-table-saveas-excel'
import { useLazyRetrieveStockCutListQuery } from '../../slices/stockCutSlices.js'
import { useRetrieveProductByMainCategoryIdQuery } from '../../slices/productAPISlices.js'
const { Option } = Select
const { RangePicker } = DatePicker

const Report = () => {
  //Report Type
  const [reportTitle, setReportTitle] = useState('Report')
  const [selectedReportType, setSelectedReportType] = useState('')
  const reportType = [
    { key: 'mstock', value: 'mstock', label: 'Stock Master Report' },
    { key: 'dstock', value: 'dstock', label: 'Stock Detail Report' },
    { key: 'stockc', value: 'cstock', label: 'Stock Cut Report' },
    { key: 'sale', value: 'sale', label: 'Sale Report' },
    { key: 'product', value: 'product', label: 'Product Sale Summary Report' }
  ]
  const [dates, setDates] = useState([])
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [productId, setProductId] = useState('ALL')
  const [dataSource, setDataSource] = useState([])
  const [reportColumns, setReportColumns] = useState([])
  const [reportPrintColumns, setReportPrintColumns] = useState([])
  const [retrieveSaleReport] = useLazyRetrieveSaleReportQuery()
  const [retrieveProductSaleReport] = useLazyRetrieveProductSaleReportQuery()
  const [retrieveStockMasterReport] = useLazyRetrieveStockMasterReportQuery()
  const [retrieveStockDetailReport] = useLazyRetrieveStockDetailReportQuery()
  const [retrieveStockCutReport] = useLazyRetrieveStockCutListQuery()
  const [mainId, setMainId] = useState('ALL')
  const { data: category_data, isLoading: category_isLoading } = useGetMainCategoryQuery()
  const { data: productData, isLoading: productIsLoading } =
    useRetrieveProductByMainCategoryIdQuery({ category_id: mainId })

  const filterOption = (input, option) =>
    (option?.children ?? '').toLowerCase().includes(input.toLowerCase())

  let main_category = []

  if (!category_isLoading && ['mstock', 'dstock'].includes(selectedReportType)) {
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

  useEffect(() => {
    setDataSource([])
    setReportColumns([])
    if (selectedReportType === 'sale') {
      setReportColumns(saleReportColumn)
      setReportPrintColumns(saleReportColumnForPrint)
    } else if (selectedReportType === 'product') {
      setReportColumns(productSaleColumn)
      setReportPrintColumns(productSaleColumnForPrint)
    } else if (selectedReportType === 'mstock') {
      setReportColumns(stockMasterColumn)
      setReportPrintColumns(stockMasterColumnForPrint)
    } else if (selectedReportType === 'dstock') {
      setReportColumns(stockDetailColumn)
      setReportPrintColumns(stockDetailColumnForPrint)
    } else if (selectedReportType === 'cstock') {
      setReportColumns(stockCutColumn)
      setReportPrintColumns(stockCutColumnForPrint)
    }
  }, [selectedReportType])

  const handleSearch = async () => {
    //SALE REPORT
    if (selectedReportType == 'sale') {
      if (!startDate || !endDate) {
        toast.error('Please select start date and end date.')
        return
      }

      const { data, isLoading } = await retrieveSaleReport({
        startDate: startDate,
        endDate: endDate
      })
      let tempDataSource = []

      if (!isLoading && data) {
        const outputData = data.outputData
        let sale_qty = 0
        let import_unit_price = 0
        let shipping_fee = 0
        let tax_amt = 0
        let import_total_price = 0
        let sale_unit_price = 0
        let product_discount = 0
        let total_sell_price = 0
        let delivery_fee = 0
        let profit = 0

        for (let i = 0; i <= outputData.length; i++) {
          if (i == outputData.length) {
            tempDataSource.push({
              sale_date: 'Total',
              customer_name: '',

              product_id: '',
              product_name: '',
              sale_qty: sale_qty,
              import_unit_price: Number(import_unit_price),
              shipping_fee: Number(shipping_fee),
              tax_amt: Number(tax_amt),
              import_total_price: Number(import_total_price),
              sale_unit_price: Number(sale_unit_price),
              product_discount: Number(product_discount),
              total_sell_price: Number(total_sell_price),
              is_delivery_free: '',
              delivery_fee: Number(delivery_fee),
              profit: Number(profit)
            })
          } else {
            let isExisted = tempDataSource.find((item) => item.sale_id == outputData[i].sale_id)
            sale_qty = sale_qty + Number(outputData[i].sale_qty)
            import_unit_price = import_unit_price + Number(outputData[i].import_unit_price)
            shipping_fee = shipping_fee + Number(outputData[i].shipping_fee)
            tax_amt = tax_amt + Number(outputData[i].tax_amt)
            import_total_price = import_total_price + Number(outputData[i].import_total_price)
            sale_unit_price = sale_unit_price + Number(outputData[i].sale_unit_price)
            product_discount = product_discount + Number(outputData[i].product_discount)
            total_sell_price = total_sell_price + Number(outputData[i].total_sell_price)
            delivery_fee = !isExisted
              ? delivery_fee + Number(outputData[i].delivery_fee)
              : delivery_fee
            profit = profit + Number(outputData[i].profit)
            const date = new Date(outputData[i].sale_date).toLocaleDateString('en-GB')

            tempDataSource.push({
              sale_date: date,
              customer_name: outputData[i].customer_name,
              product_id: outputData[i].product_id,
              sale_id: outputData[i].sale_id,
              product_name: outputData[i].product_name,
              sale_qty: Number(outputData[i].sale_qty),
              import_unit_price: Number(outputData[i].import_unit_price),
              shipping_fee: Number(outputData[i].shipping_fee),
              tax_amt: Number(outputData[i].tax_amt),
              import_total_price: Number(outputData[i].import_total_price),
              sale_unit_price: Number(outputData[i].sale_unit_price),
              product_discount: Number(outputData[i].product_discount),
              total_sell_price: Number(outputData[i].total_sell_price),
              is_delivery_free: outputData[i].is_delivery_free ? 'Free Delivery' : 'Charged',
              delivery_fee: Number(outputData[i].delivery_fee),
              profit: Number(outputData[i].profit)
            })
          }
        }
        setDataSource(tempDataSource)
      } else if (!isLoading && !data) {
        toast.error('No data!')
        setDataSource([])
      }

      //PRODUCT SALE REPORT
    } else if (selectedReportType == 'product') {
      if (!startDate || !endDate) {
        toast.error('Please select start date and end date.')
        return
      }
      const { data, isLoading } = await retrieveProductSaleReport({
        startDate: startDate,
        endDate: endDate
      })
      let tempDataSource = []

      if (!isLoading && data) {
        const outputData = data.outputData

        for (let i = 0; i < outputData.length; i++) {
          tempDataSource.push({
            product_id: outputData[i].product_id,
            product_name: outputData[i].product_name,
            sub_category_id: outputData[i].sub_category_id,
            sub_category_name: outputData[i].sub_category_name,
            stock_qty: Number(outputData[i].stock_qty),
            unit_id: outputData[i].unit_id,
            unit_name: outputData[i].unit_name,
            import_qty: Number(outputData[i].import_qty),
            sale_qty: Number(outputData[i].sale_qty),
            import_price: Number(outputData[i].import_price),
            sale_price: Number(outputData[i].sale_price)
          })
        }
        setDataSource(tempDataSource)
      } else if (!isLoading && !data) {
        toast.error('No data!')
        setDataSource([])
      }
    } else if (selectedReportType == 'mstock') {
      const { data, isLoading } = await retrieveStockMasterReport({
        category_id: mainId,
        product_id: productId
      })

      let tempDataSource = []

      if (!isLoading && data) {
        const outputData = data.outputData

        for (let i = 0; i < outputData.length; i++) {
          tempDataSource.push({
            product_id: outputData[i].product_id,
            product_name: outputData[i].product_name,
            category_id: outputData[i].category_id,
            category_name: outputData[i].category_name,
            sub_category_id: outputData[i].sub_category_id,
            sub_category_name: outputData[i].sub_category_name,
            unit_id: outputData[i].unit_id,
            unit_name: outputData[i].unit_name,
            stock_qty: Number(outputData[i].stock_qty)
          })
        }
        setDataSource(tempDataSource)
      } else if (!isLoading && !data) {
        toast.error('No data!')
        setDataSource([])
      }
    } else if (selectedReportType == 'dstock') {
      const { data, isLoading } = await retrieveStockDetailReport({
        category_id: mainId,
        product_id: productId
      })

      let tempDataSource = []

      if (!isLoading && data) {
        const outputData = data.outputData

        for (let i = 0; i < outputData.length; i++) {
          tempDataSource.push({
            product_id: outputData[i].product_id,
            product_name: outputData[i].product_name,
            sub_category_id: outputData[i].sub_category_id,
            sub_category_name: outputData[i].sub_category_name,
            unit_id: outputData[i].unit_id,
            unit_name: outputData[i].unit_name,
            import_detail_id: outputData[i].import_detail_id,
            stock_id: outputData[i].stock_id,
            unit_import_price: Number(outputData[i].unit_import_price),
            stock_qty: Number(outputData[i].stock_qty),
            product_total_import_price: Number(outputData[i].product_total_import_price),
            tax_amt: Number(outputData[i].tax_amt),
            shipping_fee: Number(outputData[i].shipping_fee),
            unit_total_price: Number(outputData[i].unit_total_price),
            total_price: Number(outputData[i].total_price)
          })
        }
        setDataSource(tempDataSource)
      } else if (!isLoading && !data) {
        toast.error('No data!')
        setDataSource([])
      }
    } else if (selectedReportType == 'cstock') {
      const { data, isLoading } = await retrieveStockCutReport({
        startDate: startDate,
        endDate: endDate
      })

      let tempDataSource = []

      if (!isLoading && data) {
        const outputData = data.stock_list

        for (let i = 0; i < outputData.length; i++) {
          tempDataSource.push({
            key: outputData[i].key,
            stck_cut_id: outputData[i].stck_cut_id,
            stck_cut_date: outputData[i].stck_cut_date,
            product_id: outputData[i].product_id,
            product_name: outputData[i].product_name,
            import_detail_id: outputData[i].import_detail_id,
            product_sell_price: Number(outputData[i].product_sell_price),
            product_import_price: Number(outputData[i].product_import_price),
            tax_amt: Number(outputData[i].tax_amt),
            shipping_fee: Number(outputData[i].shipping_fee),
            stck_cut_qty: Number(outputData[i].stck_cut_qty),
            stock_qty: Number(outputData[i].stock_qty),
            description: outputData[i].description
          })
        }
        setDataSource(tempDataSource)
      }
    } else {
      toast.error('Please select a report type.')
    }
  }

  const handleRangeChange = (value, dateStrings) => {
    setStartDate(dateStrings[0])
    setEndDate(dateStrings[1])
    setDates(value)
  }

  //Printing function
  const handleDownloadExcel = () => {
    console.log(dataSource)
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
      .addColumns(reportPrintColumns)
      .addDataSource(dataSource, {
        str2Percent: true,
        str2num: false
      })
      .saveAs(`${reportTitle}_on_${date}.xlsx`)
  }

  return (
    <>
      <div className="report-main-container">
        <div className="report-header">
          <header>{reportTitle}</header>
          <div className="report-inquiry">
            <p>Report Type: </p>
            <Select
              className="main-category-select"
              value={selectedReportType}
              onChange={(value, options) => {
                setSelectedReportType(value)
                setReportTitle(options.label)
              }}
            >
              {reportType.map((a) => {
                return (
                  <Option key={a.key} value={a.value} label={a.label}>
                    {a.label}
                  </Option>
                )
              })}
            </Select>
            {/* <p>Product:</p>
            <Select className="main-category-select"></Select> */}
            {['mstock', 'dstock'].includes(selectedReportType) ? (
              <>
                <p>Main Category: </p>
                <Select
                  className="main-category-select"
                  value={mainId}
                  onChange={(value) => {
                    setMainId(value)
                  }}
                >
                  <Option key="ALL" value="ALL">
                    All
                  </Option>
                  {main_category ? main_category : null}
                </Select>
                <p>Product: </p>
                <Select
                  className="main-category-select"
                  showSearch
                  value={productId}
                  onChange={(value) => {
                    setProductId(value)
                  }}
                  filterOption={filterOption}
                >
                  <Option key="ALL" value="ALL">
                    All
                  </Option>
                  {!productIsLoading && productData
                    ? productData.products.map((product) => (
                        <Option value={product.product_id} key={product.product_id}>
                          {product.product_name}
                        </Option>
                      ))
                    : null}
                </Select>
              </>
            ) : null}
            {!['mstock', 'dstock'].includes(selectedReportType) ? (
              <>
                <p>Inquiry Period:</p>
                <RangePicker format="YYYY-MM-DD" value={dates} onChange={handleRangeChange} />
              </>
            ) : null}
            <Button type="primary" onClick={handleSearch}>
              Search
            </Button>
          </div>
        </div>
        <div className="report-body">
          <Table columns={reportColumns} dataSource={dataSource}></Table>
          <div className="btn-container">
            <Button type="primary" className="btn-download" onClick={handleDownloadExcel}>
              Download Excel
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Report
