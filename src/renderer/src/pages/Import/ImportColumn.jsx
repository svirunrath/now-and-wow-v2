import { CommaFormatted, CurrencyFormatted } from '../../utils/NumberFormatterUtils.js'

const importColumn = [
  {
    title: 'Nº',
    dataIndex: 'key',
    rowScope: 'row'
  },
  {
    title: 'Product Name',
    dataIndex: 'product_name'
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
    dataIndex: 'unit_name'
  },
  {
    title: 'Import Quantity',
    dataIndex: 'import_qty',
    render: (value) => {
      return CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Import Unit Price',
    dataIndex: 'product_import_price',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Tax Price',
    dataIndex: 'tax_amt',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Shipping Fee',
    dataIndex: 'shipping_fee',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Discount',
    dataIndex: 'import_discount',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Import Unit Price',
    dataIndex: 'import_unit_price',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Import Total Price',
    dataIndex: 'import_total_price',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Sell Unit Price',
    dataIndex: 'product_sell_price',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  }
].filter((a) => !a.hidden)

export { importColumn }
