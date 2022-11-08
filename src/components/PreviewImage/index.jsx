import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Image } from 'antd';
import { Container } from '@/utils';

function PreviewImage(props, ref) {
    const [params, setParams] = useState({
        visible: false,
        imageUrl: ''
    })
    useImperativeHandle(ref, () => ({ setParams }))
    return (
        <Image
            width={200}
            style={{ display: 'none' }}
            src={params.imageUrl}
            preview={{
                getContainer:Container,
                visible:params.visible,
                src: params.imageUrl,
                onVisibleChange: e=>{
                    setParams({
                        visible:e,
                        imageUrl:e ? params.imageUrl : ''
                    })
                }
            }}
        />
    )
}

export default forwardRef(PreviewImage)