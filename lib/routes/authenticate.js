import ldap from 'ldapjs';
import auth0 from 'auth0';
import logger from '../logger';

export default function(domain, clientId, clientSecret) {
  const client = new auth0.AuthenticationClient({
    domain: domain,
    clientId: clientId,
    clientSecret: clientSecret
  });

  return (req, res, next) => {
    logger.debug(`Bind attempt with ${req.dn.toString()}`);

    const parsedName = req.dn.toString().match(/cn=(.*), ou=(.*)/);
    if (!parsedName || parsedName.length != 3) {
      logger.error(`The username '${req.dn.toString()}' does not match 'CN=username,OU=connection'`);
      return next(new ldap.InvalidDnSyntaxError(`The username '${req.dn.toString()}' does not match 'CN=username,OU=connection'`));
    }

    client.oauth.passwordGrant({ username: parsedName[1], password: req.credentials, realm: parsedName[2] })
      .then(() => {
        logger.info(`Bind success for ${req.dn.toString()}`);
        res.end();
        return next();
      }).catch(err => {
        logger.error(`Bind failed for ${req.dn.toString()}: "${err.name}"`);
        return next(new ldap.InvalidCredentialsError());
      });
  };
}
