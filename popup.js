let toggler = document.querySelector('.toggler-item')
let text = document.querySelector('.toggler-text')
let isEnabled = false
console.log('popup script')

document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0]

    chrome.tabs.sendMessage(
      activeTab.id,
      {
        type: 'checkEnabled',
      },
      (response) => {
        isEnabled = response
        // alert(isEnabled)
        if (isEnabled) {
          toggler.classList.add('active-toggler')
          text.innerHTML = 'Enabled'
        } else {
          toggler.classList.remove('active-toggler')
          text.innerHTML = 'Disabled'
        }
      }
    )
  })
})

toggler.addEventListener('click', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0]

    if (!isEnabled) {
      toggler.classList.add('active-toggler')
      text.innerHTML = 'Enabled'
    } else {
      toggler.classList.remove('active-toggler')
      text.innerHTML = 'Disabled'
    }

    isEnabled = !isEnabled
    console.log(isEnabled)
    chrome.tabs.sendMessage(activeTab.id, {
      type: 'turn',
      enabled: isEnabled,
    })
  })
})
