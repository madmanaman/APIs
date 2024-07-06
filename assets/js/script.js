

const obtenerData = async (tipoMoneda) => {
    try {
    const respuesta = await fetch(`https://mindicador.cl/api/${tipoMoneda}`);
    const data = await respuesta.json();
    return data["serie"];
    }catch {
        document.getElementById("total").innerHTML = `<h2>Ha ocurrido un error</h2>`;
        console.log("error en funcion obtenerData")
    }
};

const crearGrafico = (labels, data, valorMin, valorMax) => {
    document.getElementById("grafico").innerHTML = ``
    document.getElementById("grafico").innerHTML = `<canvas id="myChart" ></canvas>`;
    const ctx = document.getElementById('myChart').getContext('2d');
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Valores últimos períodos',
                data: data,
                borderWidth: 1,
                borderColor: 'rgba(243, 50, 36, 1)',
                backgroundColor: 'rgba(75, 192, 192, 1)'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false,
                    min: valorMin - 1,
                    max: valorMax + 1 ,                       
                }
            }
        }
    });
};

const convertir = async () => {
    try {
        let pesos = document.querySelector("#pesos").value;
        let tipoMoneda = document.querySelector("#moneda").value;
        let resultado = await obtenerData(tipoMoneda);

        let valorMoneda = resultado[0].valor;
        let total = pesos / valorMoneda ;
        let totalDecimal = total.toFixed(2)

        document.getElementById("total").innerHTML = `<h2>Resultado: $${totalDecimal}</h2>`;
        // let ultimosRegistros = resultado.slice(-10)
        // const labels = ultimosRegistros.map(item => new Date(item.fecha).toLocaleDateString());
        // const valores = ultimosRegistros.map(item => item.valor); // se intentó pero me borraba algunos registros del grafico
        const labels = resultado.map(item => new Date(item.fecha).toLocaleDateString());
        const valores = resultado.map(item => item.valor);
        const valorMin = Math.min(...valores);
        const valorMax = Math.max(...valores);

        crearGrafico(labels, valores, valorMin, valorMax);
    }catch (error) {
        console.error('Error en la función convertir:', error);
        alert("Ocurrió un error, inténtalo nuevamente");
    }
};

