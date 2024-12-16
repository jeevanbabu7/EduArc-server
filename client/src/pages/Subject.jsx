import React from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Subject = () => {
    const {name} = useParams();
  return (
    <div className='bg-slate-900 h-screen'>
      <Link to={`/subject/${name}/quiz`}>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  border border-blue-700 rounded">
          Start Quiz
        </button>
      </Link>
    </div>
  )
}

export default Subject
