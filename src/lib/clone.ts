// 深复制函数
function clone<X>(data: X): X {
  return JSON.parse(JSON.stringify(data));
}

export default clone;
