import CustomModal, { Modal } from '../components/CustomModal';
import type { NextPageContext } from 'next';
import { Flex } from '@chakra-ui/react';

const Home = ({ data }: APIResponse) => {
	return (
		<Flex w='100%' h='100vh' justifyContent={'center'} alignItems={'center'} bg='transparent' >
			<CustomModal data={data} />
		</Flex>
	);
};

export default Home;

export type APIResponse = {
	data: {
		isRoot: boolean;

		modal: Modal[];
		title: string;
		icon?: string;

		support?: string;
		callback?: string;

		isDev?: boolean;
		key: string;
	} | null;
};

async function fetchInputs(options: { key: string; url: string; dev: boolean; }): Promise<APIResponse | null> {
	const data = await fetch(options.url || `http://${options.dev ? 'localhost:3003' : 'api.statusbot.us'}/data/form/${options.key}`).catch(() => null);
	if (!data) return { data: null };

	try {
		const json = await data.json() as APIResponse;
		if (!json?.data) return { data: null };

		return {
			data: {
				...json.data,
				isDev: options.dev,
				key: options.key,
			},
		};
	} catch {
		return { data: null };
	}
}

Home.getInitialProps = async (context: NextPageContext) => {
	const isRoot = context.asPath === '/';
	if (isRoot) return { data: { isRoot: true, modal: [] } };

	const { query } = context;
	const { key, url, dev } = query;
	if (!key) return { data: null };

	const data = await fetchInputs({ key: key as string, url: url as string, dev: dev === 'true' });
	if (!data) return { data: null };

	return data;
};
