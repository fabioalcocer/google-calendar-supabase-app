import './App.css'
import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from '@supabase/auth-helpers-react'

function App() {
  const session = useSession()
  const supabase = useSupabaseClient()
  const { isLoading } = useSessionContext()

  if (isLoading) {
    return <h2>Loading...</h2>
  }

  const googleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/calendar',
      },
    })

    if (error) {
      alert('Error signing in google')
      console.log(error)
    }
  }

  const googleSignOut = async () => {
    await supabase.auth.signOut()
  }

  console.log(session)

  return (
    <div className='App'>
      <h1>Google Calendar + Supabase</h1>
      <div>
        {session ? (
          <>
            <h2>Hey there {session.user.email}</h2>
            <button onClick={() => googleSignOut()}>Sign out</button>
          </>
        ) : (
          <button onClick={() => googleSignIn()}>
            Sign In with Google
          </button>
        )}
      </div>
    </div>
  )
}

export default App
