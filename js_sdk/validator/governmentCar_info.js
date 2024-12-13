// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "reason": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "用车事由",
    "label": "用车事由"
  },
  "department": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "申请部门",
    "label": "申请部门"
  },
  "destination": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "目的地",
    "label": "目的地"
  },
  "passenger": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "乘车人",
    "label": "乘车人"
  },
  "mobile": {
    "rules": [
      {
        "format": "string"
      },
      {
        "pattern": "^\\+?[0-9-]{3,20}$"
      }
    ],
    "title": "手机号码",
    "label": "手机号码"
  },
  "boarding_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "用车时间",
    "label": "用车时间"
  },
  "alighting_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "预计返回时间",
    "label": "预计返回时间"
  },
  "note": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "备注",
    "defaultValue": "",
    "label": "备注"
  },
  "driver": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "驾驶人",
    "defaultValue": "",
    "label": "驾驶人"
  },
  "approver": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "审批人",
    "defaultValue": "",
    "label": "审批人"
  },
  "plate": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "车牌号",
    "defaultValue": "",
    "label": "车牌号"
  },
  "begin_mileage": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "起始里程",
    "label": "起始里程"
  },
  "end_mileage": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "终点里程",
    "label": "终点里程"
  },
  "beChanged": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "title": "是否修改",
    "defaultValue": false,
    "label": "是否修改"
  },
  "beApproved1": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "title": "一级审批",
    "defaultValue": false,
    "label": "一级审批"
  },
  "beApproved2": {
    "rules": [
      {
        "format": "bool"
      }
    ],
    "title": "二级审批",
    "defaultValue": false,
    "label": "二级审批"
  },
  "create_time": {
    "rules": [
      {
        "format": "timestamp"
      }
    ],
    "title": "创建时间",
    "label": "创建时间"
  }
}

const enumConverter = {}

function filterToWhere(filter, command) {
  let where = {}
  for (let field in filter) {
    let { type, value } = filter[field]
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value)
        }
        break;
      case "select":
        if (value.length) {
          let selectValue = []
          for (let s of value) {
            selectValue.push(command.eq(s))
          }
          where[field] = command.or(selectValue)
        }
        break;
      case "range":
        if (value.length) {
          let gt = value[0]
          let lt = value[1]
          where[field] = command.and([command.gte(gt), command.lte(lt)])
        }
        break;
      case "date":
        if (value.length) {
          let [s, e] = value
          let startDate = new Date(s)
          let endDate = new Date(e)
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
      case "timestamp":
        if (value.length) {
          let [startDate, endDate] = value
          where[field] = command.and([command.gte(startDate), command.lte(endDate)])
        }
        break;
    }
  }
  return where
}

export { validator, enumConverter, filterToWhere }
