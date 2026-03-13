import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SEO: React.FC<SEOProps> = ({ 
  title = "Tornillos AM | Tu Aliado en Tornillería Industrial y Maquinados", 
  description = "Especialistas en tornillería industrial, maquinados de precisión y fabricaciones especiales. El catálogo más completo de Monterrey con entrega inmediata.",
  image = "/og-image.png",
  url = "https://tornillosam.com"
}) => {
  const siteTitle = title.includes("Tornillos AM") ? title : `${title} | Tornillos AM`;

  return (
    <Helmet>
      {/* Estándar */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />

      {/* Facebook / WhatsApp / Preview */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
