class Api {
    baseUrl: string;
    tokenUrl: string;
    headers: { Authorization: string };

    constructor(options: {
        baseUrl: string;
        tokenUrl: string;
        headers: { Authorization: string };
    }) {
        this.baseUrl = options.baseUrl;
        this.tokenUrl = options.tokenUrl;
        this.headers = options.headers;
    }

    async _makeRequest(url: string, options = {}, token = false) {
        console.log((token ? url : this.baseUrl + url))
        try {
            const response = await fetch((token ? this.tokenUrl : this.baseUrl + url), options);
            return this._parseResponse(response);
        } catch (err) {
            throw new Error(`Ошибка запроса к серверу: ${err.message}`);
        }
    }

    async _parseResponse(response) {
        if (!response.ok) {
            const message = await response.text().catch(() => '');
            throw new Error(`Ошибка ${response.status}: ${message}`);
        }
        return response.json();
    }

    getContactInfo(contactId: string) {
        if (!contactId) {
            throw new Error('Не указан идентификатор контакта.');
        }
        return this._makeRequest(`/contacts/${contactId}`, {
            headers: this.headers,
        });
    }

    changeContactInfo(contactId: string, body: any) {
        if (!contactId) {
            throw new Error('Не указан идентификатор контакта.');
        }

        return this._makeRequest(`/contacts/${contactId}`, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify(body),
        });
    }

    getContactFields() {
        return this._makeRequest('/contacts/custom_fields', {
            headers: this.headers,
        });
    }

    getAccessAndRefreshTokens(body: any) {
        return this._makeRequest('https://moma2108.amocrm.ru/oauth2/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
            ,
        }, true);
    }
}

const api = new Api({
    baseUrl: 'https://moma2108.amocrm.ru/api/v4',
    tokenUrl: 'https://moma2108.amocrm.ru',

    headers: {
        Authorization:
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijk3ZmI3NTY4OTljOWM1YzJkYTk2M2IyZDZlNjM1ZTcwOGY1OWM5YjViYWVkMDYxNGVkMTFmMjExMDdkMWJhZGFlY2E0MzgzZTc0YzA0YjU1In0.eyJhdWQiOiJjOTEwZGFhYS04ZjUyLTQ5NjAtYWFlMi1jOWIxZTBhNDEwZGMiLCJqdGkiOiI5N2ZiNzU2ODk5YzljNWMyZGE5NjNiMmQ2ZTYzNWU3MDhmNTljOWI1YmFlZDA2MTRlZDExZjIxMTA3ZDFiYWRhZWNhNDM4M2U3NGMwNGI1NSIsImlhdCI6MTczMzcxODIwNCwibmJmIjoxNzMzNzE4MjA0LCJleHAiOjE3NjcyMjU2MDAsInN1YiI6IjExODYzNDEwIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMyMTA1Njc4LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiMWVlNDc4NWUtYzI4ZS00ZThjLTk4MjQtZWI3NmZiYmM0NTExIiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.qIF9c9Mdcvyhv7PrJDtU5IgTQcvBu_kFPuf-PejSnCuCyRYLF7IT8oBBUIWylf9nVuSynwNtzxdqv1WhVfedl46XUmpGGN4rnmPjLqRYy788UIsyxMH60vLIZUOtihIYNMIeOD6WzKRC15I0jYZmFSDpBT_YyegMTUEW1S0fRptsB-dIMMpSe_2PfLJMjwWbU0nOW7ijnbCvLkBfKfsFPGQHneUCnm9DR8wL0OMK9WXxPWUp7JtRHCqLvczH1jUY2Cjspfs6pi3zt0xzmoaX-you2GhXnfxZUdjTeJS49QEHgaElAJ619N7cK4W5oIrbi2honZ967dUUlHOLZAX9JA',
    },
});
export default api;
