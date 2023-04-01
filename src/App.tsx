import {
  useSession,
  useSupabaseClient,
  useSessionContext,
} from '@supabase/auth-helpers-react'
import { useState } from 'react'
import DateTimePicker from 'react-datetime-picker'
import GoogleBtn from './components/GoogleBtn'
import CreateEventBtn from './components/CreateEventBtn'
import Loader from './components/Loader'

function App() {
  const [start, setStart] = useState(new Date())
  const [end, setEnd] = useState(new Date())
  const [eventName, setEventName] = useState('')
  const [eventDescription, setEventDescription] = useState('')

  const session = useSession()
  const supabase = useSupabaseClient()
  const { isLoading } = useSessionContext()

  if (isLoading) {
    return <Loader />
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

  const createCalendarEvent = async () => {
    const event = {
      summary: eventName,
      description: eventDescription,
      start: {
        dateTime: start.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      end: {
        dateTime: end.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    }

    const res = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.provider_token}`,
        },
        body: JSON.stringify(event),
      }
    )
      .then((data) => {
        return data.json()
      })
      .then((data) => console.log(data))

    return res
  }

  console.log(session)

  return (
    <div className='App min-h-screen bg-zinc-900 grid place-content-center gap-5 text-zinc-50'>
      <h1 className='font-extrabold'>Google Calendar + Supabase</h1>
      <div>
        <p>Start of your event</p>
        <DateTimePicker onChange={setStart} value={start} />
        <label>Event name</label>
        <input
          value={eventName}
          type='text'
          onChange={(e) => setEventName(e.target.value)}
          className='text-zinc-900'
        />
      </div>
      <div>
        <p>End of your event</p>
        <DateTimePicker onChange={setEnd} value={end} />
        <label>Event description</label>
        <input
          value={eventDescription}
          type='text'
          onChange={(e) => setEventDescription(e.target.value)}
          className='text-zinc-900'
        />
      </div>
      <CreateEventBtn onClick={() => createCalendarEvent()} />
      <div>
        {session ? (
          <>
            <h2>Hey there {session.user.email}</h2>
            <GoogleBtn
              onClick={() => googleSignOut()}
              textBtn='Sign Out'
            />
          </>
        ) : (
          <GoogleBtn
            onClick={() => googleSignIn()}
            textBtn='Continue with Google'
          />
        )}
      </div>
    </div>
  )
}

export default App
