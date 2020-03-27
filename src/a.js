import React from 'react';
import {Card, Input, List, Spin, Tag} from 'antd';

import {
    CloseOutlined,
    EditOutlined,
    EllipsisOutlined,
    LeftOutlined,
    LinkOutlined,
    PlusOutlined,
    ReadOutlined,
    RightOutlined,
    SettingOutlined
} from '@ant-design/icons';
import {TweenOneGroup} from 'rc-tween-one';
import InfiniteScroll from 'react-infinite-scroller';

const {Meta, Grid} = Card;

const windowHeight = window.innerHeight;

const picArr = ['https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1312059974,1893880587&fm=111&gp=0.jpg', 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2486381222,2419244753&fm=26&gp=0.jpg', 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1208538952,1443328523&fm=26&gp=0.jpg', 'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3173584241,3533290860&fm=26&gp=0.jpg']

export class A extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newsList: [],
            visible: false,
            imgMap: {},
            pageIndex: 1,
            pageSize: 40,
            total: 0,
            loading: false,
            loadedRowsMap: {},
        }
        this.queryNews();
        this.onChange = this.onChange.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
    }

    changeTab = (tabId) => {
        let idx = parseInt(tabId / 10);
        let activeTab = tabId % 10;
        let list = this.state.newsList;
        for (let i = 0; i < list.length; i++) {
            if (i != idx) {
                if (list[i].activeTab % 10 == 2) list[i].activeTab = list[i].activeTab * 10 + 1;
            } else {
                list[i].activeTab = tabId;
            }
        }
        if (activeTab % 10 == 3) {
            this.getNewsContent(list[idx].id, idx);
        }
        this.setState({
            newsList: list
        })
    };

    getNewsContent(newsId, idx) {
        fetch('http://localhost:8080/news163/getNewsContent?newsId=' + newsId).then(res => res.json()).then(data => {
            if (data.Code == 10000) {
                let newsList = this.state.newsList;
                let obj = newsList[idx];
                obj.content = data.Result.content;
                this.setState({
                    newsList: newsList,
                    imgMap: {},
                });
                this.showDetail(idx);
            }
        })
    };

    showDetail(idx) {
        let obj = this.state.newsList[idx];
        this.setState({
            title: obj.title,
            content: obj.content,
            visible: true,
        })
    };

    prevImg = () => {
        this.slider.slick.slickPrev();
    };

    nextImg = () => {
        this.slider.slick.slickNext();
    };


    queryNews(pageIndex, pageSize, callBack) {
        fetch('http://localhost:8080/news163/queryNews163?param=' + encodeURIComponent(JSON.stringify({
            pageIndex: pageIndex ? pageIndex : this.state.pageIndex,
            pageSize: pageSize ? pageSize : this.state.pageSize
        }))).then(res => res.json()).then(data => {
            if (data.Code == 10000) {
                let arr = data.Result;
                let list = [];
                for (let i = 0; i < arr.length; i++) {
                    let obj = arr[i];
                    obj.activeTab = i * 10 + 1;
                    list.push(obj);
                }
                if (callBack) {
                    callBack(list);
                } else {
                    this.setState({
                        newsList: list,
                    });
                }
                this.setState({
                    total: data.Total,
                    loading: false,
                })
            }
        })
    }


    handleInfiniteOnLoad = () => {
        let {newsList} = this.state;
        this.setState({
            loading: true
        });
        alert(111);
        this.queryNews();
        // if (newsList.length > 14) {
        //     message.warning("Infinite List loaded all");
        //     this.setState({
        //         hasMore: false,
        //         loading: false
        //     });
        //     return;
        // }
    };


    onChange(page, size) {
        if (page != this.state.pageIndex) {
            this.setState({
                pageIndex: page,
                pageSize: size
            })
            this.queryNews(page, size);
        }
    }

    changePageSize(current, size) {
        this.setState({
            pageIndex: 1,
            pageSize: size
        })
        this.queryNews(1, size);
    }

    getRowData = (index, sytle) => {
        console.log(index);
        console.log(this.state.newsList[index]);
        return <div>{this.state.newsList[index].title}</div>
    }

    render() {
        let height = windowHeight;
        let target = document.getElementsByClassName('ant-collapse-header');
        for (let i = 0; i < target.length; i++) {
            height -= target[i].offsetHeight + 36;
        }
        if (height <= 500) {
            height = 500;
        }
        return (
            <div style={{height: height, overflow: 'auto'}}>
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!this.state.loading}
                    useWindow={false}
                >
                    {this.state.newsList.map(o => <img src={o.imgUrl}/>)}
                    {/*<List*/}
                        {/*dataSource={this.state.newsList}*/}
                        {/*renderItem={item => (*/}
                            {/*<List.Item key={item.id}>*/}
                                {/*<div>{item.title}</div>*/}
                            {/*</List.Item>*/}
                        {/*)}*/}
                    {/*>*/}
                        {/*{this.state.loading && (*/}
                            {/*<div className="demo-loading-container">*/}
                                {/*<Spin/>*/}
                            {/*</div>*/}
                        {/*)}*/}
                    {/*</List>*/}
                </InfiniteScroll>
            </div>
        )
    }
}


class EditableTagGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tags: props.labelNames ? props.labelNames : [],
            inputVisible: false,
            inputValue: '',
        };
    }

    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({tags});
    };

    showInput = () => {
        this.setState({inputVisible: true}, () => this.input.focus());
    };

    handleInputChange = e => {
        this.setState({inputValue: e.target.value});
    };

    handleInputConfirm = () => {
        const {inputValue} = this.state;
        let {tags} = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    };

    saveInputRef = input => (this.input = input);

    render() {
        const {tags, inputVisible, inputValue} = this.state;
        return (
            <div>
                <div style={{marginBottom: 16}}>
                    <TweenOneGroup
                        enter={{
                            scale: 0.8,
                            opacity: 0,
                            type: 'from',
                            duration: 100,
                            onComplete: e => {
                                e.target.style = '';
                            },
                        }}
                        leave={{opacity: 0, width: 0, scale: 0, duration: 200}}
                        appear={false}
                    >
                        {tags.map(tag => {
                            return (
                                <span key={tag} style={{display: 'inline-block'}}>
                                    <Tag
                                        style={{marginTop: '5px'}}
                                        closable
                                        onClose={e => {
                                            e.preventDefault();
                                            this.handleClose(tag);
                                        }}
                                        color="blue"
                                    >
                                        {tag}
                                    </Tag>
                                 </span>
                            )
                        })}
                        {inputVisible && (
                            <Input
                                ref={this.saveInputRef}
                                type="text"
                                size="small"
                                style={{width: 78}}
                                value={inputValue}
                                onChange={this.handleInputChange}
                                onBlur={this.handleInputConfirm}
                                onPressEnter={this.handleInputConfirm}
                            />
                        )}
                        {!inputVisible && (
                            <Tag onClick={this.showInput} className="site-tag-plus">
                                <PlusOutlined/>
                            </Tag>
                        )}
                    </TweenOneGroup>
                </div>
            </div>
        );
    }
}