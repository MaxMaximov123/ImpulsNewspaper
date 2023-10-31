import VK from 'node-vk-sdk';
const vk = new VK({
  appId: '51746156',
  token: 'eL8EwQhi0uoi8KSPyAkZ',
});

const group_id = '49814743'; // Идентификатор сообщества

// Получение постов из сообщества
vk.api.wall.get({
  owner_id: `-${group_id}`, // Указываем отрицательный ID для сообщества
  count: 10, // Количество постов, которые вы хотите получить
  offset: 0, // Смещение постов (0 для первой страницы)
}, (error, response) => {
  if (error) {
    console.error('Ошибка при получении постов:', error);
  } else {
    const posts = response.items;
    console.log('Посты из сообщества:', posts);
  }
});
