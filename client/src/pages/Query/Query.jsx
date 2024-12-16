import React, { useState } from 'react'

const Query = () => {

    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');   
    const handleChange = (e) => {
        setQuery(e.target.value);
    }
    const handleSubmit = async () => {
        const res = await fetch('http://127.0.0.1:5000/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({query}),
        });

        const data = await res.json();
        setResponse(data.response);
    }
  return (
    <div className='h-screen m-0 bg-slate-700 flex flex-col justify-start gap-10'>
        <h1 className='text-3xl text-lime-50'>Enter your query</h1>
        <div className=''>
            <input type="text" className='h-12 w-96 m-10'onChange={handleChange}/>
            <button onClick={handleSubmit} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">
  Button
</button>/
        </div>
        
        <div className=''>
            <h1 className='text-3xl text-lime-50'>Response</h1>
            <p className='text-xl text-lime-50'>{response}</p>
        </div>

    </div>
  )
}

export default Query
