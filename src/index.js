require('dotenv').config();
const { AuthInfo, Connection } = require('@salesforce/core');

const ENV_KEYS = {
	instanceUrl: 'SF_INSTANCE_URL',
	loginUrl: 'SF_LOGIN_URL',
	accessToken: 'SF_ACCESS_TOKEN'
};

const STATIC_AUTH_INFO = {
	instanceUrl: process.env[ENV_KEYS.instanceUrl],
	loginUrl: process.env[ENV_KEYS.loginUrl],
	accessToken: process.env[ENV_KEYS.accessToken]
};

const missingEnvVars = Object.entries(ENV_KEYS)
	.filter(([field]) => !STATIC_AUTH_INFO[field])
	.map(([, envName]) => envName);

if (missingEnvVars.length > 0) {
	throw new Error(
		`Missing required environment variable(s): ${missingEnvVars.join(', ')}. ` +
		'Set them in a .env file or your shell before running the script.'
	);
}

const buildAuthInfo = async () => {
	const authInfo = await AuthInfo.create({
		accessTokenOptions: {
			accessToken: STATIC_AUTH_INFO.accessToken,
			instanceUrl: STATIC_AUTH_INFO.instanceUrl,
			loginUrl: STATIC_AUTH_INFO.loginUrl
		}
	});
	return authInfo.update(STATIC_AUTH_INFO);
};

async function getAccountsWithFields(connection) {
    const accounts = await connection.sobject('Account').find({}, ['Id', 'Name']).limit(50000);
    return accounts;
}

async function getAccountsWithoutFields(connection) {
    const accounts = await connection.sobject('Account').find({}).limit(50000);
    return accounts;
}
(async () => {
	try {
		const authInfo = await buildAuthInfo();
		const conn = await Connection.create({ authInfo });
		const identity = await conn.identity();
        const accountsWithFields = await getAccountsWithFields(conn);
        console.log(`retrieved accounts with fields size: ${accountsWithFields.length}`);
        const accountsWithoutFields = await getAccountsWithoutFields(conn);
        console.log(`retrieved accounts without fields size: ${accountsWithoutFields.length}`);
	} catch (error) {
		console.error('Salesforce query failed:');
		console.error(error instanceof Error ? error.message : error);
		process.exit(1);
	}
})();
