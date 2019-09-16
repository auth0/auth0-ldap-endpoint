# Auth0 LDAP Endpoint

An LDAP server that allows you to connect your legacy applications with Auth0 using the LDAP protocol.

## Supported Features

* Bind
* Search (on email address only)

## Before Getting Started

In the `config.json` file set the following values:

 - `AUTH0_DOMAIN`: Your Auth0 domain (fabrikam.auth0.com)
 - `AUTH0_CLIENT_ID `: Your Auth0 Client Id
 - `AUTH0_API_TOKEN `: Token for the Management API with `read:users` permission (used for search)
 - `LDAP_PORT`: Port on which the LDAP server will listen
 - `LDAP_ADMIN_USER`: The DN of the user that is allowed to do a search. Format: `CN=ADMIN_EMAIL_ADDRESS,OU=AUTH0_CONNECTION_NAME` (eg: `CN=admin@fabrikam.com,OU=Username-Password-Authentication`)
 - `LDAPS_CERTIFICATE`: The certificate chain to use for LDAPS. Must be X509 PEM-encoded, see `cert` argument [here](https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options).
 - `LDAPS_KEY`: Private key corresponding to the configured certificate to use for LDAPS. Must be PEM-encoded, see `key` argument in the above link.
 
## Usage

Install Node.js 5+, then start the server:

```
npm install
node index
```

This will start the LDAP server and allow users to bind and search.

## Example

The [examples/test-client.js](examples/test-client.js) script is a small sample that shows the supported features like `bind` and `search`:

```
node test-client.js

Bind success.
Searching for: {
  "filter": "(email=sandrino@auth0.com)",
  "scope": "sub",
  "attributes": [
    "dn",
    "sn",
    "cn"
  ]
}
Found: {"dn":"cn=sandrino@auth0.com, ou=Username-Password-Authentication","controls":[],"cn":"sandrino@auth0.com"}
Found: {"dn":"cn=sandrino@auth0.com, ou=google-oauth2","controls":[],"cn":"sandrino@auth0.com"}
Search Done. Status: 0
```

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
