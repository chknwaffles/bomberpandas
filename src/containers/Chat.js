import React, { useState, useEffect } from 'react'
import { Form, FormInput, Container } from 'shards-react';
import '../stylesheets/Chat.css';

export default function Chat(props) {
    const { socket, user } = props
    const [log, setLog] = useState([])
    const [message, setMessage] = useState({ username: user, body: '' })

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
            <Container>
                <React.Fragment>
                        {log.map(message => `${message.username}: ${message.body}`)}
                        <Form onSubmit={(e) => handleSubmit(e)} >
                            <FormInput onChange={(e) => handleChange(e)} value={message.body} placeholder='Talk shit here' />
                        </Form>
                </React.Fragment>
            </Container>
        </div>
    )
}