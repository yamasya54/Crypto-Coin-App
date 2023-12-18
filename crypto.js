const form = document.querySelector(".top-banner form");
const input = document.querySelector(".top-banner input");
const msgSpan = document.querySelector(".container .msg");
const coinList = document.querySelector(".ajax-section .container .coins");

//localStorage
localStorage.setItem("apiKey", EncryptStringAES("coinranking39646045359ac8a59d93b13388352b947ee537dceb0d9258"));
form.addEventListener("submit", (e) => {
    e.preventDefault();
    getCoinDataFromApi();
    e.target.reset();
});

const getCoinDataFromApi = async () => {
    
    const apiKey = DecryptStringAES(localStorage.getItem("apiKey"));
  
    const url = `https://api.coinranking.com/v2/coins?search=${input.value}&limit=1`;
    const options = {
        headers: {
            'x-access-token': apiKey,
        },
    };
 
    try{
        const response = await axios(url, options);
       
        const { price, name, change, iconUrl, symbol } = response.data.data.coins[0];
      
        //Coin Control!!!
        const coinNameSpans = coinList.querySelectorAll("h2 span");
   
        if (coinNameSpans.length > 0) {
            const filteredArray = [...coinNameSpans].filter(span => span.innerText == name);
      
            if (filteredArray.length > 0) {
                msgSpan.innerText = `You already know the data for ${name}, Please search for another coin 😉`;
                setTimeout(() => {
                    msgSpan.innerText = "";
                }, 3000);
                return;
            }
        }

        //continue xxxx return
        const createdLi = document.createElement("li");
        createdLi.classList.add("coin");
        createdLi.innerHTML = `
            <h2 class="coin-name" data-name=${name}>
                <span>${name}</span>
                <sup>${symbol}</sup>
            </h2>
            <div class="coin-temp">$${Number(price).toFixed(6)}</div>
            <figure>
                <img class="coin-icon" src=${iconUrl}>                
                <figcaption style='color:${change < 0 ? "red" : "green"}'>
                    <span><i class="fa-solid fa-chart-line"></i></span>
                    <span>${change}%</span>
                </figcaption>
            </figure>
            <span class="remove-icon">
                <i class="fas fa-window-close" style="color:red"></i>
            </span>`;
     
        coinList.prepend(createdLi);
        //remove func.
        createdLi.querySelector(".remove-icon").addEventListener("click", () => {
            createdLi.remove();
        });
    }
   catch(error){

    msgSpan.innerText = `Coin not found!`;
    setTimeout(() => {
        msgSpan.innerText = "";
    }, 3000);
   }

}
