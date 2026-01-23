export default function JsonLd() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://apeye.vercel.app';
  
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${baseUrl}/#webapp`,
        "name": "APEye",
        "description": "A modern, fast, and intuitive API testing client. Test, debug, and organize your APIs with ease.",
        "url": baseUrl,
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "Web Browser",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "featureList": [
          "HTTP request builder with all methods (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)",
          "Query parameter management",
          "Custom headers configuration", 
          "Multiple authentication types (Bearer, Basic, API Key)",
          "Request body support (JSON, Form Data, URL Encoded, Raw)",
          "Response viewer with syntax highlighting",
          "Collections for organizing requests",
          "Request history tracking",
          "Dark and light theme support"
        ],
        "screenshot": `${baseUrl}/og-image.png`,
        "softwareVersion": "1.0.0",
        "author": {
          "@type": "Person",
          "name": "Akash Pandey",
          "url": "https://github.com/Akash-YS05"
        }
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "APEye",
        "url": baseUrl,
        "logo": `${baseUrl}/icon.svg`,
        "sameAs": [
          "https://github.com/Akash-YS05",
          "https://linkedin.com/in/li-akash-pandey",
          "https://x.com/akashpandeytwt"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "APEye",
        "description": "Modern API Testing Tool",
        "publisher": {
          "@id": `${baseUrl}/#organization`
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
