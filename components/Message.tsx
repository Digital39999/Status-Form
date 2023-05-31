import { CloseIcon, CheckIcon, WarningIcon } from '@chakra-ui/icons';
import { HStack, Text, Icon } from '@chakra-ui/react';
import { MessageCheck } from './CustomModal';

export default function Message(message: MessageCheck) {
	return (
		<HStack w='100%'
			border={'1px solid ' + (message.type === 'error' ? '#f17f7e' : message.type === 'success' ? '#7bcba7' : '#f5d76e')}
			bg={(message.type === 'error' ? 'rgba(241, 127, 126, 0.1)' : message.type === 'success' ? 'rgba(123, 203, 167, 0.1)' : 'rgba(245, 215, 110, 0.1)')}
			rounded={'lg'}
			alignItems={'center'}
			p={2}
		>
			{/* cool, um we can do Icon as */}
			<Icon as={message.type === 'error' ? CloseIcon : message.type === 'success' ? CheckIcon : WarningIcon}
				color={(message.type === 'error' ? '#f17f7e' : message.type === 'success' ? '#7bcba7' : '#f5d76e')} boxSize={4} />
			<Text>
				{message.message || (message.type === 'error' ? 'There was an error submitting this form.' : message.type === 'success' ? 'Your form has been submitted successfully.' : 'This is a warning message.')}
			</Text>
		</HStack>
	);
}
