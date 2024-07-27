import React, { useState } from 'react';

import  { Button, ConfigProvider, Layout, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import MainRoutes from './MainRoutes';

const Layouts = () => {

    const { Header, Sider, Content } = Layout; 
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <div>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: 'black',
                        borderRadius: 2,
                    },
                }}
            >
                <Layout className='mainLayout'>
                    <Sider trigger={null} collapsible collapsed={collapsed}>
                        <div className="demo-logo-vertical" />
                        {/* <SideBar /> */}
                    </Sider>
                    <Layout>
                        <Header style={{ padding: 0, background: colorBgContainer, display: 'flex', alignItems: 'center' }}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                            <div className='navbar'>
                                <h2>DMS</h2>
                            </div>
                        </Header>
                        <Content
                            style={{
                                margin: '24px 16px',
                                padding: '24px 50px',
                                minHeight: 280,
                                height: 280,
                                overflowY: 'scroll',
                                background: colorBgContainer,
                            }}
                        >
                            <MainRoutes />
                        </Content>
                    </Layout>
                </Layout>
            </ConfigProvider>
        </div>
    );
}

export default Layouts;