// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "menu1": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "午餐",
    "label": "午餐"
  },
  "menu2": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "午餐",
    "label": "午餐"
  },
  "menu3": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "午餐",
    "label": "午餐"
  },
  "menu4": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "午餐",
    "label": "午餐"
  },
  "menu5": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "晚餐",
    "label": "晚餐"
  },
  "menu6": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "晚餐",
    "label": "晚餐"
  },
  "menu7": {
    "rules": [
      {
        "format": "string"
      }
    ],
    "title": "晚餐",
    "label": "晚餐"
  },
  "date": {
    "rules": [
      {
        "format": "int"
      },
      {
        "range": [
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
      }
    ],
    "title": "星期",
    "defaultValue": 0,
    "label": "星期"
  }
}

const enumConverter = {
  "date_valuetotext": {
    "0": "周一",
    "1": "周二",
    "2": "周三",
    "3": "周四",
    "4": "周五",
    "5": "周六",
    "6": "周日"
  }
}

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
