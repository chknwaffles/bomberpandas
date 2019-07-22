import React, { useState } from 'react'
import { Form, FormInput, Container } from 'shards-react';
import '../stylesheets/Chat.css';

export default function Chat(props) {
    const { socket, user } = props
    const [log, setLog] = useState(['test'])
    const [message, setMessage] = useState({ username: user, body: '' })

    const handleSubmit = (e) => {
        e.preventDefault()
        //send to backend

    }
    
    const handleChange = (e) => {
        setMessage({...message, body: e.target.value})
    }

    const loggedIn = () => {
        if (user !== '') {
            return (
                <React.Fragment>
                    {log.map(message => `${message.username}: ${message.body}`)}
                    <Form>
                        <FormInput onChange={(e) => handleChange(e)} value={message.body} placeholder="..." />
                    </Form>
                </React.Fragment>
            )
        } else {
            return <h5>Must login to access chat!</h5>
        }
    }

    return (
        <div className='chat-container'>
            <Container>
                {loggedIn()}
            </Container>
        </div>
    )
}