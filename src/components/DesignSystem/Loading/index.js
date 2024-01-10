import React, { useState, useEffect, useRef } from 'react';
// import { withRouter, Link, Redirect } from 'react-router-dom';

// antd
// import { Rate } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import './style_module.scss';

const Loading = ({text = 'Loading, Please Waiting...'}) => {
    return (
        <div className="loading">
            <LoadingOutlined style={{ fontSize: '40px', marginBottom: '10px' }} />
            {text}
        </div>
    );
};

export default Loading;
