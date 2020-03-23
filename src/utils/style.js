// 不同分辨率下的列宽度修改
export const columnStyle = function(a, b, c) {
  if (screen.width >= 1920) {
    if (a !== null || a !== undefined || a !== '') { return a }
    return null
  } else if (screen.width >= 1600) {
    if (b !== null || b !== undefined || b !== '') { return b }
    return null
  } else if (screen.width >= 1366) {
    if (c !== null || c !== undefined || c !== '') { return c }
    return null
  }
}
