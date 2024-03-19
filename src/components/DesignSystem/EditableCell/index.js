import React, { useState, useEffect } from 'react';

import { Input, Select, Form } from 'antd';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// css
import './style.datePicker.scss';
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const [startDate, setStartDate] = useState(new Date());
    // const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    let problem = [
        { value: '斷線', label: '斷線' },
        { value: '資料過少', label: '資料過少' },
        { value: 'CT負值', label: 'CT負值' }
    ];

    let status = [
        { label: '已完成', value: '已完成' }, // green icon
        { label: '未通知', value: '未通知' }, // red icon
        { label: '已通知', value: '已通知' }, // oragnge icon
        { label: '已拆除', value: '已拆除' }, // oragnge icon
        { label: '等待維護', value: '等待維護' }, // oragnge icon
        { label: '不接受維護', value: '不接受維護' }, // oragnge icon
        { label: '已排外', value: '已排外' }, // oragnge icon
        { label: '退用', value: '退用' }, // oragnge icon
    ];

    const inputNode =
        dataIndex == 'problem' || dataIndex == 'status' ? (
            <Select options={dataIndex == 'problem' ? problem : status} />
        ) : dataIndex == 'statusUpdateTime' ? (
            <DatePicker
                className={cx('datePicker')}
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
            <Input placeholder="請填寫備註(非必填)" />
        );
    useEffect(() => {
        if (editing) {
            if (record.statusUpdateTime != '' && record.statusUpdateTime != 'Invalid date') {
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

export default EditableCell;
