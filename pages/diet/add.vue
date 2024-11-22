<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="menu1" label="午餐">
        <uni-data-picker v-model="formData.menu1" collection="menu" orderby="first_letter asc" field="name as value, name as text"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="menu2" label="午餐">
        <uni-data-picker v-model="formData.menu2" collection="menu" orderby="first_letter asc" field="name as value, name as text"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="menu3" label="午餐">
        <uni-data-picker v-model="formData.menu3" collection="menu" orderby="first_letter asc" field="name as value, name as text"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="menu4" label="午餐">
        <uni-data-picker v-model="formData.menu4" collection="menu" orderby="first_letter asc" field="name as value, name as text"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="menu5" label="晚餐">
        <uni-data-picker v-model="formData.menu5" collection="menu" orderby="first_letter asc" field="name as value, name as text"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="menu6" label="晚餐">
        <uni-data-picker v-model="formData.menu6" collection="menu" orderby="first_letter asc" field="name as value, name as text"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="menu7" label="晚餐">
        <uni-data-picker v-model="formData.menu7" collection="menu" orderby="first_letter asc" field="name as value, name as text"></uni-data-picker>
      </uni-forms-item>
      <uni-forms-item name="date" label="星期">
        <uni-data-checkbox v-model="formData.date" :localdata="formOptions.date_localdata"></uni-data-checkbox>
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
  import { validator } from '../../js_sdk/validator/diet.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'diet';

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
        "menu1": "",
        "menu2": "",
        "menu3": "",
        "menu4": "",
        "menu5": "",
        "menu6": "",
        "menu7": "",
        "date": 0
      }
      return {
        formData,
        formOptions: {
          "date_localdata": [
            {
              "text": "周一",
              "value": 0
            },
            {
              "text": "周二",
              "value": 1
            },
            {
              "text": "周三",
              "value": 2
            },
            {
              "text": "周四",
              "value": 3
            },
            {
              "text": "周五",
              "value": 4
            },
            {
              "text": "周六",
              "value": 5
            },
            {
              "text": "周日",
              "value": 6
            }
          ]
        },
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
