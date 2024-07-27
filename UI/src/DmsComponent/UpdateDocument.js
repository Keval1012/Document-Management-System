import { Button, Col, Divider, Form, Input, Row, Space, Tabs, message } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const UpdateDocument = ( 
    {   
        isEditDocument,
        defaultDocument,
        departmentDetails,
        uploadFileList,
        UploadDocumentOfTab,
        handleUpdateDocumentValues,
        handleDepartmentRemove,
        handleChangeDepartment,
        handleTabChange
    }
) => {

    const navigate = useNavigate();
    const [updateDocumentForm] = Form.useForm();

    const validateInputs = (_, value, callback) => {
        const { documentDepartment } = updateDocumentForm.getFieldsValue();
        if (documentDepartment && Array.isArray(documentDepartment)) {
            if (value === undefined) {
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

    return (
        <div>
            {isEditDocument && <Form
                preserve={false}
                form={updateDocumentForm}
                name="updateDocumentForm"
                className="addDocumentForm"
                scrollToFirstError
            >
                <div>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <Form.Item
                                name='documentTitle'
                                initialValue={defaultDocument?.title}
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
                        </Col>
                    </Row>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            {/* <Form form={updateDocumentForm} onFinish={handleUpdateDocumentValues} initialValues={{ documentDepartment: defaultDocument?.departmentName }}> */}
                            <Form form={updateDocumentForm} onFinish={handleUpdateDocumentValues} initialValues={{ documentDepartment: (defaultDocument?.docForEachDep).map(o => o?.department) }}>
                                <Form.List name="documentDepartment">
                                    {(fields, { add, remove }) => (
                                        <div>
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
                                                        validateTrigger={['onBlur']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                validator: validateInputs,
                                                            }
                                                        ]}
                                                        onChange={(e) => handleChangeDepartment(e, name)}
                                                    >
                                                        <Input required />
                                                    </Form.Item>
                                                    {name !== 0 && <MinusCircleOutlined
                                                        onClick={() => {
                                                            const remainingDocuments = uploadFileList[name] && uploadFileList[name].length > 0;
                                                            if (remainingDocuments) {
                                                                message.error("Cannot delete department because remaining documents exist.");
                                                            } else {
                                                                remove(name); handleDepartmentRemove(name, defaultDocument);
                                                            }
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
                            </Form>

                        </Col>
                    </Row>
                    <Row justify='space-between'>
                        <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }}>
                            <h4>Upload Documents</h4>
                            <Tabs
                                defaultActiveKey={localStorage.getItem("keys")}
                                onChange={handleTabChange}
                                items={departmentDetails.map((department, i) => {
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
                        </Col>
                    </Row>
                </div>
                <div>
                    <Divider />
                    <Row justify="end" className="formBtnRow" >
                        <Col xl={{ span: 8 }} lg={{ span: 8 }} md={{ span: 8 }} sm={{ span: 8 }} xs={{ span: 8 }} className="formBtnCol" >
                            <Form>
                                <Button
                                    className='appPrimaryButton formWidth'
                                    onClick={() => {
                                        handleUpdateDocumentValues(updateDocumentForm);
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    className='appButton formWidth'
                                    onClick={() => {
                                        updateDocumentForm.resetFields();
                                        navigate(-1);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </div>
            </Form>}
        </div>
    )
}

export default UpdateDocument;