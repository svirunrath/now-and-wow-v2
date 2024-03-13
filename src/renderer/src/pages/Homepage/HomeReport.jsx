import React from "react";
import { Button, Flex, Segmented } from "antd";
import { FaCheck } from "react-icons/fa";

const HomeReport = ({ setHomepageOrder, setPaidOrder, setLoading }) => {
  console.log(setHomepageOrder);
  return (
    <Flex justify="space-between">
      <Flex gap={15}>
        <Flex
          className="homepage-report-icon"
          vertical={true}
          style={{ height: "100%" }}
          align="center"
          justify="center"
        >
          <img src={setHomepageOrder.icon} width={20} height={20}></img>
        </Flex>
        <Flex
          justify="space-between"
          vertical={true}
          style={{ height: "100%" }}
        >
          <p>{setHomepageOrder.name}</p>
          <p className="homepage-report-order">
            Sold:
            <span style={{ paddingLeft: 5 }}>
              {setHomepageOrder.number} {setHomepageOrder.unit_name}(s)
            </span>
          </p>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default HomeReport;

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
