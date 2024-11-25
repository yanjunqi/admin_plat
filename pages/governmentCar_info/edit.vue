<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="reason" label="用车事由">
        <uni-easyinput v-model="formData.reason" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="department" label="申请部门">
        <uni-easyinput v-model="formData.department" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="destination" label="途径地点">
        <uni-easyinput v-model="formData.destination" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="passenger" label="乘车人">
        <uni-easyinput v-model="formData.passenger" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="mobile" label="手机号码">
        <uni-easyinput placeholder="手机号码" v-model="formData.mobile" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="boarding_time" label="用车开始时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.boarding_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="alighting_time" label="用车结束时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.alighting_time"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="note" label="备注">
        <uni-easyinput v-model="formData.note" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="driver" label="驾驶人">
        <uni-easyinput v-model="formData.driver" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="approver" label="审批人">
        <uni-easyinput v-model="formData.approver" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="plate" label="车牌号">
        <uni-easyinput v-model="formData.plate" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="begin_mileage" label="起始里程">
        <uni-easyinput v-model="formData.begin_mileage"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="end_mileage" label="终点里程">
        <uni-easyinput v-model="formData.end_mileage"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="beApproved1" label="一级审批">
        <switch @change="binddata('beApproved1', $event.detail.value)" :checked="formData.beApproved1"></switch>
      </uni-forms-item>
      <uni-forms-item name="beApproved2" label="二级审批">
        <switch @change="binddata('beApproved2', $event.detail.value)" :checked="formData.beApproved2"></switch>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
        <navigator open-type="navigateBack" style="margin-left: 15px;">
          <button class="uni-button" style="width: 100px;">返回</button>
        </navigator>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/governmentCar_info.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'governmentCar_info';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.includes(key)) {
        result[key] = validator[key]
      }
    }
    return result
  }

  

  export default {
    data() {
      let formData = {
        "reason": "",
        "department": "",
        "destination": "",
        "passenger": "",
        "mobile": "",
        "boarding_time": null,
        "alighting_time": null,
        "note": "",
        "driver": "",
        "approver": "",
        "plate": "",
        "begin_mileage": "",
        "end_mileage": "",
        "beApproved1": false,
        "beApproved2": false,
		"uid":""
      }
      return {
        formData,
        formOptions: {},
        rules: {
          ...getValidator(Object.keys(formData))
        },
		name:""
      }
    },
    onLoad(e) {
      if (e.id) {
        const id = e.id
        this.formDataId = id
        this.getDetail(id)
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      
      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
          uni.showToast({
            title: '修改成功'
          })
		  const db = uniCloud.database() //代码块为cdb
		  let formData = {
		  				"type":2,
		  				"content": "用车已审核",
		  				"uid": this.formData.uid,
		  				"nickname":this.name
		  			  }
		  db.collection('messageCenter').add(formData)
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      },

      /**
       * 获取表单数据
       * @param {Object} id
       */
      getDetail(id) {
        uni.showLoading({
          mask: true
        })
        db.collection(dbCollectionName).doc(id).field("reason,department,destination,passenger,mobile,boarding_time,alighting_time,note,driver,approver,plate,begin_mileage,end_mileage,beApproved1,beApproved2,uid").get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
            
          }
		  db.collection("uni-id-users").where(`_id == "${this.formData.uid}"`).field("nickname").get().then((res) => {
		            const data = res.result.data[0]
					console.log("this.formData.uid")
					console.log(this.formData.uid)
		            if (data) {
		              this.name=data.nickname
		            }
					else{
						console.log("fail")
					}
		          }).catch((err) => {
		            uni.showModal({
		              content: err.message || '请求服务失败',
		              showCancel: false
		            })
		          }).finally(() => {
		            uni.hideLoading()
		          })
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  }
</script>
