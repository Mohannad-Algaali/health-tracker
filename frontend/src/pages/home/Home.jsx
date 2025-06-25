
import {useState} from 'react'
import './Home.css'
import waterIcon from '../../assets/water-drop-svgrepo-com.svg'
import SleepIcon from '../../assets/sleep-svgrepo-com.svg'
export default function Home(){

    const [waterAmount , setWaterAmount] = useState(1000)
    const [sleepAmount, setSleepAmount] = useState(480)
    const waterAdjustments = [-1000,-500,-200,-100, 100, 200,500 ,1000]
    const sleepAdjustments = [-60,-30,-10,-5, 5,10,30 ,60]
    const waterRange = {min:0, max:10000}
    const sleepRange = {min:0, max:1440}
    const fixChange = (old, adjustment,range)=>{
        if(old + adjustment<range.min) {
            return range.min
        }
        if(old+ adjustment>range.max){
            return range.max
        }
        return old+ adjustment
    }
    return <>
        <h1>Health Tracker</h1>
        <div>
            <div className="container">
                <header>
                    <h2 className="blue-acc-text">Water</h2>
                    <img src={waterIcon} alt="water drop icon" className='icon' />
                </header>
                <h3 className="amount-holder">{waterAmount/1000} L</h3>
                  <div>

                  {waterAdjustments.map((adj) => (
                    <button 
                        key={adj}
                        className={(waterAmount<=waterRange.min&&adj <0)|| (adj>0&& waterAmount>=waterRange.max)? "disabled":""}
                        onClick={() => setWaterAmount(w => fixChange(w,adj,waterRange))} // Fixed event name
                    >
                        {adj > 0 ? `+${adj}` : adj}
                    </button>
                ))}
                  </div>
                  
            </div>
            <div className="container">
                 <header>
                    <h2 className="purple-acc-text">Sleep</h2>
                    <img src={SleepIcon} alt="sleep icon" className='icon' />
                </header>
                <h3 className="amount-holder">{Math.floor(sleepAmount/60)} Hours and {sleepAmount%60} Minutes</h3>
                  <div>

                  {sleepAdjustments.map((adj) => (
                    <button 
                        key={adj}
                        className={(sleepAmount<=sleepRange.min&&adj <0)|| (adj>0&& sleepAmount>=sleepRange.max)? "disabled":""}
                        onClick={() => setSleepAmount(s => fixChange(s,adj,sleepRange))} // Fixed event name
                    >
                        {adj > 0 ? `+${adj}m` : adj+'m'}
                    </button>
                ))}
                  </div>
            </div>
        </div>
    </>
}