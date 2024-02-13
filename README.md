
# linkedin scrapper bot

El objetivo de este proyecto es hacer un bot que salude a los nuevos usuarios y los catalogue dentro del servidor de discord Lautidev a traves del scrapping de datos de las cuentas de linkedin de los nuevos usuarios.




## Principios

Cualquier usuario del servidor puede participar del desarrollo de este bot. Desde sacar features hasta resolver bugs. Es un servidor de la comunidad para la comunidad.

## Como participar?

Primero, para participar debes ser parte de la comunidad de [discord](https://discord.gg/P7g9XJ4URc)


## Colaborar con codigo
Si deseas contribuir con código, por favor:

- Revisa los issues abiertos o crea uno nuevo explicando la mejora o el bug a solucionar.

- Hace un fork del repositorio.

- Crea una nueva rama para tu feature o corrección de bug.

- Escribe y prueba tu código.

- Asegúrate de seguir las guías de estilo del código existente.

- Envía un Pull Request hacia la branch develop con una descripción detallada de los cambios propuestos y referencia el issue relacionado.

## Contribuir con ideas, bugs o feedback

Si tienes ideas, encuentras un bug o quieres dar feedback sobre el proyecto:

- Abre un nuevo issue en el repositorio describiendo tu idea, el bug encontrado o el feedback que deseas compartir.
- Sé lo más detallado posible en la descripción.
- Si es posible, incluye capturas de pantalla o cualquier otro recurso que pueda ayudar a entender mejor tu punto.


# complete the .env file
- with LI cookie value. get from here: https://www.youtube.com/watch?v=H8BVdAIyFJM
- with discord app token. get from here: https://discord.com/developers/applications
- guild_id and client_id is required to register commands for this app in the server.

# how to run
- complete env file.
- run ```node register-commands.js``` only once
- run ```node ./src/index.js```

# how to use in the server
- invide the bot to the channel with this link: `https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=0&scope=bot%20applications.commands`
- - replace CLIENT_ID for yours (this is the application id)
- type ```/perfil url``` url is the link of your desired LI profile: ex.: https://www.linkedin.com/in/matias-gumma/