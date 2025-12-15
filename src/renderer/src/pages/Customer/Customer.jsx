import React from 'react'
import './Customer.css'
import { IoPeopleCircle } from 'react-icons/io5'
import { Input, Button, Table, Popconfirm, Form, Typography } from 'antd'
import { customerColumns } from './CustomerColumns'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  useRegisterCustomerMutation,
  useRetrieveListCustomersQuery,
  useUpdateCustomerMutation
} from '../../slices/customerSlices.js'

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
  const inputNode = <Input className="editing-input" />

  const isRequired = dataIndex === 'customerName'

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 1 }}
          rules={
            isRequired
              ? [
                  {
                    required: true,
                    message: 'Customer Name is required'
                  }
                ]
              : []
          }
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const Customer = () => {
  const [form] = Form.useForm()
  const [customerName, setCustomerName] = useState('')
  const [contact1, setContact1] = useState('')
  const [contact2, setContact2] = useState('')
  const isEditing = (record) => record.customerID === editingKey
  const [editingKey, setEditingKey] = useState('')
  const [registerCustomer] = useRegisterCustomerMutation()
  const [updateCustomer] = useUpdateCustomerMutation()
  const [customerDatasource, setCustomerDatasource] = useState([])
  const { data, refetch } = useRetrieveListCustomersQuery()

  useEffect(() => {
    if (data) {
      setCustomerDatasource(data.customers)
    }
  }, [data])

  const handleAddCustomer = async () => {
    try {
      const customerData = {
        customerName: customerName,
        customerContact1: contact1,
        customerContact2: contact2
      }
      await registerCustomer(customerData).unwrap()
      // Clear input fields after successful addition
      setCustomerName('')
      setContact1('')
      setContact2('')
      toast.success('Customer added successfully')

      await refetch()
    } catch (error) {
      toast.error('Failed to add customer')
      console.error('Failed to add customer:', error)
    }
  }

  const handleEditCustomer = (record) => {
    setEditingKey(record.customerID)
  }

  useEffect(() => {
    if (editingKey) {
      const record = customerDatasource.find((item) => item.customerID === editingKey)

      if (record) {
        form.setFieldsValue({
          customerName: record.customerName,
          customerContact1: record.customerContact1,
          customerContact2: record.customerContact2
        })
      }
    }
  }, [editingKey])

  const handleUpdateCustomer = async (record) => {
    try {
      const row = await form.validateFields()

      const req = {
        customerID: record.customerID,
        customerName: row.customerName.trim(),
        customerContact1: row.customerContact1 ?? '',
        customerContact2: row.customerContact2 ?? ''
      }

      if (!row.customerName?.trim()) {
        toast.error('Customer Name is required')
        return
      }

      await updateCustomer(req).unwrap()
      toast.success('Customer updated successfully')
      setEditingKey('')
      await refetch()
    } catch (error) {
      toast.error('Failed to update customer')
    }
  }

  //Editable Cell
  const mergedColumns = [
    ...customerColumns.map((col) => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record)
        })
      }
    }),
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Popconfirm
              title="Are you sure you want to save?"
              onConfirm={() => handleUpdateCustomer(record)}
            >
              <Typography.Link
                style={{
                  marginRight: 8
                }}
              >
                Save
              </Typography.Link>
            </Popconfirm>
            <Popconfirm
              title="Are you sure you want to cancel?"
              onConfirm={() => setEditingKey('')}
            >
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => handleEditCustomer(record)}>
            Edit
          </Typography.Link>
        )
      }
    }
  ]

  //Render
  return (
    <>
      <div className="customer-main-container">
        <header className="customer-header">
          Customer Management
          <div className="customer-icon">
            <IoPeopleCircle color="white"></IoPeopleCircle>
          </div>
        </header>
        <div className="customer-input-container">
          <div className="customer-input-block">
            <div className="customer-row-1">
              <div className="customer-input-group">
                <label className="customer-label">Customer Name</label>
                <Input
                  style={{ width: '87%' }}
                  value={customerName}
                  name="customerName"
                  required={true}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="customer-input"
                />
              </div>
            </div>
            <div className="customer-row-1">
              <div className="customer-input-group">
                <label className="customer-label">Contact 1</label>
                <Input
                  style={{ width: '74%' }}
                  name="customerContact1"
                  value={contact1}
                  onChange={(e) => setContact1(e.target.value)}
                  className="customer-input"
                />
              </div>
              <div className="customer-input-group">
                <label className="customer-label">Contact 2</label>
                <Input
                  style={{ width: '74%' }}
                  name="customerContact2"
                  value={contact2}
                  onChange={(e) => setContact2(e.target.value)}
                  className="customer-input"
                />
              </div>
            </div>
            <div className="import-input-button">
              <Popconfirm title="Are you sure to add this customer?" onConfirm={handleAddCustomer}>
                <Button type="primary">Add</Button>
              </Popconfirm>
              <Button type="primary">Clear</Button>
            </div>
          </div>
        </div>
        <div className="customer-table">
          <div className="customer-input-block">
            <Form form={form} style={{ width: '100%' }} component={false}>
              <Table
                rowKey="customerID"
                columns={[...mergedColumns]}
                dataSource={[...customerDatasource]}
                rowClassName="editable-row"
                components={{
                  body: {
                    cell: editableCell
                  }
                }}
              />
            </Form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Customer
