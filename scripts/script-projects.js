// ── Nav ──────────────────────────────────────────────
window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

document.getElementById('hamburger').addEventListener('click', () => {
    const menu = document.getElementById('mobile-menu');
    const isOpen = menu.classList.toggle('open');
    document.getElementById('icon-open').classList.toggle('hidden', isOpen);
    document.getElementById('icon-close').classList.toggle('hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

window.closeMobileMenu = () => {
    document.getElementById('mobile-menu').classList.remove('open');
    document.getElementById('icon-open').classList.remove('hidden');
    document.getElementById('icon-close').classList.add('hidden');
    document.body.style.overflow = '';
};

document.getElementById('year').textContent = new Date().getFullYear();

// ── Tabs ─────────────────────────────────────────────
window.switchTab = (id, btn) => {
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + id).classList.add('active');
    btn.classList.add('active');
};

// ── GitHub API ───────────────────────────────────────
const GH_USER = 'Pater999';
let unitnRepos = [];

async function loadGitHub() {
    try {
        const [userRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${GH_USER}`),
            fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`)
        ]);

        if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API error');

        const user  = await userRes.json();
        const repos = await reposRes.json();

        // Show user card
        document.getElementById('gh-avatar').src = user.avatar_url;
        document.getElementById('gh-name').textContent = user.name || GH_USER;
        document.getElementById('gh-bio').textContent  = user.bio  || '';
        const card = document.getElementById('user-card');
        card.style.display = 'flex';
        card.style.setProperty('display', 'flex', 'important');

        // UNITN repos: non-fork repos with unitn/university/fisica/disi in name
        unitnRepos = repos.filter(r =>
            !r.fork && (
                r.name.toLowerCase().includes('unitn') ||
                r.name.toLowerCase().includes('university') ||
                r.name.toLowerCase().includes('fisica') ||
                r.name.toLowerCase().includes('disi') ||
                r.name.toLowerCase().includes('appunti')
            )
        );

        // Fallback: if no matches, show all non-fork repos
        if (unitnRepos.length === 0) {
            unitnRepos = repos.filter(r => !r.fork);
        }

        renderUnitn(unitnRepos);
    } catch {
        document.getElementById('unitn-list').innerHTML =
            `<p class="text-sm col-span-3" style="color:var(--text-muted)">
                Could not load repositories.
                <a href="https://github.com/${GH_USER}" target="_blank" rel="noopener noreferrer" style="color:var(--orange)">View on GitHub ↗</a>
            </p>`;
    }
}

function renderUnitn(repos) {
    const list = document.getElementById('unitn-list');
    document.getElementById('unitn-count').textContent = `${repos.length} repo${repos.length !== 1 ? 's' : ''}`;

    if (!repos.length) {
        list.innerHTML = '<p class="text-sm" style="color:var(--text-muted)">No repositories found.</p>';
        return;
    }

    list.innerHTML = repos.map(r => `
        <div class="repo-card">
            <div class="repo-name">${esc(r.name)}</div>
            <div class="repo-desc">${esc(r.description || 'No description available.')}</div>
            <div class="repo-footer">
                ${r.language ? `<span class="repo-lang">${esc(r.language)}</span>` : '<span></span>'}
                <a href="${r.html_url}" target="_blank" rel="noopener noreferrer" class="repo-link">
                    GitHub ↗
                </a>
            </div>
        </div>
    `).join('');
}

window.filterUnitn = (q) => {
    const term = q.toLowerCase();
    renderUnitn(unitnRepos.filter(r =>
        r.name.toLowerCase().includes(term) ||
        (r.description && r.description.toLowerCase().includes(term))
    ));
};

function esc(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

loadGitHub();
