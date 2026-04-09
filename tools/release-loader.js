(() => {
  const releaseJsonPath = window.location.pathname.startsWith('/tools')
    ? '/tools/releases.json'
    : './releases.json';

  function setNodeText(node, value) {
    if (!node || typeof value !== 'string') return;
    node.textContent = value;
  }

  function applyReleaseNotes(notes = []) {
    if (!Array.isArray(notes) || notes.length === 0) return;
    document.querySelectorAll('[data-release-notes]').forEach((node) => {
      node.innerHTML = '';
      notes.forEach((item) => {
        const text = String(item || '').trim();
        if (!text) return;
        const li = document.createElement('li');
        li.textContent = text;
        node.appendChild(li);
      });
    });
  }

  function getFileName(downloadUrl = '') {
    const text = String(downloadUrl || '').trim();
    if (!text) return '';
    const clean = text.split('?')[0].split('#')[0];
    const parts = clean.split('/');
    return parts[parts.length - 1] || '';
  }

  function applyReleaseMeta(data = {}) {
    const version = String(data.latestVersion || '').trim();
    const downloadUrl = String(data.downloadUrl || '').trim();
    const fileName = getFileName(downloadUrl);
    if (!version || !downloadUrl) return;

    document.querySelectorAll('[data-release-download-link]').forEach((node) => {
      node.setAttribute('href', downloadUrl);
    });

    document.querySelectorAll('[data-release-version]').forEach((node) => {
      setNodeText(node, version);
    });

    document.querySelectorAll('[data-release-download-text]').forEach((node) => {
      const lang = node.getAttribute('data-release-download-text');
      setNodeText(node, lang === 'en' ? `Download ${version}` : `下载 ${version}`);
    });

    document.querySelectorAll('[data-release-qualified-download-text]').forEach((node) => {
      const lang = node.getAttribute('data-release-qualified-download-text');
      setNodeText(
        node,
        lang === 'en' ? `I already qualify, download ${version}` : `我已有资格，下载 ${version}`
      );
    });

    document.querySelectorAll('[data-release-version-label]').forEach((node) => {
      const lang = node.getAttribute('data-release-version-label');
      setNodeText(node, lang === 'en' ? `Version: ${version}` : `版本号：${version}`);
    });

    document.querySelectorAll('[data-release-filename-step]').forEach((node) => {
      const lang = node.getAttribute('data-release-filename-step');
      setNodeText(node, lang === 'en'
        ? `Download \`${fileName}\` and unzip it.`
        : `下载 \`${fileName}\` 并解压。`);
    });

    applyReleaseNotes(data.notes);
  }

  async function loadReleaseMeta() {
    try {
      const response = await fetch(releaseJsonPath, { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      applyReleaseMeta(data);
    } catch {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadReleaseMeta, { once: true });
    return;
  }

  loadReleaseMeta();
})();
