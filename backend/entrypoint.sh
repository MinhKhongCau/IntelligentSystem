 my_db_container:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      ACCEPT_EULA: "Y"
      MSSQL_SA_PASSWORD: "Hey!Don't look here. Bad!"
    ports:
      - "1433:1433"
    networks:
      - dev_network
    volumes:
      - ./db-init/init.sql:/db/init.sql
      - ./db-init/entrypoint.sh:/entrypoint.sh
    entrypoint: ["/bin/bash", "/entrypoint.sh"]