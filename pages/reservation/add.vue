<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="weekday" validateTrigger="bind">
       <uni-forms-item name="weekday" label="日期">
          <uni-data-checkbox v-model="weekday" :localdata="formOptions.d_localdata"></uni-data-checkbox>
        </uni-forms-item>
    </uni-forms>
    <uni-forms ref="form" :model="formData" validateTrigger="bind">
      <uni-forms-item name="sponsor" label="订餐人">
        <uni-easyinput placeholder="订餐发起人" v-model="formData.sponsor" trim="both"></uni-easyinput>
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
import { formatDate } from '../../uni_modules/uni-dateformat/components/uni-dateformat/date-format.js';

    //日期
    var myDatestamp = new Date();
    var today=new Date(myDatestamp.toLocaleDateString()).getTime();
    var tomorrow=today +86400*1000
    
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
        "ordererNum_night": 0,
      }
      return {
        formData,
        formOptions: {
            "d_localdata":[
                {
                  "text":"今天",
                    "value":0  
                },
                {
                    "text":"明天",
                    "value":1
                }
                
            ]
        },
        rules: {
          ...getValidator(Object.keys(formData))
        },
        weekday:0
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
        // if(this.weekday==0){
        //     console.log("今天")
        //     this.formData.date=today
        //     console.log(this.formData.date)
        // }
        // else{
        //     console.log("明天")
        //     this.formData.date=tomorrow
        //     console.log(this.formData.date)
        // }
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
        if(this.weekday==0){
            console.log("今天")
            value.date=today
            console.log(value.date)
        }
        else{
            console.log("明天")
            value.date=tomorrow
            console.log(value.date)
        }
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
