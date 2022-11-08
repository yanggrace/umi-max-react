import React, { forwardRef, useImperativeHandle, useRef, Fragment } from 'react';
import { ProForm, ProFormUploadButton } from '@ant-design/pro-components';
import { fromProps } from '../../config';
import PreviewImage from '@/components/PreviewImage'


function FileForm({ disabled }, ref) {
    const formRef = useRef();
    const previewImageRef = useRef();
    useImperativeHandle(ref, () => ({ ...formRef.current }))
    const uploadFieldProps = {
        action: '/api/oims/attachment/upload',
        fieldProps: {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
            name: 'file',
            onPreview: ({ type, thumbUrl }) => {
                if (type.indexOf('image') != -1) {
                    previewImageRef.current.setParams({
                        visible: true,
                        imageUrl: thumbUrl
                    })
                }
            }
        }
    }
    return (
        <Fragment>
            <ProForm {...fromProps(formRef)}>
                <ProFormUploadButton
                    disabled={disabled}
                    name='checkReport'
                    label='核查报告'
                    {...uploadFieldProps}
                />
                <ProFormUploadButton
                    disabled={disabled}
                    name='evidence'
                    label='出示证据'
                    tooltip="收货照片、发票等"
                    {...uploadFieldProps}
                />
                <ProFormUploadButton
                    disabled={disabled}
                    name='associatedDocuments'
                    label='关联文档'
                    {...uploadFieldProps}
                />
                <ProFormUploadButton
                    disabled={disabled}
                    name='other'
                    label='其他证据'
                    {...uploadFieldProps}
                />
            </ProForm>
            <PreviewImage ref={previewImageRef} />
        </Fragment>
    )
}

export default forwardRef(FileForm)