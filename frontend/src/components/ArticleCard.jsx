function ArticleCard({ article, onDelete, onEdit, currentUserId }) {
  const isAuthor = currentUserId === article.authorId;
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Générer l'URL complète de l'image
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    // Si c'est une URL relative (uploadée localement)
    if (imageUrl.startsWith('/uploads/')) {
      return `http://localhost:5012${imageUrl}`;
    }
    // Sinon c'est une URL externe
    return imageUrl;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {article.imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={getImageUrl(article.imageUrl)} 
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.content}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-medium mr-3">{article.author.name}</span>
          
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(article.createdAt)}</span>
        </div>

        {isAuthor && (
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <button
              onClick={() => onEdit(article.id)}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium"
            >
              Modifier
            </button>
            <button
              onClick={() => onDelete(article.id)}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArticleCard;
