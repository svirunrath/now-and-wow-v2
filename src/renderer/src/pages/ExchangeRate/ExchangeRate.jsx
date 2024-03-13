import "./ExchangeRate.css";
import { MdCurrencyExchange } from "react-icons/md";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, InputNumber, Select } from "antd";
import {
  useRegisterExchangeRateMutation,
  useGetExchangeRateQuery,
} from "../../slices/exchangeRateAPISlices.js";
import { toast } from "react-toastify";
import { setExchangeRate } from "../../slices/exchangeRateSlices.js";

const ExchangeRate = () => {
  const [from_currency, setFromCurrency] = useState("KHR");
  const [to_currency, setToCurrency] = useState("US Dollar");
  const { loading, error, data } = useGetExchangeRateQuery({
    exch_currency: from_currency,
  });
  const [base_xrt, setBaseXrt] = useState(0);
  const [isDefault, setIsDefault] = useState(false);

  const { exchangeRate } = useSelector((state) => state.exchangeRate);

  const dispatch = useDispatch();

  const [modifyExchangeRate] = useRegisterExchangeRateMutation();

  useEffect(() => {
    if (!isDefault) {
      if (data) {
        setBaseXrt(data.exch_rate.exch_base_xrt);
        setIsDefault(true);
      } else {
        setBaseXrt(exchangeRate);
        setIsDefault(true);
      }
    }
  });

  const mainCurrency = [
    { key: "khr", label: "Khmer Riel", tabIndex: 0, value: "KHR" },
  ];

  const handleSubmit = async (e) => {
    try {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

      const req = {
        exch_currency: from_currency,
        exch_description: "From " + from_currency + " To " + to_currency,
        exch_base_xrt: parseFloat(base_xrt),
        modified_by: userInfo.username,
        created_by: userInfo.username,
      };

      const res = await modifyExchangeRate(req).unwrap();

      dispatch(setExchangeRate(parseFloat(base_xrt)));

      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const onChangeHandler = (value) => {
    setBaseXrt(value);
  };

  return (
    <>
      <div className="exchMainContainer">
        <header className="exchMainHeader">
          Exchange Rate
          <div className="exchIcon">
            <MdCurrencyExchange></MdCurrencyExchange>
          </div>
        </header>
        <p className="exch-page-description">
          This page will be used to modify exchange rate.
        </p>
        <div className="exch-block">
          <Form
            name="add"
            style={{ maxWidth: 400, padding: 25 }}
            onFinish={handleSubmit}
            initialValues={{ ["from-currency"]: from_currency }}
          >
            <Form.Item label="Main Currency" name="from-currency">
              <Select
                dropdownStyle={{ backgroundColor: "#41486f", color: "white" }}
                style={{ width: 150, color: "white", backgroundColor: "black" }}
                placeholder="Main Category"
                optionFilterProp="children"
                value={mainCurrency[0]}
                filterOption={(input, option) =>
                  option?.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                options={mainCurrency}
              ></Select>
            </Form.Item>
            <Form.Item label="Currency Exchange" />
            <div className="exchInputContainer">
              <InputNumber
                value={base_xrt}
                onChange={onChangeHandler}
                type="number"
              />
              <p className="main-currency">{from_currency}</p>
              <p className="secondary-currency">= 1 {to_currency}</p>
            </div>
            <Form.Item style={{ marginTop: "5%" }}>
              <Button type="primary" htmlType="submit">
                Modify
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ExchangeRate;
