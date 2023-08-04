// this code will be executed after page load

let isEnabled = false
async function translateText(toTranslate) {
  const result = await fetch(
    `https://api.mymemory.translated.net/get?q=${toTranslate}!&langpair=en|sr&de=milansrdic2000@gmail.com`
  )
  const data = await result.json()

  console.log('prevedeno:' + data.responseData.translatedText)

  return data.responseData.translatedText
}

//EKSTENZIJA
;(function () {
  // const popupContainer = document.querySelector('.popup-container')

  const popupContainer = document.createElement('div')
  popupContainer.classList.add('not-visible')
  //kreiranje paragrafa
  const translatedText = document.createElement('p')

  //kreiranje naslova
  const h1 = document.createElement('h1')
  h1.innerText = 'Prevod'
  translatedText.innerText = 'Prevedeni tekst...'
  popupContainer.appendChild(h1)
  popupContainer.appendChild(translatedText)
  popupContainer.classList.add('popup-container')

  //kreiranje dugmica za close popup
  const closeButton = document.createElement('img')

  closeButton.src = chrome.runtime?.getURL('assets/delete-button.png')
  console.log(chrome.runtime?.getURL('assets/delete-button.png'))

  h1.appendChild(closeButton)

  // querySelector('.popup-container h1 img')

  //dodajemo nas popup kontejner postojecoj stranici
  document.querySelector('body').appendChild(popupContainer)

  //show popup for translating
  let showPopup = async () => {
    if (previousSelectedText.length > 0) {
      const range = window.getSelection().getRangeAt(0)
      const boundingRect = range.getBoundingClientRect()

      popupContainer.style.top =
        boundingRect.top + boundingRect.height + 40 + 'px'
      popupContainer.style.left =
        boundingRect.left + boundingRect.width / 2 + 'px'

      //resetujemo stilove koji su ostali kao fix kad element overflovuje

      popupContainer.style.right = 'auto'
      popupContainer.style.bottom = 'auto'
      popupContainer.style.transform = 'translateX(-50%)'

      //prikazujemo popup, ako je ukljuceno
      console.log(isEnabled)
      if (isEnabled) {
        popupContainer.classList.remove('not-visible')

        const popupRect = popupContainer.getBoundingClientRect()

        //Ako prozor izadje van viewporta ekrana, moramo da ga vratimo
        if (popupRect.left < 0) {
          popupContainer.style.left = popupRect.width / 2 + 20 + 'px'
        }
        //Ako overflovuje desno

        if (window.innerWidth < popupRect.right) {
          // alert('svice')
          popupContainer.style.right = '20px'
          popupContainer.style.transform = 'translateX(0%)'
          popupContainer.style.left = 'auto'
        }
        //ako overflovuje dole

        console.log('bottom overflow:', window.innerHeight, popupRect.bottom)
        if (window.innerHeight < popupRect.bottom) {
          popupContainer.style.bottom = '20px'

          popupContainer.style.top = 'auto'
        }
        const text = await translateText(window.getSelection())
        translatedText.innerText = text
      }
    } else {
      popupContainer.classList.add('not-visible')
    }
  }
  //close popup

  let closePopup = function () {
    popupContainer.classList.add('not-visible')
    console.log('Closed translate popup...')
  }

  let previousSelectedText = ''
  document.addEventListener('selectionchange', () => {
    previousSelectedText = window.getSelection().toString()
  })

  //kada korisnik zavrsi sa selekcijom, prikazi popup ako ima selektovanog teksta
  document.addEventListener('mouseup', showPopup)

  closeButton.addEventListener('click', closePopup)

  //komunikacija
  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (message.type === 'turn') {
      isEnabled = message.enabled
    }
    if (message.type === 'checkEnabled') {
      sendResponse(isEnabled)
    }
  })
})()
