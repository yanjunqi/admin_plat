// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "sponsor": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "部门",
    "label": "部门"
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
  "orderers_noon": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "午餐组员",
    "label": "午餐组员"
  },
  "ordererNum_noon": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "午餐订餐数",
    "defaultValue": 0,
    "label": "午餐订餐数"
  },
  "orderers_night": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "晚餐组员",
    "label": "晚餐组员"
  },
  "ordererNum_night": {
    "rules": [
      {
        "format": "int"
      }
    ],
    "title": "晚餐订餐数",
    "defaultValue": 0,
    "label": "晚餐订餐数"
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
