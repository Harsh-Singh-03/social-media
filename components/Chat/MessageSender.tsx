"use client"

import { sendMessage } from "@/server/actions/message.actions";
import Image from "next/image";
import { useEffect, useRef, useState } from "react"
import { useChatHook } from "@/Context/ChatContext";
import { useToast } from "../ui/use-toast";
import { useUploadThing } from "@/server/uploadthing";

interface props {
  userId: string;
  chatUser: string
}
const MessageSender = ({ userId, chatUser }: props) => {
  const [count, setCount] = useState(0)
  const [Message, setmessage] = useState("")
  const { setMessage }: any = useChatHook()
  const { startUpload } = useUploadThing("media")
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const { toast } = useToast()
  const mediaRecorder: any = useRef(null)

  useEffect(() => {
    let intervalId: any;

    if (recordingStatus === 'active') {
      intervalId = setInterval(() => {
        setCount((prevCount: number) => prevCount + 1);
      }, 1000);
    } else {
      clearInterval(intervalId);
      setCount(0)
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [recordingStatus, count]);

  const toggleFile = async (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      e.target.disabled = true
      const file = e.target.files[0]
      var filesize = ((file.size / 1024) / 1024).toFixed(4)
      if (parseFloat(filesize) < 2) {
        // setFiles(Array.from(e.target.files))
        let fileArr: any = Array.from(e.target.files)
        const reader: any = new FileReader();
        reader.onload = () => {
          setMessage((prev: any) => [{ _id: 'new-message', sender: userId, content: reader.result, messageStatus: 'initial', contentType: 'Image', receiver: '' }, ...prev])
        };
        reader.readAsDataURL(file);
        if (fileArr && fileArr.length > 0) {
          const data = await startUpload(fileArr)
          if (data && data[0].fileUrl) {
            const result = await sendMessage(userId, chatUser, data[0].fileUrl, 'Image')
            if (result?.success) {
              setmessage('')
              e.target.value = ""
              e.target.disabled = false
            }
          }
        }
      } else {
        e.target.value = ""
        e.target.disabled = false
        toast({ title: "Image is too big only supports below 2mb" })
      }

    }
  }

  const sendChat = async (e: any) => {
    e.preventDefault()
    if (Message && Message.length > 0) {
      setMessage((prev: any) => [{ _id: 'new-message', sender: userId, content: Message, messageStatus: 'initial', contentType: 'Text', receiver: '' }, ...prev])
      const data = await sendMessage(userId, chatUser, Message, 'Text')
      if (data?.success) {
        setmessage('')
      }
    }
  }
  const fileOpen = () => {
    document.getElementById("fileOpen")?.click()
  }
  const startRecording = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData: any = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setRecordingStatus("active")
        const mimeType = "audio/mp3";

        //create new Media recorder instance using the stream
        const media = new MediaRecorder(streamData, { type: mimeType });
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks: any = [];
        mediaRecorder.current.ondataavailable = (event: any) => {
          if (typeof event.data === "undefined") return;
          if (event.data.size === 0) return;
          localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);

      } catch (err: any) {
        alert(err.message);
      }
    } else {
      toast({ title: "The MediaRecorder API is not supported in your browser." })
    }
  }

  const sendRecording = () => {
    setRecordingStatus('inactive')
    const mimeType = "audio/mp3";
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = async () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file. 
      const audioUrl: any = URL.createObjectURL(audioBlob);
      // Create a mp3 while that we upload on uploadthing
      const audioFile = new File([audioBlob], 'recording.mp3', { type: mimeType })
      // setting up message in user frontend to better ux
      setMessage((prev: any) => [{ _id: 'new-message', sender: userId, content: audioUrl, messageStatus: 'initial', contentType: 'Audio', receiver: '' }, ...prev])
      // Creating file arr for upload
      let audioFileArr = [audioFile]
      if (audioFileArr && audioFileArr.length > 0) {
        const data = await startUpload(audioFileArr)
        if (data && data[0].fileUrl) {
          const result = await sendMessage(userId, chatUser, data[0].fileUrl, 'Audio')
          if (result?.success) {
            setmessage('')
          }
        }
      }
    }
    setAudioChunks([]);
  };

  const deleteRecording = () =>{
    setRecordingStatus('inactive')
    setAudioChunks([]);
    setmessage('')
    setCount(0)
  }
  

  return (
    <div className="px-3 pb-3 lg:p-4 lg:bg-dark-2">
      {recordingStatus === 'inactive' ? (
        <div className="flex items-center gap-1 bg-dark-3 rounded-full px-3 lg:px-4">
          <input type="text" value={Message} className="input w-full bg-transparent py-6 text-small-regular outline-none" onChange={(e: any) => setmessage(e.target.value)} placeholder="Type a message..." required />
          <div className="relative flex gap-4">
            {Message ? (
              <button className="bg-none outline-none bottom-0 mt-0" onClick={sendChat}><Image src="/assets/send.svg" alt="send" width={28} height={28} className="object-contain" /></button>
            ) : (
              <>
                <button className="bg-none outline-none bottom-0 mt-0" onClick={fileOpen} ><Image src="/assets/create.svg" alt="send" width={24} height={24} className="object-contain" /></button>
                <button className="bg-none outline-none bottom-0 mt-0" onClick={startRecording}><Image src="/assets/mic.svg" alt="send" width={24} height={24} className="object-contain" /></button>
                <input type="file" className="hidden" accept='image/*' id="fileOpen" onChange={toggleFile} />
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-1 bg-dark-3 border-2 border-primary-500 border-dashed rounded-full px-3 py-2 lg:px-4 lg:py-2.5 ">
          <Image src='/assets/delete.svg' alt="delete" width={24} height={24} className="object-contain cursor-pointer" onClick={deleteRecording} />
          <div className="">
            <span className="text-logout-btn text-small-regular lg:text-base-regular fade-in-animation">{count}s recording...</span>
          </div>
          <Image src='/assets/send.svg' alt="send" width={24} height={24} className="object-contain cursor-pointer" onClick={sendRecording} />
        </div>
      )}
    </div>
  )
}

export default MessageSender
