import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"

import { Storage } from "@plasmohq/storage"

import { parseJson, StorageKey } from "~/utils"

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = `
    /* 在此添加样式 */
  `
  return style
}

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

// 创建存储实例
const storage = new Storage()
const tooltipId = "daisy-english-selector-tooltip"

// 工具函数：创建元素
const createTooltip = (): HTMLElement => {
  const tooltip = document.createElement("div")
  tooltip.id = tooltipId
  tooltip.style.zIndex = "1000000"
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
  return tooltip
}

// 工具函数：更新气泡位置
const updateTooltipPosition = (rect: DOMRect, tooltip: HTMLElement): void => {
  tooltip.style.top = `${rect.top + window.scrollY - rect.height - 10}px`
  tooltip.style.left = `${rect.left + window.scrollX}px`
}

// 工具函数：隐藏气泡
const hideTooltip = (tooltip: HTMLElement): void => {
  tooltip.style.display = "none"
}

// 工具函数：处理收藏逻辑
const handleCollect = async (text: string): Promise<void> => {
  const now = new Date()
  const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
  const words = (await storage.get(StorageKey.WORDS)) || {}
  const todayWords = words[date] || []

  if (todayWords.some((word: { text: string }) => word.text === text)) return

  todayWords.push({ text, time: Date.now(), url: window.location.href })
  words[date] = todayWords
  await storage.set(StorageKey.WORDS, words)
}

// 事件监听：点击气泡按钮
const handleTooltipClick = async (
  event: MouseEvent,
  tooltip: HTMLElement
): Promise<void> => {
  const button = event.target as HTMLButtonElement
  const key = button.getAttribute("data-key")
  if (!key) return

  const text = tooltip.getAttribute("data-text")

  if (key === "translate") {
    // 翻译逻辑可以在此实现
    const res = await fetch(
      `http://localhost:3000/api/translate?word=${text}`
    ).then((res) => res.json())

    console.log("res: ", res)
    const data = parseJson(res.data.translation)
  }

  if (key === "collect") {
    if (text) {
      await handleCollect(text)
      hideTooltip(tooltip)
    }
  }
}

// 初始化气泡
const tooltip = createTooltip()
tooltip.addEventListener("click", (event) => handleTooltipClick(event, tooltip))
document.body.appendChild(tooltip)

// 事件监听：鼠标选择文本时显示气泡
document.addEventListener("mouseup", (event) => {
  const selection = window.getSelection()
  const selectedText = selection?.toString().trim()

  if (!selectedText) {
    hideTooltip(tooltip)
    return
  }

  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()
  tooltip.setAttribute("data-text", selectedText)
  updateTooltipPosition(rect, tooltip)
  tooltip.style.display = "block"
})
