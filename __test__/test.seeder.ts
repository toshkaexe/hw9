
type RegisterUserType = {
    login: string,
    password: string,
    email: string,
    code?: string,
    expirationDate?: Date,
    isConfirmed?: boolean
}


export const testSeeder = {

    createUserDto() {
        return {
            login: "testing",
            email: "test123@gmail.com",
            password: "123456789"
        }
    },

    createUserDtos(count: number) {
        const users = [];
        for (let i = 0; i <= count; i++) {
            users.push({
                login: 'test' + i,
                email: `test${i}@gmail.com`,
                pass: "123456789"
            })
        }
        return users;
    }

}