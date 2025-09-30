import { z } from 'zod';

export const visitSchema = z.object({
    //endereço
    idArea: z.enum(["Microregião A, Microregião B, Microregião C"]),
    estado: z.enum(["AL"]),
    municipio: z.enum(["Maceió"]),
    bairro: z.enum(["Ponta verde, Benedito Bentes, Tabuleiro"]),
    logradouro: z.string().max(40),
    
    //específicos
    numeroImovel: z.number(),
    lado: z.enum(["ìmpar", "par"]),
    categoriaLocalidade: z.enum(["Urbana", "Rural"]),
    tipoImovel: z.enum(["Residencial"]),
    status: z.enum(["Inspecionado", "Pendente"]),
    complemento: z.string().max(50),

    //Registro de controle da dengue
    atividadesRealizadas: z.enum(["LI - Levantamento de Índice", "PE - Ponto estratégico", "T - Tratamento", "DF - Delimitação de foco", "PVE - Pesquisa Vetorial Especial"]),
    //Falta coisa aqui

    //Coleta de amostras
    quantTubitos: z.number(),
    

    //Tratamentos aplicados
    tipoLarvicida: z.string(),
    formaLarvicida: z.string(),
    quantidadeLarvicida: z.number(),
    observacoes: z.string().max(50),

    //upload de arquivos

    arquivo: z.string()

}); 

// export type visitSchema = z.infer<typeof visitSchema>;