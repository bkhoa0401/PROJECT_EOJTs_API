import React, { Component } from 'react';
import { css } from '@emotion/core';
import { HashLoader } from 'react-spinners';

const override = css`
    display: block;
    margin: 20% auto;
`;

const showHashLoader = function (loading) {
    return (
        <div disabled className='sweet-loading'>
            <HashLoader
                css={override}
                sizeUnit={"px"}
                size={50}
                color={'#0099FF'}
                loading={loading}
            />
        </div>
    )
}

const SpinnerLoading = {
    showHashLoader
}

export default SpinnerLoading;