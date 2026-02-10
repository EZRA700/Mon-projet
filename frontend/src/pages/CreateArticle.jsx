import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { articlesAPI } from '../services/api';
import Navbar from '../components/Navbar';

function CreateArticle() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      // Effacer l'URL si un fichier est sélectionné
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, imageUrl: url }));
    setImagePreview(url);
    // Effacer le fichier si une URL est entrée
    if (url) {
      setImageFile(null);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await articlesAPI.uploadImage(formData);
      return response.data.imageUrl;
    } catch (err) {
      console.error('Erreur upload:', err);
      throw new Error('Erreur lors de l\'upload de l\'image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let finalImageUrl = formData.imageUrl;

      // Upload de l'image si un fichier a été sélectionné
      if (imageFile) {
        finalImageUrl = await uploadImage();
      }

      await articlesAPI.create({
        ...formData,
        imageUrl: finalImageUrl
      });
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 
        err.message ||
        'Une erreur est survenue lors de la création de l\'article'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 flex items-center mb-4"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au tableau de bord
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Créer un article</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'article
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={200}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Un titre accrocheur..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image (optionnel)
              </label>
              
              {/* Upload de fichier */}
              <div className="mb-3">
                <label htmlFor="imageFile" className="block text-sm text-gray-600 mb-1">
                  📁 Uploader depuis votre ordinateur
                </label>
                <input
                  type="file"
                  id="imageFile"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">JPG, PNG, GIF ou WebP (max 5MB)</p>
              </div>

              {/* Séparateur */}
              <div className="flex items-center my-3">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-sm text-gray-500">OU</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* URL d'image */}
              <div>
                <label htmlFor="imageUrl" className="block text-sm text-gray-600 mb-1">
                  🔗 Entrer une URL d'image
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleImageUrlChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://exemple.com/image.jpg"
                />
              </div>

              {/* Aperçu de l'image */}
              {imagePreview && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Aperçu :</p>
                  <img 
                    src={imagePreview} 
                    alt="Aperçu" 
                    className="max-w-full h-48 object-cover rounded-lg border border-gray-300"
                    onError={() => setImagePreview('')}
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Contenu
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                minLength={10}
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Écrivez votre article ici..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || uploadingImage}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 font-medium shadow-md"
              >
                {uploadingImage ? 'Upload de l\'image...' : loading ? 'Création en cours...' : 'Créer l\'article'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateArticle;
