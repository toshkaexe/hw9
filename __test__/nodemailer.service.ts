/*
export const nodemailerService = {


    async registerUser(login: string, pass: string, email: string): Promise‹IUserDB | null > {
    const user = await usersRepository.doesExistByLoginOrEmail(login, email);
    if(user) return null;
    const passwordHash = await bcryptService.generateHash(pass)
    const newUser
:
IUserDB = {
    login, email, passwordhash,
    createdAt: new Date(,
        emailConfirmation
:
{
    confirmationCode: randomUUIDO,
        expirationDate
:
    add(new Date(), {
        hours: 1, minutes: 30,
        isConfirmed: false
        await usersRepository.create(newUser);
        try {
            nodemailerService. sendEmail(newUser.email, newUser.emailConfirmation.confirmationCode,
        } catch(e: unknown) {
            console.error('Send email error', e);
｝
return newUser;
        }*/
