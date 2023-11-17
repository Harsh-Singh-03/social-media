"use client"
import Image from 'next/image';
import { useRef, useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
interface props {
  audioUrl: string
}
const AudioPlayer = ({ audioUrl }: props) => {
  const wavesurferRef: any = useRef(null);
  const [wave, setWave] = useState(null)
  const [totalDuration, setTotalDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPause, setIsPuase] = useState(false);

  let waveAudio: any;
  useEffect(() => {
    if (audioUrl && wavesurferRef.current) {
      waveAudio = WaveSurfer.create({
        container: wavesurferRef.current,
        progressColor: '#877EFF',
        barWidth: 2.5,
        barGap: 1,
        barRadius: 50,
        height: 35,
        width: 150,
        waveColor: '#697C89'
      });

      waveAudio.load(audioUrl);
      setWave(waveAudio)

      waveAudio.on('finish', () => {
        waveAudio.seekTo(0); // Reset playback to the beginning
        setIsPlaying(false)
        setIsPuase(false)
      });

      waveAudio.on('ready', () => {
        setTotalDuration(waveAudio.getDuration());
      });

      waveAudio.on('audioprocess', () => {
        setCurrentTime(waveAudio.getCurrentTime());
      });

      return () => {
        waveAudio.destroy();
      };
    }
  }, []);

  const play = () => {
    wave.play()
    setIsPlaying(true)
  }
  const pause = () => {
    wave.pause()
    setIsPlaying(false)
    setIsPuase(true)
  }

  return (
    <div className=" w-full flex items-center gap-2 py-1 pl-2 audio-mesg">
      {isPlaying === true ? (
        <button onClick={pause} className='cursor-pointer'><Image src='/assets/pause.svg' alt='pause' width={24} height={24} className='cursor-pointer object-contain' /></button>
      ): (
        <button onClick={play} className='cursor-pointer'><Image src='/assets/play.svg' alt='play' width={24} height={24} className='cursor-pointer object-contain' /></button>
      )}
      
      <div ref={wavesurferRef} className=' w-full'></div>
      <div><span className='text-gray-1 text-subtle-medium'>{isPlaying === true || isPause === true ? `${Math.round(currentTime)}s` : `${Math.round(totalDuration)}s`}</span></div>
    </div>
  )
};

export default AudioPlayer;
