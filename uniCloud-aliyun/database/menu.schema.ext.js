// schema扩展相关文档请参阅：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
// schema扩展相关文档请参阅：https://uniapp.dcloud.net.cn/uniCloud/jql-schema-ext.html
module.exports = {   
    trigger: {
        beforeCreate: async function (
        	// 确定要监听的什么样的JQL指令
        	{
				collection,
				operation,
				addDataList,
				clientInfo
            } = {}) {
        		// 当上述jql指令被触发时，将执行这里的代码。这里就是普通的uniCloud代码，可以调用uniCloud的各种api。
        		console.log("这个触发器被触发了")
				const addDataItem = addDataList[0]
				switch (addDataItem.meal_type){
					case 0:
						addDataItem.meal_typename="荤菜";
						break;
					case 1:
						addDataItem.meal_typename="素菜"
						break;
					case 2:
                        addDataItem.meal_typename="汤类"
                        break;
                    default:
						addDataItem.meal_typename="其他"
						break;
				}
            },

    }
}
