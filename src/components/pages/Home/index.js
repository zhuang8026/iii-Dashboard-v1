import React, { Fragment, Suspense, useState, useEffect, useContext } from 'react';
import { Input, InputNumber, Select, DatePicker, Popconfirm, Form, Table, Typography } from 'antd';

import moment from 'moment';

import MOCK_DATA from './mock.json';
// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const originData = [];
JSON.parse(JSON.stringify(MOCK_DATA)).forEach((val, i) => {
    originData.push({
        key: i.toString(),
        name: val.name,
        user_id: val.user_id,
        detected_date: val.detected_date,
        problem: val.problem,
        status: val.status,
        status_update_time: val.status_update_time,
        note: val.note
    });
});

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    // const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    let problem = [
        { value: '斷線', label: '斷線' },
        { value: '資料過少', label: '資料過少' },
        { value: '負值', label: '負值' }
    ];

    let status = [
        { label: '已通知', value: '已通知' },
        { label: '未通知', value: '未通知' },
        { label: '已拆除', value: '已拆除' },
        { label: '等待維護', value: '等待維護' },
        { label: '不想被打擾', value: '不想被打擾' }
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
    const [data, setData] = useState(originData);
    const [editingKey, setEditingKey] = useState('');
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
                {
                    text: '斷線',
                    value: '斷線'
                },
                {
                    text: '資料過少',
                    value: '資料過少'
                },
                {
                    text: '負值',
                    value: '負值'
                }
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
                {
                    text: '已通知',
                    value: '已通知'
                },
                {
                    text: '未通知',
                    value: '未通知'
                },
                {
                    text: '已拆除',
                    value: '已拆除'
                },
                {
                    text: '等待維護',
                    value: '等待維護'
                },
                {
                    text: '不想被打擾',
                    value: '不想被打擾'
                }
            ],
            // filterMode: 'tree',
            // filterSearch: true,
            onFilter: (value, record) => record.status.startsWith(value)
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

    return (
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
                        defaultPageSize: 13, // 默认每页显示的数量
                        onChange: cancel
                    }}
                />
            </Form>
        </div>
    );
};

export default Home;
