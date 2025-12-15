import dayjs from 'dayjs'

const customerColumns = [
  {
    title: 'Customer ID',
    dataIndex: 'customerID',
    key: 'customerID',
    hidden: true
  },
  {
    title: 'Customer Name',
    dataIndex: 'customerName',
    key: 'customerName',
    editable: true
  },
  {
    title: 'Contact 1',
    dataIndex: 'customerContact1',
    key: 'customerContact1',
    editable: true
  },
  {
    title: 'Contact 2',
    dataIndex: 'customerContact2',
    key: 'customerContact2',
    editable: true
  },
  {
    title: 'Registered Date',
    dataIndex: 'customerRegisteredDate',
    key: 'customerRegisteredDate',
    render: (value) => (value ? dayjs(value).format('DD-MM-YYYY') : '-')
  }
].filter((column) => !column.hidden)

export { customerColumns }
