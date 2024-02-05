import React, { useState, useEffect, useRef } from 'react';
// import { withRouter, Link, Redirect } from 'react-router-dom';

import { Checkbox } from 'antd';
import UiDoughnutNormalChart from 'components/DesignSystem/DoughnutNormalChart';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Card = ({ type = 'Table', title = 'TEST', content = [], onClick }) => {
    const [selectedValues, setSelectedValues] = useState([]);

    const handleClick = (checked, value) => {
        let updatedValues;

        if (checked) {
            // Add the value to the array if the checkbox is checked
            updatedValues = [...selectedValues, value];
        } else {
            // Remove the value from the array if the checkbox is unchecked
            updatedValues = selectedValues.filter(selectedValue => selectedValue !== value);
        }

        setSelectedValues(updatedValues);

        let payload = {
            title,
            values: updatedValues
        };
        onClick(payload);
    };

    return (
        <div className={cx('card', type == 'Table' ? 'table' : type == 'Compare' ? 'compare' : 'total')}>
            <div className={cx('inner')}>
                <div className={cx('cardTitle')}>{title}</div>
                {type == 'Table' ? (
                    <div className={cx('cardContent', content.length > 3 && 'card-width-50')}>
                        {content.map((obj, index) => {
                            return (
                                <div className={cx('cardRow', obj.status)} key={index}>
                                    <p>
                                        <Checkbox
                                            onChange={e => {
                                                let checked = e.target.checked;
                                                handleClick(checked, obj.type);
                                            }}
                                        >
                                            {obj.type}
                                        </Checkbox>
                                    </p>
                                    {obj.val}
                                </div>
                            );
                        })}
                    </div>
                ) : type == 'Compare' ? (
                    <div className={cx('cardContent')}>
                        <div className={cx('cardCompare')}>
                            {content.map((ele)=> (
                                <div className={cx('user')}>
                                <span>{`${ele.type}`}</span>
                                <span>
                                    <p>{ele.val}</p> /戶
                                </span>
                            </div>
                            ))}
                        </div>
                    </div>
                ) : type == 'Total' ? (
                    <div className={cx('cardContent', 'totalContent')}>
                        <div className={cx('chart')}>
                            <UiDoughnutNormalChart data={content} />
                        </div>
                        <div className={cx('cardTotal')}>
                            {content.map((ele)=> (
                                <div className={cx('user')}>
                                <div className={cx('type')}>
                                    <div
                                        className={cx('user_color')}
                                        style={{
                                            backgroundColor: ele.color
                                        }}
                                    />
                                    {`${ele.type}`}
                                </div>
                                <div className={cx('val')}>
                                    {ele.val} <span> 戶</span>
                                </div>
                            </div>
                            ))}
                            <div className={cx('user')}>
                                <div className={cx('type')}>
                                    <div
                                        className={cx('user_color')}
                                        style={{
                                            backgroundColor: '#6fff00'
                                        }}
                                    />
                                    {`總計`}
                                </div>
                                <div className={cx('val')}>
                                    {Number(content[0].val) + Number(content[1].val) + Number(content[2].val) + Number(content[3].val)}
                                    <span> 戶</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};

export default Card;
