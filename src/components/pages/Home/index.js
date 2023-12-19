import React, { Fragment, Suspense, useState, useEffect, useContext, useRef } from 'react';
import { Input, InputNumber, Select, Tag, Alert, Popconfirm, Form, Table, Typography } from 'antd';
// import { LoadingOutlined } from '@ant-design/icons';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import moment from 'moment';
// import { from } from 'rxjs';
// import axios from 'axios';

// DesignSystem
import { FullWindowAnimateStorage } from 'components/DesignSystem/FullWindow';
import Loading from 'components/DesignSystem/Loading';
import UiCard from 'components/DesignSystem/Card';

// API
import { test001API } from 'api/api';

// import { from } from 'rxjs';
// css
import './style.datepicker.scss';
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const [startDate, setStartDate] = useState(new Date());
    // const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    let problem = [
        { value: '斷線', label: '斷線' },
        { value: '資料過少', label: '資料過少' },
        { value: '負值', label: '負值' }
    ];

    let status = [
        { label: '已完成', value: '已完成' }, // green icon
        { label: '未通知', value: '未通知' }, // red icon
        { label: '已通知', value: '已通知' }, // oragnge icon
        { label: '已拆除', value: '已拆除' }, // oragnge icon
        { label: '等待維護', value: '等待維護' }, // oragnge icon
        { label: '不想被打擾', value: '不想被打擾' } // oragnge icon
    ];

    const inputNode =
        dataIndex == 'problem' || dataIndex == 'status' ? (
            <Select options={dataIndex == 'problem' ? problem : status} />
        ) : dataIndex == 'statusUpdateTime' ? (
            <DatePicker
                className={cx('rdatePicker')}
                selected={startDate}
                onChange={date => {
                    setStartDate(date);
                }}
                showTimeSelect
                // showTimeInput
                timeFormat="HH:mm"
                dateFormat="yyyy/MM/dd HH:mm"
                placeholderText="請選擇時間"
            />
        ) : (
            // <Input placeholder="1987/01/01 00:00" />
            <Input placeholder="Please fill in the remarks." />
        );
    useEffect(() => {
        if (editing) {
            if (record.statusUpdateTime != '') {
                setStartDate(new Date(record.statusUpdateTime));
            }
        }
    }, [editing]);
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: `請填寫 "${title}"`
                    //     }
                    // ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

const Home = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState();
    const [card, setCard] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const fetchListener = useRef();

    const { closeAnimate, openAnimate } = useContext(FullWindowAnimateStorage);

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
                    ele.statusUpdateTime = moment(ele.statusUpdateTime).format('YYYY/MM/DD HH:mm');
                    ele.detectedDate = moment(ele.detectedDate).format('YYYY/MM/DD HH:mm');
                    return ele;
                });
                setData(newData);
                setEditingKey('');
                console.log(newData);
                await apiDemo3(newData[key]);
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };
    const columns = [
        {
            title: '姓名',
            dataIndex: 'name',
            width: '9%',
            editable: false
        },
        {
            title: '帳號',
            dataIndex: 'userId',
            width: '12%',
            editable: false
        },
        {
            title: '更新時間',
            dataIndex: 'detectedDate',
            width: '12%',
            editable: false,
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
            editable: true,
            filters: [
                { text: '斷線', value: '斷線' },
                { text: '資料過少', value: '資料過少' },
                { text: '負值', value: '負值' }
            ],
            // filterMode: 'tree',
            // filterSearch: true,
            onFilter: (value, record) => {
                console.log(value, record);
                return record.problem.startsWith(value);
            }
        },
        {
            title: '處理狀態',
            dataIndex: 'status',
            width: '9%',
            editable: true,
            filters: [
                { text: '已完成', value: '已完成' },
                { text: '未通知', value: '未通知' },
                { text: '已通知', value: '已通知' },
                { text: '已拆除', value: '已拆除' },
                { text: '等待維護', value: '等待維護' },
                { text: '不想被打擾', value: '不想被打擾' }
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
            editable: true,
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
            editable: true
        },
        {
            title: '編輯',
            dataIndex: 'operation',
            width: '12%',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8
                            }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
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

    // open loading
    const openLoading = () => {
        openAnimate({
            component: <Loading />
        });
    };

    // close loading
    const closeLoading = () => closeAnimate();

    // get API 001
    const apiDemo = async () => {
        openLoading();
        const res = await test001API();
        if (res.code === 200) {
            let tableItem = res.data.map((val, i) => {
                return {
                    key: i.toString(),
                    uuid: val.uuid,
                    name: val.name,
                    userId: val.userId,
                    detectedDate: moment(val.detectedDate).format('YYYY/MM/DD HH:mm'),
                    problem: val.problem,
                    status: val.status,
                    statusUpdateTime: moment(val.statusUpdateTime).format('YYYY/MM/DD HH:mm'),
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
            const resultStatus = Object.entries(statusSummary).map(([type, val]) => ({
                type,
                val
            }));

            // 綠色開發區塊（2塊）
            card.push(
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
            );
            setCard([...card]);
            setTimeout(() => {
                closeLoading();
            }, 1000);
        } else {
            console.log('apiDemo error');
        }
    };

    // get API 002
    const apiDemo2 = async () => {
        const res = await test001API();
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
            card.push(...demo);
            setCard([...card]);
        } else {
            console.log('apiDemo2 error');
        }
    };

    // save API 003
    const apiDemo3 = async item => {
        // 将日期格式转换
        // item.detectedDate = moment(item.detectedDate, 'YYYY/MM/DD HH:mm').utcOffset('+08:00').toISOString();
        // item.statusUpdateTime = moment(item.statusUpdateTime, 'YYYY/MM/DD HH:mm').utcOffset('+08:00').toISOString();
        // console.log('save:', item);
    };
    useEffect(() => {
        // version 1
        apiDemo();

        // version 2
        // apiDemo2();
    }, []);

    return (
        <>
            {/* 361戶:離線87,連線179； 400戶:離線63,連線265； 其他:離線55,連線96；總離線+總連線 = 205戶+540戶 = 745戶 */}
            <div className={cx('top_card')}>
                {card.length > 0
                    ? card.map((item, index) => (
                          <UiCard type={item.type} title={item.title} content={item.content} key={index} />
                      ))
                    : ''}
            </div>
            <div className={cx('home')}>
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

export default Home;
