/** @type { import('next').NextConfig } */
module.exports = {
	reactStrictMode: true,
	images: {
		loader: 'akamai',
		path: '/',
		domains: ['cdn.crni.xyz'],
	},
};
