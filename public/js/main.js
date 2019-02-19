// in game
//ham chạy khi web bật
function HiddenResidual() {
    $('#loginListGame').hide();
    $('#taiXiu, .threeXucXac, .soNut, .infoUser, .displayRecharge, #bauCua, .canCua, .alertBet, #tungXucXac, .framseLuatTaiXiu, .framseChatTaiXiu').hide();
}



$(document).ready(function () {
    handlingWidth();
    HiddenResidual();
});

// bat su kien width thay doi
$(window).on('resize', function () {
    handlingWidth();
})
// hàm xử lý width
function handlingWidth() {
    ww = $(window).width();
    // console.log(ww);
    if (ww < 992 && ww > 0) {
        console.log('123');
        $('html').hide();
        alert("Xin lỗi, thiết bị của quý khách k thích hợp với game giao diện web này!");
    }
    else if (ww == 0) {
        console.log('1234');
        $('html').show();
        if ($(window).width() >= 992) {
            $('html').show();
        }
        if ($(window).width() < 992) {
            $('html').hide();
            alert("Xin lỗi, thiết bị của quý khách k thích hợp với game giao diện web này!");
        }
    }
}

function loginFinish() {
    $('.common, .header_menu, .bodyer').hide();
    $('#loginListGame').show();
    TextWelcome('#welcome', 'Chào mừng ' + userNameGG + ' đến với game đánh bài ThanVip !');
}
function TextWelcome(id, content) {
    var text = '';
    var size = content.length;
    var arr = content.split("");
    var num = 0;
    var interval = setInterval(function () {
        text += arr[num];
        $(id).html(text);
        num++;
        if (num == size) {
            clearInterval(interval);
        }
    }, 80);
}
// list help
$('.recharge').click(function () {
    $('.displayRecharge').show();
})
$('.closeFramesRecharge').click(function () {
    $('.displayRecharge').hide();
})
// NẠP THẺ
$('.viettel').click(function () {
    loaiThe = 'vtt';
    $('.NTDT').html('NẠP THẺ VIETTEL');
    $('.viettel').css({ 'opacity': '1', 'border': '3px solid red' })
    $('.mobi').css({ 'opacity': '0.5', 'border': '0' })
    $('.vina').css({ 'opacity': '0.5', 'border': '0' })
})
$('.mobi').click(function () {
    loaiThe = 'vms';
    $('.NTDT').html('NẠP THẺ MOBIPHONE')
    $('.mobi').css({ 'opacity': '1', 'border': '3px solid red' })
    $('.viettel').css({ 'opacity': '0.5', 'border': '0' })
    $('.vina').css({ 'opacity': '0.5', 'border': '0' })
})
$('.vina').click(function () {
    loaiThe = 'vnp';
    $('.NTDT').html('NẠP THẺ VINAPHONE')
    $('.vina').css({ 'opacity': '1', 'border': '3px solid red' })
    $('.viettel').css({ 'opacity': '0.5', 'border': '0' })
    $('.mobi').css({ 'opacity': '0.5', 'border': '0' })
})
function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
$('#nap').click(function () {
    var maThe, serial, menhGia, serviceTransId;
    $('.alertNapThe').html('<img src="./img/loading1.gif">')
    maThe = $("#maThe").val();
    serial = $("#serial").val();
    menhGia = $("#menhGia").val();
    serviceTransId = $("#serviceTransId").val();
    console.log(maThe);
    console.log(serial);
    console.log(menhGia);
    console.log(loaiThe);
    if (loaiThe == undefined) {
        $('.alertNapThe').html('Xin vui lòng chọn loại thẻ thanh toán');
    }
    var x = "http://5ty.org:8080";
    $.ajax({
        url: x + "/api/card/post",
        data: {
            serviceId: 'IUt048hc1ci8qJ3jNNCI',
            type: loaiThe,
            serial: serial,
            code: maThe,
            money: menhGia,
            serviceTransId: serviceTransId,
            hash: 'shajdkhashdaksj',
        },
        dataType: 'json',
        type: "POST",
        success: function (data) {
            console.log(data);
            $('.alertNapThe').html(data.Message);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 415) {
                console.log('lỗi');
            }
            if (jqXHR.status == 500) {
                $('.loader').hide();
                alert("Account not enough to withdraw!");
            }
            if (jqXHR.status == 404) {

                $('.loader').hide();
            }
        }
    })
});

function getTimeStart() {
    $.get("https://us-central1-tai-xiu-ef296.cloudfunctions.net/getTimeStartTX", function (data) {
        if (data.timeStart != timeGameStart) {
            getTimeStart();
        }
        timeGameStart = data.timeStart;
        gameStart(data);
    });
}
function reResult(number) {
    listResult = listResult.slice(30, listResult.length);
    if (number > 10) {
        listResult += '<i class="fas fa-circle"></i> ';
    } else {
        listResult += '<i class="far fa-circle"></i> ';
    }
    $('.inconCham').html(listResult);

}
//get history result
function getHistpryResult() {
    $.get("https://us-central1-tai-xiu-ef296.cloudfunctions.net/getHistoryResult", function (data) {
        listResult = data.listResult
        $('.inconCham').html(listResult);
    });
}

//get result
function getResult() {
    $.post("https://us-central1-tai-xiu-ef296.cloudfunctions.net/getResult",
        {
            timeStart: timeGameStart,
            id: uid
        },
        function (data) {
            getTaiXiu(data);
            stopGetResult.push('stopGetResult');
            if (parseInt(data.timeResultTaiXiu) != timeGameStart && stopGetResult.length > 1) {
                getResult();
                getTaiXiu(data);
            }
            getTaiXiu(data);
            $('.moneyTai span').html(data.moneyTai);
            $('.moneyXiu span').html(data.moneyXiu);
        }
    );
}
//update total money
function updateTotalMoney() {
    $.post("https://us-central1-tai-xiu-ef296.cloudfunctions.net/updateTotalMoney",
        {
            timeStart: timeGameStart,
            id: uid
        },
        function (data) {
            $('.chipt').html(numberFormat2.format(data.moneyUser));
            $('.totalMoneyTai span').html(numberFormat2.format(data.totalAmountTai));
            $('.totalMoneyXiu span').html(numberFormat2.format(data.totalAmountXiu));
            $('.amountPPXiu span').html(data.totalPlayXiu);
            $('.amountPPTai span').html(data.totalPlayTai);
        }
    );
}
// updateTotalMoney();
getTimeStart();
getHistpryResult();
getResult();

setInterval(() => {
    var d = new Date();
    var time = (d - timeGameStart) / 1000;
    if (120 < time && time < 125.5) {
        getTimeStart();
    }
    if (104 < time && time < 104.5) {
        getResult();
    }
}, 400)
