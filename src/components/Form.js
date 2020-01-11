import React, { useState } from 'react'
import '../stylesheets/Form.css'

export default function FormContainer(props) {
    const { login, changePage, handleForm } = props
    const [fields, setFields] = useState({ username: '', password: '' })

    const handleChange = (e) => {
        setFields({...fields, [e.target.id]: e.target.value })
        console.log(fields)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        handleForm(fields, login)
        setFields({ username: '', password: '' })
    }
    
    return (
        <div className='form-container'>
            <form onSubmit={handleSubmit} >
                <label className='username-label'>Username:</label>
                <input type='text' id='username' value={fields.username} onChange={(e) => handleChange(e)} />

                <label className='password-label'>Password:</label>
                <input type='text' id='password' value={fields.password} onChange={(e) => handleChange(e)} />

                <input type='submit' className='submit-button' value={login ? 'Login' : 'Sign Up'} />
                <button type='button' className='back-to-menu'  onClick={() => changePage('')} > Back to Menu </button>
            </form>
        </div>
    )
}