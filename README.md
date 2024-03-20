# OTEL Workshop App

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
