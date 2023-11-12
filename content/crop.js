
function crop (image, area, dpr, preserve, format, done) {
  var top = area.y * dpr
  var left = area.x * dpr
  var width = area.w * dpr
  var height = area.h * dpr
  var w = (dpr !== 1 && preserve) ? width : area.w
  var h = (dpr !== 1 && preserve) ? height : area.h

  var canvas = null
  var template = null
  if (!canvas) {
    template = document.createElement('template')
    canvas = document.createElement('canvas')
    document.body.appendChild(template)
    template.appendChild(canvas)
  }
  canvas.width = w
  canvas.height = h

  if (image instanceof Array) {
    ;(function loop (index, done) {
      if (image.length === index) {
        done()
        return
      }
      var img = new Image()
      img.onload = () => {
        var context = canvas.getContext('2d')
        context.drawImage(img,
          left, top,
          width, height,
          0, image[index].offset,
          w, h
        )
        loop(++index, done)
      }
      img.src = image[index].image
    })(0, () => {
      var cropped = canvas.toDataURL(`image/${format}`)
      done(cropped)
    })
  }
  else {
    var img = new Image()
    img.onload = () => {
      var context = canvas.getContext('2d')
      context.drawImage(img,
        left, top,
        width, height,
        0, 0,
        w, h
      )
      var cropped = canvas.toDataURL(`image/${format}`)
      done(cropped)
    }
    img.src = image
  }
}
