const pubUrl = "http://ip地址或者域名"//这是要请求的数据接口的公共部分
const http = (options) =>{
  return new Promise((resolve,reject) => {
    wx.request({
      url: pubUrl+options.url,
      method:options.method || 'get',
      data:options.data || {},
      header: options.header || {
        'Authorization': 'Bearer ', // 替换为你的访问令牌注意Bearer后面需要一个空格
        'Content-Type': 'application/json'
      },
      success:resolve,
      fail:reject
    })
  })
}
export default http
