import React, { useState, useEffect, useContext, useRef } from 'react';

import { Input, Select, Form } from 'antd';
import EditInput from 'components/DesignSystem/EditInput';

// DesignSystem
// import { FullWindowAnimateStorage } from 'components/DesignSystem/FullWindow';
import { PopWindowAnimateStorage } from 'components/DesignSystem/PopWindow';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// css
import './style.datePicker.scss';
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const [startDate, setStartDate] = useState(new Date());
    const [msg, setMsg] = useState(record?.note);

    // const { closeAnimate, openAnimate } = useContext(FullWindowAnimateStorage);
    const { closeDialog, openDialog } = useContext(PopWindowAnimateStorage);

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
        { label: '網路問題', value: '網路問題' }, // oragnge icon
        { label: '退用', value: '退用' } // oragnge icon
    ];

    const inputNode =
        dataIndex == 'problem' || dataIndex == 'status' ? (
            <Select
                options={dataIndex == 'problem' ? problem : status}
                defaultValue={dataIndex == 'problem' ? record?.problem : record?.status}
                onChange={data => {
                    console.log(dataIndex, data);
                    record.status = data;
                }}
            />
        ) : dataIndex == 'statusUpdateTime' ? (
            <DatePicker
                className={cx('datePicker')}
                selected={startDate}
                onChange={date => {
                    setStartDate(date);
                    record.statusUpdateTime = date;
                }}
                showTimeSelect
                // showTimeInput
                timeFormat="HH:mm"
                dateFormat="yyyy/MM/dd HH:mm"
                placeholderText="請選擇時間"
            />
        ) : (
            <Input placeholder="請填寫備註(非必填)" value={msg} defaultValue="" onClick={() => openPopup()} />
        );

    const openPopup = () => {
        openDialog({
            component: <EditInput txt={record.note} send={(type, _msg) => sendMsg(type, _msg)} />
        });
    };

    const sendMsg = (type, _msg) => {
        if (type == 'yes') {
            record.note = _msg;
            setMsg(_msg);
        }

        closeDialog();
    };

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
                    // name={dataIndex}
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
