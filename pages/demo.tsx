import CustomModal from '../components/CustomModal';
import { Flex } from '@chakra-ui/react';

const Demo = () => {
	return (
		<Flex w='100%' h='100vh' justifyContent={'center'} alignItems={'center'} bg='transparent' >
			<CustomModal data={{
				title: 'Demo Form',
				key: 'demo',
				modal: [{
					custom_id: 'username',
					label: 'Username',
					style: 1,
					placeholder: 'Digital',
					required: true,

					min_length: 3,
					max_length: 16,
				},{
					custom_id: 'bio',
					label: 'Bio',
					placeholder: 'Some software engineer.',
					style: 2,
					required: false,

					min_length: 20,
					max_length: 256,
				}],
			}} />
		</Flex>
	);
};

export default Demo;
