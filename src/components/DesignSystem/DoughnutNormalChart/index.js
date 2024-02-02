import React, { useState, useEffect, useRef } from 'react';
// import { withRouter, Link, Redirect } from 'react-router-dom';

// echarts
import * as echarts from 'echarts';

// css
import classes from './style_module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const DoughnutNormalChart = ({ data }) => {
    const [options, setOptions] = useState({
        tooltip: {
            trigger: 'item',
            formatter: '{a}{b}: {c} ({d}%)' // 显示百分比
        },
        legend: {
            data: [],
            top: '5%',
            left: 'center'
        },
        color: ['#ff7c32', '#ffcb01', '#4bd0ce', '#2EA9DF', '#86C166', '#F17C67'] /* 折線圖的颜色 */,
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['60%', '90%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: false,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: data.map((ele)=> ({ value: Number(ele.val), name: ele.type })),
                // data: [
                //     { value: Number(data[0].val), name: `離線` },
                //     { value: Number(data[1].val), name: '連線' }
                //     // { value: Number(data[0].val) + Number(data[1].val), name: '總計' }
                // ]
            }
        ]
    });
    const chartDOM = useRef();

    const initChart = () => {
        let chartLine = echarts.init(chartDOM.current);
        chartLine.clear();
        options && chartLine.setOption(options);
    };

    useEffect(() => {
        initChart();
    }, []);

    useEffect(() => {}, []);

    return <div id="doughnutNormalChart" ref={chartDOM} />;
};

export default DoughnutNormalChart;
