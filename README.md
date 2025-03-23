# DT210G - Projekt

## Info
Uppgiften använder sig av MongoDB som databas, den är uppladdad via Render. Då det används Render både för funktioner vid inlogg och hämta innehåll till den (hemliga sidan) så kan det ta en stund då Render går ner i viloläge då den ej används. 

I databasen finns det två collection som ser ut enligt nedan.
 
### User

| Id   | username    | password    | role | account_created   | __v  | 
| ---- | -------------- | ---------- | ---------- | ---------- | -------- |
| 1  | Användarnamn  | Lösenord   | Roll | 2021-01-01 T 15:05:40     | 0 |

### Review

| id   | BookId    | UserId    | title  | username |  content  |  grade  | post_created  | __v  | 
| ---- | -------------- | ---------- | ---------- | -------- |  --------  |  --------  | --------  | --------  | 
| 1  | bokens id  | användarens id  | titel  | användaren | recensionen  |  Betyg (1-5)  |  2021-01-01 T 15:05:40 |  0 | 



## Användning
 Hur man användet det:

| Metod   | Url ändelse    | Beskrivning   | 
| ---- | -------------- | ---------- | 
| GET   | /review    | Hämtar recensioner   | 
| GET   | /review:bookid    | Hämtar recensioner baserat på bokensid   | 
| GET   | /review:userid    | Hämtar recensioner baserat på userid   | 
| GET   | /review:one/id    | Hämtar en recension baserat på id   | 
| POST   | /review    | Registrerar en ny review, funkar endast då man är inloggad   | 
| PUT   | /review:id    | Ändrar en review baserat på id, funkar endast då man är inloggad | 
| DELETE   | /review:id    | Raderar en review baserat på id, funkar endast då man är inloggad | 
| POST   | /register    | Registrerar ny användare | 
| POST   | /login    | Loggar in med en befintlig användare | 
