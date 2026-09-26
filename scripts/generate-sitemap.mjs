import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = process.env.SITE_URL || 'https://depudados.com.br';
const API_BASE_URL = process.env.API_BASE_URL || 'https://backend-projeto-depudados.onrender.com';

/**
 * Cria a tag <url> individual do XML para uma rota.
 */
const buildUrlEntry = (loc, priority, changefreq, lastmod) => {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ].join('\n');
};

/**
 * Monta o documento XML completo do sitemap.
 */
const assembleSitemapXml = (urlEntries) => {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries.join('\n'),
    '</urlset>',
    '',
  ].join('\n');
};

/**
 * Busca a lista de IDs de todos os deputados cadastrados na API.
 */
const fetchDeputadosIds = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/deputados?limit=1000`);
    if (!response.ok) {
      console.warn(`[sitemap] Falha ao consultar deputados na API: status ${response.status}`);
      return [];
    }

    const json = await response.json();
    const lista = Array.isArray(json.data) ? json.data : [];

    const ids = [];
    for (const deputado of lista) {
      if (deputado && deputado._id) {
        ids.push(deputado._id);
      }
    }
    return ids;
  } catch (error) {
    console.warn(`[sitemap] Erro de conexão com a API (${API_BASE_URL}):`, error.message);
    return [];
  }
};

/**
 * Gera as entradas estáticas e dinâmicas e grava o sitemap.xml.
 */
const generateSitemap = async () => {
  const currentDate = new Date().toISOString().split('T')[0];

  console.log(`[sitemap] Iniciando geração do sitemap para: ${SITE_URL}`);

  const urlEntries = [
    buildUrlEntry(`${SITE_URL}/`, '1.0', 'weekly', currentDate),
    buildUrlEntry(`${SITE_URL}/deputados`, '0.9', 'daily', currentDate),
    buildUrlEntry(`${SITE_URL}/comparar`, '0.8', 'monthly', currentDate),
  ];

  const deputadosIds = await fetchDeputadosIds();

  if (deputadosIds.length > 0) {
    for (const id of deputadosIds) {
      urlEntries.push(
        buildUrlEntry(`${SITE_URL}/deputado/${id}`, '0.7', 'weekly', currentDate)
      );
    }
    console.log(`[sitemap] ${deputadosIds.length} deputados adicionados ao sitemap.`);
  } else {
    console.warn('[sitemap] Nenhum deputado foi recuperado da API. O sitemap conterá apenas as rotas estáticas.');
  }

  const sitemapXml = assembleSitemapXml(urlEntries);
  const targetPath = resolve(__dirname, '../public/sitemap.xml');

  writeFileSync(targetPath, sitemapXml, 'utf-8');
  console.log(`[sitemap] Sitemap gerado com sucesso em: ${targetPath} (Total de URLs: ${urlEntries.length})`);
};

generateSitemap();
