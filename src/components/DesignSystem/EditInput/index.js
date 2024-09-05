import React, { useState, useEffect, useRef } from 'react';
// import { withRouter, Link, Redirect } from 'react-router-dom';

import UiButton from 'components/DesignSystem/Button';

// antd
import { Input } from 'antd';
// import { LoadingOutlined } from '@ant-design/icons';

// css
import classes from './style_module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const EditInput = ({ txt, send }) => {
    const { TextArea } = Input;
    const [text, setText] = useState(txt);
    const editMsgFun = data => {
        setText(data);
    };

    return (
        <div className={cx('message_bg')}>
            <div className={cx('message')}>
                <div className={cx('title')}>備註</div>
                <div className={cx('inner')}>
                    <div className={cx('msg')}>
                        <TextArea
                            rows={5}
                            value={text}
                            placeholder="請填寫備註(非必填)"
                            onChange={data => {
                                editMsgFun(data.target.value);
                            }}
                        />
                    </div>
                </div>
                <div className={cx('btn')}>
                    <UiButton
                        text="取消"
                        onClick={() => {
                            send('no', '');
                        }}
                    />
                    <UiButton
                        text="確定"
                        onClick={() => {
                            send('yes', text);
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default EditInput;
