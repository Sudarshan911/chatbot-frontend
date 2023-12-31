import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import './Chatbot.css'

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [showDocument, setShowDocument] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
const temp = `To extrude in the ordered environment, follow these steps:\n\n1. Open the SolidWorks software and create a sketch.\n2. Select the sketch you want to extrude.\n3. On the Home tab, in the Solids group, click the Extrude command.\n4. On the Extrude command bar, select the Operation you want to perform: Automatic, Add, Cut, or Add Body.\n5`
    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (input.trim()) {
            setIsLoading(true);
            setMessages([...messages, { text: input, sender: 'user' }]);
            setInput('');

            let response = await axios.post('http://localhost:3000/chatbot/ask', { message: input })
            setIsLoading(false)
            setMessages(messages => [...messages, { text: response.data.msg, sender: 'bot' }]);
            console.log(messages);

        }
    };

    const handleDocument = () => { 
        setShowDocument(temp)
    }

    return ( <div className='row'>
        <div className="chatbot-container py-2 row col-md-9 ">
            <div className='display-2 text-center   container' id='headerName'>ChatBot</div>

            <div className="card m-4">
                <div className="card-body chatbot-messages" style={{ height: '70vh', overflowY: 'auto' }}>
                    {!messages.length && <div class="row align-items-center initialPage">
                        <div class="col text-center display-5 fst-normal">
                        <i class="fa fa-solid fa-robot fa-lg m-1" aria-hidden="true"></i>What can i do for you?    </div>
                    </div>}
                    {messages.map((message, index) => (
                        <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-end' : ''}`}>
                            <p className='mb-0 text-success font-italic'>{message.sender === 'user'
                                ? <p> User<i class="fa fa-user-circle fa-lg m-1" aria-hidden="true"></i></p>
                                : <p> Bot<i class="fa fa-solid fa-robot fa-lg m-1" aria-hidden="true"></i></p>}</p>
                            {message.sender === 'user' ?
                                <>
                                    <pre className={`text-white badge text-wrap text-start fs-5 fst-normal ${message.sender === 'user' ? 'userMessage' : 'botMessage'}`} >
                                        {message.text}
                                    </pre>
                                </> :
                                <div class="jumbotron cardBotResponse border p-2 shadow p-3 mb-5 bg-white rounded">
                                    <pre className='fs-5 '>{message.text}</pre>
                                    <hr class="my-4" />
                                    <p>Here is the document <button className='btn btn-sm btn-info ' onClick={handleDocument}>data.pdf</button> </p>
                                </div>
                            }
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="m-3">
                    {/* {isLoading && <p className='loading-dots loading-animation' >Chatbot is thinking</p>} */}
                    {true && <p >  <div className="loader "></div> </p>}

                    <div className="input-group">

                        <input
                            type="text"
                            className="form-control"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                        />
                        <button className="btn btn-primary " onClick={handleSend}>Ask</button>
                    </div>
                </div>
            </div>
        </div>
        <div className="chatbot-container  py-2 m-2 row col-md-3 bg-white lead align-items-md-center">
            {showDocument && <pre className='documentSection fs-5'>
                {temp}
            </pre>
            }
        </div>
        </div>
    );
};

export default Chatbot;
