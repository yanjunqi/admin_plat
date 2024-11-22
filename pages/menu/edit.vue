<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="meal_type" label="类型" required>
        <uni-data-checkbox v-model="formData.meal_type" :localdata="formOptions.meal_type_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="name" label="名称" required>
        <uni-easyinput placeholder="菜品名" v-model="formData.name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="taste" label="类型" required>
        <uni-data-checkbox v-model="formData.taste" :localdata="formOptions.taste_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="details_pic" label="图片">
        <uni-file-picker file-mediatype="image" return-type="object" v-model="formData.details_pic"></uni-file-picker>
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
  import { validator } from '../../js_sdk/validator/menu.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'menu';

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
        "meal_type": 0,
        "name": "",
        "taste": 0,
        "details_pic": null
      }
      return {
        formData,
        formOptions: {
          "meal_type_localdata": [
            {
              "text": "荤菜",
              "value": 0
            },
            {
              "text": "素菜",
              "value": 1
            },
            {
              "text": "汤类",
              "value": 2
            },
            {
              "text": "其他",
              "value": 3
            }
          ],
          "taste_localdata": [
            {
              "text": "家常",
              "value": 0
            },
            {
              "text": "微辣",
              "value": 1
            }
          ]
        },
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
        db.collection(dbCollectionName).doc(id).field("meal_type,name,taste,details_pic").get().then((res) => {
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
