<template>

</template>

<script>
	import {
		stringifyQuery,
		stringifyField,
		stringifyGroupField,
		getTimeOfSomeDayAgo,
		division,
		format,
		parseDateTime,
		getFieldTotal,
		debounce
	} from '@/js_sdk/uni-stat/util.js'

	import {
		deviceFeildsMap,
		userFeildsMap
	} from './fieldsMap.js'

	export default {
		data() {
			return {
				query: {
					platform_id: '',
					start_time: [getTimeOfSomeDayAgo(1), new Date().getTime()]
				},
				deviceTableData: [],
				userTableData: [],
				// panelData: panelOption,
				// 每页数据量
				pageSize: 10,
				// 当前页
				pageCurrent: 1,
				// 数据总量
				total: 0,
				loading: false,
				complete: false,
				statSetting: {
					mode: "",
					day: 7
				},
				statModeList: [
					{ "value": "open", "text": "开启" },
					{ "value": "close", "text": "关闭" },
					{ "value": "auto", "text": "节能" },
				],
				showAddAppId: false,
				showdbInit: false
			}
		},
		onReady() {
			// 创建一个防抖函数，延迟执行getAllData方法
			this.debounceGet = debounce(() => {
				this.getAllData(this.queryStr);
			}, 300);

			// 执行防抖函数
			this.debounceGet();

			// 检查appId
			this.checkAppId();

			this.checkdbInit();
		},

		watch: {
			query: {
				deep: true,
				handler(newVal) {
					// 监听query对象的变化，并在变化时执行防抖函数
					this.debounceGet(this.queryStr);
				}
			}
		},

		computed: {
			queryStr() {
				// 默认查询条件
				const defQuery = `(dimension == "hour" || dimension == "day")`;
				// 将query对象转换为查询字符串并与默认查询条件合并
				return stringifyQuery(this.query) + ' && ' + defQuery;
			},

			deviceTableFields() {
				// 返回设备表格的字段映射
				return this.tableFieldsMap(deviceFeildsMap);
			},

			userTableFields() {
				// 返回用户表格的字段映射
				return this.tableFieldsMap(userFeildsMap);
			}
		},

		methods: {
			getAllData(queryStr) {
				// 获取设备数据
				this.getApps(this.queryStr, deviceFeildsMap, 'device');
				// 获取用户数据
				this.getApps(this.queryStr, userFeildsMap, 'user');
			},

			tableFieldsMap(fieldsMap) {
				let tableFields = [];
				const today = [];
				const yesterday = [];
				const other = [];

				for (const mapper of fieldsMap) {
					if (mapper.field) {
						if (mapper.hasOwnProperty('value')) {
							// 如果字段映射中有'value'属性，则根据映射生成今天和昨天的字段
							const t = JSON.parse(JSON.stringify(mapper));
							const y = JSON.parse(JSON.stringify(mapper));

							if (mapper.field !== 'total_users' && mapper.field !== 'total_devices') {
								t.title = '今日' + mapper.title;
								t.field = mapper.field + '_value';
								y.title = '昨日' + mapper.title;
								y.field = mapper.field + '_contrast';

								today.push(t);
								yesterday.push(y);
							} else {
								t.field = mapper.field + '_value';
								other.push(t);
							}
						} else {
							// 将其他字段直接添加到tableFields中
							tableFields.push(mapper);
						}
					}
				}

				// 按顺序合并所有的字段
				tableFields = [...tableFields, ...today, ...yesterday, ...other];

				return tableFields;
			},


			getApps(query, fieldsMap, type = "device") {
				this.loading = true
				const db = uniCloud.database()
				const appDaily = db.collection('uni-stat-result').where(query).getTemp();
				const appList = db.collection('opendb-app-list').getTemp()
				db.collection(appDaily, appList)
					.field(
						`${stringifyField(fieldsMap, '', 'value')},stat_date,appid,dimension`
					)
					.groupBy(`appid,dimension,stat_date`)
					.groupField(stringifyGroupField(fieldsMap, '', 'value'))
					.orderBy(`appid`, 'desc')
					.get()
					.then((res) => {
						let {
							data
						} = res.result
						//console.log('data: ', data)
						this[`${type}TableData`] = []
						if (!data.length) return
						let appids = [],
							todays = [],
							yesterdays = [],
							isToday = parseDateTime(getTimeOfSomeDayAgo(0), '', ''),
							isYesterday = parseDateTime(getTimeOfSomeDayAgo(1), '', '')
						for (const item of data) {
							const {
								appid,
								name
							} = item.appid && item.appid[0] || {}
							item.appid = appid
							item.name = name

							if (appids.indexOf(item.appid) < 0) {
								appids.push(item.appid)
							}
							if (item.dimension === 'hour' && item.stat_date === isToday) {
								todays.push(item)
							}
							if (item.dimension === 'day' && item.stat_date === isYesterday) {
								yesterdays.push(item)
							}
						}
						const keys = fieldsMap.map(f => f.field).filter(Boolean)
						for (const appid of appids) {
							const rowData = {}
							const t = todays.find(item => item.appid === appid)
							const y = yesterdays.find(item => item.appid === appid)
							for (const key of keys) {
								if (key === 'appid' || key === 'name') {
									rowData[key] = t && t[key]
								} else {
									const value = t && t[key]
									const contrast = y && y[key]
									rowData[key + '_value'] = format(value)
									rowData[key + '_contrast'] = format(contrast)
								}
							}
							if (appid) {
								rowData[`total_${type}s_value`] = "获取中...";
							}
							this[`${type}TableData`].push(rowData);
							if (appid) {
								// total_users 不准确，置空后由 getFieldTotal 处理, appid 不存在时暂不处理
								t[`total_${type}s`] = 0
								const query = JSON.parse(JSON.stringify(this.query))
								query.start_time = [getTimeOfSomeDayAgo(0), new Date().getTime()]
								query.appid = appid
								getFieldTotal.call(this, query, `total_${type}s`).then(total => {
									this[`${type}TableData`].find(item => item.appid === appid)[
										`total_${type}s_value`] = total
								})
							}
						}
					}).catch((err) => {
						console.error(err)
						// err.message 错误信息
						// err.code 错误码
					}).finally(() => {
						this.loading = false;
						this.complete = true;
					})
			},

			navTo(url, id) {
				if (url.indexOf('http') > -1) {
					// 如果url中包含'http'，则在新窗口中打开该链接
					window.open(url);
				} else {
					if (id) {
						// 如果有提供id参数，则将其添加到url中作为查询参数
						url = `${url}?appid=${id}`;
					}
					// 使用uni.navigateTo方法进行页面跳转
					uni.navigateTo({
						url
					});
				}
			},

			toUrl(url) {
				// #ifdef H5
				// 在新窗口中打开url链接（仅适用于H5平台）
				window.open(url, "_blank");
				// #endif
			},

			toAddAppId() {
				// 隐藏添加App ID的标识
				this.showAddAppId = false;
				// 使用uni.navigateTo方法进行页面跳转到指定路径
				uni.navigateTo({
					url: "/pages/system/app/list",
					events: {
						// 注册事件，用于在目标页面刷新数据后执行回调
						refreshData: () => {
							this.checkAppId();
						}
					}
				});
			},

			async checkAppId() {
				// 获取uniCloud数据库的实例
				const db = uniCloud.database();
				// 查询'opendb-app-list'集合的数据数量
				let res = await db.collection('opendb-app-list').count();
				// 如果查询结果为空或total为0，则显示添加App ID的标识
				this.showAddAppId = (!res.result || res.result.total === 0) ? true : false;
			},

			async checkdbInit(){
				// 获取uniCloud数据库的实例
				const db = uniCloud.database();
				// 查询'opendb-app-list'集合的数据数量
				let res = await db.collection('opendb-admin-menus').count();
				// 如果查询结果为空或total为0，则显示添加App ID的标识
				this.showdbInit = (!res.result || res.result.total === 0) ? true : false;
				if (this.showdbInit) {
					uni.showModal({
						title: "重要提示",
						content: `检测到您未初始化数据库，请先右键uni-admin项目根目下的 uniCloud/database 目录，执行初始化云数据库，否则左侧无法显示菜单等数据`,
						showCancel: false,
						confirmText: "我知道了"
					});
				}
			}

		}

	}
</script>

<style>
	.uni-stat-card-header {
		display: flex;
		justify-content: space-between;
		color: #555;
		font-size: 14px;
		font-weight: 600;
		padding: 10px 0;
		margin-bottom: 15px;
	}

	.uni-table-scroll {
		min-height: auto;
	}

	.link-btn-color {
		color: #007AFF;
		cursor: pointer;
	}

	.uni-stat-text {
		color: #606266;
	}

	.mt10 {
		margin-top: 10px;
	}

	.uni-radio-cell {
		margin: 0 10px;
	}

	.uni-stat-tooltip-s {
		width: 400px;
		white-space: normal;
	}

	.uni-a {
		cursor: pointer;
		text-decoration: underline;
		color: #555;
		font-size: 14px;
	}
</style>
