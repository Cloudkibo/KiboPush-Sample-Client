var onEnable = function (id, isActive) {
  console.log()
  var data = { 'id': id, 'isActive': isActive }
  $.ajax({
    type: 'POST',
    data: data,
    url: 'http://localhost:3000/workflows/enable',
    success: function (data) {
      console.log(data)
      var location = window.location
      location.reload()
    }
  })
}
