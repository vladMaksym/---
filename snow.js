document.addEventListener('DOMContentLoaded', () => {
    const snowContainer = document.body;
    const snowflakeCount = 50; // Количество снежинок
  
    for (let i = 0; i < snowflakeCount; i++) {
      const snowflake = document.createElement('div');
      snowflake.className = 'snowflake';
      snowflake.style.left = Math.random() * 97 + 'vw'; // Рандомное положение по ширине
      snowflake.style.animationDuration = Math.random() * 3 + 6 + 's'; // Разная скорость падения
      snowflake.style.animationDelay = Math.random() * 5 + 's'; // Разная задержка
      snowflake.innerHTML = '<div class="inner">❅</div>';
      snowContainer.appendChild(snowflake);
    }
  });
  