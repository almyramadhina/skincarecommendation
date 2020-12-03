               
function sendForm() {
    
    var umur = $('input[name="age"]:checked').val();
    var isTrue17 = umur == 'true';
    var skintype = $('input[name="type"]:checked').val();
    var skinprob = $('input[name="prob"]:checked').val();
    var kategori = $('input[name="prod"]:checked').val();
    var hargabawah = parseInt(document.getElementById("prc1").value);
    var hargaatas = parseInt(document.getElementById("prc2").value);
    var alergi = $("#allg input:checkbox:checked").map(function () {
                 return $(this).val();
                 }).get();
    var alergi1 = alergi[0];
    var alergi2 = alergi[1];
    
    console.log(hargaatas);

    var data = '';
    if (alergi.length == 1 && alergi[0] == 'none' ) {
        data = { "umur": isTrue17, "skintype": skintype, "skinprob": skinprob, "hargabawah": hargabawah, "hargaatas": hargaatas, "kategori": kategori};
    } else if (alergi.length == 1 &&  alergi[0] != 'none' ) {
        data = { "umur": isTrue17, "skintype": skintype, "skinprob": skinprob, "hargabawah": hargabawah, "hargaatas": hargaatas, "kategori": kategori, alergi1:alergi[0]};
    } else {
        data = { "umur": isTrue17, "skintype": skintype, "skinprob": skinprob, "hargabawah": hargabawah, "hargaatas": hargaatas, "kategori": kategori, alergi1:alergi[0], alergi2:alergi[1]};
    }

    console.log(data);
    var reqdata = JSON.stringify(data);
    window.localStorage.setItem('data', reqdata);
  }
    