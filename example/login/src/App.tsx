import { createAuthClient } from 'better-auth/client'
import { anonymousClient } from "better-auth/client/plugins"

const authClient = createAuthClient({
  plugins: [
    anonymousClient()
  ],
  baseURL: 'http://localhost:3001', // Replace with your auth server URL
  basePath: '/api/v1/auth',
})

function App() {
  const handleOAuthLogin = async (provider: string) => {
    try {
      const result = await authClient.signIn.social({
        provider: provider,
      })
      console.log('Login successful:', result)
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const handleAnonymousLogin = async () => {
    try {
      const result = await authClient.signIn.anonymous()
      console.log('Login successful:', result)
    } catch (error) {
      console.error('Login failed:', error)
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
      {/* Add more providers as needed */}
    </div>
  )
}

export default App
