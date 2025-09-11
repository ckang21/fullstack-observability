# OAuth2 / OIDC Notes

Goal: add OAuth2 login to the API or a frontend client.

Options:
- Use Auth0 or GitHub OAuth for a quick demo
- Protect a route by verifying JWT (RS256) in an Express middleware

Steps (Auth0 as example):
1. Create an Auth0 application (Regular Web App)
2. Configure callback URL: http://localhost:3000/callback (if using a frontend) or http://localhost:4000/callback (if handling at API)
3. In API, add an Express route that exchanges code for tokens via Auth0's `/oauth/token`
4. Verify access token on protected routes using `jwks-rsa` and `express-jwt`

Recommended libs:
- `passport`, `passport-auth0` for session-based flow; or
- for SPA: front-end uses PKCE; API verifies Bearer token using JWKS

Security note:
- Never commit client secrets. Use `.env` and CI secrets.
