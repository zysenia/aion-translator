let ICON_GROUPS = [];
let iconsLoaded = false;
fetch('../assets/images/chat-icons/metadata.json')
    .then(response => response.json())
    .then(data => {
        ICON_GROUPS = data;
        iconsLoaded = true;
    })

let currentGroup = 0;

document.getElementById('openPickerBtn').onclick = function (e) {
    const picker = document.getElementById('iconPicker');
    picker.classList.toggle('visible');
    if (picker.classList.contains('visible')) {
        if (!iconsLoaded) {
            setTimeout(() => openPickerBtn.click(), 30);
            return;
        }
        renderPickerTabs();
        renderPickerIcons();
        document.getElementById('pickerSearch').focus();
        document.getElementById('openPickerBtn').setAttribute('aria-expanded', 'true')
    }
};

document.addEventListener('mousedown', function (e) {
    const picker = document.getElementById('iconPicker');
    const btn = document.getElementById('openPickerBtn');
    if (!picker.contains(e.target) && !btn.contains(e.target)) {
        picker.classList.remove('visible');
        btn.setAttribute('aria-expanded', 'false')
        btn.focus();
    }
});

function renderPickerTabs() {
    const tabs = document.getElementById('pickerTabs');
    const search = document.getElementById('pickerSearch').value.toLowerCase();
    tabs.setAttribute('role', 'tablist');
    tabs.innerHTML = '';

    if (search) {
        const label = document.createElement('div');
        label.setAttribute('role', 'heading');
        label.setAttribute('aria-level', '2');
        label.setAttribute('id', 'searchResultLabel');
        label.textContent = 'Search results';
        label.style.padding = '6px 12px';
        label.style.color = '#0078d7';
        tabs.appendChild(label);
        return;
    }

    ICON_GROUPS.forEach((group, idx) => {
        const btn = document.createElement('button');
        btn.className = 'picker-tab' + (idx === currentGroup ? ' active' : '');
        btn.textContent = group.category;

        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', idx === currentGroup ? 'true' : 'false');
        btn.setAttribute('tabindex', idx === currentGroup ? '0' : '-1');
        btn.id = `tab-${idx}`;

        btn.onclick = () => {
            currentGroup = idx;
            renderPickerTabs();
            renderPickerIcons();
        };

        btn.onkeydown = (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                currentGroup = (currentGroup + 1) % ICON_GROUPS.length;
                renderPickerTabs();
                renderPickerIcons();
                focusCurrentTab();
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                currentGroup = (currentGroup - 1 + ICON_GROUPS.length) % ICON_GROUPS.length;
                renderPickerTabs();
                renderPickerIcons();
                focusCurrentTab();
            }
        };

        tabs.appendChild(btn);
    });
}

function focusCurrentTab() {
  const currentTab = document.getElementById(`tab-${currentGroup}`);
  if (currentTab) currentTab.focus();
}

function renderPickerIcons() {
    const iconsDiv = document.getElementById('pickerIcons');
    const search = document.getElementById('pickerSearch').value.toLowerCase();
    const liveStatus = document.getElementById('pickerLiveStatus');
    iconsDiv.innerHTML = '';
    let icons;

    if (search) {
        icons = ICON_GROUPS.flatMap(group => group.icons.map(icon => ({
            ...icon,
            groupName: group.name
        }))).filter(icon =>
            icon.name.toLowerCase().includes(search) ||
            (icon.keywords && icon.keywords.some(kw => kw.toLowerCase().includes(search)))
        );
        if (liveStatus) {
            liveStatus.textContent =
            icons.length === 0
                ? 'No icons found.'
                : `${icons.length} icon${icons.length !== 1 ? 's' : ''} found.`;
        }
        iconsDiv.setAttribute('aria-labelledby', 'searchResultLabel');
    } else {
        // No search: show icons from current group only
        if (!ICON_GROUPS[currentGroup]) return;
        icons = ICON_GROUPS[currentGroup].icons || [];;
        if (liveStatus) {
            liveStatus.textContent = '';
        }
        iconsDiv.setAttribute('aria-labelledby', `tab-${currentGroup}`);
    }

    if (icons.length === 0) {
        iconsDiv.innerHTML = '<div style="padding:10px;color:#888;">No icons found.</div>';
        return;
    }
    icons.forEach(icon => {
        const el = document.createElement('div');
        el.className = 'picker-icon';
        el.title = icon.name + (icon.groupName ? ` (${icon.groupName})` : '');
        el.innerHTML = `<img src='${icon.src}' alt='${icon.name}' loading='lazy'>`;
        el.onclick = () => insertIconAtCursor(icon.unicode);

        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', icon.name);

        el.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                insertIconAtCursor(icon.unicode);
            }
        };
        iconsDiv.appendChild(el);
    });
}

function insertIconAtCursor(unicodeChar) {
    const input = document.getElementById('input');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const before = input.value.substring(0, start);
    const after = input.value.substring(end);
    input.value = before + unicodeChar + after;
    input.selectionStart = input.selectionEnd = start + unicodeChar.length;
    input.focus();
    translate()
    document.getElementById('iconPicker').classList.remove('visible');
}

function updatePreview() {
    const output = document.getElementById('output');
    let html = output.innerHTML;

    ICON_GROUPS.forEach(group => {
        group.icons.forEach(icon => {
            const re = new RegExp(icon.unicode.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
            html = html.replace(re, `<img src='${icon.src}' class='emoji' alt='${icon.unicode}' loading='lazy'>`);
        });
    });
    document.getElementById('output').innerHTML = html;
}

// Initial Rendering
updatePreview();