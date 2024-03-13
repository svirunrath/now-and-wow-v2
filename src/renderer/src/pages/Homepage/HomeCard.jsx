import React from "react";
import { Button, Flex, Segmented } from "antd";

const HomeCard = ({ homepageCard }) => {
  return (
    <>
      {homepageCard.map((a) => {
        const Riel = "R ";
        const IconAny = a.icon;
        return (
          <div className="homepage-card-el homepage-revenue">
            <Flex
              vertical={true}
              justify="space-between"
              align="left"
              style={{ height: "100%" }}
            >
              <Flex
                className="homepage-icon"
                vertical={true}
                align="center"
                justify="center"
              >
                <IconAny size={25} color="white" />
              </Flex>
              <Flex vertical={true} gap={5}>
                <p style={{ fontWeight: 200, fontSize: 15 }}>{a.name}</p>
                <p style={{ fontSize: 35 }}>
                  {a.unit}
                  {a.number}
                </p>
              </Flex>
            </Flex>
          </div>
        );
      })}
    </>
  );
};

export default HomeCard;
