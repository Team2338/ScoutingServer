import {
	ITokenHeaderResponse,
	ITokenModel,
	ITokenPayloadResponse,
	ITokenResponse,
	UserRole
} from '@gearscout/models';

class AuthEngine {

	createTokenModel = (token: string): ITokenModel => {
		const response: ITokenResponse = this.convertTokenStringToResponse(token);
		return this.convertTokenResponseToModel(response);
	};

	private convertTokenStringToResponse = (tokenString: string): ITokenResponse => {
		const parts: string[] = tokenString.split('.');
		const headerString: string = window.atob(parts[0]); // Decode from Base64
		const payloadString: string = window.atob(parts[1]); // Decode from Base64
		const header: ITokenHeaderResponse = JSON.parse(headerString);
		const payload: ITokenPayloadResponse = JSON.parse(payloadString);

		return {
			header: header,
			payload: payload
		};
	};

	private convertTokenResponseToModel = (response: ITokenResponse): ITokenModel => {
		return {
			tokenId: response.payload.jti,
			userId: response.payload.sub,
			teamNumber: response.payload.tno,
			role: response.payload.rol as UserRole,
			tokenCreationDate: response.payload.iat
		};
	};

}

export const authEngine = new AuthEngine();
