# OTEL Workshop App

## Challenges

Elke challenge bevat een omschrijving en uitklapbare vakjes, dit zijn vervolgstappen die je pas moet gaan openen als je klaar bent voor de volgende stap.

**Gebruik alleen de [control-api](apps/control-api). De andere projecten zijn er om een gedistribueerd systeem na te bootsen. Behandel deze stukken code als onderdelen die worden onderhouden door een ander software-team; jij hebt er in de praktijk dus geen toegang tot.**

### Challenge 2

#### Opdracht

Metrics zijn op verschillende manieren handig. Je wil bijvoorbeeld weten hoe lang iets duurt, om te bepalen of dat normaal is of dat er een probleem aan de hand is. Deze opdracht leert je om een Counter te gebruiken zodat je kan meten hoe vaak de 'charge' en 'discharge' endpoints worden aangeroepen.

Maak voor zowel de charge en discharge endpoints een counter aan. Tel bij elke aanroep van de endpoints de counter op. Standaard worden metrics in snake_case genoteerd.

De volgende methodes heb je nodig:

- `getOrCreateMetric`: hiermee kan je een metric aanmaken. Je IDE zal aangeven welke velden nodig zijn.
- `increment`: hiermee kan je de counter verhogen. Deze heeft een nummer nodig om te bepalen hoeveel de counter omhoog moet.

OpenTelemetry ondersteunt nog een aantal andere metric types, zoals:

- Histogram: voor het meten van de distributie van waardes
- Gauge: voor het meten van een waarde die kan veranderen, een goed voorbeeld hiervoor is het meten van het laatste tijdstip dat iets gebeurt is of de snelheid van een proces.

_Hoe kan je zien dat de counter wordt verhoogd?_

Via Prometheus kan je de metrics queryen. Dit kan je doen door:

- Navigeer naar Grafana, staat op [http://localhost:3000](http://localhost:3000)
- Kies bij de sidebar Explore [explore](http://localhost:3000/explore?schemaVersion=1&panes=%7B%22t5b%22:%7B%22datasource%22:%22prometheus_uid%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22expr%22:%22%22,%22range%22:true,%22datasource%22:%7B%22type%22:%22prometheus%22,%22uid%22:%22prometheus_uid%22%7D%7D%5D,%22range%22:%7B%22from%22:%22now-1h%22,%22to%22:%22now%22%7D%7D%7D&orgId=1)
- Selecteer `Prometheus` als datasource.
- Vervolgens kan je een query invullen, bijvoorbeeld: `instruction_status_endpoint_calls_total`. (Bij een counter wordt er altijd `_total` achter de naam gezet, dus ookal geef je dit niet aan, moet je dat wel doen hier).
- Klik op `Run query` om de query uit te voeren.
- Heb je labels toegevoegd? Dan zul je sowieso meer datapunten zien, je kan hier op filteren. Bijvoorbeeld door het volgende in te voeren: `battery_instruction_calls_total{instruction="charge"}`

**EXTRA: Zorg dat je maar een counter instantie nodig hebt voor beide status** <br>
**EXTRA: Gebruik dependency injection om de counter mee te geven**

#### Als je er niet uikomt

<details>
<summary>Counter maken</summary>

Een counter kun je aanmaken door de `getOrCreateMetric` aan te roepen. Voor een Counter zijn de volgende onderdelen nodig:

```typescript
const myCounter = getOrCreateMetric({
  type: 'Counter',
  valueType: ValueType.INT,
  description: 'Number of times the instruction status endpoint was called',
  name: 'instruction_status_endpoint_calls',
});
```

</details>
<details>
<summary>Increment op een counter</summary>

Een counter kan je verhogen door de `increment` methode aan te roepen. Deze heeft een nummer nodig om te bepalen hoeveel de counter omhoog moet.

```typescript
myCounter.increment(1);
```

</details>

<details>
<summary>Dependency injection</summary>

Je kan de counter meegeven aan de class (bijvoorbeeld de controller) door hem in de constructor mee te geven en te decoraten met de `@injectMetric` decorator. Vervolgens moet je deze dan ook meegeven in de `provide` array van de module.

Bij voorkeur maak je een constante aan voor de naam van de provider, zodat je bij een wijziging van de naam niet overal in de code hoeft te zoeken naar de juiste naam. (bijvoorbeeld: `const MY_COUNTER_NAME='instruction_status_endpoint_calls'`)

**De class**

```typescript
import {injectMetric} from '@zonneplan/open-telemetry-nest';

@Injectable()
export class BatteryService {
  constructor(@injectMetric('instruction_status_endpoint_calls') private readonly myCounter: Counter) {
  }
}
```

**De [app.module](apps/control-api/src/app/app.module.ts)**

```typescript


@Module({
  imports: [MetricsModule],
  providers: [
    {
      createCounterProvider({
                              valueType: ValueType.INT,
                              description: 'Number of times the instruction status endpoint was called',
                              name: 'instruction_status_endpoint_calls',
                            })
    }
  ],
})
export class BatteryModule {
}
```

</details>

### Challenge 1

#### Opdracht

Je wilt de batterij gaan opladen. Dit kan je doen door de [charge endpoint](http://localhost:3001/api#/default/BatteryController_charge) aan te roepen.
Vervolgens verwacht je dat de batterij gaat laden. Dit kan je controleren door het [battery info endpoint](http://localhost:3001/api#/default/BatteryController_getInfo) aan te roepen.

<details>
<summary>Wat zie je?</summary>
Er komt geen batterij informatie door. Hoe kan je via logs inzichtelijk maken wat er mis gaat? Welk log level zou je hiervoor gaan gebruiken?
</details>

#### Als je er niet uitkomt

<details>
<summary>Een logger toevoegen aan de dependency injection</summary>
Het is voor deze challenge het makkelijkste om de `@zonneplan/open-telemetry-zonneplan` log package te gebruiken, zodat je straks ook makkelijk logs inzichtelijk krijgt in grafana.

In de [app.module](apps/control-api/src/app/app.module.ts) kan je de `LoggerModule` toevoegen aan de imports. Hiermee kan je de `LoggerService` injecten in de `BatteryService`, waardoor de `BatteryService` een dependency wordt.

<details>
<summary>Code voorbeeld LoggerModule</summary>

```typescript
import {LoggerModule} from '@zonneplan/open-telemetry-zonneplan';

@Module({
  imports: [LoggerModule],
})
export class AppModule {
}
```

</details>

<details>
<summary>Code voorbeeld LoggerService</summary>

```typescript
import {LoggerService} from '@zonneplan/open-telemetry-zonneplan';

@Injectable()
export class BatteryService {
  constructor(private readonly logger: LoggerService) {
  }
}
```

</details>
<br>
</details>

<details>
<summary>Duidelijk maken van welke plek een log bericht komt</summary>
In de constructor van een class kan je een context zetten via `myService.setContext('my-context')` zodat je weet op welke plek de log precies wordt aangeroepen.
</details>

<details>
<summary>Een log bericht plaatsen</summary>

Zie de mogelijke methods van de [LoggerService](node_modules/@zonneplan/open-telemetry-nest/dist/src/logging/services/logger.service.d.ts) en kies de juiste voor jouw situatie.

</details>

## Setup

1. Run `npm install` to install all dependencies
2. Run the docker-compose by running: `docker-compose -p otel-workshop -f docker/docker-compose.yml up -d`
3. Prepare the database: `npm run db:prepare`
4. Run all apps: `npm run all`
5. Go to the API: [http://localhost:3001/api](http://localhost:3001/api)

## Application flows

**Get battery info**

```mermaid
sequenceDiagram
  actor m as Me
  participant C as ControlApi
  participant BA as BatteryApi
  participant K as Kafka
  participant B as Battery

  loop Every 5 seconds
    Note over B, BA: This loops runs constantly in the background
    B ->> K: Publish Measurements
    BA ->> K: Consume Measurements
    BA ->> BA: Cache latest info
  end

  m ->> C: Get battery info
  C ->> BA: GetBatteryInfo()
  BA ->> BA: Get latest info
  BA ->> C: Return latest info
  C -->> m: Return latest info
# battery constantantly listens via kafka for new info on Measurements topic

```

**Dis(charge) battery**

```mermaid
sequenceDiagram
  actor m as Me
  participant C as ControlApi
  participant BA as BatteryApi
  participant K as Kafka
  participant B as Battery
  participant P as Postgres
  m ->> C: Charge battery
  C ->> BA: ChargeBattery()
  BA ->> K: Publish charge instruction
  Note right of BA: Battery listens to charge instructions via Kafka and acts upon it<br/>We can only say that the message was sent, not that it is handled
  BA --> C: Return success
  C -->> m: Return success
  K ->> B: Consume Charge instruction
  B ->> B: Charge battery
  B ->> K: Publish instruction success
  C ->> K: Consume instruction success
  C ->> P: Set instruction handled
```

**Track instruction**

```mermaid
sequenceDiagram
  actor m as Me
  participant C as ControlApi
  participant P as Postgres
  m ->> C: Track instruction
  C ->> P: Get instruction status
  P ->> C: Return instruction status
  C -->> m: Return instruction status
```
