import { CommaFormatted, CurrencyFormatted } from '../../utils/NumberFormatterUtils.js'

const saleReportColumn = [
  {
    title: 'Nº',
    dataIndex: 'key',
    rowScope: 'row'
  },
  {
    title: 'Customer Name',
    dataIndex: 'customer_name'
  },
  {
    title: 'Product ID',
    dataIndex: 'product_id',
    hidden: true
  },
  {
    title: 'Product Name',
    dataIndex: 'product_name'
  },
  {
    title: 'Sale Quantity',
    dataIndex: 'sale_qty'
  },
  {
    title: 'Import Unit Price',
    dataIndex: 'import_unit_price'
  },
  {
    title: 'Import Sub Total',
    dataIndex: 'import_sub_total'
  },
  {
    title: 'Import Sub Total',
    dataIndex: 'import_sub_total'
  },
  {
    title: 'Shipping Fee',
    dataIndex: 'shipping_fee'
  },
  {
    title: 'Tax',
    dataIndex: 'tax_amt'
  },
  {
    title: 'Import Total Price',
    dataIndex: 'import_total_price'
  },
  {
    title: 'Sale Unit Price',
    dataIndex: 'sale_unit_price'
  },
  {
    title: 'Product Discount',
    dataIndex: 'product_discount'
  },
  {
    title: 'Total Sale Price',
    dataIndex: 'total_sell_price'
  },
  {
    title: 'Delivery Fee',
    dataIndex: 'delivery_fee'
  },
  {
    title: 'Profit',
    dataIndex: 'profit'
  }
].filter((a) => !a.hidden)

export { saleReportColumn }
