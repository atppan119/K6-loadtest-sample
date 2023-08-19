# Load testing with K6

## Setup DB and Grafana
```
docker-compose up -d
```

## K6 Load testing
```
brew install k6

k6 run --out influxdb=http://localhost:8086/k6 k6-scripts/sample.js
```