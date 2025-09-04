import { CommaFormatted, CurrencyFormatted } from '../../utils/NumberFormatterUtils.js'

const saleReportColumn = [
  {
    title: 'Sale Date',
    dataIndex: 'sale_date'
  },
  {
    title: 'Sale ID',
    dataIndex: 'sale_id'
  },
  {
    title: 'Customer Name',
    dataIndex: 'customer_name',
    ellipsis: true
  },
  {
    title: 'Product ID',
    dataIndex: 'product_id',
    hidden: true
  },
  {
    title: 'Product Name',
    dataIndex: 'product_name',
    ellipsis: true
  },
  {
    title: 'Sale Quantity',
    dataIndex: 'sale_qty'
  },
  {
    title: 'Import Unit Price',
    dataIndex: 'import_unit_price',
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
    title: 'Tax',
    dataIndex: 'tax_amt',
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
    title: 'Sale Unit Price',
    dataIndex: 'sale_unit_price',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Product Discount',
    dataIndex: 'product_discount',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Total Sale Price',
    dataIndex: 'total_sell_price',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Free Delivery/ Charged',
    dataIndex: 'is_delivery_free',
    ellipsis: true
  },
  {
    title: 'Delivery Fee',
    dataIndex: 'delivery_fee',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Profit',
    dataIndex: 'profit',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  }
].filter((a) => !a.hidden)

const saleReportColumnForPrint = [
  {
    title: 'Sale Date',
    dataIndex: 'sale_date'
  },
  {
    title: 'Sale ID',
    dataIndex: 'sale_id'
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
    title: 'Free Delivery/ Charged',
    dataIndex: 'is_delivery_free'
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

const productSaleColumn = [
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
    title: 'Sub Category Id',
    dataIndex: 'sub_category_id',
    hidden: true
  },
  {
    title: 'Sub Category Name',
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
    title: 'Stock Qty',
    dataIndex: 'stock_qty'
  },
  {
    title: 'Import Qty',
    dataIndex: 'import_qty'
  },
  {
    title: 'Import Total Price',
    dataIndex: 'import_price',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Sale Qty',
    dataIndex: 'sale_qty'
  },
  {
    title: 'Sale Total Price',
    dataIndex: 'sale_price',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  }
].filter((a) => !a.hidden)

const productSaleColumnForPrint = [
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
    title: 'Sub Category Id',
    dataIndex: 'sub_category_id',
    hidden: true
  },
  {
    title: 'Sub Category Name',
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
    title: 'Stock Qty',
    dataIndex: 'stock_qty'
  },
  {
    title: 'Import Qty',
    dataIndex: 'import_qty'
  },
  {
    title: 'Import Total Price',
    dataIndex: 'import_price'
  },
  {
    title: 'Sale Qty',
    dataIndex: 'sale_qty'
  },
  {
    title: 'Sale Total Price',
    dataIndex: 'sale_price'
  }
].filter((a) => !a.hidden)

const stockDetailColumn = [
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
    title: 'Sub Category Id',
    dataIndex: 'sub_category_id',
    hidden: true
  },
  {
    title: 'Sub Category Name',
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
    title: 'Import Detail Id',
    dataIndex: 'import_detail_id',
    hidden: true
  },
  {
    title: 'Stock Id',
    dataIndex: 'stock_id',
    hidden: true
  },
  {
    title: 'Stock Quantity',
    dataIndex: 'stock_qty'
  },
  {
    title: 'Unit Price',
    dataIndex: 'unit_import_price',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Total Price',
    dataIndex: 'product_total_import_price',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Tax',
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
    title: 'Unit Price',
    dataIndex: 'unit_total_price',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Total Price',
    dataIndex: 'total_price',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  }
].filter((a) => !a.hidden)

const stockMasterColumn = [
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
    title: 'Category Id',
    dataIndex: 'category_id',
    hidden: true
  },
  {
    title: 'Category Name',
    dataIndex: 'category_name'
  },
  {
    title: 'Sub Category Id',
    dataIndex: 'sub_category_id',
    hidden: true
  },
  {
    title: 'Sub Category Name',
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
    title: 'Stock Quantity',
    dataIndex: 'stock_qty'
  }
].filter((a) => !a.hidden)

const stockMasterColumnForPrint = [
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
    title: 'Category Id',
    dataIndex: 'category_id',
    hidden: true
  },
  {
    title: 'Category Name',
    dataIndex: 'category_name'
  },
  {
    title: 'Sub Category Id',
    dataIndex: 'sub_category_id',
    hidden: true
  },
  {
    title: 'Sub Category Name',
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
    title: 'Stock Quantity',
    dataIndex: 'stock_qty'
  }
].filter((a) => !a.hidden)

const stockDetailColumnForPrint = [
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
    title: 'Sub Category Id',
    dataIndex: 'sub_category_id',
    hidden: true
  },
  {
    title: 'Sub Category Name',
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
    title: 'Import Detail Id',
    dataIndex: 'import_detail_id',
    hidden: true
  },
  {
    title: 'Stock Id',
    dataIndex: 'stock_id',
    hidden: true
  },
  {
    title: 'Stock Quantity',
    dataIndex: 'stock_qty'
  },
  {
    title: 'Unit Price',
    dataIndex: 'unit_import_price'
  },
  {
    title: 'Total Price',
    dataIndex: 'product_total_import_price'
  },
  {
    title: 'Tax',
    dataIndex: 'tax_amt'
  },
  {
    title: 'Shipping Fee',
    dataIndex: 'shipping_fee'
  },
  {
    title: 'Unit Price',
    dataIndex: 'unit_total_price'
  },
  {
    title: 'Total Price',
    dataIndex: 'total_price'
  }
].filter((a) => !a.hidden)

const stockCutColumn = [
  {
    title: 'Nº',
    dataIndex: 'key',
    rowScope: 'row'
  },
  {
    title: 'Stock ID',
    dataIndex: 'stck_cut_id',
    hidden: true
  },
  {
    title: 'Cut Date',
    dataIndex: 'stck_cut_date',
    render: (value) => {
      return new Date(value).toLocaleDateString('GB')
    }
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
    title: 'Price Id',
    dataIndex: 'price_id',
    hidden: true
  },
  {
    title: 'Product Sell Price',
    dataIndex: 'product_sell_price',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Product Import Price',
    dataIndex: 'product_import_price',
    render: (value) => {
      return '$ ' + CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Tax Amount',
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
    title: 'Cut Quantity',
    dataIndex: 'stck_cut_qty',
    render: (value) => {
      return CommaFormatted(CurrencyFormatted(Number(value)))
    }
  },
  {
    title: 'Reason/ Description',
    dataIndex: 'description'
  }
].filter((a) => !a.hidden)

const stockCutColumnForPrint = [
  {
    title: 'Nº',
    dataIndex: 'key',
    rowScope: 'row'
  },
  {
    title: 'Stock ID',
    dataIndex: 'stck_cut_id',
    hidden: true
  },
  {
    title: 'Cut Date',
    dataIndex: 'stck_cut_date',
    render: (value) => {
      return new Date(value).toLocaleDateString('GB')
    }
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
    title: 'Import detail Id',
    dataIndex: 'import_detail_id',
    hidden: true
  },
  {
    title: 'Product Sell Price',
    dataIndex: 'product_sell_price'
  },
  {
    title: 'Product Import',
    dataIndex: 'product_import_price'
  },
  {
    title: 'Tax Amount',
    dataIndex: 'tax_amt'
  },
  {
    title: 'Shipping Fee',
    dataIndex: 'shipping_fee'
  },
  {
    title: 'Cut Quantity',
    dataIndex: 'stck_cut_qty'
  },
  {
    title: 'Reason/ Description',
    dataIndex: 'description'
  }
].filter((a) => !a.hidden)

export {
  saleReportColumn,
  productSaleColumn,
  stockMasterColumn,
  stockDetailColumn,
  stockCutColumn,
  stockDetailColumnForPrint,
  stockMasterColumnForPrint,
  stockCutColumnForPrint,
  saleReportColumnForPrint,
  productSaleColumnForPrint
}
