import React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import Button from "~/components/button"
import Form from "~/components/form"
import FormItem from "~/components/form-item"
import { signin, signup } from "~/utils/service"
import message from "~components/message"
import { Storage } from "~utils/constant"

import "~/style.less"

const collectUrl = "tabs/collect.html"

const Login = () => {
  const [loginView, setLoginView] = React.useState(true)
  const [userInfo, setUserInfo] = React.useState({
    username: "",
    email: "",
    password: ""
  })

  const onChange = (changeValue) => {
    setUserInfo({
      ...userInfo,
      ...changeValue
    })
  }
  return (
    <div className="h-full flex justify-center mt-[20vh]">
      <div className="w-[400px]">
        {loginView ? (
          <Signin
            userInfo={userInfo}
            onChange={onChange}
            toggleView={() => setLoginView(false)}
          />
        ) : (
          <Signup
            userInfo={userInfo}
            onChange={onChange}
            toggleView={() => setLoginView(true)}
          />
        )}
      </div>
    </div>
  )
}

const Signup = (props) => {
  const { userInfo, onChange, toggleView } = props
  const [user, setUser] = useStorage(Storage.USER)

  const [loading, setLoading] = React.useState(false)

  const handleSignup = async () => {
    const { username, email, password } = userInfo

    if (!username || !email || !password) {
      return
    }

    setLoading(true)
    const res = await signup(userInfo).finally(() => setLoading(false))
    if (res.success) {
      setUser(res.data)
      chrome.tabs.update({
        url: chrome.runtime.getURL(collectUrl)
      })
      return
    }
    message.error(res.message)
  }

  return (
    <Form initialValues={userInfo} onChange={onChange}>
      <FormItem
        name="username"
        label="Name"
        rules={[
          { required: true, message: "name is required" },
          { min: 3, message: "name must be at least 3 characters" },
          { max: 50, message: "name must be at most 50 characters" }
        ]}>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="name"
        />
      </FormItem>
      <FormItem
        name="email"
        label="Email"
        rules={[
          { required: true, message: "email is required" },
          {
            type: "email",
            message: "email is invalid"
          }
        ]}>
        <input
          type="text"
          placeholder="email"
          className="input input-bordered w-full"
        />
      </FormItem>
      <FormItem
        name="password"
        label="Password"
        rules={[
          { required: true, message: "password is required" },
          {
            pattern: /^[^\u4e00-\u9fa5]+$/,
            message: "password cannot contain Chinese characters"
          },
          { min: 6, message: "password must be at least 6 characters" },
          { max: 20, message: "password must be at most 20 characters" }
        ]}>
        <input
          type="password"
          className="input input-bordered w-full"
          placeholder="password"
        />
      </FormItem>
      <Button
        loading={loading}
        onClick={handleSignup}
        className="w-full btn mt-4 btn-neutral">
        Sign Up
      </Button>

      <div className="flex justify-end">
        <button
          onClick={toggleView}
          className="btn btn-link btn-neutral px-0 text-neutral">
          Login to exsiting account
        </button>
      </div>
    </Form>
  )
}

const Signin = (props) => {
  const [user, setUser] = useStorage(Storage.USER)
  const [loading, setLoading] = React.useState(false)
  const { userInfo, onChange, toggleView } = props

  const handleLogin = async () => {
    const { email, password } = userInfo

    if (!email || !password) {
      return
    }

    setLoading(true)
    const res = await signin(userInfo).finally(() => setLoading(false))
    if (res.success) {
      setUser(res.data)
      chrome.tabs.update({
        url: chrome.runtime.getURL(collectUrl)
      })
      return
    }
    message.error(res.message)
  }

  return (
    <Form initialValues={userInfo} onChange={onChange}>
      <FormItem
        name="email"
        label="Email"
        rules={[
          { required: true, message: "email is required" },
          {
            type: "email",
            message: "email is invalid"
          }
        ]}>
        <input
          type="text"
          placeholder="email"
          className="input input-bordered w-full"
        />
      </FormItem>

      <FormItem
        name="password"
        label="Password"
        rules={[
          { required: true, message: "password is required" },
          {
            pattern: /^[^\u4e00-\u9fa5]+$/,
            message: "password cannot contain Chinese characters"
          },
          { min: 6, message: "password must be at least 6 characters" },
          { max: 20, message: "password must be at most 20 characters" }
        ]}>
        <input
          type="password"
          className="input input-bordered w-full"
          placeholder="password"
        />
      </FormItem>
      <div className="flex justify-end">
        <button className="btn btn-link btn-neutral px-0 text-neutral">
          Forgot password?
        </button>
      </div>
      <Button
        loading={loading}
        onClick={handleLogin}
        className="w-full btn mt-2 btn-neutral">
        Login
      </Button>
      <div className="flex justify-end">
        <button
          onClick={toggleView}
          className="btn btn-link btn-neutral px-0 text-neutral">
          Create new account
        </button>
      </div>
    </Form>
  )
}

export default Login
