import { sellers } from '../app/shared/mockSellers';
import { User } from '../app/shared/interfaces';

export async function mockLogin(email: string, password: string): Promise<User> {
    const fakeHash = `hashed_${password}`;
    const user = sellers.find((u) => u.email === email && u.passwordHash === fakeHash);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    await new Promise((res) => setTimeout(res, 500));

    return user;
}
