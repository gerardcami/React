import './App.css'
import { TwitterFollowCard } from './TwitterFollowCard.jsx'
// <></> => Same as 'React.Fragment' but more clean and the import React is not needed
export function App() {
    const formatUserName = (userName) => `@${userName}`
    return (
        <section className='App'>
            <TwitterFollowCard 
            formatUserName={formatUserName} 
            isFollowing 
            userName="soymajacreo" 
            name="Ylenia Martínez" />
            <TwitterFollowCard 
            formatUserName={formatUserName} 
            isFollowing userName="cxmi_ns" 
            name="Gerard Cami" />
            <TwitterFollowCard 
            formatUserName={formatUserName} 
            isFollowing userName="midudev" 
            name="Miguel Ángel Durán" />
        </section>
    )
}