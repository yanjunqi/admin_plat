'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	const dbJQL = uniCloud.databaseForJQL({ // 获取JQL database引用，此处需要传入云函数的event和context，必传
			event,
			context 
		})
    //type为消息源标志位 报修/用车/提醒
	var currentDatestamp = new Date().getTime();
	let formData = {
	  "updatetime": currentDatestamp,
      "type":event.type,
      "content": event.content,
	  "user_id": event.uname,
      "event_id":event.eid,
      "hasRead":false
	}
	const num=await dbJQL.collection('messageCenter').where(`type == "${event.type}" && event_id == "${event.eid}"`).count();
    console.log(num.total)
    if(num.total == 0){
        await dbJQL.collection('messageCenter').add(formData)
    }
    else{
        dbJQL.collection('messageCenter').where(`type == "${event.type}" && event_id == "${event.eid}"`).update(formData)
    }
    
	//返回数据给客户端
	return event
};
