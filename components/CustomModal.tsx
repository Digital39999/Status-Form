import { Box, Button, Image as ChakraImage, Flex, HStack, Heading, Input, Text, Textarea, VStack, chakra } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { APIResponse } from '../pages';
import Message from './Message';

export type Modal = {
	custom_id: string;
	label: string;
	style: 1 | 2; // short or long (https://media.discordapp.net/attachments/1041699450705420338/1113216623789232128/image.png)
	value?: string; // prefiled value
	placeholder?: string; // placeholder grayed in on empty
	required: boolean; // required field

	// checks
	min_length?: number;
	max_length?: number;
}

export type MessageCheck = {
	type: 'error' | 'success' | 'warn' | undefined;
	message?: string;
}

export default function CustomModal({ data }: APIResponse) {
	const [message, setMessage] = useState<MessageCheck>({ type: undefined, message: undefined });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDisabled, setIsDisabled] = useState(false);

	const [formData, setFormData] = useState(data?.modal?.map((input) => ({
		name: input.custom_id,
		value: input.value || '',
	})));

	useEffect(() => {
		if (!data?.modal?.length && data?.isRoot) setMessage({ type: 'warn' });
		else if (!data?.modal?.length) setMessage({ type: 'error', message: 'There was an error fetching the form.' });
	}, [data?.modal]);

	useEffect(() => {
		setIsDisabled(!data?.modal || data.isRoot || isSubmitting || !!message.type || data?.modal.some((input) => {
			if (input.required && !formData?.find((data) => data.name === input.custom_id)?.value) return true;
			if (input.min_length && (formData?.find((data) => data.name === input.custom_id)?.value.length || 0) < input.min_length) return true;
			if (input.max_length && (formData?.find((data) => data.name === input.custom_id)?.value.length || 0) > input.max_length) return true;
		}));
	}, [formData, isSubmitting]);

	const submit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setIsSubmitting(true);

		const response = await fetch(data?.callback || `https://${data?.isDev ? 'status-local.crni.xyz' : 'api.statusbot.us'}/data/form/${data?.key}`, {
			method: 'POST',
			body: JSON.stringify({
				form: formData,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(async (r) => await r.json()).catch(() => null) as { status: number; message?: string; data?: { success: boolean; }; } | null; // message is for errors, data is for success

		if (response?.data?.success) {
			setIsDisabled(true);
			setIsSubmitting(false);

			setMessage({ type: 'success' });
			if (data?.modal.length) data.modal.length = 0;
		} else {
			setMessage({ type: 'error', message: response?.message || 'There was an error submitting this form.' });
			setIsDisabled(true);
			setIsSubmitting(false);
		}
	};

	return (
		<VStack bg='#36393f' color='white' rounded={'lg'} align={'start'} maxW={'440px'} w='100%' fontWeight={500}>
			<chakra.form onSubmit={async (e) => await submit(e)} w='100%' display={'flex'} gap={2} flexDir={'column'}>
				<VStack p={4} align={'start'} w='100%'>

					<HStack pb={3} fontSize='lg'>
						<ChakraImage alt='icon' src={data?.icon || 'https://cdn.crni.xyz/r/status.png'} width={8} height={8} rounded={'full'} />
						<Heading fontSize={'xl'} fontFamily={'body'}>
							{data?.title || 'Status Bot Form'}
						</Heading>
					</HStack>
					<VStack align={'start'} w='100%' spacing={3}>
						{message.type && Message(message)}

						{data?.modal?.map((m, i) => (
							<VStack w='100%' spacing={1} align={'start'} key={i}>
								<Text fontSize={'sm'} textTransform={'uppercase'}>
									<Box as='span' opacity={.82}>{m.label}</Box>
									{m.required && <Box as='span' color='#f17f7e' ml={1}>*</Box>}
								</Text>

								{m.style === 1 ?
									<Input name={m.custom_id} defaultValue={m.value || ''} height='3rem' placeholder={m.placeholder} variant={'filled'} bg='#202225' rounded={'md'} pl={2.5} required={m.required}
										_placeholder={{
											color: '#6e7073',
										}}
										_hover={{
											bg: '#202225',
										}}
										onChange={(e) => {
											setFormData(formData?.map((data) => {
												if (data.name === m.custom_id) return { name: m.custom_id, value: e.target.value };
												return data;
											}));
										}}
									/>
									:
									<Textarea name={m.custom_id} defaultValue={m.value || ''} height='8rem' placeholder={m.placeholder} variant={'filled'} bg='#202225' rounded={'md'} pl={2.5} required={m.required}
										_placeholder={{
											color: '#6e7073',
										}}
										_hover={{
											bg: '#202225',
										}}
										onChange={(e) => {
											setFormData(formData?.map((data) => {
												if (data.name === m.custom_id) return { name: m.custom_id, value: e.target.value };
												return data;
											}));
										}}
									/>
								}

								<Flex w='100%' justify='space-between'>
									<Box>
										{m.min_length && (formData?.find((data) => data.name === m.custom_id)?.value.length || 0) < m.min_length ? (
											<Text fontSize='x-small' color='#f17f7e' alignSelf='start'>Minimum length is {m.min_length}.</Text>
										) : m.max_length && (formData?.find((data) => data.name === m.custom_id)?.value.length || 0) > m.max_length ? (
											<Text fontSize='x-small' color='#f17f7e' alignSelf='start'>Maximum length is {m.max_length}.</Text>
										) : null}
									</Box>
									<Box>
										{m.min_length && m.max_length && (
											<Text fontSize='x-small' fontWeight={400} opacity={0.7} alignSelf='end'>
												{`${(formData?.find((data) => data.name === m.custom_id)?.value.length || 0)}/${m.max_length}`}
											</Text>
										)}
									</Box>
								</Flex>

							</VStack>
						))}

					</VStack>
				</VStack>

				<HStack bg='#2f3136' spacing={2} w='100%' py={3.5} px={4} justifyContent={'flex-end'} borderBottomRadius={'lg'}>
					<Button variant={'ghost'} rounded={'5px'} _hover={{ bg: '#1d1f23', color: 'white' }} onClickCapture={() => { window.location.href = data?.support || 'https://discord.gg/4rphpersCa'; }}>Contact Support</Button>
					<Button bg='#5865f2' rounded={'5px'} _hover={{ bg: '#5865f2' }} type='submit' isLoading={isSubmitting} isDisabled={data?.isRoot || isDisabled}>{isDisabled && message.type === 'success' ? 'Submitted' : message.type === 'error' ? 'Error' : message.type === 'warn' ? 'Not Allowed' : 'Submit'}</Button>
				</HStack>
			</chakra.form>
		</VStack>
	);
}
