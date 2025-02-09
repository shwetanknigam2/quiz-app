import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-6">
      <div className="max-w-2xl w-full border-2 border-blue-400 rounded-xl p-8 shadow-lg text-center">
        <h1 className="text-4xl font-bold mb-4">📝 Welcome to  Quiz!</h1>
        <p className="text-lg text-gray-600 mb-8">
          You have 15 minutes to complete the quiz. 
          Are you ready?
        </p>

        <Link to="/quiz">
          <button className="px-8 py-4 text-lg font-semibold border-2 border-blue-400 rounded-lg bg-white hover:bg-blue-500 active:scale-95 hover:text-white transition-all duration-300">
            🚀 Start Quiz
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
