export enum UserRoles {
	admin = 'ADMIN',
	superAdmin = 'SUPERADMIN',
}

export interface ITokenResponse {
	header: ITokenHeaderResponse;
	payload: ITokenPayloadResponse;
}

export interface ITokenHeaderResponse {
	typ: string; // The type of the token (ie "JWT")
	alg: string; // Hash algorithm used for the signature
}

export interface ITokenPayloadResponse {
	iss: string; // (Issuer) Name of application
	jti: string; // (JWT ID) Unique ID of JWT
	iat: string; // (Issued At) Date at which the token was generated
	sub: number; // (Subject) User ID
	rol: string; // Role of the user
	tno: number; // Team number of the user
}

export interface ITokenModel {
	tokenId: string;
	userId: number;
	teamNumber: number;
	role: UserRoles;
	tokenCreationDate: string; // TODO: Convert to temporal data type
}