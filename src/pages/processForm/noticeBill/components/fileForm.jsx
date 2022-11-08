/*
 * @Author: wangrui
 * @Date: 2022-08-29 09:00:16
 * @LastEditors: wangrui
 * @Description:
 * @LastEditTime: 2022-08-31 08:59:30
 */
import React, { forwardRef, useImperativeHandle, useRef, Fragment, useState, useEffect } from 'react';
import { ProForm, ProFormUploadButton } from '@ant-design/pro-components';
import { fromProps } from '../../config';
import PreviewImage from '@/components/PreviewImage';

function FileForm({ initialData, disabled }, ref) {
  const [fileList, setFileList] = useState([]);
  const formRef = useRef();
  const previewImageRef = useRef();
  useImperativeHandle(ref, () => ({
    ...formRef.current,
    fileList,
  }));
  useEffect(() => {
    if (initialData.evidence && initialData.evidence.length) {
      setFileList(initialData.evidence);
    }
  }, [initialData.evidence]);
  const uploadFieldProps = {
    action: '/api/oims/attachment/upload',
    accept: 'image/*',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    listType: 'picture-card',
    onPreview: (e) => {
      previewImageRef.current.setParams({
        visible: true,
        imageUrl: e.thumbUrl,
      });
    },
  };
  return (
    <Fragment>
      <ProForm {...fromProps(formRef)} disabled={disabled}>
        <ProFormUploadButton max={5} name='filed' label='上传回收单图片' value={fileList} fieldProps={uploadFieldProps} onChange={handleChange} />
      </ProForm>
      <PreviewImage ref={previewImageRef} />
    </Fragment>
  );
  function handleChange({ fileList }) {
    setFileList(fileList);
  }
}

export default forwardRef(FileForm);
