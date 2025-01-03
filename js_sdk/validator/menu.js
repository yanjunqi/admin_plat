// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema


const validator = {
  "meal_type": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "int"
      },
      {
        "range": [
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
        ]
      }
    ],
    "title": "类型",
    "defaultValue": 0,
    "label": "类型"
  },
  "name": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "string"
      }
    ],
    "title": "名称",
    "label": "名称"
  },
  "taste": {
    "rules": [
      {
        "required": true
      },
      {
        "format": "int"
      },
      {
        "range": [
          {
            "text": "家常",
            "value": 0
          },
          {
            "text": "微辣",
            "value": 1
          }
        ]
      }
    ],
    "title": "类型",
    "defaultValue": 0,
    "label": "类型"
  },
  "details_pic": {
    "rules": [
      {
        "format": "file"
      }
    ],
    "title": "图片",
    "label": "图片"
  }
}

const enumConverter = {
  "meal_type_valuetotext": {
    "0": "荤菜",
    "1": "素菜",
    "2": "汤类",
    "3": "其他"
  },
  "taste_valuetotext": {
    "0": "家常",
    "1": "微辣"
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
