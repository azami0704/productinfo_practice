const navbar = document.querySelector('.navbar');
const navbarToggle = document.querySelector('.navbar-toggler');
const navbarCollapse = document.querySelector('.navbar-collapse');
navbar.addEventListener('click',function (e) {
    if(e.target.classList.contains('nav-link')){
        if(!navbarToggle.classList.contains('collapsed')){
            navbarToggle.classList.remove('collapsed');
            navbarCollapse.classList.remove('show');
        }
    }
});

const searchBtn = document.getElementById('search-btn');
const cafeList = document.querySelector('.cafe-list');
searchBtn.addEventListener('click',function(){
    searchCafe();
})

function searchCafe(){
    //初始座標泰山職訓所
    let userLatitude=25.04411411;
    let userLongitude=121.41965105;
    let filterClose=[];
    let positionList=[];
    let str='';
    navigator.geolocation.getCurrentPosition(function(position) {
        //有取到座標就更新取得的用戶座標
        userLatitude=position.coords.latitude;
        userLongitude=position.coords.longitude;
        axios.get('./cafe.json')
        .then(res=>{
            //將索引值&店家座標與用戶座標相減存入陣列以便搜尋
            filterClose=res.data.filter(item=>item.open_time!='永久停業');
            filterClose.forEach((item,idx)=>{
                positionList.push({idx:idx,value:Math.abs(userLatitude-item.latitude)+Math.abs(userLongitude-item.longitude)});
            })
            //將相減的數字排序並取出最近的10筆
            positionList=positionList.sort((a, b) => a.value - b.value).slice(0, 10);
            positionList.forEach(item=>{
                let fb='';
                if(filterClose[item.idx].url){
                    fb=`<a href='${filterClose[item.idx].url}'>官網</a>`
                }else{
                    fb='';
                }
                let haveSocket='';
                switch (filterClose[item.idx].socket) {
                    case "no":
                        haveSocket='很少';
                    break;
                    case "yes":
                        haveSocket='很多';
                    break;
                    case "maybe":
                        haveSocket='還好，看座位';
                    break;
                    default:
                        haveSocket='未提供';
                    break;
                }
                str+=`<li>
                <div class='fw-bold'>店名：${filterClose[item.idx].name}</div>
                <div>地址:${filterClose[item.idx].address}</div>
                <div>營業時間:${filterClose[item.idx].open_time?filterClose[item.idx].open_time:'未提供'}</div>
                <div>插座多:${haveSocket}</div>
                <div>價格便宜:${filterClose[item.idx].cheap?filterClose[item.idx].cheap:'未提供'}</div>
                <div>咖啡好喝:${filterClose[item.idx].tasty?filterClose[item.idx].tasty:'未提供'}</div>
                <div>${fb}</div>
                </li>`
                console.log(filterClose[item.idx]);
            })
            cafeList.innerHTML=str;
        })
        .catch(err=>{
            console.log(err);
        })
    },function(){
        //沒取到座標就直接用預設座標搜尋
        axios.get('./cafe.json')
        .then(res=>{
            filterClose=res.data.filter(item=>item.open_time!='永久停業');
            filterClose.forEach((item,idx)=>{
                positionList.push({idx:idx,value:Math.abs(userLatitude-item.latitude)+Math.abs(userLongitude-item.longitude)});
            })
            positionList=positionList.sort((a, b) => a.value - b.value).slice(0, 10);
            positionList.forEach(item=>{
                let fb='';
                if(filterClose[item.idx].url){
                    fb=`<a href='${filterClose[item.idx].url}'>官網</a>`
                }else{
                    fb='';
                }
                let haveSocket='';
                switch (filterClose[item.idx].socket) {
                    case "no":
                        haveSocket='很少';
                    break;
                    case "yes":
                        haveSocket='很多';
                    break;
                    case "maybe":
                        haveSocket='還好，看座位';
                    break;
                    default:
                        haveSocket='未提供';
                    break;
                }
                str+=`<li>
                <div class='fw-bold'>店名：${filterClose[item.idx].name}</div>
                <div>地址:${filterClose[item.idx].address}</div>
                <div>營業時間:${filterClose[item.idx].open_time?filterClose[item.idx].open_time:'未提供'}</div>
                <div>插座多:${haveSocket}</div>
                <div>價格便宜:${filterClose[item.idx].cheap?filterClose[item.idx].cheap:'未提供'}</div>
                <div>咖啡好喝:${filterClose[item.idx].tasty?filterClose[item.idx].tasty:'未提供'}</div>
                <div>${fb}</div>
                </li>`
                console.log(filterClose[item.idx]);
            })
            cafeList.innerHTML=str;
        })
        .catch(err=>{
            console.log(err);
        })
    });
}

