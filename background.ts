/** 定义右键菜单列表 */
const menuList: (chrome.contextMenus.CreateProperties & {
  action?(tab: chrome.tabs.Tab): void
})[] = [
  {
    id: "issues",
    title: "功能申请 && 问题反馈",
    contexts: ["action"],
    action() {
      chrome.tabs.create({
        url: "https://github.com/Dolov/chrome-easy-bookmark/issues"
      })
    }
  },
  {
    id: "setting",
    title: "个性化设置",
    contexts: ["action"],
    action() {
      chrome.tabs.create({ url: "./tabs/setting.html" })
    }
  },
  {
    id: "favorite",
    title: "收藏列表",
    contexts: ["action"],
    action() {
      chrome.tabs.create({ url: "./tabs/favorite.html" })
    }
  }
]

/** 创建右键菜单 */
menuList.forEach((item) => {
  const { action, ...menuProps } = item
  chrome.contextMenus.create(menuProps)
})

/** 监听右键菜单的点击事件，执行对应的行为 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  const { menuItemId } = info
  const menu = menuList.find((item) => item.id === menuItemId)
  if (!menu) return
  const { action } = menu
  action && action(tab)
})
