import React from 'react'
import { Button, Flex, Segmented, Divider, Popconfirm } from 'antd'
import { FaCheck } from 'react-icons/fa'
import { QuestionCircleOutlined } from '@ant-design/icons'

const HomePaidOrder = ({ setHomepageOrder, setPaidOrder, setLoading }) => {
  const Icon = setHomepageOrder.icon
  return (
    <Flex vertical={true} gap={7}>
      <Flex justify="space-between">
        <Flex gap={15} align="center">
          <Flex className="homepage-report-icon" vertical={true} align="center" justify="center">
            <Icon size={20} color="white" />
          </Flex>
          <Flex justify="space-between" vertical={true} style={{ height: '100%' }}>
            <p className="homepage-report-order">
              Date: <span>{setHomepageOrder.saleDate}</span>
            </p>
            <p></p>
            <p className="homepage-report-order">
              ID: <span>#{setHomepageOrder.orderid}</span>
            </p>
            <p></p>

            <p className="homepage-report-order">
              Total:<span> ${setHomepageOrder.orderprice}</span>
            </p>

            <p className="homepage-report-order">
              Remaining:<span> ${setHomepageOrder.remaining}</span>
            </p>
          </Flex>
        </Flex>
        <Flex align="center">
          {setHomepageOrder.paid == true ? (
            <p>Paid</p>
          ) : (
            <Popconfirm
              onConfirm={setPaidOrder}
              title="Paid the receipt"
              description="Are you sure to paid this receipt?"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
            >
              <Button
                type="primary"
                style={{ background: '#41486f' }}
                loading={setLoading}
                icon={<FaCheck />}
              ></Button>
            </Popconfirm>
          )}
        </Flex>
      </Flex>
      <Divider style={{ background: 'grey', margin: 0 }}></Divider>
    </Flex>
  )
}
export default HomePaidOrder

{
  /* <Flex gap={15}>
              <Flex className='homepage-report-icon' vertical={true} align='center' justify='center' >
              <FaMoneyBillTrendUp size={20} color='white'/>
              </Flex>
              <Flex justify='center' vertical={true}>
                <p>Product Name</p>
                <p className='homepage-report-order'>order: <span>123</span></p>
              </Flex>
</Flex> */
}
