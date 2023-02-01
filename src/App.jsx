import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import useChatScroll from './helpers/chatHight';

const socket = io('http://localhost:4000');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ref = useChatScroll(messages);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(message);
    socket.emit('chat:message', message);
    setMessage('');
    const newMesagge = {
      body: message,
      from: 'yo',
    };
    setMessages([...messages, newMesagge]);
  };

  useEffect(() => {
    const recibirMensaje = (newMessage) => {
      setMessages([...messages, newMessage]);
    };
    socket.on('chat:message', recibirMensaje);
    return () => {
      socket.off('chat:message', recibirMensaje);
    };
  }, [messages]);

  return (
    <div className="App h-screen bg-zinc-800 text-white flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <h1 className="text-2xl font-bold my-2 text-center">Mandrilo Chat</h1>
        <input
          className="border-2 border-zinc-500 p-2 text-black w-full"
          value={message}
          type="text"
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className="bg-blue-500 py-2 px-3 ">Enviar</button>
        <ul ref={ref} className="h-80 overflow-auto">
          {messages.map((message, index) => (
            <li
              key={index}
              className={` my-2 p-2 table rounded-md text-sm
            ${message.from === 'yo' ? 'bg-sky-700 ml-auto ' : 'bg-black '}
            `}
            >
              <h3>{message.from}</h3>
              <p>{message.body}</p>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default App;
