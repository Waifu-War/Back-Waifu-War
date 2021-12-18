## Routes existantes

- /waifu
    -  /
        -  GET : Obtient toutes les waifus existantes
        -  POST : permet de créer une waifu
    -  /:id
        -  GET : permet d'obtenir la waifu associé à l'id
        -  PUT : permet de modifier la waifu associé à l'id
        -  DELETE : permet de supprimer la waifu associé à l'id
- /user
    - /
        - GET : Obtient tout les users
        - POST : permet de créer un user
    - /:id
        - GET : permet d'obtenir l'user associé à l'id
        - PUT : permet de modifier l'user associé à l'id
        - DELETE : permet de supprimer la waifu associé à l'id
    - /:tag
        - GET : permet d'obternir l'user associé au tag
- /userGrade
    - /
        - GET : Obtient tout les grades existants
        - POST : permet de crér un grade
    - /:name
        - GET : Permet d'obtenir le grade associé au nom
        - PUT : Permet de modifier le grade associé au nom
        - DELETE : Permet de supprimer le grade associé au nom