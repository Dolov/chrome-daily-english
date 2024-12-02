import { Storage } from "@plasmohq/storage"

import { Storage as StorageKeyEnum } from "./constant"

const storage = new Storage()

// 获取 token
const getToken = () =>
  storage.get(StorageKeyEnum.USER).then((res: any) => res?.token)

// 基础 URL
const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://daily-english.freeless.com"
    : "http://localhost:3000"

// 通用的请求函数
const request = async (url: string, method: string, data?: any) => {
  const token = await getToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  }

  const options: RequestInit = {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined
  }

  const response = await fetch(`${baseUrl}${url}`, options)
  return response.json()
}

// 封装 GET 请求
const GET = (url: string) => request(url, "GET")

// 封装 POST 请求
const POST = (url: string, data: any) => request(url, "POST", data)

// API 请求封装
export const sendotp = (data: any) => POST("/api/user/sendotp", data)
export const verifyotp = (data: any) => POST("/api/user/verifyotp", data)
export const signup = (data: any) => POST("/api/user/signup", data)
export const signin = (data: any) => POST("/api/user/signin", data)
