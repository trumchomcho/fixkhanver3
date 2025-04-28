const setFeatureByPath = (path, value) => { let obj = window; const parts = path.split('.'); while (parts.length > 1) obj = obj[parts.shift()]; obj[parts[0]] = value; }

function addFeature(features) {
    const feature = document.createElement('feature');
    features.forEach(attribute => {
        let element = attribute.type === 'nonInput' ? document.createElement('label') : document.createElement('input');
        if (attribute.type === 'nonInput') element.innerHTML = attribute.name;
        else { element.type = attribute.type; element.id = attribute.name; }

        if (attribute.attributes) {
            attribute.attributes.split(' ').map(attr => attr.split('=')).forEach(([key, value]) => {
                value = value ? value.replace(/"/g, '') : '';
                key === 'style' ? element.style.cssText = value : element.setAttribute(key, value);
            });
        }

        if (attribute.variable) element.setAttribute('setting-data', attribute.variable);
        if (attribute.dependent) element.setAttribute('dependent', attribute.dependent);
        if (attribute.className) element.classList.add(attribute.className);

        if (attribute.labeled) {
            const label = document.createElement('label');
            if (attribute.className) label.classList.add(attribute.className);
            if (attribute.attributes) {
                attribute.attributes.split(' ').map(attr => attr.split('=')).forEach(([key, value]) => {
                    value = value ? value.replace(/"/g, '') : '';
                    key === 'style' ? label.style.cssText = value : label.setAttribute(key, value);
                });
            }
            label.innerHTML = `${element.outerHTML} ${attribute.label}`;
            feature.appendChild(label);
        } else {
            feature.appendChild(element);
        }
    });
    dropdownMenu.innerHTML += feature.outerHTML;
}
function handleInput(ids, callback = null) {
    (Array.isArray(ids) ? ids.map(id => document.getElementById(id)) : [document.getElementById(ids)])
    .forEach(element => {
        if (!element) return;
        const setting = element.getAttribute('setting-data'),
            dependent = element.getAttribute('dependent'),
            handleEvent = (e, value) => {
                setFeatureByPath(setting, value);
                if (callback) callback(value, e);
            };

        if (element.type === 'checkbox') {
            element.addEventListener('change', (e) => {
                playAudio('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/5os0bypi.wav');
                handleEvent(e, e.target.checked);
                if (dependent) dependent.split(',').forEach(dep => 
                    document.querySelectorAll(`.${dep}`).forEach(depEl => 
                        depEl.style.display = e.target.checked ? null : "none"));
            });
        } else {
            element.addEventListener('input', (e) => handleEvent(e, e.target.value));
        }
    });
}

/* Watermark */
Object.assign(watermark.style, {
    position: 'fixed', top: '0', left: '85%', width: '150px', height: '30px', backgroundColor: 'RGB(0,0,0,0.5)',
    color: 'white', fontSize: '15px', fontFamily: 'MuseoSans, sans-serif', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    cursor: 'default', userSelect: 'none', padding: '0 10px',  borderRadius: '10px', zIndex: '1001', transition: 'transform 0.3s ease'
});

if (device.mobile) watermark.style.left = '55%'

watermark.innerHTML = `<span style="text-shadow: -1px 0.5px 0 #72ff72, -2px 0px 0 #2f672e;">KW</span> <span style="color:gray; padding-left:2px; font-family: Arial, sans-serif; font-size:10px">${ver}</span>`;

document.body.appendChild(watermark);

let isDragging = false, offsetX, offsetY;

watermark.addEventListener('mousedown', e => { if (!dropdownMenu.contains(e.target)) { isDragging = true; offsetX = e.clientX - watermark.offsetLeft; offsetY = e.clientY - watermark.offsetTop; watermark.style.transform = 'scale(0.9)'; } });
watermark.addEventListener('mouseup', () => { isDragging = false; watermark.style.transform = 'scale(1)'; });

document.addEventListener('mousemove', e => { if (isDragging) { let newX = Math.max(0, Math.min(e.clientX - offsetX, window.innerWidth - watermark.offsetWidth)); let newY = Math.max(0, Math.min(e.clientY - offsetY, window.innerHeight - watermark.offsetHeight)); Object.assign(watermark.style, { left: `${newX}px`, top: `${newY}px` }); dropdownMenu.style.display = 'none'; } });

/* Dropdown */
Object.assign(dropdownMenu.style, {
    position: 'absolute', top: '100%', left: '0', width: '160px', backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px', color: 'white', fontSize: '13px', fontFamily: 'Monospace, sans-serif',
    display: 'none', flexDirection: 'column', zIndex: '1000', padding: '5px', cursor: 'default',
    userSelect: 'none', transition: 'transform 0.3s ease', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)'
});

dropdownMenu.innerHTML = `
    <style>
        input[type="checkbox"] {appearance: none; width: 15px; height: 15px; background-color: #3a3a3b;
        border: 1px solid #acacac; border-radius: 3px; margin-right: 5px; cursor: pointer;}
        input[type="checkbox"]:checked {background-color: #540b8a; border-color: #720fb8;}
        input[type="text"], input[type="number"], input[type="range"] {width: calc(100% - 10px); border: 1px solid #343434; 
        color: white; accent-color: #540b8a; background-color: #540b8a; padding: 3px; border-radius: 3px; background: none;}
        label {display: flex; align-items: center; color: #3a3a3b; padding-top: 3px;}
    </style>
`;

watermark.appendChild(dropdownMenu);

let danhSachTinhNang = [
    { ten: 'giaLapCauHoi', loai: 'checkbox', bien: 'cacTinhNang.giaLapCauHoi', thuocTinh: 'checked', coNhan: true, nhan: 'Giả lập câu hỏi' },
    { ten: 'giaLapVideo', loai: 'checkbox', bien: 'cacTinhNang.giaLapVideo', thuocTinh: 'checked', coNhan: true, nhan: 'Giả lập video' },
    { ten: 'hienDapAn', loai: 'checkbox', bien: 'cacTinhNang.hienDapAn', coNhan: true, nhan: 'Hiện đáp án' },
    { ten: 'tuDongTraLoi', loai: 'checkbox', bien: 'cacTinhNang.tuDongTraLoi', phuThuoc: 'doTreTuDongTraLoi,deXuatTiepTheo,lapLaiCauHoi', coNhan: true, nhan: 'Tự động trả lời' },
    { ten: 'lapLaiCauHoi', className: 'lapLaiCauHoi', loai: 'checkbox', bien: 'cacTinhNang.lapLaiCauHoi', thuocTinh: 'style="display:none;"', coNhan: true, nhan: 'Lặp lại câu hỏi' },
    { ten: 'deXuatTiepTheo', className: 'deXuatTiepTheo', loai: 'checkbox', bien: 'cacTinhNang.deXuatTiepTheo', thuocTinh: 'style="display:none;"', coNhan: true, nhan: 'Gợi ý tiếp theo' },
    { ten: 'doTreTuDongTraLoi', className: 'doTreTuDongTraLoi', loai: 'range', bien: 'cacTinhNang.doTreTuDongTraLoi', thuocTinh: 'style="display:none;" min="1" max="3" value="1"', coNhan: false },
    { ten: 'cayPhut', loai: 'checkbox', bien: 'cacTinhNang.cayPhut', coNhan: true, nhan: 'Cày phút' },
    { ten: 'bannerTuyChinh', loai: 'checkbox', bien: 'cacTinhNang.bannerTuyChinh', coNhan: true, nhan: 'Banner tùy chỉnh' },
    { ten: 'logoRGB', loai: 'checkbox', bien: 'cacTinhNang.logoRGB', coNhan: true, nhan: 'Logo RGB' },
    { ten: 'cheDoToi', loai: 'checkbox', bien: 'cacTinhNang.cheDoToi', thuocTinh: 'checked', coNhan: true, nhan: 'Chế độ tối' },
    { ten: 'meoChayManHinh', loai: 'checkbox', bien: 'cacTinhNang.meoChayManHinh', coNhan: true, nhan: 'Mèo chạy màn hình' },
    { ten: 'tieuDeTenNguoiDung', loai: 'nonInput' },
    { ten: 'tenNguoiDungTuyChinh', loai: 'text', bien: 'cauHinhTinhNang.tenNguoiDungTuyChinh', thuocTinh: 'autocomplete="off"' },
    { ten: 'tieuDeAnhDaiDien', loai: 'nonInput' },
    { ten: 'anhDaiDienTuyChinh', loai: 'text', bien: 'cauHinhTinhNang.anhDaiDienTuyChinh', thuocTinh: 'autocomplete="off"' }
];

// Thêm dòng thông tin tài khoản người dùng
danhSachTinhNang.push({ ten: `${nguoiDung.tenDangNhap} - UID: ${nguoiDung.UID}`, loai: 'nonInput', thuocTinh: 'style="font-size:10px; padding-left:5px;"' });

// Tạo giao diện tính năng
themTinhNang(danhSachTinhNang);

// Xử lý nhập dữ liệu cho các checkbox và text
xuLyNhap(['giaLapCauHoi', 'giaLapVideo', 'hienDapAn', 'deXuatTiepTheo', 'lapLaiCauHoi', 'cayPhut', 'bannerTuyChinh', 'logoRGB']);
xuLyNhap(['tenNguoiDungTuyChinh', 'anhDaiDienTuyChinh']);

// Xử lý riêng một số tính năng
xuLyNhap('tuDongTraLoi', daChon => daChon && !cacTinhNang.giaLapCauHoi && (document.querySelector('[setting-data="cacTinhNang.giaLapCauHoi"]').checked = cacTinhNang.giaLapCauHoi = true));

xuLyNhap('doTreTuDongTraLoi', giaTri => giaTri && (cauHinhTinhNang.doTreTuDongTraLoi = 4 - giaTri));

xuLyNhap('cheDoToi', daChon => daChon ? (DarkReader.setFetchMethod(window.fetch), DarkReader.enable()) : DarkReader.disable());

xuLyNhap('meoChayManHinh', daChon => {
    meoEl = document.getElementById('oneko');
    if (meoEl) {
        meoEl.style.display = daChon ? null : "none";
    }
});

// Xử lý hover để hiện menu và phát âm thanh
dongDau.addEventListener('mouseenter', () => {
    menuThaXuong.style.display = 'flex';
    phatAmThanh('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/3kd01iyj.wav');
});

dongDau.addEventListener('mouseleave', e => {
    !dongDau.contains(e.relatedTarget) && (menuThaXuong.style.display = 'none');
    phatAmThanh('https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/rqizlm03.wav');
});