               
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
 
    var data = '';
    if (alergi.length == 1 && alergi[0] == 'none' ) {
        data = { "umur": umur, "skintype": skintype, "skinprob": skinprob, "hargabawah": hargabawah, "hargaatas": hargaatas, "kategori": kategori};
    } else if (alergi.length == 1 &&  alergi[0] != 'none' ) {
        data = { "umur": umur, "skintype": skintype, "skinprob": skinprob, "hargabawah": hargabawah, "hargaatas": hargaatas, "kategori": kategori, alergi1:alergi[0]};
    } else {
        data = { "umur": umur, "skintype": skintype, "skinprob": skinprob, "hargabawah": hargabawah, "hargaatas": hargaatas, "kategori": kategori, alergi1:alergi[0], alergi2:alergi[1]};
    }

    console.log(data);
    var reqdata = JSON.stringify(data);
    window.localStorage.setItem('data', reqdata);
  }
    