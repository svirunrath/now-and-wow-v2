

const data =[
    {isSelected:"menu-cat-main-card", id:"menu1", name:"Perfume", item:1,productlist:1},
    {isSelected:"menu-cat-main-card", id:"menu2", name:"Chair", item:4,productlist:2},
    {isSelected:"menu-cat-main-card", id:"menu3", name:"Shampoo", item:2,productlist:1},
    {isSelected:"menu-cat-main-card", id:"menu4", name:"Lotion", item:1,productlist:2},
    {isSelected:"menu-cat-main-card", id:"menu5", name:"Skin Care", item:9,productlist:1},
    {isSelected:"menu-cat-main-card", id:"menu6", name:"Perfume", item:4,productlist:2},
    {isSelected:"menu-cat-main-card", id:"menu7", name:"Home Depo", item:5,productlist:1},
    {isSelected:"menu-cat-main-card", id:"menu8", name:"Watch", item:23,productlist:2},
    {isSelected:"menu-cat-main-card", id:"menu9", name:"Mask", item:50,productlist:1},
    {isSelected:"menu-cat-main-card", id:"menu10", name:"Table", item:1,productlist:1},
]
const Productdata =[
  {id:"pro1", name:"Chicken", quantity:12, price:15,image:"https://static.vecteezy.com/system/resources/previews/021/665/568/original/delicious-grilled-chicken-cutout-png.png"},
  {id:"pro2", name:"Chair", quantity:4, price:57,image:"https://picsum.photos/id/23/200/300"},
  {id:"pro3", name:"Shampoo", quantity:26, price:12,image:"https://picsum.photos/id/13/200/300"},
  {id:"pro4", name:"Lotion", quantity:11, price:23,image:"https://picsum.photos/id/11/200/300"},
  {id:"pro5", name:"Skin Care", quantity:7, price:78,image:"https://picsum.photos/id/11/200/300"},
  {id:"pro6", name:"Perfume", quantity:18, price:9,image:"https://picsum.photos/id/9/200/300"},
  {id:"pro7", name:"Home Depo", quantity:24, price:7.5,image:"https://picsum.photos/id/3/200/300"},
  {id:"pro8", name:"Watch", quantity:234, price:13,image:"https://picsum.photos/id/5/200/300"},
  {id:"pro9", name:"Mask", quantity:50, price:5,image:"https://picsum.photos/id/90/200/300"},
  {id:"pro10", name:"Table", quantity:5, price:400,image:"https://picsum.photos/id/200/200/300"},
]
export const selectDiscount=[
  {
    value: 10,
    label: 10,
  },
  {
    value: 20,
    label: 20,
  },
  {
    value: 30,
    label: 30,
  },
  {
    value: 40,
    label: 40,
  },
  {
    value: 50,
    label: 50,
  },
  {
    value: 60,
    label: 60,
  },
  {
    value: 70,
    label: 70,
  },
  {
    value: 80,
    label: 80,
  },
  {
    value: 90,
    label: 90,
  },
  {
    value: 100,
    label: 100,
  },
]

function sortByQuantity() {
    return function (data1, data2) {
      if (data1.quantity < data2.quantity) {
        return -1;
      } else if (data1.quantity > data2.quantity) {
        return 1;
      } else {
        return 0;
      }
    };
}
function sortById() {
  return function (data1, data2) {
    if (data1.id < data2.id) {
      return -1;
    } else if (data1.id > data2.id) {
      return 1;
    } else {
      return 0;
    }
  };
}
export let sortMenuData= data.sort(sortById());
export let sortProduct= Productdata.sort(sortByQuantity());
export let orderdata=[];

