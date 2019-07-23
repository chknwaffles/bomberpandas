import React, { useState } from 'react'
import { Form, Icon, Input, Button } from 'antd'
import '../stylesheets/Form.css'
import 'antd/dist/antd.css'

export default function FormContainer(props) {
    const { login, changePage, handleForm } = props
    const [fields, setFields] = useState({ username: '', password: '' })

    const handleChange = (e) => {
        setFields({...fields, [e.target.id]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        handleForm(fields)
        setFields({ username: '', password: '' })
    }

    const checkSignUp = () => {
        if (!login) {
            return (
                <Form.Item>
                    <Input
                        prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type='password'
                        placeholder='Password'
                    />
                </Form.Item>
            )
        }
    }
    return (
        <div className='form-container'>
            <Form onSubmit={handleSubmit} className='login-form'>
                <Form.Item>
                    <Input
                        prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />} 
                        placeholder='Username'
                        id='username'
                        value={fields.username}
                        onChange={(e) => handleChange(e)}
                    />
                </Form.Item>
                <Form.Item>
                    <Input
                        prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type='password'
                        id='password'
                        placeholder='Password'
                        value={fields.password}
                        onChange={(e) => handleChange(e)}
                    />
                </Form.Item>
                {checkSignUp()}
                <Button block type='primary' htmlType="submit" className="login-form-button">{login ? 'Login' : 'Sign Up'}</Button>
                <Button block onClick={() => changePage('')}>Back to Menu</Button>
            </Form>
        </div>
    )
}