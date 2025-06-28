import {useState, useEffect, useRef} from 'react'
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

    const [waterData, setWaterData]=useState([])
    const [sleepData, setSleepData]=useState([])
    
    // Refs to track if initial data has been loaded
    const initialLoadComplete = useRef(false)
    const waterInitialized = useRef(false)
    const sleepInitialized = useRef(false)

    const fixChange = (old, adjustment,range)=>{
        if(old + adjustment<range.min) {
            return range.min
        }
        if(old+ adjustment>range.max){
            return range.max
        }
        return old+ adjustment
    }

    // Load initial data
    useEffect(()=>{
        fetch('http://localhost:5000/api/today')
        .then(response=> response.json())
        .then(data=>{
            console.log("Today's data: ",data)
            
            if(data.water !== null){
                setWaterAmount(data.water)
                waterInitialized.current = true
            } else {
                // No data for today, use default and mark as initialized
                waterInitialized.current = true
            }
            
            if(data.sleep !== null){
                setSleepAmount(data.sleep)
                sleepInitialized.current = true
            } else {
                // No data for today, use default and mark as initialized
                sleepInitialized.current = true
            }
            
            initialLoadComplete.current = true
        })
        .catch(error=>{
            console.log("cant import sleep & water: " + error)
            // On error, mark as initialized to allow normal operation
            waterInitialized.current = true
            sleepInitialized.current = true
            initialLoadComplete.current = true
        })
    },[])

    // Only update water amount after initial load is complete
    useEffect(()=>{
        if (waterInitialized.current) {
            updateWaterAmount(waterAmount)
        }
    },[waterAmount])

    // Only update sleep amount after initial load is complete
    useEffect(()=>{
        if (sleepInitialized.current) {
            updateSleepAmount(sleepAmount)
        }
    },[sleepAmount])

    const updateWaterAmount = async (amount) => {
        try {
            const response = await fetch('http://localhost:5000/api/water', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    waterAmount: amount,
                    date: new Date().toISOString().split('T')[0]
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update water amount');
            }

            const result = await response.json();
            console.log('Water amount updated:', result);
        } catch (error) {
            console.error('Error updating water amount:', error);
        }
    };

    const updateSleepAmount = async (amount) => {
        try {
            const response = await fetch('http://localhost:5000/api/sleep', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sleepAmount: amount,
                    date: new Date().toISOString().split('T')[0]
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update sleep amount');
            }

            const result = await response.json();
            console.log('Sleep amount updated:', result);
        } catch (error) {
            console.error('Error updating sleep amount:', error);
        }
    };

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
                            onClick={() => setWaterAmount(w => fixChange(w,adj,waterRange))}
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
                            onClick={() => setSleepAmount(s => fixChange(s,adj,sleepRange))}
                        >
                            {adj > 0 ? `+${adj}m` : adj+'m'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </>
}