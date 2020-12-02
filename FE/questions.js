const sendForm = async() => {
    const data = await JSON.stringify({
        umur: document.getElementById("age").value,
        skintype: document.getElementById("type").value,
        skinprob: document.getElementById("prob").value,
        kategori: document.getElementById("prod").value,
        harga:document.getElementById("prc").value,

        if(harga=prc1){
            var hargabawah=0;
            var hargaatas=100000;
        },
        elif(harga=prc2) {
            var hargabawah=100001;
            var hargaatas=300000;
        },
        elif(harga=prc3) {
            var hargabawah=300001;
            var hargaatas=500000;
        },
        elif(harga=prc4) {
            var hargabawah=500001;
            var hargaatas=2000000;
        },
	})
    console.log(data);
    const response = await fetch('\recommend');
	const json = await response.json();
	console.log(json);
}
