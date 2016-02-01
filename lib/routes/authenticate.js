import ldap from 'ldapjs';
import auth0 from 'auth0';
import logger from '../logger';

export default function(domain, clientId) {
  const client = new auth0.AuthenticationClient({
    domain: domain,
    clientId: clientId
  });

  return (req, res, next) => {
    logger.debug(`Bind attempt with ${req.dn.toString()}`);

    const parsedName = req.dn.toString().match(/cn=(.*), ou=(.*)/);
    if (!parsedName || parsedName.length != 3) {
      logger.error(`The username '${req.dn.toString()}' does not match 'CN=username,OU=connection'`);
      return next(new ldap.InvalidDnSyntaxError(`The username '${req.dn.toString()}' does not match 'CN=username,OU=connection'`));
    }

    client.oauth.signIn({ username: parsedName[1], password: req.credentials, connection: parsedName[2] })
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
