# jd-sign-bot

## Getting Started

### 1. Get JD cookie

1. Open chrome Devtools and toggle device
2. Using mobile phone login JD with url: https://plogin.m.jd.com/login/login 
3. Devtools `Network` window filter content with `m.jd.com`
4. Find `m.jd.com` http request and click the request
5. Copy http header cookie value

### 2. Depoly Bot

1. Fork project
2. Set project secrets
   - `JD_COOKIE`: paste the JD cookie to `Value` input
3. Set project actions to `Allow all actions`
4. Done
