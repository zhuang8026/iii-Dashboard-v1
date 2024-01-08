import React, { Fragment, Suspense, useState, useEffect, useContext, useRef } from 'react';
import { withRouter } from 'react-router-dom';
import { Input, InputNumber, Select, Tag, Alert, Popconfirm, Form, Table, Typography, Button, Space } from 'antd';
// import Highlighter from 'react-highlight-words';
// import { SearchOutlined } from '@ant-design/icons';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import moment from 'moment';
// import { from } from 'rxjs';
// import axios from 'axios';

// DesignSystem
import { FullWindowAnimateStorage } from 'components/DesignSystem/FullWindow';
import { PopWindowAnimateStorage } from 'components/DesignSystem/PopWindow';
import Loading from 'components/DesignSystem/Loading';
import Message from 'components/DesignSystem/Message';
import UiCard from 'components/DesignSystem/Card';
import EditableCell from 'components/DesignSystem/EditableCell';
import TableSearch from 'components/DesignSystem/TableSearch';

// Context
import GlobalContainer, { GlobalContext } from 'contexts/global';
// API
import { getProblemStatus001API, getProblemStatus002API, postProblemStatus003API } from 'api/api';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Home = ({ match, history, location }) => {
    const [form] = Form.useForm();
    const [data, setData] = useState();
    const [card, setCard] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const fetchListener = useRef();

    const { closeAnimate, openAnimate } = useContext(FullWindowAnimateStorage);
    const { closeDialog, openDialog } = useContext(PopWindowAnimateStorage);
    const { REACT_APP_VERSION_2 } = useContext(GlobalContext);

    const isEditing = record => record.key === editingKey;
    const edit = record => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async key => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex(item => key === item.key);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row
                });

                newData.forEach(ele => {
                    ele.statusUpdateTime = ele.statusUpdateTime
                        ? moment(ele.statusUpdateTime).format('YYYY/MM/DD HH:mm')
                        : null;
                    ele.detectedDate = moment(ele.detectedDate).format('YYYY/MM/DD HH:mm');
                    return ele;
                });
                setData(newData);
                setEditingKey('');

                if (
                    newData[key].statusUpdateTime == 'Invalid date' ||
                    newData[key].statusUpdateTime == null ||
                    newData[key].statusUpdateTime == ''
                ) {
                    openMessage(400, '"處理時間" is required information.');
                    return;
                }

                await POST003API(newData[key]);
                await GET001API();
                await GET002API();
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    // open loading
    const openLoading = () => {
        openAnimate({
            component: <Loading />
        });
    };

    // close loading
    const closeLoading = () => closeAnimate();

    const openMessage = (code, msg) => {
        openDialog({
            component: <Message code={code} msg={msg} closeMessage={closeMessage} />
        });
    };

    const closeMessage = () => closeDialog();

    // get API 001
    const GET001API = async () => {
        openLoading();
        const res = await getProblemStatus001API();
        if (res.code === 200) {
            let tableItem = res.data.map((val, i) => {
                let updateTime = val.statusUpdateTime ? moment(val.statusUpdateTime).format('YYYY/MM/DD HH:mm') : '';
                return {
                    key: i.toString(),
                    uuid: val.uuid,
                    serialNumber: val.serialNumber,
                    name: val.name,
                    userId: val.userId,
                    detectedDate: moment(val.detectedDate).format('YYYY/MM/DD HH:mm'),
                    problem: val.problem,
                    status: val.status,
                    statusUpdateTime: updateTime,
                    note: val.note
                };
            });
            setData([...tableItem]);

            // 使用 reduce 函數對 problem 進行加總
            const problemSummary = res.data.reduce((summary, item) => {
                const { problem } = item;
                // 如果 problem 已經存在於加總中，則增加其數量；否則，初始化為 1
                summary[problem] = (summary[problem] || 0) + 1;
                return summary;
            }, {});

            // 將加總結果轉換為指定格式的陣列
            const resultProblem = Object.entries(problemSummary).map(([type, val]) => ({
                type,
                val
            }));

            // 使用 reduce 函數對 status 進行加總
            const statusSummary = res.data.reduce((summary, item) => {
                const { status } = item;
                // 如果 status 已經存在於加總中，則增加其數量；否則，初始化為 1
                summary[status] = (summary[status] || 0) + 1;
                return summary;
            }, {});

            // 將加總結果轉換為指定格式的陣列
            const resultStatus = Object.entries(statusSummary)
                .map(([type, val]) => {
                    let status;
                    switch (type) {
                        case '已完成':
                            status = 'safe';
                            break;
                        case '已通知':
                        case '已拆除':
                        case '等待維護':
                        case '不接受維護':
                            status = 'warning';
                            break;
                        case '未通知':
                            status = 'dangerous';
                            break;
                    }
                    return {
                        type,
                        val,
                        status
                    };
                })
                .sort((a, b) => {
                    // 自訂排序邏輯，'已完成'排第一，'未通知'排第二，其餘按照字母順序排序
                    if (a.type === '已完成') return -1;
                    if (b.type === '已完成') return 1;
                    if (a.type === '未通知') return -1;
                    if (b.type === '未通知') return 1;
                    return a.type.localeCompare(b.type);
                });

            // 綠色開發區塊（2塊）
            let card = [
                {
                    type: 'table',
                    title: '故障類別',
                    content: resultProblem
                },
                {
                    type: 'table',
                    title: '故障狀態',
                    content: resultStatus
                }
            ];
            setCard([...card]);
            setTimeout(() => {
                closeLoading();
            }, 1000);
        } else {
            console.log('GET001API error:', res);
        }
    };

    // get API 002
    const GET002API = async () => {
        const res = await getProblemStatus002API();
        if (res.code === 200) {
            let demo = [
                {
                    type: 'Compare',
                    title: '361戶',
                    content: [
                        {
                            type: '離線',
                            val: '87'
                        },
                        {
                            type: '連線',
                            val: '179'
                        }
                    ]
                },
                {
                    type: 'Compare',
                    title: '400戶',
                    content: [
                        {
                            type: '離線',
                            val: '63'
                        },
                        {
                            type: '連線',
                            val: '265'
                        }
                    ]
                },
                {
                    type: 'Compare',
                    title: '其他',
                    content: [
                        {
                            type: '離線',
                            val: '55'
                        },
                        {
                            type: '連線',
                            val: '96'
                        }
                    ]
                },
                {
                    type: 'Compare',
                    title: '總用戶',
                    content: [
                        {
                            type: '離線',
                            val: '205'
                        },
                        {
                            type: '連線',
                            val: '540'
                        }
                    ]
                }
            ];
            setCard(prev => {
                return [...prev, ...demo];
            });
        } else {
            console.log('GET002API error:', res);
        }
    };

    // save POST API 003
    const POST003API = async item => {
        // 将日期格式转换
        // item.detectedDate = moment(item.detectedDate, 'YYYY/MM/DD HH:mm').utcOffset('+08:00').toISOString();
        let playload = {
            userId: item.userId,
            uuid: item.uuid,
            serialNumber: item.serialNumber,
            problem: item.problem,
            status: item.status,
            statusUpdateTime: moment(item.statusUpdateTime, 'YYYY/MM/DD HH:mm').format('YYYY-MM-DDTHH:mm:ssZ'),
            note: item.note
        };
        const res = await postProblemStatus003API(playload);

        if (res.code === 200) {
            console.log('POST003API success');
        } else if (res.code === 409) {
            openMessage(res.code, `The message "${playload.userId}" has been repeated, thank you.`);
        } else {
            console.log('POST003API error');
            openMessage(res.code, res.message);
        }
    };

    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            width: '9%',
            editable: false, // 編輯控制
            ...TableSearch('name').getColumnSearchProps // 模糊搜索
        },
        {
            title: '帳號',
            dataIndex: 'userId',
            width: '12%',
            editable: false // 編輯控制
        },
        {
            title: '更新時間',
            dataIndex: 'detectedDate',
            width: '12%',
            editable: false, // 編輯控制
            sorter: (a, b) => {
                // 使用 Moment.js 解析日期字符串
                const preTime = moment(a.detectedDate, 'YYYY/MM/DD HH:mm');
                const backTime = moment(b.detectedDate, 'YYYY/MM/DD HH:mm');

                // 获取日期对象的时间戳（以秒为单位）
                const preSeconds = preTime.unix();
                const backSeconds = backTime.unix();

                return preSeconds - backSeconds;
            }
        },
        {
            title: '故障類別',
            dataIndex: 'problem',
            width: '9%',
            editable: false, // 編輯控制
            filters: [
                { text: '斷線', value: '斷線' },
                { text: '資料過少', value: '資料過少' },
                { text: '負值', value: '負值' }
            ],
            // filterMode: 'tree',
            // filterSearch: true,
            onFilter: (value, record) => {
                return record.problem.startsWith(value);
            }
        },
        {
            title: '處理狀態',
            dataIndex: 'status',
            width: '9%',
            editable: true, // 編輯控制
            filters: [
                { text: '已完成', value: '已完成' },
                { text: '未通知', value: '未通知' },
                { text: '已通知', value: '已通知' },
                { text: '已拆除', value: '已拆除' },
                { text: '等待維護', value: '等待維護' },
                { text: '不接受維護', value: '不接受維護' }
            ],
            // filterMode: 'tree',
            // filterSearch: true,
            onFilter: (value, record) => record.status.startsWith(value),
            render: tags => {
                return (
                    <span>
                        {[tags].map(tag => {
                            {
                                /* let color = tag.length > 5 ? 'red' : 'green'; */
                            }
                            let color = tag == '已完成' ? 'green' : tag == '未通知' ? 'red' : 'orange';
                            if (tag === 'loser') {
                                color = 'volcano';
                            }
                            return (
                                <Tag color={color} key={tag}>
                                    {tag.toUpperCase()}
                                </Tag>
                            );
                        })}
                    </span>
                );
            }
        },
        {
            title: '處理時間',
            dataIndex: 'statusUpdateTime',
            width: '12%',
            editable: true, // 編輯控制
            sorter: (a, b) => {
                const preTime = moment(a.statusUpdateTime, 'YYYY/MM/DD HH:mm');
                const backTime = moment(b.statusUpdateTime, 'YYYY/MM/DD HH:mm');

                // 获取日期对象的时间戳（以秒为单位）
                const preSeconds = preTime.unix();
                const backSeconds = backTime.unix();

                return preSeconds - backSeconds;
            }
        },
        {
            title: '備註',
            dataIndex: 'note',
            width: '16%',
            editable: true // 編輯控制
        },
        {
            title: '編輯',
            dataIndex: 'operation',
            width: '12%',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <span>
                        <Typography.Link
                            disabled={editingKey !== ''}
                            style={{ marginRight: 8 }}
                            onClick={() => edit(record)}
                        >
                            Edit
                        </Typography.Link>
                        <Typography.Link
                            disabled={editingKey !== ''}
                            onClick={() => {
                                history.push({
                                    ...location,
                                    pathname: `/main/event-detail/${record.serialNumber}`
                                });
                            }}
                        >
                            Detail
                        </Typography.Link>
                    </span>
                );
            }
        }
    ];
    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: record => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record)
            })
        };
    });

    useEffect(() => {
        // version 1
        GET001API();
        // version 2
        if (REACT_APP_VERSION_2) GET002API();
    }, []);
    return (
        <>
            <h1 className={cx('title')}>
                即時數據分析 <span> | 後一次更新 2023/12/20 14:41:29</span>
            </h1>
            <div className={cx('top_card')}>
                {card.length > 0
                    ? card.map((item, index) => (
                            <UiCard type={item.type} title={item.title} content={item.content} key={index} />
                        ))
                    : ''}
            </div>
            <div className={cx('home')}>
                <h1 className={cx('table_title')}>待處理異常紀錄</h1>
                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell
                            }
                        }}
                        bordered
                        dataSource={data}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        // pagination={false}
                        pagination={{
                            position: ['none', 'bottomLeft'],
                            defaultPageSize: 10, // 默认每页显示的数量
                            onChange: cancel
                        }}
                        onRow={record => {
                            return {
                                onClick: event => {
                                    // console.log('row click');
                                }, // 点击行
                                onDoubleClick: event => {},
                                onContextMenu: event => {},
                                onMouseEnter: event => {}, // 鼠标移入行
                                onMouseLeave: event => {}
                            };
                        }}
                    />
                </Form>
            </div>
        </>
    );
};

export default withRouter(Home);
