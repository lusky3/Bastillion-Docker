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

- **Bastillion**: http://localhost:9080
  - Username: `admin`
  - Password: `changeme`
  - Note: First login requires setting a new password

- **SSH Target**: `ssh-target:2222`
  - Username: `testuser`
  - Password: `testpass123`

## Tests Included

1. **Login Page Load** - Verifies UI loads correctly
2. **Authentication** - Tests login with default credentials
3. **Admin Area Access** - Verifies successful login and admin access

## Manual Testing for SSH Functionality

The automated tests cover basic authentication and UI access. For full end-to-end SSH testing:

1. Start the test environment: `docker compose -f ../docker-compose.test.yml up`
2. Access Bastillion at http://localhost:9080
3. Login with `admin` / `changeme`
4. Complete the password change requirement
5. Navigate to Systems → Add System
6. Add the SSH target:
   - Display Name: `Test SSH Server`
   - Host: `ssh-target`
   - Port: `2222`
   - User: `testuser`
   - Password: `testpass123`
7. Navigate to Terminals → Create Session
8. Select the test system and create a terminal session
9. Verify SSH connection works in the web terminal

## Cleanup

```bash
docker compose -f docker-compose.test.yml down -v
```
