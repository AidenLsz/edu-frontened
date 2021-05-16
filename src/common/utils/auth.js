import Cookies from 'js-cookie'

export function set(k,v) {
  return Cookies.set(k, v)
}
export function get(k) {
  return Cookies.get(k)
}
export function remove(k){
  Cookies.remove(k);
}
