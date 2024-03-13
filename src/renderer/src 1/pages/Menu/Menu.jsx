import React from 'react';
import { useState, useEffect } from 'react';
import { Button, Flex, Modal, Empty, Select } from "antd";
import { Carousel } from 'antd';
import "./Menu.css"
import MenuOrder from './MenuOrder';
import Scrollbars from 'react-custom-scrollbars-2';
import { Input } from 'antd';
import MenuCat from './MenuCat';
import { sortMenuData, orderdata, sortProduct,selectDiscount } from './MenuTemp';
import MenuItem from './MenuItem';
import { FaPercentage } from "react-icons/fa";

const onSearch = (value, _e, info) => console.log(info?.source, value);
const { Search } = Input;

//**** NOTE: I have not made color transition of selected category as im still looking for the solution.
// It wont make transition on page 2 of carousel which is super annoying

const Menu = () => {

    const NewData = sortProduct.slice(0);
    const ExchangeRiel = 4100;
    const [menuItem, setMenuItem] = useState(sortMenuData)
    const [orderId, setOrderId] = useState(0);
    const [product, setProduct] = useState([...NewData]);
    const [order, setOrder] = useState([]);
    const [recievedDollar, setRecievedDollar] = useState();
    const [recievedRiel, setRecievedRiel] = useState();
    const [discount, setDiscount] = useState();
    const [open, setOpen] = useState(false);
    const [showProduct, setShowProduct] = useState(false);

    //Select Product
    function changeMenuItem(id) {
        setShowProduct(true)
        const newProductData = [...menuItem]
        const Item = newProductData.find(Item => Item.id === id);

        for (let i = 0; i < newProductData.length; i++) {
            if (newProductData[i].id !== Item.id) {
                newProductData[i].isSelected = "menu-cat-main-card";
            }
            else {
                newProductData[i].isSelected = "menu-cat-main-card menu-cat-main-card-active";
            }
        }
        setMenuItem(newProductData);
    }

    // Delete Order
    function orderDelete(itemName) {
        const newProductData = [...NewData]
        const Item = order.find(Item => Item.name === itemName);
        const productItem = newProductData.find(productItem => productItem.name === itemName);
        let a = productItem.quantity + Item.quantity;
        productItem.quantity = a;
        setOrder(order.filter(e => e.id !== Item.id))
        setProduct(newProductData);
    }
    //increment and decrement
    function increment(itemName) {
        const Item = NewData.find(Item => Item.name === itemName);
        if (Item.quantity > 0) {
            if (order.length == 0) {
                order.push({
                    discount: '', id: `order ${orderId}`, name: Item.name, quantity: 1, price: Item.price
                })
                setOrderId(orderId + 1);
            } else if (order.length > 0) {
                console.log("2");
                const containsdata = order.some((order) => order.name === itemName);
                if (containsdata) {
                    let index = order.find((item) => item.name === itemName);
                    index.quantity++
                } else
                    order.push({
                        discount: '', id: `order ${orderId}`, name: Item.name, quantity: 1, price: Item.price
                    })
                setOrderId(orderId + 1);
            }
        }
        if (Item.quantity > 0) {
            Item.quantity--;
        }
        setProduct([...NewData]);
        console.log(order)
    }
    function decrement(itemName) {
        const newProductData = [...NewData]
        const Item = newProductData.find(Item => Item.name === itemName);

        Item.quantity++;
        //we need original data to compare with temp array, so that it can stop at original value.
        //when it stops at original value, we can filter/remove them from "Order list"
        //since array is referencing value, i cant compare betweens the arrays becuz all of them are updated if one is updated.
        setProduct(newProductData);
        if (order.length == 0) {
            console.log("out of stock")
        } else if (order.length > 0) {
            const containsdata = order.some((order) => order.name === itemName);
            if (containsdata) {
                let index = order.find((item) => item.name === itemName);
                index.quantity--;
            } else
                order.push({
                    id: `order ${orderId}`, name: Item.name, quantity: 1, price: Item.price
                })
        }
    }
    //Discount Each
    function discountEach(id, dis) {
        const newOrderData = [...order]
        console.log(newOrderData);
        const Item = newOrderData.find(Item => Item.id === id);
        let a = document.getElementById("input-" + id)
        a.value = dis
        Item.discount = a.value
        setOrder(newOrderData);
        console.log(Item)
    }

    // PAYMENT CACULATION
    // Im sure there's a cleaner way and more easier way to do this
    let sum = 0;

    if (order.length > 0)
        order.forEach(item => {
            sum += (item.price * item.quantity) * ((100 - item.discount) / 100);
        });
    //Subtotal
    var subtotalRiel = (sum * ExchangeRiel).toFixed(2)
    var subtotalDollar = sum.toFixed(2)
    //Discount
    let discountRiels = ((sum * ExchangeRiel * discount) / 100).toFixed(2)
    let discountDollars = ((sum * discount) / 100).toFixed(2)
    //Total
    let totalRiel = ((sum * ExchangeRiel) - ((sum * ExchangeRiel * discount) / 100)).toFixed(2)
    let totalDollar = (sum - ((sum * discount) / 100)).toFixed(2)
    //Recieved
    let dollar = recievedDollar * 1
    let riel = recievedRiel / ExchangeRiel;
    let payrecievedDollar = (dollar + riel).toFixed(2)
    let payrecievedRiel = (payrecievedDollar * ExchangeRiel).toFixed(2)
    //Change
    let change = recievedDollar - totalDollar
    let changeRiel = (change * ExchangeRiel).toFixed(2)
    let changeDollar = (change).toFixed(2)

    return (
        <>
            <div className='menu-container'>
                <div className='menu-cat-wrapper menu-wrapper'>
                    <div className='menu-cat-header menu-cat-el'>
                        <Search className="menu-cat-search " placeholder="input search text" onSearch={onSearch} enterButton />
                    </div>
                    <div className='menu-cat-main menu-cat-el'>
                        <div className="menu-main-list">
                            <Carousel className="menu-main-slider"
                                rows={2}
                                slidesPerRow={4}
                                draggable
                                dots={{ className: "menu-slider-dots" }}
                                speed={800}>
                                {sortMenuData.map((a) =>
                                    <div>
                                        <MenuItem
                                            key={a.id}
                                            setProductArray={a}
                                            setSelect={() => changeMenuItem(a.id)}
                                        /></div>)}
                            </Carousel>
                        </div>
                    </div>
                    <div className='menu-cat-sub menu-cat-el'>
                        <div className="menu-main-list">

                            {showProduct == false ?
                                <Empty
                                    imageStyle={{ opacity: 0.2 }}
                                    description={
                                        <span style={{ color: "white" }}>
                                            No data
                                        </span>} />
                                :
                                // we need to setProduct() according to Category list.
                                <Carousel className="menu-main-slider"
                                    rows={2}
                                    slidesPerRow={4}
                                    draggable
                                    dots={{ className: "menu-slider-dots" }}
                                    speed={800}>
                                    {product.map((a) =>
                                        <div>
                                            <MenuCat
                                                key={a.id}
                                                setProductArray={a}
                                                orderDecrement={() => decrement(a.name)}
                                                orderIncrement={() => increment(a.name)} /></div>)}
                                </Carousel>}
                        </div>
                    </div>
                </div>
                <div className='menu-order-wrapper menu-wrapper'>
                    <div className=' menu-order-el menu-order-header'>
                        <div className='menu-order-name-box'>
                            <p className='menu-order-name'>Order 1</p>
                            <p className='menu-order-price'>user name</p>
                        </div>
                    </div>
                    <Scrollbars className='menu-order-body menu-order-el'
                        renderTrackVertical={({ style, ...props }) =>
                            <div {...props} style={{ ...style, backgroundColor: '#2d2e31', right: '0px', bottom: '0px', top: '0px', width: '5px', borderRadius: 2 }} />}
                        renderThumbVertical={({ style, ...props }) =>
                            <div {...props} style={{ ...style, width: '20px', height: 2, borderRadius: '3px', boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.16)', backgroundColor: '#41486f' }} />}>
                        <div className='menu-order-body-inside'>
                            {
                                order.map((neworderdata) =>
                                    <MenuOrder
                                        setOrderDiscount={e => discountEach(neworderdata.id, e.target.value)}
                                        orderdata={neworderdata}
                                        setDeleteOrder={() => orderDelete(neworderdata.name)} />)
                            }
                        </div>
                    </Scrollbars>
                    <div className='menu-order-payment menu-order-el'>
                        <div className='menu-order-payment-box'>
                            <div className='menu-order-total-box'><p>Subtotal:</p>
                                <div className='menu-order-total-currency'>
                                    <p>{subtotalDollar} $</p>
                                    <p>{subtotalRiel} R</p>
                                </div>
                            </div>
                            <Flex className='menu-payment-btn-box'>
                                <p>Recieved:</p>
                                <Input
                                    placeholder="0" 
                                    type='number'
                                    size='small'
                                    id='totalDiscount'
                                    value={recievedDollar}
                                    onChange={e => setRecievedDollar(e.target.value)}
                                    suffix={"$"}
                                    style={{ fontSize: 15, fontWeight: 'bold', maxWidth: "50%", textAlign: "center" }} />
                                <Input 
                                    placeholder="0"
                                    type='number'
                                    size='small'
                                    id='totalDiscount'
                                    value={recievedRiel}
                                    onChange={e => setRecievedRiel(e.target.value)}
                                    suffix={"R"}
                                    style={{ fontSize: 15, fontWeight: 'bold', maxWidth: "50%", textAlign: "center" }} />
                            </Flex>
                            <Flex className='menu-payment-btn-box'>
                                <p>Discount:</p>
                                <Select
                                
                                labelInValue:true
                                showSearch
                                style={{
                                width: "25%",
                                }}
                                placeholder="Search to Select"
                                optionFilterProp="children"
                                options={selectDiscount}
                                onChange={(label) => {
                                    setDiscount(label)
                                  }} 
                                ></Select>
                                {/* <Input
                                    placeholder="0" 
                                    type='number'
                                    id='totalDiscount'
                                    value={discount}
                                    onChange={e => setDiscount(e.target.value)}
                                    suffix={"%"}
                                    style={{ fontSize: 15, fontWeight: 'bold', width: "20%", textAlign: "center" }} /> */}
                            </Flex>
                            <Flex className='menu-payment-btn-box'>
                                <Button className='menu-payment-btn' type="primary" block danger>Cancel </Button>
                                <Button className='menu-payment-btn' type="primary" block onClick={() => setOpen(true)}>Payment </Button>
                            </Flex>

                        </div>
                    </div>
                </div>
            </div>
            <Modal
                className='menu-modal-payment-box'
                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={"35%"}
                cancelButtonProps={{ danger: "true", type: "primary" }}>
                <div className='menu-modal-payment'>
                    <div className='menu-modal-total-box'>
                        <div className='menu-modal-total'><p>Subtotal:</p>
                            <div className='menu-modal-total-currency'>
                                <p>{subtotalDollar} $</p>
                                <p>{subtotalRiel} R</p>
                            </div>
                        </div>
                    </div>
                    <div className='menu-modal-total-box'>
                        <div className='menu-modal-total'><p>Discount:</p>
                            <div className='menu-modal-discount-currency'>
                                <p> {discount} %</p>
                                <p> -{discountDollars} $</p>
                                <p> -{discountRiels} R</p>
                            </div>
                        </div>
                    </div>
                    <div className='menu-modal-total-box'>
                        <div className='menu-modal-total'><p>Total:</p>
                            <div className='menu-modal-total-currency'>
                                <p>{totalDollar} $</p>
                                <p>{totalRiel} R</p>
                            </div>
                        </div>
                    </div>
                    <div className='menu-modal-total-box'>
                        <div className='menu-modal-total'><p>Recieved:</p>
                            <div className='menu-modal-total-currency'>
                                <p>{payrecievedDollar} $</p>
                                <p>{payrecievedRiel} R</p>
                            </div>
                        </div>
                    </div>
                    <div className='menu-modal-total-box'>
                        <div className='menu-modal-total'><p>Change:</p>
                            <div className='menu-modal-total-currency'>
                                <p>{changeDollar} $</p>
                                <p>{changeRiel} R</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Menu;