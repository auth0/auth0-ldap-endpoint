import ldap from 'ldapjs';
import auth0 from 'auth0';
import logger from '../logger';

export default function(domain, token) {
  const client = new auth0.ManagementClient({
    domain: domain,
    token: token
  });

  return function(req, res, next) {
    logger.info(`Searching '${req.dn.toString()}' (scope: ${req.scope || 'N/A'}, attributes: ${req.attributes || 'N/A'}): ${JSON.stringify(req.filter.json, null, 2)}`);

    const parsedUnit = req.dn.toString().match(/ou=(.*)/);
    if (!parsedUnit || parsedUnit.length != 2) {
      logger.error(`The distinguished name '${req.dn.toString()}' does not match 'OU=Auth0-Connection-Name'`);
      return next(new ldap.InvalidDnSyntaxError(`The distinguished name '${req.dn.toString()}' does not match 'OU=Auth0-Connection-Name'`));
    }

    if (!req.filter.json || req.filter.json.type != 'EqualityMatch' || req.filter.json.attribute != 'email') {
      logger.error(`This server only allows you to search for users by email.`);
      return next(new ldap.UnwillingToPerformError(`This server only allows you to search for users by email.`));
    }

    const params = {
      search_engine: 'v3',
      q: `email:"${req.filter.json.value}" AND identities.connection:"${parsedUnit[1]}"`
    };

    logger.debug(`Searching for: ${JSON.stringify(params, null, 2)}`);

    client.getUsers(params, (err, users) => {
      if (err) {
        logger.error(`Search error: ${JSON.stringify(err, null, 2)}`);
        return next(new ldap.OperationsError('Search failed.'));
      }

      users.forEach(user => {
        logger.debug(`Found user: ${JSON.stringify(user, null, 2)}`);
        
        res.send({
          dn: `CN=${user.email}, OU=${user.identities[0].connection}`,
          attributes:  {
            userPrincipalName: user.email,
            cn: user.email,
            objectClass: [ 'user' ],
            objectCategory: [ 'user' ]
          }
        });
      });

      res.end();
      return next();
    });
  };
}
