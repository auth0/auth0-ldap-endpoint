import ldap from 'ldapjs';
import nconf from 'nconf';

module.exports = (req, res, next) => {
  if (!req.connection.ldap.bindDN.equals(`${nconf.get('LDAP_ADMIN_USER')}`))
    return next(new ldap.InsufficientAccessRightsError());
  return next();
};
