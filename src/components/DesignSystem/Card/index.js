import React, { useState, useEffect, useRef } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';

import UiDoughnutNormalChart from 'components/DesignSystem/DoughnutNormalChart';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Card = ({ type = 'Table', title = 'TEST', content = [] }) => {
    return (
        <div className={cx('card', type == 'Table' ? 'table' : type == 'Compare' ? 'compare' : 'total')}>
            <div className={cx('inner')}>
                <div className={cx('cardTitle')}>{title}</div>
                {type == 'Table' ? (
                    <div className={cx('cardContent', content.length > 3 && 'card-width-50')}>
                        {content.map((obj, index) => {
                            return (
                                <div className={cx('cardRow', obj.status)} key={index}>
                                    <p>{obj.type}</p>
                                    {obj.val}
                                </div>
                            );
                        })}
                    </div>
                ) : type == 'Compare' ? (
                    <div className={cx('cardContent')}>
                        <div className={cx('cardCompare')}>
                            <div className={cx('user')}>
                                {content[0].val}
                                <span>{` 戶/(${content[0].type})`}</span>
                            </div>
                            <div className={cx('user')}>
                                {content[1].val}
                                <span>{` 戶/(${content[1].type})`}</span>
                            </div>
                            {title == '總用戶' && (
                                <>
                                    <div className={cx('line')} />
                                    <div className={cx('all_user')}>
                                        {Number(content[0].val) + Number(content[1].val)}
                                        <span>{` 戶(總計)`}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : type == 'Total' ? (
                    <div className={cx('cardContent', 'totalContent')}>
                        <div className={cx('chart')}>
                            <UiDoughnutNormalChart data={content}/>
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
                            <div className={cx('user', 'all_user')}>
                                <div className={cx('type')}>
                                    <div
                                        className={cx('user_color')}
                                        style={{
                                            backgroundColor: '#4bd0ce'
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
