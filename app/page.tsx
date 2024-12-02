"use client"
import { decrypt, encrypt } from "@/supabase/encrypt"
import { getDeviceID } from "@/supabase/getDeviceID"
import { getDeviceNames } from "@/supabase/getDeviceName"
import { getText } from "@/supabase/getText"
import useStoredUser from "@/supabase/useStoredUser"
import { signIn, signUp } from "@/supabase/utils"
import { supabase } from "@/supabaseClient"
import { Content } from "@/types"
import { useEffect, useState } from "react"

export default function Home() {
  const { user, isUserStored, updateUser } = useStoredUser()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(true)
  const [content, setContent] = useState<Content[]>([])
  const [copiedText, setCopiedText] = useState("")
  const [showToast, setShowToast] = useState(false)
  const [devices, setDevices] = useState([])

  // SUPABASE THINGS
  const handleAuth = async () => {
    if (isSignUp) {
      const data = await signUp(email, password, name)
      alert(`Welcome, ${data.username}`)
      updateUser(data)
    } else {
      if (!email || !password) {
        alert("Please provide both email and password.")
        return
      }
      const data = await signIn(email, password)
      console.log(data)
      alert(`Welcome back, ${data.username}`)
      updateUser(data)
    }
  }

  const handleCopy = () => {
    async function func() {
      const data = await getText()
      if (data) {
        setContent(data)
      }
    }
    if (isUserStored) {
      func()
    }
  }

  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)

      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    } catch (error) {
      console.error("Error copying text to clipboard: ", error)
    }
  }

  // REAL-TIME SUBS
  supabase.channel("text").on("postgres_changes", { event: "*", schema: "public", table: "text" }, handleCopy).subscribe()

  // STATE STUFF
  useEffect(() => {
    if (window.electron) {
      window.electron.onCopyText((text) => {
        setCopiedText(text)
      })
    }
  }, [])

  useEffect(() => {
    async function func() {
      const data = await getText()
      if (user) {
        const temp = await getDeviceNames(user?.id)

        if (data) {
          setContent(data)
          setDevices(temp)
        }
      }
    }
    func()
  }, [])

  useEffect(() => {
    async function insertText() {
      if (copiedText.length > 0 && user) {
        const encryptedText = encrypt(copiedText)

        const deviceID = await getDeviceID()
        const { error } = await supabase.from("text").insert({ user_id: user.id, device_id: deviceID, content: encryptedText })
      }
    }
    insertText()
  }, [copiedText])

  return user ? (
    <div className="flex flex-col h-screen bg-white text-black">
      <h1 className="border-b-4">Clipboard</h1>
      <div className="flex flex-row"></div>
      <div className="flex flex-row justify-between m-1 border-b-4">
        <h1>History</h1>
        <h1>Hello, {user.username}</h1>
      </div>

      <div className="flex flex-col">
        {content.length > 0 &&
          content.map((text, idx) => {
            const temp = decrypt(text.content)
            const gg = devices.find((item) => text.device_id === item.id)
            console.log(gg)

            return (
              <div key={idx} className="flex flex-col gap-2 border-b-4 p-1 hover:bg-stone-600 hover:text-white" onClick={() => copyText(temp)}>
                <div>From: {gg.name}</div>
                {temp}
              </div>
            )
          })}
      </div>
      <div
        className={`absolute bottom-4 right-4 bg-green-500 text-white text-sm font-semibold py-2 px-4 rounded shadow-md transform transition-all duration-300 ${
          showToast ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        Text Copied!
      </div>
    </div>
  ) : (
    <div className="flex flex-col h-screen justify-center items-center gap-2 bg-white text-black">
      <h1 className="mb-8">Clipboard</h1>
      {isSignUp ? <input placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} /> : null}
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleAuth}>{isSignUp ? "Sign Up" : "Sign In"}</button>

      <button
        onClick={() => {
          setIsSignUp(!isSignUp)
        }}
      >
        {isSignUp ? "Switch to Sign In" : "Switch to Sign Up"}
      </button>
    </div>
  )
}
