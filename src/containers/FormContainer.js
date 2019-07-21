import React from 'react';
import { Form, FormInput, FormGroup, Button } from 'shards-react';
import '../stylesheets/Form.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"

export default function FormContainer(props) {
    const { login, changePage } = props
    
    return (
        <div className='form-container'>
            <Form>
                <FormGroup>
                    <label htmlFor="#username">Username</label>
                    <FormInput id="#username" placeholder="Username" />
                </FormGroup>
                <FormGroup>
                    <label htmlFor="#password">Password</label>
                    <FormInput type="password" id="#password" placeholder="Password" />
                </FormGroup>
                <Button block theme='success'>Login</Button>
                <Button block theme='secondary' onClick={() => changePage('')}>Back to Menu</Button>
            </Form>
        </div>
    )
}