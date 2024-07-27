import React, { useEffect, useState } from 'react'
import { Button, Col, Input, Modal, Row, Table, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { deleteDocument, getAllDocument } from '../Component/Api';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const List = () => {

    const initialColumns = [
        {
          key: "title",
          title: "Title",
          dataIndex: "title",
          sorter: false,
          render: (val) => val ? <div>{val}</div> : <div>-</div>
        },
        // {
        //   key: "departmentName",
        //   title: "Department",
        //   dataIndex: "departmentName",
        //   sorter: false,
        //   render: (val) => val ? <div>{val.join(', ')}</div> : <div>-</div>
        // },
        {
          key: "departmentName",
          title: "Departments",
          dataIndex: "docForEachDep",
          sorter: false,
          render: (val) => val ? <div>{(val.map(o => o?.department)).join(', ')}</div> : <div>-</div>
        },
        {
          key: "attachments",
          title: "Attachment List",
          dataIndex: "attachments",
          sorter: false,
          render: (val) => val ? <div>{val.join(', ')}</div> : <div>-</div>
        },
        {
            key: "actions",
            title: "Actions",
            dataIndex: "action",
            width: '0.1%',
            fixed: 'right',
            render: (index, record) => <div className='d-flex-between'>
              <EditOutlined className='tableEditIcon' onClick={() => onEditRow(record)} />
              <DeleteOutlined className='tableDeleteIcon' onClick={() => onEditRow(record, true)} />
            </div>
          },
      ];

    const navigate = useNavigate();
    const [defaultDocument, setDefaultDocument] = useState(null);
    const [isEditDocument, setIsEditDocument] = useState(false);
    const [documentList, setDocumentList] = useState([]);
    const [filterTable, setFilterTable] = useState(null);

    const onSearch = (value) => {
      const filterData = documentList.filter((o) => Object.keys(o).some((k) => String(o[k])
      .toLowerCase()
      .includes(value.toLowerCase())));
      setFilterTable(filterData);
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        const res = await getAllDocument();
        if (res?.status === 200) {
            setDocumentList(res?.data);
        }
    };

    const showDeleteConfirm = (record) => {
        Modal.confirm({
          title: `Document name: ${record?.title}`,
          content: 'Are you sure you want to remove this Document?',
          okText: 'Remove',
          okType: 'danger',
          onOk: async () => {
            try {
              const res = await deleteDocument(record?.userId);
              if (res?.data === true) {
                message.success(record?.title + ' Document deleted successfully');
                fetchDocuments();
              } else {
                message.error(res.data?.message);
              }
            } catch (error) {
              message.error('Something went wrong' + error);
            }
          },
          onCancel() { },
        });
    };    

    const onEditRow = async (record, isDelete = false) => {
        if (!isDelete) {
          setDefaultDocument(record);
          setIsEditDocument(true);
          navigate('/dms/form', {
            state: {
              defaultDocument: record,
              isEditDocument: true,
            }
          });
          return;
        }
    
        if (isDelete) {
          showDeleteConfirm(record);
          return;
        }
    };

    return (
        <div>
            <Row align='middle' justify='space-between'>
                <Col xl={{ span: 10 }} lg={{ span: 10 }} md={{ span: 10 }} sm={{ span: 10 }} xs={{ span: 10 }} >
                    <h2 className='allPageHeader'>All Documents</h2>  
                </Col>
                <Col>
                    <Button 
                        className='appButton'
                        onClick={() => {
                            navigate('/dms/form', { 
                                state: {
                                    isEditDocument: false,
                                    defaultDocument: null
                            }});
                        }}
                    >
                        + Add Document
                    </Button>
                </Col>
            </Row>
            <Row className='filterBox firstRow' align='bottom' justify='space-between'>
              <Col xl={{ span: 24 }} lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                <Row>
                    <Input.Search
                      style={{ margin: '0 0 10px 0' }}
                      placeholder="Search by..."
                      enterButton
                      onSearch={onSearch}
                    />
                </Row>
              </Col>
            </Row>
            <Table
                bordered
                dataSource={filterTable == null ? documentList : filterTable}
                columns={initialColumns}
                pagination={{ showSizeChanger: true }}
            />
        </div>
    );
}

export default List;