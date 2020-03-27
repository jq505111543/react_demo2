import React from 'react';
import ReactDOM from 'react-dom';

import 'antd/dist/antd.css'
import {Menu, Button, Collapse, Select, Layout} from 'antd';
import {
    AppstoreOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PieChartOutlined,
    DesktopOutlined,
    InboxOutlined,
    MailOutlined,
    SettingOutlined,
    CloseCircleOutlined,
    CloseSquareOutlined,
    CloseOutlined
} from '@ant-design/icons';
import {menuList} from './data';
import {A} from './a';
import {B} from './b';
import {C} from './c';

const {Header, Sider, Content} = Layout;
const {SubMenu, Item} = Menu;
const {Panel} = Collapse;
const {Option} = Select;
const pageMap = {
    a: A,
    b: B,
    c: C
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            pageList: [],
            activePage: [],
        }
        this.listRef = React.createRef();
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    chooseMenu = (data) => {
        let key = data.key;
        let pageList = this.state.pageList;
        if (pageList.indexOf(key) < 0) {
            pageList.push(key);
            setTimeout(function () {
                window.location.href = "/#" + key
            }, 1000)
        } else {
            window.location.href = "/#" + key
        }
        let activePage = this.state.activePage;
        if (activePage.indexOf(key) < 0) {
            activePage.push(key);
        }
        this.setState({
            pageList: pageList,
            activePage: activePage,
            currPage: key
        })
    };

    choosePanel = (data) => {
        this.setState({
            activePage: data
        })
    }

    closePanel = (key) => {
        let pageList = this.state.pageList;
        if (pageList.indexOf(key) >= 0) {
            pageList.splice(pageList.indexOf(key), 1)
        }
        let activePage = this.state.activePage;
        if (activePage.indexOf(key) >= 0) {
            activePage.splice(activePage.indexOf(key), 1)
        }
        this.setState({
            pageList: pageList,
            activePage: activePage
        })
    }


    render() {
        return (
            <Layout style={{height: '100%'}} ref={this.listRef}>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <Button type="primary" onClick={this.toggleCollapsed}
                            style={{width: '80%', marginLeft: '10%', marginTop: '10px', marginBottom: '10px'}}>
                        {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                    </Button>
                    <Menu defaultSelectedKeys={['1']} mode="inline" theme="dark"
                          inlineCollapsed={this.state.collapsed}
                          onClick={this.chooseMenu}>
                        {menuList.map(obj => {
                            var icon = obj.icon;
                            if (obj.children && obj.children.length > 0) {
                                var children = obj.children;
                                return (
                                    <SubMenu key={obj.key} title={
                                        <span>
                                            {icon === 'PieChartOutlined' ? <PieChartOutlined/> :
                                                (icon === 'DesktopOutlined' ? <DesktopOutlined/> :
                                                    (icon === 'InboxOutlined' ? <InboxOutlined/> :
                                                        (icon === 'MailOutlined' ? <MailOutlined/> :
                                                            <AppstoreOutlined/>)))}
                                            <span>{obj.name}</span>
                                        </span>
                                    }>
                                        {children.map(o => <Menu.Item key={o.key}>{o.name}</Menu.Item>)}
                                    </SubMenu>
                                )
                            } else {
                                return (
                                    <Item key={obj.key}>
                                        {icon === 'PieChartOutlined' ? <PieChartOutlined/> :
                                            (icon === 'DesktopOutlined' ? <DesktopOutlined/> :
                                                (icon === 'InboxOutlined' ? <InboxOutlined/> :
                                                    (icon === 'MailOutlined' ? <MailOutlined/> :
                                                        <AppstoreOutlined/>)))}
                                        <span>{obj.name}</span>
                                    </Item>
                                )
                            }

                        })}
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Content
                        className="site-layout-background"
                        // style={{
                        //     margin: '24px 16px',
                        //     padding: 24,
                        //     minHeight: 280,
                        // }}
                    >
                        <MainCollapse pageList={this.state.pageList} closePanel={this.closePanel}
                                      activePage={this.state.activePage} choosePanel={this.choosePanel} currPage={this.state.currPage}/>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}


class MainCollapse extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Collapse
                    // defaultActiveKey={this.props.activePage}
                    activeKey={this.props.activePage}
                    onChange={this.props.choosePanel}
                    expandIconPosition='left'
                >
                    {this.props.pageList.map((key) => {
                        return (
                            <Panel header="This is panel header 1" key={key} id={key}
                                   extra={genExtra(key, this.props.closePanel)}>
                                {key === 'a' ? <A/> :
                                    (key === 'b' ? <B/> :
                                        <C/>)}
                            </Panel>
                        )
                    })}
                </Collapse>
            </div>
        )
    }
}

const genExtra = (key, closePanel) => (
    <CloseCircleOutlined className="closeBtn"
                         onClick={event => {
                             // If you don't want click extra trigger collapse, you can prevent this:
                             closePanel(key);
                             event.stopPropagation();
                         }}
    />
);
ReactDOM.render(<App/>, document.body);
