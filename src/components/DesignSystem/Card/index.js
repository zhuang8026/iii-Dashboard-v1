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
                            <div className={cx('user')}>
                                <span>{`${content[0].type}`}</span>
                                <span>
                                    <p>{content[0].val}</p> /戶
                                </span>
                            </div>
                            <div className={cx('user')}>
                                <span>{`${content[1].type}`}</span>
                                <span>
                                    <p>{content[1].val}</p> /戶
                                </span>
                            </div>
                            <div className={cx('user')}>
                                <span>已拆除</span>
                                <span>
                                    <p>9999</p> /戶
                                </span>
                            </div>
                            <div className={cx('user')}>
                                <span>未開通</span>
                                <span>
                                    <p>9999</p> /戶
                                </span>
                            </div>
                            <div className={cx('user')}>
                                <span>不接受維護</span>
                                <span>
                                    <p>9999</p> /戶
                                </span>
                            </div>
                        </div>
                    </div>
                ) : type == 'Total' ? (
                    <div className={cx('cardContent', 'totalContent')}>
                        <div className={cx('chart')}>
                            <UiDoughnutNormalChart data={content} />
                        </div>
                        <div className={cx('cardTotal')}>
                            <div className={cx('user')}>
                                <div className={cx('type')}>
                                    <div
                                        className={cx('user_color')}
                                        style={{
                                            backgroundColor: '#ff7c32'
                                        }}
                                    />
                                    {`${content[0].type}`}
                                </div>
                                <div className={cx('val')}>
                                    {content[0].val}
                                    <span> 戶</span>
                                </div>
                            </div>
                            <div className={cx('user')}>
                                <div className={cx('type')}>
                                    <div
                                        className={cx('user_color')}
                                        style={{
                                            backgroundColor: '#ffcb01'
                                        }}
                                    />
                                    {`${content[1].type}`}
                                </div>
                                <div className={cx('val')}>
                                    {content[1].val}
                                    <span> 戶</span>
                                </div>
                            </div>

                            <div className={cx('user')}>
                                <div className={cx('type')}>
                                    <div
                                        className={cx('user_color')}
                                        style={{
                                            backgroundColor: '#4bd0ce'
                                        }}
                                    />
                                    已拆除
                                </div>
                                <div className={cx('val')}>
                                    {content[1].val}
                                    <span> 戶</span>
                                </div>
                            </div>
                            <div className={cx('user')}>
                                <div className={cx('type')}>
                                    <div
                                        className={cx('user_color')}
                                        style={{
                                            backgroundColor: '#2EA9DF'
                                        }}
                                    />
                                    未開通
                                </div>
                                <div className={cx('val')}>
                                    {content[1].val}
                                    <span> 戶</span>
                                </div>
                            </div>
                            <div className={cx('user')}>
                                <div className={cx('type')}>
                                    <div
                                        className={cx('user_color')}
                                        style={{
                                            backgroundColor: '#86C166'
                                        }}
                                    />
                                    不接受維護
                                </div>
                                <div className={cx('val')}>
                                    {content[1].val}
                                    <span> 戶</span>
                                </div>
                            </div>

                            <div className={cx('user')}>
                                <div className={cx('type')}>
                                    <div
                                        className={cx('user_color')}
                                        style={{
                                            backgroundColor: '#F17C67'
                                        }}
                                    />
                                    {`總計`}
                                </div>
                                <div className={cx('val')}>
                                    {Number(content[0].val) + Number(content[1].val)}
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
