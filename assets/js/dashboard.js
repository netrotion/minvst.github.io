let notificationsCache = [];
let notificationsLoaded = false;
let activityChartInstance = null;
let recaptchaToken = null; 
const token = localStorage.getItem('minvst_token');
const sidebarNav = document.getElementById('sidebarNav');

if (!token) {
    window.location.href = "/";
} else {
    fetch('/api/profile', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => {
        if (res.status === 401) {
            window.location.href = "/";
            return null;
        }
        return res.json();
    })
    .then(data => {
        if (data && data.username) {
            document.getElementById('dashboardContent').innerHTML =
                `<div style="margin-bottom:12px;">Xin chào <b>${data.username}</b>!</div>
                <div>Chúc bạn một ngày tốt lành 🎉</div>`;
            // Hiển thị số dư trên header
            document.getElementById('headerCoinVal').textContent = (typeof data.coins !== "undefined" ? data.coins.toLocaleString() : "0");
            document.getElementById('headerScoinVal').textContent = (typeof data.scoins !== "undefined" ? data.scoins.toLocaleString() : "0");
        }
    });
}


// Dark/Light mode
function setTheme(mode) {
    const svgIconDark = `<svg viewBox="0 0 24 24" fill="none" width="20" height="20" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M22 12.0004C22 17.5232 17.5228 22.0004 12 22.0004C10.8358 22.0004 9.71801 21.8014 8.67887 21.4357C8.24138 20.3772 8 19.217 8 18.0004C8 15.7792 8.80467 13.7459 10.1384 12.1762C11.31 13.8818 13.2744 15.0004 15.5 15.0004C17.8615 15.0004 19.9289 13.741 21.0672 11.8572C21.3065 11.4612 22 11.5377 22 12.0004Z" fill="#ff0000"></path> <path d="M2 12C2 16.3586 4.78852 20.0659 8.67887 21.4353C8.24138 20.3768 8 19.2166 8 18C8 15.7788 8.80467 13.7455 10.1384 12.1758C9.42027 11.1303 9 9.86422 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12Z" fill="#ff0000"></path> </g></svg>`;
    const svgIconLight = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M4.25 19C4.25 18.5858 4.58579 18.25 5 18.25H19C19.4142 18.25 19.75 18.5858 19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H5C4.58579 19.75 4.25 19.4142 4.25 19ZM7.25 22C7.25 21.5858 7.58579 21.25 8 21.25H16C16.4142 21.25 16.75 21.5858 16.75 22C16.75 22.4142 16.4142 22.75 16 22.75H8C7.58579 22.75 7.25 22.4142 7.25 22Z" fill="#ee6868"></path> <path d="M6.08267 15.25C5.5521 14.2858 5.25 13.1778 5.25 12C5.25 8.27208 8.27208 5.25 12 5.25C15.7279 5.25 18.75 8.27208 18.75 12C18.75 13.1778 18.4479 14.2858 17.9173 15.25H22C22.4142 15.25 22.75 15.5858 22.75 16C22.75 16.4142 22.4142 16.75 22 16.75H2C1.58579 16.75 1.25 16.4142 1.25 16C1.25 15.5858 1.58579 15.25 2 15.25H6.08267Z" fill="#ee6868"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V3C12.75 3.41421 12.4142 3.75 12 3.75C11.5858 3.75 11.25 3.41421 11.25 3V2C11.25 1.58579 11.5858 1.25 12 1.25ZM4.39861 4.39861C4.6915 4.10572 5.16638 4.10572 5.45927 4.39861L5.85211 4.79145C6.145 5.08434 6.145 5.55921 5.85211 5.85211C5.55921 6.145 5.08434 6.145 4.79145 5.85211L4.39861 5.45927C4.10572 5.16638 4.10572 4.6915 4.39861 4.39861ZM19.6011 4.39887C19.894 4.69176 19.894 5.16664 19.6011 5.45953L19.2083 5.85237C18.9154 6.14526 18.4405 6.14526 18.1476 5.85237C17.8547 5.55947 17.8547 5.0846 18.1476 4.79171L18.5405 4.39887C18.8334 4.10598 19.3082 4.10598 19.6011 4.39887ZM1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H3C3.41421 11.25 3.75 11.5858 3.75 12C3.75 12.4142 3.41421 12.75 3 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12ZM20.25 12C20.25 11.5858 20.5858 11.25 21 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H21C20.5858 12.75 20.25 12.4142 20.25 12Z" fill="#ee6868"></path> </g></svg>`;
    if (mode === 'dark') {
        document.body.classList.add('dark');
        document.getElementById('themeIcon').innerHTML = svgIconLight;
        document.getElementById('themeText').textContent = 'Light';
        localStorage.setItem('minvst_theme', 'dark');
    } else {
        document.body.classList.remove('dark');
        document.getElementById('themeIcon').innerHTML = svgIconDark;
        document.getElementById('themeText').textContent = 'Dark';
        localStorage.setItem('minvst_theme', 'light');
    }
}
(function() {
    const theme = localStorage.getItem('minvst_theme') || 'light';
    setTheme(theme);
})();

// --- Dashboard logic ---
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
// Kiểm tra đăng nhập (token)
function setDashboardTitle(title, iconSvg) {
    const titleElem = document.querySelector('.dashboard-card .dashboard-title');
    if (titleElem) {
        // Nếu có iconSvg thì thay icon, nếu không thì chỉ thay text
        if (iconSvg) {
            titleElem.innerHTML = iconSvg + title;
        } else {
            titleElem.textContent = title;
        }
    }
}
function notify(msg, type = "info", timeout = 3200) {
    let box = document.getElementById('notifyBox');
    if (!box) {
        box = document.createElement('div');
        box.id = 'notifyBox';
        box.style.position = 'fixed';
        box.style.top = '30px';
        box.style.right = '30px';
        box.style.zIndex = '99999';
        box.style.display = 'flex';
        box.style.flexDirection = 'column';
        box.style.gap = '12px';
        document.body.appendChild(box);
    }
    const toast = document.createElement('div');
    toast.className = 'notify-toast ' + type;
    toast.innerHTML = `
        <span>${msg}</span>
        <button class="close-btn" onclick="this.parentElement.remove()">&times;</button>
    `;
    box.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => toast.remove(), 400);
    }, timeout);
}
function renderTemplate(templateId) {
    const tpl = document.getElementById(templateId);
    if (!tpl) return;
    const dashContent = document.getElementById('dashboardContent');
    dashContent.innerHTML = '';
    const tempDiv = document.createElement('div');
    tempDiv.className = 'fade-slide';
    tempDiv.appendChild(tpl.content.cloneNode(true));
    dashContent.appendChild(tempDiv);
    setTimeout(() => {
        tempDiv.classList.add('active');
    }, 20);
}
function renderInfoContent() {
        setDashboardTitle('Info', '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM12 17.75C12.4142 17.75 12.75 17.4142 12.75 17V11C12.75 10.5858 12.4142 10.25 12 10.25C11.5858 10.25 11.25 10.5858 11.25 11V17C11.25 17.4142 11.5858 17.75 12 17.75ZM12 7C12.5523 7 13 7.44772 13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7Z" fill="#6366f1"></path> </g></svg>');
        renderTemplate('infoTemplate');
        // Lấy thông tin user nếu cần
        fetch('/api/profile', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
        // Thông tin user
        document.getElementById('userInfoLoading').innerHTML = `<b>${data.username}</b>`;
        document.getElementById('userBalance').innerHTML = `
            <div style="display:flex;gap:18px;align-items:center;justify-content:center;">
                <span style="display:flex;align-items:center;gap:6px;font-weight:600;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="#fbbf24" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;">
                        <circle cx="10" cy="10" r="9" stroke="#f59e42" stroke-width="2" fill="#fde68a"/>
                        <text x="10" y="15" text-anchor="middle" font-size="11" fill="#f59e42" font-weight="bold">C</text>
                    </svg>
                    ${(typeof data.coins !== "undefined" ? data.coins.toLocaleString() : "0")}
                </span>
                <span style="display:flex;align-items:center;gap:6px;font-weight:600;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="#38bdf8" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;">
                        <circle cx="10" cy="10" r="9" stroke="#0ea5e9" stroke-width="2" fill="#bae6fd"/>
                        <text x="10" y="15" text-anchor="middle" font-size="11" fill="#0ea5e9" font-weight="bold">S</text>
                    </svg>
                    ${(typeof data.scoins !== "undefined" ? data.scoins.toLocaleString() : "0")}
                </span>
            </div>
        `;
        // Giỏ hàng table
        const tbody = document.querySelector('#userCartTable tbody');
        if (data.purchased_items && data.purchased_items.length > 0) {
            tbody.innerHTML = data.purchased_items.map(item =>
                `<tr>
                    <td style="padding:10px 8px;">${item.name}</td>
                    <td style="padding:10px 8px;text-align:right;">${item.price !== null ? item.price.toLocaleString() + ' VND' : '-'}</td>
                </tr>`
            ).join('');
        } else {
            tbody.innerHTML = `<tr><td colspan="2" style="padding:10px 8px;text-align:center;color:#888;">Chưa có mặt hàng nào.</td></tr>`;
        }
        // Lịch sử đăng nhập
        const loginTbody = document.getElementById('loginHistoryBody');
        if (data.login_history && data.login_history.length > 0) {
            loginTbody.innerHTML = data.login_history.slice().reverse().map(item =>
                `<tr>
                    <td style="padding:10px 8px;">${item.device}</td>
                    <td style="padding:10px 8px;text-align:right;">${item.time}</td>
                </tr>`
            ).join('');
        } else {
            loginTbody.innerHTML = `<tr><td colspan="2" style="padding:10px 8px;text-align:center;color:#888;">Không có dữ liệu.</td></tr>`;
        }
        // Lịch sử hoạt động
        const actTbody = document.getElementById('activityHistoryBody');
        if (data.activity_history && data.activity_history.length > 0) {
            actTbody.innerHTML = data.activity_history.slice().reverse().map(item =>
                `<tr>
                    <td style="padding:10px 8px;">${item.content || item.details}</td>
                    <td style="padding:10px 8px;text-align:right;">${item.time || item.timestamp}</td>
                </tr>`
            ).join('');
        } else {
            actTbody.innerHTML = `<tr><td colspan="2" style="padding:10px 8px;text-align:center;color:#888;">Không có dữ liệu.</td></tr>`;
        }
        const now = new Date();
const year = now.getFullYear();
const month = now.getMonth(); // 0-based
const daysInMonth = new Date(year, month + 1, 0).getDate();

// Sinh mảng ngày: ["2025-06-01", ..., "2025-06-30"]
const labels = [];
for (let d = 1; d <= daysInMonth; d++) {
    labels.push(String(d));
}

// Đếm số hoạt động mỗi ngày
const activityByDay = {};
(data.activity_history || []).forEach(item => {
    // Lấy ngày trong tháng (số) từ chuỗi YYYY-MM-DD
    if (item.time) {
        const day = Number(item.time.slice(8, 10)); // Lấy 2 ký tự cuối là ngày
        if (day) activityByDay[day] = (activityByDay[day] || 0) + 1;
    }
});
const counts = labels.map(day => activityByDay[Number(day)] || 0);
        const canvas = document.getElementById('activityChart');
const ctx = canvas.getContext('2d');

// Tạo gradient một lần
const gradient = ctx.createLinearGradient(0, 0, 0, 200);
gradient.addColorStop(0, 'rgba(99,102,241,0.85)');
gradient.addColorStop(1, 'rgba(99,102,241,0.18)');

if (activityChartInstance) activityChartInstance.destroy();
activityChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Số hoạt động',
            data: counts,
            backgroundColor: gradient, // <-- truyền trực tiếp gradient
            borderRadius: 8,
            borderSkipped: false,
            hoverBackgroundColor: 'rgba(99,102,241,1)',
            barPercentage: 0.7,
            categoryPercentage: 0.7
        }]
    },
    options: {
        responsive: true,
        animation: {
            duration: 900,
            easing: 'easeOutQuart'
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#23272f',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#6366f1',
                borderWidth: 1
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#6366f1', font: { weight: 600 } }
            },
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1, color: '#6366f1', font: { weight: 600 } },
                grid: { color: 'rgba(99,102,241,0.08)' }
            }
        }
    }
});
    });
}
function renderShopContent() {
    setDashboardTitle('Tạp hoá', `<svg width="28" height="28" viewBox="9 -3 10 20" fill="none"><circle cx="7" cy="16" r="1.5" fill="#6366f1"/><circle cx="15" cy="16" r="1.5" fill="#6366f1"/><path d="M3 4h2l2.5 9h7l2-6H6" stroke="#6366f1" stroke-width="2" stroke-linecap="round"/></svg>`);
    renderTemplate('shopTemplate');
    const token = localStorage.getItem('minvst_token') || '';
    const notice = document.getElementById('shopNotice');
    const list = document.getElementById('shopCategoryList');
    const search = document.getElementById('shopSearchInput');
    const modal = document.getElementById('shopModal');
    const modalContent = document.getElementById('shopModalContent');
    const modalClose = document.getElementById('shopModalClose');

    // Custom dropdown filter
    const dropdown = document.getElementById('shopCustomDropdown');
    const btn = document.getElementById('shopDropdownBtn');
    const dropdownList = document.getElementById('shopDropdownList');
    let currentCategory = '';

    notice.textContent = 'Đang tải danh mục...';

    fetch('/api/shop/categories', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
        if (!data.categories || !Array.isArray(data.categories) || data.categories.length === 0) {
            notice.textContent = 'Không có sản phẩm nào!';
            list.innerHTML = '';
            return;
        } else {
            notice.textContent = '';
        }

        // Render dropdown filter
        function renderDropdown(categories) {
            dropdownList.innerHTML = `<button class="dropdown-item${currentCategory === '' ? ' active' : ''}" data-value="">Tất cả chuyên mục</button>` +
                categories.map(cat =>
                    `<button class="dropdown-item${currentCategory === cat.category ? ' active' : ''}" data-value="${cat.category}">${cat.category}</button>`
                ).join('');
        }
        renderDropdown(data.categories);

        // Dropdown toggle
        btn.onclick = function(e) {
            dropdown.classList.toggle('open');
            e.stopPropagation();
        };
        // Đóng dropdown khi click ngoài
        document.addEventListener('click', () => dropdown.classList.remove('open'));
        // Chọn chuyên mục
        dropdownList.onclick = function(e) {
            if (e.target.classList.contains('dropdown-item')) {
                currentCategory = e.target.getAttribute('data-value');
                btn.textContent = currentCategory || 'Tất cả chuyên mục';
                renderDropdown(data.categories);
                dropdown.classList.remove('open');
                renderShopItems();
            }
        };

        // Render function
        function renderShopItems() {
            const catVal = currentCategory;
            const searchVal = search ? search.value.trim().toLowerCase() : '';
            let cats = data.categories;
            if (catVal) cats = cats.filter(c => c.category === catVal);
            // Lọc sản phẩm theo search
            cats = cats.map(cat => ({
                ...cat,
                products: cat.products.filter(p =>
                    (!searchVal || p.name.toLowerCase().includes(searchVal))
                )
            })).filter(cat => cat.products.length > 0);

            if (cats.length === 0) {
                list.innerHTML = `<div style="color:#888;font-size:1.1em;padding:32px 0;">Không tìm thấy mặt hàng phù hợp.</div>`;
                return;
            }
            list.innerHTML = cats.map(cat => `
                <div class="shop-whitebox">
                    <div class="shop-whitebox-title">${cat.category}</div>
                    <div class="shop-items-list">
                        ${cat.products.map(prod => `
                            <div class="shop-item-card" tabindex="0">
                                <div class="shop-item-info">
                                    <div class="shop-item-name">${prod.name}</div>
                                    <div class="shop-item-price">
                                        ${prod.coin && prod.coin > 0 ? prod.coin.toLocaleString() + ' <svg width="16" height="16" viewBox="0 0 20 20" fill="#fbbf24" style="vertical-align:middle;position:relative;top:2px;"><circle cx="10" cy="10" r="9" stroke="#f59e42" stroke-width="2" fill="#fde68a"/><text x="10" y="15" text-anchor="middle" font-size="11" fill="#f59e42" font-weight="bold">C</text></svg>' : ''}
                                            ${prod.scoin && prod.scoin > 0 ? ' <br>' + prod.scoin.toLocaleString() + ' <svg width="16" height="16" viewBox="0 0 20 20" fill="#38bdf8" style="vertical-align:middle;position:relative;top:2px;"><circle cx="10" cy="10" r="9" stroke="#0ea5e9" stroke-width="2" fill="#bae6fd"/><text x="10" y="15" text-anchor="middle" font-size="11" fill="#0ea5e9" font-weight="bold">S</text></svg></br>' : ''}
                                    </div>
                                    <div class="shop-item-stock">Còn lại: <b>${prod.stock !== undefined ? prod.stock : (prod.quantity !== undefined ? prod.quantity : '∞')}</b></div>
                                </div>
                                <button class="shopBuyBtn" data-name="${prod.name}">Mua</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
            if (cats.length <= 2) {
                list.style.justifyContent = 'center';
            } else {
                list.style.justifyContent = '';
            }
            // Gắn sự kiện xem chi tiết
            Array.from(list.querySelectorAll('.shop-item-card')).forEach(card => {
                card.onclick = function(e) {
                    if (e.target.classList.contains('shopBuyBtn')) return; // Không mở modal khi bấm nút mua
                    const name = card.querySelector('.shopBuyBtn').getAttribute('data-name');
                    let prod, catName;
                    for (const cat of cats) {
                        prod = cat.products.find(p => p.name === name);
                        if (prod) { catName = cat.category; break; }
                    }
                    if (!prod) return;
                    modalContent.innerHTML = `
                        <div style="font-size:1.18em;font-weight:700;color:var(--accent);margin-bottom:8px;">${prod.name}</div>
                        <div style="font-size:1.05em;font-weight:500;margin-bottom:8px;">
                            Giá :
                            ${prod.coin && prod.coin > 0 ? prod.coin.toLocaleString() + ' <svg width="16" height="16" viewBox="0 0 20 20" fill="#fbbf24" style="vertical-align:middle;position:relative;top:2px;"><circle cx="10" cy="10" r="9" stroke="#f59e42" stroke-width="2" fill="#fde68a"/><text x="10" y="15" text-anchor="middle" font-size="11" fill="#f59e42" font-weight="bold">C</text></svg>' : ''}
                            ${prod.scoin && prod.scoin > 0 ? '<br>Hoặc : ' + prod.scoin.toLocaleString() + ' <svg width="16" height="16" viewBox="0 0 20 20" fill="#38bdf8" style="vertical-align:middle;position:relative;top:2px;"><circle cx="10" cy="10" r="9" stroke="#0ea5e9" stroke-width="2" fill="#bae6fd"/><text x="10" y="15" text-anchor="middle" font-size="11" fill="#0ea5e9" font-weight="bold">S</text></svg></br>' : ''}
                        </div>
                        <div style="font-size:0.97em;color:#888;margin-bottom:8px;">Chuyên mục: <b>${catName}</b></div>
                        <div style="margin-bottom:10px;">
                            <ul style="padding-left:18px;text-align:left;">
                                ${(Array.isArray(prod.features) ? prod.features.map(f => `<li>${f}</li>`).join('') : '')}
                            </ul>
                        </div>
                        <div style="font-size:0.97em;color:#888;">Còn lại: <b>${prod.stock !== undefined ? prod.stock : (prod.quantity !== undefined ? prod.quantity : '∞')}</b></div>
                        <button class="shopBuyBtn" data-name="${prod.name}" style="margin-top:18px;background:var(--accent);color:#fff;font-weight:600;padding:10px 28px;border-radius:7px;border:none;cursor:pointer;">Mua ngay</button>
                    `;
                    modal.style.display = 'flex';
                    // Gắn sự kiện mua trong modal
                    modalContent.querySelector('.shopBuyBtn').onclick = function() {
                        if (!confirm(`Bạn chắc chắn muốn mua "${prod.name}"?`)) return;
                        this.disabled = true;
                        this.textContent = 'Đang xử lý...';
                        fetch('/api/shop/buy', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + token
                            },
                            body: JSON.stringify({ name: prod.name })
                        })
                        .then(res => res.json())
                        .then(resp => {
                            this.disabled = false;
                            this.textContent = 'Mua ngay';
                            notice.textContent = resp.message;
                            if (resp.success) {
                                this.textContent = 'Đã mua';
                                this.disabled = true;
                                setTimeout(() => { modal.style.display = 'none'; renderShopContent(); }, 1200);
                            }
                        })
                        .catch(() => {
                            this.disabled = false;
                            this.textContent = 'Mua ngay';
                            notice.textContent = 'Có lỗi xảy ra, thử lại!';
                        });
                    };
                };
            });
            // Gắn sự kiện mua ngoài card
            Array.from(list.querySelectorAll('.shopBuyBtn')).forEach(btn => {
                btn.onclick = function(e) {
                    e.stopPropagation();
                    const name = btn.getAttribute('data-name');
                    if (!confirm(`Bạn chắc chắn muốn mua "${name}"?`)) return;
                    btn.disabled = true;
                    btn.textContent = 'Đang xử lý...';
                    fetch('/api/shop/buy', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify({ name })
                    })
                    .then(res => res.json())
                    .then(resp => {
                        btn.disabled = false;
                        btn.textContent = 'Mua';
                        notice.textContent = resp.message;
                        if (resp.success) {
                            btn.textContent = 'Đã mua';
                            btn.disabled = true;
                            setTimeout(renderShopContent, 1200);
                        }
                    })
                    .catch(() => {
                        btn.disabled = false;
                        btn.textContent = 'Mua';
                        notice.textContent = 'Có lỗi xảy ra, thử lại!';
                    });
                };
            });
        }
        renderShopItems();
        if (search) search.oninput = renderShopItems;
    });

    // Modal close
    document.getElementById('shopModalClose').onclick = function() {
        modal.style.display = 'none';
    };
    document.getElementById('shopModal').onclick = function(e) {
        if (e.target === modal) modal.style.display = 'none';
    };
}
function renderRechargeContent() {
    setDashboardTitle('Nạp tiền', /* ...icon... */);
    renderTemplate('rechargeTemplate');
    const form = document.getElementById('rechargeForm');
    const result = document.getElementById('rechargeResult');
    const dropdown = document.getElementById('rechargeDropdown');
    const btn = document.getElementById('rechargeDropdownBtn');
    const list = document.getElementById('rechargeDropdownList');
    const hiddenInput = document.getElementById('rechargeAmount');
    const qtyInput = document.getElementById('rechargeQty');
    const scoinElem = document.getElementById('rechargeScoin');
    const coinElem = document.getElementById('rechargeCoin');
    const totalElem = document.getElementById('rechargeTotal');

    function updateSummary() {
        const amount = Number(hiddenInput.value);
        const qty = Number(qtyInput.value) || 1;
        const scoin = Math.floor(amount / 10000 * 10 * qty);
        const coin = Math.floor(amount / 10000 * 1000 * qty);
        const total = amount * qty;
        scoinElem.textContent = scoin.toLocaleString();
        coinElem.textContent = coin.toLocaleString();
        totalElem.textContent = total.toLocaleString();
    }
    updateSummary();

    btn.onclick = function(e) {
        dropdown.classList.toggle('open');
        e.stopPropagation();
    };
    document.addEventListener('click', () => dropdown.classList.remove('open'));
    list.onclick = function(e) {
        if (e.target.classList.contains('dropdown-item')) {
            btn.textContent = e.target.textContent;
            hiddenInput.value = e.target.getAttribute('data-value');
            Array.from(list.children).forEach(item => item.classList.remove('active'));
            e.target.classList.add('active');
            dropdown.classList.remove('open');
            updateSummary();
        }
    };
    qtyInput.oninput = updateSummary;

    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const amount = Number(hiddenInput.value);
            const qty = Number(qtyInput.value);
            if (qty < 1) {
                result.textContent = "Số lượng phải lớn hơn 0!";
                return;
            }
            let username = localStorage.getItem('minvst_user');
            function doRecharge(username) {
                const timestamps = Math.floor(Date.now() / 1000);
                const taskRaw = `${username}.${amount / 10000}.${qty}.${timestamps}`;
                const taskID = btoa(taskRaw);
                const payload = {
                    taskID: taskID,
                    username: username,
                    money: amount,
                    count: qty
                };
                result.textContent = "Đang xử lý...";
                fetch('/api/recharge', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + (localStorage.getItem('minvst_token') || '')
                    },
                    body: JSON.stringify(payload)
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        showRechargeWaiting(amount, qty, data.transfer_content);
                    } else {
                        result.style.color = "#ef4444";
                        result.textContent = data.message || "Nạp thất bại!";
                    }
                })
                .catch(() => {
                    result.style.color = "#ef4444";
                    result.textContent = "Có lỗi xảy ra, thử lại!";
                });
            }
            if (username) {
                doRecharge(username);
            } else {
                fetch('/api/profile', {
                    headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('minvst_token') || '') }
                })
                .then(res => res.json())
                .then(data => {
                    username = data.username || '';
                    localStorage.setItem('minvst_user', username);
                    doRecharge(username);
                });
            }
        };
    }
}
// ...existing code...
function showRechargeWaiting(amount, qty, transferContent) {
    title = 'Quét qr';
    setDashboardTitle(title, `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M16.5249 2H16.5932C17.477 1.99999 18.1897 1.99999 18.7635 2.05454C19.3552 2.1108 19.8707 2.22996 20.3343 2.51405C20.8037 2.80168 21.1983 3.19632 21.486 3.6657C21.77 4.12929 21.8892 4.64482 21.9455 5.23653C22 5.8103 22 6.52304 22 7.40683V7.47517C22 8.05587 22 8.54048 21.9626 8.9341C21.9235 9.34559 21.8386 9.72907 21.623 10.0808C21.4121 10.425 21.1227 10.7144 20.7785 10.9254C20.4267 11.1409 20.0433 11.2258 19.6318 11.2649C19.2382 11.3024 18.7535 11.3023 18.1728 11.3023L17.0679 11.3023C16.2321 11.3024 15.5352 11.3024 14.9819 11.228C14.3979 11.1495 13.8706 10.9768 13.4469 10.5531C13.0232 10.1294 12.8505 9.60212 12.772 9.01812C12.6976 8.46484 12.6976 7.76789 12.6977 6.93209L12.6977 5.82725C12.6977 5.24654 12.6976 4.76185 12.7351 4.36823C12.7742 3.95674 12.8591 3.57325 13.0746 3.22152C13.2856 2.87731 13.575 2.5879 13.9192 2.37697C14.2709 2.16142 14.6544 2.07653 15.0659 2.0374C15.4595 1.99998 15.9442 1.99999 16.5249 2ZM17.3488 7.81395C16.8694 7.81395 16.6297 7.81395 16.4604 7.69385C16.4007 7.65148 16.3485 7.59933 16.3061 7.5396C16.186 7.37034 16.186 7.13061 16.186 6.65117C16.186 6.17173 16.186 5.93199 16.3061 5.76273C16.3485 5.703 16.4007 5.65085 16.4604 5.60847C16.6297 5.48837 16.8694 5.48837 17.3488 5.48837C17.8283 5.48837 18.068 5.48837 18.2373 5.60847C18.297 5.65085 18.3491 5.703 18.3915 5.76273C18.5116 5.93199 18.5116 6.17171 18.5116 6.65116C18.5116 7.13061 18.5116 7.37034 18.3915 7.5396C18.3491 7.59933 18.297 7.65148 18.2373 7.69385C18.068 7.81395 17.8283 7.81395 17.3488 7.81395Z" fill="#6366f1"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.0808 2.37697C9.72907 2.16142 9.34559 2.07653 8.9341 2.0374C8.54047 1.99998 8.05583 1.99999 7.4751 2H7.40684C6.52307 1.99999 5.81029 1.99999 5.23653 2.05454C4.64482 2.1108 4.12929 2.22996 3.6657 2.51405C3.19632 2.80168 2.80168 3.19632 2.51405 3.6657C2.22996 4.12929 2.1108 4.64482 2.05454 5.23653C1.99999 5.81029 1.99999 6.52302 2 7.40679V7.47506C1.99999 8.05579 1.99998 8.54047 2.0374 8.9341C2.07653 9.34559 2.16142 9.72907 2.37697 10.0808C2.5879 10.425 2.87731 10.7144 3.22152 10.9254C3.57325 11.1409 3.95674 11.2258 4.36823 11.2649C4.76183 11.3024 5.24643 11.3023 5.82711 11.3023L6.93209 11.3023C7.76787 11.3024 8.46484 11.3024 9.01812 11.228C9.60212 11.1495 10.1294 10.9768 10.5531 10.5531C10.9768 10.1294 11.1495 9.60212 11.228 9.01812C11.3024 8.46484 11.3024 7.7679 11.3023 6.93212L11.3023 5.82726C11.3023 5.24658 11.3024 4.76183 11.2649 4.36823C11.2258 3.95674 11.1409 3.57325 10.9254 3.22152C10.7144 2.87731 10.425 2.5879 10.0808 2.37697ZM5.76273 7.69385C5.93199 7.81395 6.17171 7.81395 6.65116 7.81395C7.13061 7.81395 7.37034 7.81395 7.5396 7.69385C7.59933 7.65148 7.65148 7.59933 7.69385 7.5396C7.81395 7.37034 7.81395 7.13061 7.81395 6.65116C7.81395 6.17171 7.81395 5.93199 7.69385 5.76273C7.65148 5.703 7.59933 5.65085 7.5396 5.60847C7.37034 5.48837 7.13061 5.48837 6.65116 5.48837C6.17171 5.48837 5.93199 5.48837 5.76273 5.60847C5.703 5.65085 5.65085 5.703 5.60847 5.76273C5.48837 5.93199 5.48837 6.17171 5.48837 6.65116C5.48837 7.13061 5.48837 7.37034 5.60847 7.5396C5.65085 7.59933 5.703 7.65148 5.76273 7.69385Z" fill="#6366f1"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M9.01812 12.772C9.60212 12.8505 10.1294 13.0232 10.5531 13.4469C10.9768 13.8706 11.1495 14.3979 11.228 14.9819C11.3024 15.5352 11.3024 16.2321 11.3023 17.0679L11.3023 18.1728C11.3023 18.7535 11.3024 19.2382 11.2649 19.6318C11.2258 20.0433 11.1409 20.4267 10.9254 20.7785C10.7144 21.1227 10.425 21.4121 10.0808 21.623C9.72907 21.8386 9.34559 21.9235 8.9341 21.9626C8.54048 22 8.05577 22 7.47507 22H7.40683C6.52304 22 5.8103 22 5.23653 21.9455C4.64482 21.8892 4.12929 21.77 3.6657 21.486C3.19632 21.1983 2.80168 20.8037 2.51405 20.3343C2.22996 19.8707 2.1108 19.3552 2.05454 18.7635C1.99999 18.1897 1.99999 17.477 2 16.5932V16.5249C1.99999 15.9442 1.99998 15.4595 2.0374 15.0659C2.07653 14.6544 2.16142 14.2709 2.37697 13.9192C2.5879 13.575 2.87731 13.2856 3.22152 13.0746C3.57325 12.8591 3.95674 12.7742 4.36823 12.7351C4.76184 12.6976 5.24648 12.6977 5.82717 12.6977L6.93209 12.6977C7.76789 12.6976 8.46484 12.6976 9.01812 12.772ZM6.65116 18.5116C6.17171 18.5116 5.93199 18.5116 5.76273 18.3915C5.703 18.3491 5.65085 18.297 5.60847 18.2373C5.48837 18.068 5.48837 17.8283 5.48837 17.3488C5.48837 16.8694 5.48837 16.6297 5.60847 16.4604C5.65085 16.4007 5.703 16.3485 5.76273 16.3061C5.93199 16.186 6.17171 16.186 6.65115 16.186C7.13059 16.186 7.37034 16.186 7.5396 16.3061C7.59933 16.3485 7.65148 16.4007 7.69385 16.4604C7.81395 16.6297 7.81395 16.8694 7.81395 17.3488C7.81395 17.8283 7.81395 18.068 7.69385 18.2373C7.65148 18.297 7.59933 18.3491 7.5396 18.3915C7.37034 18.5116 7.13061 18.5116 6.65116 18.5116Z" fill="#6366f1"></path> <path d="M12.6977 16.6155V16.6512H14.093C14.093 15.9834 14.0939 15.5351 14.1286 15.1933C14.1622 14.8632 14.2216 14.7107 14.289 14.6098C14.3738 14.4828 14.4828 14.3738 14.6098 14.289C14.7107 14.2216 14.8632 14.1622 15.1933 14.1286C15.5351 14.0939 15.9834 14.093 16.6512 14.093H18.5116V12.6977H16.6155C15.9926 12.6977 15.4729 12.6976 15.0521 12.7404C14.6117 12.7853 14.203 12.8827 13.8346 13.1288C13.5553 13.3154 13.3154 13.5553 13.1288 13.8346C12.8827 14.203 12.7853 14.6117 12.7404 15.0521C12.6976 15.4729 12.6977 15.9926 12.6977 16.6155Z" fill="#6366f1"></path> <path d="M22 18.5351V18.5116H20.6046C20.6046 18.9546 20.6043 19.2519 20.5886 19.4821C20.5733 19.706 20.5459 19.8151 20.5161 19.8868C20.3981 20.1718 20.1718 20.3981 19.8868 20.5161C19.8151 20.5459 19.706 20.5733 19.4821 20.5886C19.2519 20.6043 18.9546 20.6046 18.5116 20.6046H16.6512V22H18.5351C18.9486 22 19.2937 22 19.5771 21.9807C19.8721 21.9606 20.1507 21.9172 20.4208 21.8053C21.0476 21.5456 21.5456 21.0476 21.8053 20.4208C21.9172 20.1507 21.9606 19.8721 21.9807 19.5771C22 19.2937 22 18.9486 22 18.5351Z" fill="#6366f1"></path> <path d="M14.093 21.3023C14.093 21.6876 13.7807 22 13.3953 22C13.01 22 12.6977 21.6876 12.6977 21.3023V18.5116H14.093V21.3023Z" fill="#6366f1"></path> <path d="M21.3023 12.6977C20.917 12.6977 20.6046 13.01 20.6046 13.3953V16.6512H22V13.3953C22 13.01 21.6876 12.6977 21.3023 12.6977Z" fill="#6366f1"></path> <path d="M16.0761 16.6173C16 16.8011 16 17.0341 16 17.5C16 17.9659 16 18.1989 16.0761 18.3827C16.1776 18.6277 16.3723 18.8224 16.6173 18.9239C16.8011 19 17.0341 19 17.5 19C17.9659 19 18.1989 19 18.3827 18.9239C18.6277 18.8224 18.8224 18.6277 18.9239 18.3827C19 18.1989 19 17.9659 19 17.5C19 17.0341 19 16.8011 18.9239 16.6173C18.8224 16.3723 18.6277 16.1776 18.3827 16.0761C18.1989 16 17.9659 16 17.5 16C17.0341 16 16.8011 16 16.6173 16.0761C16.3723 16.1776 16.1776 16.3723 16.0761 16.6173Z" fill="#6366f1"></path> </g></svg>`);
    const dashboardContent = document.getElementById('dashboardContent');
    const tpl = document.getElementById('rechargeWaitingTemplate');
    dashboardContent.innerHTML = '';
    const node = tpl.content.cloneNode(true);

    // Thông tin động
    const bankAccount = "1057236828";
    const accountName = "LÊ VIỆT HÙNG";
    const bankName = "Vietcombank";
    const moneyStr = (amount * qty).toLocaleString() + " VNĐ";
    const qrImg = `https://img.vietqr.io/image/VCB-${bankAccount}-FLfZOkd.jpg?amount=${amount * qty}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(accountName)}`;

    node.getElementById('qrImage').src = qrImg;
    node.getElementById('copySTK1').textContent = bankAccount;
    node.getElementById('name').textContent = accountName;
    node.getElementById('bank_name').textContent = bankName;
    node.getElementById('amount').textContent = moneyStr;
    node.getElementById('copyNoiDung1').textContent = transferContent;
    dashboardContent.appendChild(node);

    // Gắn lại sự kiện copy và lưu QR
    setTimeout(() => {
        new ClipboardJS('.copy');
        document.getElementById('saveQRBtn').onclick = function() {
            const img = document.getElementById('qrImage');
            fetch(img.src)
                .then(res => res.blob())
                .then(blob => {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'qr-code.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                });
        };
    }, 100);

    if (!window.rechargeIntervalRunning) {
        window.rechargeIntervalRunning = true;
        let interval = setInterval(() => {
            const titleElem = document.querySelector('.dashboard-card .dashboard-title');
            if (!titleElem || !titleElem.textContent.includes(title)) {
                clearInterval(interval);
                window.rechargeIntervalRunning = false;
                return;
            }

            fetch('/api/recharge/status?taskID=' + encodeURIComponent(transferContent), {
                headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('minvst_token') || '') }
            })
            .then(res => res.json())
            .then(statusData => {
                if (statusData.status === 'ok') {
                    clearInterval(interval);
                    window.rechargeIntervalRunning = false;
                    dashboardContent.querySelector('#rechargeWait').style.color = "#22c55e";
                    dashboardContent.querySelector('#rechargeWait').textContent = "Nạp tiền thành công!";
                }
            });
        }, 5000);
    }

}
function renderTokenContent() {
        setDashboardTitle('API Token');
        renderTemplate('tokenTemplate');
        setTimeout(() => {
            const tokenVal = localStorage.getItem('minvst_token') || 'Không tìm thấy token!';
            document.getElementById('tokenBox').textContent = tokenVal;
            document.getElementById('copyTokenBtn').onclick = function() {
                navigator.clipboard.writeText(tokenVal);
                document.getElementById('copyResult').textContent = "Đã copy!";
            };
        }, 200);
    }
function renderPricingContent() {
    setDashboardTitle('Pricing', '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M2 8C2 5.79086 3.79086 4 6 4H18C20.2091 4 22 5.79086 22 8V8.5C22 8.77614 21.7761 9 21.5 9L2.5 9C2.22386 9 2 8.77614 2 8.5V8ZM2.5 11C2.22386 11 2 11.2239 2 11.5V16C2 18.2091 3.79086 20 6 20H18C20.2091 20 22 18.2091 22 16V11.5C22 11.2239 21.7761 11 21.5 11L2.5 11ZM13 15C13 14.4477 13.4477 14 14 14H17C17.5523 14 18 14.4477 18 15C18 15.5523 17.5523 16 17 16H14C13.4477 16 13 15.5523 13 15Z" fill="#6366f1"></path> </g></svg>');
    renderTemplate('pricingTemplate');
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
                    <div style="font-size:1.18em;font-weight:700;color:var(--accent);margin-bottom:18px;">${group.group}</div>
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
function renderHelpContent() {
        setDashboardTitle('Hướng dẫn');
        renderTemplate('helpTemplate');
    }
function renderDownloadContent() {
    setDashboardTitle('Download', `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" style="vertical-align:middle;margin-right:8px;">
            <path d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z" fill="#6366f1"></path>
            <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" fill="#6366f1"></path>
        </svg>`);
    renderTemplate('downloadTemplate');
}
function fetchNotifications(showPopup = false) {
    const token = localStorage.getItem('minvst_token');
    if (!token) return;
    fetch('/api/notifications', {
        headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(data => {
        notificationsCache = Array.isArray(data.notifications) ? data.notifications : [];
        notificationsLoaded = true;
        updateNotifyDot();
        if (showPopup) showNotificationPopup();
    });
}
function updateNotifyDot() {
    const dot = document.getElementById('notifyDot');
    if (notificationsCache.length > 0) {
        dot.style.display = '';
    } else {
        dot.style.display = 'none';
    }
}
function showNotificationPopup() {
    // Xoá popup cũ nếu có
    let old = document.getElementById('notificationPopup');
    if (old) old.remove();

    const tpl = document.getElementById('notificationPopupTemplate');
    const node = tpl.content.cloneNode(true);
    document.body.appendChild(node);

    const list = document.getElementById('notificationPopupList');
    if (notificationsCache.length === 0) {
        list.innerHTML = `<div style="color:#888;text-align:center;padding:18px;">Không có thông báo nào.</div>`;
    } else {
        list.innerHTML = notificationsCache.map(noti => `
            <div class="notification-item ${noti.type || 'info'}">
                <span class="noti-icon">
                    ${noti.type === 'success' ? '<i class="fa fa-check-circle" style="color:#22c55e"></i>' :
                      noti.type === 'error' ? '<i class="fa fa-times-circle" style="color:#ef4444"></i>' :
                      '<i class="fa fa-info-circle" style="color:#6366f1"></i>'}
                </span>
                <span>${noti.msg}</span>
            </div>
        `).join('');
    }
    document.getElementById('closeNotifyPopup').onclick = function() {
        document.getElementById('notificationPopup').remove();
    };
    // Đóng popup khi click ra ngoài
    setTimeout(() => {
        document.addEventListener('mousedown', closeNotifyPopupOutside);
    }, 50);
}
function closeNotifyPopupOutside(e) {
    const popup = document.getElementById('notificationPopup');
    if (popup && !popup.contains(e.target)) {
        popup.remove();
        document.removeEventListener('mousedown', closeNotifyPopupOutside);
    }
}
document.getElementById('themeToggleBtn').onclick = function() {
    setTheme(document.body.classList.contains('dark') ? 'light' : 'dark');
};
document.getElementById('logoutBtn').onclick = function() {
    fetch('/api/logout', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('minvst_token') || '') }
    }).finally(() => {
        setCookie('minvst_user', '', -1);
        localStorage.removeItem('minvst_token');
        window.location.href = "/";
    });
};
document.getElementById('headerNotifyBtn').onclick = function() {
    if (!notificationsLoaded) {
        fetchNotifications(true);
    } else {
        showNotificationPopup();
    }
};
// Sidebar toggle
document.getElementById('sidebarToggle').onclick = function() {
    sidebarNav.classList.add('active');
};
document.getElementById('closeSidebar').onclick = function() {
    sidebarNav.classList.remove('active');
};
document.getElementById('sideNavHome').onclick = function(e) {
    e.preventDefault();
    sidebarNav.classList.remove('active');
    renderInfoContent();
};
document.getElementById('navHome').onclick = function(e) {
    e.preventDefault();
    renderInfoContent();
};
document.getElementById('sideNavPricing').onclick = function(e) {
    e.preventDefault();
    renderPricingContent();
    sidebarNav.classList.remove('active');
};
document.getElementById('navPricing').onclick = function(e) {
    e.preventDefault();
    renderPricingContent();
};
document.getElementById('sideNavRecharge').onclick = function(e) {
    e.preventDefault();
    renderRechargeContent();
    sidebarNav.classList.remove('active');
};
document.getElementById('navRecharge').onclick = function(e) {
    e.preventDefault();
    renderRechargeContent();
};
document.getElementById('sideNavShop').onclick = function(e) {
    e.preventDefault();
    renderShopContent();
    sidebarNav.classList.remove('active');
};
document.getElementById('navShop').onclick = function(e) {
    e.preventDefault();
    renderShopContent();
};
document.getElementById('sideNavHelp').onclick = function(e) {
    e.preventDefault();
    renderHelpContent();
    sidebarNav.classList.remove('active');
};
document.getElementById('sideNavDownload').onclick = function(e) {
    e.preventDefault();
    renderDownloadContent();
    sidebarNav.classList.remove('active');
};
document.getElementById('navDownload').onclick = function(e) {
    e.preventDefault();
    renderDownloadContent();
};
fetchNotifications();