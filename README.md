# Progetto web-programming

Benvenuti, il repository contiene un'applicazione web per la gestione di una piscina con aree utente e amministratore.

## Tecnologie Utilizzate

- React: Framework per la costruzione dell'interfaccia utente
- Bootstrap: Framework CSS per un design responsive e moderno
- Node.js: Runtime JavaScript per il lato server
- MySQL: Database relazionale per la memorizzazione dei dati

## Prerequisiti
Per eseguire l'applicativo è necessario aver installato un database mysql e node.js
Link mysql: 'https://dev.mysql.com/downloads/installer/'
Link per node: 'https://nodejs.org/'

## Installazione

1. Clone il repository: `git clone https://github.com/GiovanniTorrisi28/Progetto-Web-Programming.git`
2.  Crea un nuovo database vuoto nel tuo ambiente MySQL. Puoi farlo utilizzando il client MySQL. Ora esegui l'importazione del file 
    'piscina.sql' digitando 'mysql -u tuo_utente -p nome_del_database < piscina.sql' o utilizzando qualche strumento di amministrazione
3. Entra nella directory: `cd Progetto-Web-Programming`
4. Installa le dipendenze per il frontend: `cd pisicna' e poi'npm install`  
5. Torna alla directory principale: `cd ..`
6. Installa le dipendenze per il backend: `cd pisicna' e poi'npm install` 

## Configurazione

1. Andare nel file /server/db-config.js e configurare le proprie credenziali di accesso al database

## Utilizzo

1. Avvia il server backend: 'cd server' e 'node server.js'
2. Avvia il frontend: `cd piscina' e 'npm start`

## Funzionalità Principali

- Area Utente: Gli utenti possono accedere al proprio account, visualizzare gli abbonamenti,iscriversi a gare e scrivere note personali.
- Area Amministratore: Gli amministratori possono gestire la partecipazione alle gare degli utenti,gli abbonamenti, le attività e gli 
  allenatori 

## Contatti

- Email: giovanni.torrisi6@gmail.com

