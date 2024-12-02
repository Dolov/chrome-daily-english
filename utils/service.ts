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
    headers
  }

  if (method === "GET" && data) {
    url += `?${new URLSearchParams(data).toString()}`
  }
  if (method === "POST" && data) {
    options.body = JSON.stringify(data)
  }

  const response = await fetch(`${baseUrl}${url}`, options)
  return response.json()
}

const tryRequest = async (...args) => {
  try {
    const [url, method, data] = args
    return await request(url, method, data)
  } catch (error) {
    console.error("API Request failed:", error)
    return null
  }
}

// 封装 GET 请求
const GET = (url: string, data: any) => tryRequest(url, "GET", data)

// 封装 POST 请求
const POST = (url: string, data: any) => tryRequest(url, "POST", data)

// API 请求封装
export const sendotp = (data: any) => POST("/api/user/sendotp", data)
export const verifyotp = (data: any) => POST("/api/user/verifyotp", data)
export const signup = (data: any) => POST("/api/user/signup", data)
export const signin = (data: any) => POST("/api/user/signin", data)
export const addFavorite = (data: any) => POST(`/api/favorite/add`, data)
export const getFavoriteList = (data?: any) => GET(`/api/favorite/list`, data)
export const translate = (data?: any) => GET(`/api/translate`, data)
