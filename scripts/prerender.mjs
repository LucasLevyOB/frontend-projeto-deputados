import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SITE_URL = (process.env.SITE_URL || 'https://depudados.com.br').replace(/\/+$/, '');
const API_BASE_URL = (process.env.API_BASE_URL || 'https://backend-projeto-depudados.onrender.com').replace(/\/+$/, '');
const DIST_DIR = resolve(__dirname, '../dist');

/**
 * Escapa strings para uso seguro em atributos e conteúdo HTML.
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Formata valores monetários em formato legível para SEO.
 */
function formatCurrency(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Realiza fetch com timeout configurável.
 */
async function fetchWithTimeout(url, timeoutMs = 25000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return response;
  } catch (error) {
    clearTimeout(timer);
    throw error;
  }
}

/**
 * Busca a lista de deputados da API com suporte a retentativas (resiliência a cold start).
 */
async function fetchDeputadosComRetry(maxRetries = 3, retryDelayMs = 4000) {
  const endpoint = `${API_BASE_URL}/deputados?limit=1000`;
  console.log(`[prerender] Consultando deputados em: ${endpoint}`);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(endpoint, 30000);
      if (!response.ok) {
        throw new Error(`Status HTTP inesperado: ${response.status}`);
      }
      const json = await response.json();
      const deputados = Array.isArray(json.data) ? json.data : [];
      console.log(`[prerender] ${deputados.length} deputados recuperados com sucesso (tentativa ${attempt}).`);
      return deputados;
    } catch (error) {
      console.warn(`[prerender] Tentativa ${attempt}/${maxRetries} falhou: ${error.message}`);
      if (attempt < maxRetries) {
        console.log(`[prerender] Aguardando ${retryDelayMs / 1000}s para retentar (aquecimento da API)...`);
        await new Promise((res) => setTimeout(res, retryDelayMs));
      }
    }
  }

  console.warn('[prerender] Não foi possível obter deputados após todas as tentativas. O build continuará gerando rotas estáticas.');
  return [];
}

/**
 * Injeta metadados e tags OpenGraph no HTML base compilado pelo Vite.
 */
function buildHtmlWithMetadata(templateHtml, {
  title,
  description,
  canonicalUrl,
  imageUrl,
  ogType = 'website',
  jsonLd = null,
  bodyContent = '',
}) {
  let html = templateHtml;

  // Substitui a tag <title>
  html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);

  // Substitui ou injeta a tag meta description
  const metaDescTag = `<meta name="description" content="${escapeHtml(description)}" />`;
  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, metaDescTag);
  } else {
    html = html.replace('</head>', `  ${metaDescTag}\n</head>`);
  }

  // Tags a serem injetadas no <head>
  const headTags = [
    `  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    `  <meta property="og:site_name" content="DepuDados" />`,
    `  <meta property="og:locale" content="pt_BR" />`,
    `  <meta property="og:type" content="${escapeHtml(ogType)}" />`,
    `  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `  <meta property="og:title" content="${escapeHtml(title)}" />`,
    `  <meta property="og:description" content="${escapeHtml(description)}" />`,
    `  <meta property="og:image" content="${escapeHtml(imageUrl || `${SITE_URL}/favicons/favicon-512x512.png`)}" />`,
    `  <meta name="twitter:card" content="summary_large_image" />`,
    `  <meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `  <meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `  <meta name="twitter:image" content="${escapeHtml(imageUrl || `${SITE_URL}/favicons/favicon-512x512.png`)}" />`,
  ];

  if (jsonLd) {
    headTags.push(`  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);
  }

  html = html.replace('</head>', `${headTags.join('\n')}\n</head>`);

  // Se houver conteúdo inicial semântico para o <div id="root">
  if (bodyContent) {
    html = html.replace(
      /<div\s+id=["']root["']>\s*<\/div>/i,
      `<div id="root">${bodyContent}</div>`
    );
  }

  return html;
}

/**
 * Salva um arquivo HTML garantindo que os diretórios pais existam.
 */
function writeHtmlFile(targetPath, content) {
  const dir = dirname(targetPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(targetPath, content, 'utf-8');
}

/**
 * Executa a pré-renderização completa do site.
 */
async function prerender() {
  const baseTemplatePath = resolve(DIST_DIR, 'index.html');

  if (!existsSync(baseTemplatePath)) {
    console.error(`[prerender] ERRO: ${baseTemplatePath} não foi encontrado. Execute 'npm run build' primeiro.`);
    process.exit(1);
  }

  const baseHtml = readFileSync(baseTemplatePath, 'utf-8');
  console.log('[prerender] Iniciando geração de páginas estáticas com metadados para SEO...');

  // 1. Rota Home (/)
  const homeHtml = buildHtmlWithMetadata(baseHtml, {
    title: 'DepuDados | Transparência e Gastos de Deputados Federais',
    description: 'Portal de transparência pública para consulta, análise e acompanhamento detalhado dos gastos, despesas e proposições de deputados federais.',
    canonicalUrl: `${SITE_URL}/`,
    imageUrl: `${SITE_URL}/favicons/favicon-512x512.png`,
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'DepuDados',
      url: `${SITE_URL}/`,
      description: 'Transparência e fiscalização cívica de deputados federais brasileiros.',
    },
  });
  writeHtmlFile(resolve(DIST_DIR, 'index.html'), homeHtml);

  // 2. Rota Lista de Deputados (/deputados)
  const deputadosPageHtml = buildHtmlWithMetadata(baseHtml, {
    title: 'Deputados Federais | Consulta, Filtros e Gastos - DepuDados',
    description: 'Consulte a lista completa dos deputados federais em exercício. Filtre por estado, partido e veja métricas de gastos e produtividade legislativa.',
    canonicalUrl: `${SITE_URL}/deputados`,
    imageUrl: `${SITE_URL}/favicons/favicon-512x512.png`,
    ogType: 'website',
  });
  writeHtmlFile(resolve(DIST_DIR, 'deputados/index.html'), deputadosPageHtml);

  // 3. Rota Comparar (/comparar)
  const compararPageHtml = buildHtmlWithMetadata(baseHtml, {
    title: 'Comparar Deputados Federais | Análise Lado a Lado - DepuDados',
    description: 'Compare gastos, proposições, assiduidade e votações entre deputados federais de forma direta e transparente.',
    canonicalUrl: `${SITE_URL}/comparar`,
    imageUrl: `${SITE_URL}/favicons/favicon-512x512.png`,
    ogType: 'website',
  });
  writeHtmlFile(resolve(DIST_DIR, 'comparar/index.html'), compararPageHtml);

  console.log('[prerender] Rotas estáticas principais geradas com sucesso.');

  // 4. Rotas dinâmicas individuais de deputados (/deputado/:id)
  const deputados = await fetchDeputadosComRetry();

  let geradosCount = 0;
  for (const deputado of deputados) {
    if (!deputado || !deputado._id) continue;

    const id = deputado._id;
    const nome = deputado.nome || 'Deputado Federal';
    const partidoUf = deputado.siglaPartido && deputado.siglaUf
      ? `(${deputado.siglaPartido}-${deputado.siglaUf})`
      : (deputado.siglaPartido || deputado.siglaUf || '');
    const partidoUfTexto = partidoUf ? ` ${partidoUf}` : '';

    const gastos = deputado.estatisticas?.gastosDespesas
      ? ` com total de despesas de ${formatCurrency(deputado.estatisticas.gastosDespesas)}`
      : '';
    const proposicoes = typeof deputado.estatisticas?.totalProposicoes === 'number'
      ? ` e ${deputado.estatisticas.totalProposicoes} proposições cadastradas`
      : '';

    const title = `${nome}${partidoUfTexto} | DepuDados`;
    const description = `Confira gastos${gastos}${proposicoes}, projetos de lei e histórico de votações do deputado federal ${nome}${partidoUfTexto} na plataforma DepuDados.`;
    const canonicalUrl = `${SITE_URL}/deputado/${id}`;
    const fotoUrl = deputado.urlFoto || `${SITE_URL}/favicons/favicon-512x512.png`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: nome,
      jobTitle: 'Deputado(a) Federal',
      image: fotoUrl,
      nationality: 'Brazilian',
      ...(deputado.siglaPartido
        ? {
            affiliation: {
              '@type': 'Organization',
              name: deputado.siglaPartido,
            },
          }
        : {}),
    };

    // Casca semântica acessível para indexação imediata por bots
    const bodyContent = `
      <main style="max-width: 1200px; margin: 0 auto; padding: 24px; font-family: Roboto, sans-serif;">
        <header style="display: flex; align-items: center; gap: 24px; margin-bottom: 24px; flex-wrap: wrap;">
          <img src="${escapeHtml(fotoUrl)}" alt="${escapeHtml(nome)}" width="120" height="150" style="border-radius: 8px; object-fit: cover; background: #eee;" />
          <div>
            <h1 style="margin: 0 0 8px 0; font-size: 26px; color: #1e293b;">${escapeHtml(nome)}</h1>
            <p style="margin: 0 0 8px 0; font-size: 16px; color: #475569;">
              <strong>Deputado(a) Federal</strong> &bull; ${escapeHtml(deputado.siglaPartido || '')} - ${escapeHtml(deputado.siglaUf || '')}
            </p>
            ${deputado.situacao ? `<span style="display: inline-block; padding: 4px 10px; border-radius: 12px; background: #e2e8f0; font-size: 12px; color: #334155;">${escapeHtml(deputado.situacao)}</span>` : ''}
          </div>
        </header>
        <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
          ${deputado.estatisticas?.gastosDespesas !== undefined ? `
            <div style="padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff;">
              <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">Total em Despesas</div>
              <div style="font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 4px;">${formatCurrency(deputado.estatisticas.gastosDespesas)}</div>
            </div>
          ` : ''}
          ${deputado.estatisticas?.totalProposicoes !== undefined ? `
            <div style="padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff;">
              <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">Proposições Apresentadas</div>
              <div style="font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 4px;">${deputado.estatisticas.totalProposicoes}</div>
            </div>
          ` : ''}
          ${deputado.estatisticas?.projetosDeLei !== undefined ? `
            <div style="padding: 16px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff;">
              <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">Projetos de Lei</div>
              <div style="font-size: 20px; font-weight: bold; color: #0f172a; margin-top: 4px;">${deputado.estatisticas.projetosDeLei}</div>
            </div>
          ` : ''}
        </section>
        <p style="color: #64748b; font-size: 14px;">Carregando dados detalhados da plataforma DepuDados...</p>
      </main>
    `.trim();

    const deputadoHtml = buildHtmlWithMetadata(baseHtml, {
      title,
      description,
      canonicalUrl,
      imageUrl: fotoUrl,
      ogType: 'profile',
      jsonLd,
      bodyContent,
    });

    writeHtmlFile(resolve(DIST_DIR, `deputado/${id}/index.html`), deputadoHtml);
    geradosCount++;
  }

  console.log(`[prerender] Concluído! Total de ${geradosCount} páginas de deputados pré-renderizadas em 'dist/deputado/[id]/index.html'.`);
}

prerender().catch((err) => {
  console.error('[prerender] Erro fatal durante a pré-renderização:', err);
  process.exit(1);
});
