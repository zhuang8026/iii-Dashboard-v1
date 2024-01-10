import React, { useState, useEffect, useRef } from 'react';
// import { withRouter, Link, Redirect } from 'react-router-dom';

// echarts
import * as echarts from 'echarts';

// css
import classes from './style_module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

let demo = {
    title: {
        text: 'Line Chart'
    },
    tooltip: {
        trigger: 'axis'
    },
    color: ['#ff7c32', '#ffcb01', '#4bd0ce'] /* 折線圖的颜色 */,
    legend: {
        data: ['A item', 'B item', 'C item']
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false, // 座標軸兩邊留白
        // X 軸線 設定
        axisLine: {
            show: true,
            lineStyle: {
                color: '#B5B5B5',
                width: 1
            }
        },
        // 每條X軸的線
        splitLine: {
            show: true,
            lineStyle: {
                color: '#e3e8eb',
                width: 1
            }
        },
        // 刻度線
        axisTick: {
            show: true
        },
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value',
        // Y 軸線 設定
        axisLine: {
            show: true,
            lineStyle: {
                color: '#B5B5B5',
                width: 1
            }
        }
    },
    series: [
        {
            name: 'A item',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: 'B item',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: 'C item',
            type: 'line',
            stack: 'Total',
            data: [150, 232, 201, 154, 190, 330, 410]
        }
    ]
};

const LineChart = (optionItems = {}) => {
    const [option, setOption] = useState(demo);
    const chartDOM = useRef();
    const initChart = () => {
        let chartLine = echarts.init(chartDOM.current);
        chartLine.clear();
        setOption(optionItems);
        option && chartLine.setOption(option);
    };

    useEffect(() => {
        initChart();
    }, []);

    useEffect(() => {}, []);

    return <div id="chartLine" ref={chartDOM} />;
};

export default LineChart;
