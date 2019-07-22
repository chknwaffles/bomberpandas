import React, { useState } from 'react';
import { Form, FormInput, FormGroup, Button } from 'shards-react';
import '../stylesheets/Form.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

export default function FormContainer(props) {
    const { login, changePage, handleLogin } = props
    const [fields, setFields] = useState({ username: '', password: '' })

    const handleChange = (e) => setFields({...fields, [e.target.className]: e.target.value })
    const handleSubmit = (e) => {
        e.preventDefault()
        handleLogin()
        setFields({ username: '', password: '' })
    }

    return (
        <div className='form-container'>
            <Form onSubmit={(e) => handleSubmit(e)}>
                <FormGroup>
                    <label htmlFor="#username">Username</label>
                    <FormInput onChange={(e) => handleChange(e)} className='username' id="#username" placeholder="Username" value={fields.username} />
                </FormGroup>
                <FormGroup>
                    <label htmlFor="#password">Password</label>
                    <FormInput onChange={(e) => handleChange(e)} className='password' id="#password" placeholder="Password" type="password" value={fields.password} />
                </FormGroup>
                <Button block theme='success'>{login ? 'Login' : 'Sign Up'}</Button>
                <Button block theme='secondary' onClick={() => changePage('')}>Back to Menu</Button>
            </Form>
        </div>
    )
}