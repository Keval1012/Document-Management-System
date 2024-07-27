import { Button, Col, Divider, Form, Input, Row, Space, Steps, Tabs, Upload, message } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { LeftOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { addDocument, addUpdateDocument, deleteDepartment, deleteMultipleDocuments, updateDocument } from '../Component/Api';
import UpdateDocument from './UpdateDocument';

const AddForm = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { isEditDocument, defaultDocument } = location?.state??{};
    const [addDocumentForm] = Form.useForm();
    const [updateDocumentForm] = Form.useForm();
    const [documentFile, setDocumentFile] = useState(null);
    const [uploadFileList, setUploadFileList] = useState([]);
    const [documentsToDeleted, setDocumentsToDeleted] = useState([]);

    const [saveDeletedValue, setSaveDeletedValue] = useState([]);
    const [saveDeletedDepartmentValue, setSaveDeletedDepartmentValue] = useState([]);
    const [saveDeletedDepartment, setSaveDeletedDepartment] = useState([]);

    const [current, setCurrent] = useState(0);
    const [titleValue, setTitleValue] = useState(null);
    const [departmentValue, setDepartmentValue] = useState(null);
    const [initialDepartmentValue, setInitialDepartmentValue] = useState(null);
    const [documentUploadValue, setDocumentUploadValue] = useState(null);
    // const [departmentDetails, setDepartmentDetails] = useState(defaultDocument?.departmentName);
    const [departmentDetails, setDepartmentDetails] = useState(defaultDocument && (defaultDocument?.docForEachDep).map(o => o?.department));

    useEffect(() => {
        if (defaultDocument && defaultDocument?.docForEachDep) {
            const array = (defaultDocument?.docForEachDep).map(item => [item]);
            const docArray = array.map(subArray => {
                return subArray.flatMap(item => {
                    return item.documentList.map((document, index) => ({
                        department: item.department,
                        documentList: document,
                        fileId: item.fileId[index]
                    }));
                });
            });
            
            if (docArray) {
                let temp = [];
                docArray?.forEach((o, i) => {
                    const tempName = o;
                    temp.push({ uid: i + 1, name: tempName, userId: defaultDocument?.userId, status: 'done' });
                });
                const array = temp.map((item, o) => {
                    return {
                        name: item.name.map((subItem, i) => {
                            return {
                                fileId: subItem.fileId,
                                department: subItem.department,
                                name: subItem.documentList,
                                uid: o * item.name.length + i + 1,
                                status: item.status,
                                userId: item.userId,
                            };
                        })
                    };
                });          
                const newArray = array.map(item => item.name.map(subItem => ({ ...subItem })));
                setUploadFileList(newArray); 
                setDocumentFile(newArray);
            } 
        }
    }, [defaultDocument]);
    
    const handleRemoveForDepartment = async (departmentIndex, defaultDocument) => {
        if (defaultDocument) {
            setUploadFileList((prevUploadFileList) => {
                const newList = [...prevUploadFileList];
                newList.splice(departmentIndex, 1);
                return newList;
            });
        }
    };

    const handleRemove = async (info) => {
        if (defaultDocument && info?.uid) {
            setDocumentsToDeleted((prevDocuments) => [...prevDocuments, info?.fileId]);
        }
    };

    const uploadProps = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },

        onRemove: async (info) => {
            if (defaultDocument && info?.uid) {
                setSaveDeletedValue(info);
                await handleRemove(info);
            }
        },

        onChange(departmentIndex, info) {
            if (info.file.status !== 'uploading') {
                info.file.status = 'done';
            } 

            let newFileList = info.fileList;
            if (newFileList.length >= 0) {
                let temp = [];
                for (let i = 0; i < newFileList.length; i++) {
                    const el = newFileList[i];
                    if (el.originFileObj) {
                        temp.push(el.originFileObj);
                    } else {
                        temp.push(el);
                    }
                }

                const newUploadFileLists = [...uploadFileList];
                newUploadFileLists[departmentIndex] = temp;
                setUploadFileList(newUploadFileLists);

            } else {}
        },
    };

    const handleAddDocumentValuesForTitle = async (form) => {
        const values = form.getFieldsValue();
        const { documentTitle } = values;

        if (documentTitle) {
            setTitleValue(documentTitle);
            setCurrent(1);
        } 
    };

    const validateInput = (_, value, callback) => {
        const { documentDepartment } = addDocumentForm.getFieldsValue();
        if (documentDepartment && Array.isArray(documentDepartment)) {
            if (value === undefined || value === '') {
                callback('Department field is required');
            } 
            else if (value !== undefined) {
                const tempArray = documentDepartment.filter(item => item !== undefined);
                const resultArray = tempArray.map(item => item.toLowerCase());
                const isDuplicate = resultArray.filter(item => item === value.toLowerCase()).length > 1;
                if (isDuplicate) {
                    callback('Duplicate value found');
                } else {
                    callback(); 
                }
            }
        } 
    };

    const handleAddDocumentValuesForDepartment = async (form) => {
        const values = form.getFieldsValue();
        const { ...documentDepartment } = values;

        if ((documentDepartment.documentDepartment).includes(undefined) || (documentDepartment.documentDepartment).includes('')) {
            message.error('Department field is required');
        }
        else if (documentDepartment && documentDepartment.documentDepartment && Array.isArray(documentDepartment.documentDepartment)) {

            const resultArray = (documentDepartment.documentDepartment).map(item => item.toLowerCase());
            const hasDuplicates = new Set(resultArray).size !== resultArray.length;
                
            if (resultArray.length === (documentDepartment.documentDepartment).length && !hasDuplicates) {

                let firstString = documentDepartment.documentDepartment[0];

                if (firstString && typeof firstString === 'string') {

                    setInitialDepartmentValue(documentDepartment);

                    let st = documentDepartment;
                    const resultArray  = st.documentDepartment;
                    setDepartmentValue(resultArray);

                    setCurrent(2);

                } else {
                    message.error('Department field is required');
                }

            } else {
                message.error('Remove the Duplicate Department.');
            }
        } else {
            console.log('Invalid or empty string.');
        }
    };

    const handleAddDocumentValuesForDocument = async (form) => {
        const values = form.getFieldsValue();
        setDocumentUploadValue(values);
    };

    const handleAddDocumentValues = async (docTitle, docDepartment, docDocumentUpload) => {
        if (docTitle && docDepartment && uploadFileList?.length > 0) {

            let formData = new FormData();

            formData.append('title', docTitle);
            formData.append('departmentName', docDepartment);

            let data = {
                title: docTitle,
                departmentName: docDepartment,
            };

            if (!isEditDocument) {
                try {
                    const res = await addDocument(data);
                    if (res?.data) {
                        formData.append('userId', res?.data?.userId);

                        for (let j = 0; j < uploadFileList.length; j++) {
                            if (uploadFileList[j] && uploadFileList[j]?.some(o => o instanceof File)) {
                                uploadFileList[j].forEach(obj => {
                                    if (obj instanceof File) {
                                        formData.append('department', docDepartment[j]);
                                        formData.append('attachments', obj);
                                    } else {
                                        formData.append('attachments', [JSON.stringify(obj)]);
                                    }
                                });
                            }
                        }

                        const addDoc = await addUpdateDocument(formData);
                        if (addDoc?.data) {}
                        addDocumentForm.resetFields();
                        setDocumentFile(null);
                        setUploadFileList([]);

                        navigate(-1);
                        message.success('Document Added Successfully');
                        return;
                    } else {
                        message.error(res.data?.message);
                    }
                } catch (error) {
                    message.error(error.response.data.error);
                }
            } 
        } else {
            message.error('Document is required');
        }
    };
 
    const handleUpdateDocumentValues = async (form) => {
        const values = form.getFieldsValue();
        const { documentTitle, documentDepartment, documentUpload } = values;

        if ((documentDepartment).includes(undefined) || (documentDepartment).includes('')) {
            message.error('Department field is required');
        }
        else if (documentDepartment && Array.isArray(documentDepartment)) {

            const resultArray = documentDepartment.map(item => item.toLowerCase());
            const hasDuplicates = new Set(resultArray).size !== resultArray.length;

            if (resultArray.length === documentDepartment.length && !hasDuplicates) {
                let firstString = documentDepartment[0];

                if (firstString && typeof firstString === 'string') {

                    if (documentTitle && documentDepartment && (uploadFileList[0]?.length > 0)) {

                        if (form.getFieldsError().filter(x => x.errors.length > 0).length > 0) {
                            return;
                        }
            
                        let formData = new FormData();
            
                        formData.append('userId', defaultDocument?.userId);
                        formData.append('title', documentTitle);
                        formData.append('departmentName', documentDepartment);
            
                        let data = {
                            userId: defaultDocument?.userId,
                            title: documentTitle,
                            departmentName: documentDepartment,
                        };
            
                        if (isEditDocument) {
                            try {
                                    
                                if (documentsToDeleted?.length > 0) {
                                    try {
                                        const res = await deleteMultipleDocuments(documentsToDeleted);
                                        if (res?.status === 200) {} 
                                    } catch (error) {
                                        message.error('Something went wrong' + error);
                                    }
                                }

                                if (Object.keys(saveDeletedDepartmentValue).length > 0 || saveDeletedDepartment.length > 0) {
                                    try {
                                        const res = await deleteDepartment(saveDeletedDepartmentValue?.userId, saveDeletedDepartment);
                                        if (res?.status === 200) {} 
                                    } catch (error) {
                                        message.error('Something went wrong' + error);
                                    }
                                }

                                const res = await updateDocument(data);
                                if (res?.data) {

                                    formData.append('userId', res?.data?.userId);
                                    
                                    for (let j = 0; j < uploadFileList.length; j++) {
                                        if (uploadFileList[j] || uploadFileList[j]?.some(o => o instanceof File)) {
                                            uploadFileList[j].forEach(obj => {
                                                if (obj instanceof File) {
                                                    formData.append('department', documentDepartment[j]);
                                                    formData.append('attachments', obj);
                                                } else {
                                                    formData.append('department', documentDepartment[j]);
                                                    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' });
                                                    formData.append('attachments', blob, obj?.name);
                                                }
                                            });
                                        }
                                    }
                                    
                                    const updateDoc = await addUpdateDocument(formData);
                                    updateDocumentForm.resetFields();
            
                                    setDocumentFile(null);
                                    setUploadFileList([]);
            
                                    navigate(-1);
                                    message.success(defaultDocument?.title + ' Document Updated Successfully');
                                } else message.error(res.data?.message);
                            } catch (error) {
                                message.error('Something went wrong' + error);
                            }
                        }
                    } else {
                        message.error('Document is required');
                    }
                } 
            } else {
                message.error('Remove the Duplicate Department.');
            }
        } 
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const DocumentTitle = ({ onFinish, initialValues }) => {
        return (
            <Row justify='space-between'>
                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                    <Form form={addDocumentForm} onFinish={onFinish} initialValues={initialValues}>
                        <Form.Item
                            name='documentTitle'
                            label='Title'
                            rules={[
                                {
                                    required: true,
                                    message: 'Title is required!',
                                }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Button type='primary' htmlType='submit' onClick={() => { handleAddDocumentValuesForTitle(addDocumentForm); }}>Next</Button>
                    </Form>
                </Col>
            </Row>
        );
    };

    const DocumentDepartment = ({ onFinish, initialValues }) => {
        return (
            <Row justify='space-between'>
                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                    <Form form={addDocumentForm} initialValues={{ documentDepartment: [""] }}>
                        <Form.List name="documentDepartment">
                            {(fields, { add, remove }) => (
                                <div style={{ marginLeft: '30%' }}>
                                    <h4>Add Departments</h4>
                                    {fields.map(({ key, name, ...restField }) => (
                                        <Space
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                marginBottom: 8,
                                            }}
                                            align="baseline"
                                        >
                                            <Form.Item
                                                {...restField}
                                                name={[name]}
                                                rules={[
                                                    {
                                                        required: true,
                                                        validator: validateInput,
                                                    }
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                            {name !== 0 && <MinusCircleOutlined 
                                                onClick={() => {
                                                    remove(name);
                                                    setUploadFileList(prevUploadFileList =>
                                                        prevUploadFileList.filter((_, index) => index !== name)
                                                    );
                                                }}
                                                style={{ color: 'red' }} 
                                            />}
                                        </Space>
                                    ))}
                                    <Form.Item>
                                        <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Add item</Button>
                                    </Form.Item>
                                </div>
                            )}
                        </Form.List>
                                                
                        <Button style={{ margin: '0 8px', marginLeft: '31%' }} onClick={() => prev()}>Previous</Button>
                        <Button
                            type='primary'
                            htmlType='submit'
                            style={{ marginLeft: '21%' }}
                            onClick={() => { handleAddDocumentValuesForDepartment(addDocumentForm); }}
                        >
                            Next
                        </Button>
                    </Form>
                </Col>
            </Row>
        );
    };

    const UploadDocumentOfTab = (departmentIndex) => <>
        <Form.Item
            name={`documentUpload_${departmentIndex}`}
            rules={[{ required: true, message: 'Attachment is Required' }]}
        > 
            <Upload
                listType={defaultDocument ? 'text' : 'picture-card'}
                {...uploadProps}
                multiple={true}
                fileList={uploadFileList[departmentIndex]}
                onChange={(info) => {
                    uploadProps.onChange(departmentIndex, info);
                }}
            >
                <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
        </Form.Item>
    </>;

    const handleTabChange = (key) => {
        localStorage.setItem("keys", key);
    };

    const DocumentUpload = ({ onFinish, initialValues }) => {
        return (
            <>            
            <Row justify='space-between'>
                <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                    <Form form={addDocumentForm} onFinish={onFinish} initialValues={initialValues} style={{ marginLeft: '30%' }}>
                        <h4>Upload Documents</h4>
                        <Tabs
                            defaultActiveKey={localStorage.getItem("keys")}
                            onChange={handleTabChange}
                            items={departmentValue.map((department, i) => {
                                const id = String(i + 1);
                                return {
                                    label: (
                                    <span>
                                        {department}
                                    </span>
                                    ),
                                    key: id,
                                    children: UploadDocumentOfTab(i),
                                };
                            })}
                        />
                        <Button style={{ margin: '0 8px' }} onClick={() => prev()}>Previous</Button>
                    </Form>
                </Col>
            </Row>
            <div>
                <Row justify="end" className="formBtnRow" >
                    <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xs={{ span: 8 }} className="formBtnCol" >
                        <Form className='formStyle'>
                            <Button
                                className='appPrimaryButton formWidth'
                                onClick={() => { handleAddDocumentValues(titleValue, departmentValue, uploadFileList); }}
                            >
                                Save
                            </Button>
                            <Button
                                className='appButton formWidth'
                                onClick={() => {
                                    addDocumentForm.resetFields();
                                    navigate(-1);
                                }}
                            >
                                Cancel
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </div>
            </>
        );
    };

    const forms = [
        <DocumentTitle onFinish={handleAddDocumentValuesForTitle} initialValues={titleValue} />,
        <DocumentDepartment onFinish={handleAddDocumentValuesForDepartment} initialValues={initialDepartmentValue} />,
        <DocumentUpload onFinish={handleAddDocumentValuesForDocument} initialValues={documentUploadValue} />
    ];

    const handleDepartmentRemove = async (key, defaultDocument) => {
        // if (defaultDocument?.departmentName) {
        //     let department = defaultDocument?.departmentName[key];
        //     setSaveDeletedDepartmentValue(defaultDocument);
        //     setSaveDeletedDepartment(department); 
        //     await handleRemoveForDepartment(key, defaultDocument);
        // }
        let departmentName = (defaultDocument?.docForEachDep).map(o => o?.department);
        if (departmentName) {
            let department = departmentName[key];
            setSaveDeletedDepartmentValue(defaultDocument);
            setSaveDeletedDepartment(department); 
            await handleRemoveForDepartment(key, defaultDocument);
        }
        const list = [...departmentDetails];
        list.splice(key, 1);
        setDepartmentDetails(list);
    };
    
    const handleChangeDepartment = async (e, key) => {
        setDepartmentDetails((prev) => {
            let helper = [...prev];
            helper[key] = e.target.value;
            return helper;
        });
    };
    
    return (
        <div>
            <Row align='middle' justify='space-between'>
                <h3
                    className="backButtonDiv"
                    onClick={() => navigate(-1)}
                >
                    <LeftOutlined /> Back
                </h3>
            </Row>

            <Row align='middle' justify='space-between'>
                <Col xl={{ span: 20 }} lg={{ span: 20 }} md={{ span: 20 }} sm={{ span: 20 }} xs={{ span: 20 }}>
                    <h2 className='allPageHeader'>{isEditDocument ? 'Update Document' : 'Add Document'}</h2>
                </Col>
            </Row>

            <Divider />

            {!isEditDocument && <div>
                <div>
                    <Row align='middle' justify='space-between'>
                        <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Steps
                                style={{ padding: '32px 16px' }}
                                onChange={c => setCurrent(c)}
                                current={current}
                            >
                                <Steps disabled={true} title='Title'></Steps>
                                <Steps disabled={true} title='Department'></Steps>
                                <Steps disabled={true} title='Document'></Steps>
                            </Steps>
                            {forms[current]}
                        </Col>
                    </Row>
                </div>
            </div>}

            {isEditDocument && 
                <UpdateDocument 
                    isEditDocument={isEditDocument}
                    defaultDocument={defaultDocument}
                    departmentDetails={departmentDetails}
                    uploadFileList={uploadFileList}
                    UploadDocumentOfTab={UploadDocumentOfTab}
                    handleUpdateDocumentValues={handleUpdateDocumentValues}
                    handleDepartmentRemove={handleDepartmentRemove}
                    handleChangeDepartment={handleChangeDepartment}
                    handleTabChange={handleTabChange}
                /> 
            }
        </div>
    );
}

export default AddForm;