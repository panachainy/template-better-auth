import { createAuthClient } from 'better-auth/client'
import { anonymousClient } from "better-auth/client/plugins"
import { useState, useEffect } from 'react'

const authClient = createAuthClient({
  plugins: [
    anonymousClient()
  ],
  baseURL: 'http://localhost:3001', // Replace with your auth server URL
  basePath: '/api/v1/auth',
})

function App() {
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession()
      setSession(data)
    }
    fetchSession()
  }, [])

  const handleOAuthLogin = async (provider: string) => {
    try {
      const result = await authClient.signIn.social({
        provider: provider,
      })
      console.log('Login successful:', result)
      // Refetch session after login
      const { data } = await authClient.getSession()
      setSession(data)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleAnonymousLogin = async () => {
    try {
      const result = await authClient.signIn.anonymous()
      console.log('Login successful:', result)
      // Refetch session after login
      const { data } = await authClient.getSession()
      setSession(data)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await authClient.signOut()
      setSession(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }


  return (
    <div>
      <h1>OAuth Login Example</h1>
      <button type="button" onClick={() => handleOAuthLogin('line')}>
        Login with LINE
      </button>

      <h1>Other Login Example</h1>

      <button type="button" onClick={() => handleAnonymousLogin()}>
        Login with Anonymous
      </button>

      {session && (
        <div>
          <h2>User Info</h2>
          <p>User ID: {session.user.id}</p>
          <p>Name: {session.user.name}</p>
          <p>Email: {session.user.email}</p>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
      {/* Add more providers as needed */}
    </div>
  )
}

export default App
