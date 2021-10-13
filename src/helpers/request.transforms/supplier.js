const transformRequest = ({
  legalName,
  fantasyName,
  rut,
  webSiteUrl,
  emailId,
  logoUrl,
  isShared = true,
  inchargeFullName,
  inchargeRole,
  type,
}) => ({
  rut,
  legal_name: legalName,
  fantasy_name: fantasyName,
  web_site_url: webSiteUrl,
  logo_url: logoUrl,
  is_shared: isShared,
  type,
  email_id: emailId,
  in_charge_fullname: inchargeFullName,
  in_charge_role: inchargeRole,
});

module.exports = transformRequest;
