export enum LoginErrors {
	unauthorized = 'You are not authorized to use this app yet',
	unknown = 'Oops, something went wrong'
}

export enum UploadErrors {
	unauthorized = 'You are not authorized to use this app yet',
	fileTooLarge = 'Image too large; must be < 10MB',
	badFileType = 'Image must be either .png or .jpeg',
	unknown = 'Oops, something went wrong'
}
