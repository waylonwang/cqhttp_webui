import faceCode from './face_code'
var reAll = /\[CQ:([a-zA-z._-]+)((?:,[a-zA-z._-]+=[^\][,]+)*)\]/gi

function replaceValue (text) {
  text = text.replace('&#44;', ',')
  text = text.replace('&#93;', ']')
  text = text.replace('&#91;', '[')
  text = text.replace('&amp;', '&')
  return text
}

function replaceText (text) {
  text = text.replace('&#93;', ']')
  text = text.replace('&#91;', '[')
  text = text.replace('&amp;', '&')
  return text
}

function NewMessageItem (func, opts) {
  return {
    func: func,
    opts: opts
  }
}

function NewMessageText (text) {
  return {
    func: null,
    text: text
  }
}

function parseArrayMessage (text) {
  let M = []
  for (let i = 0; i < text.length; i++) {
    let v = text[i]
    if (v.type === 'text') {
      M.push(NewMessageText(replaceText(v.data['text'])))
    } else {
      M.push(NewMessageItem(v.type, v.data))
    }
  }
  return M
}

function parseStringMeaage (text) {
  let M = []
  let textP = 0
  while (1) {
    let result = null
    result = reAll.exec(text)
    if (result === null) {
      // console.log('cqcode_textP_end', textP, text.length)
      if ((text.length - textP) > 0) {
        M.push(NewMessageText(replaceText(text.substring(textP, text.length))))
      }
      break
    }
    // console.log('cqcode_textP', textP, result.index, result[0].length)
    if ((result.index - textP) > 0) {
      M.push(NewMessageText(replaceText(text.substring(textP, result.index))))
    }
    textP = result.index + result[0].length
    let opts = {}
    if (result[2] !== null) {
      let r = result[2].split(',')
      for (var i = 0; i < r.length; i++) {
        if (r[i] === '') {
          continue
        }
        let p = r[i].indexOf('=')
        opts[r[i].substring(0, p)] = replaceValue(r[i].substring(p + 1))
      }
    }
    M.push(NewMessageItem(result[1], opts))
  }
  // console.log('cqcode', M)
  return M
}

export default {
  install: function (Vue, options) {
    Vue.prototype.$cqcode = {
      FaceCode: faceCode,
      Parse: function (text) {
        if (typeof (text) === 'string') {
          return parseStringMeaage(text)
        } else if (typeof (text) === 'object') {
          return parseArrayMessage(text)
        }
      }
    }
  }
}
