import { ChakraProvider, ThemeOverride, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Head from 'next/head';

const theme = extendTheme({
	styles: {
		global: () => ({
			body: {
				minH: '100vh',
				bg: 'transparent',
			},
		}),
	},
	colors: {
		brand: {
			900: '#1a365d',
			800: '#153e75',
			700: '#2a69ac',
		},
	},
}) as ThemeOverride;

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider theme={theme}>
			<Head>
				<title>Status Bot Form</title>
				<link rel="icon" href="https://cdn.crni.xyz/r/status.png" />
			</Head>

			<Component {...pageProps} />
		</ChakraProvider>
	);
}

export default MyApp;
