<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="overview" label="基本信息">
        <uni-easyinput v-model="formData.overview" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="details" label="损坏详情">
        <uni-easyinput v-model="formData.details" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="details_pic" label="照片详情">
        <uni-file-picker file-mediatype="image" return-type="array" v-model="formData.details_pic"></uni-file-picker>
      </uni-forms-item>
      <uni-forms-item name="applicant" label="">
        <uni-easyinput v-model="formData.applicant" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="mobile" label="手机号码">
        <uni-easyinput placeholder="手机号码" v-model="formData.mobile" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="state" label="是否完成">
        <switch @change="binddata('state', $event.detail.value)" :checked="formData.state"></switch>
      </uni-forms-item>
      <uni-forms-item name="review_info" label="科室审核">
        <uni-easyinput v-model="formData.review_info" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="result" label="维修结果">
        <uni-easyinput v-model="formData.result" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="repair_date" label="报修时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.repair_date"></uni-datetime-picker>
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
  import { validator } from '../../js_sdk/validator/repair_info.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'repair_info';

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
        "overview": "",
        "details": "",
        "details_pic": [],
        "applicant": "",
        "mobile": "",
        "state": false,
        "review_info": "",
        "result": "",
        "repair_date": null
      }
      return {
        formData,
        formOptions: {},
        rules: {
          ...getValidator(Object.keys(formData))
        }
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
        return db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      }
    }
  }
</script>
