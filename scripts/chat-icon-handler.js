let ICON_GROUPS = [];
fetch('../resources/chat-icons/metadata.json')
    .then(response => response.json())
    .then(data => {
        ICON_GROUPS = data;
    })

let currentGroup = 0;

document.getElementById('openPickerBtn').onclick = function (e) {
    const picker = document.getElementById('iconPicker');
    picker.classList.toggle('visible');
    if (picker.classList.contains('visible')) {
        renderPickerTabs();
        renderPickerIcons();
        document.getElementById('pickerSearch').focus();
    }
};

document.addEventListener('mousedown', function (e) {
    const picker = document.getElementById('iconPicker');
    const btn = document.getElementById('openPickerBtn');
    if (!picker.contains(e.target) && !btn.contains(e.target)) {
        picker.classList.remove('visible');
    }
});

function renderPickerTabs() {
    const tabs = document.getElementById('pickerTabs');
    const search = document.getElementById('pickerSearch').value.toLowerCase();
    tabs.innerHTML = '';

    if (search) {
        const label = document.createElement('div');
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
        btn.onclick = () => {
            currentGroup = idx;
            renderPickerTabs();
            renderPickerIcons();
        };
        tabs.appendChild(btn);
    });
}

function renderPickerIcons() {
    const iconsDiv = document.getElementById('pickerIcons');
    const search = document.getElementById('pickerSearch').value.toLowerCase();
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
    } else {
        // No search: show icons from current group only
        icons = ICON_GROUPS[currentGroup].icons;
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
