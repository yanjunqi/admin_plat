<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="date" label="日期">
        <uni-datetime-picker return-type="timestamp" v-model="formData.date"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="sponsor" label="订餐部门">
        <uni-easyinput placeholder="订餐部门" v-model="formData.sponsor" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="mobile" label="手机号码">
        <uni-easyinput placeholder="手机号码" v-model="formData.mobile" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="orderers_noon" label="午餐组员">
        <uni-easyinput placeholder="所有订餐者" v-model="formData.orderers_noon" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="ordererNum_noon" label="午餐订餐数">
        <uni-easyinput placeholder="订餐数" type="number" v-model="formData.ordererNum_noon"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="orderers_night" label="晚餐组员">
        <uni-easyinput placeholder="所有订餐者" v-model="formData.orderers_night" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="ordererNum_night" label="晚餐订餐数">
        <uni-easyinput placeholder="订餐数" type="number" v-model="formData.ordererNum_night"></uni-easyinput>
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
  import { validator } from '../../js_sdk/validator/reservation.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'reservation';

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
        "date": null,
        "sponsor": "",
        "mobile": "",
        "orderers_noon": "",
        "ordererNum_noon": 0,
        "orderers_night": "",
        "ordererNum_night": 0
      }
      return {
        formData,
        formOptions: {},
        rules: {
          ...getValidator(Object.keys(formData))
        }
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
        db.collection(dbCollectionName).doc(id).field("date,sponsor,mobile,orderers_noon,ordererNum_noon,orderers_night,ordererNum_night").get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
            
          }
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
