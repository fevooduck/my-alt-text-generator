/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.minestle.com',
        port: '',
        pathname: '/sites/default/files/**', // Opcional: restringe o path
      },
      // Adicione outros domínios de imagem aqui, se necessário
      // Exemplo para Unsplash:
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Exemplo para Wikimedia:
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;