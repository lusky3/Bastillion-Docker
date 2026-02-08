# Bastillion Testing

## Setup

```bash
cd tests
npm install
npx playwright install chromium
```

## Run Tests

### With Docker Compose (automatic)
```bash
npm test
```

### Manual Docker Compose
```bash
# Terminal 1: Start services
docker compose -f docker-compose.test.yml up

# Terminal 2: Run tests
cd tests
npm test
```

### Interactive Mode
```bash
npm run test:ui
```

## Test Environment

- **Bastillion**: https://localhost:8443
  - Username: `admin`
  - Password: `changeme`

- **SSH Target**: `ssh-target:2222`
  - Username: `testuser`
  - Password: `testpass123`

## Tests Included

1. **Login Page Load** - Verifies UI loads correctly
2. **Authentication** - Tests login with default credentials
3. **Add SSH System** - Adds test SSH server to Bastillion
4. **Terminal Navigation** - Verifies terminal page access

## Cleanup

```bash
docker compose -f docker-compose.test.yml down -v
```
