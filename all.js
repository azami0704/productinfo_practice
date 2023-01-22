const navbar = document.querySelector('.navbar');
const navbarToggle = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');
navbar.addEventListener('click', function (e) {
    if (e.target.classList.contains('nav-link')) {
        if (!navbarToggle.classList.contains('collapsed')) {
            navbarToggle.classList.remove('collapsed');
            navbarCollapse.classList.remove('show');
        }
    }
});

const searchBtn = document.getElementById('search-btn');
const cafeList = document.querySelector('.cafe-list');
const cafeArea = document.getElementById('cafe-area');
//打開搜尋視窗時重置select及預設店家
searchBtn.addEventListener('click', () => {
    cafeArea[0].selected = true;
    searchCafe();
})
//選擇地區時撈該地區的資料
cafeArea.addEventListener('change', function () {
    axios.get('./cafe.json')
        .then(res => {
            let selectedAreaList = res.data.filter(item => item.city == this.value)
            renderStoreList(selectedAreaList, 'area');
        })
        .catch(err => {
            console.log(err);
        })
})
//在function裡宣告吃不到,改在外面宣告
//以下為泰山職訓所的經緯度.為了方便顯示抓距離的差別,將預設經緯度移除
// let userLatitude=25.04411411;
// let userLongitude=121.41965105;
let userLatitude = '';
let userLongitude = '';
let str = '';
let filterClose = [];
let positionList = [];
function searchCafe() {
    //初始座標泰山職訓所
    navigator.geolocation.getCurrentPosition(function (position) {
        //有取到座標就更新取得的用戶座標
        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;
        axios.get('./cafe.json')
            .then(res => {
                renderStoreList(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, function () {
        //沒取到座標就直接用預設座標搜尋
        axios.get('./cafe.json')
            .then(res => {
                renderStoreList(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    });
}

//Haversine function
const rad=x=>x*Math.PI/180;
const distHaversine = function(p1,p2) {
    const R=6371; //地球圓周km
    const dLat=rad(p2.lat-p1.lat);
    const dLon=rad(p2.lon-p1.lon);
    let a=Math.sin(dLat/2)*Math.sin(dLat/2)+
    Math.cos(rad(p1.lat))*Math.cos(rad(p2.lat))*
    Math.sin(dLon/2)*Math.sin(dLon/2);
    let c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
    let d=R*c;
    return d;
}

//渲染店家清單
function renderStoreList(data, ...arg) {
    str = '';
    cafeList.innerHTML = `<div class="text-center">
    <div class="spinner-border" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>
    </div>`;
    if (arg[0] == 'area') {
        //發現部份資料不完整,篩出資料完整的
        positionList = data.filter(item => item.open_time != '永久停業' && item.name != '' && item.address != '');
        positionList.forEach(item => {
            let fb = '';
            if (item.url) {
                fb = `<a href='${item.url}' target='_blank'>官網</a>`
            } else {
                fb = '';
            }
            let haveSocket = '';
            switch (item.socket) {
                case "no":
                    haveSocket = '很少';
                    break;
                case "yes":
                    haveSocket = '很多';
                    break;
                case "maybe":
                    haveSocket = '還好，看座位';
                    break;
                default:
                    haveSocket = '未提供';
                    break;
            }
            let cheap = '';
            if (item.cheap) {
                cheap = `<span class='range' style='--lv:${item.cheap * 2 * 10}%'></span>`;
            } else {
                cheap = '未提供';
            }
            let tasty = '';
            if (item.tasty) {
                tasty = `<span class='range' style='--lv:${item.tasty * 2 * 10}%'></span>`;
            } else {
                tasty = '未提供';
            }
            str += `<li class='list-group-item'>
            <div class='color-main'><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 120 120" xml:space="preserve">
            <g>
                <g>
                    <path d="M96.872,37.956c6.726,10.305,10.188,22.551,10.261,34.83c0.06,9.826-1.872,20.31-7.147,28.746
                        c-1.952,3.122-4.506,6.137-7.828,7.849c-1.623,0.835-3.921,1.521-5.505,0.224c-1.865-1.525-1.318-4.268-1.229-6.352
                        c0.473-11.249-3-22.58-8.185-32.462c-2.729-5.205-6.03-10.125-9.888-14.565c-4.155-4.784-9.077-8.344-14.055-12.196
                        c-5.569-4.311-11.307-8.535-16.27-13.556c-3.374-3.414-7.289-7.961-6.963-13.106c0.465-7.336,7.9-11.552,14.487-11.932
                        c8.506-0.488,17.093,2.959,24.395,7.004C79.992,18.556,89.954,27.352,96.872,37.956C114.781,65.403,79.632,11.531,96.872,37.956z"
                        />
                    <path d="M23.139,23.553c0.569,12.23,14.115,19.608,22.732,26.104c4.945,3.727,10.089,7.158,14.199,11.842
                        c3.383,3.855,6.252,8.15,8.674,12.664c4.339,8.084,7.556,17.11,8.551,26.266c0.398,3.691,1.249,12.788-3.858,14.043
                        c-1.512,0.371-3.295-0.086-4.795-0.322c-2.32-0.368-4.612-0.909-6.856-1.605c-4.86-1.506-9.481-3.744-13.748-6.51
                        c-9.624-6.237-17.391-15.063-23.242-24.866c-6.71-11.243-11.508-24.085-11.905-37.281c-0.176-5.846,0.556-11.738,2.438-17.286
                        c0.636-1.874,1.472-5.644,3.687-6.235C20.859,19.874,23.053,21.701,23.139,23.553C23.678,35.133,23.027,21.156,23.139,23.553z"/>
                </g>
            </g>
            </svg><span class='fw-bold c'>${item.name}</span></div>
            <div>${item.address}</div>
            <div>營業時間: ${item.open_time || '未提供'}</div>
            <div>插座: ${haveSocket}</div>
            <div>價格便宜: ${cheap}</div>
            <div>咖啡好喝: ${tasty}</div>
            <div>${fb}</div>
            </li>`;
        })
    } else {
        positionList = [];
        //發現部份資料不完整,篩出資料完整的
        filterClose = data.filter(item => item.open_time != '永久停業' && item.name != '' && item.address != '');
        //將索引值&店家座標與用戶座標相減存入陣列以便搜尋
        filterClose.forEach((item, idx) => {
            positionList.push({ 
                idx: idx, 
                value:distHaversine({lat:userLatitude,lon:userLongitude},{lat:item.latitude,lon:item.longitude}) 
            });
        })
        //將相減的數字排序並取出最近的10筆
        positionList = positionList.sort((a, b) => a.value - b.value).slice(0, 10);
        positionList.forEach(item => {
            let fb = '';
            if (filterClose[item.idx].url) {
                fb = `<a href='${filterClose[item.idx].url}' target='_blank'>官網</a>`
            } else {
                fb = '';
            }
            let haveSocket = '';
            switch (filterClose[item.idx].socket) {
                case "no":
                    haveSocket = '很少';
                    break;
                case "yes":
                    haveSocket = '很多';
                    break;
                case "maybe":
                    haveSocket = '還好，看座位';
                    break;
                default:
                    haveSocket = '未提供';
                    break;
            }
            let cheap = '';
            if (filterClose[item.idx].cheap) {
                cheap = `<span class='range' style='--lv:${filterClose[item.idx].cheap * 2 * 10}%'></span>`;
            } else {
                cheap = '未提供';
            }
            let tasty = '';
            if (filterClose[item.idx].tasty) {
                tasty = `<span class='range' style='--lv:${filterClose[item.idx].tasty * 2 * 10}%'></span>`;
            } else {
                tasty = '未提供';
            }
            str += `<li class='list-group-item'>
            <div class='color-main'><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 120 120" xml:space="preserve">
            <g>
                <g>
                    <path d="M96.872,37.956c6.726,10.305,10.188,22.551,10.261,34.83c0.06,9.826-1.872,20.31-7.147,28.746
                        c-1.952,3.122-4.506,6.137-7.828,7.849c-1.623,0.835-3.921,1.521-5.505,0.224c-1.865-1.525-1.318-4.268-1.229-6.352
                        c0.473-11.249-3-22.58-8.185-32.462c-2.729-5.205-6.03-10.125-9.888-14.565c-4.155-4.784-9.077-8.344-14.055-12.196
                        c-5.569-4.311-11.307-8.535-16.27-13.556c-3.374-3.414-7.289-7.961-6.963-13.106c0.465-7.336,7.9-11.552,14.487-11.932
                        c8.506-0.488,17.093,2.959,24.395,7.004C79.992,18.556,89.954,27.352,96.872,37.956C114.781,65.403,79.632,11.531,96.872,37.956z"
                        />
                    <path d="M23.139,23.553c0.569,12.23,14.115,19.608,22.732,26.104c4.945,3.727,10.089,7.158,14.199,11.842
                        c3.383,3.855,6.252,8.15,8.674,12.664c4.339,8.084,7.556,17.11,8.551,26.266c0.398,3.691,1.249,12.788-3.858,14.043
                        c-1.512,0.371-3.295-0.086-4.795-0.322c-2.32-0.368-4.612-0.909-6.856-1.605c-4.86-1.506-9.481-3.744-13.748-6.51
                        c-9.624-6.237-17.391-15.063-23.242-24.866c-6.71-11.243-11.508-24.085-11.905-37.281c-0.176-5.846,0.556-11.738,2.438-17.286
                        c0.636-1.874,1.472-5.644,3.687-6.235C20.859,19.874,23.053,21.701,23.139,23.553C23.678,35.133,23.027,21.156,23.139,23.553z"/>
                </g>
            </g>
            </svg><span class='fw-bold c'>${filterClose[item.idx].name}</span></div>
            <div>${filterClose[item.idx].address}</div>
            <div>營業時間: ${filterClose[item.idx].open_time || '未提供'}</div>
            <div>插座: ${haveSocket}</div>
            <div>價格便宜: ${cheap}</div>
            <div>咖啡好喝: ${tasty}</div>
            <div>${fb}</div>
            </li>`;
        })
    }

    cafeList.innerHTML = str;
}


//整理地區清單
let areaList = new Set();
let areaListArr = [];
axios.get('./cafe.json')
    .then(res => {
        res.data.forEach(item => areaList.add(item.city));
        areaListArr = [...areaList];
        renderAreaSelect(areaListArr);
    })
    .catch(err => {
        console.log(err);
    })

//渲染地區select
function renderAreaSelect(list) {
    list.forEach(item => {
        let opt = document.createElement('option');
        opt.setAttribute('value', item);
        opt.textContent = translateArea(item);
        cafeArea.appendChild(opt);
    })
}

//城市拼音轉換中文
function translateArea(area) {
    switch (area) {
        case 'chiayi':
            return '嘉義';
        case 'taipei':
            return '台北';
        case 'taichung':
            return '台中';
        case 'kaohsiung':
            return '高雄';
        case 'taoyuan':
            return '桃園';
        case 'yilan':
            return '宜蘭';
        case 'changhua':
            return '彰化';
        case 'pingtung':
            return '屏東';
        case 'tainan':
            return '台南';
        case 'hsinchu':
            return '新竹';
        case 'hualien':
            return '花蓮';
        case 'yunlin':
            return '雲林';
        case 'miaoli':
            return '苗栗';
        case 'keelung':
            return '基隆';
        case 'penghu':
            return '澎湖';
        case 'taitung':
            return '台東';
        case 'nantou':
            return '南投';
        case 'kinmen':
            return '金門';
        case 'lienchiang':
            return '連江';
        default:
            return '其他';
    }
}