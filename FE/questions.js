function sendForm() {
    var umur = $('input[name="age"]:checked').val();
    var skintype = $('input[name="type"]:checked').val();
    var skinprob = $('input[name="prob"]:checked').val();
    var kategori = $('input[name="prod"]:checked').val();
    var hargabawah = $('input[name="prc1"]').val();
    var hargaatas = $('input[name="prc2"]').val();
    var alergi = $("#allg input:checkbox:checked").map(function () {
                 return $(this).val();
                 }).get();
    var alergi1 = alergi[0];
    var alergi2 = alergi[1];
    // var dataStore = $.cookie("basket-data", JSON.stringify($("#InputForm").data()));
                 
    var data = '';
    if (alergi.length == 1 && alergi[0] == 'none' ) {
        data = { "umur": umur, "skintype": skintype, "skinprob": skinprob, "hargabawah": hargabawah, "hargaatas":hargaatas, "kategori": kategori};
    } else if (alergi.length == 1 &&  alergi[0] != 'none' ) {
        data = { "umur": umur, "skintype": skintype, "skinprob": skinprob, "hargabawah": hargabawah, "hargaatas":hargaatas, "kategori": kategori, alergi1:alergi[0]};
    } else {
        data = { "umur": umur, "skintype": skintype, "skinprob": skinprob, "hargabawah": hargabawah, "hargaatas":hargaatas, "kategori": kategori, alergi1:alergi[0], alergi2:alergi[1]};
    }

    // add cookie
    var datastore = JSON.stringify(data);
    document.cookie = "data=" + datastore;

    console.log(data);

    fetch("/recommend", {
        method: "POST",
        headers: {
            "Accept":"application/json",
            "Content-Type":"application/json; charset=utf-8",
        },
        body: JSON.stringify(data)
    }).then(async (response) => {
        const content = await response.json();
        console.log(content);
    }).catch((error) => {
        console.error(error);
    })
}
