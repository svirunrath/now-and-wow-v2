import React from 'react'
import './Customer.css'
import { IoPeopleCircle } from 'react-icons/io5'
import { Input, Button, Table } from 'antd'
import { customerColumns } from './CustomerColumns'

const Customer = () => {
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
                <Input style={{ width: '87%' }} className="customer-input" />
              </div>
            </div>
            <div className="customer-row-1">
              <div className="customer-input-group">
                <label className="customer-label">Contact 1</label>
                <Input style={{ width: '74%' }} className="customer-input" />
              </div>
              <div className="customer-input-group">
                <label className="customer-label">Contact 2</label>
                <Input style={{ width: '74%' }} className="customer-input" />
              </div>
            </div>
            <div className="import-input-button">
              <Button type="primary">Add</Button>
              <Button type="primary">Clear</Button>
            </div>
          </div>
        </div>
        <div className="customer-table">
          <div className="customer-input-block">
            <Table style={{ width: '100%' }} columns={customerColumns} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Customer
