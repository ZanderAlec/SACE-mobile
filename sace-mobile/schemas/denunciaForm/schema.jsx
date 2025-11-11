import { z } from 'zod';

export const denunciaSchema = z.object({
    rua_avenida: z.string().min(1, { message: 'Endereço é obrigatório!' }),
    numero: z.coerce.number().int().positive({ message: 'Número deve ser um inteiro positivo!' }),
    bairro: z.string().min(1, { message: 'Bairro é obrigatório!' }),
    tipo_imovel: z.string().min(1, { message: "Tipo de imóvel é obrigatório!" }),
    endereco_complemento: z.string().optional(),
    data_denuncia: z.string().optional(),
    hora_denuncia: z.string().optional(),
    observacoes: z.string().optional(),
    status: z.enum(["Concluída", "Pendente", "Em Análise"], {
        errorMap: () => ({ message: "Selecione um status!" })
    }).optional(),
    agente_responsavel_id: z.coerce.number().int().optional(),
});

