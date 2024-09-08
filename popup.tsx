import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  const open = () => {
    chrome.tabs.create({ url: "/tabs/List.html" })
  }

  return (
    <div>
      <button onClick={open}>open</button>
    </div>
  )
}

export default IndexPopup
