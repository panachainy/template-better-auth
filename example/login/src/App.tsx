import { createAuthClient } from 'better-auth/client'

const authClient = createAuthClient({
  baseURL: 'http://localhost:3000', // Replace with your auth server URL
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

  return (
    <div>
      <h1>OAuth Login Example</h1>
      <button type="button" onClick={() => handleOAuthLogin('google')}>
        Login with Google
      </button>
      <button type="button" onClick={() => handleOAuthLogin('github')}>
        Login with GitHub
      </button>
      {/* Add more providers as needed */}
    </div>
  )
}

export default App
