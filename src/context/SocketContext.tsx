import React, { createContext, useState, useRef, useEffect } from 'react'
import { io } from 'socket.io-client';
import Peer from 'simple-peer'


interface ISocketContext {
    call: ICall | undefined,
    callAccepted: boolean,
    userStream: MediaStream | undefined,
    userVideo: React.MutableRefObject<HTMLVideoElement | null>,
    stream: MediaStream | undefined,
    name: string,
    setName: React.Dispatch<React.SetStateAction<string>>,
    callEnded: boolean,
    me: string | undefined,
    callUser: (id: string) => void,
    leaveCall: () => void,
    answerCall: () => void,
}

const SocketContext = createContext({} as ISocketContext);

const socket = io('https://vc-server-dk5761.onrender.com');

interface IContextProvider {
    children: React.ReactNode
}

interface ICall {
    from: string,
    isReceivingCall: boolean,
    name: string,
    signal: Peer.SignalData
}

const ContextProvider = ({
    children
}: IContextProvider) => {

    const [stream, setStream] = useState<MediaStream>()
    const [userStream, setUserStream] = useState<MediaStream>()
    const [me, setMe] = useState<string>("")
    const [call, setCall] = useState<ICall>()
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState<string>("");




    const userVideo = useRef<HTMLVideoElement | null>(null);
    const connectionRef = useRef();


    useEffect(() => {
        // get the user media device access.
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((currentStream) => {
            setStream(currentStream);

        })

        socket.on('me', (id) => setMe(id));
        socket.on('callUser', ({ from, name: callerName, signal }) => {
            setCall({
                isReceivingCall: true,
                from,
                name: callerName,
                signal
            })
        })
    }, [])


    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false, trickle: false, stream
        });

        peer.on('signal', (data) => {
            socket.emit('answerCall', {
                signal: data,
                to: call?.from
            })
        });

        peer.on('stream', (currentStream) => {
            setUserStream(currentStream)
        });

        if (call) {
            peer.signal(call.signal)
        };

        // @ts-ignore 
        connectionRef.current = peer

    }

    const callUser = (id: string) => {
        const peer = new Peer({
            initiator: true, trickle: false, stream
        });

        peer.on('signal', (data) => {
            socket.emit('callUser', {
                userToCall: id,
                signalData: data,
                from: me,
                name: name
            })
        });

        peer.on('stream', (currentStream) => {

            setUserStream(currentStream)

        });

        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);

            peer.signal(signal);
        })
        // @ts-ignore 
        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true);
        // @ts-ignore 
        connectionRef.current!.destroy();
        setUserStream(undefined)
        window.location.reload()
    }




    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            userStream,
            userVideo,
            stream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answerCall,
        }}>
            {
                children
            }
        </SocketContext.Provider>
    )
}

export {
    ContextProvider, SocketContext
}