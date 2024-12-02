import classnames from "classnames"
import React from "react"
import { createRoot } from "react-dom/client"

const containerId = "daisy-english-message-container"

interface MessageRef {
  addMessage: (type: string, content: string, duration?: number) => void
}

export const Message = (props, ref) => {
  const [messages, setMessages] = React.useState([])

  React.useImperativeHandle(
    ref,
    () => {
      return {
        addMessage
      }
    },
    []
  )

  // 添加新消息
  const addMessage = (type, content, duration = 3000) => {
    const newMessage = { type, content, id: Date.now() }
    setMessages((prevMessages) => [...prevMessages, newMessage])

    // 自动消失，3秒后移除消息
    setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== newMessage.id)
      )
    }, duration)
  }

  return (
    <div className="toast toast-top toast-center">
      {messages.map((message) => {
        const { id, type, content } = message
        return (
          <div
            key={id}
            className={classnames(
              "alert transition-opacity opacity-100 duration-500 ease-in-out",
              {
                "alert-error": type === "error",
                "alert-success": type === "success"
              }
            )}
            style={{
              animation: "fadeInOut 3s ease-in-out forwards"
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{content}</span>
          </div>
        )
      })}
    </div>
  )
}

const MessageWithRef = React.forwardRef<MessageRef>(Message)

const initMessage = () => {
  const messageRef = {
    current: null
  }
  let messageContainer = document.getElementById(containerId)
  if (!messageContainer) {
    messageContainer = document.createElement("div")
    messageContainer.id = containerId
    document.body.appendChild(messageContainer)
  }
  const root = createRoot(messageContainer)
  root.render(<MessageWithRef ref={messageRef} />)

  return {
    success(content, duration?) {
      const instance: MessageRef = messageRef.current
      if (!instance) return
      instance.addMessage("success", content, duration)
    },
    error(content, duration?) {
      const instance: MessageRef = messageRef.current
      if (!instance) return
      instance.addMessage("error", content, duration)
    }
  }
}

export default initMessage()
