import React, { useState, useEffect, useRef } from 'react';
import { withRouter, Link, Redirect } from 'react-router-dom';

// css
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Card = ({ type = 'table', title = 'TEST', content = [] }) => {
    return (
        <div className={cx('card', type == 'table' ? 'table' : 'compare')}>
            <div className={cx('inner')}>
                <div className={cx('cardTitle')}>{title}</div>
                {type == 'table' ? (
                    <div className={cx('cardContent', content.length > 3 && 'card-width-50')}>
                        {content.map((obj, index) => {
                            return (
                                <div className={cx('cardRow')} key={index}>
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
                ) : (
                    ''
                )}
            </div>
        </div>
    );
};

export default Card;
