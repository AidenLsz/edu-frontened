import request from '@/common/utils/request'
export function commonAjax(url, data, method = 'post') {
  // const urlArray = url.split('/')
  // const len = urlArray.length
  // url = '/' + urlArray[len - 2] + '/' + urlArray[len - 1]
  if (method === 'post') {
    let params = new FormData();
    for (var k in data) {
      params.append(k, data[k]);
    }
    //
    return request({
      // url: url + '/' + action,
      url: url,
      method: method,
      data: params
    })
  } else if (method === 'get') {
    return request({
      url: url,
      method: method,
      params: data
    })
  }
}
