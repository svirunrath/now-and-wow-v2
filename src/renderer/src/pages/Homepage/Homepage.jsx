import React from 'react'
import { useState } from 'react'
import { Flex, Select } from 'antd'
import Scrollbars from 'react-custom-scrollbars-2'
//Components
import HomeCard from './HomeCard'
import HomeReport from './HomeReport'
import HomePaidOrder from './HomePaidOrder'
import HomeGraph from './HomeGraph'
import './Homepage.css'
//icons
import { PiMoneyFill } from 'react-icons/pi'
import { FaMoneyBillTransfer } from 'react-icons/fa6'
import { FaBoxesStacked } from 'react-icons/fa6'
import { FaPiggyBank } from 'react-icons/fa6'
import { FaBoxesPacking, FaMoneyCheck } from 'react-icons/fa6'
import { useRetrieveSaleSummaryQuery } from '../../slices/saleSlices'

import {
  useRetrieveTodayItemSoldQuery,
  useRetrieveUnpaidOrderQuery,
  useUpdatePaidOrderMutation
} from '../../slices/saleSlices'
import { toast } from 'react-toastify'

//Graph Data
let weeklabel = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
function randomMonthOrder() {
  return Math.floor(Math.random() * 100)
}
const monthlabel = []
const monthOrder = []
for (let i = 1; i <= 31; i++) {
  monthlabel.push(i)
  monthOrder.push(randomMonthOrder())
}

//Graph Options
const items = [
  {
    label: 'This Week',
    value: '1'
  },
  {
    label: 'This Month',
    value: '2'
  }
]
const Homepage = () => {
  let homepageReport = []
  let homepagePaidOrder = []
  let homepageCard = []
  const {
    data: todayItemCountData,
    isLoading: todayItemIsLoading,
    refetch: todayItemRefetch
  } = useRetrieveTodayItemSoldQuery()
  const {
    data: unpaidData,
    isLoading: unpaidIsLoading,
    refetch: unpaidRefetch
  } = useRetrieveUnpaidOrderQuery()
  const [loadings, setLoadings] = useState([])
  const [graphBar, setGraphBar] = useState(weeklabel)
  const [updatePaidOrder] = useUpdatePaidOrderMutation()
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

  const { data, isLoading, refetch } = useRetrieveSaleSummaryQuery()

  if (!isLoading && data) {
    let summary = data.sale
    homepageCard = [
      {
        icon: FaBoxesStacked,
        name: `Today's Orders`,
        number: Number(summary.todayOrder),
        unit: ''
      },
      {
        icon: FaBoxesStacked,
        name: `Today's Unpaid Orders`,
        number: Number(summary.todayUnpaidOrder),
        unit: ''
      },
      {
        icon: PiMoneyFill,
        name: `Today's Upsale`,
        number: Number(summary.todayAmount),
        unit: '$'
      },
      {
        icon: FaMoneyBillTransfer,
        name: `Yesterday's Upsale`,
        number: Number(summary.yesterdayAmount),
        unit: '$'
      },
      {
        icon: FaPiggyBank,
        name: `This Month Sale`,
        number: Number(summary.thisMonthAmount),
        unit: '$'
      },
      {
        icon: FaBoxesPacking,
        name: `Last Month Sale`,
        number: Number(summary.lastMonthAmount),
        unit: '$'
      }
    ]
  }

  if (!todayItemIsLoading && todayItemCountData) {
    for (let i = 0; i < todayItemCountData.sale.length; i++) {
      let itemData = todayItemCountData.sale[i]

      homepageReport.push({
        name: itemData.product_name,
        icon: itemData.image_path,
        number: itemData.product_qty,
        unit_name: itemData.unit_name
      })
    }
  }

  if (!unpaidIsLoading && unpaidData) {
    for (let i = 0; i < unpaidData.sale.length; i++) {
      let itemData = unpaidData.sale[i]

      homepagePaidOrder.push({
        paid: false,
        icon: FaMoneyCheck,
        orderid: itemData.sale_id,
        saleDate: new Date(itemData.sale_date).toLocaleDateString('en-GB'),
        orderprice: itemData.sale_total_price,
        remaining: itemData.payment_remaining
      })
    }
  }

  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings]
      newLoadings[index] = true
      return newLoadings
    })
    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings]
        newLoadings[index] = false
        return newLoadings
      })
    }, 500)
  }

  async function paidOrder(id, e) {
    enterLoading(e)

    setTimeout(async () => {
      const newReport = [...homepagePaidOrder]
      let item = newReport.find((item) => item.orderid === id)

      const res = await updatePaidOrder({
        sale_id: item.orderid,
        modified_by: userInfo.username
      })

      if (res) {
        toast.success('This order is already been paid.')
        await unpaidRefetch()
        await refetch()
      }
    }, 500)
  }
  return (
    <div className="homepage-container">
      <div className="homepage-wrapper homepage-header">
        <p> Homepage</p>
      </div>
      <div className="homepage-wrapper homepage-sale">
        <HomeCard homepageCard={homepageCard} />
      </div>
      <div className="homepage-wrapper homepage-data">
        <div className="homepage-card-el homepage-report">
          <Flex justify="space-between">
            <p>Today's Items Sold</p>
            <Flex gap={10}></Flex>
          </Flex>
          <Scrollbars
            renderTrackVertical={({ style, ...props }) => (
              <div
                {...props}
                style={{
                  ...style,
                  backgroundColor: '#2d2e31',
                  right: '0px',
                  bottom: '0px',
                  top: '0px',
                  width: '0px',
                  borderRadius: 2
                }}
              />
            )}
            renderThumbVertical={({ style, ...props }) => (
              <div
                {...props}
                style={{
                  ...style,
                  width: '20px',
                  height: 2,
                  borderRadius: '3px',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.16)',
                  backgroundColor: '#41486f'
                }}
              />
            )}
          >
            <div className="homepage-report-body">
              {homepageReport.map((a, index) => (
                <HomeReport setHomepageOrder={a}></HomeReport>
              ))}
            </div>
          </Scrollbars>
        </div>
        <div className="homepage-card-el homepage-paidorder">
          <Flex justify="space-between">
            <p style={{ height: '100%' }}>Unpaid Order</p>
            {!isLoading ? (
              <p style={{ height: '100%' }}>Order Count: {data.sale.unpaidOrder}</p>
            ) : null}
            <Flex gap={10}></Flex>
          </Flex>
          <Scrollbars
            renderTrackVertical={({ style, ...props }) => (
              <div
                {...props}
                style={{
                  ...style,
                  backgroundColor: '#2d2e31',
                  right: '0px',
                  bottom: '0px',
                  top: '0px',
                  width: '0px',
                  borderRadius: 2
                }}
              />
            )}
            renderThumbVertical={({ style, ...props }) => (
              <div
                {...props}
                style={{
                  ...style,
                  width: '20px',
                  height: 2,
                  borderRadius: '3px',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.16)',
                  backgroundColor: '#41486f'
                }}
              />
            )}
          >
            <div className="homepage-paidorder-body">
              {homepagePaidOrder.map((a, index) => (
                <HomePaidOrder
                  setHomepageOrder={a}
                  setPaidOrder={() => paidOrder(a.orderid, index)}
                  setLoading={loadings[index]}
                ></HomePaidOrder>
              ))}
            </div>
          </Scrollbars>
        </div>
        <div className="homepage-card-el homepage-graph">
          <Flex justify="space-between">
            <p>Accepted Orders</p>
            <Select
              labelInValue:true
              defaultValue={items[0].label}
              style={{ width: 120 }}
              options={items}
              onSelect={(value) =>
                value == items[1].value ? setGraphBar(monthlabel) : setGraphBar(weeklabel)
              }
            />
          </Flex>
          <HomeGraph
            setBarLabels={graphBar}
            //setBarData={monthOrder}
          ></HomeGraph>
        </div>
      </div>
    </div>
  )
}

export default Homepage
