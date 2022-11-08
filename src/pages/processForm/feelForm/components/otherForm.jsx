import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { ProForm, ProFormTextArea } from '@ant-design/pro-components';
import { fromProps } from '../../config'

function OtherForm({ disabled }, ref) {
    const formRef = useRef();
    useImperativeHandle(ref, () => ({
        ...formRef.current
    }))
    return (<ProForm {...fromProps(formRef)}>
        <ProFormTextArea
            disabled={disabled}
            name='described'
            labelAlign='left'
            label='发现及收货时间、地点、人员、过程等事件经过描述'
        />
        <ProFormTextArea
            disabled={disabled}
            labelAlign='left'
            name='influenceLevel'
            label='市场受冲击情况及影响程度'
        />
        <ProFormTextArea
            disabled={disabled}
            name='otherClues'
            label='其他有关线索'
        />
    </ProForm>)
}

export default forwardRef(OtherForm)