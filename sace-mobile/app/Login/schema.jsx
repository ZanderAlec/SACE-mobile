import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string().min(1, "Login é obrigatório!"),
    password: z.string().min(1, "Senha é obrigatória!"),
});

export default loginSchema;