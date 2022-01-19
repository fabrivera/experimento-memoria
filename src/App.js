import { useRef, useState, useEffect } from 'react'
import './App.css'
import Cookies from 'js-cookie'
import { useLocation  } from 'wouter'

import l1c2 from './assets/l1c2.mp4'
import l2c1 from './assets/l2c1.mp4'
import l2c2 from './assets/l2c2.mp4'

export default function App () {
    const [videoPlayer, setVideoPlayer] = useState(false)
    const [playBtn, setPlayBtn] = useState(true)
    const [finished, setFinished] = useState(false)
    const [handleFinish, setHandleFinish] = useState(false)
    const [SRC,setSRC] = useState('')

    const [location] = useLocation()
    const video = useRef()

    useEffect(() => {
        if (location === '/l1c2') setSRC(l1c2)
        if (location === '/l2c1') setSRC(l2c1)
        if (location === '/l2c2') setSRC(l2c2)
    }, [location])

    const handlePlay = () => {
        const cookieTime = Cookies.get(`__eyJzYW5qdWFuacOxbyI6IjEyM${location}`)
        if (cookieTime) video.current.currentTime = cookieTime
        if (playBtn) video.current.play()
        setPlayBtn(false)
    }

    const handleTime = () => {
        if (video.current.currentTime === video.current.duration) {
            setFinished(true)
            setHandleFinish(true)
            setVideoPlayer(false)
            Cookies.set(location, true)
        }
        Cookies.set(`__eyJzYW5qdWFuacOxbyI6IjEyM${location}`, video.current.currentTime, { SameSite: 'Lax'})
    }

    const handleVideo = () => {
        const viewed = Cookies.get(location)
        if (!viewed) {
            setVideoPlayer(true)
        } else {
            setFinished(true)
        }
    }

    return <div className='App-header'>
        {   !videoPlayer
                && <div className='text-msg'>
                    <h4>{handleFinish ?'Gracias por su tiempo' :'ATENCIÓN'}</h4>
                    { finished
                        ? <>{ handleFinish
                            ? <p>Nos contactaremos para registrar los objetos recordados</p>
                            : <p>El video ya fué reproducido anteriormente</p>

                        }</>
                        : <>
                            <p>El siguiente video podrá visualizarse por unica vez luego de iniciar la reproducción y no podrá pausarse</p>
                            <button onClick={handleVideo}>Continuar</button>
                        </>
                    }
                </div>
        }
        {   videoPlayer
                && <video 
                    className='video'
                    src={SRC} 
                    controls={false}
                    webkit-playsinline="true"
                    playsinline="true"
                    ref={video}
                    onTimeUpdate={handleTime}/>
        }
        {
            playBtn && videoPlayer
                && <button className='player' onClick={handlePlay}/>
        }
    </div>
}
