import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"

import { Storage } from "@plasmohq/storage"

import { StorageKey } from "~/utils"

const storage = new Storage()

const tooltipId = "easy-english-word-tooltip"

// 创建气泡元素并添加到文档中
const tooltip = document.createElement("div")
tooltip.id = tooltipId
tooltip.style.zIndex = "9999"
tooltip.style.padding = "0 10px 0"
tooltip.style.display = "none"
tooltip.style.position = "absolute"
tooltip.style.borderRadius = "10px"
tooltip.style.backgroundColor = "#f0f0f0"
tooltip.innerHTML = `
    <p>
      <button data-key="translate">翻译</button>
      <button data-key="collect">收藏</button>
    </p>
  `
tooltip.addEventListener("click", async (event) => {
  const button = event.target as HTMLButtonElement
  const key = button.getAttribute("data-key")
  if (!key) return
  const text = tooltip.getAttribute("data-text")

  if (key === "translate") {
  }
  if (key === "collect") {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1 // 月份从0开始，所以要加1
    const day = now.getDate()
    const date = `${year}-${month}-${day}`
    const words = (await storage.get(StorageKey.WORDS)) || {}
    const todayWords = words[date] || []
    if (todayWords.includes(text)) return
    todayWords.push({
      text,
      time: Date.now(),
      url: window.location.href
    })
    words[date] = todayWords
    await storage.set(StorageKey.WORDS, words)
    hideTooltip()
  }
})
document.body.appendChild(tooltip)

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
    
  `
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

document.addEventListener("mouseup", function (event) {
  const selection = window.getSelection()
  const selectedText = selection.toString().trim()

  if (!selectedText) {
    hideTooltip()
    return
  }

  // 获取选中的范围
  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()
  tooltip.setAttribute("data-text", selectedText)
  tooltip.style.top = `${rect.top + window.scrollY - rect.height - 10}px`
  tooltip.style.left = `${rect.left + window.scrollX}px`
  tooltip.style.display = "block"
})

const hideTooltip = () => {
  tooltip.style.display = "none"
}
