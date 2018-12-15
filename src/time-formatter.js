module.exports = timestamp => {
  const date = new Date(timestamp)
  const yearStr = date.getFullYear()
  const monthStr = date.getMonth() + 1 < 10 ? `0${(date.getMonth() + 1)}` : date.getMonth() + 1
  const dayStr = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  const hourStr = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  const minuteStr = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  const secondStr = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()

  return `${yearStr}-${monthStr}-${dayStr} ${hourStr}:${minuteStr}:${secondStr}`
}
