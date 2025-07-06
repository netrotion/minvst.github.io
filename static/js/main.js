
// Simple tab navigation
const API_HOST = window.API_HOST || ""; // Ví dụ: "http://localhost:5500" hoặc "" nếu cùng domain

const navLinks = {
    login: document.getElementById('navLogin'),
    register: document.getElementById('navRegister'),
    home: document.getElementById('navHome'),
    pricing: document.getElementById('navPricing'),
    apidocument: document.getElementById('navDocument'),
    download: document.getElementById('navDownload')
};
const sections = {
    login: document.getElementById('login'),
    register: document.getElementById('register'),
    home: document.getElementById('home'),
    pricing: document.getElementById('pricing'),
    apidocument: document.getElementById('apidocument'),
    download: document.getElementById('download')
};

function showSection(section) {
    Object.keys(sections).forEach(key => {
        sections[key].classList.remove('active');
        if (navLinks[key]) navLinks[key].classList.remove('active');
    });
    if (sections[section]) sections[section].classList.add('active');
    if (navLinks[section]) navLinks[section].classList.add('active');
}

navLinks.login.addEventListener('click', e => { e.preventDefault(); showSection('login'); });
navLinks.register.addEventListener('click', e => { e.preventDefault(); showSection('register'); });
navLinks.home.addEventListener('click', e => { e.preventDefault(); showSection('home'); });
navLinks.pricing.addEventListener('click', e => { e.preventDefault(); showSection('pricing'); });
navLinks.apidocument.addEventListener('click', e => { e.preventDefault(); showSection('apidocument'); });
navLinks.download.addEventListener('click', e => { e.preventDefault(); showSection('download'); });

// Default to login
showSection('login');

// --- API HANDLING FOR LOGIN & REGISTER ---

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i=0;i < ca.length;i++) {
        let c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function showCookieConsent() {
    if (!getCookie('minvst_cookie_accept')) {
        document.getElementById('cookieConsent').style.display = 'block';
    }
}
document.getElementById('acceptCookies').onclick = function() {
    setCookie('minvst_cookie_accept', '1', 3);
    document.getElementById('cookieConsent').style.display = 'none';
};
showCookieConsent();

// --- Auth & Session ---
function saveUserSession(user, token) {
    setCookie('minvst_user', JSON.stringify(user), 7);
    if (token) localStorage.setItem('minvst_token', token);
}
function getUserSession() {
    const val = getCookie('minvst_user');
    try { return val ? JSON.parse(val) : null; } catch { return null; }
}
function clearUserSession() {
    fetch(API_HOST + '/api/logout', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('minvst_token') || '') }
    }).finally(() => {
        setCookie('minvst_user', '', -1);
        localStorage.removeItem('minvst_token');
        window.location.href = "/";
    });
}

// --- UI Update on Login/Logout ---
function updateAuthUI(user) {
    // Header nav
    const navLogin = document.getElementById('navLogin');
    const navRegister = document.getElementById('navRegister');
    const headerActions = document.querySelector('.header-actions');
    // Sidebar nav
    const sidebarLinks = document.querySelector('.sidebar-links');
    // Remove old user info if exists
    let oldUser = document.getElementById('headerUserBox');
    if (oldUser) oldUser.remove();
    let oldLogout = document.getElementById('headerLogoutBtn');
    if (oldLogout) oldLogout.remove();
    // Sidebar user
    let oldSidebarUser = document.getElementById('sidebarUserBox');
    if (oldSidebarUser) oldSidebarUser.remove();
    let oldSidebarLogout = document.getElementById('sidebarLogoutBtn');
    if (oldSidebarLogout) oldSidebarLogout.remove();
    let oldSidebarDashboard = document.getElementById('sidebarDashboardBtn');
    if (oldSidebarDashboard) oldSidebarDashboard.remove();

    if (user) {
        // Hide login/register
        if (navLogin) navLogin.style.display = 'none';
        if (navRegister) navRegister.style.display = 'none';
        // Add user info & logout/dashboard to header
        const userBox = document.createElement('div');
        userBox.id = 'headerUserBox';
        userBox.style.display = 'flex';
        userBox.style.alignItems = 'center';
        userBox.style.gap = '10px';
        userBox.style.marginLeft = 'auto';
        userBox.innerHTML = `
            <span style="font-weight:600;color:var(--accent);" class="header-user-name"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg> ${user.name || user.username}</span>
            <button id="headerLogoutBtn" style="background:#f87171;color:#fff;border:none;border-radius:6px;padding:6px 14px;font-weight:600;cursor:pointer;">Logout</button>
        `;
        headerActions.appendChild(userBox);
        // ...trong updateAuthUI, phần tạo link Dashboard...

        let navDashboard = document.getElementById('navDashboard');
        if (!navDashboard) {
            navDashboard = document.createElement('a');
            navDashboard.href = "/dashboard";
            navDashboard.id = "navDashboard";
            navDashboard.textContent = "Dashboard";
            navDashboard.style.color = "#b713bd";
            navDashboard.style.fontWeight = "600";
            document.getElementById('headerNav').appendChild(navDashboard);

            // Sử dụng chuyển hướng qua fetch để gửi token/cookie
            navDashboard.addEventListener('click', function(e) {
                // e.preventDefault();
                const token = localStorage.getItem('minvst_token');
                fetch('/dashboard', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    credentials: 'include'
                }).then(res => res.text())
                .then(html => {
                    document.open();
                    document.write(html);
                    document.close();
                });
            });
        }

        // Sidebar Dashboard link: chuyển hướng sang /dashboard
        if (sidebarLinks) {
            sidebarLinks.querySelectorAll('#sideNavLogin, #sideNavRegister').forEach(e => e.style.display = 'none');
            let sideNavDashboard = document.getElementById('sideNavDashboard');
            if (!sideNavDashboard) {
                const dashboardLink = document.createElement('a');
                dashboardLink.href = "/dashboard";
                dashboardLink.id = "sideNavDashboard";
                dashboardLink.innerHTML = '<span class="sidebar-link-icon"><svg width="21.57" height="21.57" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="24" height="24"></rect> <path d="M15.024 22C16.2771 22 17.3524 21.9342 18.2508 21.7345C19.1607 21.5323 19.9494 21.1798 20.5646 20.5646C21.1798 19.9494 21.5323 19.1607 21.7345 18.2508C21.9342 17.3524 22 16.2771 22 15.024V12C22 10.8954 21.1046 10 20 10H12C10.8954 10 10 10.8954 10 12V20C10 21.1046 10.8954 22 12 22H15.024Z" fill="#6366f1"></path> <path d="M2 15.024C2 16.2771 2.06584 17.3524 2.26552 18.2508C2.46772 19.1607 2.82021 19.9494 3.43543 20.5646C4.05065 21.1798 4.83933 21.5323 5.74915 21.7345C5.83628 21.7538 5.92385 21.772 6.01178 21.789C7.09629 21.9985 8 21.0806 8 19.976L8 12C8 10.8954 7.10457 10 6 10H4C2.89543 10 2 10.8954 2 12V15.024Z" fill="#6366f1"></path> <path d="M8.97597 2C7.72284 2 6.64759 2.06584 5.74912 2.26552C4.8393 2.46772 4.05062 2.82021 3.4354 3.43543C2.82018 4.05065 2.46769 4.83933 2.26549 5.74915C2.24889 5.82386 2.23327 5.89881 2.2186 5.97398C2.00422 7.07267 2.9389 8 4.0583 8H19.976C21.0806 8 21.9985 7.09629 21.789 6.01178C21.772 5.92385 21.7538 5.83628 21.7345 5.74915C21.5322 4.83933 21.1798 4.05065 20.5645 3.43543C19.9493 2.82021 19.1606 2.46772 18.2508 2.26552C17.3523 2.06584 16.2771 2 15.024 2H8.97597Z" fill="#6366f1"></path> </g></svg></span>Dashboard';
                sidebarLinks.insertBefore(dashboardLink, sidebarLinks.firstChild.nextSibling);

                dashboardLink.addEventListener('click', function(e) {
                    // e.preventDefault();
                    const token = localStorage.getItem('minvst_token');
                    fetch('/dashboard', {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                        credentials: 'include'
                    }).then(res => res.text())
                    .then(html => {
                        document.open();
                        document.write(html);
                        document.close();
                    });
                });
            }
        }
        const sidebarUserInfo = document.createElement('div');
        sidebarUserInfo.className = 'sidebar-user-info';
        sidebarUserInfo.style.cssText = "display:flex;align-items:center;gap:10px;padding:18px 0 8px 0;margin:0 0 0 8px;color:#fff;font-weight:600;";
        sidebarUserInfo.innerHTML = `<span class="sidebar-user-name"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg> ${user.name || user.username}</span>
            <a href="#" id="sidebarLogoutBtn" style="color:#f87171;font-weight:600;margin-left:10px;text-decoration:none;">Logout</a>`;
        sidebarUserBoxWrap.appendChild(sidebarUserInfo);
        // Header logout event
        document.getElementById('headerLogoutBtn').onclick = function(){logoutUser();};
        document.getElementById('sidebarLogoutBtn').onclick = function(e){e.preventDefault();logoutUser();};
    } else {
        if (navLogin) navLogin.style.display = '';
        if (navRegister) navRegister.style.display = '';
        // Xóa dashboard nếu có
        let navDashboard = document.getElementById('navDashboard');
        if (navDashboard) navDashboard.remove();
        let sideNavDashboard = document.getElementById('sideNavDashboard');
        if (sideNavDashboard) sideNavDashboard.remove();
        // Sidebar: show login/register, remove user info
        if (sidebarLinks) {
            sidebarLinks.querySelectorAll('#sideNavLogin, #sideNavRegister').forEach(e => e.style.display = '');
        }
        sidebarUserBoxWrap.innerHTML = '';
    }
}

function logoutUser() {
    clearUserSession();
    updateAuthUI(null);
    showSection('login');
}

// --- Auto login if cookie exists ---
const userSession = getUserSession();
if (userSession) {
    updateAuthUI(userSession);
    showSection('home');
} else {
    showSection('login');
}

// --- Login/Register logic update ---
function submitLogin(recaptchaToken) {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    fetch(API_HOST + '/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, recaptcha: recaptchaToken })
    })
    .then(res => res.json().then(data => ({ok: res.ok, data})))
    .then(({ok, data}) => {
        if (ok) {
            saveUserSession({ username: data.name || username }, data.token);
            updateAuthUI({ username: data.name || username });
            showSection('home');
        } else {
            alert(data.message || 'Login failed!');
        }
    })
    .catch(() => alert('Lỗi kết nối server!'));
}



// Khi gọi API cần xác thực:
async function getProfile() {
    const token = localStorage.getItem('minvst_token');
    const res = await fetch(API_HOST + '/api/profile', {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await res.json();
    // Xử lý dữ liệu profile...
}


function submitRegister(recaptchaToken) {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const repeatpw = document.getElementById('registerRepeatPassword').value;

    if (password != repeatpw) {
        alert('Mật khẩu nhập lại không khớp!');
        return;
    }

    fetch(API_HOST + '/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, recaptcha: recaptchaToken })
    })
    .then(res => res.json().then(data => ({ok: res.ok, data})))
    .then(({ok, data}) => {
        if (ok) {
            alert('Đăng ký thành công! Vui lòng đăng nhập.');
            showSection('login');
        } else {
            alert(data.message || 'Đăng ký thất bại!');
        }
    })
    .catch(() => alert('Lỗi kết nối server!'));
}


// Light/Dark mode toggle
const themeBtn = document.getElementById('themeToggleBtn');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');

function setTheme(dark) {
    const svgIconDark = `<svg viewBox="0 0 24 24" fill="none" width="20" height="20" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M22 12.0004C22 17.5232 17.5228 22.0004 12 22.0004C10.8358 22.0004 9.71801 21.8014 8.67887 21.4357C8.24138 20.3772 8 19.217 8 18.0004C8 15.7792 8.80467 13.7459 10.1384 12.1762C11.31 13.8818 13.2744 15.0004 15.5 15.0004C17.8615 15.0004 19.9289 13.741 21.0672 11.8572C21.3065 11.4612 22 11.5377 22 12.0004Z" fill="#ff0000"></path> <path d="M2 12C2 16.3586 4.78852 20.0659 8.67887 21.4353C8.24138 20.3768 8 19.2166 8 18C8 15.7788 8.80467 13.7455 10.1384 12.1758C9.42027 11.1303 9 9.86422 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12Z" fill="#ff0000"></path> </g></svg>`;
    const svgIconLight = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.25 19C4.25 18.5858 4.58579 18.25 5 18.25H19C19.4142 18.25 19.75 18.5858 19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H5C4.58579 19.75 4.25 19.4142 4.25 19ZM7.25 22C7.25 21.5858 7.58579 21.25 8 21.25H16C16.4142 21.25 16.75 21.5858 16.75 22C16.75 22.4142 16.4142 22.75 16 22.75H8C7.58579 22.75 7.25 22.4142 7.25 22Z" fill="#ee6868"></path> <path d="M6.08267 15.25C5.5521 14.2858 5.25 13.1778 5.25 12C5.25 8.27208 8.27208 5.25 12 5.25C15.7279 5.25 18.75 8.27208 18.75 12C18.75 13.1778 18.4479 14.2858 17.9173 15.25H22C22.4142 15.25 22.75 15.5858 22.75 16C22.75 16.4142 22.4142 16.75 22 16.75H2C1.58579 16.75 1.25 16.4142 1.25 16C1.25 15.5858 1.58579 15.25 2 15.25H6.08267Z" fill="#ee6868"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V3C12.75 3.41421 12.4142 3.75 12 3.75C11.5858 3.75 11.25 3.41421 11.25 3V2C11.25 1.58579 11.5858 1.25 12 1.25ZM4.39861 4.39861C4.6915 4.10572 5.16638 4.10572 5.45927 4.39861L5.85211 4.79145C6.145 5.08434 6.145 5.55921 5.85211 5.85211C5.55921 6.145 5.08434 6.145 4.79145 5.85211L4.39861 5.45927C4.10572 5.16638 4.10572 4.6915 4.39861 4.39861ZM19.6011 4.39887C19.894 4.69176 19.894 5.16664 19.6011 5.45953L19.2083 5.85237C18.9154 6.14526 18.4405 6.14526 18.1476 5.85237C17.8547 5.55947 17.8547 5.0846 18.1476 4.79171L18.5405 4.39887C18.8334 4.10598 19.3082 4.10598 19.6011 4.39887ZM1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H3C3.41421 11.25 3.75 11.5858 3.75 12C3.75 12.4142 3.41421 12.75 3 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12ZM20.25 12C20.25 11.5858 20.5858 11.25 21 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H21C20.5858 12.75 20.25 12.4142 20.25 12Z" fill="#ee6868"></path> </g></svg>`;
    if (dark) {
        document.body.classList.add('dark');
        document.getElementById('themeIcon').innerHTML = svgIconLight;
        themeText.textContent = 'Light';
        themeBtn.setAttribute('aria-pressed', 'true');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark');
        document.getElementById('themeIcon').innerHTML = svgIconDark;
        themeText.textContent = 'Dark';
        themeBtn.setAttribute('aria-pressed', 'false');
        localStorage.setItem('theme', 'light');
    }
}
themeBtn.addEventListener('click', () => {
    setTheme(!document.body.classList.contains('dark'));
});
// Load mode from localStorage
setTheme(localStorage.getItem('theme') === 'dark');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarNav = document.getElementById('sidebarNav');
const closeSidebar = document.getElementById('closeSidebar');
function openSidebar() {
    sidebarNav.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function hideSidebar() {
    sidebarNav.classList.remove('active');
    document.body.style.overflow = '';
}
sidebarToggle.addEventListener('click', openSidebar);
closeSidebar.addEventListener('click', hideSidebar);
// Đóng sidebar khi click link
Array.from(sidebarNav.querySelectorAll('a')).forEach(link => {
    link.addEventListener('click', function() {
        hideSidebar();
        // Kích hoạt section tương ứng
        const id = this.getAttribute('href').replace('#', '');
        if (sections[id]) showSection(id);
    });
});
document.getElementById('apiSearch').addEventListener('input', function() {
    const q = this.value.trim().toLowerCase();
    document.querySelectorAll('#apiDocList .pm-api-group').forEach(function(group) {
        const tags = group.getAttribute('data-tags') || '';
        const title = group.querySelector('.pm-api-title').textContent.toLowerCase();
        if (!q || tags.includes(q) || title.includes(q)) {
            group.style.display = '';
        } else {
            group.style.display = 'none';
        }
    });
});

document.querySelectorAll('.plan button').forEach(btn => {
    btn.onclick = function() {
        const token = localStorage.getItem('minvst_token');
        if (!token) {
            // Chưa đăng nhập, chuyển sang form login
            showSection('login');
        } else {
            // Đã đăng nhập, chuyển sang dashboard và tab pricing
            window.location.href = "/dashboard#pricing";
        }
    };
});

function renderPricingIndex() {
    fetch('/api/plans')
        .then(res => res.json())
        .then(data => {
            const wrap = document.getElementById('pricingDynamic');
            if (!data.plans || !Array.isArray(data.plans)) {
                wrap.innerHTML = '<div style="color:#888;">Không có dữ liệu gói dịch vụ.</div>';
                return;
            }
            wrap.innerHTML = data.plans.map(group => `
                <div style="background:var(--main-box-bg);border-radius:18px;padding:24px 18px 18px 18px;box-shadow:0 2px 12px rgba(34,34,59,0.07);margin-bottom:32px;">
                    <div style="font-size:1.18em;font-weight:700;color:var(--accent);margin-bottom:18px;">${group.group || ''}</div>
                    <div class="pricing-plans">
                        ${group.plans.map(plan => `
                            <div class="plan${plan.highlight ? ' highlight' : ''}">
                                <h3>${plan.name}</h3>
                                <div class="plan-price">
                                    ${
                                        typeof plan.price === 'number'
                                            ? plan.price.toLocaleString() + 'đ' + (group.pack ? ` <span style="font-size:0.95em;color:#888;">/${group.pack}</span>` : '')
                                            : plan.price
                                    }
                                </div>
                                <ul>
                                    ${Array.isArray(plan.features) ? plan.features.map(f => `<li>${f}</li>`).join('') : ''}
                                </ul>
                                <button type="button">Chọn</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        });
}

// Gọi khi trang load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('pricingDynamic')) renderPricingIndex();
});