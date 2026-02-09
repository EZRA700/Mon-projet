import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { articlesAPI } from '../services/api';
import Navbar from '../components/Navbar';
import ArticleCard from '../components/ArticleCard';

function Dashboard({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articlesAPI.getAll();
      setArticles(response.data.articles);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      await articlesAPI.delete(id);
      setArticles(articles.filter(article => article.id !== id));
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Erreur lors de la suppression');
    }
  };

  const handleEdit = (id) => {
    navigate(`/articles/edit/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar setIsAuthenticated={setIsAuthenticated} user={user} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-600 mt-1">
              Gérez vos articles
            </p>
          </div>
          <button
            onClick={() => navigate('/articles/create')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-medium shadow-md"
          >
            + Nouvel article
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun article</h3>
            <p className="mt-1 text-gray-500">Commencez par créer votre premier article.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/articles/create')}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                + Créer un article
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onDelete={handleDelete}
                onEdit={handleEdit}
                currentUserId={user?.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
