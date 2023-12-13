import React, { Fragment, Suspense, useState, useEffect, useContext, useRef } from 'react';
import { Input, InputNumber, Select, DatePicker, Tag, Spin, Alert, Popconfirm, Form, Table, Typography } from 'antd';
// import { LoadingOutlined } from '@ant-design/icons';

import moment from 'moment';
// import { from } from 'rxjs';
// import axios from 'axios';

// DesignSystem
import { FullWindowAnimateStorage } from 'components/DesignSystem/FullWindow';
import Loading from 'components/DesignSystem/Loading';

// API
import { test001API } from 'api/api';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

// const originData = [];
// JSON.parse(JSON.stringify(MOCK_DATA)).forEach((val, i) => {
//     originData.push({
//         key: i.toString(),
//         name: val.name,
//         user_id: val.user_id,
//         detected_date: val.detected_date,
//         problem: val.problem,
//         status: val.status,
//         status_update_time: val.status_update_time,
//         note: val.note
//     });
// });

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
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
        ) : dataIndex == 'status_update_time' ? (
            <Input />
        ) : (
            <Input />
        );
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0
                    }}
                    rules={[
                        {
                            required: true,
                            message: `請填寫 "${title}"`
                        }
                    ]}
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
                setData(newData);
                setEditingKey('');
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
            dataIndex: 'user_id',
            width: '12%',
            editable: false
        },
        {
            title: '更新時間',
            dataIndex: 'detected_date',
            width: '12%',
            editable: false,
            sorter: (a, b) => {
                // 使用 Moment.js 解析日期字符串
                const preTime = moment(a.detected_date, 'YYYY/MM/DD HH:mm');
                const backTime = moment(b.detected_date, 'YYYY/MM/DD HH:mm');

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
            dataIndex: 'status_update_time',
            width: '12%',
            editable: true,
            sorter: (a, b) => {
                const preTime = moment(a.status_update_time, 'YYYY/MM/DD HH:mm');
                const backTime = moment(b.status_update_time, 'YYYY/MM/DD HH:mm');

                // 获取日期对象的时间戳（以秒为单位）
                const preSeconds = preTime.unix();
                const backSeconds = backTime.unix();

                return preSeconds - backSeconds;
            }
        },
        {
            title: '記事',
            dataIndex: 'note',
            width: '16%',
            editable: true
        },
        {
            title: 'operation',
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

    const openLoading = () => {
        openAnimate({
            component: <Loading />
        });
    };

    const closeLoading = () => closeAnimate();

    // allpens001
    const apiDemo = async () => {
        openLoading();
        const res = await test001API();
        console.log('api:', res);
        if (res.code === 200) {
            let tableItem = res.data.map((val, i) => {
                return {
                    key: i.toString(),
                    name: val.name,
                    user_id: val.user_id,
                    detected_date: val.detected_date,
                    problem: val.problem,
                    status: val.status,
                    status_update_time: val.status_update_time,
                    note: val.note
                };
            });
            setData([...tableItem]);
            setTimeout(() => {
                closeLoading();
            }, 3000);
        } else {
            console.log('error');
        }
    };

    useEffect(() => {
        apiDemo();
    }, []);

    return (
        <div className={cx('home')}>
            <Form form={form} component={false}>
                <Table
                    // loading={{
                    //     indicator: <Spin size="large" style={{ marginLeft: '20px' }} />,  // 在這裡設定 loading icon
                    //     spinning: loading // 控制是否顯示 loading icon，可以根據需要設定為 true 或 false
                    // }}
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
                        defaultPageSize: 13, // 默认每页显示的数量
                        onChange: cancel
                    }}
                    onRow={record => {
                        return {
                            onClick: event => {
                                console.log('row click', record);
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
    );
};

export default Home;
