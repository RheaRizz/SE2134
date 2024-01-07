
document.addEventListener('DOMContentLoaded', () => {

    const animalIcons: string[] = ['fa-fish', 'fa-cat', 'fa-dog', 'fa-dragon']

    const colors: string[] = ['#FF5733', '#33FFA6', '#3366FF', '#FF33D1']
  
    let storedAnimal: string | null = localStorage.getItem('inviscord.animal')

    let storedColor: string | null = localStorage.getItem('inviscord.color')

  
    if (!storedAnimal || !storedColor) {

      storedAnimal = animalIcons[Math.floor(Math.random() * animalIcons.length)]

      storedColor = colors[Math.floor(Math.random() * colors.length)]
  
      localStorage.setItem('inviscord.animal', storedAnimal)

      localStorage.setItem('inviscord.color', storedColor)

    }
    
  
    const userAvatar: HTMLElement | null = document.getElementById('user-avatar')

    if (userAvatar) {

      userAvatar.innerHTML = `<i class="fa-solid ${storedAnimal}" style="color: ${storedColor};"></i>`

    }

  })
  