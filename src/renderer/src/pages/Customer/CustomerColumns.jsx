const customerColumns = [
  {
    title: 'Customer ID',
    dataIndex: 'customerId',
    key: 'customerId',
    hidden: true
  },
  {
    title: 'Customer Name',
    dataIndex: 'customerName',
    key: 'customerName'
  },
  {
    title: 'Contact 1',
    dataIndex: 'contact1',
    key: 'contact1'
  },
  {
    title: 'Contact 2',
    dataIndex: 'contact2',
    key: 'contact2'
  },
  { title: 'Registered Date', dataIndex: 'registeredDate', key: 'registeredDate' }
].filter((column) => !column.hidden)

export { customerColumns }
