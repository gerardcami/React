import './App.css'
import { TwitterFollowCard } from './TwitterFollowCard.jsx'
// <></> => Same as 'React.Fragment' but more clean and the import React is not needed
// const cxmidev => The component can receive an object as props
export function App() {
    const cxmidev = {
        userName: 'cxmi_ns',
    }
    return (
        <section className='App'>
            <TwitterFollowCard userName="soymajacreo" >
                Ylenia Martínez
            </TwitterFollowCard>
            <TwitterFollowCard {...cxmidev} >
                Gerard Cami
            </TwitterFollowCard>
        </section>
    )
}