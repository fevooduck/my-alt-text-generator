'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Sparkles, Link, Globe, Wand2, RefreshCw, Image as ImageIcon } from 'lucide-react'; // Ícones para um toque visual

export default function Home() {
  const [imageUrl, setImageUrl] = useState('');
  const [language, setLanguage] = useState('portugues');
  const [altText, setAltText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageLoadError, setImageLoadError] = useState(false);

  const MAX_ALT_TEXT_LENGTH = 125; // Limite de caracteres para o alt text, como na imagem

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAltText('');
    setError('');
    setImageLoadError(false);
    setLoading(true);

    if (!imageUrl) {
      setError('Por favor, insira a URL da imagem.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/generate-alt-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl, language }),
      });

      const data = await response.json();

      if (response.ok) {
        // Truncar o texto alternativo se exceder o limite
        const generatedText = data.altText;
        if (generatedText.length > MAX_ALT_TEXT_LENGTH) {
          setAltText(generatedText.substring(0, MAX_ALT_TEXT_LENGTH));
        } else {
          setAltText(generatedText);
        }
      } else {
        setError(data.error || 'Erro desconhecido ao gerar texto alternativo.');
      }
    } catch (err: any) {
      console.error('Erro de rede ou API:', err);
      setError('Erro de conexão. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setImageLoadError(true);
  };

  const handleImageLoad = () => {
    setImageLoadError(false);
  };

  // Calcula caracteres restantes ou usados
  const altTextLength = useMemo(() => altText.length, [altText]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="text-indigo-600 w-10 h-10 mr-3" />
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
            Alt Text Generator
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Gere textos alternativos descritivos para suas imagens usando IA. Perfeito para acessibilidade e SEO.
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Image Input */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <Link className="text-blue-500 w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Image Input</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Forneça uma URL de imagem para gerar o texto alternativo.
          </p>

          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
            <button
              className="flex-1 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled // Desabilitado pois só teremos a opção de URL
            >
              <Link className="inline-block w-4 h-4 mr-1 mb-0.5" /> URL
            </button>
            {/* Opcional: Manter o botão "Upload" desabilitado para visual */}
            <button
              className="flex-1 py-2 text-sm font-medium text-gray-500 dark:text-gray-400"
              disabled
            >
              <Wand2 className="inline-block w-4 h-4 mr-1 mb-0.5" /> Upload
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 disabled:opacity-75"
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Language
                </label>
                <div className="relative">
                  <select
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 appearance-none pr-8 disabled:opacity-75"
                    disabled={loading}
                  >
                    <option value="portugues">Português</option>
                    <option value="espanhol">Español</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* AI Provider - Ignorado conforme solicitado, mas mantendo a estrutura */}
              <div>
                <label htmlFor="aiProvider" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AI Provider
                </label>
                <div className="relative">
                  <input
                    id="aiProvider"
                    value="Google Gemini"
                    readOnly
                    className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 pr-8 cursor-not-allowed"
                    disabled
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Rápido e eficiente para compreensão visual
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition duration-300 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin w-5 h-5 mr-3 text-white" />
                  Gerando Alt Text...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" /> Gerar Alt Text
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Generated Alt Text & Image Preview */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <Wand2 className="text-purple-500 w-6 h-6 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Generated Alt Text</h2>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Texto alternativo gerado por IA para sua imagem, otimizado para acessibilidade.
          </p>

          <div className="mb-6">
            <label htmlFor="altText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alt Text
              <span className="float-right text-gray-500 dark:text-gray-400">
                {altTextLength}/{MAX_ALT_TEXT_LENGTH}
              </span>
            </label>
            <textarea
              id="altText"
              readOnly
              value={altText}
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none font-mono text-sm shadow-inner min-h-[120px]"
              rows={4}
            />
          </div>

          {imageUrl && (
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 mr-2" /> Pré-visualização da Imagem
              </h3>
              <div className="relative w-full h-64 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-md">
                {!imageLoadError && (
                  <Image
                    src={imageUrl}
                    alt="Pré-visualização da imagem"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                )}
                {imageLoadError && (
                  <div className="text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center p-4">
                    <ImageIcon className="w-12 h-12 mb-2" />
                    Não foi possível carregar a imagem.
                    <span className="text-xs">Verifique a URL.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-100 rounded-lg" role="alert">
              <p className="font-bold">Erro:</p>
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}