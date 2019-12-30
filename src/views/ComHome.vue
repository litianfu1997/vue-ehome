<template>
    <el-container style="height: 800px; border: 1px solid #eee">
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
            <el-menu default-active="allNotice">
                <el-submenu index="notice">
                    <template slot="title"><i class="el-icon-menu"></i>公告通知</template>
                    <el-menu-item-group>
                        <el-menu-item @click="allNotice" index="allNotice">全部公告</el-menu-item>
                        <el-menu-item @click="putNotice" index="putNotice">发布公告</el-menu-item>
                    </el-menu-item-group>

                </el-submenu>
                <el-submenu index="issue">
                    <template slot="title"><i class="el-icon-ice-cream"></i>议题投票</template>
                    <el-menu-item-group>
                        <el-menu-item @click="putIssue" index="putIssue">发布议题</el-menu-item>
                        <el-menu-item @click="issueList" index="issueList">议题列表</el-menu-item>
                    </el-menu-item-group>

                </el-submenu>
                <el-submenu index="advise">
                    <template slot="title"><i class="el-icon-setting"></i>投诉建议</template>
                    <el-menu-item-group>
                        <el-menu-item @click="adviseList" index="adviseList">投诉列表</el-menu-item>
                    </el-menu-item-group>

                </el-submenu>
            </el-menu>
        </el-aside>
        <!--        右边的盒子-->
        <el-container>
            <el-header style="text-align: right; font-size: 12px">
                <el-dropdown>
                    <i class="el-icon-setting" style="margin-right: 15px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>查看</el-dropdown-item>
                        <el-dropdown-item>新增</el-dropdown-item>
                        <el-dropdown-item>删除</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <span>{{community.communityName}}</span>
            </el-header>
            <!--            公告-->
            <el-main v-show="showFlag == 2">
                <el-row :gutter="20">
                    <el-col :span="14" offset='5'>
                        <el-card shadow="always">
                            <div style="margin: 10px;font-size: 24px;">发布公告</div>
                            <el-form ref="form" :model="form" label-width="80px">
                                <el-form-item label="公告标题">
                                    <el-input v-model="form.title" placeholder="请输入公告标题"></el-input>
                                </el-form-item>
                                <el-form-item label="公告内容">
                                    <el-input type="textarea"
                                              placeholder="请输入公告内容"
                                              :rows="10"
                                              v-model="form.content"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmitNotice">立即发布</el-button>
                                    <el-button>取消</el-button>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-col>
                </el-row>
            </el-main>

            <!--     ascending升序   descending降序    公告列表-->
            <el-main v-show="showFlag == 3">
                <el-table
                        :data="tableDataNotice.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase())
                        || data.content.toLowerCase().includes(search.toLowerCase())
                        || data.createTime.toLowerCase().includes(search.toLowerCase()))"
                        stripe
                        :default-sort="{prop: 'createTime', order: 'descending'}"
                        v-loading="loadingFlag">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="createTime" sortable label="创建时间" width="150px"></el-table-column>
                    <el-table-column prop="title" label="标题"></el-table-column>
                    <el-table-column prop="content" label="内容"></el-table-column>
                    <el-table-column prop="type" label="类型" width="80"></el-table-column>
                    <el-table-column
                            width="180px"
                            align="right">
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mini"
                                    placeholder="输入关键字搜索"/>
                        </template>
                        <template slot-scope="scope">

                            <el-button
                                    @click.native.prevent="updateNotice(scope.row)"
                                    type="primary"
                                    size="small"
                            >
                                修改
                            </el-button>
                            <el-button
                                    @click.native.prevent="deleteNotice(scope.row)"
                                    type="danger"
                                    size="small"
                            >
                                删除
                            </el-button>
                        </template>

                    </el-table-column>

                </el-table>
                <el-dialog title="修改公告" :visible.sync="dialogFormVisible">

                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="公告标题">
                            <el-input v-model="form.title" placeholder="请输入公告标题"></el-input>
                        </el-form-item>
                        <el-form-item label="公告内容">
                            <el-input type="textarea"
                                      placeholder="请输入公告内容"
                                      :rows="10"
                                      v-model="form.content"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onUpdateNotice">立即修改</el-button>
                            <el-button @click="dialogFormVisible = false">取消</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
            </el-main>
            <!--            议题列表-->
            <el-main v-show="showFlag == 4">
                <el-table
                        :data="tableDataIssue.filter(data => !search || data.title.toLowerCase().includes(search.toLowerCase()))"
                        stripe
                        :default-sort="{prop: 'createTime', order: 'descending'}"
                        v-loading="loadingFlag">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="issueTitle" sortable label="标题" width="150px"></el-table-column>
                    <el-table-column prop="issueContent" label="内容"></el-table-column>
                    <el-table-column prop="issueAgree" label="同意数" width="80"></el-table-column>
                    <el-table-column prop="issueWaiver" label="弃权数" width="80"></el-table-column>
                    <el-table-column prop="issueOppose" label="反对数" width="80"></el-table-column>
                    <el-table-column prop="issueStartTime" label="开始时间" width="100"></el-table-column>
                    <el-table-column prop="issueEndTime" label="结束时间" width="100"></el-table-column>
                    <el-table-column
                            width="180px"
                            align="right">
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mini"
                                    placeholder="输入关键字搜索"/>
                        </template>

                    </el-table-column>

                </el-table>
            </el-main>
            <!--            发布议题-->
            <el-main v-show="showFlag == 5">
                <el-row :gutter="20">
                    <el-col :span="14" offset='5'>
                        <el-card shadow="always">
                            <div style="margin: 10px;font-size: 24px;">发布议题</div>
                            <el-form ref="form" :model="issueForm" label-width="80px">
                                <el-form-item label="议题标题">
                                    <el-input v-model="issueForm.title" placeholder="请输入议题标题"></el-input>
                                </el-form-item>
                                <el-form-item label="起止时间">
                                    <el-date-picker
                                            v-model="dateTime"
                                            type="datetimerange"
                                            :picker-options="pickerOptions"
                                            range-separator="至"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期"
                                            align="right"
                                            style="width: 560px;">
                                    </el-date-picker>
                                </el-form-item>
                                <el-form-item label="议题内容">
                                    <el-input type="textarea"
                                              placeholder="请输入议题内容"
                                              :rows="10"
                                              v-model="issueForm.content"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="onSubmitIssue">立即发布</el-button>
                                    <el-button>取消</el-button>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-col>
                </el-row>
            </el-main>
            <!--投诉列表-->
            <el-main v-show="showFlag == 6">
                <el-table
                        :data="tableDataAdvise.filter(data => !search || data.content.toLowerCase().includes(search.toLowerCase())
                        || data.name.toLowerCase().includes(search.toLowerCase())
                        || data.type.toLowerCase().includes(search.toLowerCase()))"
                        stripe
                        :default-sort="{prop: 'createTime', order: 'descending'}"
                        v-loading="loadingFlag">
                    <el-table-column type="index" width="50" label="序号"></el-table-column>
                    <el-table-column prop="createTime" sortable label="创建时间" width="150px"></el-table-column>
                    <el-table-column prop="department" label="投诉部门" width="80"></el-table-column>
                    <el-table-column prop="type" label="投诉类型" width="80"></el-table-column>
                    <el-table-column prop="name" label="投诉人" width="80"></el-table-column>
                    <el-table-column prop="phone" label="手机号码" width="100"></el-table-column>
                    <el-table-column prop="content" label="投诉内容"></el-table-column>
                    <el-table-column
                            width="180px"
                            align="right">
                        <template slot="header" slot-scope="scope">
                            <el-input
                                    v-model="search"
                                    size="mini"
                                    placeholder="输入关键字搜索"/>
                        </template>

                    </el-table-column>

                </el-table>
            </el-main>

        </el-container>
    </el-container>
</template>
<script>
    export default {
        name: "home",
        data() {
            return {
                tableData: '',
                tableDataNotice: [],
                tableDataIssue: [],
                tableDataAdvise: [],
                search: '',
                community: JSON.parse(sessionStorage.getItem("community")),
                manager: JSON.parse(sessionStorage.getItem("manager")),
                btnFlag: true,
                loadingFlag: true,
                loadingFlagNotice: true,
                showFlag: 1,
                form: {
                    noticeId: '',
                    title: '',
                    content: '',
                    managerDto: ''
                },
                issueForm: {
                    title: '',
                    content: '',
                    communityId: '',
                    startTime: '',
                    endTime: ''
                },
                dialogFormVisible: false,
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                dateTime: ''
            }
        },
        methods: {


            //发布公告
            putNotice() {
                this.showFlag = 2;

            },
            //全部公告
            allNotice() {
                this.showFlag = 3;
                this.loadingFlag = true
                this.axios.get('/ten/getNoticeListByType', {
                    params: {
                        'communityId': this.community.communityId,
                        'type': this.manager.type
                    }
                })
                    .then(res => {
                        this.tableDataNotice = res.data.data.noticeList
                        this.loadingFlag = false
                    })
            },
            //提交公告
            onSubmitNotice() {
                this.form.managerDto = this.manager
                this.axios.post('/ten/putNotice', this.form)
                    .then(res => {
                        console.log(res)
                        if (res.data.status == "0") {
                            this.$message({
                                type: "success",
                                message: res.data.msg
                            })
                            //清空表单
                            this.form.title = ''
                            this.form.content = ''
                            //跳转全部公告
                            this.allNotice()
                        } else {
                            this.$message.error({
                                message: res.data.msg
                            })
                        }
                    })

            },
            //删除公告
            deleteNotice(e) {
                console.log(e)
                //弹出告警框
                this.$confirm('您真的要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //发起请求
                    this.axios.post('/ten/deleteNotice', e)
                        .then(res => {
                            if (res.data.status == 0) {
                                this.$message({
                                    type: 'success',
                                    message: '操作成功!'
                                });
                                //更新列表
                                this.allNotice()
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });

            },
            //修改公告
            updateNotice(e) {
                this.dialogFormVisible = true
                console.log(e)
                this.form.title = e.title
                this.form.content = e.content
                this.form.noticeId = e.noticeId
            },
            onUpdateNotice() {
                this.form.managerDto = this.manager
                this.axios.post('/ten/updateNotice', this.form)
                    .then(res => {
                        console.log(res)
                        if (res.data.status == "0") {
                            this.$message({
                                type: "success",
                                message: res.data.msg
                            })
                            //清空表单
                            this.form.title = ''
                            this.form.content = ''
                            //关闭弹窗
                            this.dialogFormVisible = false
                            //跳转全部公告
                            this.allNotice()
                        } else {
                            this.$message.error({
                                message: res.data.msg
                            })
                        }
                    })
            },
            //议题列表
            issueList() {
                var that = this;
                this.showFlag = 4;
                this.loadingFlag = true
                this.axios.get('/issue/issueList', {
                    params: {
                        'communityId': this.community.communityId
                    }
                })
                    .then(res => {
                        console.log(res)
                        let list = res.data.data.issueList;
                        list.forEach((item, index) => {

                            var start = that.getMyDate(item.issueStartTime);

                            var end = this.getMyDate(item.issueEndTime);

                            console.log(item.issueStartTime)
                            console.log(start)
                            item.issueStartTime = start;

                            item.issueEndTime = end;
                        })
                        this.tableDataIssue = list;
                        this.loadingFlag = false;
                    })
                    .catch(err => {

                    })
            },

            //发布议题
            putIssue() {
                this.showFlag = 5;

            },
            onSubmitIssue() {
                //将时间转换为毫秒值
                let startTime = new Date(this.dateTime[0]).getTime();
                let endTime = new Date(this.dateTime[1]).getTime();
                //将毫秒值封装到表单
                this.issueForm.startTime = startTime;
                this.issueForm.endTime = endTime;
                this.issueForm.communityId = this.community.communityId;
                this.axios.post('/issue/putIssue', this.issueForm)
                    .then(res => {
                        if (res.data.status == '0') {
                            this.$message({
                                type: "success",
                                message: res.data.msg
                            })
                            //清空表单
                            this.issueForm.title = ''
                            this.issueForm.content = ''
                            this.dateTime = ''
                        }
                    })
                    .catch(err => {

                    })

            },
            getMyDate(str) {
                var oDate = new Date(str),
                    oYear = oDate.getFullYear(),
                    oMonth = oDate.getMonth() + 1,
                    oDay = oDate.getDate(),
                    oTime = oYear + '-' + this.addZero(oMonth) + '-' + this.addZero(oDay)

                return oTime;
            },
            //补零操作
            addZero(num) {
                if (parseInt(num) < 10) {
                    num = '0' + num;
                }
                return num;
            },

            //投诉建议列表
            adviseList() {
                this.showFlag = 6;
                this.loadingFlag = true
                this.axios.get('/ten/adviseList', {params: {'communityId': this.community.communityId}})
                    .then(res => {
                        console.log(res);
                        let list = res.data.data.adviseList;
                        list.forEach((item, index) => {
                            if (item.type == 0) {
                                item.type = '实名投诉'

                            } else {
                                item.type = '匿名投诉'
                                item.name = '匿名'
                                item.phone = '无'
                            }
                        })

                        this.tableDataAdvise = list
                        this.loadingFlag = false;
                    })
                    .catch(res => {

                    })
            }


        },

        //创建后执行
        created() {
            this.allNotice()
        }
    };
</script>


<style>
    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }
</style>

