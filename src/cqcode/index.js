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

export default {
  install: function (Vue, options) {
    Vue.prototype.$cqcode = {
      FaceCode: faceCode,
      Parse: function (text) {
        let M = []
        let textP = 0
        while (1) {
          let result = null
          result = reAll.exec(text)
          if (result === null) {
            // console.log('cqcode_textP_end', textP, text.length)
            if ((text.length - textP) > 0) {
              M.push({
                func: null,
                text: replaceText(text.substring(textP, text.length))
              })
            }
            break
          }
          // console.log('cqcode_textP', textP, result.index, result[0].length)
          if ((result.index - textP) > 0) {
            M.push({
              func: null,
              text: replaceText(text.substring(textP, result.index))
            })
          }
          textP = result.index + result[0].length
          let opts = Object.create(null)
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
          M.push({
            func: result[1],
            opts: opts
          })
        }
        // console.log('cqcode', M)
        return M
      }
    }
  }
}
