import { createAuthClient } from 'better-auth/client'

const authClient = createAuthClient({
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

  return (
    <div>
      <h1>OAuth Login Example</h1>
      <button type="button" onClick={() => handleOAuthLogin('google')}>
        Login with Google
      </button>
      <button type="button" onClick={() => handleOAuthLogin('github')}>
        Login with GitHub
      </button>
      <button type="button" onClick={() => handleOAuthLogin('line')}>
        Login with LINE
      </button>
      {/* Add more providers as needed */}
    </div>
  )
}

export default App
