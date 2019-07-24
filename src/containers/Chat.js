import React, { useState, useEffect } from 'react'
import { Card, Form, Icon, Input } from 'antd'
import '../stylesheets/Chat.css'
import 'antd/dist/antd.css'

export default function Chat(props) {
    const { socket, user } = props
    const [log, setLog] = useState([])
    const [message, setMessage] = useState({ username: user, body: '' })

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3002')

    }, [])

    useEffect(() => {
        console.log(socket)
        socket.onmessage = (e) => {
            // setlog here after grabbing data
            let newMessage = JSON.parse(e.data)
            console.log(newMessage)
        }
    }, [log])

    const handleSubmit = (e) => {
        e.preventDefault()
        //send to backend
        socket.send(JSON.stringify({...message, type: 'message' }))
        setMessage({...message, body: '' })
        setLog([...log, message])
    }
    
    const handleChange = (e) => setMessage({...message, body: e.target.value})

    return (
        <div className='chat-container'>
            <Card>
                <React.Fragment>
                        {log.map(message => `${message.username}: ${message.body}`)}
                        <Form onSubmit={(e) => handleSubmit(e)} >
                            <Input onChange={(e) => handleChange(e)} value={message.body} placeholder='Talk shit here' />
                        </Form>
                </React.Fragment>
            </Card>
        </div>
    )
}