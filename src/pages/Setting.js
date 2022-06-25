import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button as BtnReact } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageUploader from 'react-image-upload';
import "react-image-upload/dist/index.css";
import { useMoralisFile, useMoralis } from 'react-moralis';

import 'assets/css/create.css';
import 'assets/css/setting.css';

const Setting = () => {
    const [img, setImage] = useState();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [add, setAdd] = useState(true);
    const history = useHistory();
    const { saveFile } = useMoralisFile();
    const { user, isAuthenticated } = useMoralis();

    useEffect(() => {
        // if(!isAuthenticated) history.push("/");
    }, []);

    useEffect(() => {
        setName(user?.attributes.username);
        setEmail(user?.attributes.email);
        if(user?.attributes.profile) {
            setAdd(false);
        }
    }, [user]);


    const styles = {
        item: {
          display: "flex",
          alignItems: "center",
          height: "42px",
          fontWeight: "500",
          fontFamily: "Roboto, sans-serif",
          fontSize: "14px",
          padding: "0 10px",
        },
        button: {
            border: "1px solid rgb(231, 234, 243)",
            borderRadius: "7px",
        },
    }

    const save = async () => {
        console.log(user);
        if(!img || img == null) {
            alert("Please insert your NFT image")
            return
        }
        if(!name) {
            alert("Please insert your name")
            return
        }
        try {
            const imageFile = await saveFile(img.file?.name, img.file, {saveIPFS: true})
            if(!imageFile) {
                return;
            };
            const imageURI = imageFile?._ipfs;
            console.log(imageURI);
            user.set('profile', imageURI);
            user.set('email', email);
            user.set('username', name);
            await user.save();
            alert("success");
        } catch (err) {
            alert(err?.message?err?.message:err);
        }
    }

    return (
        <>
            <div className='create-main'>
                <br/><br/><br/>
                <Row className="mx-0">
                    <Col>
                    {
                        add ?
                        <ImageUploader
                            style={{ height: 200, width: 200, background: 'white', border:'2px dashed black', borderRadius: 13 }}
                            deleteIcon={
                                <img
                                src='https://img.icons8.com/ios-glyphs/30/000000/delete-sign.png'
                                alt=''
                                />
                            }
                            uploadIcon={
                                <svg
                                className='svg-circleplus'
                                viewBox='0 0 100 100'
                                style={{ height: '40px', stroke: '#000' }}
                                >
                                <circle cx='50' cy='50' r='45' fill='none' strokeWidth='7.5'></circle>
                                <line x1='32.5' y1='50' x2='67.5' y2='50' strokeWidth='5'></line>
                                <line x1='50' y1='32.5' x2='50' y2='67.5' strokeWidth='5'></line>
                                </svg>
                            }
                            onFileAdded={(img) => setImage(img)}
                        /> : 
                        <div>
                            <img src={user?.attributes.profile} style={{ height: 200, width: 200, background: 'white', border:'2px dashed black', borderRadius: 13,margin:'auto' }} alt=""/>
                            <br/>
                            <BtnReact onClick={() => setAdd(true)} style={{marginLeft:'41%'}}>Remove</BtnReact>
                        </div>
                    }
                    </Col>
                    <Col>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} required />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                            </Form.Group>
                            <br/><br/>
                            <BtnReact variant="primary" style={{width:'100px'}} onClick={save}>Save</BtnReact>
                        </Form>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Setting;