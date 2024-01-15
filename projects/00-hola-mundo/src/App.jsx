import './App.css'
import { TwitterFollowCard } from './TwitterFollowCard.jsx'
// <></> => Same as 'React.Fragment' but more clean and the import React is not needed
// const cxmidev => The component can receive an object as props
// It is not recommended to write comments inside a return
export function App() {
  const users = [
    {
      userName: 'soymajacreo',
      name: 'Ylenia Martinez',
      initialIsFollowing: true
    },
    {
      userName: 'cxmi_ns',
      name: 'Gerard Cami',
      initialIsFollowing: false
    }
  ]
  return (
    <section className='App'>
      {
        users.map(user => {
          const { userName, name, initialIsFollowing } = user
          return (
            <TwitterFollowCard
              key={userName}
              userName={userName}
              initialIsFollowing={initialIsFollowing}
            >
              {name}
            </TwitterFollowCard>
          )
        })
      }
    </section>
  )
}