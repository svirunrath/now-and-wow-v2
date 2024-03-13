import React from 'react';
import {Chart as ChartJS} from 'chart.js/auto';
import {Bar} from 'react-chartjs-2';


 const HomeGraph= ({setBarLabels, setBarData}) => {
    ChartJS.defaults.font.size = 13;
    ChartJS.defaults.font.family= 'Bahnschrift';
    ChartJS.defaults.font.weight=200;
    ChartJS.defaults.color='rgba(255, 255, 255,0.5)';
    ChartJS.defaults.borderSkipped=false;
    ChartJS.defaults.borderWidth=10;
    ChartJS.defaults.borderColor='rgba(255, 255, 255,0.1)';
    ChartJS.defaults.plugins.legend=true;
   return (
    <div className='homepage-graph-bar'>
     <Bar 
     borderWidth={5}
     backgroundColor={"white"}
     data={{
        labels:setBarLabels,
        datasets:[
            {
                label:"Orders",
                data:setBarData,
                backgroundColor:"rgba(65, 72, 111)",   
            }

        ]
     }}></Bar></div>
   )
 }
 
 export default HomeGraph