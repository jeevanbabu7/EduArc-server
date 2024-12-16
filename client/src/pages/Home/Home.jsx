import React from "react";
import './Home.css'; // Import your CSS for styling
import { Link } from "react-router-dom";

const topics = [
  {
    id: 1,
    title: "Biology",
    description: "Explore the fundamentals of life and living organisms.",
    imageUrl: "https://via.placeholder.com/150",
    link: "/bio"
  },
  {
    id: 2,
    title: "Physics",
    description: "Understand the principles of matter and energy.",
    imageUrl: "https://via.placeholder.com/150",
    link: "/phys"
  },
  {
    id: 3,
    title: "Chemistry",
    description: "Learn how to build websites and web applications.",
    imageUrl: "https://via.placeholder.com/150",
    link: "/web-dev"
  },
  {
    id: 4,
    title: "Social science",
    description: "Dive into the study of the structure, properties, and reactions of organic compounds.",
    imageUrl: "https://via.placeholder.com/150",
    link: "/organic-chem"
  },
  {
    id: 5,
    title: "English",
    description: "Discover the building blocks of proteins.",
    imageUrl: "https://via.placeholder.com/150",
    link: "/amino-acids"
  },
];

const HomePage = () => {
  return (
    <div className="bg-slate-900 text-white flex flex-col gap-12 p-8">
      <h1 className="text-4xl text-center font-bold">Welcome to Your Personalized Learning Hub</h1>
      <div className="flex flex-row gap-12 flex-wrap justify-center p-10">
        {topics.map(topic => (
          <div key={topic.id} className="bg-slate-800 rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105">
            <img src={topic.imageUrl} alt={topic.title} className="w-full h-40 object-cover rounded-t-lg" />
            <h2 className="text-2xl mt-4 font-semibold">{topic.title}</h2>
            <p className="mt-2 text-gray-400">{topic.description}</p>
            <Link to={`/subject/${topic.title}`}>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 border border-blue-500 hover:border-transparent rounded mt-4 transition duration-300">
                Learn More
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>

  );
};

export default HomePage;
